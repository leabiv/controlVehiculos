import { Router } from "express";
import { TokenValidation, validarRolTokenSocio} from '../lib/verifyToken';
import * as member from '../controllers/member.controlles';

const router = Router();

router.post('/m-client', TokenValidation, validarRolTokenSocio, member.crearCliente);
router.post('/:id/m-client', member.asociarCliente);

router.get('/m-vehicles', TokenValidation, validarRolTokenSocio, member.listarParqueaderos);
router.get('/m-vehicles/:placa', TokenValidation, validarRolTokenSocio, member.detalleParqueaderos);

router.get('/m-parking', TokenValidation, validarRolTokenSocio, member.usandoParqueadero);
router.get('/m-parking/usandoPa', TokenValidation, validarRolTokenSocio, member.noUsandoParqueadero);
router.get('/m-parking/usandoPa/:idCliente', TokenValidation, validarRolTokenSocio, member.listarVehiculoPorCliente);
router.get('/m-parking/usandoPa/:idC/vehicle/:placa', TokenValidation, validarRolTokenSocio, member.listarDetalleVehiculo);
router.get('/m-parking/:id', TokenValidation, validarRolTokenSocio, member.listarRegisVehiculo);
router.get('/m-parking/:idP/promedio', TokenValidation, validarRolTokenSocio, member.promedioRangoFechas);

router.get('/m-parking/old', TokenValidation, validarRolTokenSocio, member.verifVehiculosNoPrimVez);
router.get('/m-parking/new', TokenValidation, validarRolTokenSocio, member.verifiVehiParqNuevo);

router.get('/m-parkings/promedio', TokenValidation, validarRolTokenSocio, member.promedioTodosPasqueadero)

export default router;
