import dotenv from "dotenv/config";
import { MongoClient } from "mongodb";

const URL = process.env.MONGODB_URL;

const client = new MongoClient(URL);

const db = client.db("candy");



export default {
    users: db.collection("users"),
    candyTypes: db.collection("candy_types"),
    gummyBears: db.collection("gummyBears"),

};