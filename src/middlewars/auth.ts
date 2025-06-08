import { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // separando Bearer do token e pegando o token

    if (!token) res.status(401).json({message: "Token não fornecido."});

    Jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
        
        if (err) res.status(403).json({message: "Token inválido."});

        (req as any).user = user; // adiciona o user à request
        next();
    });
};

