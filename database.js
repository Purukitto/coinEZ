let client;
const MongoClient = require("mongodb").MongoClient;
const uri = process.env.MONGOURI;
async function connectDB() {
    client = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ignoreUndefined: true,
    });
    console.log("✔️  Connected to Database");
    return client;
}
async function getClient() {
    if (!client) {
        await connectDB();
    }
    return client;
}

module.exports = { connectDB, getClient };