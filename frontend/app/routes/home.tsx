import type { Route } from "./+types/contact-list";

export function loader() {
  return { name: "Contact List" };
}

export default function ContactList({}: Route.ComponentProps) {
  return (
    <div className="text-center p-4">
      <h1 className="text-2xl">Hello!</h1>
      <h1 className="text-2xl"></h1>
      <br></br>
      <h1 className="text-xl">
        This is an example contact us app, please click either the Contact List
        or Contact Us buttons on the top right.
      </h1>
    </div>
  );
}
