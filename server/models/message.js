import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({ 

    conversation:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"Conversation"
    },
    sender:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
    message: {
        type: String,
        required:true
    }
  
}, { timestamps: true }); 

const message = mongoose.model("message", messageSchema);


export default message;