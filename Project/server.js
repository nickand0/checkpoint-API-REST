//importation mongoose express et dotenv
const mongoose = require('mongoose');
const express = require('express')
const dotenv = require('dotenv');

//configuration variables
dotenv.config({path:'./config/.env'})

const app = express()

//middleware parse Json
app.use(express.json())

//connection a mongodb
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Connexion à MongoDB réussie');
})
.catch((err) => {
    console.error('Erreur de connexion à MongoDB', err);
});

//définition routes
app.get('/',(req,res)=>res.send('API Running'))


//Importation User models
const User = require('./models/User')

//Routes pour obternir la route de toutes les Utilisateur
app.get('/users',async(req,res)=>{
    try{
        const users = await User.find()
        res.json(users)
    }catch(err){
        res.status(500).json({message :err.message})
    }
})

//Route Pour ajouter un nouveau Utilisateur
app.post('/users',async(req,res)=>{
    const { name, email, password } = req.body;

    try{
        const newUser = new User({
            name,
            email,
            password
        })
    const user = await newUser.save()
    res.json(user)

    }catch(err){
        res.status(500).json({ message: err.message });
    }
})

//Route Edit user by ID
app.put('/users/:id',async(req,res)=>{
    const { name, email, password } = req.body;

    try{
        const user = await User.findById(req.params.id)
        if (!user){
            return res.status(404).json({message:'User not found'})
        }

        user.name = name || user.name
        user.email =email || user.email;
        user.password =password || user.password

        const updateUser = await user.save();
        res.json(updateUser)
    }catch(err){
        res.status(500).json({ message: err.message });
    }
})

//Route pour supprimer un utilisateur
app.delete('/users/:id',async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        if(!user){
            return res.status(404).json({message:'User not found'})
        }

        await user.deleteOne();
        res.json({message:'User removed'})
    }catch(err){
        res.status(500).json({ message: err.message });
    }
})

//start server
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`server est lancé sur le port ${PORT}`))
