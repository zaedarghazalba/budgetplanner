"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Category {
  id: string;
  name: string;
  icon: string;
  type: "income" | "expense";
}

interface TransactionFiltersProps {
  categories: Category[];
}

export function TransactionFilters({ categories }: TransactionFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    type: searchParams.get("type") || "all",
    category: searchParams.get("category") || "all",
    dateFrom: searchParams.get("dateFrom") || "",
    dateTo: searchParams.get("dateTo") || "",
  });

  useEffect(() => {
    setFilters({
      search: searchParams.get("search") || "",
      type: searchParams.get("type") || "all",
      category: searchParams.get("category") || "all",
      dateFrom: searchParams.get("dateFrom") || "",
      dateTo: searchParams.get("dateTo") || "",
    });
  }, [searchParams]);

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (filters.search) params.set("search", filters.search);
    if (filters.type !== "all") params.set("type", filters.type);
    if (filters.category !== "all") params.set("category", filters.category);
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.set("dateTo", filters.dateTo);

    router.push(`/dashboard/transactions?${params.toString()}`);
    setOpen(false);
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      type: "all",
      category: "all",
      dateFrom: "",
      dateTo: "",
    });
    router.push("/dashboard/transactions");
    setOpen(false);
  };

  const hasActiveFilters =
    filters.search ||
    filters.type !== "all" ||
    filters.category !== "all" ||
    filters.dateFrom ||
    filters.dateTo;

  // Filter categories based on selected type
  const filteredCategories = filters.type === "all"
    ? categories
    : categories.filter(c => c.type === filters.type);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Cari transaksi..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                applyFilters();
              }
            }}
            className="pl-10"
          />
          {filters.search && (
            <button
              onClick={() => {
                setFilters({ ...filters, search: "" });
                const params = new URLSearchParams(searchParams);
                params.delete("search");
                router.push(`/dashboard/transactions?${params.toString()}`);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Button (Mobile & Desktop) */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2 relative">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Transaksi</SheetTitle>
              <SheetDescription>
                Filter transaksi berdasarkan kriteria di bawah
              </SheetDescription>
            </SheetHeader>

            <div className="grid gap-4 py-6">
              {/* Type Filter */}
              <div className="space-y-2">
                <Label>Tipe Transaksi</Label>
                <Select
                  value={filters.type}
                  onValueChange={(value) => {
                    setFilters({ ...filters, type: value, category: "all" });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tipe</SelectItem>
                    <SelectItem value="income">💰 Pemasukan</SelectItem>
                    <SelectItem value="expense">💸 Pengeluaran</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <Label>Kategori</Label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => setFilters({ ...filters, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {filteredCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <Label>Dari Tanggal</Label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Sampai Tanggal</Label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                />
              </div>

              {/* Active Filters Summary */}
              {hasActiveFilters && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-2">Filter Aktif:</p>
                  <div className="space-y-1 text-xs text-blue-700">
                    {filters.search && (
                      <div>• Pencarian: "{filters.search}"</div>
                    )}
                    {filters.type !== "all" && (
                      <div>• Tipe: {filters.type === "income" ? "Pemasukan" : "Pengeluaran"}</div>
                    )}
                    {filters.category !== "all" && (
                      <div>• Kategori: {categories.find(c => c.id === filters.category)?.name}</div>
                    )}
                    {filters.dateFrom && (
                      <div>• Dari: {filters.dateFrom}</div>
                    )}
                    {filters.dateTo && (
                      <div>• Sampai: {filters.dateTo}</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={resetFilters}
                className="flex-1"
                disabled={!hasActiveFilters}
              >
                Reset
              </Button>
              <Button
                onClick={applyFilters}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                Terapkan
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filters Badge (Desktop) */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Filter aktif:</span>
          {filters.type !== "all" && (
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
              {filters.type === "income" ? "Pemasukan" : "Pengeluaran"}
              <button
                onClick={() => {
                  setFilters({ ...filters, type: "all" });
                  const params = new URLSearchParams(searchParams);
                  params.delete("type");
                  router.push(`/dashboard/transactions?${params.toString()}`);
                }}
                className="hover:text-blue-900"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {filters.category !== "all" && (
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
              {categories.find(c => c.id === filters.category)?.name}
              <button
                onClick={() => {
                  setFilters({ ...filters, category: "all" });
                  const params = new URLSearchParams(searchParams);
                  params.delete("category");
                  router.push(`/dashboard/transactions?${params.toString()}`);
                }}
                className="hover:text-blue-900"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {(filters.dateFrom || filters.dateTo) && (
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
              {filters.dateFrom && filters.dateTo
                ? `${filters.dateFrom} - ${filters.dateTo}`
                : filters.dateFrom
                ? `Dari ${filters.dateFrom}`
                : `Sampai ${filters.dateTo}`}
              <button
                onClick={() => {
                  setFilters({ ...filters, dateFrom: "", dateTo: "" });
                  const params = new URLSearchParams(searchParams);
                  params.delete("dateFrom");
                  params.delete("dateTo");
                  router.push(`/dashboard/transactions?${params.toString()}`);
                }}
                className="hover:text-blue-900"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          <button
            onClick={resetFilters}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Reset semua
          </button>
        </div>
      )}
    </div>
  );
}
