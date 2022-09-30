import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthService } from '../services/auth.service';

const service = new AuthService();

interface IPayload {
  findUser: [{
    id: number,
    email: string,
    rol: string,
  }];
  iat: number;
  exp: number;
}

export const TokenValidation = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('auth-token');
  if (!token) {
    return res.status(401).json('Acceso Denegado');
  }
  const payload = jwt.verify(token, process.env.TOKEN_SECRET || 'tokentest') as IPayload;
  console.log(payload.findUser[0]?.id);
  console.log(payload.findUser[0]?.rol);

  req.body.userId = payload.findUser[0]?.id;
  req.body.userRol = payload.findUser[0]?.rol;
  next();
}

export const validarRolTokenSocio = async (req: Request, res: Response, next: NextFunction)=> {
  const findSocio = await service.findOneSocio(req.body.userId, req.body.userRol);
  if(!findSocio) return res.status(400).jsonp({message: "No tiene privilegios de socio"});
  next();
}

export const validarRolTokenCliente = async (req: Request, res: Response, next: NextFunction)=> {
  const findCliente = await service.findOneCliente(req.body.userId, req.body.userRol);
  if(!findCliente) return res.status(400).jsonp({message: "No tiene privilegios de cliente"});
  next();
}

export const validarRolTokenAdmin = async (req: Request, res: Response, next: NextFunction)=> {
  const findCliente = await service.findOneAdmin(req.body.userId, req.body.userRol);
  if(!findCliente) return res.status(400).jsonp({message: "Admin no encontrado"});
  next();
}

