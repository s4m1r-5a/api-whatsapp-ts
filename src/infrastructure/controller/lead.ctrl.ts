import { Request, Response } from "express"; // Importa Request y Response de express
import { LeadCreate } from "../../application/lead.create"; // Importa LeadCreate

class LeadCtrl {
  constructor(private readonly leadCreator: LeadCreate) {} // Constructor que recibe una instancia de LeadCreate

  public sendCtrl = async ({ body }: Request, res: Response) => {
    // Método para manejar solicitudes POST
    const { message, phone } = body; // Extrae message y phone del cuerpo de la solicitud
    const response = await this.leadCreator.sendMessageAndSave({ message, phone }) // Llama a sendMessageAndSave de LeadCreate
    res.send(response); // Envía la respuesta
  };
}

export default LeadCtrl; // Exporta LeadCtrl
