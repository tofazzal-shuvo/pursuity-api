import mongoose from "mongoose";

mongoose.Promise = global.Promise;
let dbUri = process.env.DATABASE_URL;

console.log("DATABASE URI: ", dbUri);
try {
  mongoose
    .connect(dbUri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    })
    .then((res) => console.log("connected"))
    .catch((err) => console.log(err));
} catch (err) {
  mongoose.createConnection(dbUri);
}

const info = mongoose.connections[0];

mongoose.connection
  .on("error", () => console.error("Unable to connect to database"))
  .on("close", () => console.log("Database connection closed.")) // eslint-disable-line no-console
  .once("open", () =>
    console.log(`Connected to ${info.host}:${info.port}/${info.name}`)
  );
