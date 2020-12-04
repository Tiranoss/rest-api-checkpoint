const express = require("express")
const mongoose = require("mongoose") // new
//require("dotenv/config")
require('dotenv').config({path:`${__dirname}/config/.env`})
const app = express()

// Connect to MongoDB database
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.log(error));
db.once('open', () => console.log("connected to database"))
mongoose.set('useFindAndModify', false);
app.use(express.json())
let User = require("./models/users")
//  GET :  RETURN ALL USERS 
app.get('/', async (req, res) => {
	try {
		let users = await User.find()
		res.send(users)
	}
	catch (err) {
		res.json({ message: err })
	}
})
// POST :  ADD A NEW USER TO THE DATABASE 
app.post('/', async (req, res) => {
	let newUser = new User({
		name: req.body.name,
		age: req.body.age,
		date: Date.now()
	})
	try {
		newUserSaved = await newUser.save();
		res.json(newUserSaved);
	}
	catch (err) {
		res.json({ message: err })
	}
})
//PUT : EDIT A USER BY ID 
app.put('/:id', async (req, res) => {
	try {
		let editedUser = await User.findOneAndUpdate({ _id: req.params.id }, { $set: { name: req.body.name,age:req.body.age } }, { new: true })
		res.json(editedUser)
	}
	catch (err) {
		res.json({ message: err })
	}
})
// patch :Edit user bu id
app.patch('/:id',async(req,res) => {
	try{
		userToUpdate = await User.findOne({_id:req.params.id})
		if (req.body.name)
		{
			userToUpdate.name=req.body.name
		}
		if (req.body.age)
		{
			userToUpdate.age = req.body.age
		}
		editedUser=await userToUpdate.save()
		res.send(editedUser)
	}
	catch(err){
		res.send({message:err})
	}
})
//    DELETE : REMOVE A USER BY ID 
app.delete('/:id', async (req,res) => {
	try{
		await User.deleteOne({_id:req.params.id});
		res.send({message:"user deleted successfly"})
	}
	catch(err){
		res.json({message:err})
	}
})
// get user by id
app.get('/:id', async(req,res) => {
 try{
	 let user = await User.findById({_id:req.params.id});
	 res.json(user)
 }
 catch(err)
 {
	 res.json({message:err})
 }
})



//server listen in port 5000
app.listen(5000, (err) => {
	if (err) throw err;
	else console.log("Server has started!")
})
