"use client";

import { UserButton } from "./UserButton";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, PanelLeftClose, PanelLeftOpen, List, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { Input } from "./ui/input";

// ── Inline lightweight modal ──────────────────────────────────────────────
function DeleteAllModal({
  open,
  onClose,
  onConfirm,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  const [typed, setTyped] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTyped("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-white/20 dark:border-white/10 shadow-2xl p-6 space-y-5">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Delete All Data?
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              This action <strong>cannot be undone</strong>. This will
              permanently delete <strong>all</strong> courier entries from the
              database.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Type <span className="font-mono font-bold text-red-600">DELETE</span> to confirm
          </label>
          <Input
            ref={inputRef}
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="DELETE"
            className="font-mono border-red-300 dark:border-red-700 focus-visible:ring-red-500"
          />
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <Button variant="outline" onClick={onClose} disabled={loading} className="rounded-xl">
            Cancel
          </Button>
          <Button
            disabled={typed !== "DELETE" || loading}
            onClick={onConfirm}
            className="rounded-xl bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
          >
            {loading ? "Deleting…" : "Yes, Delete All"}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar = ({ onToggleSidebar, isSidebarOpen }: NavbarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteAll = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch("/api/couriers/delete-all", { method: "DELETE" });
      if (res.ok) {
        setDeleteOpen(false);
        toast.success("All entries deleted successfully.");
        window.location.reload(); // Refresh the page to clear the table
      } else {
        toast.error("Failed to delete entries.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const showTableActions = pathname === "/dashboard/entries";

  return (
    <>
      <DeleteAllModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteAll}
        loading={deleteLoading}
      />
      <div className="flex items-center p-4 md:px-6 border-b border-white/40 dark:border-white/5 bg-white/20 dark:bg-slate-900/20 backdrop-blur-md gap-2">
      {/* Sidebar toggle — visible on desktop */}
      {onToggleSidebar && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors shrink-0"
          title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <PanelLeftOpen className="h-5 w-5" />
          )}
        </Button>
      )}

      {/* Mobile-only hamburger (original) */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="md:hidden text-slate-700 dark:text-slate-300"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex w-full justify-end items-center gap-3">
        {showTableActions && (
          <div className="hidden md:flex items-center gap-2 mr-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard/all-entries")}
              className="rounded-xl border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 gap-2 h-9"
            >
              <List className="h-4 w-4" />
              Show All Entries
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteOpen(true)}
              className="rounded-xl border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 gap-2 h-9"
            >
              <Trash2 className="h-4 w-4" />
              Delete All
            </Button>
          </div>
        )}
        <ThemeToggle />
        <UserButton />
      </div>
    </div>
    </>
  );
};
