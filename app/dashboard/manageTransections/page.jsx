"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { HiOutlineReceiptRefund } from "react-icons/hi2";
import { DataTable } from "@/components/data-table";
import Loading from "@/app/loading";
import { useGetTransactionsQuery } from "@/app/redux/api/transactionListApi";
import PaymentCell from "@/components/cells/paymentCell/page";
import OrderCell from "@/components/cells/orderCell/page";

// Summary strip 

function TransactionSummary({ data }) {
  const total = data.length;
  const paid = data.filter((d) => d.paymentStatus === "Paid").length;
  const amount = data.reduce((sum, d) => sum + Number(d.amount || 0), 0);

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      {[
        { label: "Orders", value: total, color: "text-white" },
        { label: "Paid", value: paid, color: "text-green-400" },
        {
          label: "Total BDT",
          value: amount.toLocaleString(),
          color: "text-orange-400",
        },
      ].map(({ label, value, color }, i) => (
        <span key={label} className="flex items-center gap-1.5 text-[12px]">
          {i > 0 && <span className="h-3 w-px bg-white/10" />}
          <span className={`font-medium ${color}`}>{value}</span>
          <span className="text-gray-600">{label}</span>
        </span>
      ))}
    </div>
  );
}

// Page 

function MyCarsPage() {
  const { data, isLoading, isError, error } = useGetTransactionsQuery();

  const columns = useMemo(
    () => [
      {
        accessorKey: "transactionId",
        header: "Transaction ID",
        cell: ({ getValue }) => (
          <span className="font-mono text-[12px] text-gray-400">
            {getValue()}
          </span>
        ),
      },
      {
        accessorKey: "carName",
        header: "Car",
        cell: ({ getValue, row }) => (
          <div>
            <p className="font-medium text-white">{getValue()}</p>
            <p className="text-[11px] text-gray-500">
              {row.original.modelName}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ getValue }) => (
          <span className="font-medium text-white">
            {Number(getValue()).toLocaleString()}{" "}
            <span className="text-[11px] font-normal text-gray-600">BDT</span>
          </span>
        ),
      },
      {
        accessorKey: "card_issuer",
        header: "Card Issuer",
        cell: ({ getValue }) => (
          <span className="text-gray-400">{getValue()}</span>
        ),
      },
      {
        accessorKey: "paymentStatus",
        header: "Payment",
        cell: ({ getValue, row }) => (
          <PaymentCell
            getValue={getValue}
            orderData={row.original}
            disabled={true}
          />
        ),
      },
      {
        accessorKey: "orderStatus",
        header: "Status",
        cell: ({ getValue }) => <OrderCell getValue={getValue} />,
      },
    ],
    [],
  );

  if (isLoading) return <Loading message="Loading transactions…" />;

  if (isError) {
    return (
      <div className="mt-10 flex justify-center px-4">
        <p className="text-sm text-red-400">
          {error?.message || "Failed to load data."}
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        className="mb-6"
      >
        <p className="mb-1 text-[11px] uppercase tracking-widest text-gray-600">
          My Account
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-xl font-medium text-white">My Orders</h1>
          {data?.length > 0 && <TransactionSummary data={data} />}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08, ease: [0.25, 0.1, 0.25, 1] }}
        className="border-white/8 overflow-x-auto rounded-xl border"
      >
        {!data?.length ? (
          <div className="flex flex-col items-center gap-2 py-16">
            <HiOutlineReceiptRefund className="h-8 w-8 text-gray-700" />
            <p className="text-sm text-gray-500">No transactions yet.</p>
          </div>
        ) : (
          <DataTable columns={columns} data={data} />
        )}
      </motion.div>

      <p className="mt-3 text-center text-xs text-gray-700 sm:hidden">
        Scroll right to see more →
      </p>
    </div>
  );
}

export default MyCarsPage;
