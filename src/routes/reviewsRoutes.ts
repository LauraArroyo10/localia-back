import { Router } from "express";
import { z } from "zod";
console.log("Reviews routes loaded");
import {
  getReviews,
  createReview,
  updateReview,
  markHelpful,
  deleteReview,
} from "../controllers/reviewsController";
import { authenticateToken, authenticateTokenOptional } from "../middleware/auth";
import { validateBody, validateParams, validateQuery } from "../middleware/validations";

/**
 * Router para reseñas: listado, creación, edición, borrado y marcado de utilidad.
 */
const router = Router({ mergeParams: true });

/**
 * Esquemas de validación para rutas de reseñas.
 */
const reviewIdSchema = z.object({
  reviewId: z.string(),
});

const businessIdSchema = z.object({
  id: z.string(),
});

/**
 * Datos requeridos para crear una reseña.
 */
const createReviewSchema = z.object({
  rating: z.number(),
  title: z.string(),
  body: z.string(),
});

/**
 * Datos permitidos para actualizar una reseña.
 */
const updateReviewSchema = z.object({
  rating: z.number(),
  title: z.string(),
  body: z.string(),
});

/**
 * Paginación opcional para listados de reseñas.
 */
const paginationSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});



/**
 * Obtiene reseñas de un negocio. El token es opcional.
 */
router.get(
  "/:id/reviews",
  authenticateTokenOptional,
  validateParams(businessIdSchema),
  validateQuery(paginationSchema),
  getReviews
);

/**
 * Crea una reseña para un negocio autenticado.
 */
router.post(
  "/:id/reviews",
  authenticateToken,
  validateParams(businessIdSchema),
  validateBody(createReviewSchema),
  createReview
);

/**
 * Actualiza una reseña existente del usuario.
 */
router.put(
  "/reviews/:reviewId",
  authenticateToken,
  validateParams(reviewIdSchema),
  validateBody(updateReviewSchema),
  updateReview
);

/**
 * Elimina una reseña de forma segura.
 */
router.delete(
  "/reviews/:reviewId",
  authenticateToken,
  validateParams(reviewIdSchema),
  deleteReview
);

/**
 * Marca una reseña como útil por parte del usuario autenticado.
 */
router.post(
  "/reviews/:reviewId/helpful",
  authenticateToken,
  validateParams(reviewIdSchema),
  markHelpful
);









export default router;