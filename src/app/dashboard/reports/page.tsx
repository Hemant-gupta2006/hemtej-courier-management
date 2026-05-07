"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Calendar, User, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getAutocompleteData } from "@/lib/autocomplete";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function ReportsPage() {
  const [manifestDate, setManifestDate] = useState(new Date().toISOString().split('T')[0]);
  const [billingFromDate, setBillingFromDate] = useState("");
  const [billingToDate, setBillingToDate] = useState("");
  const [billingParty, setBillingParty] = useState("");
  const [parties, setParties] = useState<string[]>([]);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [advancedDetails, setAdvancedDetails] = useState({
    billNo: "",
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: "",
    partyAddress1: "",
    partyAddress2: "",
    partyCity: "",
    partyState: "",
    partyPincode: "",
    partyContact: "",
    partyGst: "",
    placeOfSupply: "",
    transportMode: "Surface",
    remarks: "",
    businessName: "SEETARAM ENTERPRISE",
    businessAddress: "Shop no.04, Dave Chawl, Near Kamu, Baba, SV Road, Opp. Patker College, Goregaon West, Mumbai 400104",
    businessContact: "+91 9892796228",
    businessGst: "27AYDPG0955B1ZV",
  });
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

    // Add advanced details if they are different from defaults or non-empty
    Object.entries(advancedDetails).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

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

            <div className="flex flex-col gap-3">
              <Dialog open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
                <DialogTrigger 
                  render={
                    <Button variant="outline" className="w-full h-11 rounded-xl border-purple-200 dark:border-purple-900/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                      <Settings2 className="mr-2 h-4 w-4" /> Add Invoice Details (Optional)
                    </Button>
                  }
                />
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0 overflow-hidden bg-white dark:bg-slate-950 rounded-[24px]">
                  <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                        <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      Advanced Invoice Details
                    </DialogTitle>
                  </DialogHeader>
                  <div className="px-6 py-2 h-[60vh] overflow-y-auto custom-scrollbar">
                    <div className="space-y-6 pb-6">
                      {/* Invoice Info */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Invoice Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Bill Number</Label>
                            <Input 
                              placeholder="e.g. 199" 
                              value={advancedDetails.billNo}
                              onChange={(e) => setAdvancedDetails({...advancedDetails, billNo: e.target.value})}
                              className="rounded-xl"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Invoice Date</Label>
                            <Input 
                              type="date"
                              value={advancedDetails.invoiceDate}
                              onChange={(e) => setAdvancedDetails({...advancedDetails, invoiceDate: e.target.value})}
                              className="rounded-xl"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Party Details */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Bill To (Party Details)</h4>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Party Name</Label>
                            <Input 
                              value={billingParty}
                              readOnly
                              className="rounded-xl bg-slate-50 dark:bg-white/5"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Address Line 1</Label>
                              <Input 
                                placeholder="Shop No / Building" 
                                value={advancedDetails.partyAddress1}
                                onChange={(e) => setAdvancedDetails({...advancedDetails, partyAddress1: e.target.value})}
                                className="rounded-xl"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Address Line 2</Label>
                              <Input 
                                placeholder="Area / Road" 
                                value={advancedDetails.partyAddress2}
                                onChange={(e) => setAdvancedDetails({...advancedDetails, partyAddress2: e.target.value})}
                                className="rounded-xl"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label>City</Label>
                              <Input 
                                placeholder="City" 
                                value={advancedDetails.partyCity}
                                onChange={(e) => setAdvancedDetails({...advancedDetails, partyCity: e.target.value})}
                                className="rounded-xl"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>State</Label>
                              <Input 
                                placeholder="State" 
                                value={advancedDetails.partyState}
                                onChange={(e) => setAdvancedDetails({...advancedDetails, partyState: e.target.value})}
                                className="rounded-xl"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Pincode</Label>
                              <Input 
                                placeholder="400001" 
                                value={advancedDetails.partyPincode}
                                onChange={(e) => setAdvancedDetails({...advancedDetails, partyPincode: e.target.value})}
                                className="rounded-xl"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Contact Number</Label>
                              <Input 
                                placeholder="+91" 
                                value={advancedDetails.partyContact}
                                onChange={(e) => setAdvancedDetails({...advancedDetails, partyContact: e.target.value})}
                                className="rounded-xl"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>GST Number</Label>
                              <Input 
                                placeholder="27XXXXX" 
                                value={advancedDetails.partyGst}
                                onChange={(e) => setAdvancedDetails({...advancedDetails, partyGst: e.target.value})}
                                className="rounded-xl"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Business Info */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Your Business Details (Defaults)</h4>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Business Name</Label>
                            <Input 
                              value={advancedDetails.businessName}
                              onChange={(e) => setAdvancedDetails({...advancedDetails, businessName: e.target.value})}
                              className="rounded-xl"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Business Address</Label>
                            <Input 
                              value={advancedDetails.businessAddress}
                              onChange={(e) => setAdvancedDetails({...advancedDetails, businessAddress: e.target.value})}
                              className="rounded-xl"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Contact No</Label>
                              <Input 
                                value={advancedDetails.businessContact}
                                onChange={(e) => setAdvancedDetails({...advancedDetails, businessContact: e.target.value})}
                                className="rounded-xl"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>GST Number</Label>
                              <Input 
                                value={advancedDetails.businessGst}
                                onChange={(e) => setAdvancedDetails({...advancedDetails, businessGst: e.target.value})}
                                className="rounded-xl"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Extra Fields */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Transport & Remarks</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Place of Supply</Label>
                            <Input 
                              placeholder="e.g. Maharashtra" 
                              value={advancedDetails.placeOfSupply}
                              onChange={(e) => setAdvancedDetails({...advancedDetails, placeOfSupply: e.target.value})}
                              className="rounded-xl"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Transport Mode</Label>
                            <Input 
                              placeholder="Surface / Air" 
                              value={advancedDetails.transportMode}
                              onChange={(e) => setAdvancedDetails({...advancedDetails, transportMode: e.target.value})}
                              className="rounded-xl"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Remarks / Notes</Label>
                          <Input 
                            placeholder="Add extra notes here" 
                            value={advancedDetails.remarks}
                            onChange={(e) => setAdvancedDetails({...advancedDetails, remarks: e.target.value})}
                            className="rounded-xl"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="p-6 pt-2 border-t dark:border-white/10">
                    <Button 
                      onClick={() => setIsAdvancedOpen(false)}
                      className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Save Details & Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button onClick={downloadBilling} className="w-full h-11 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20">
                <Download className="mr-2 h-4 w-4" /> Generate Billing Report
              </Button>
            </div>
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
