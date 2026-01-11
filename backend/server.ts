import express from "express";
import cors from "cors";
import contactsRouter from "./contacts-api/contacts.routes";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use("/contacts", contactsRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
