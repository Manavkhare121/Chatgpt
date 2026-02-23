import { usermodel } from "../models/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
async function registerUser(req,res) {
    const {email,fullName:{firstName,lastName},password}=req.body

    const isUserAlreadyExists=await usermodel.findOne({email})

    if(isUserAlreadyExists){
        res.status(400).json({message:"User is already exists"})
    }

    const hashPassword=await bcrypt.hash(password,10)
    const user=await usermodel.create({
        fullName:{
            firstName,lastName
        },
        email,
        password:hashPassword
    })

    const token =jwt.sign({id:user._id},process.env.JWT_SECRET)

    res.cookie("token",token);

    res.status(201).json({
        message:"User registered successfully",
        user:{
            email:user.email,
            _id:user._id,
            fullName:user.fullName
        }
    })
}

async function loginUser(req,res) {
    const {email,password}=req.body
    const user=await usermodel.findOne({
        email
    })

    if(!user){
        return res.status(400).json({message:"Invalid email or password"});
    }

    const isPasswordValid=await bcrypt.compare(password,user.password);

    if(!isPasswordValid){
        return res.status(400).json({message:"Invalid email or password"})
    }

    const token=jwt.sign({id:user._id},process.env.JWT_SECRET);

    res.cookie("token",token);

    res.status(200).json({
        message:"user logged in successfully",
        user:{
            email:user.email,
            _id:user._id,
            fullName:user.fullName
        }
    })
}

export {registerUser,loginUser}