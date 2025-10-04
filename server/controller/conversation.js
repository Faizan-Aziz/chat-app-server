import conversationModel from "../models/conversation.js";


export const addconversation = async(req, res) => {
    try {
        let senderID = req.user._id; 
        let { recieverID } = req.body;

        // Check if conversation already exists between these users
        const existingConversation = await conversationModel.findOne({
            members: { $all: [senderID, recieverID] }
        }).populate("members", "-password"); // ✅ Populate here

        if (existingConversation) {
            return res.status(200).json({
                message: "Conversation already exists",
                conversation: existingConversation,
                alreadyExists: true
            });
        }

        // Create new conversation only if it doesn't exist
        let newconversation = new conversationModel({
            members: [senderID, recieverID]
        });

        await newconversation.save();

        // ✅ IMPORTANT: Populate before sending response
        await newconversation.populate("members", "-password");

        res.status(201).json({
            message: "Added successfully",
            conversation: newconversation, // This now has member details
            alreadyExists: false
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
}


export const  getconversation=async(req,res)=>{

    try {

        let loogedinID= req.user._id;

        let conversation=await conversationModel.find({
            members:{$in:[loogedinID]}
        }).populate("members", "-password");

        
        res.status(200).json({
            message:"Fetched Succefully",
            conversation 
        })

        
    } catch (error) {
        
        console.log(error);
        res.status(500).json({message:"Server Error"})
    }

}

