import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    name:{
        type: String,
        required: true,
        trim: true,
    },
    password:{
        type: String,
        required: true,
        trim: true,
    },
    type_user: {
        type: String,
        required: true,
        trim: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    }
});

export default mongoose.model('User', userSchema);