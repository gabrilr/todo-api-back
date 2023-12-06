import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    id_proyecto: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Project'
    },
    id_responsable: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    titulo: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
    },
    /* En este esquema el único dato que no será obligatorio será 'descripcion' */
    descripcion: {
        type: String,
        trim: true,
        minlength: 10,
    },
    estatus: {
        type: String,
        trim: true,
        enum: ['todo', 'doing', 'check', 'done'],
        default: 'todo',
    },
    fotos: [
        {
            type: String,
            trim: true,
            unique: true
        }
    ],
    fecha_inicio: {
        type: Date,
        default: Date.now
    },
    fecha_fin: {
        type: Date,
    },
    comentarios: [
        {
            id_usuario: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'User'
            },
            contenido: {
                type: String,
                required: true,
                trim: true,
                minlength: 2,
            },
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
        }
    ],
}, {
    timestamps: true, // Agregamos campos de auditoria
});

export default mongoose.model('Ticket', ticketSchema);