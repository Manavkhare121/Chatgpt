import mongoose from "mongoose";
import { Schema } from "mongoose";
const chatSchema=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    title:{
        type:String,
        required:true
    },
    lastActivity:{
        type:Date,
        default:Date.now
    }
},
{
    timestamps:true
})
export const chatmodel=mongoose.model("chat",chatSchema)