"use client";

import { ReactNode } from "react";
import { ErrorBoundary } from "@/components/error-boundary";

interface DashboardWrapperProps {
  children: ReactNode;
}

export function DashboardWrapper({ children }: DashboardWrapperProps) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
