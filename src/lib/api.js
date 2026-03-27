import { client } from "./neon";


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
            .select('*')
            .eq('username', username)
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

        // Check if person with this username already exists
        const { data: existingPerson, error: checkError } = await client
            .from('people')
            .select('id')
            .eq('username', username)
            .single();
        
        // PGRST116 is the error code for "The result contains 0 rows"
        if (checkError && checkError.code !== 'PGRST116') throw checkError;

        let person;
        
        if (existingPerson) {
            // Person already exists, use existing person
            person = existingPerson;
        } else {
            // Person doesn't exist, create new person
            const { data: personData, error: personError } = await client
                .from('people')
                .insert({ username, name })
                .select();
            if (personError) throw personError;
            person = personData?.[0];
        }

        const { username: _, person_name: __, ...transactionData } = transaction;

        const { data: newTransaction, error: transError } = await client
            .from('transactions')
            .insert({
                person_id: person.id,
                username: username,
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

    createPerson: async ({ name, username }) => {
        const finalUsername = username ? username.toLowerCase().trim() : name.toLowerCase().trim().replace(/\s+/g, '_');

        const { data, error } = await client
            .from('people')
            .insert({ name, username: finalUsername })
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

    updateProfile: async (updates) => {
        const { data, error } = await client.auth.updateUser(updates)
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
        try {
            if (!file) {
                throw new Error('No file provided');
            }

            // Convert file to base64
            const reader = new FileReader();
            return new Promise((resolve, reject) => {
                reader.onload = async () => {
                    try {
                        const base64 = reader.result.split(',')[1];
                        const fileExt = file.name.split('.').pop();
                        const timestamp = Math.floor(Date.now() / 1000);
                        const fileName = `avatar_v${timestamp}.${fileExt}`;

                        // Call backend API to handle upload
                        const response = await fetch('/api/upload', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                action: 'upload',
                                userId,
                                file: base64,
                                fileName,
                            }),
                        });

                        if (!response.ok) {
                            throw new Error('Upload failed');
                        }

                        const result = await response.json();

                        if (!result.url) {
                            throw new Error('No URL returned from upload');
                        }

                        // Update profile with new avatar URL
                        await api.updateProfile(userId, { avatar_url: result.url });

                        resolve(result.url);
                    } catch (error) {
                        console.error('Avatar upload error:', error);
                        reject(error);
                    }
                };
                reader.onerror = () => reject(reader.error);
                reader.readAsDataURL(file);
            });
        } catch (error) {
            console.error('Avatar upload error:', error);
            throw error;
        }
    },

    deleteAvatar: async (userId) => {
        try {
            // Call backend API to handle deletion
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'delete',
                    userId,
                }),
            });

            if (!response.ok) {
                throw new Error('Delete failed');
            }

            // Clear avatar URL from profile
            await api.updateProfile(userId, { avatar_url: null });
        } catch (error) {
            console.error('Avatar deletion error:', error);
            throw error;
        }
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
