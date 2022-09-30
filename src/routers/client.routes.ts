import { Router } from "express";
import { TokenValidation, validarRolTokenCliente } from '../lib/verifyToken';
import * as client from '../controllers/client.controlles';

const router = Router();

router.post('/c-paking/member/:idS', TokenValidation, validarRolTokenCliente, client.registroEntrada);
router.post('/c-paking/:idP/vehicle', TokenValidation, validarRolTokenCliente, client.registroSalida);
router.get('/c-vehicle', TokenValidation, validarRolTokenCliente, client.listarVehiculos);
router.get('/c-vehicle/parking/:idP', TokenValidation, validarRolTokenCliente, client.listarUnVehiculo);

export default router;
