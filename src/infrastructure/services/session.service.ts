// import { MongoClient } from "mongodb";

// const url = "mongodb://localhost:27017";
// const dbName = "whatsappSessions";
// const client = new MongoClient(url);

// export async function saveSessionToDB(sessionName: string) {
//   await client.connect();
//   const db = client.db(dbName);
//   const collection = db.collection("sessions");
//   await collection.insertOne({ sessionName, createdAt: new Date() });
// }

// export async function getSessionsFromDB() {
//   await client.connect();
//   const db = client.db(dbName);
//   const collection = db.collection("sessions");
//   return await collection.find({}).toArray();
// }

// export async function deleteSessionFromDB(sessionName: string) {
//   await client.connect();
//   const db = client.db(dbName);
//   const collection = db.collection("sessions");
//   await collection.deleteOne({ sessionName });
// }
