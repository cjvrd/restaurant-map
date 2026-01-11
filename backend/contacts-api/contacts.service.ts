import { ContactRepository } from "./contacts.repository";
import { ContactReq } from "./contacts.controller";

export const ContactService = {
  getContacts: async () => ContactRepository.getAllContacts(),

  addContact: async (contact: ContactReq) =>
    ContactRepository.createNewContact(contact),

  deleteContact: async (id: string) => ContactRepository.deleteContact(id),

  verifyContact: async (id: string) => ContactRepository.verifyContact(id),
};
