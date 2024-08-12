import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { classname, startTime, endTime, days, teacher, students } = req.body;

    try {
      // Fetch the teacher by email
      const teacherUser = await prisma.user.findUnique({
        where: {
          email: teacher,
        },
      });

      if (!teacherUser) {
        return res.status(400).json({ error: 'Teacher not found' });
      }

      // Create the classroom
      const classroom = await prisma.classroom.create({
        data: {
          name: classname,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          days,
          teacher: {
            connect: {
              id: teacherUser.id,
            },
          },
        },
      });

      // Add students to the classroom
      const studentUsers = await prisma.user.findMany({
        where: {
          email: {
            in: students,
          },
        },
      });

      for (const student of studentUsers) {
        await prisma.classroom.update({
          where: {
            id: classroom.id,
          },
          data: {
            students: {
              connect: {
                id: student.id,
              },
            },
          },
        });
      }

      res.status(200).json({ message: 'Class added successfully' });
    } catch (error) {
      console.error('Error adding class:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
