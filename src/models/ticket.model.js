import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    
    /* En este esquema el único dato que no será obligatorio será 'descripcion' */

    titulo: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
    },
    descripcion: {
        type: String,
        trim: true,
        minlength: 10,
    },
    id_responsable: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    fotos: [{
        type: String,
        trim: true,
    }],
    comentarios: [{
        id_usuario: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        contenido: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
        },
        // foto: {
        //     type: String,
        //     trim: true,
        // },
        fecha: {
            type: Date,
            default: Date.now,
            validate: {
                validator: function (value) {
                    return value <= new Date();
                },
                message: 'La fecha de creación no puede estar en el futuro',
            },
        }
    }],
});

export default mongoose.model('Ticket', ticketSchema);