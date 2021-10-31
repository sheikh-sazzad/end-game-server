const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;



const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();


//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jg5bl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {

    try {
        await client.connect();
        const database = client.db('FoobDelivery');
        const deliveryCollection = database.collection('deliveryItems');
        const orderCollection = database.collection('AllOrder');

        //get product api
        app.get('/deliveryItems', async (req, res) => {
            const cursor = deliveryCollection.find({});
            const deliveryItems = await cursor.toArray();
            res.send(deliveryItems);
        })


        //POST api
        app.post('/deliveryItems', async (req, res) => {
            const deliveryItem = req.body;
            // console.log('hit the post api', deliveryItem);

            const result = await deliveryCollection.insertOne(deliveryItem);
            // console.log(result);
            res.json(result);
        })

        // POST All order api
        app.post('/AllOrder', async (req, res) => {
            const OrderList = req.body;
            // console.log('order hit the server', OrderList);


            const result = await orderCollection.insertOne(OrderList);
            // // console.log(result);
            res.json(result);
        })

        //Get All Order api
        app.get('/AllOrder', async (req, res) => {
            const cursor = orderCollection.find({});
            const AllOrder = await cursor.toArray();
            res.send(AllOrder);
        })


        //Delete api
        app.delete('/AllOrder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            // console.log('deleting user with id', result)
            res.json(result);
        })



        //Update API 

        app.put('/AllOrder/:id', async (req, res) => {
            const id = req.params.id;
            const updatedStatus = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updatedStatus.status
                },
            };
            const result = await orderCollection.updateOne(filter, updateDoc, options);
            // console.log(`your id nong`, id, updatedStatus);
            res.send(result)
        })




    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('Khuda Lagche Server Is Running');
});

app.listen(port, () => {
    console.log('Server Running At Port', port);
});