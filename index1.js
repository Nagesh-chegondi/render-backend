const express =require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const mongoose = require('mongoose')
require("dotenv").config();
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ DB connection failed:", err));
const app = express();

const JWT_SECRET = "ILOVESAMYUKTHA";
const port = process.env.PORT || 5000;
const {userModel,todoModel} = require('./db');
mongoose.connect("mongodb+srv://kantamani6227:mlNM4l35NSduc8Nn@cluster0.6eug4oy.mongodb.net/nagesh-todo222");



app.use(express.json());
app.use(cors())
// let info=[];

app.post('/signup', async(req, res) => {
    const {email,password} = req.body;
    if(!email || !password || email.trim() === '' || password.trim() === ''){
        return res.status(400).json({error: 'Email and password are required'}); 
       
    }
    else{
       const find = await userModel.find({
        email:email,
        password:password



       });
       if(!(find.email ===email)){
        await userModel.create({
            email:email,
            password:password,
            
        })
        return res.status(201).json({
            message:"yeah user signed up"
        })
       }
       else{
        return res.status(401).json({
            messge:"user already exists"
        })
       }
       
    }
        
} );

app.post('/signin',async(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password || email.trim() === '' || password.trim() === ''){
        return res.status(400).json({error: 'Email and password are required'});
    }
    else{
const find = await userModel.findOne({

        email:email,
        password:password});
        if (find.email){
            const token = jwt.sign({
                id: find._id
            },JWT_SECRET);
            return res.status(201).json({
                message:'user signed in',
                token:token
            })

        }
        else{
            return res.status(401).json({
                message:"user not found"
            })
        }
    }


   
    });
    app.get('/me',async(req,res)=>{
        let token =req.headers.token;
        if(token){
        let decodedinfo = jwt.verify(token,JWT_SECRET);
        const todo_find = await todoModel.find({
            userId:decodedinfo.id
        })
        // for(let i=0;i<info.length;i++){
        //     if(decodedinfo.email===info[i].email){
        //         return res.status(201).json({email:info[i].email,
        //             password:info[i].password,
        //             todo:info[i].todo

        //         })
        //     }
        // }
        console.log(todo_find);
        console.log(todo_find.length);
        return res.status(201).json({todos:todo_find

        })
    }
    else{
        return res .status(401).json({message:"user not signed in please first sign in",

        });
    }


    });

    app.post('/adtodo',async(req,res)=>{
         let token =req.headers.token;
         let tada = req.body.todo;
         let done  = false
         
        if(token){
        let decodedinfo = jwt.verify(token,JWT_SECRET);
        const find = await userModel.findOne({
            _id:decodedinfo.id
            

        })
        const push = await todoModel.create({
            titles:tada,
            status:done,
            userId:find._id


        })
        return res.status(201).json({
            message:"todos pushed sucessfullly"
        })

       
            
        }
            
        
    
        else{
            return res .status(401).json({message:"user not signed in please first sign in"});
        }   
       
    })
    app.delete('/delete',async(req,res)=>{
        let token = req.headers.token;
        let todo = req.body.todo;
        if(token){
            let decodedinfo = jwt.verify(token,JWT_SECRET);
            const find = await userModel.findOne({
                _id:decodedinfo.id
            })
            const remove = await todoModel.deleteOne({
                titles:todo,
                userId:find._id
            })
            return res.status(201).json({
                message:"todos deleted sucessfullly"
            })
        }
        else{
            return res .status(401).json({message:"user not signed in please first sign in"});
        }
    })

app.listen(5000);
console.log('Server is running on http://localhost:5000/');