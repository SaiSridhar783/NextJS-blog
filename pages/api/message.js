import mongodb, { MongoClient } from "mongodb";

async function handler(req, res) {
  let client;
  const databaseUrl = `mongodb://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_clustername}-shard-00-00.dipfo.mongodb.net:27017,${process.env.mongodb_clustername}-shard-00-01.dipfo.mongodb.net:27017,${process.env.mongodb_clustername}-shard-00-02.dipfo.mongodb.net:27017/${process.env.mongodb_database}?ssl=true&replicaSet=atlas-jzsi0n-shard-0&authSource=admin&retryWrites=true&w=majority`;

  try {
    client = await MongoClient.connect(databaseUrl, {
      useUnifiedTopology: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Could not connect to database." });
    return;
  }

  const db = client.db();

  if (req.method === "GET") {
    let allData;

    try {
      allData = await db.collection("messages").find({}).toArray();
      //console.log(allData)
    } catch (error) {
      client.close();
      res.status(500).json({ message: "Storing Message Failed!" });
      return;
    }

    client.close();

    res
      .status(201)
      .json({ message: "Successfully Retrieved messages!", data: allData });
  }

  if (req.method === "DELETE") {
    const { messageId } = req.body;
    let resp = {};

    try {
      resp = await db
        .collection("messages")
        .deleteOne({ _id: new mongodb.ObjectID(messageId) });

      if (resp.deletedCount === 0) throw new Error("ID not found");
    } catch (error) {
      client.close();
      res.status(500).json({
        message: "Deleting Message Failed!",
        resp,
      });
      return;
    }

    client.close();

    res.status(201).json({ message: "Deleted message!", resp });
  }
}

export default handler;
