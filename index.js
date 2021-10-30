const express = require ('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()


const app = express();
const port = process.env.PORT || 5000;

// user: TourWithJorj
// pass: foAygaHWSih4goPb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.45msy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('tourPlan');
        const servicesCollection = database.collection('services');

        // Post APi
         app.post('/services',async(req,res)=>{
            const service = {
                "name":"Coxs Bazar",
        "price":10000,
        "location":"Chittagong",
        "duration":"3 days",
        "description":"It is famous mostly for its long natural sandy beach. It is located 150 km (93 mi) south of the city of Chittagong. Cox's Bazar is also known by the name Panowa ...",
        "img":"https://i.ibb.co/D9kSYPN/place-4.jpg"
            }

            const result = await servicesCollection.insertOne(service);
            console.log(result);
         });

    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);

// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

app.get('/',(req,res) =>{
    res.send('Tour plan is runnig');
});

app.listen(port, ()=>{
    console.log('Listening to port',port);
});