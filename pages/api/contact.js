import { MongoClient } from "mongodb";

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
    };

    let client;

    try {
      client = await MongoClient.connect(
        "mongodb://sai:skgkmkg783@cluster0-shard-00-00.dipfo.mongodb.net:27017,cluster0-shard-00-01.dipfo.mongodb.net:27017,cluster0-shard-00-02.dipfo.mongodb.net:27017/my-site?ssl=true&replicaSet=atlas-jzsi0n-shard-0&authSource=admin&retryWrites=true&w=majority"
      );
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
