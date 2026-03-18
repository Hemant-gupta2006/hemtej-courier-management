import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new NextResponse("Invalid data", { status: 400 });
    }

    // Attempt to process multiple
    let maxSrNoResult = await prisma.courierEntry.aggregate({
      where: { userId: (session.user as any).id },
      _max: { srNo: true }
    });
    
    let currentSrNo = (maxSrNoResult._max.srNo || 0);

    const createdItems = [];
    for (const item of items) {
      if (!item.challanNo) continue;

      const existing = await prisma.courierEntry.findFirst({
        where: { 
          challanNo: String(item.challanNo),
          userId: (session.user as any).id
        }
      });

      if (existing) continue; // Skip existing challan numbers

      currentSrNo++;
      
      const created = await prisma.courierEntry.create({
        data: {
          userId: (session.user as any).id,
          srNo: currentSrNo,
          date: item.date ? new Date(item.date) : new Date(),
          challanNo: String(item.challanNo),
          fromParty: item.fromParty || "",
          toParty: item.toParty || "",
          weight: String(item.weight || ""),
          destination: item.destination || "",
          amount: Number(item.amount || 0),
          status: item.status || "Cash",
        }
      });
      createdItems.push(created);
    }

    return NextResponse.json(createdItems);
  } catch (error) {
    console.log("[COURIERS_BULK_POST]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
