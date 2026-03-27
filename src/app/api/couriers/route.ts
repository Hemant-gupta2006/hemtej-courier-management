import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(req: Request) {
  let userId = "unknown";
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    userId = String((session.user as any).id);

    if (!checkRateLimit(userId)) {
      return NextResponse.json({ success: false, error: "Too Many Requests" }, { status: 429 });
    }

    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get("limit");
    const pageParam = searchParams.get("page");
    const searchParam = searchParams.get("search");
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    const statusParam = searchParams.get("status");
    
    // Determine pagination parameters
    const take = limitParam ? parseInt(limitParam, 10) : undefined;
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    let skip = undefined;
    
    if (take && page) {
      skip = (page - 1) * take;
    }

    // Build unique where clause
    const where: any = { userId };

    if (startDateParam && endDateParam) {
      where.date = {
        gte: new Date(startDateParam),
        lte: new Date(endDateParam + "T23:59:59.999Z")
      };
    } else if (startDateParam) {
      where.date = { gte: new Date(startDateParam) };
    } else if (endDateParam) {
      where.date = { lte: new Date(endDateParam + "T23:59:59.999Z") };
    }

    if (statusParam && statusParam !== "all" && statusParam !== "") {
      where.status = statusParam;
    }

    if (searchParam) {
      const searchNum = parseInt(searchParam, 10);
      where.OR = [
        { fromParty: { contains: searchParam, mode: "insensitive" } },
        { toParty: { contains: searchParam, mode: "insensitive" } },
        { destination: { contains: searchParam, mode: "insensitive" } },
      ];
      if (!isNaN(searchNum)) {
        where.OR.push({ challanNo: searchNum });
      }
    }

    // Execute queries concurrently
    const [couriers, total] = await Promise.all([
      prisma.courierEntry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        ...(take ? { take } : {}),
        ...(skip !== undefined ? { skip } : {}),
      }),
      prisma.courierEntry.count({
        where
      })
    ]);

    const totalPages = take ? Math.ceil(total / take) : 1;

    return NextResponse.json({ 
      success: true, 
      data: couriers,
      total,
      currentPage: page,
      totalPages
    });
  } catch (error: any) {
    if (error?.code === 'P1001' || error?.code === 'P2024') {
      console.warn(`[COURIERS_GET] Database connection issue (${error.code}) for user ${userId}. Retrying usually works.`);
    } else {
      console.error("[COURIERS_GET]", userId, error);
    }
    return NextResponse.json({ success: false, data: [], error: String(error?.message || error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  let userId = "unknown";
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    userId = String((session.user as any).id);

    if (!checkRateLimit(userId)) {
      return NextResponse.json({ success: false, error: "Too Many Requests" }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ success: false, error: "Empty payload" }, { status: 400 });
    }

    const date = body.date && !isNaN(Date.parse(body.date)) ? new Date(body.date) : new Date();
    const fromParty = String(body.fromParty || "").trim();
    const toParty = String(body.toParty || "").trim();
    const weight = String(body.weight || "100g").trim();
    const destination = String(body.destination || "").trim();
    const amount = Number(body.amount) || 0;
    const status = String(body.status || "Cash").trim();
    const mode = String(body.mode || "Surface").trim();

    if (!fromParty || !toParty || !destination) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const MAX_RETRIES = 5;
    let attempts = 0;
    let courier;

    while (attempts < MAX_RETRIES) {
      try {
        courier = await prisma.$transaction(async (tx) => {
          const lastEntry = await tx.courierEntry.findFirst({
            where: { userId },
            orderBy: { createdAt: "desc" },
            select: { challanNo: true }
          });
          let nextChallanNo;
          if (body.challanNo) {
            nextChallanNo = Number(body.challanNo);
          } else {
            nextChallanNo = lastEntry ? lastEntry.challanNo + 1 : 1001;
          }

          const maxSrNoResult = await tx.courierEntry.aggregate({
            where: { userId },
            _max: { srNo: true }
          });
          const newSrNo = (maxSrNoResult._max.srNo || 0) + 1;

          return await tx.courierEntry.create({
            data: {
              srNo: newSrNo,
              userId,
              date,
              challanNo: nextChallanNo,
              fromParty,
              toParty,
              weight,
              destination,
              amount,
              status,
              mode,
            }
          });
        });
        break;
      } catch (error: any) {
        if (error.code === 'P2002') {
          if (body.challanNo) {
             throw new Error("DUPLICATE_CHALLAN_USER_PROVIDED");
          }
          attempts++;
          if (attempts === MAX_RETRIES) throw error;
          await new Promise(res => setTimeout(res, 50));
          continue;
        }
        throw error;
      }
    }

    return NextResponse.json({ success: true, data: courier });
  } catch (error: any) {
    if (error?.message === "DUPLICATE_CHALLAN_USER_PROVIDED") {
      return NextResponse.json({ success: false, error: "This challan number already exists." }, { status: 400 });
    } else if (error?.code === 'P1001' || error?.code === 'P2024') {
      console.warn(`[COURIERS_POST] Database connection issue (${error.code}) for user ${userId}. Retrying usually works.`);
    } else {
      console.error("[COURIERS_POST]", userId, error);
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
