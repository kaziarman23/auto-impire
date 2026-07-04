"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  HiOutlineUser,
  HiOutlineShieldCheck,
  HiOutlineArrowUp,
  HiOutlineArrowDown,
} from "react-icons/hi2";
import {
  useDemoteUserRoleMutation,
  useGetUsersQuery,
  usePromoteUserRoleMutation,
} from "../../redux/api/usersApi";
import useToast from "../../../components/Shared/useCustomToast";
import Loading from "@/app/loading";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  },
};

function RoleBadge({ role }) {
  const isAdmin = role === "admin";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${
        isAdmin
          ? "bg-orange-500/15 text-orange-400"
          : "bg-white/8 text-gray-400"
      }`}
    >
      {isAdmin ? (
        <HiOutlineShieldCheck className="h-3 w-3" />
      ) : (
        <HiOutlineUser className="h-3 w-3" />
      )}
      {role}
    </span>
  );
}

function UserAvatar({ src, name }) {
  if (src) {
    return (
      <div className="relative h-9 w-9 overflow-hidden rounded-full ring-1 ring-white/10">
        <Image
          src={src}
          fill
          alt={`${name}'s photo`}
          className="object-cover"
        />
      </div>
    );
  }
  return (
    <div className="bg-white/8 flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-white/10">
      <HiOutlineUser className="h-4 w-4 text-gray-500" />
    </div>
  );
}

function ConfirmDialog({
  trigger,
  title,
  description,
  actionLabel,
  actionClass,
  onConfirm,
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="border border-white/10 bg-[#0f1117] text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-500">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className={actionClass}>
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function UsersPage() {
  const { showSuccess, showError } = useToast();

  const {
    data: usersData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetUsersQuery();
  const [promoteUserRole] = usePromoteUserRoleMutation();
  const [demoteUserRole] = useDemoteUserRoleMutation();

  if (isLoading) return <Loading message="Loading users…" />;
  if (isError) {
    return (
      <div className="mt-10 flex justify-center px-4">
        <p className="text-sm text-red-400">
          {error?.message || "Something went wrong."}
        </p>
      </div>
    );
  }
  if (!usersData?.length) {
    return (
      <div className="mt-10 flex justify-center px-4">
        <p className="text-sm text-gray-500">No users found.</p>
      </div>
    );
  }

  const handlePromote = (id) => {
    promoteUserRole({ _id: id })
      .unwrap()
      .then((res) => {
        res?.userRole === "admin"
          ? showSuccess("Promoted to admin")
          : showError("Promotion failed");
      })
      .catch(() => showError("Something went wrong"))
      .finally(() => refetch());
  };

  const handleDemote = (id) => {
    demoteUserRole({ _id: id })
      .unwrap()
      .then((res) => {
        res?.userRole === "user"
          ? showSuccess("Demoted to user")
          : showError("Demotion failed");
      })
      .catch(() => showError("Something went wrong"))
      .finally(() => refetch());
  };

  const adminCount = usersData.filter((u) => u.userRole === "admin").length;

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
        <div className="flex items-end justify-between">
          <h1 className="text-xl font-medium text-white">Users</h1>
          <div className="flex items-center gap-3 text-[12px] text-gray-500">
            <span>
              <span className="font-medium text-white">{usersData.length}</span>{" "}
              Total
            </span>
            <span className="h-3 w-px bg-white/10" />
            <span>
              <span className="font-medium text-orange-400">{adminCount}</span>{" "}
              Admins
            </span>
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <div className="border-white/8 overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[580px] table-auto border-collapse text-sm">
          <thead>
            <tr className="border-white/8 border-b">
              {["User", "Email", "Role", "Action"].map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap px-4 py-3 text-left text-[11px] font-medium uppercase tracking-widest text-gray-600"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <motion.tbody
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {usersData.map((user, i) => (
              <motion.tr
                key={user._id ?? i}
                variants={rowVariants}
                className="hover:bg-white/3 border-b border-white/5 transition-colors last:border-0"
              >
                {/* User */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <UserAvatar src={user.userPhoto} name={user.userName} />
                    <span className="font-medium text-white">
                      {user.userName}
                    </span>
                  </div>
                </td>

                {/* Email */}
                <td className="max-w-[200px] break-all px-4 py-3 text-gray-400">
                  {user.userEmail}
                </td>

                {/* Role */}
                <td className="px-4 py-3">
                  <RoleBadge role={user.userRole} />
                </td>

                {/* Action */}
                <td className="px-4 py-3">
                  {user.userRole === "user" ? (
                    <ConfirmDialog
                      trigger={
                        <button className="inline-flex items-center gap-1.5 rounded-lg border border-orange-500/25 bg-orange-500/10 px-3 py-1.5 text-xs font-medium text-orange-400 transition-colors hover:bg-orange-500/20">
                          <HiOutlineArrowUp className="h-3.5 w-3.5" />
                          Promote
                        </button>
                      }
                      title="Promote to admin?"
                      description={`${user.userName} will gain admin access across the platform.`}
                      actionLabel="Promote"
                      actionClass="bg-orange-500 text-white hover:bg-orange-600"
                      onConfirm={() => handlePromote(user._id)}
                    />
                  ) : (
                    <ConfirmDialog
                      trigger={
                        <button className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:bg-white/10 hover:text-white">
                          <HiOutlineArrowDown className="h-3.5 w-3.5" />
                          Demote
                        </button>
                      }
                      title="Demote to user?"
                      description={`${user.userName} will lose admin privileges immediately.`}
                      actionLabel="Demote"
                      actionClass="bg-red-600 text-white hover:bg-red-700"
                      onConfirm={() => handleDemote(user._id)}
                    />
                  )}
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>

      <p className="mt-3 text-center text-xs text-gray-700 sm:hidden">
        Scroll right to see more →
      </p>
    </div>
  );
}
