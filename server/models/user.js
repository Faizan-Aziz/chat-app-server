import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    mobilenumber: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profile: {
        type: String,
        default: "https://hips.hearstapps.com/hmg-prod/images/best-kettlebells-67336c4a20dfe.png?crop=0.503xw:1.00xh;0.252xw,0&resize=640:*",
    }
}, { timestamps: true }); // Fixed the typo here

// 1. Create the model correctly
const User = mongoose.model("User", UserSchema);

// 2. Export the model correctly
export default User;


