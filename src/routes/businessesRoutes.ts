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

router.post(
    "/", 
    authenticateToken, 
    uploadBusinessImage.single("image"), // 1. Procesa y guarda el archivo en 'uploads/businesses'
    validateBody(createBusinessBodySchema), // 2. Valida los campos de texto restantes
    createBusiness
);

router.put(
    "/:id", 
    authenticateToken, 
    validateParams(idParamSchema), 
    uploadBusinessImage.single("image"), // 1. Intercepta el archivo binario si viene en la edición
    validateBody(updateBusinessBodySchema), // 2. Valida las propiedades editadas
    updateBusiness
);

router.delete("/:id", authenticateToken, validateParams(idParamSchema), deleteBusiness);

export default router;