import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const couriers = await prisma.courierEntry.findMany({
      where: { userId: (session.user as any).id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(couriers);
  } catch (error) {
    console.log("[COURIERS_GET]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { date, challanNo, fromParty, toParty, weight, destination, amount, status, mode } = body;

    if (!challanNo) {
      return new NextResponse("Missing Challan Number", { status: 400 });
    }

    const existing = await prisma.courierEntry.findFirst({
      where: {
        challanNo: String(challanNo),
        userId: (session.user as any).id
      }
    });

    if (existing) {
      return new NextResponse("Challan Number already exists", { status: 400 });
    }

    const maxSrNo = await prisma.courierEntry.aggregate({
      where: { userId: (session.user as any).id },
      _max: { srNo: true }
    });

    const newSrNo = (maxSrNo._max.srNo || 0) + 1;

    const courier = await prisma.courierEntry.create({
      data: {
        srNo: newSrNo,
        userId: (session.user as any).id,
        date: new Date(date || new Date()),
        challanNo: String(challanNo),
        fromParty,
        toParty,
        weight: String(weight),
        destination,
        amount: Number(amount),
        status,
        mode: mode || "Surface",
      }
    });

    return NextResponse.json(courier);
  } catch (error) {
    console.log("[COURIERS_POST]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
