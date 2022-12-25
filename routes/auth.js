const express = require('express')
const User = require('../moduls/UserSchema')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fatchUser = require('../middleware/fatchUser');
const { json } = require('express');
const router = express.Router();

const JWT_SECERT = "qwertyuiop"

router.post('/signup', [
    body('name', 'Minmum length  5 letter ').isLength({ min: 5 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'password should be 5').isLength({ min: 5 }),

], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
        res.status(400).json({ error: "email is already register" })
    } else {
        const salt = await bcrypt.genSalt(10);
        const Secpass = await bcrypt.hash(req.body.password, salt)

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: Secpass,
        })
        const data = {
            user:{id:user.id}
        }
            
        const token = jwt.sign(data, JWT_SECERT)
        res.json({token:token})
    }
})

router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'password can not black').exists(),

],async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }else{
    const{email,password}=req.body
    try {
        let user=await User.findOne({email})
        if(!user){
            res.status(400).json({ error: "email is does not exites" })
        }
        const passwordCom=await bcrypt.compare(password,user.password)
        if(!passwordCom){
            res.status(400).json({ error: "email and password not match" })
        }else{
        const data = {
            user:{id:user.id}
        }   
        const token = jwt.sign(data, JWT_SECERT)
        res.json({token:token})
    }
    } catch (error) {
        res.json({err:error})
    }
    }
})

router.post('/getuser',fatchUser,async(req,res)=>{
    try {
        userid=req.user.id;
        const user= await User.findById(userid).select("-password")
        res.json(user)
        
    } catch (error) {
        res.json({err:error})
    }
})
module.exports = router