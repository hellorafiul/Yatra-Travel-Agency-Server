const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors')
const bodyParser = require('body-parser')
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.komfq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const CustomPackage = client.db("Yatra").collection("services");

    // Adding Custom Package
    app.post("/addCustomPackage", async (req, res) => {
      const result = await CustomPackage.insertOne(req.body);
      res.send(result)
    })

    // Load all packages in the service component 
    app.get('/productServices', async (req, res) => {
      const result = await CustomPackage.find({}).toArray()
      res.send(result)
    })


    //Delete Packages 
    app.delete('/deleteService/:id', async (req, res) => {
      result = await CustomPackage.deleteOne({ _id: ObjectId(req.params.id) })
      res.send(result)
    })

    // My order/packages
    app.get('/bookNow/:email', async (req, res) => {
      const result = await CustomPackage.find({ email: req.params.email }).toArray();
      res.send(result)
    })

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Running server from crud')
});

app.listen(port, () => {
  console.log('Our running port is', port)
})