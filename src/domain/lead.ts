import { v4 as uuid } from "uuid"; // Importa la función uuid de uuid

export class Lead {
  readonly uuid: string; // Identificador único
  readonly message: string; // Mensaje
  readonly phone: string; // Número de teléfono

  constructor({ message, phone }: { message: string; phone: string }) {
    this.uuid = uuid(); // Genera un UUID
    this.message = message; // Establece el mensaje
    this.phone = phone; // Establece el número de teléfono
  }
}
