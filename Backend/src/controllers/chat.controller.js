import { chatmodel } from "../models/chat.model.js";
async function createchat(req,res) {
    const {title}=req.body
    const user=req.user
    const chat=await chatmodel.create({
        user:user._id,
        title
    });
    res.status(201).json({
        message:"Chat created successfully",
        chat:{
            _id:chat._id,
            title:chat.title,
            lastActivity:chat.lastActivity
        }
    })
}

export {createchat}