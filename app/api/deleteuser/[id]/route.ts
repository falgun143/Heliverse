import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function DELETE(request: NextRequest) {
  const id = (request.nextUrl.pathname.split("/").pop() );
  

  if (!id) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
        await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "User Deleted successfully" });
  } catch (error) {
    console.error("Error updating car:", error);
    return NextResponse.json({ error: "Error Deleting the User" }, { status: 500 });
  }
}
