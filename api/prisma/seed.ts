import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seed = async () => {
  try {
    await prisma.activeSession.deleteMany({});

    await prisma.workLog.deleteMany({});

    await prisma.user.deleteMany({});

    const user1 = await prisma.user.create({
      data: {
        id: 1,
        name: "João",
        cod: "cod1",
      },
    });

    const user2 = await prisma.user.create({
      data: {
        id: 2,
        name: "Ana",
        cod: "cod2",
      },
    });

    await prisma.workLog.createMany({
      data: [
        { date: new Date("2024-07-01"), hours: 25200, userId: user1.id }, // 7 horas
        { date: new Date("2024-07-02"), hours: 25200, userId: user1.id }, // 7 horas
        { date: new Date("2024-07-03"), hours: 27000, userId: user2.id }, // 7h 30m
        { date: new Date("2024-07-04"), hours: 27000, userId: user2.id }, // 7h 30m
        { date: new Date("2024-07-05"), hours: 25200, userId: user1.id }, // 7 horas
        { date: new Date("2024-07-06"), hours: 25200, userId: user1.id }, // 7 horas
        { date: new Date("2024-07-07"), hours: 27000, userId: user2.id }, // 7h 30m
        { date: new Date("2024-07-08"), hours: 27000, userId: user2.id }, // 7h 30m
        { date: new Date("2024-07-09"), hours: 27000, userId: user2.id }, // 7h 30m
        { date: new Date("2024-07-10"), hours: 25200, userId: user1.id }, // 7 horas
        { date: new Date("2024-07-11"), hours: 25200, userId: user1.id }, // 7 horas
        { date: new Date("2024-07-12"), hours: 27000, userId: user2.id }, // 7h 30m
        { date: new Date("2024-07-13"), hours: 27000, userId: user2.id }, // 7h 30m
        { date: new Date("2024-07-14"), hours: 25200, userId: user1.id }, // 7 horas
        { date: new Date("2024-07-15"), hours: 25200, userId: user1.id }, // 7 horas
        { date: new Date("2024-07-16"), hours: 27000, userId: user2.id }, // 7h 30m
        { date: new Date("2024-07-17"), hours: 27000, userId: user2.id }, // 7h 30m
        { date: new Date("2024-07-18"), hours: 25200, userId: user1.id }, // 7 horas
        { date: new Date("2024-07-19"), hours: 25200, userId: user1.id }, // 7 horas
        { date: new Date("2024-07-20"), hours: 27000, userId: user2.id }, // 7h 30m
        { date: new Date("2024-07-21"), hours: 27000, userId: user2.id }, // 7h 30m
        { date: new Date("2024-07-22"), hours: 27000, userId: user2.id }, // 7h 30m
      ],
    });

    console.log("Seed completed.");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
};

seed();