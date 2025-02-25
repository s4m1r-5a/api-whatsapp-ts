import * as Baileys from "@whiskeysockets/baileys"; // Importa todo el módulo Baileys
import LeadExternal from "../../domain/lead-external.repository"; // Importa la interfaz LeadExternal
import pino from "pino"; // Importa pino para el logging

export class BaileysTransporter implements LeadExternal {
  private sessionName: string = "tokens/default"; // Nombre de la sesión
  public connection: Baileys.WASocket | null = null; // Conexión de Baileys
  public connectionState: Partial<Baileys.ConnectionState> | null = null; // Estado de la conexión
  private isEnd: boolean = false; // Indica si la conexión ha terminado
  private closedMessage: string = "Connection closed"; // Mensaje de conexión cerrada
  private onReady: Array<(connection: Baileys.WASocket) => void> = []; // Array de callbacks para cuando la conexión esté lista

  constructor(
    sessionName: string = "default",
    private baileys: typeof Baileys = Baileys
  ) {
    this.sessionName = `tokens/${sessionName}`; // Establece el nombre de la sesión
    this.start(); // Inicia la conexión
  }

  private async getAuth(): Promise<any> {
    // Obtiene la autenticación
    try {
      return await this.baileys.useMultiFileAuthState(this.sessionName);
    } catch (error) {
      console.log("Error obteniendo autenticación:", error);
    }
  }

  set onready(cb: (conection: Baileys.WASocket) => void) {
    // Establece un callback para cuando la conexión esté lista
    if (this.connectionState?.connection == "open") cb(this.connection!);
    this.onReady.push(cb);
  }

  async start(socketConfig: Baileys.UserFacingSocketConfig = {} as any) {
    // Inicia la conexión
    try {
      console.log("Iniciando la conexión...");
      const { saveCreds, state } = await this.getAuth();
      console.log("Credenciales obtenidas:", state);

      this.connection = this.baileys.makeWASocket({
        printQRInTerminal: true,
        browser: this.baileys.Browsers.macOS("Desktop"),
        //@ts-ignore
        logger: pino({ level: "silent" }),
        ...socketConfig,
        auth: socketConfig.auth || state,
      });

      this.connection.ev.on("creds.update", saveCreds);
      this.connection.ev.on("connection.update", (state) => {
        this.connectionState = state;
        console.log("Estado de la conexión:", state);

        if (state.qr) {
          console.log(
            `Por favor, escanea el código QR con tu aplicación de WhatsApp. ${this.sessionName}`
          );
        }
        if (state.connection === "open") {
          console.log("Conexión abierta");
          this.onReady.forEach((cb) => cb(this.connection!));
        }

        if (state.connection === "close") {
          console.log("Conexión cerrada");
          if (this.isEnd) {
            console.log(this.closedMessage);
            return;
          }
          !this.isEnd && this.reconnect();
        }
      });

      // Manejador de eventos para mensajes entrantes
      this.connection.ev.on("messages.upsert", async (messageUpdate) => {
        const messages = messageUpdate.messages;
        for (const msg of messages) {
          if (!msg.key.fromMe && msg.message) {
            const messageContent =
              msg.message.conversation || msg.message.extendedTextMessage?.text;
            const sender = msg.key.remoteJid;
            console.log(`Mensaje recibido de ${sender}: ${messageContent}`);
            // Aquí puedes agregar lógica adicional para manejar el mensaje entrante
          }
        }
      });
    } catch (error) {
      console.error("Error al iniciar la conexión:", error);
    }
  }

  end() {
    // Termina la conexión
    this.isEnd = true;
    this.connection?.end(undefined);
  }

  private reconnect(socketConfig: Baileys.UserFacingSocketConfig = {} as any) {
    // Reconecta la conexión
    console.log("Intentando reconectar...");
    this.start(socketConfig);
  }

  async sendMsg({
    message,
    phone,
  }: {
    message: string;
    phone: string;
  }): Promise<any> {
    // Envía un mensaje
    try {
      const response = await this.connection?.sendMessage(phone + "@c.us", {
        text: message,
      });
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteSession(): Promise<void> {
    try {
      const fs = require("fs");
      const path = require("path");
      const sessionPath = path.resolve(this.sessionName);
      if (fs.existsSync(sessionPath)) {
        fs.rmSync(sessionPath, { recursive: true, force: true });
        console.log(`Session ${this.sessionName} deleted successfully.`);
      } else {
        console.log(`Session ${this.sessionName} does not exist.`);
      }
    } catch (error) {
      console.error(`Failed to delete session ${this.sessionName}:`, error);
    }
  }
}
