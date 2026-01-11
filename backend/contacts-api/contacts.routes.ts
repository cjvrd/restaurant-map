import { Router } from "express";
import { ContactController } from "./contacts.controller";

const contactsRouter = Router();

//Get All Contacts
contactsRouter.get("/", ContactController.getContacts);

//Add New Contact
contactsRouter.post("/", ContactController.addContact);

//Delete Contact
contactsRouter.delete("/:id", ContactController.deleteContact);

//Verify Contact
contactsRouter.patch("/:id", ContactController.verifyContact);

export default contactsRouter;
