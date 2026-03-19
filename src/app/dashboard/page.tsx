import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package, TrendingUp, Wallet, ArrowRightLeft, Plus, FileText, Database, Settings2 } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null; // Or redirect
  
  const userId = (session.user as any).id;

  const totalEntries = await prisma.courierEntry.count({
    where: { userId }
  });
  
  const cashEntries = await prisma.courierEntry.aggregate({
    _sum: { amount: true },
    where: { status: "Cash", userId }
  });

  const accountEntries = await prisma.courierEntry.aggregate({
    _sum: { amount: true },
    where: { status: "Account", userId }
  });

  const recentEntries = await prisma.courierEntry.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  const topSenderGroup = await prisma.courierEntry.groupBy({
    by: ['fromParty'],
    where: { userId },
    _sum: { amount: true },
    _count: { id: true },
    orderBy: {
      _sum: {
        amount: 'desc'
      }
    },
    take: 1
  });

  let topSender = { name: "N/A", amount: 0, count: 0 };
  if (topSenderGroup.length > 0 && topSenderGroup[0].fromParty) {
    topSender = {
      name: topSenderGroup[0].fromParty,
      amount: topSenderGroup[0]._sum.amount || 0,
      count: topSenderGroup[0]._count.id || 0,
    };
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/50 scrollbar-track-transparent">
      <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">Welcome Back! 👋</h2>
          <p className="text-muted-foreground mt-1 text-lg">
            Here's what's happening with your couriers today.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
           <Link href="/dashboard/entries" className="inline-flex items-center justify-center font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md rounded-xl h-10 px-4">
               <Plus className="mr-2 h-4 w-4" /> Add Courier
           </Link>
           <Link href="/dashboard/reports" className="inline-flex items-center justify-center font-medium border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white rounded-xl h-10 px-4">
               <FileText className="mr-2 h-4 w-4" /> View Reports
           </Link>
        </div>
      </div>
      
      {/* Quick Action Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Link href="/dashboard/entries" className="group">
           <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-white/40 dark:border-white/10 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
              <CardHeader>
                 <CardTitle className="flex items-center text-lg text-slate-800 dark:text-white">
                   <Database className="mr-2 h-5 w-5 text-blue-500" /> Data Entry
                 </CardTitle>
                 <CardDescription>Enter multiple couriers quickly in spreadsheet mode</CardDescription>
              </CardHeader>
           </Card>
        </Link>
        <Link href="/dashboard/reports" className="group">
           <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-white/40 dark:border-white/10 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
              <CardHeader>
                 <CardTitle className="flex items-center text-lg text-slate-800 dark:text-white">
                   <FileText className="mr-2 h-5 w-5 text-emerald-500" /> Reports
                 </CardTitle>
                 <CardDescription>View, filter, and export your courier history</CardDescription>
              </CardHeader>
           </Card>
        </Link>
        <Link href="/dashboard/settings" className="group">
           <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-white/40 dark:border-white/10 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 to-red-500" />
              <CardHeader>
                 <CardTitle className="flex items-center text-lg text-slate-800 dark:text-white">
                   <Settings2 className="mr-2 h-5 w-5 text-orange-500" /> Settings
                 </CardTitle>
                 <CardDescription>Manage preferences and your account</CardDescription>
              </CardHeader>
           </Card>
        </Link>
      </div>

      <h3 className="text-xl font-semibold text-slate-800 dark:text-white mt-8 mb-4">Quick Statistics</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEntries}</div>
            <p className="text-xs text-muted-foreground">Liftime tracked parcels</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Collections</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{cashEntries._sum.amount || 0}</div>
            <p className="text-xs text-muted-foreground">Total cash on delivery/booking</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Receivables</CardTitle>
            <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{accountEntries._sum.amount || 0}</div>
            <p className="text-xs text-muted-foreground">To be billed on account</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Sender</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold truncate" title={topSender.name}>
              {topSender.name}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {topSender.count} {topSender.count === 1 ? 'parcel' : 'parcels'} • ₹{topSender.amount}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentEntries.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-4">No recent shipments found.</div>
              ) : (
                recentEntries.map(entry => (
                  <div key={entry.id} className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Challan #{entry.challanNo}</p>
                      <p className="text-sm text-muted-foreground">
                        {entry.fromParty} &rarr; {entry.toParty} <span className="text-slate-400">({entry.weight})</span>
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${entry.status === 'Cash' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                        {entry.status}
                      </span>
                      <span className="font-medium text-slate-900 dark:text-white">₹{entry.amount}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  );
}
