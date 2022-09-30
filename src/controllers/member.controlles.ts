import { Router, Request, Response, NextFunction } from "express";
import { encryptPassword } from '../lib/encryptPassword';
import { MemberService } from '../services/member.service';

const service = new MemberService();

export const crearCliente = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body;
        const hash = await encryptPassword(body.password);
        const newCliente = await service.crearCliente({
            ...body,
            password: hash
        });
        res.status(201).json(newCliente)
    } catch (error: any) {
        next(res.status(400).json({ message: error.message }))
    }
}

export const asociarCliente = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const bodyC = req.body
        const asociCliente = await service.asociarClientes(Number(id), bodyC);
        res.status(201).json({ mensaje: "Cliente asociado exitosamente" });
    } catch (error: any) {
        next(res.status(400).json({ message: error.message }))
    }
}

export const listarParqueaderos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const listparking = await service.listarParqueadero(req.body.userId);
        res.status(201).json(listparking)
    } catch (error: any) {
        next(res.status(400).json({ message: error.message }))
    }
}

export const detalleParqueaderos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { placa } = req.params;
        const listparking = await service.destalleParqueadero(req.body.userId, placa);
        res.status(201).json(listparking)
    } catch (error: any) {
        next(res.status(400).json({ message: error.message }))
    }
}

export const usandoParqueadero = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const listparking = await service.usandoParking();
        res.status(201).json(listparking)
    } catch (error: any) {
        next(res.status(400).json({ message: error.message }))
    }
}

export const noUsandoParqueadero = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const listparking = await service.notUsandoParking();
        res.status(201).json(listparking)
    } catch (error: any) {
        next(res.status(400).json({ message: error.message }))
    }
}

export const listarVehiculoPorCliente = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { idCliente } = req.params;
        const list = await service.listadoVehiculoCliente(Number(idCliente));
        res.status(201).json(list)
    } catch (error: any) {
        next(res.status(400).json({ message: error.message }))
    }
}

export const listarDetalleVehiculo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { idC, placa } = req.params;
        const list = await service.listadoVehiculoDetalle(Number(idC), placa);
        res.status(201).json(list)
    } catch (error: any) {
        next(res.status(400).json({ message: error.message }))
    }
}

export const listarRegisVehiculo = async (req: Request, res: Response, next: NextFunction) => {
  try {
      const { id } = req.params;
      const listparking = await service.listRegis(Number(id));
      res.status(201).json(listparking)
  } catch (error: any) {
      next(res.status(400).json({ message: error.message }))
  }
}

export const verifVehiculosNoPrimVez = async (req: Request, res: Response, next: NextFunction) => {
  try {
      const listparking = await service.verifVehiculosNoPrim();
      res.status(201).json(listparking)
  } catch (error: any) {
      next(res.status(400).json({ message: error.message }))
  }
}

export const verifiVehiParqNuevo = async (req: Request, res: Response, next: NextFunction) => {
  try {
      const listparking = await service.verifiVehiParNuevo();
      res.status(201).json(listparking)
  } catch (error: any) {
      next(res.status(400).json({ message: error.message }))
  }
}

export const promedioRangoFechas = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { idP } = req.params;
        const body = req.body;
        const list = await service.promedioRangoFecha(Number(idP), body);
        res.status(201).json(list)
    } catch (error: any) {
        next(res.status(400).json({ message: error.message }))
    }
}

export const promedioTodosPasqueadero = async (req: Request, res: Response, next: NextFunction) =>{
  try {
    const body = req.body;
    const listPromParking = await service.promedioTodosParqueaderos(body);
    res.status(201).json(listPromParking)
} catch (error: any) {
    next(res.status(400).json({ message: error.message }))
}
}
