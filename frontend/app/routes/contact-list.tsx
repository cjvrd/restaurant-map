import { useGetAllContacts } from "~/api/queries";
import { useDeleteContact, useVerifyContact } from "~/api/mutations";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { UserIcon, CheckCircle2Icon, MailIcon, PhoneIcon } from "lucide-react";

export default function ContactList() {
  const { data: contacts, status } = useGetAllContacts();
  const deleteContact = useDeleteContact();
  const verifyContact = useVerifyContact();

  // Loading state
  if (status === "pending") {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-6" />
        <span className="ml-2 text-muted-foreground">Loading contacts…</span>
      </div>
    );
  }

  // Empty state
  if (!contacts || contacts.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-semibold text-center">Contact List</h1>
        <p className="text-center text-muted-foreground mt-4">
          No contacts found.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold text-center">Contact List</h1>

      <div className="mt-8 overflow-x-auto rounded border">
        <table className="min-w-full divide-y">
          <thead className="bg-muted/30">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Phone</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Notes</th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {[...contacts]
              .sort((a, b) => a.id - b.id)
              .map((contact) => (
                <tr key={contact.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <UserIcon className="size-4 text-muted-foreground" />
                      <span className="font-medium">
                        {contact.first_name} {contact.last_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <MailIcon className="size-4 text-muted-foreground" />
                      <span className="text-sm">{contact.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="size-4 text-muted-foreground" />
                      <span className="text-sm">{contact.phone}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {contact.notes ? (
                      <span
                        className="block max-w-[20ch] truncate text-sm"
                        title={contact.notes ?? undefined}
                      >
                        {contact.notes}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {contact.verified ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-800 px-2 py-0.5 text-xs font-medium">
                        <CheckCircle2Icon className="size-3" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 text-yellow-800 px-2 py-0.5 text-xs font-medium">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {!contact.verified && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() =>
                            verifyContact.mutate(contact.id.toString())
                          }
                        >
                          Verify
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          deleteContact.mutate(contact.id.toString())
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
