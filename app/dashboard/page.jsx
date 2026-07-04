"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  HiOutlinePlus,
  HiOutlineChartBar,
  HiOutlineInbox,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCube,
  HiOutlineReceiptRefund,
  HiOutlineUserCircle,
} from "react-icons/hi2";
import { PiCarLight } from "react-icons/pi";
import useCurrentUser from "@/hooks/useCurrentUser";
import Loading from "@/app/loading";

const STATS = [
  { id: "listings", label: "Active listings", value: 148, icon: PiCarLight },
  {
    id: "inquiries",
    label: "Open inquiries",
    value: 23,
    icon: HiOutlineChatBubbleLeftRight,
  },
  { id: "inventory", label: "In inventory", value: 312, icon: HiOutlineCube },
];

const ACTIONS = [
  {
    icon: HiOutlinePlus,
    title: "New listing",
    desc: "Add a vehicle to your active inventory",
    href: "dashboard/manageCars",
  },
  {
    icon: HiOutlineChartBar,
    title: "Sales report",
    desc: "Track revenue, volume, and conversion",
    href: "dashboard/analytics",
  },
  {
    icon: HiOutlineInbox,
    title: "Inquiries",
    desc: "Review and respond to buyer messages",
    href: "dashboard/manageTransections",
  },
  {
    icon: HiOutlineTruck,
    title: "Manage Orders",
    desc: "Monitor stock levels in real time",
    href: "/manageOrders",
  },
];

const USER_LINKS = [
  {
    icon: PiCarLight,
    title: "Browse cars",
    desc: "Explore our full vehicle catalogue",
    href: "/cars",
  },
  {
    icon: HiOutlineReceiptRefund,
    title: "My orders",
    desc: "View your purchase history and status",
    href: "dashboard/manageTransections",
  },
  {
    icon: HiOutlineUserCircle,
    title: "My profile",
    desc: "Update your name, photo and details",
    href: "dashboard/profile",
  },
];

function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return count;
}

function StatCard({ stat, index }) {
  const count = useCountUp(stat.value);
  const Icon = stat.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.08,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="rounded-xl bg-white/5 px-4 py-4"
    >
      <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
        <Icon className="h-3.5 w-3.5" />
        {stat.label}
      </div>
      <div className="text-2xl font-medium text-white">
        {count.toLocaleString()}
      </div>
    </motion.div>
  );
}

function ActionCard({ action, index }) {
  const Icon = action.icon;
  return (
    <motion.a
      href={action.href}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.35,
        delay: index * 0.06,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="border-white/8 hover:bg-white/8 flex items-start gap-3 rounded-xl border bg-white/5 px-4 py-4 transition-colors hover:border-white/15"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/15">
        <Icon className="h-4.5 w-4.5 text-orange-400" />
      </div>
      <div>
        <p className="mb-0.5 text-sm font-medium text-white">{action.title}</p>
        <p className="text-xs leading-relaxed text-gray-500">{action.desc}</p>
      </div>
    </motion.a>
  );
}

function LiveDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
    </span>
  );
}

function SectionLabel({ children, live = false }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="text-[11px] uppercase tracking-widest text-gray-600">
        {children}
      </span>
      {live && <LiveDot />}
      <span className="bg-white/8 h-px flex-1" />
    </div>
  );
}

function AdminDashboard({ user }) {
  return (
    <div className="px-6 py-8 text-white">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="mb-6"
      >
        <p className="mb-1 text-[11px] uppercase tracking-widest text-gray-600">
          Overview
        </p>
        <h1 className="mb-2 text-3xl font-medium leading-tight">
          Welcome to <span className="text-orange-400">AutoEmpire</span>
        </h1>
        <p className="max-w-lg text-[15px] leading-relaxed text-gray-400">
          Your command center for vehicle listings, sales, and fleet operations
          — everything in one place.
        </p>
      </motion.div>

      <div className="mb-6">
        <SectionLabel live>Live metrics</SectionLabel>
        <div className="grid grid-cols-3 gap-3">
          {STATS.map((stat, i) => (
            <StatCard key={stat.id} stat={stat} index={i} />
          ))}
        </div>
      </div>

      <div className="mb-6">
        <SectionLabel>Quick actions</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          {ACTIONS.map((action, i) => (
            <ActionCard key={action.title} action={action} index={i} />
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="border-white/8 flex items-start gap-3 border-t pt-5"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500/15">
          <HiOutlineShieldCheck className="h-5 w-5 text-orange-400" />
        </div>
        <div>
          <p className="mb-1 text-sm font-medium text-white">
            About AutoEmpire
          </p>
          <p className="text-[13px] leading-relaxed text-gray-500">
            Founded to transform how vehicles are bought, sold, and managed —
            our technology-first platform gives dealerships, sellers, and fleet
            operators the speed and insight to stay ahead.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function UserDashboard({ user }) {
  return (
    <div className="px-6 py-8 text-white">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="mb-8"
      >
        <p className="mb-1 text-[11px] uppercase tracking-widest text-gray-600">
          Dashboard
        </p>
        <h1 className="mb-2 text-2xl font-medium leading-tight">
          Hey,{" "}
          <span className="capitalize text-orange-400">
            {user?.userName || "there"}
          </span>{" "}
          👋
        </h1>
        <p className="max-w-md text-[15px] leading-relaxed text-gray-400">
          Welcome to AutoEmpire. Browse vehicles, track your orders, and manage
          your account below.
        </p>
      </motion.div>

      <div className="mb-8">
        <SectionLabel>Quick access</SectionLabel>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {USER_LINKS.map((link, i) => (
            <ActionCard key={link.title} action={link} index={i} />
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="border-white/8 rounded-xl border bg-white/5 p-5"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500/15">
            <HiOutlineShieldCheck className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-white">
              About AutoEmpire
            </p>
            <p className="text-[13px] leading-relaxed text-gray-500">
              We specialize in premium vehicle management and sales. Whether
              you&#39;re browsing top-tier listings or tracking a recent
              purchase, our platform puts everything you need in one place.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, isLoading, isError, error } = useCurrentUser();

  if (isLoading) return <Loading message="Loading..." />;
  if (isError)
    return (
      <p className="p-6 text-sm text-red-400">
        {error?.message || "Failed to load."}
      </p>
    );

  const isAdmin = user?.userRole === "admin";
  return isAdmin ? (
    <AdminDashboard user={user} />
  ) : (
    <UserDashboard user={user} />
  );
}
