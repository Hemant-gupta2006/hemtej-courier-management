import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const userId = (session.user as any).id;

    const result = await prisma.courierEntry.deleteMany({
      where: { userId },
    });

    return NextResponse.json({ deleted: result.count });
  } catch (error) {
    console.log("[COURIERS_DELETE_ALL]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
