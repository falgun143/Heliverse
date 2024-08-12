export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET(request: NextRequest) {
  try {
    let users = await prisma.user.findMany();
    users=users.filter((user)=>user.role!="PRINCIPAL")
    const response = NextResponse.json({ users, message: "Fetched Users Successfully" }, { status: 200 });

    return response;
  } catch (error) {
    console.error("Error fetching cars:", error); 
    return NextResponse.json({ message: 'Error while fetching users' }, { status: 500 });
  }
}
