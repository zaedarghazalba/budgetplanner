import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon | string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {/* Icon/Emoji */}
      <div className="relative mb-6">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full blur-2xl opacity-50 scale-150" />

        {/* Icon container */}
        <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full p-8 shadow-lg border border-blue-100">
          {typeof Icon === "string" ? (
            <span className="text-6xl animate-bounce">{Icon}</span>
          ) : (
            <Icon className="h-16 w-16 text-blue-600" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md space-y-3">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>

      {/* Action or Custom Content */}
      {action && (
        <Button
          onClick={action.onClick}
          className="mt-6 gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
        >
          {action.label}
        </Button>
      )}

      {children && <div className="mt-6">{children}</div>}

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-75" />
      <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-indigo-400 rounded-full animate-pulse opacity-50" />
    </div>
  );
}
