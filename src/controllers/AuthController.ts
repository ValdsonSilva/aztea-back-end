import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Prisma, PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  console.log({email, password})

  if (!email || !password) res.status(401).json({ message: 'Email e senha não informados' });
  

  // Simulação: buscar usuário no banco
  const user = await prisma.user.findUnique({where: {email}});

  if (!user) res.status(401).json({message: "Usuário inexistente"})

  const token = jwt.sign({ id: user?.id, email: user?.email }, process.env.JWT_SECRET as string, {
    expiresIn: '1h',
  });

  res.json({ token });
};