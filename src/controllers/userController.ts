import { eq } from "drizzle-orm";
import type { Request, Response } from "express";
import db from "../db/connection";
import { users } from "../db/schema";

/**
 * Request extendida para incluir el usuario autenticado en req.user.
 */
interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email?: string;
        role?: string;
    };
}

/**
 * Actualiza el avatar del usuario autenticado.
 * Usa Multer para recibir el archivo y guarda la URL en el registro.
 */
export const updateAvatar = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "No autorizado" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No se seleccionó ninguna imagen física" });
        }

        const localAvatarUrl = `/uploads/tourists/${req.file.filename}`;

        const [updatedUser] = await db
            .update(users)
            .set({ avatar: localAvatarUrl })
            .where(eq(users.id, userId))
            .returning({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                avatar: users.avatar,
            });

        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        return res.status(200).json({
            message: "¡Foto de perfil actualizada con éxito!",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error al actualizar la foto de perfil:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};
