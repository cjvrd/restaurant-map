import { queryOptions, useQuery } from "@tanstack/react-query";
import { API_URL } from "./constants";

export type Contact = {
  id: number;
  created_time: string | Date;
  updated_time: string | Date;
  status: "ENABLED" | "DISABLED" | "DELETED";
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  notes: string | null;
  verified: boolean;
};

const ContactQueries = {
  getAllContacts: () =>
    queryOptions<Contact[]>({
      queryKey: ["contacts"],
      queryFn: async (): Promise<Contact[]> => {
        const response = await fetch(`${API_URL}/contacts`);
        if (response.status !== 200)
          throw new Error("Failed to get contacts list");
        const contacts: Contact[] = await response.json();
        return contacts;
      },
    }),
};

export const useGetAllContacts = () =>
  useQuery(ContactQueries.getAllContacts());
