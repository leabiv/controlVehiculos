import { Router } from "express";
import * as auth from '../controllers/auth.controlles';
import { TokenValidation, validarRolTokenSocio, validarRolTokenCliente } from '../lib/verifyToken';
const router = Router();

router.post('/signin', auth.signin)
router.get('/profile', TokenValidation, auth.profile)

export default router;
  