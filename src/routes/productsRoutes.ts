import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { uploadProductImage } from "../middleware/upload";
import { validateBody, validateParams } from "../middleware/validations";

import {
	createProductBodySchema,
	idParamSchema,
} from "../controllers/productController";

import {
	createProduct,
	getProductsByBusiness,
	deleteProduct,
} from "../controllers/productController";

const router = Router();

/**
 * Rutas de productos: listado por negocio, creación y borrado.
 */
router.get("/:businessId", getProductsByBusiness);

router.post(
	"/",
    authenticateToken,
    uploadProductImage.single("image"),
	validateBody(createProductBodySchema),
	createProduct
);

router.delete(
	"/:id",
	authenticateToken,
	validateParams(idParamSchema),
	deleteProduct
);

export default router;