//console.log('May Node be with you')

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;

const connectionString =
  "mongodb+srv://cuong:12345678a@atlascluster.43xuzhs.mongodb.net/ToyStore?retryWrites=true&w=majority";

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected to Database");

    const db = client.db("Toys-Store");
    const quotesCollection = db.collection("quotes");

    app.get('/CSS/styles.css', (req, res) => {
      const filePath = __dirname + '/Public/CSS/styles.css';
      res.sendFile(filePath);
    });

    app.set("view engine", "ejs");
        app.set("views", __dirname + "/views");


    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static("public"));
    app.use(bodyParser.json());

    app.get("/", (req, res) => {
      db.collection("quotes")
        .find()
        .toArray()
        .then((results) => {
          res.render("index.ejs", { quotes: results });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send("Internal Server Error");
        });
    });

    app.post("/quotes", (req, res) => {
      quotesCollection
        .insertOne(req.body)
        .then((result) => {
          console.log("Product added:", req.body);
          res.redirect("/");
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send("Internal Server Error");
        });
    });

    app.post("/quotes/:id/delete", (req, res) => {
      const quoteId = req.params.id;
      quotesCollection
        .deleteOne({ _id: new ObjectID(quoteId) })
        .then((result) => {
          console.log("Product deleted:", quoteId);
          res.redirect("/");
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send("Internal Server Error");
        });
    });

    app.listen(4000, () => {
      console.log("Server is running on port 4000");
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
