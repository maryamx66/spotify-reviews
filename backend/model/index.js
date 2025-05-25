import prisma from "../generated/prisma/index.js";

const db = new prisma.PrismaClient();

export default db;
