"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  HiOutlinePencilSquare,
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineShieldCheck,
} from "react-icons/hi2";
import Loading from "@/app/loading";
import { Button } from "../../../components/ui/button";
import useCurrentUser from "@/hooks/useCurrentUser";

const FIELD_MAP = [
  { icon: HiOutlineUser, label: "Name", key: "userName", capitalize: true },
  {
    icon: HiOutlineEnvelope,
    label: "Email",
    key: "userEmail",
    capitalize: false,
  },
  {
    icon: HiOutlineShieldCheck,
    label: "Role",
    key: "userRole",
    capitalize: true,
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export default function ProfilePage() {
  const { user, isLoading, isError, error } = useCurrentUser();

  if (isLoading) return <Loading message="Loading user data…" />;
  if (isError) {
    return (
      <div className="mt-10 flex justify-center px-4">
        <p className="text-sm text-red-400">
          {error?.message || "Failed to load user data."}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10 flex justify-center px-4 pb-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg"
      >
        {/* Eyebrow */}
        <motion.p
          variants={itemVariants}
          className="mb-2 text-[11px] uppercase tracking-widest text-gray-600"
        >
          Account
        </motion.p>

        {/* Card */}
        <motion.div
          variants={itemVariants}
          className="border-white/8 rounded-2xl border bg-white/5 p-6 sm:p-8"
        >
          {/* Avatar + name row */}
          <div className="mb-6 flex items-center gap-4">
            {user.userPhoto ? (
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-orange-500/30">
                <Image
                  src={user.userPhoto}
                  alt={`${user.userName}'s photo`}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-orange-500/15 ring-2 ring-orange-500/20">
                <HiOutlineUser className="h-7 w-7 text-orange-400" />
              </div>
            )}
            <div>
              <p className="text-[11px] uppercase tracking-widest text-gray-600">
                Profile
              </p>
              <h1 className="mt-0.5 text-lg font-medium capitalize text-white">
                {user.userName}
              </h1>
            </div>
          </div>

          {/* Divider */}
          <div className="bg-white/8 mb-5 h-px" />

          {/* Fields */}
          <div className="space-y-4">
            {FIELD_MAP.map(({ icon: Icon, label, key, capitalize }) => (
              <motion.div
                key={key}
                variants={itemVariants}
                className="flex items-start gap-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5">
                  <Icon className="h-4 w-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-gray-600">
                    {label}
                  </p>
                  <p
                    className={`mt-0.5 text-sm text-white ${capitalize ? "capitalize" : ""}`}
                  >
                    {user[key]}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Divider */}
          <div className="bg-white/8 my-6 h-px" />

          {/* Action */}
          <div className="flex justify-end">
            <Link href="/dashboard/updateProfile">
              <Button
                variant="update"
                className="flex items-center gap-2 rounded-lg border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-400 transition-colors hover:bg-orange-500 hover:text-white"
              >
                <HiOutlinePencilSquare className="h-4 w-4" />
                Edit profile
              </Button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
