"use client";

import { motion } from "framer-motion";
import { DataTable } from "@/components/data-table";
import { useGetOrdersQuery } from "../../redux/api/orderListApi";
import Loading from "@/app/loading";

//  Status configs

const PAYMENT_STYLES = {
  Paid: "bg-green-500/15 text-green-400 border-green-500/20",
  default: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
};

const ORDER_STYLES = {
  Processing: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Delivered: "bg-green-500/15 text-green-400 border-green-500/20",
  Cancelled: "bg-red-500/15 text-red-400 border-red-500/20",
  default: "bg-white/8 text-gray-400 border-white/10",
};

function StatusPill({ value, styleMap }) {
  const cls = styleMap[value] ?? styleMap.default;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${cls}`}
    >
      {value}
    </span>
  );
}

//  Column definitions

const columns = [
  {
    accessorKey: "buyerName",
    header: "Buyer",
    cell: ({ getValue }) => (
      <span className="font-medium text-white">{getValue()}</span>
    ),
  },
  {
    accessorKey: "buyerEmail",
    header: "Email",
    cell: ({ getValue }) => <span className="text-gray-400">{getValue()}</span>,
  },
  {
    accessorKey: "carName",
    header: "Car",
    cell: ({ getValue }) => <span className="text-gray-300">{getValue()}</span>,
  },
  {
    accessorKey: "brand",
    header: "Brand",
    cell: ({ getValue }) => <span className="text-gray-400">{getValue()}</span>,
  },
  {
    accessorKey: "modelName",
    header: "Model",
    cell: ({ getValue }) => <span className="text-gray-400">{getValue()}</span>,
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment",
    cell: ({ getValue }) => (
      <StatusPill value={getValue()} styleMap={PAYMENT_STYLES} />
    ),
  },
  {
    accessorKey: "orderStatus",
    header: "Status",
    cell: ({ getValue }) => (
      <StatusPill value={getValue()} styleMap={ORDER_STYLES} />
    ),
  },
];

//  Summary counts

function OrderSummary({ orders }) {
  const paid = orders.filter((o) => o.paymentStatus === "Paid").length;
  const delivered = orders.filter((o) => o.orderStatus === "Delivered").length;
  const cancelled = orders.filter((o) => o.orderStatus === "Cancelled").length;

  const stats = [
    { label: "Total", value: orders.length, color: "text-white" },
    { label: "Paid", value: paid, color: "text-green-400" },
    { label: "Delivered", value: delivered, color: "text-green-400" },
    { label: "Cancelled", value: cancelled, color: "text-red-400" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      {stats.map(({ label, value, color }, i) => (
        <span key={label} className="flex items-center gap-1.5 text-[12px]">
          {i > 0 && <span className="h-3 w-px bg-white/10" />}
          <span className={`font-medium ${color}`}>{value}</span>
          <span className="text-gray-600">{label}</span>
        </span>
      ))}
    </div>
  );
}

//  Page─

export default function ManageOrderPage() {
  const { data: orderData, isLoading, isError, error } = useGetOrdersQuery();

  if (isLoading) return <Loading message="Loading orders…" />;

  if (isError) {
    return (
      <div className="mt-10 flex justify-center px-4">
        <p className="text-sm text-red-400">
          {error?.message || "Something went wrong."}
        </p>
      </div>
    );
  }

  if (!orderData?.length) {
    return (
      <div className="mt-10 flex justify-center px-4">
        <p className="text-sm text-gray-500">No orders found.</p>
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
          Management
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-xl font-medium text-white">Orders</h1>
          <OrderSummary orders={orderData} />
        </div>
      </motion.div>

      {/* Table wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08, ease: [0.25, 0.1, 0.25, 1] }}
        className="border-white/8 overflow-x-auto rounded-xl border"
      >
        <DataTable columns={columns} data={orderData} />
      </motion.div>

      <p className="mt-3 text-center text-xs text-gray-700 sm:hidden">
        Scroll right to see more →
      </p>
    </div>
  );
}
