/**
 * Este archivo define la interfaz `LeadExternal`, que especifica el método para enviar mensajes a través de un servicio externo.
 */
export default interface LeadExternal {
    sendMsg({message, phone}:{message:string, phone:string}):Promise<any> // Método para enviar un mensaje
}