"use client";

import { EditCategoryButton } from "./edit-category-button";
import { DeleteCategoryButton } from "./delete-category-button";
import { EmptyState } from "@/components/empty-state";

interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  icon: string;
  color: string;
}

interface CategoryListProps {
  categories: Category[];
  type: "income" | "expense";
}

export function CategoryList({ categories, type }: CategoryListProps) {
  if (categories.length === 0) {
    return (
      <EmptyState
        icon={type === "income" ? "💰" : "💸"}
        title={`Belum Ada Kategori ${type === "income" ? "Pemasukan" : "Pengeluaran"}`}
        description={`Tambahkan kategori ${type === "income" ? "pemasukan" : "pengeluaran"} pertama Anda untuk mulai mengorganisir transaksi dengan lebih baik.`}
      />
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <div
          key={category.id}
          className="group relative flex items-center gap-3 p-4 rounded-xl border-2 hover:shadow-lg transition-all"
          style={{
            borderColor: category.color + "40",
            backgroundColor: category.color + "10"
          }}
        >
          {/* Icon */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
            style={{ backgroundColor: category.color + "30" }}
          >
            {category.icon}
          </div>

          {/* Name */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-800 truncate">
              {category.name}
            </h4>
            <p className="text-xs text-gray-500 capitalize">
              {category.type === "income" ? "Pemasukan" : "Pengeluaran"}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <EditCategoryButton category={category} />
            <DeleteCategoryButton category={category} />
          </div>
        </div>
      ))}
    </div>
  );
}
