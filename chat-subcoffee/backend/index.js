import express from "express";
import bodyParser from "body-parser";
import rutNotificaciones from "./src/routes/notificaciones.routes.js";
import routerChat from "./src/routes/chat.routes.js";
import rutasSubastas from "./src/routes/subasta.routes.js";
import postulantesRoutes from "./src/routes/postulantes.routes.js";
import autenticacionRouter from "./src/routes/autenticacion.routes.js";
import cors from 'cors';
import routerUser from "./src/routes/user.routes.js";
import routerVereda from "./src/routes/veredas.routes.js";
import routerDepart from "./src/routes/departamento.routes.js"
import routerMunicipio from "./src/routes/municipio.routes.js"
import routerFinca from "./src/routes/finca.routes.js"
import routerVariedad from "./src/routes/variedad.routes.js"
import routertipovari from "./src/routes/tipovariedad.routes.js"
import ofertasRoutes from "./src/routes/ofertas.routes.js";
import { Server as SocketServer } from "socket.io";
import http from "http";
import { pool } from "./src/databases/conexion.js";

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, { cors: { origin: "*" } });

app.use(cors());
const PORT = 4000
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/auth", autenticacionRouter)
app.use("/v1", routerUser);
app.use("/v1", routerDepart);
app.use("/v1", routerVereda);
app.use("/v1", routerMunicipio);
app.use("/v1", routerFinca);
app.use("/v1", routertipovari);
app.use("/v1", routerVariedad);
app.use("/v1", rutasSubastas);
app.use("/user", routerChat);
app.use("/v1", rutNotificaciones);
app.use("/v1", postulantesRoutes);
app.use("/v1", ofertasRoutes);

app.get('/public/fincas/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  res.sendFile(path.join(__dirname, 'fincas', imageName));
});

app.set("view engine", "ejs");
app.set("views", "./view");
app.use(express.static('./public'))

app.get("/documents", (req, res) => {
  res.render("documentacion.ejs");
});

// Función para guardar un mensaje en la base de datos
async function guardarMensaje(mensaje, remitente, idSubasta) {
  try {
    const connection = await pool.getConnection();
    const query = "INSERT INTO chat (mensaje_chat, fk_id_usuario, fk_id_subasta) VALUES (?, ?, ?)";
    const [result] = await connection.query(query, [mensaje, remitente, idSubasta]);
    console.log("Mensaje guardado en la base de datos");
    connection.release();
  } catch (error) {
    console.error("Error al guardar el mensaje en la base de datos: ", error);
  }
}

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("message", async (data) => {
    const { mensaje, remitente, idSubasta } = data;
    await guardarMensaje(mensaje, remitente, idSubasta);
    io.emit("message", { body: mensaje, from: remitente });
  });
});

server.listen(PORT, () => {
  console.log("Servidor se está ejecutando en el puerto: ", PORT);
});