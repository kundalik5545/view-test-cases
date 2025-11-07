import { PrismaClient } from "@prisma/client";

let globalWithPrisma = global;
globalWithPrisma.prisma = globalWithPrisma.prisma || null;

const prisma = globalWithPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV === "development") {
  globalWithPrisma.prisma = prisma;
}

export default prisma;
