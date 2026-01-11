import { Request, Response } from "express";
import { ContactService } from "./contacts.service";
import { z } from "zod";

const zContactReq = z.object({
  first_name: z.string().min(1, "first_name is required"),
  last_name: z.string().min(1, "last_name is required"),
  email: z.email("invalid email address"),
  phone: z
    .string()
    .regex(/^(?:\+61|0)4(?:[ -]?\d){8}$/, "invalid phone number"),
  notes: z.string().max(1000).nullable(),
});

export type ContactReq = z.infer<typeof zContactReq>;

export const ContactController = {
  getContacts: async (req: Request, res: Response) => {
    try {
      const contacts = await ContactService.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  },

  addContact: async (req: Request, res: Response) => {
    try {
      const parsed = zContactReq.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid request body" });
      }

      const result = await ContactService.addContact(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to add contact" });
    }
  },

  deleteContact: async (req: Request, res: Response) => {
    try {
      const result = await ContactService.deleteContact(req.params.id);
      if (!result) return res.status(404).json({ error: "Contact not found" });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to delete contact" });
    }
  },

  verifyContact: async (req: Request, res: Response) => {
    try {
      const result = await ContactService.verifyContact(req.params.id);
      if (!result) return res.status(404).json({ error: "Contact not found" });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to verify contact" });
    }
  },
};
