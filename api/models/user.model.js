import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true, 
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,

    },

    userType: {
        type: String,
        enum: ['admin', 'broker', 'tenant'],
        required: true,
    },

    avatar:{
        type: String,
        default: "https://www.vecteezy.com/vector-art/9292244-default-avatar-icon-vector-of-social-media-user",
    },

}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;