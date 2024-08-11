import { NextRequest, NextResponse } from "next/server";
import { encode_jwt } from "@falgunpal/jwt-helper-ts";
import prisma from "../../../lib/prisma";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import{ SignUpSchema}  from "../../../utils/validationSchema"

export async function POST(request: NextRequest) {
  
  const parsedInput = SignUpSchema.safeParse(await request.json());
  if (!parsedInput.success) {
    return NextResponse.json(
      {
        errors: parsedInput.error.issues.map((err) => ({
          path: err.path[0],
          message: err.message,
        })),
      },
      { status: 405 }
    );
  }
  const username = parsedInput.data.username;
  const password = parsedInput.data.password;
  const role = parsedInput.data.role;

  if (!process.env.NEXT_PUBLIC_JWT_SECRET) {
    return NextResponse.json(
      { message: "Secret cannot be empty or undefined" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: username },
  });

  if (user) {
    return NextResponse.json(
      { message: "User already registered. login" },
      { status: 404 }
    );
  }

  const userid = uuidv4();
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const token = encode_jwt(process.env.NEXT_PUBLIC_JWT_SECRET, userid, {
      username,
      role,
    });

    await prisma.user.create({
      data: { id: userid, email: username, password: hashedPassword, role },
    });
    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error while generating token" },
      { status: 500 }
    );
  }
}
