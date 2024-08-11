import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { revalidateTag } from "next/cache";


export async function POST(request: NextRequest) {
    const { carname, manufacturingdate, price,image,userId} = await request.json();
    try{
        console.log(carname, manufacturingdate, price,image,userId)
        await prisma.cars.create({ 
           data:{
            carname,
           manufacturingdate,
            price,
            image,
            userId
           }
        });
        revalidateTag('cars');
       return NextResponse.json({message:"Added Car Successfully"},{status:200},)

    }
    catch(error){
        return NextResponse.json({ message: 'Error while adding car' }, { status: 500 });
    }
 
}
