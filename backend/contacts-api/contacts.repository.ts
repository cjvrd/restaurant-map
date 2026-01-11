import { db } from "../db";
import { ContactReq } from "./contacts.controller";

export const ContactRepository = {
  getAllContacts: async () =>
    db
      .selectFrom("Contact")
      .selectAll()
      .where("status", "=", "ENABLED")
      .execute(),

  createNewContact: async (contact: ContactReq) =>
    db
      .insertInto("Contact")
      .values({
        first_name: contact.first_name,
        last_name: contact.last_name,
        email: contact.email,
        phone: contact.phone,
        notes: contact.notes,
        updated_time: new Date(),
      })
      .returningAll()
      .executeTakeFirst(),

  deleteContact: async (id: string) =>
    db
      .updateTable("Contact")
      .set({ status: "DELETED", updated_time: new Date() })
      .where("id", "=", Number(id))
      .returningAll()
      .executeTakeFirst(),

  verifyContact: async (id: string) =>
    db
      .updateTable("Contact")
      .set({ verified: true, updated_time: new Date() })
      .where("id", "=", Number(id))
      .returningAll()
      .executeTakeFirst(),
};
