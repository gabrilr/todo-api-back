import projectModel from "../models/project.model.js";
import Ticket from "../models/ticket.model.js";
import User from "../models/user.model.js";

export const registerTicket = async (req, res) => {
    const { titulo, descripcion, id_responsable, fotos } = req.body;

    // Validación de existencia de campos
    if (![titulo, descripcion, id_responsable].includes('')) {
        return res.status(400).json({ mensaje: "Faltaron algunos datos" });
    }

    const id_proyecto = req.params.id;

    try {
        // Validamos que exista el usuario antes de crear el ticket.
        const project = await projectModel.findById(id_proyecto);
        const userFound = await User.findById(id_responsable);

        if (!userFound || !project) {
            return res.status(404).json({ mensaje: "Error al crear el ticket, usuario inválido" });
        }

        try {
            const newTicket = new Ticket({
                id_proyecto,
                id_responsable,
                titulo,
                descripcion,
                fotos: [],
                comentarios: [],
            });

            const ticketSaved = await newTicket.save();

            res.json({
                titulo: ticketSaved.titulo,
                descripcion: ticketSaved.descripcion,
                id_responsable: ticketSaved.id_responsable,
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: "Error interno del servidor al crear el ticket" });
        }

    } catch (error) {
        console.log("Error al crear el ticket ", error);
        res.status(500).json({ mensaje: "Error al buscar al usuario" });
    }
};
