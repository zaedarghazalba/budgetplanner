"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ArrowUpIcon, ArrowDownIcon, TrendingUp, Wallet } from "lucide-react";
import { ExpenseChartWrapper } from "@/components/charts/expense-chart-wrapper";
import { RecentTransactions } from "@/components/transactions/recent-transactions";
import { BudgetAlertsCard } from "@/components/dashboard/budget-alerts-card";
import { DEMO_TRANSACTIONS, DEMO_ALERTS } from "@/lib/demo-data";
import { useState, useEffect } from "react";

export default function DemoPage() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    const transactions = DEMO_TRANSACTIONS;
    const budgetAlerts = DEMO_ALERTS;

    // Calculate totals
    const totalIncome = transactions
        ?.filter((t) => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

    const totalExpense = transactions
        ?.filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

    const balance = totalIncome - totalExpense;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 -m-3 sm:-m-4 md:-m-6 mb-4 sm:mb-6 p-4 sm:p-6 rounded-lg shadow-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard Demo</h1>
                        <p className="text-blue-100 mt-1 text-sm sm:text-base">
                            Ringkasan keuangan bulan {new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })} (Simulasi)
                        </p>
                    </div>
                </div>
            </div>

            {/* Budget Alerts */}
            <BudgetAlertsCard alerts={budgetAlerts as any || []} />

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-cyan-50 to-blue-50 hover:shadow-xl transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-cyan-700">Total Pemasukan</CardTitle>
                        <div className="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center">
                            <ArrowUpIcon className="h-5 w-5 text-cyan-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-cyan-600">
                            {formatCurrency(totalIncome)}
                        </div>
                        <p className="text-xs text-cyan-600/70 font-medium mt-1">Bulan ini</p>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-50 to-rose-50 hover:shadow-xl transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-pink-700">Total Pengeluaran</CardTitle>
                        <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
                            <ArrowDownIcon className="h-5 w-5 text-pink-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-pink-600">
                            {formatCurrency(totalExpense)}
                        </div>
                        <p className="text-xs text-pink-600/70 font-medium mt-1">Bulan ini</p>
                    </CardContent>
                </Card>

                <Card className={`border-0 shadow-lg hover:shadow-xl transition-shadow ${balance >= 0 ? "bg-gradient-to-br from-blue-50 to-indigo-50" : "bg-gradient-to-br from-violet-50 to-purple-50"}`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className={`text-sm font-medium ${balance >= 0 ? "text-blue-700" : "text-violet-700"}`}>Saldo</CardTitle>
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${balance >= 0 ? "bg-blue-100" : "bg-violet-100"}`}>
                            <Wallet className={`h-5 w-5 ${balance >= 0 ? "text-blue-600" : "text-violet-600"}`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${balance >= 0 ? "text-blue-600" : "text-violet-600"}`}>
                            {formatCurrency(balance)}
                        </div>
                        <p className={`text-xs font-medium mt-1 ${balance >= 0 ? "text-blue-600/70" : "text-violet-600/70"}`}>
                            {balance >= 0 ? "Surplus" : "Defisit"}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50 hover:shadow-xl transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-purple-700">Transaksi</CardTitle>
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-purple-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">
                            {transactions?.length || 0}
                        </div>
                        <p className="text-xs text-purple-600/70 font-medium mt-1">Total transaksi</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts & Recent Transactions */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Grafik Keuangan</CardTitle>
                        <CardDescription>Pemasukan vs Pengeluaran bulan ini</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ExpenseChartWrapper transactions={transactions as any || []} />
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Transaksi Terakhir</CardTitle>
                        <CardDescription>5 transaksi terbaru (Simulasi)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RecentTransactions transactions={transactions as any || []} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
