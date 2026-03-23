import { api } from './api';

export const dashboardLoader = async () => {
    // Fetch all transactions once, then calculate stats and chart data from it
    const transactions = await api.getTransactions();
    
    // Pass transactions to avoid re-fetching
    const [stats, chartData] = await Promise.all([
        api.getDashboardStats(transactions),
        api.getChartData(transactions)
    ]);
    
    // Return only recent transactions for display
    const recentTransactions = transactions.slice(0, 5);
    
    return { transactions: recentTransactions, stats, chartData };
};

export const peopleLoader = async () => {
    const [allPeople, transactions] = await Promise.all([
        api.getPeople(),
        api.getTransactions()
    ]);

    // Initialize map with all people
    const peopleMap = {};

    // 1. Add all existing people to the map with balance 0
    allPeople.forEach(person => {
        peopleMap[person.username] = {
            id: person.id,
            name: person.name,
            username: person.username,
            balance: 0,
        };
    });

    // 2. Process transactions to calculate balances
    transactions.forEach(tx => {
        const username = tx.people?.username;
        const amount = parseFloat(tx.amount) || 0;

        // Only process if username exists
        if (!username) return;

        // Ensure person exists in map
        if (!peopleMap[username]) {
            peopleMap[username] = {
                id: tx.people?.id || username,
                name: tx.people?.name || username,
                username: username,
                balance: 0,
            };
        }

        // Calculate balance based on transaction type
        if (tx.type === 'lend') {
            // You lent money - they owe you
            peopleMap[username].balance += amount;
        } else if (tx.type === 'borrow') {
            // You borrowed money - you owe them
            peopleMap[username].balance -= amount;
        } else if (tx.type === 'repayment') {
            // They're repaying what they owe
            peopleMap[username].balance -= amount;
        } else if (tx.type === 'paid_back') {
            // You're paying back what you owe
            peopleMap[username].balance += amount;
        }
    });

    return Object.values(peopleMap);
};

export const personDetailsLoader = async ({ params }) => {
    const { username } = params;
    const user_id = decodeURIComponent(username);
    const txs = await api.getTransactionsByPerson(user_id);

    // Set display name from first transaction or username
    let personName = user_id;
    if (txs.length > 0) {
        personName = txs[0].people?.name || user_id;
    }

    // Calculate balance for this specific person
    let balance = 0;
    balance = await api.getPersonBalance(username)

    return { transactions: txs, balance, personName, username };
};

export const transactionsLoader = async () => {
    return await api.getTransactions();
};
