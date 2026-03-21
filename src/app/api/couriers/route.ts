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
    const { date, fromParty, toParty, weight, destination, amount, status, mode } = body;
    const userId = (session.user as any).id;

    const MAX_RETRIES = 5;
    let attempts = 0;
    let courier;

    while (attempts < MAX_RETRIES) {
      try {
        courier = await prisma.$transaction(async (tx) => {
          // Fetch the latest challanNo for the given userId
          const lastEntry = await tx.courierEntry.findFirst({
            where: { userId },
            orderBy: { challanNo: "desc" },
            select: { challanNo: true }
          });

          // Generate next challanNo
          const nextChallanNo = lastEntry ? lastEntry.challanNo + 1 : 1001;

          // Atomic fetch of MAX srNo
          const maxSrNoResult = await tx.courierEntry.aggregate({
            where: { userId },
            _max: { srNo: true }
          });
          const newSrNo = (maxSrNoResult._max.srNo || 0) + 1;

          return await tx.courierEntry.create({
            data: {
              srNo: newSrNo,
              userId,
              date: new Date(date || new Date()),
              challanNo: nextChallanNo,
              fromParty,
              toParty,
              weight: String(weight || "100g"),
              destination,
              amount: Number(amount) || 0,
              status: status || "Cash",
              mode: mode || "Surface",
            }
          });
        });
        
        break; // Successfully created
      } catch (error: any) {
        // P2002 is Prisma's unique constraint violation error code
        if (error.code === 'P2002') {
          // Retry the transaction to get a new unique number
          attempts++;
          if (attempts === MAX_RETRIES) throw error;
          await new Promise(res => setTimeout(res, 50));
          continue; // Retry
        }
        throw error;
      }
    }

    return NextResponse.json(courier);
  } catch (error) {
    console.log("[COURIERS_POST]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

