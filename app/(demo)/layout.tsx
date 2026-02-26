import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { DashboardWrapper } from "@/components/dashboard-wrapper";
import { DEMO_USER } from "@/lib/demo-data";

export default function DemoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-screen flex">
            {/* Sidebar - we might need to modify this to handle demo links */}
            <aside className="w-64 hidden md:block">
                <Sidebar userProfile={{ email: DEMO_USER.email || "", full_name: DEMO_USER.full_name || "Demo User" }} />
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header user={DEMO_USER} />
                <main className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-3 sm:p-4 md:p-6">
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
                        <p className="font-bold">Mode Demo</p>
                        <p>Anda sedang mencoba aplikasi dalam mode demo. Data yang Anda lihat adalah data simulasi dan tidak akan disimpan secara permanen.</p>
                    </div>
                    <DashboardWrapper>{children}</DashboardWrapper>
                </main>
            </div>
        </div>
    );
}
