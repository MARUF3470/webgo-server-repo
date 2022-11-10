const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;

require('dotenv').config()
app.use(cors())
app.use(express.json())
var jwt = require('jsonwebtoken');

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = authHeader.split(' ')[1];
    console.log(authHeader)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' });
        }
        req.decoded = decoded;
        next();
    })
}

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.z1xe9fw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const webgoServiceCollecton = client.db('webgo').collection('services')
    const reviewCollection = client.db('webgo').collection('reviews')
    try {
        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
            res.send({ token })
        })
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
        app.get('/review/:email', verifyJWT, async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            const cursor = reviewCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/serviceReview/:id', verifyJWT, async (req, res) => {
            const id = req.params.id;
            const query = { serviceId: id }
            const review = reviewCollection.find(query)
            const result = await review.toArray()
            res.send(result)
        })
        app.patch('/review/:id', verifyJWT, async (req, res) => {
            const id = req.params.id;
            const status = req.body.status;
            const query = { _id: ObjectId(id) };
            const UpdatedDoc = {
                $set: {
                    review: status
                }
            }
            const result = await reviewCollection.updateOne(query, UpdatedDoc)
            res.send(result)
        })
        app.delete('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
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