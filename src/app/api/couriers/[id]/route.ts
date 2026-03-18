import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const resolvedParams = await params;
    // Safety guard: return 400 instead of crashing with a 500 on invalid ID
    if (!resolvedParams.id || typeof resolvedParams.id !== "string" || resolvedParams.id.startsWith("new-")) {
      return new NextResponse("Invalid or missing ID", { status: 400 });
    }

    const body = await req.json();
    
    const dbEntry = await prisma.courierEntry.findUnique({
      where: { id: resolvedParams.id }
    });
    if (!dbEntry || dbEntry.userId !== (session.user as any).id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if challan number is being changed to an existing one
    if (body.challanNo) {
      const existing = await prisma.courierEntry.findFirst({
        where: { 
          challanNo: String(body.challanNo),
          userId: (session.user as any).id as string
        }
      });

      if (existing && existing.id !== resolvedParams.id) {
        return new NextResponse("Challan Number already exists", { status: 400 });
      }
    }

    const data: any = { ...body };
    if (data.amount !== undefined) data.amount = Number(data.amount);
    if (data.weight) data.weight = String(data.weight);
    if (data.challanNo) data.challanNo = String(data.challanNo);
    if (data.date) data.date = new Date(data.date);
    // Strip frontend-only fields that don't exist in DB
    delete data.id;
    delete data.tempId;
    delete data.isNew;
    delete data.isEdited;
    delete data.srNo;
    delete data.userId;
    delete data.createdAt;
    delete data.updatedAt;

    const courier = await prisma.courierEntry.update({
      where: {
        id: resolvedParams.id,
      },
      data
    });

    return NextResponse.json(courier);
  } catch (error) {
    console.log("[COURIERS_PATCH]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const resolvedParams = await params;

    const dbEntry = await prisma.courierEntry.findUnique({
      where: { id: resolvedParams.id }
    });
    if (!dbEntry || dbEntry.userId !== (session.user as any).id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courier = await prisma.courierEntry.delete({
      where: {
        id: resolvedParams.id,
      }
    });

    return NextResponse.json(courier);
  } catch (error) {
    console.log("[COURIERS_DELETE]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
