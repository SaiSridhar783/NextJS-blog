import { MongoClient } from "mongodb";

async function handler(req, res) {
  if (req.method === "GET") {
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
}

export default handler;
