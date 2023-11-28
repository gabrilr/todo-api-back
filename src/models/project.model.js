import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({

    id_responsable: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
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
    clave:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 6,
    },
    colaboradores: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            unique: true,
        },
    ],
    fecha_inicio: {
        type: Date,
        required: true,
        default: Date.now
    },
    fecha_fin: {
        type: Date,
    },
}, {
    timestamps: true, // Agregamos campos de auditoria
});

export default mongoose.model('Project', projectSchema);
