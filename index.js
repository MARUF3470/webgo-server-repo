const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;

require('dotenv').config()
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.z1xe9fw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const webgoServiceCollecton = client.db('webgo').collection('services')
    const reviewCollection = client.db('webgo').collection('reviews')
    try {
        app.post('/services', async (req, res) => {
            const data = req.body;
            const result = await webgoServiceCollecton.insertOne(data)
            res.send(result)
        })
        app.get('/threeServices', async (req, res) => {
            const query = {};
            const cursor = webgoServiceCollecton.find(query);
            const result = await cursor.limit(3).toArray();
            res.send(result);
        })
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = webgoServiceCollecton.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await webgoServiceCollecton.findOne(query)
            res.send(result)
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const service = await webgoServiceCollecton.findOne(query);
            res.send(service)
        })
        app.post('/review', async (req, res) => {
            const data = req.body;
            const result = await reviewCollection.insertOne(data)
            res.send(result)
        })
        app.get('/review', async (req, res) => {
            const query = {}
            const cursor = reviewCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/review', async (req, res) => {
            console.log(req.query)
            const query = { email: req.query.email }
            const cursor = reviewCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { serviceId: id }
            const review = reviewCollection.find(query)
            const result = await review.toArray()
            res.send(result)
        })
    }
    finally {

    }
}
run().catch(err => console.error(err))


app.get('/', (req, res) => {
    res.send('Welcome To WebGo Server')
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})