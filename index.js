const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;

//USER: webgoServicesDb
//PASSWORD: gifnLhPIDP9EEw6b


app.use(cors())
app.use(express.json())

const uri = "mongodb+srv://webgoServicesDb:gifnLhPIDP9EEw6b@cluster0.z1xe9fw.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const webgoServiceCollecton = client.db('webgo').collection('services')
    try {
        app.get('/threeServices', async (req, res) => {
            const query = {};
            const cursor = webgoServiceCollecton.find(query)
            const result = await cursor.limit(3).toArray()
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