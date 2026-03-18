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
      select: {
        destination: true,
        fromParty: true,
        toParty: true,
        weight: true,
        status: true,
      },
      distinct: ['destination', 'fromParty', 'toParty', 'weight', 'status'],
      take: 1000, 
      orderBy: { createdAt: 'desc' }
    });

    const destinations = Array.from(new Set(couriers.map(c => c.destination).filter(Boolean)));
    const fromParties = Array.from(new Set(couriers.map(c => c.fromParty).filter(Boolean)));
    const toParties = Array.from(new Set(couriers.map(c => c.toParty).filter(Boolean)));
    const weights = Array.from(new Set(couriers.map(c => c.weight).filter(Boolean)));
    const statuses = Array.from(new Set(couriers.map(c => c.status).filter(Boolean)));

    return NextResponse.json({
      destinations,
      fromParties,
      toParties,
      weights,
      statuses
    });
  } catch (error) {
    console.log("[AUTOCOMPLETE_GET]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
