// Mongodb
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
// app
const express = require('express');
const cors = require('cors');
require('dotenv').config();



const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {
  res.send('Hello World!')
});

// application database connection 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a7zq8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// database api funcion

async function run() {
  try {
    await client.connect();
    // database name
    const database = client.db("travele");
    // collections
    const packageCollection = database.collection("popular-package");
    const bookingCollection = database.collection("booking-list");

    /**
     *  API
     */

    // post api to add new package
    app.post('/add-package', async (req, res) => {

      const data = req.body;
      // insert to db
      const result = await packageCollection.insertOne(data);
      //  send res
      res.json(result);
    });

    // GET api to load  package
    app.get('/our-packages', async (req, res) => {

      const cursor = packageCollection.find({});
      // get from db
      const data = await cursor.toArray();
      //  send res
      res.json(data);
    });


    // POST api to insert  booking
    app.post('/booking', async (req, res) => {

      const data = req.body;
      // insert to db
      const result = await bookingCollection.insertOne(data);
      //  send res
      res.json(result);
    });

    // GET api for getting Booking List
    app.get('/booking', async (req, res) => {

      const result = bookingCollection.find({});
      const data = await result.toArray();

      res.json(data);
    });



    // GET api for getting Booking List by user
    app.get('/booking/:userMail', async (req, res) => {

      const userEmai = req.params.userMail;
      
      const result = bookingCollection.find({bookedBy: userEmai});
      const data = await result.toArray();
      res.json(data);
    });

    // DElETE BOOKING API
    app.delete('/booking/cancel/:id', async (req,res)=>{
      
      const userId = req.params.id;

      const query = { _id: ObjectId('617fa91312d8beb00803e7df') }
      const result = await bookingCollection.deleteOne(query);

      if(result){
        res.json(result);
      }
    })



    // create a document to insert
    const doc = {
      title: "test",
      content: "No bytes, no problem. Just insert a document, in MongoDB",
    }
    //const result = await haiku.insertOne(doc);







    console.log(`A document was inserted with the _id: ${result.insertedId}`);






  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);





app.listen(port, () => {
  console.log(`Travele app listening at http://localhost:${port}`)
})