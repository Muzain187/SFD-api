const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();


const serviceAccount = require("./pemission.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const database = admin.firestore();

app.use(cors({origin:true}));

app.get('/',(req,res)=>{
    res.send("Hello World");
})

// create account 
app.post('/api/createaccount',(req,res)=>{
  (async ()=>{
    try{
      const user = await database.collection('accounts').doc('/'+ parseInt(req.body.phone)+'/')
      .create({
        restaurant:req.body.restaurant,
        owner:req.body.owner,
        phone:req.body.phone,
        address:req.body.address
      })
      return res.send(user.id);

    }catch(e){
      return res.send(e);
    }
  })();
})

//get restaurant details from id
app.get('/api/:id',(req,res)=>{
  (async ()=>{
    try{
      // res.send()
      console.log(req.params.id);
      let document = database.collection('accounts').doc(req.params.id);
      let account = await document.get();
      return account.data() === undefined ? res.send(""):res.send(account.data());
    }
    catch(err){
      return res.send(err);
    }
  })();
})




exports.app = functions.https.onRequest(app);