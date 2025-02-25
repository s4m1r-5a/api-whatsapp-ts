import express, { Router } from "express"; // Importa express y el tipo Router
import LeadCtrl from "../controller/lead.ctrl"; // Importa el controlador LeadCtrl
import container from "../ioc"; // Importa el contenedor de inyección de dependencias
const router: Router = Router(); // Crea una nueva instancia de Router

/**
 * http://localhost/lead POST
 */
// const leadCtrl: LeadCtrl = container.get("lead.ctrl"); // Obtiene una instancia de LeadCtrl desde el contenedor
// router.post("/", leadCtrl.sendCtrl); // Define una ruta POST en "/" que utiliza el método sendCtrl del controlador
router.post("/", () => console.log('todo bien')); // Define una ruta POST en "/" que utiliza el método sendCtrl del controlador

export { router }; // Exporta el router
