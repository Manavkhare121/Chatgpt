import mongoose from "mongoose";
import { Schema } from "mongoose";
const userSchema=new Schema(
    {
        email:{
            type:String,
            required:true,
            unique:true,
        },
        fullName:{
            firstName:{
                type:String,
                required:true
            },
            lastName:{
                type:String,
                required:true
            }
        },password:{
            type:String,

        }
    },
    {
    timestamps:true
})

export const usermodel = mongoose.model("User", userSchema);