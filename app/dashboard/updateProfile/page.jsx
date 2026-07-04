"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateUserProfileMutation } from "../../redux/api/usersApi";
import { setUser } from "../../redux/slices/userSlice";
import { Button } from "../../../components/ui/button";
import useToast from "../../../components/Shared/useCustomToast";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  HiOutlineUser,
  HiOutlinePhoto,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
} from "react-icons/hi2";

const FIELDS = [
  {
    key: "userName",
    label: "Display name",
    type: "text",
    icon: HiOutlineUser,
    placeholder: "Your full name",
    required: true,
  },
  {
    key: "userPhoto",
    label: "Photo URL",
    type: "url",
    icon: HiOutlinePhoto,
    placeholder: "https://example.com/photo.jpg",
    required: false,
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

export default function UpdateProfile() {
  const currentUser = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState({
    userName: currentUser?.userName || "",
    userPhoto: currentUser?.userPhoto || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateUserProfile({
        userEmail: currentUser.userEmail,
        ...formData,
      }).unwrap();
      dispatch(setUser(updatedUser));
      showSuccess("Profile updated");
      router.push("/dashboard/profile");
    } catch (err) {
      console.error("Update error:", err);
      showError("Something went wrong");
      router.push("/dashboard/profile");
    }
  };

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
        <motion.form
          variants={itemVariants}
          onSubmit={handleSubmit}
          className="border-white/8 rounded-2xl border bg-white/5 p-6 sm:p-8"
        >
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-lg font-medium text-white">Edit profile</h1>
            <p className="mt-0.5 text-[13px] text-gray-500">
              Changes will reflect across your account immediately.
            </p>
          </div>

          <div className="bg-white/8 mb-5 h-px" />

          {/* Fields */}
          <div className="space-y-5">
            {FIELDS.map(
              ({ key, label, type, icon: Icon, placeholder, required }) => (
                <motion.div key={key} variants={itemVariants}>
                  <label
                    htmlFor={key}
                    className="mb-1.5 flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-gray-600"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                    {required && <span className="text-orange-500">*</span>}
                  </label>
                  <input
                    id={key}
                    name={key}
                    type={type}
                    value={formData[key]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    required={required}
                    className="border-white/8 focus:bg-white/8 w-full rounded-lg border bg-white/5 px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-orange-500/50"
                  />
                </motion.div>
              ),
            )}
          </div>

          <div className="bg-white/8 my-6 h-px" />

          {/* Actions */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"
          >
            <Button
              type="button"
              variant="destructive"
              onClick={() => router.push("/dashboard/profile")}
              className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <HiOutlineXCircle className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              variant="success"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-lg border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-400 transition-colors hover:bg-orange-500/20 disabled:opacity-50"
            >
              <HiOutlineCheckCircle className="h-4 w-4" />
              {isLoading ? "Saving…" : "Save changes"}
            </Button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
}
