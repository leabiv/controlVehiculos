import { Router, Request, Response, NextFunction } from "express";
import { ClienteService } from '../services/client.service';
import { logger } from "../lib/logger";

const service = new ClienteService();

export const registroEntrada = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { idS } = req.params;
        const bodyVehiculo = req.body;
        const regEntrada = await service.registarEntrada(Number(idS), bodyVehiculo, req.body.userId);
        logger.log("debug", "Correo Enviado");
        res.status(200).json({ message: "id generado del registro" })
    } catch (error: any) {
        next(res.status(400).json({ message: error.message }))
    }
}

export const registroSalida = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { idP } = req.params;
        const body = req.body;
        const salidaEntrada = await service.registrarSalida(Number(idP), body);
        res.status(200).json({ message: "salida registrada" })
    } catch (error: any) {
        next(res.status(400).json({ message: error.message }))
    }
}

export const listarVehiculos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const listVehi = await service.listadoVehiculo();
        res.status(200).json(listVehi)
    } catch (error: any) {
        next(res.status(400).json({ message: error.message }))
    }
}

export const listarUnVehiculo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { idP } = req.params
        const listVehiculos = await service.listadoUnVehiculo(Number(idP));
        res.status(200).json(listVehiculos)
    } catch (error: any) {
        next(res.status(400).json({ message: error.message }))
    }
}
