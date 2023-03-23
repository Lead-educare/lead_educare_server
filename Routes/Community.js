const express = require("express")
const router = express.Router()
require('dotenv').config()

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6ke0m0t.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const communityPostsCollection = client.db('hello-Talk').collection('communityPostsCollection');
const postlikes = client.db('hello-Talk').collection('postlikes');
const postcomment = client.db('hello-Talk').collection('postcomment');
const topAuthors = client.db('hello-Talk').collection('topAuthors');
const likeOnComment = client.db('hello-Talk').collection('likeOnComment');
const userCollection = client.db('hello-Talk').collection('userCollection');
const connectionsCollection = client.db('hello-Talk').collection('connection');


router.post('/addapost', async (req, res) => {
    const body = req.body;
    const email = body.email;
    const getUser = await userCollection.findOne({ email: email })
    const { gems } = getUser;
    const filter = { email: email };
    const options = { upsert: true };
    const updatedDoc = {
        $set: {
            gems: gems + 2
        }
    };
    const result3 = await userCollection.updateOne(filter, updatedDoc, options)
    const result = await communityPostsCollection.insertOne(body);
    res.send([result, result3])
});


router.get('/communityposts', async (req, res) => {
    const query = {};
    const result = await communityPostsCollection.find(query).sort({ _id: -1 }).toArray();
    res.send(result)
});

router.post('/addapost', async (req, res) => {
    const question = req.body;
    const result = await communityPostsCollection.insertOne(question);
    const getUser = await userCollection.findOne({ email: question.email })
    const { gems } = getUser;
    const filter = { email: email };
    const options = { upsert: true };
    const updatedDoc = {
        $set: {
            gems: gems + mGem
        }
    };
    const result3 = await userCollection.updateOne(filter, updatedDoc, options)
    res.send([result, result3])
});

router.post('/postlike', async (req, res) => {
    const likebody = req.body;
    const query = {
        email: likebody.email,
        pid: likebody.pid
    }
    const likedata = await postlikes.find(query).toArray()
    // console.log(likedata.length)
    if (likedata.length >= 1) return res.send({ status: "already liked" })
    const result = await postlikes.insertOne(likebody);
    res.send(result)
})


router.get('/postlike', async (req, res) => {
    const query = {}
    const communitybody = await postlikes.find(query).toArray()
    res.send(communitybody)
})
router.post('/postcomment', async (req, res) => {
    const communitybody = req.body;
    const result = await postcomment.insertOne(communitybody);
    res.send(result)
})
router.get('/comment/:id', async (req, res) => {
    const id = req.params.id
    const query = { pid: id }
    const result = await postcomment.find(query).toArray();
    res.send(result);
})

router.get('/like', async (req, res) => {
    const email = req.query.email;
    const id = req.query.id
    const query = {
        email: email,
        pid: id
    }
    const result = await postlikes.find(query).toArray()
    // console.log(result)
    res.send(result)
})

router.get('/totallikes', async (req, res) => {
    const id = req.query.id;
    const result = await postlikes.find({ pid: id }).toArray();
    res.send(result)
})

router.get('/unlike', async (req, res) => {
    const id = req.query.id;
    const email = req.query.email
    const query = {
        email: email,
        pid: id
    };
    // console.log(query)
    const result = await postlikes.deleteOne(query);
    res.send(result);
});

router.post('/topAuthors', async (req, res) => {
    const topAuthor = req.body;
    // console.log(topAuthor)
    const query = {};
    const result2 = await topAuthors.deleteMany(query);
    const result = await topAuthors.insertMany(topAuthor);
    res.send(result)
})


router.get('/topAuthors', async (req, res) => {
    const query = {}
    // const users = await userCollection.find(query).toArray()
    // if(users)
    const communitybody = await topAuthors.find(query).toArray()

    res.send(communitybody)
})

router.get('/commentcount', async (req, res) => {
    const email = req.query.email;
    const query = { email: email }
    const communitybody = await postcomment.find(query).toArray()
    res.send(communitybody)
})

router.get('/clike', async (req, res) => {
    const email = req.query.email;
    const id = req.query.id
    const query =
    {
        email: email,
        cid: id
    }
    const commentStatus = await likeOnComment.find(query).toArray()
    res.send(commentStatus)
})


router.post('/likeOnComment', async (req, res) => {
    const commentLike = req.body;
    const result = await likeOnComment.insertOne(commentLike);
    res.send(result)
})

router.delete('/Clike/:id', async (req, res) => {
    const id = req.params.id;
    const query = { cid: id };
    // console.log(query)
    const result = await likeOnComment.deleteOne(query);
    res.send(result);
});


router.delete('/deleteComment/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    // console.log(query)
    const result = await postcomment.deleteOne(query);
    res.send(result);
});

// _______________

// add friend list

router.post('/connect', async (req, res) => {
    const connectBody = req.body;
    const query = {
        senderEmail: connectBody.senderEmail,
        reciverEmail: connectBody.reciverEmail
    }
    const status = await connectionsCollection.find({ query }).toArray()

    if (status.length >= 1) return res.send({ Status: "Already Sent" })
    const result = await connectionsCollection.insertOne(connectBody);
    res.send(result)
})

router.get('/srequested', async (req, res) => {
    const sEmail = req.query.email;
    const rEmail = req.query.remail;
    const query1 = {
        senderEmail: sEmail,
        reciverEmail: rEmail
    };
    const result = await connectionsCollection.find(query1).toArray()
    res.send(result)
})

router.get('/all', async (req, res) => {
    // const connectBody = req.body;
    const result = await connectionsCollection.find({}).toArray();
    res.send(result)
})

router.get('/reqestdeny', async (req, res) => {
    const sEmail = req.query.email;
    const rEmail = req.query.remail;
    const query1 = {
        senderEmail: sEmail,
        reciverEmail: rEmail
    };
    const result = await connectionsCollection.deleteOne(query1);
    res.send(result)
});












module.exports = router;