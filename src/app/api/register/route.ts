import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!email || !password) {
      return new NextResponse("Missing email or password", { status: 400 });
    }

    const exist = await prisma.user.findUnique({
      where: { email },
    });

    if (exist) {
      return new NextResponse("User already exists", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // Make the first user an Admin, else Staff
        role: (await prisma.user.count()) === 0 ? "Admin" : "Staff"
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("REGISTRATION ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
