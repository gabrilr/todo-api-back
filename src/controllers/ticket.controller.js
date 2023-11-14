import Ticket from "../models/ticket.model.js";
import User from "../models/user.model.js";

export const registerTicket = async (req, res) => {
    const { titulo, descripcion } = req.body;

    // Validación de existencia de campos
    if (!titulo || !descripcion) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    const id_responsable = req.params.id;

    try {
        // Validamos que exista el usuario antes de crear el ticket.
        const userFound = await User.findById(id_responsable);

        if (!userFound) {
            return res.status(404).json({ mensaje: "Error al crear el ticket, usuario inválido" });
        }

        try {
            const newTicket = new Ticket({
                titulo,
                descripcion,
                id_responsable,
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
