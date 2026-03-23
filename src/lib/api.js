import { client } from "./neon";
import blob from './vercel-blob.js';


export const api = {
    // Transactions
    getTransactions: async (limit = 1000) => {
        const { data, error } = await client
            .from('transactions')
            .select('*, people(name, username)')
            .order('created_at', { ascending: false })
            .limit(limit);
        if (error) throw error;
        return data || [];
    },

    // Get limited transactions for dashboard
    getRecentTransactions: async (limit = 5) => {
        return api.getTransactions(limit);
    },

    getTransactionsByPerson: async (username) => {
        const { data, error } = await client
            .from('transactions')
            .select('*, people(name, username)')
            .eq('people.username', username)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    getPersonBalance: async (username) => {
            const txs = await api.getTransactionsByPerson(username);

            return txs.reduce((acc, tx) => {
                const amount = parseFloat(tx.amount);
                if (tx.type === 'lend') return acc + amount;
                if (tx.type === 'borrow') return acc - amount;
                if (tx.type === 'repayment') return acc - amount;
                if (tx.type === 'paid_back') return acc + amount;
                return acc;
            }, 0);
        },
        
    createTransaction: async (userId, transaction) => {
        let username = transaction.username;
        let name = transaction.person_name;

        if (!username && name) {
            username = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
        } else if (username && !name) {
            name = username.split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        }

        username = username ? username.toLowerCase().trim().replace(/[^a-z0-9_]+/g, '_') : 'unknown_user';
        name = name ? name.trim() : username;

        // Upsert person
        const { data: personData, error: personError } = await client
            .from('people')
            .upsert({ user_id: userId, username, name }, { onConflict: ['user_id', 'username'] })
            .select();
        if (personError) throw personError;
        const person = personData?.[0];

        const { username: _, person_name: __, ...transactionData } = transaction;

        const { data: newTransaction, error: transError } = await client
            .from('transactions')
            .insert({
                user_id: userId,
                person_id: person.id,
                person_username: username,
                ...transactionData
            })
            .select();
        if (transError) throw transError;
        return newTransaction?.[0];
    },

    // People
    getPeople: async () => {
        const { data, error } = await client
            .from('people')
            .select('*')
            .order('name', { ascending: true });
        if (error) throw error;
        return data || [];
    },

    getPersonData: async (person_id) => {
        const { data, error } = await client
            .from('transactions')
            .select('*')
            .eq('username', person_id)

        if (error) throw error;
        return data || [];
    },

    createPerson: async (userId, { name, username }) => {
        const finalUsername = username && username.trim() ? username.trim() : name.toLowerCase().trim().replace(/\s+/g, '_');

        const { data, error } = await client
            .from('people')
            .insert({ user_id: userId, name, username: finalUsername })
            .select();
        if (error) throw error;
        return data?.[0];
    },

    // Profiles/People
    getProfile: async (userId) => {
        const { data, error } = await client.auth.getSession()
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    updateProfile: async (userId, updates) => {
        const { data, error } = await client
            .from('profiles')
            .upsert({ user_id: userId, ...updates })
            .select();
        if (error) throw error;
        return data?.[0];
    },

    updateCurrency: async (userId, currency) => {
        const { data, error } = await client
            .from('profiles')
            .update({ currency })
            .eq('user_id', userId)
            .select();
        if (error) throw error;
        return data?.[0];
    },

    uploadAvatar: async (userId, file) => {
        const fileExt = file.name.split('.').pop();
        const timestamp = Math.floor(Date.now() / 1000);
        const fileName = `${userId}/avatar_v${timestamp}.${fileExt}`;

        // Delete old avatar if exists
        const { blobs } = await blob.list({ prefix: `${userId}/` });
        if (blobs.length > 0) {
            await blob.del(blobs.map(b => b.url));
        }

        const { url } = await blob.upload(fileName, file, {
            access: 'public',
        });

        await api.updateProfile(userId, { avatar_url: url });

        return url;
    },

    deleteAvatar: async (userId) => {
        const { blobs } = await blob.list({ prefix: `${userId}/` });
        if (blobs.length > 0) {
            await blob.del(blobs.map(b => b.url));
        }
        await api.updateProfile(userId, { avatar_url: null });
    },

    // Dashboard Aggregates
    getDashboardStats: async (transactions = null) => {
        let data;
        if (transactions) {
            data = transactions;
        } else {
            data = await client.sql`
                SELECT amount, type FROM transactions
            `;
        }

        const stats = data.reduce((acc, curr) => {
            const amount = parseFloat(curr.amount) || 0;
            if (curr.type === 'lend') {
                acc.owedToYou += amount;
            } else if (curr.type === 'borrow') {
                acc.youOwe += amount;
            } else if (curr.type === 'repayment') {
                acc.owedToYou -= amount;
            } else if (curr.type === 'paid_back') {
                acc.youOwe -= amount;
            }
            return acc;
        }, { youOwe: 0, owedToYou: 0 });

        return {
            net: stats.owedToYou - stats.youOwe,
            ...stats
        };
    },

    getChartData: async (transactions = null) => {
        let data;
        if (transactions) {
            data = transactions;
        } else {
            data = await client.sql`
                SELECT amount, type, created_at FROM transactions ORDER BY created_at ASC
            `;
        }
        return api._processChartData(data);
    },

    _processChartData: (transactions) => {
        const monthlyData = transactions.reduce((acc, curr) => {
            const date = new Date(curr.created_at);
            const key = date.toISOString().slice(0, 7);

            if (!acc[key]) {
                acc[key] = {
                    date: key,
                    name: date.toLocaleString('default', { month: 'short' }),
                    amount: 0
                };
            }

            const amount = parseFloat(curr.amount) || 0;

            if (curr.type === 'lend') {
                acc[key].amount += amount;
            } else if (curr.type === 'borrow') {
                acc[key].amount -= amount;
            } else if (curr.type === 'repayment') {
                acc[key].amount -= amount;
            } else if (curr.type === 'paid_back') {
                acc[key].amount += amount;
            }

            return acc;
        }, {});

        return Object.values(monthlyData).sort((a, b) => a.date.localeCompare(b.date));
    },

    deleteTransaction: async (transactionId) => {
        const { error } = await client
            .from('transactions')
            .delete()
            .eq('id', transactionId);
        if (error) throw error;
    },

    deletePerson: async (username) => {
        const { data: personData, error: personError } = await client
            .from('people')
            .select('id')
            .eq('username', username)
            .single();
        if (personError) throw personError;
        if (!personData) throw new Error('Person not found');

        const { error: transError } = await client
            .from('transactions')
            .delete()
            .eq('person_id', personData.id);
        if (transError) throw transError;

        const { error: delError } = await client
            .from('people')
            .delete()
            .eq('id', personData.id);
        if (delError) throw delError;
    },

    updatePersonName: async (username, newName) => {
        const { error } = await client
            .from('people')
            .update({ name: newName })
            .eq('username', username);
        if (error) throw error;
    }
};
