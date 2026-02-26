export const DEMO_USER = {
    id: "demo-user",
    email: "demo@example.com",
    full_name: "Demo User",
};

export const DEMO_TRANSACTIONS = [
    {
        id: "1",
        amount: 5000000,
        type: "income",
        category_id: "income-1",
        date: new Date().toISOString().split("T")[0],
        description: "Gaji Bulanan",
        categories: { name: "Gaji", icon: "💰", color: "#10b981" }
    },
    {
        id: "2",
        amount: 1500000,
        type: "expense",
        category_id: "expense-1",
        date: new Date().toISOString().split("T")[0],
        description: "Belanja Bulanan",
        categories: { name: "Belanja", icon: "🛒", color: "#f59e0b" }
    },
    {
        id: "3",
        amount: 200000,
        type: "expense",
        category_id: "expense-2",
        date: new Date().toISOString().split("T")[0],
        description: "Makan di Luar",
        categories: { name: "Makanan", icon: "🍔", color: "#ef4444" }
    },
    {
        id: "4",
        amount: 500000,
        type: "expense",
        category_id: "expense-3",
        date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
        description: "Bensin",
        categories: { name: "Transportasi", icon: "🚗", color: "#3b82f6" }
    },
    {
        id: "5",
        amount: 1000000,
        type: "income",
        category_id: "income-2",
        date: new Date(Date.now() - 172800000).toISOString().split("T")[0],
        description: "Freelance Project",
        categories: { name: "Project", icon: "💻", color: "#8b5cf6" }
    }
];

export const DEMO_ALERTS = [
    {
        id: "1",
        alert_message: "Pengeluaran Makanan sudah mencapai 80% dari budget!",
        current_spending: 800000,
        budget_limit: 1000000,
        is_read: false,
        created_at: new Date().toISOString(),
        budget_plans: {
            period_type: "monthly",
            categories: { name: "Makanan", icon: "🍔" }
        }
    },
    {
        id: "2",
        alert_message: "Budget Transportasi hampir habis!",
        current_spending: 450000,
        budget_limit: 500000,
        is_read: false,
        created_at: new Date().toISOString(),
        budget_plans: {
            period_type: "monthly",
            categories: { name: "Transportasi", icon: "🚗" }
        }
    }
];
