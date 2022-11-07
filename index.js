const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

//USER: webgoServicesDb
//PASSWORD: gifnLhPIDP9EEw6b


const uri = "mongodb+srv://webgoServicesDb:gifnLhPIDP9EEw6b@cluster0.z1xe9fw.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
});


app.get('/', (req, res) => {
    res.send('Welcome To WebGo Server')
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})