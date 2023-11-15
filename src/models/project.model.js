import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({

    id_responsable: {
        type: mongoose.Schema.Types.ObjectId,
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
    },
    fecha_inicio: {
        type: Date,
        required: true,
        default: Date.now
    },
    fecha_fin: {
        type: Date,
    },
    colaboradores: [{
        id_colaborador: {
            type: mongoose.Schema.Types.ObjectId,
        },
    }],
    tickets: [{
        id_ticket: {
            type: mongoose.Schema.Types.ObjectId,
        },
    }],
});

export default mongoose.model('Project', projectSchema);
