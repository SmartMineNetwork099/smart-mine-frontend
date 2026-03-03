// ✅ File 3: app/(your-path)/checkout/components/WithdrawHistory.tsx
"use client";
import React from "react";
import Card from "@/components/Card";
import type { HistoryItem } from "./MyIncomeCard";

type Props = {
  items: HistoryItem[];
};

const WithdrawHistory = ({ items }: Props) => {
  if (!items?.length) return null;

  return (
    <Card className="max-w-4xl mx-auto p-6 mt-4">
      <h2 className="text-green-500 text-lg font-semibold mb-2">History</h2>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between px-3 py-2 bg-neutral-800 rounded text-white"
          >
            <span className="text-sm">
              {item.date} ({item.type})
            </span>
            <span className="text-md">$ {item.amount}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default WithdrawHistory;