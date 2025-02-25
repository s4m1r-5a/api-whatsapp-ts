import LeadExternal from "../domain/lead-external.repository"; // Importa LeadExternal
import LeadRepository from "../domain/lead.repository"; // Importa LeadRepository

export class LeadCreate {
  private leadRepository: LeadRepository; // Repositorio de Lead
  private leadExternal: LeadExternal; // Servicio externo de Lead
  constructor(respositories: [LeadRepository, LeadExternal]) {
    const [leadRepository, leadExternal] = respositories; // Desestructura los repositorios
    this.leadRepository = leadRepository; // Establece el repositorio de Lead
    this.leadExternal = leadExternal; // Establece el servicio externo de Lead
  }

  public async sendMessageAndSave({
    message,
    phone,
  }: {
    message: string;
    phone: string;
  }) {
    const responseDbSave = await this.leadRepository.save({ message, phone }); // Guarda el Lead en la base de datos
    const responseExSave = await this.leadExternal.sendMsg({ message, phone }); // Envía el mensaje a través del servicio externo
    return {responseDbSave, responseExSave}; // Retorna las respuestas
  }
}
