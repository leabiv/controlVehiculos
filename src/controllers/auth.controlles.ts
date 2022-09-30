import { Router, Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { AuthService } from '../services/auth.service';
import { validatePassword } from '../lib/encryptPassword';

const service = new AuthService();

export const signin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const findUser = await service.findOneUserCorreo(email);
        const uth = await validatePassword(password, findUser[0]?.password);

        if (!uth) {
            res.status(400).json({ message: "Contraseña Incorrecta" })
        }

        const token: string = jwt.sign({ findUser }, process.env.TOKEN_SECRET || 'tokentest', { expiresIn: '5h' })
        //res.header('auth-token', token).json(findUser)
        res.json({token})
    } catch (error: any) {
        res.status(400).send(error.message)
    }
}

export const profile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).json({ message: "Ingreso Exitoso" });
    } catch (error: any) {
        res.status(400).send(error.message)
    }
}
