import mongoose from "mongoose";

const databaseconnection = mongoose.connect("mongodb://localhost:27017/chat-app").then(()=>{
    console.log("daatabase connected succesfully");
    
}).catch((err)=>{

    console.log(err);
    
})

export default databaseconnection;

