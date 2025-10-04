import { populate } from "dotenv";
import messageSchema from "../models/message.js";


export const sendMessage= async(req,res)=>{
    try {
   
        let {conversation , content}= req.body;

        let addmessage = new messageSchema({
            sender: req.user._id,
            conversation,
            message:content
        })

        let populatedMessage= (await addmessage.populate("sender" , "-password"))

        await addmessage.save();

        res.status(200).json(populatedMessage)


    } catch (error) {   
        
     console.log(error);
     res.status(500).json({message:"Server Error"})

    }
}


export const getMessage = async(req,res)=>{
    try {
        
        let {convId} = req.params;
        let message =await messageSchema.find({
            conversation: convId
        }).populate("sender")

        res.status(200).json({message:"Fetched Message Succefully" , message})

    } catch (error) {

     console.log(error);
     res.status(500).json({message:"Server Error"})
        
    }
}
