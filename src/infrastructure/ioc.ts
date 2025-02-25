import { ContainerBuilder } from "node-dependency-injection"; // Importa ContainerBuilder para la inyección de dependencias
// import * as Baileys from "@whiskeysockets/baileys";
import { LeadCreate } from "../application/lead.create"; // Importa LeadCreate
import LeadCtrl from "./controller/lead.ctrl"; // Importa LeadCtrl
// import MetaRepository from "./repositories/meta.repository";
import MockRepository from "./repositories/mock.repository"; // Importa MockRepository
// import TwilioService from "./repositories/twilio.repository";
// import WsTransporter from "./repositories/ws.external";
// import { VenomTransporter } from "./repositories/venom.repository";
import { BaileysTransporter } from "./repositories/baileys.repository"; // Importa BaileysTransporter

const container = new ContainerBuilder(); // Crea una nueva instancia de ContainerBuilder

/**
 * Inicamos servicio de WS / Bot / Twilio
 */
container.register("ws.transporter", BaileysTransporter); // Registra BaileysTransporter en el contenedor
const wsTransporter = container.get("ws.transporter"); // Obtiene una instancia de BaileysTransporter

container.register("db.repository", MockRepository); // Registra MockRepository en el contenedor
const dbRepository = container.get("db.repository"); // Obtiene una instancia de MockRepository

container
  .register("lead.creator", LeadCreate) // Registra LeadCreate en el contenedor
  .addArgument([dbRepository, wsTransporter]); // Añade argumentos al constructor de LeadCreate

const leadCreator = container.get("lead.creator"); // Obtiene una instancia de LeadCreate

container.register("lead.ctrl", LeadCtrl).addArgument(leadCreator); // Registra LeadCtrl en el contenedor y añade argumentos

export default container; // Exporta el contenedor
