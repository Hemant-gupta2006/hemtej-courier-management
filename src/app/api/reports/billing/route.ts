import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import * as XLSX from "xlsx";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const fromParty = searchParams.get("fromParty");
    const startDateStr = searchParams.get("startDate");
    const endDateStr = searchParams.get("endDate");

    const where: any = {
      userId: (session.user as any).id,
      status: "Account",
    };

    if (fromParty) {
      where.fromParty = { contains: fromParty, mode: "insensitive" };
    }

    if (startDateStr || endDateStr) {
      where.date = {};
      if (startDateStr) where.date.gte = new Date(startDateStr);
      if (endDateStr) {
        const end = new Date(endDateStr);
        end.setHours(23, 59, 59, 999);
        where.date.lte = end;
      }
    }

    const entries = await prisma.courierEntry.findMany({
      where,
      orderBy: { date: "asc" },
    });

    if (entries.length === 0) {
      return new NextResponse("No billing entries found", { status: 404 });
    }

    const formatWeight = (w: string) => {
      const g = parseFloat(w);
      if (isNaN(g)) return w;
      return g >= 1000 ? `${(g / 1000).toFixed(3)} kg` : `${g}g`;
    };

    const data = entries.map((e, index) => ({
      "Sr.No": index + 1,
      "Date": e.date.toLocaleDateString('en-GB'),
      "Challan No": e.challanNo,
      "From Party": e.fromParty,
      "To Party": e.toParty,
      "Destination": e.destination,
      "Weight": formatWeight(e.weight),
      "Amount": e.amount,
      "Mode": e.mode || "Surface",
    }));

    // Add a Total row
    const totalAmount = entries.reduce((sum, e) => sum + (e.amount || 0), 0);
    data.push({
      "Sr.No": "TOTAL" as any,
      "Date": "" as any,
      "Challan No": "" as any,
      "From Party": "" as any,
      "To Party": "" as any,
      "Weight": "" as any,
      "Destination": "" as any,
      "Amount": totalAmount as any,
      "Mode": "" as any,
    });

    const worksheet = XLSX.utils.json_to_sheet(data);

    const colWidths = [
      { wch: 8 },  // Sr.No
      { wch: 12 }, // Date
      { wch: 12 }, // Challan
      { wch: 25 }, // From
      { wch: 25 }, // To
      { wch: 20 }, // Destination
      { wch: 12 }, // Weight
      { wch: 12 }, // Amount
      { wch: 10 }, // Mode
    ];
    worksheet["!cols"] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Account Billing");

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    const filename = fromParty
      ? `Billing_${fromParty.replace(/\s+/g, '_')}.xlsx`
      : `Account_Billing_${new Date().toISOString().split('T')[0]}.xlsx`;

    return new NextResponse(buffer, {
      headers: {
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    console.error("[BILLING_REPORT_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
