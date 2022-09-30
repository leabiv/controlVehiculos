import { Router } from "express";
import { TokenValidation, validarRolTokenAdmin } from '../lib/verifyToken';
import * as admin from '../controllers/admin.controlles'

const router = Router();
/*endpoint*/
router.get('/users', TokenValidation, validarRolTokenAdmin, admin.allUsers);
router.post('/users', TokenValidation, validarRolTokenAdmin, admin.createUsers);
router.post('/users/:id', TokenValidation, validarRolTokenAdmin, admin.asociarCliente);

// /*endpoint*/
router.get('/parking', TokenValidation, validarRolTokenAdmin, admin.listarParqueadero);
router.post('/parking', TokenValidation, validarRolTokenAdmin, admin.crearParqueadero);
router.put('/parking/:id', TokenValidation, validarRolTokenAdmin, admin.actualizarParqueadero);
router.get('/parking/:id', TokenValidation, validarRolTokenAdmin, admin.findOneParqueadero);
router.delete('/parking/:id', TokenValidation, validarRolTokenAdmin, admin.eliminarParqueadero);

// /*endpoint*/
router.put('/member/:id', TokenValidation, validarRolTokenAdmin, admin.asociarParqueadero);
router.get('/vehicle', TokenValidation, validarRolTokenAdmin, admin.listarVehiculos);
router.get('/vehicle/:nombre', TokenValidation, validarRolTokenAdmin, admin.findOneVehiculo);
router.get('/vehicle/member/:id', TokenValidation, validarRolTokenAdmin, admin.findVehiculoSocio);

// /*endpoint*/
router.get('/member/:id/client', TokenValidation, validarRolTokenAdmin, admin.findclienteExiSocio);
router.get('/parking/register/:id', TokenValidation, validarRolTokenAdmin, admin.listRegiVehiculo);

export default router;
