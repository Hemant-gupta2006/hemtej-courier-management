"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft, Download, Search, ChevronLeft, ChevronRight } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const PAGE_SIZE = 50;

const statusColor: Record<string, string> = {
  Cash: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  Account: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  Delivered: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
};

function fmt(w: string) {
  const g = parseFloat(w);
  return isNaN(g) ? w : g >= 1000 ? `${g / 1000}kg` : `${g}g`;
}

export default function AllEntriesPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/couriers");
      if (res.ok) setEntries(await res.json());
      else toast.error("Failed to load entries.");
    } catch {
      toast.error("Network error.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Reset to page 1 when search changes
  useEffect(() => { setPage(1); }, [search]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) =>
      [e.challanNo, e.fromParty, e.toParty, e.destination, e.status, e.mode].some(
        (v) => String(v ?? "").toLowerCase().includes(q)
      )
    );
  }, [entries, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  const exportExcel = () => {
    const rows = [...entries]
      .sort((a, b) => (parseInt(a.srNo) || 0) - (parseInt(b.srNo) || 0))
      .map((r) => ({
        "Sr.No": Number(r.srNo) || 0,
        Date: new Date(r.date).toLocaleDateString("en-IN"),
        "Challan No": r.challanNo,
        "From Party": r.fromParty,
        "To Party": r.toParty,
        Weight: fmt(r.weight),
        Destination: r.destination,
        Amount: Number(r.amount) || 0,
        Status: r.status,
        Mode: r.mode,
      }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = Object.keys(rows[0] || {}).map(() => ({ wch: 16 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "All Entries");
    saveAs(
      new Blob([XLSX.write(wb, { bookType: "xlsx", type: "array" })], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `All_Entries_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard/entries")}
            className="rounded-xl hover:bg-white/40 dark:hover:bg-slate-800/40"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">All Entries</h2>
            <p className="text-sm text-muted-foreground">
              {loading ? "Loading…" : `${filtered.length.toLocaleString()} entries${search ? " matched" : " total"}`}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={exportExcel}
          disabled={loading || entries.length === 0}
          className="rounded-xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-white/40 dark:border-white/10 gap-2"
        >
          <Download className="h-4 w-4" /> Export Excel
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search challan, party, destination…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-white/40 dark:border-white/10 rounded-xl"
        />
      </div>

      {/* Table */}
      <div className="rounded-[20px] overflow-hidden bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-white/50 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)]">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
            Loading entries…
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-2">
            <span className="text-4xl">📦</span>
            <p className="font-medium">{search ? "No entries match your search." : "No entries yet."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100/50 dark:bg-slate-800/50 sticky top-0 z-10 backdrop-blur-md">
                <tr className="border-b border-slate-200/50 dark:border-white/10">
                  {["Sr.No", "Date", "Challan No", "From Party", "To Party", "Weight", "Destination", "Amount", "Status", "Mode"].map((h) => (
                    <th
                      key={h}
                      className="h-11 px-3 text-left font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-slate-200/30 dark:border-white/5 hover:bg-white/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-3 py-2 text-slate-500 dark:text-slate-400 font-medium">{entry.srNo}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-slate-700 dark:text-slate-300">
                      {new Date(entry.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-3 py-2 font-mono font-medium text-slate-900 dark:text-white">{entry.challanNo}</td>
                    <td className="px-3 py-2 max-w-[160px] truncate text-slate-800 dark:text-slate-200">{entry.fromParty}</td>
                    <td className="px-3 py-2 max-w-[160px] truncate text-slate-800 dark:text-slate-200">{entry.toParty}</td>
                    <td className="px-3 py-2 font-mono text-right text-slate-700 dark:text-slate-300">{fmt(entry.weight)}</td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{entry.destination}</td>
                    <td className="px-3 py-2 text-right font-medium text-slate-900 dark:text-white">
                      {entry.amount ? `₹${Number(entry.amount).toLocaleString("en-IN")}` : "—"}
                    </td>
                    <td className="px-3 py-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor[entry.status] ?? "bg-slate-100 text-slate-600"}`}>
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{entry.mode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>
            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            {" · "}{filtered.length.toLocaleString()} entries
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-xl gap-1"
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-xl gap-1"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
