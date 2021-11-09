import { MongoClient, ObjectId } from "mongodb";

async function handler(req, res) {
	let client;
	const databaseUrl = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@cluster0.dipfo.mongodb.net/${process.env.mongodb_database}?retryWrites=true&w=majority`;

	try {
		client = await MongoClient.connect(databaseUrl, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
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
		} catch (error) {
			client.close();
			res.status(500).json({ message: "Storing Message Failed!" });
			return;
		}

		client.close();

		res.status(201).json({
			message: "Successfully Retrieved messages!",
			data: allData,
		});
	}

	if (req.method === "DELETE") {
		const { messageId } = req.body;
		let resp = {};

		try {
			resp = await db
				.collection("messages")
				.deleteOne({ _id: new ObjectId(messageId) });

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
