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
    fechaInicio: {
        type: Date,
        required: true,
        default: Date.now
    },
    fechaFin: {
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
