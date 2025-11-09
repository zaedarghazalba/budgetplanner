"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/hooks/use-toast";
import { ErrorHandler } from "@/lib/error-handler";

interface Alert {
  id: string;
  alert_message: string;
  current_spending: number;
  budget_limit: number;
  is_read: boolean;
  created_at: string;
  budget_plans: {
    period_type: string;
    categories?: {
      name: string;
      icon: string;
    };
  };
}

interface BudgetAlertsCardProps {
  alerts: Alert[];
}

export function BudgetAlertsCard({ alerts }: BudgetAlertsCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  const [loadingAlertId, setLoadingAlertId] = useState<string | null>(null);

  const unreadAlerts = alerts.filter(a => !a.is_read);
  const criticalAlerts = alerts.filter(a => {
    const percentage = (Number(a.current_spending) / Number(a.budget_limit)) * 100;
    return percentage >= 100;
  });

  const handleMarkAsRead = async (alertId: string) => {
    setLoadingAlertId(alertId);

    try {
      const { error } = await supabase
        .from("budget_alerts")
        .update({ is_read: true })
        .eq("id", alertId);

      if (error) throw error;

      toast({
        title: "Alert Ditandai Dibaca",
        description: "Alert berhasil ditandai sebagai sudah dibaca.",
      });

      router.refresh();
    } catch (error) {
      console.error("Error marking alert as read:", error);
      toast(ErrorHandler.getToastConfig(error));
    } finally {
      setLoadingAlertId(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadAlerts.length === 0) return;

    setLoadingAlertId("all");

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("budget_alerts")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false);

      if (error) throw error;

      toast({
        title: "Semua Alert Ditandai Dibaca",
        description: `${unreadAlerts.length} alert berhasil ditandai sebagai sudah dibaca.`,
      });

      router.refresh();
    } catch (error) {
      console.error("Error marking all alerts as read:", error);
      toast(ErrorHandler.getToastConfig(error));
    } finally {
      setLoadingAlertId(null);
    }
  };

  if (alerts.length === 0) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <CardTitle className="text-lg font-bold text-green-700">
                Budget Alerts
              </CardTitle>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              0 Alert
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-3" />
            <p className="text-sm text-green-700 font-medium">
              Semua budget Anda terkendali! 🎉
            </p>
            <p className="text-xs text-green-600 mt-1">
              Tidak ada peringatan budget saat ini
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <CardTitle className="text-lg font-bold text-orange-700">
              Budget Alerts
            </CardTitle>
          </div>
          <div className="flex gap-2 items-center">
            {unreadAlerts.length > 0 && (
              <>
                <Badge variant="destructive" className="bg-red-500">
                  {unreadAlerts.length} Baru
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  disabled={loadingAlertId !== null}
                  className="text-xs h-7"
                >
                  {loadingAlertId === "all" ? "..." : "Tandai Semua Dibaca"}
                </Button>
              </>
            )}
            {criticalAlerts.length > 0 && (
              <Badge variant="destructive" className="bg-orange-500">
                {criticalAlerts.length} Kritis
              </Badge>
            )}
          </div>
        </div>
        <CardDescription className="text-orange-600">
          {alerts.length} peringatan budget aktif
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {alerts.slice(0, 5).map((alert) => {
            const category = alert.budget_plans.categories as unknown as { name: string; icon: string } | null;
            const percentage = (Number(alert.current_spending) / Number(alert.budget_limit)) * 100;
            const isCritical = percentage >= 100;

            return (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border-l-4 relative ${
                  isCritical
                    ? "bg-red-50 border-red-500"
                    : "bg-orange-50 border-orange-500"
                } ${!alert.is_read ? "ring-2 ring-orange-200" : ""}`}
              >
                {/* Dismiss button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleMarkAsRead(alert.id)}
                  disabled={loadingAlertId === alert.id}
                  className="absolute top-2 right-2 h-6 w-6 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </Button>

                <div className="flex items-start justify-between gap-2 pr-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {category && (
                        <span className="text-lg">
                          {category.icon}
                        </span>
                      )}
                      <p className="text-sm font-medium text-gray-900">
                        {category?.name || "Budget Keseluruhan"}
                      </p>
                      <Badge
                        variant="outline"
                        className="text-xs"
                      >
                        {alert.budget_plans.period_type === "weekly" ? "Mingguan" : "Bulanan"}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      {alert.alert_message}
                    </p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-gray-500">
                        Pengeluaran: <span className="font-semibold text-red-600">
                          Rp {Number(alert.current_spending).toLocaleString("id-ID")}
                        </span>
                      </span>
                      <span className="text-gray-400">/</span>
                      <span className="text-gray-500">
                        Budget: <span className="font-semibold">
                          Rp {Number(alert.budget_limit).toLocaleString("id-ID")}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      isCritical ? "text-red-600" : "text-orange-600"
                    }`}>
                      {Math.round(percentage)}%
                    </div>
                    {!alert.is_read && (
                      <Badge variant="secondary" className="text-xs mt-1 bg-blue-100 text-blue-700">
                        Baru
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {alerts.length > 5 && (
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500">
              +{alerts.length - 5} alert lainnya
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
