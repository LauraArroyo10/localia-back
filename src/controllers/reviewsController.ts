import type { Response } from "express";
import { and, eq } from "drizzle-orm";

import db from "../db/connection";
import { reviews, reviewHelpfulVotes } from "../db/schema";
import type { AuthenticatedRequest } from "../middleware/auth";

/**
 * Obtiene reseñas de un negocio junto con información de votaciones del usuario.
 */
export const getReviews = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const businessId = req.params.id as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const currentUserId = req.user?.id;

    /**
     * Busca las reseñas del negocio y trae información básica del autor.
     */
    const businessReviews = await db.query.reviews.findMany({
      where: eq(reviews.business_id, businessId),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            avatar: true,
            location: true,
            created_at: true,
          },
        },
      },
      limit,
      offset,
    });

    let votedReviewIds = new Set<string>();
    if (currentUserId) {
      /**
       * Si el usuario está autenticado, recupera las reseñas que ya marcó como útiles.
       */
      const votes = await db.query.reviewHelpfulVotes.findMany({
        where: eq(reviewHelpfulVotes.user_id, currentUserId),
        columns: { review_id: true },
      });
      votedReviewIds = new Set(votes.map((v) => v.review_id));
    }

    /**
     * Da formato a la respuesta para incluir datos del autor y estado de voto.
     */
    const formattedReviews = businessReviews.map((r) => ({
      id: r.id,
      userId: r.user_id,
      avatar: r.user.avatar,
      location: r.user.location,
      name: r.user.name,
      joinedDate: r.user.created_at,
      rating: r.rating,
      reviewDate: r.created_at,
      title: r.title,
      body: r.body,
      helpfulCount: r.helpful,
      isOwner: currentUserId === r.user_id,
      markedHelpfulByMe: votedReviewIds.has(r.id),
    }));

    /**
     * Calcula la calificación promedio del negocio.
     */
    const allReviews = await db.query.reviews.findMany({
      where: eq(reviews.business_id, businessId),
      columns: { rating: true },
    });

    const avgRating =
      allReviews.length > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        : 0;

    return res.status(200).json({
      reviews: formattedReviews,
      avgRating: Math.round(avgRating * 10) / 10,
      page,
      limit,
    });
  } catch (error) {
    console.error("Error fetching reviews", error);
    return res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

/**
 * Crea una reseña para un negocio por el usuario autenticado.
 */
export const createReview = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const businessId = req.params.id as string;
    const { rating, title, body } = req.body;

    /**
     * Inserta la reseña en la base de datos.
     */
    const [review] = await db
      .insert(reviews)
      .values({
        user_id: userId,
        business_id: businessId,
        rating,
        title,
        body,
      })
      .returning();

    return res.status(201).json({ review });
  } catch (error) {
    console.error("Error creating review", error);
    return res.status(500).json({ message: "Failed to create review" });
  }
};

/**
 * Actualiza una reseña solo si el autor está autenticado y coincide.
 */
export const updateReview = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const reviewId = req.params.reviewId as string;
    const { rating, title, body } = req.body;

    /**
     * Verifica que la reseña exista antes de editar.
     */
    const existing = await db.query.reviews.findFirst({
      where: eq(reviews.id, reviewId),
      columns: { id: true, user_id: true },
    });

    if (!existing) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (existing.user_id !== userId) {
      return res.status(403).json({ message: "You are not allowed to edit this review" });
    }

    /**
     * Aplica los cambios y devuelve la reseña actualizada.
     */
    const [updated] = await db
      .update(reviews)
      .set({ rating, title, body, updated_at: new Date() })
      .where(eq(reviews.id, reviewId))
      .returning();

    return res.status(200).json({ review: updated });
  } catch (error) {
    console.error("Error updating review", error);
    return res.status(500).json({ message: "Failed to update review" });
  }
};

/**
 * Elimina una reseña si el usuario es su autor o el dueño del negocio.
 */
export const deleteReview = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const reviewId = req.params.reviewId as string;

    const existing = await db.query.reviews.findFirst({
      where: eq(reviews.id, reviewId),
      with: {
        business: {
          columns: { owner_id: true },
        },
      },
    });

    if (!existing) {
      return res.status(404).json({ message: "Review not found" });
    }

    const isReviewOwner = existing.user_id === userId;
    const isBusinessOwner = existing.business.owner_id === userId;

    if (!isReviewOwner && !isBusinessOwner) {
      return res.status(403).json({ message: "You are not allowed to delete this review" });
    }

    await db.delete(reviews).where(eq(reviews.id, reviewId));

    return res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    console.error("Error deleting review", error);
    return res.status(500).json({ message: "Failed to delete review" });
  }
};

/**
 * Marca una reseña como útil si el usuario no es su autor y aún no la ha votado.
 */
export const markHelpful = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const reviewId = req.params.reviewId as string;

    /**
     * Verifica que la reseña exista y trae su autor.
     */
    const existing = await db.query.reviews.findFirst({
      where: eq(reviews.id, reviewId),
      columns: { id: true, user_id: true, helpful: true },
    });

    if (!existing) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (existing.user_id === userId) {
      return res.status(403).json({ message: "You cannot mark your own review as helpful" });
    }

    /**
     * Evita que el mismo usuario marque la reseña más de una vez.
     */
    const alreadyVoted = await db.query.reviewHelpfulVotes.findFirst({
      where: and(
        eq(reviewHelpfulVotes.review_id, reviewId),
        eq(reviewHelpfulVotes.user_id, userId),
      ),
    });

    if (alreadyVoted) {
      return res.status(409).json({ message: "You already marked this review as helpful" });
    }

    await db.insert(reviewHelpfulVotes).values({
      review_id: reviewId,
      user_id: userId,
    });

    const [updated] = await db
      .update(reviews)
      .set({ helpful: existing.helpful + 1 })
      .where(eq(reviews.id, reviewId))
      .returning({ helpful: reviews.helpful });

    return res.status(200).json({ helpful: updated.helpful, markedHelpfulByMe: true });
  } catch (error) {
    console.error("Error marking review as helpful", error);
    return res.status(500).json({ message: "Failed to mark as helpful" });
  }
};
