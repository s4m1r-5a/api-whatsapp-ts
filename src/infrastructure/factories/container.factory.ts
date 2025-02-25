import { ContainerBuilder } from "node-dependency-injection";
import { LeadCreate } from "../../application/lead.create";
import LeadCtrl from "../controller/lead.ctrl";
import MockRepository from "../repositories/mock.repository";
import { BaileysTransporter } from "../repositories/baileys.repository";
// import { saveSessionToDB } from "../services/session.service"; // Importa el servicio para guardar sesiones

export function createContainer(sessionName: string) {
  const container = new ContainerBuilder();

  container.register("ws.transporter", BaileysTransporter).addArgument(sessionName);
  const wsTransporter = container.get("ws.transporter");

  container.register("db.repository", MockRepository);
  const dbRepository = container.get("db.repository");

  container
    .register("lead.creator", LeadCreate)
    .addArgument([dbRepository, wsTransporter]);

  const leadCreator = container.get("lead.creator");

  container.register("lead.ctrl", LeadCtrl).addArgument(leadCreator);

   // Guarda la sesión en la base de datos
  //  saveSessionToDB(sessionName);

  return container;
}
