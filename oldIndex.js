const express = require('express')
const cors = require('cors');
const routerCommunity = require("./Routes/Community")

//nodemailer
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const stripe = require("stripe")("sk_test_51M7c2bCrl3dQ57EJMOlipKJpX43py1TqYR0wIuxSuUqrCNs5wm5ZZqbdfoC9Sg4pPnoRjyK555NERoxbngBBbRhS00TlyNUFoE");

const jwt = require('jsonwebtoken');
require('dotenv').config()
const app = express()

//port of the server
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())


// const levels = require('/data/course.json');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6ke0m0t.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function notifyBlog(blog) {
    const { author_name, title, details, image } = blog
    const auth = {
        auth: {
            api_key: process.env.EMAIL_API_PROVIDER,
            domain: process.env.EMAIL_SEND_DOMAIN
        }
    }

    const transporter = nodemailer.createTransport(mg(auth));

    transporter.sendMail({
        from: '"Hello Talk" <hellotalk2k23@gmail.com>', // verified sender email
        to: `sujoypaul728@gmail.com, afnanferdousi550@gmail.com, alshaimon968@gmail.com 
        , kasib.md.chy@gmail.com, algalib1001@gmail.com`, // recipient email
        subject: `New blog published by ${author_name}`, // Subject line
        // text: "Hello world!", // plain text body
        html: `
        <div style="background-color: #f2f2f2; padding: 15px; text-align: center; font-family: arial;">
        <div style="background-color: #ffffff; padding: 13px; border-radius: 10px;">
          <img style="width: 100%; border-radius: 15px" src=${image} style="display: block; margin: 0 auto 20px auto;" />
          <h2 style="color: #333;">${title}</h2>
          <p style="color: #333; font-size: 16px;">${details.slice(0, 150)}...</p>
          <div>
              <a href="https://hello-talk-client.vercel.app/blogs" target="_blank"> <button style="background-color: #61B800; color: white; padding: 13px 35px; border: 0; outline: none; border-radius: 14px; font-size: 18px; text-transform: uppercase;">See blogs</button> </a>
          </div>
        </div>
        <h3 style="color: #333; margin-top: 20px; margin-botom: 5px; text-align: center;">Thanks from (Hello Talk)</h3>
        <p>visit now: <a style="color: #61B800" href="https://hello-talk-client.vercel.app/blogs">https://hello-talk-client.vercel.app/blogs</a> </>
      </div>
        `, // html body
    }, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: "unathorized access" })
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(401).send({ message: "unathorized access" })
        }
        req.decoded = decoded;
        next()
    })
}


async function run() {
    //our all collections for all oparetion
    try {
        const coursesCollection = client.db('hello-Talk').collection('coursesCollection');
        const paymentsCollection = client.db('hello-Talk').collection('paymentsCollection');
        const levelsCollcetion = client.db('hello-Talk').collection('levelsCollcetion');
        const blogsCollection = client.db('hello-Talk').collection('blogsCollection');
        const usersCollection = client.db('hello-Talk').collection('usersCollection');
        const userCollection = client.db('hello-Talk').collection('userCollection');
        const reviewsCollection = client.db('hello-Talk').collection('reviewsCollection');
        const YquizCollection = client.db('hello-Talk').collection('YquizCollection');
        const AquizCollection = client.db('hello-Talk').collection('AquizCollection');
        const faqCollection = client.db('hello-Talk').collection('faqCollection');
        const flashcardCollection = client.db('hello-Talk').collection('flashcardCollection');
        const teachersCollection = client.db('hello-Talk').collection('teachersCollection');
        const notifyEmailCollection = client.db('hello-Talk').collection('notifyEmailCollection');
        const messageCollection = client.db('hello-Talk').collection('messageCollection');
        const termsCollection = client.db('hello-Talk').collection('terms');
        const privacyCollection = client.db('hello-Talk').collection('privacy');
        const connectionsCollection = client.db('hello-Talk').collection('connection');
        const friendsCollection = client.db('hello-Talk').collection('friends');
        const appliedTeacherCollection = client.db('hello-Talk').collection('appliedTeacher');
        const liveSessionCollection = client.db('hello-Talk').collection('livesession');


        // CHAT SYSTEM START
        app.post('/send-message', async (req, res) => {
            const data = req.body;
            const currentDate = new Date();
            const msgData = {
                sender: data.sender,
                senderId: data.senderId,
                recId: data.recId,
                msg: data.msg,
                date: currentDate
            }
            const result = await messageCollection.insertOne(msgData);
            res.send({ result, msgData });
        })

        //get message indivisuali
        app.get('/get-messages/:id/:myId', async (req, res) => {
            const id = req.params.id;
            const myId = req.params.myId;
            try {
                const allMessages = await messageCollection.find({}).toArray();
                const filtered = allMessages.filter(
                    (m) => {
                        return (
                            (m.senderId === myId && m.recId === id) || (m.senderId === id && m.recId === myId)
                        )
                    }
                );
                if (!filtered.length) {
                    console.error('No data matching the filter condition.');
                }
                res.send(filtered);
                console.log('msg=>', filtered);
            } catch (e) {
                console.log(e);
            }
        });

        // CHAT SYSTEM END


        //payment system
        // -------------------Stripe-------------
        app.post('/create-payment-intent', async (req, res) => {
            const order = req.body;
            const price = order.price;
            const amount = price;

            const paymentIntent = await stripe.paymentIntents.create({
                currency: 'usd',
                amount: amount,
                "payment_method_types": [
                    "card"
                ]
            });
            res.send({
                clientSecret: paymentIntent.client_secret,
            });
        });

        //insert new payment in collection
        app.post("/payments", async (req, res) => {
            const payments = req.body
            console.log(payments)
            const result = await paymentsCollection.insertOne(payments)
            res.send(result);

        });

        //get all the payment history
        app.get('/payments', async (req, res) => {
            const query = {};
            const result = await paymentsCollection.find(query).toArray();
            res.send(result)
        })

        //get all payments history with email
        app.get('/userpayments', async (req, res) => {
            const email = req.query.email
            const query = { email: email };
            const result = await paymentsCollection.find(query).toArray()
            res.send(result)
        })

        //get single payment history with email
        app.get('/paymentbycourse', async (req, res) => {
            const id = req.query.id
            const query = { _id: ObjectId(id) };
            const result = await paymentsCollection.findOne(query)
            res.send(result)
        })

        //-----------------stripe end---------------

        //add new course post request
        app.post('/course', async (req, res) => {
            const coursebody = req.body;
            const result = await coursesCollection.insertOne(coursebody);
            res.send(result)
        })

        //get courses data from mongodb
        app.get('/courses', async (req, res) => {
            const query = {};
            const result = await coursesCollection.find(query).toArray();
            res.send(result);
        });

        //get single course by id
        app.get('/course/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await coursesCollection.findOne(query);
            res.send(result);
        });

        //update the course
        app.post('/upcourse', async (req, res) => {
            const id = req.query.id;
            const coursedata = req.body;
            const {
                title1,
                picture1,
                details1,
                date1,
                price1,
                offer_price1,
                module_links1,
            } = coursedata;

            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    title: title1,
                    picture: picture1,
                    details: details1,
                    date: date1,
                    price: price1,
                    offer_price: offer_price1,
                    module_links: module_links1
                }
            }

            const result = await coursesCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })

        //delete the single course by id
        app.delete('/course/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await coursesCollection.deleteOne(query)
            res.send(result);
        })

        //\___________________all blog apis CRUD oparation start_________________/\\
        //post blog api
        app.post('/blog', async (req, res) => {
            const blog = req.body;
            const result = await blogsCollection.insertOne(blog)
            notifyBlog(blog)
            res.send(result)
        })

        //get all blogs
        app.get('/blogs', async (req, res) => {
            const query = {};
            const result = await blogsCollection.find(query).toArray();
            res.send(result);
        })

        //two blogs api for show in home page
        app.get('/hblogs', async (req, res) => {
            const query = {};
            const result = await blogsCollection.find(query).limit(2).toArray();
            res.send(result);
        })

        //get the single blog
        app.get('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await blogsCollection.findOne(query);
            res.send(result)
        })

        //edit blogs by post
        app.post('/upblog', async (req, res) => {
            const id = req.query.id;
            const blogdata = req.body;
            const {
                title1,
                details1,
                date1,
                author_name1,
                author_img1,
                image1,
                tag1,
                package1,
                gems1,
                age1
            } = blogdata;

            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    title: title1,
                    details: details1,
                    date: date1,
                    author_name: author_name1,
                    author_img: author_img1,
                    image: image1,
                    tag: tag1,
                    package: package1,
                    gems: gems1,
                    age: age1
                }
            }
            const result = await blogsCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        });

        //update gems after unlcoking blogs with gems
        app.post('/updategem', async (req, res) => {
            const email = req.query.email;
            const updatedeGem = req.body;
            //get the new gems
            const { gems } = updatedeGem

            //find for get the user of previous gems
            // const getUser = await userCollection.findOne({email: email})
            // const {gems} =  getUser;

            const filter = { email: email };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    gems: gems
                }
            };

            const result = await userCollection.updateOne(filter, updatedDoc, options)
            res.send({ result, updatedDoc })
        })

        //notify email save api
        app.post('/notifyblog', async (req, res) => {
            const email = req.body;
            const result = await notifyEmailCollection.insertOne(email)
            res.send(result)
        })

        //notify when a admin create a new blog
        app.get('/notifyblog', async (req, res) => {
            const result = await notifyEmailCollection.find({}).toArray()
            res.send(result)
        })

        //delete blog 
        app.delete('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await blogsCollection.deleteOne(query);
            res.send(result)
        })
        //\__________________________blogs end______________________________/\\

        //\_______________________Review API Start___________________________/\\
        //post review in database
        app.post('/postreview', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.send(result)
        })

        //get the review api from mongodb
        app.get('/reviews', async (req, res) => {
            const query = {};
            const result = await reviewsCollection.find(query).toArray();
            res.send(result);
        });

        //get single review of indecated user
        app.get('/review', async (req, res) => {
            const reqemail = req.query.email;
            const query = { email: reqemail }
            if (reqemail) {
                const result = await reviewsCollection.findOne(query);
                res.send(result)
            }
            else {
                const error = { message: "no email found" }
            }
        })
        //\_______________________Review API End___________________________/\\

        //frequently asked question 
        app.get('/faq', async (req, res) => {
            const query = {};
            const result = await faqCollection.find(query).toArray();
            res.send(result)
        })

        //flashcardCollection 
        app.get('/flashcard', async (req, res) => {
            const query = {};
            const result = await flashcardCollection.find(query).toArray();
            res.send(result)
        })

        //get quizzes api - checking age
        app.get('/quizes', async (req, res) => {
            const age = req.query.age
            const query = {};
            if (age === 'young') {
                const result = await YquizCollection.find(query).toArray();
                res.send(result)
            }
            if (age === 'adult') {
                const result = await AquizCollection.find(query).toArray();
                res.send(result)
            }
            else {
                const result = { message: "No data found" }
                res.send(result)
            }
        })

        //get all the levels
        app.get('/levels', async (req, res) => {
            const query = {};
            const result = await levelsCollcetion.find(query).toArray()
            console.log(result)
            res.send(result)
        })

        //get single level
        app.get('/levels/:level', async (req, res) => {
            const level = req.params.level;
            const query = { level: level };
            const result = await levelsCollcetion.find(query).toArray()
            console.log(result)
            res.send(result)
        })

        app.get('/level/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await levelsCollcetion.findOne(query)
            console.log(result)
            res.send(result)
        })

        //save the level when it complete in userCollection
        app.post('/savelevel', async (req, res) => {
            const newLevel = req.body;
            const { completed_lv } = newLevel;
            const email = req.query.email;
            const filter = { email: email };
            const options = { upsert: true };
            const updatedDoc = {
                $push: {
                    completed_lv: completed_lv
                }
            };
            const result = await userCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        });

        //check levels
        app.get('/filterlevel', async (req, res) => {
            const email = req.query.email;
            const getUser = userCollection.find(user => user.email === email);
            const completedlv = getUser.completed_lv;

        })

        //authentication
        app.put('/users/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email);
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };

            const updateDoc = {
                $set: user,
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN, { expiresIn: '1h' });
            res.send({ result, token });
        })

        //post my profile
        app.post('/user', async (req, res) => {
            const userdetail = req.body;
            const result = await userCollection.insertOne(userdetail);
            res.send(result)
        })

        //update my profile with all information
        app.post('/upuser', async (req, res) => {
            const userbio = req.body;
            const { name, age, education, district, country, number, email, realAge } = userbio;
            const useremail = req.query.email;
            const filter = { email: useremail };
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    name,
                    age,
                    realAge,
                    education,
                    district,
                    country,
                    number,
                    email
                }
            }

            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })

        // set the photo of profile 
        app.post('/upimage', async (req, res) => {
            const image = req.body;
            const { photoURL } = image;
            const email = req.query.email;
            const filter = { email: email }
            const options = { upsert: true }
            const updatedDoc = {
                $set: {
                    photoURL: photoURL
                }
            }
            const result = userCollection.updateOne(filter, updatedDoc, options)
            console.log(filter)
            res.send(result)
        })

        //get all the users
        app.get('/users', async (req, res) => {
            const query = {};
            const result = await usersCollection.find(query).toArray();
            res.send(result)
        })


        //get all the users saved on usercollection
        app.get('/allusers', async (req, res) => {
            const query = {};
            const result = await userCollection.find(query).toArray();
            res.send(result)
        })

        //check admins
        app.get('/sortusers', async (req, res) => {
            const query = {};
            const result = await userCollection.find(query).sort({ role: "admin" }).toArray();
            res.send(result)
        })

        //get single user api
        app.get('/profile', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const result = await userCollection.findOne(query);
            res.send(result)
        });

        //make a user to admin
        app.put('/makeadmin', async (req, res) => {
            const email = req.query.email;
            const filter = { email: email }
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    role: "admin"
                }
            }
            const result = await userCollection.updateOne(filter, updatedDoc, options);
            res.send(result)
        })

        //update gems by answering the question
        app.post('/addgem', async (req, res) => {
            const email = req.query.email;
            const mygem = req.body;
            //get the new gems
            const { mGem } = mygem

            //find for get the user of previous gems
            const getUser = await userCollection.findOne({ email: email })
            const { gems } = getUser;

            const filter = { email: email };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    gems: gems + mGem
                }
            };

            const result = await userCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })

        //update gems after unlcoking blogs with gems
        app.post('/updategem', async (req, res) => {
            const email = req.query.email;
            const mygem = req.body;
            //get the new gems
            const { mGem } = mygem

            //find for get the user of previous gems
            // const getUser = await userCollection.findOne({email: email})
            // const {gems} =  getUser;

            const filter = { email: email };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    gems: mGem
                }
            };

            const result = await userCollection.updateOne(filter, updatedDoc, options)
            res.send({ result, updatedDoc })
        })

        //delete an user from database
        app.delete('/profile/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        });


        //get all the teachers and description
        app.get('/teachers', async (req, res) => {
            const query = {};
            const teachers = await teachersCollection.find(query).toArray();
            res.send(teachers)
        })

        //get single teacher data
        app.get('/teacher/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await teachersCollection.findOne(query);
            res.send(result);
        });

        // for checking teacher 
        app.get('/teacher', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await teachersCollection.findOne(query);
            res.send(result);
        });

        //POST API add teachere api
        app.post('/addteacher', async (req, res) => {
            const teacherBody = req.body;
            const result = await teachersCollection.insertOne(teacherBody)

            //for update the role user to teacher
            const email = req.body.email;
            const filter = { email: email }
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    role: 'teacher'
                }
            }
            const result2 = await userCollection.updateOne(filter, updatedDoc, options)

            //remove the data from applied collection
            const result3 = await appliedTeacherCollection.deleteOne(filter);

            res.send([result, result2, result3])
        })

        // apply for a teacher
        app.post('/applyteacher', async (req, res) => {
            const teacherBody = req.body;
            const result = await appliedTeacherCollection.insertOne(teacherBody)
            res.send(result)
        })

        //delete the application of teacher role
        app.delete('/deleteApply', async (req, res) => {
            const email = req.query.email;
            const result = await appliedTeacherCollection.deleteOne({ email: email });
            res.send(result)
        })

        //get all the applied teacher list
        app.get('/appliedtechlist', async (req, res) => {
            const query = {}
            const result = await appliedTeacherCollection.find(query).toArray()
            res.send(result)
        })

        //get single applied for testing
        app.get('/myapplied', async (req, res) => {
            const email = req.query.email;
            const result = await appliedTeacherCollection.findOne({ email: email })
            res.send(result)
        })

        //delete teacher api
        app.delete('/removeteacher', async (req, res) => {
            const id = req.query.id;
            const query = { _id: ObjectId(id) }
            const result = await teachersCollection.deleteOne(query)

            const teacher = await teachersCollection.findOne(query);
            const filter = { email: teacher.email }
            const options = { upsert: true }
            const updatedDoc = {
                $set: {
                    role: 'user'
                }
            }
            const result2 = await userCollection.updateOne(filter, updatedDoc, options)
            res.send([result, result2])
        })

        //Chage the role to teacher when admin accept
        app.post('/updateteacher', async (req, res) => {
            const id = req.query.id;
            const teacherDetail = req.body;
            const {
                name1,
                image1,
                details1,
                qualification1,
            } = teacherDetail;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    name: name1,
                    image: image1,
                    details: details1,
                    qualification: qualification1
                }
            }
            const result = await teachersCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })

        //terms and privacy start ____________________________
        app.post('/addprivacy', async (req, res) => {
            const privacybody = req.body;
            const result = await privacyCollection.insertOne(privacybody);
            res.send(result)
        })

        //get the terms value;
        app.get('/privacy', async (req, res) => {
            const result = await privacyCollection.find({}).toArray();
            res.send(result)
        })

        //terms and privacy start ____________________________
        app.post('/addterms', async (req, res) => {
            const termsBody = req.body;
            const result = await termsCollection.insertOne(termsBody);
            res.send(result)
        })

        //get the terms value;
        app.get('/terms', async (req, res) => {
            const result = await termsCollection.find({}).toArray();
            res.send(result)
        })


        //community pages 
        app.use("/community", routerCommunity)

        app.get('/connection', async (req, res) => {
            const result = await connectionsCollection.find({}).toArray()
            res.send(result)
        })

        //get the freind request
        app.get('/requested', async (req, res) => {
            const reciverEmail = req.query.email;
            const query = { reciverEmail: reciverEmail, status: "pending" }
            const result = await connectionsCollection.find(query).toArray()
            res.send(result)
        })

        //accept friend request api
        app.post('/accepted', async (req, res) => {
            const body = req.body;
            const id = body.id;
            const query = { _id: ObjectId(id) };
            const result1 = await connectionsCollection.deleteOne(query);
            const acceptbody = {
                senderImg: body.senderImg,
                senderEmail: body.senderEmail,
                senderName: body.senderName,
                reciverEmail: body.reciverEmail,
                reciverImg: body.reciverImg,
                reciverName: body.reciverName,
            }
            const result2 = await friendsCollection.insertOne(acceptbody);
            const acceptBody2 = {
                senderImg: body.reciverImg,
                senderEmail: body.reciverEmail,
                senderName: body.reciverName,
                reciverEmail: body.senderEmail,
                reciverImg: body.senderImg,
                reciverName: body.senderName,
            }

            const result3 = await friendsCollection.insertOne(acceptBody2);

            res.send([result1, result2, result3])
        })

        //check my friends
        app.get('/myfriends', async (req, res) => {
            const myEmail = req.query.email;
            const query = { reciverEmail: myEmail };
            const result = await friendsCollection.find(query).toArray()
            res.send(result)
        });

        //delete friend request
        app.get('/reqdeny', async (req, res) => {
            const id = req.query.id;
            const query = { _id: ObjectId(id) }
            const result = await connectionsCollection.deleteOne(query);
            res.send(result)
        });

        //create session start ----//////////////////////////
        app.post('/makelive', async (req, res) => {
            const livebody = req.body;
            const result = await liveSessionCollection.insertOne(livebody);
            res.send(result)
        });

        //check my live is active or not
        app.get('/mylive', async (req, res) => {
            const email = req.query.email;
            const query = { teacher_email: email }
            const result = await liveSessionCollection.findOne(query)
            res.send(result)
        })

        //delete live api function
        app.delete('/deletelive', async (req, res) => {
            const email = req.query.email;
            const query = { teacher_email: email };
            const result = await liveSessionCollection.deleteOne(query);
            res.send(result)
        })

        //get all lives for help support page. students can see this
        app.get('/getlives', async (req, res) => {
            const query = {};
            const result = await liveSessionCollection.find(query).toArray()
            res.send(result)
        })
    }

    finally {

    }
}
run().catch(err => {
    console.error(err);
})

//this is the root api for our server
app.get('/', (req, res) => {
    res.send(`
  <div style="text-align: center; font-family: arial; padding: 0 30px">
  <img src="https://i.ibb.co/9sD5w3t/favicon.png" alt="Hello Talk logo" style="width: 200px; margin: 20px 0;">
  <h1 style="font-size: 3em; margin: 10px 0;">Welcome to Hello Talk Server!</h1>
  <p style="font-size: 1.5em; margin: 10px 0;">Hello Talk is an English learning platform, developed by our team: <span style="color: green; font-weight: bold">Afnan Ferdousi, Al Galib, Mosharaf, Shaimon, Kasib and Sujoy Paul</span>.</p>
  <a target="_blank" href="https://hello-talk-client.vercel.app" style="font-size: 1.5em; margin: 10px 0;">Visit our live website</a>
</div>
  `)
})

app.listen(port, () => {
    console.log(`Hello talk app listening on port ${port}`)
})

//Export the express api
module.exports = app;