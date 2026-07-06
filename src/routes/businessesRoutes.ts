import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { uploadBusinessImage } from "../middleware/upload";
import { validateBody, validateParams, validateQuery } from "../middleware/validations";
import { 
    createBusinessBodySchema, 
    updateBusinessBodySchema, 
    idParamSchema, 
    businessQuerySchema 
} from "../controllers/businessesController"; 

import {
    getBusinesses,
    getFeaturedBusinesses,
    getBusinessById,
    createBusiness,
    updateBusiness,
    deleteBusiness,
    getMyBusiness
} from "../controllers/businessesController";

const router = Router();


router.get("/featured", getFeaturedBusinesses);
router.get("/my-business", authenticateToken, getMyBusiness); 


router.get("/", validateQuery(businessQuerySchema), getBusinesses);


router.get("/:id", validateParams(idParamSchema), getBusinessById);

/**
 * Rutas de negocio con carga de imagen y validación de datos.
 */
router.post(
    "/",
    authenticateToken,
    uploadBusinessImage.single("image"),
    validateBody(createBusinessBodySchema),
    createBusiness
);

router.put(
    "/:id",
    authenticateToken,
    validateParams(idParamSchema),
    uploadBusinessImage.single("image"),
    validateBody(updateBusinessBodySchema),
    updateBusiness
);

router.delete("/:id", authenticateToken, validateParams(idParamSchema), deleteBusiness);

export default router;