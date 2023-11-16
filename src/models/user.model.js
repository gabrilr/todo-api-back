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
    nombre:{
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    contrasena: {
        type: String,
        required: true,
        trim: true,
        //Logitud minima y maxima para la contraseña.
        minlength: 60, 
        maxlength: 60, 
    }
}, {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
});

export default mongoose.model('User', userSchema);