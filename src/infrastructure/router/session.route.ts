import { Router } from "express";
import { createContainer } from "../factories/container.factory";
// import {
//   getSessionsFromDB,
//   deleteSessionFromDB,
// } from "../services/session.service";

const router = Router();
const containers: { [key: string]: any } = {}; // Objeto para almacenar las instancias de contenedores

// Restaurar sesiones al iniciar la aplicación
// (async () => {
//   const sessions = await getSessionsFromDB();
//   sessions.forEach((session) => {
//     const newContainer = createContainer(session.sessionName);
//     const leadCtrl = newContainer.get("lead.ctrl");
//     containers[session.sessionName] = leadCtrl;
//     router.post(`/bot/${session.sessionName}/send`, leadCtrl.sendCtrl);
//   });
// })();

router.post("/create", async (req, res) => {
  const { sessionName } = req.body;
  if (!sessionName) {
    return res.status(400).send({ error: "Falta sessionName" });
  }
  const newContainer = createContainer(sessionName);
  const leadCtrl = newContainer.get("lead.ctrl");
  containers[sessionName] = leadCtrl;

  router.post(`/bot/${sessionName}/send`, leadCtrl.sendCtrl);
  router.get(`/bot/${sessionName}/send`, async (req, res) => {
    console.log('todo bien si llego hata aqui');
    return res.send({ message: `Instancia creada para: ${sessionName}, samyr todo esta bien` });
  });
  return res.send({ message: `Instancia creada para: ${sessionName}` });
});

// Endpoint para eliminar sesiones inactivas
router.post("/delete", async (req, res) => {
  const { sessionName } = req.body;
  if (!sessionName) {
    return res.status(400).send({ error: "Falta sessionName" });
  }
//   await deleteSessionFromDB(sessionName);
  delete containers[sessionName];
  return res.send({ message: `Instancia eliminada para: ${sessionName}` });
});

export { router };
