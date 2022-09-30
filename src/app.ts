import "dotenv/config";
import express from "express";
import cors from "cors";
import  adminrouter  from "./routers/admin.routes"
import  memberouter  from "./routers/member.routes"
import  clientrouter  from "./routers/client.routes"
import authrouter from './routers/auth.routes';

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/app/login', authrouter);
app.use("/app/admin", adminrouter);
app.use("/app/member", memberouter);
app.use("/app/client", clientrouter);


app.listen(PORT, () => {
    console.log(`Conexion exitosa puerto ${PORT}`)
});
