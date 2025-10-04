import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
    members:[ 
        {
          type: mongoose.Schema.Types.ObjectId,
          ref:"User"
        }
    ]
  
}, { timestamps: true }); 

const conversation = mongoose.model("Conversation", ConversationSchema);

// Export the model correctly
export default conversation;