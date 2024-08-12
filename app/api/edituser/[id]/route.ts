import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  // Extract ID from URL path
  const id = (request.nextUrl.pathname.split('/').pop())
  
  
  if (!(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  // Parse JSON body
  const { email, password} = await request.json();
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Update the car record
    const updateduser = await prisma.user.update({
      where: { id },
      data: { email,password:hashedPassword }
    });

  
    return NextResponse.json({ user: updateduser });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating User' }, { status: 500 });
  }
}
