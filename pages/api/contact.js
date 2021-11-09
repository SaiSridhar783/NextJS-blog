import { MongoClient } from "mongodb";
import { format } from "date-fns";

async function handler(req, res) {
  if (req.method === "POST") {
    const { email, name, message } = req.body;

    if (
      !email ||
      !email.includes("@") ||
      !name ||
      name.trim() === "" ||
      !message ||
      message.trim() === ""
    ) {
      res.status(422).json({ message: "Invalid Input" });
      return;
    }

    const newMessage = {
      email,
      name,
      message,
      date: format(new Date(), "PPPppp"),
    };

    let client;

    const databaseUrl = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@cluster0.dipfo.mongodb.net/${process.env.mongodb_database}?retryWrites=true&w=majority`

    try {
      client = await MongoClient.connect(databaseUrl, {
        useUnifiedTopology: true,
      });
    } catch (error) {
      res.status(500).json({ message: "Could not connect to database." });
      return;
    }

    const db = client.db();

    try {
      const result = await db.collection("messages").insertOne(newMessage);
      newMessage.id = result.insertedId;
    } catch (error) {
      client.close();
      res.status(500).json({ message: "Storing Message Failed!" });
      return;
    }

    client.close();

    res
      .status(201)
      .json({ message: "Successfully sent message!", data: newMessage });
  }
}

export default handler;
