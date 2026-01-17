import express from "express";
import cors from "cors";
import contactsRouter from "./contacts-api/contacts.routes";
import restaurantsRouter from "./restaurants-api/restaurants.routes";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use("/contacts", contactsRouter);
app.use("/restaurants", restaurantsRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
