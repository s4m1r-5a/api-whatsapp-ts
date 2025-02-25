import { Lead } from "./lead"; // Importa la clase Lead

/**
 * Esta la interfaz que debe de cumplir el repositorio de infraestructura
 * mysql o mongo o etc
 */
export default interface LeadRepository {
  save({
    message,
    phone,
  }: {
    message: string;
    phone: string;
  }): Promise<Lead | undefined | null>; // Método para guardar un Lead
  getDetail(id:string):Promise<Lead | null | undefined> // Método para obtener los detalles de un Lead
}

/**
 * Este archivo define la interfaz `LeadRepository`, que especifica los métodos que deben implementar los repositorios de datos.
 */
