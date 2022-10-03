import { Router, Request, Response, NextFunction } from "express";
import { encryptPassword } from '../lib/encryptPassword';
import { AdminService } from '../services/admin.service';

const service = new AdminService();

//---------------------Metodos async de Usuarios------------------//
export const allUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const usuarios = await service.allMember();
        res.status(201).json(usuarios)
    } catch (error: any) {
        next(res.status(400).json({ message: error.message }))
    }
}

export const createUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body;
        const hash = await encryptPassword(body.password)
        const newUser = await service.createUser({
            ...body,
            password: hash
        });
        res.status(201).json({ mensaje: 'Usuario registrado con exito' })
    } catch (error: any) {
        next(res.status(400).json({ message: error.message }))
    }
}

export const asociarCliente = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const newUser = await service.asociarCliente(Number(id), body);
        res.status(201).json({ mensaje: 'Cliente asociado con exito' })
    } catch (error: any) {
        next(res.status(400).json({ message: error.message }))
    }
}

//---------------------Metodos async de Parqueaderos------------------//

export const listarParqueadero = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const listparking = await service.listarParking()
        res.status(201).json(listparking)
    } catch (error: any) {
        next(res.status(400).json({ message: error.message }))
    }
}

export const crearParqueadero = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body;
        const createparking = await service.crearParking(body)
        res.status(201).json({ mensaje: 'Parqueadero creado con exito' })
    } catch (error: any) {
        next(res.status(400).json({ message: error.message }))
    }
}

export const actualizarParqueadero = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const updateparking = await service.ActualizarParking(Number(id), body)
        res.status(201).json({ mensaje: 'Actualizacion exitosa' })
    } catch (error: any) {
        next(res.status(400).json({ message: error.message }))
    }
}

export const findOneParqueadero = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const oneparking = await service.findOneParking(Number(id))
        res.status(201).json(oneparking)
    } catch (error: any) {
        next(res.status(400).json({ message: error.message }))
    }
}

export const eliminarParqueadero = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const deleteparking = await service.eliminarParking(Number(id))
        res.status(200).json({ mensaje: 'Eliminacion Exitosa' })
    } catch (error: any) {
        next(res.status(400).json({ message: error.message }))
    }
}

//---------------------Metodos async de Asociar parqueaderos a Socios------------------//

export const asociarParqueadero = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const asocParking = await service.asociarParking(Number(id), body);
        res.status(201).json({ mensaje: 'Parqueadero Asociado exitosamente' })
    } catch (error: any) {
        next(res.status(400).json({ message: error.message }))
    }
}

export const listarVehiculos = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const listvehicle = await service.listarVehiculos()
        res.status(201).json(listvehicle)
    } catch (error: any) {
        next(res.status(400).json({ message: error.message }))
    }
}

export const listarVehiculosParqueaderoDetalles = async (req: Request, res: Response, next: NextFunction) => {
  try {
      const {id} = req.params;
      const listvehicle = await service.listarVehiculosParqueaderoDetalle(Number(id))
      res.status(200).json(listvehicle)
  } catch (error: any) {
      next(res.status(400).json({ message: error.message }))
  }
}

export const listarVehiculosParqueadero = async (req: Request, res: Response, next: NextFunction) => {
  try {
      const {id} = req.params;
      const listvehicle = await service.listarVehiculosParqueadero(Number(id))
      res.status(200).json(listvehicle)
  } catch (error: any) {
      next(res.status(400).json({ message: error.message }))
  }
}



export const findOneVehiculo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { nombre } = req.params;
        const oneVehicle = await service.findOneVehiculos(nombre)
        res.status(201).json(oneVehicle)
    } catch (error: any) {
        next(res.status(400).json({ message: error.message }))
    }
}

export const findVehiculoSocio = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const findVehicle = await service.findVehiculosSocio(Number(id))
        res.status(201).json(findVehicle)
    } catch (error: any) {
        next(res.status(400).json({ message: error.message }))
    }
}

export const findclienteExiSocio = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const cantClient = await service.clienExiSocio(Number(id))
        res.status(201).json(cantClient)
    } catch (error: any) {
        next(res.status(400).json({ message: error.message }))
    }
}

export const listRegiVehiculo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const historial = await service.listHistoriVehiculo(Number(id), body)
        res.status(200).json(historial)
    } catch (error: any) {
        next(res.status(400).json({ message: error.message }))
    }
}

export const enviarMensajeSocios = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, placa, mensaje, idC } = req.body;
    const envMensaje = await service.enviarCorreoSocios(email, placa, mensaje, Number(idC));
    res.status(200).json(envMensaje)
  } catch (error: any) {
    next(res.status(400).json({ message: error.message }))
  }
}
