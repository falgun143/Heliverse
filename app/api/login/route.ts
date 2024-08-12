import { NextRequest, NextResponse } from "next/server";
import { encode_jwt } from "@falgunpal/jwt-helper-ts";
import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";
import { revalidateTag } from 'next/cache';
import { LoginSchema } from "@/utils/validationSchema";

export async function POST(request: NextRequest) {
  const parsedInput = LoginSchema.safeParse(await request.json());
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
  const email = parsedInput.data.email;
  const password = parsedInput.data.password;

  if (!process.env.NEXT_PUBLIC_JWT_SECRET) {
    return NextResponse.json({ message: 'Secret cannot be empty or undefined' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json({ message: 'User does not exist. signup' }, { status: 404 });
    }
    let isPasswordValid=false;
     if(email === "principal@classroom.com") {
      if(password ===user.password){
        isPasswordValid=true;
      }
     }
     else{
      isPasswordValid = await bcrypt.compare(password, user.password);
     }
  

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
    }
  

    const token = encode_jwt(process.env.NEXT_PUBLIC_JWT_SECRET, user.id, { email, role: user.role });
    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error during login', error }, { status: 500 });
  }
}
