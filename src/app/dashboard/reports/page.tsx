"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getAutocompleteData } from "@/lib/autocomplete";

export default function ReportsPage() {
  const [manifestDate, setManifestDate] = useState(new Date().toISOString().split('T')[0]);
  const [billingFromDate, setBillingFromDate] = useState("");
  const [billingToDate, setBillingToDate] = useState("");
  const [billingParty, setBillingParty] = useState("");
  const [parties, setParties] = useState<string[]>([]);
  const filteredParties = parties
    .filter(p => p.toLowerCase().includes(billingParty.toLowerCase()))
    .slice(0, 50);

  useEffect(() => {
    getAutocompleteData().then(data => {
      setParties(data.fromParties || []);
    });
  }, []);

  const downloadManifest = () => {
    if (!manifestDate) {
      toast.error("Please select a date for manifest");
      return;
    }
    window.location.href = `/api/reports/manifest?date=${manifestDate}`;
  };

  const downloadBilling = () => {
    const params = new URLSearchParams();
    if (billingFromDate) params.append("startDate", billingFromDate);
    if (billingToDate) params.append("endDate", billingToDate);
    if (billingParty) params.append("fromParty", billingParty);

    window.location.href = `/api/reports/billing?${params.toString()}`;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10 px-4 md:px-0">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          System Reports
        </h2>
        <p className="text-muted-foreground">
          Generate and download operational and financial reports in Excel format.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Daily Manifest Card */}
        <Card className="border-white/20 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-xl rounded-[24px] overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-blue-100 dark:bg-blue-900/30">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-xl">Daily Manifest</CardTitle>
                <CardDescription>Export shipments grouped by destination for a specific day.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Select Date
              </label>
              <Input
                type="date"
                value={manifestDate}
                onChange={(e) => setManifestDate(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && downloadManifest()}
                className="rounded-xl h-11"
              />
            </div>
            <Button onClick={downloadManifest} className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">
              <Download className="mr-2 h-4 w-4" /> Download Manifest (Excel)
            </Button>
          </CardContent>
        </Card>

        {/* Account Billing Card */}
        <Card className="border-white/20 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-xl rounded-[24px] overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-purple-100 dark:bg-purple-900/30">
                <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-xl">Account Billing</CardTitle>
                <CardDescription>Generate invoices for credit clients based on date range.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-semibold">From Date</label>
                <Input
                  type="date"
                  value={billingFromDate}
                  onChange={(e) => setBillingFromDate(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && downloadBilling()}
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">To Date</label>
                <Input
                  type="date"
                  value={billingToDate}
                  onChange={(e) => setBillingToDate(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && downloadBilling()}
                  className="rounded-xl h-11"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <User className="h-4 w-4" /> Filter by Party (Optional)
              </label>
              <div className="relative">
                {/* Ghost suggestion layer */}
                {billingParty.length > 0 && filteredParties[0] && filteredParties[0].toLowerCase().startsWith(billingParty.toLowerCase()) && (
                  <div className="absolute inset-0 flex items-center px-3 pointer-events-none text-slate-400 dark:text-slate-500 z-0 h-11 text-sm">
                    <span className="opacity-0">{billingParty}</span>
                    <span>{filteredParties[0].slice(billingParty.length)}</span>
                  </div>
                )}
                <Input
                  placeholder="e.g. Reliance"
                  value={billingParty}
                  onChange={(e) => setBillingParty(e.target.value)}
                  onKeyDown={(e) => {
                    const suggestion = filteredParties[0];
                    const isSuggestionVisible = suggestion && suggestion.toLowerCase().startsWith(billingParty.toLowerCase()) && suggestion.toLowerCase() !== billingParty.toLowerCase();

                    if ((e.key === "Tab" || e.key === "Enter") && isSuggestionVisible) {
                      e.preventDefault();
                      setBillingParty(suggestion);
                    } else if (e.key === "Enter") {
                      e.preventDefault();
                      downloadBilling();
                    }
                  }}
                  className="rounded-xl h-11 relative z-10"
                  style={{ backgroundColor: 'transparent' }}
                />
              </div>
            </div>
            <Button onClick={downloadBilling} className="w-full h-11 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20">
              <Download className="mr-2 h-4 w-4" /> Generate Billing Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Info Tips */}
      <div className="mt-6 p-6 rounded-[24px] bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
        <h4 className="font-bold text-slate-900 dark:text-white mb-2">Reporting Guide</h4>
        <ul className="text-sm text-slate-500 dark:text-slate-400 space-y-2 list-disc pl-4">
          <li><strong>Daily Manifest:</strong> Useful for drivers and delivery tracking. It includes all shipments created on the selected date.</li>
          <li><strong>Account Billing:</strong> Only includes entries marked as "Account" status. Useful for generating weekly or monthly customer invoices.</li>
          <li>Both reports are exported in .xlsx format compatible with Excel and Google Sheets.</li>
        </ul>
      </div>
    </div>
  );
}
