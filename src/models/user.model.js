import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator: function (value) {
                // Expresión regular para validar formato de correo electrónico
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: 'Correo electrónico no válido',
        },
    },
    name:{
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        //Logitud minima y maxima para la contraseña.
        minlength: 60, 
        maxlength: 60, 
    },
    type_user: {
        type: String,
        required: true,
        trim: true,
        enum: ['admin', 'colab'], // Tipos de usuario permitidos permitidos
    },
    created_at: {
        type: Date,
        default: Date.now,
        validate: {
            validator: function (value) {
                return value <= new Date();
            },
            message: 'La fecha de creación no puede estar en el futuro',
        },
    },
});

export default mongoose.model('User', userSchema);