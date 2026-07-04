import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = path.join(process.cwd(), "uploads", "businesses");

if (!fs.existsSync(uploadPath)) {
	fs.mkdirSync(uploadPath, { recursive: true });
}

const productUploadPath = path.join(process.cwd(), "uploads", "products");

if (!fs.existsSync(productUploadPath)) {
	fs.mkdirSync(productUploadPath, { recursive: true });
}

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		cb(null, uploadPath);
	},

	filename: (_req, file, cb) => {
		const uniqueName =
			Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);

		cb(null, uniqueName);
	},
});

const productStorage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		cb(null, productUploadPath);
	},

	filename: (_req, file, cb) => {
		const uniqueName =
			Date.now() +
			"-" +
			Math.round(Math.random() * 1e9) +
			path.extname(file.originalname);

		cb(null, uniqueName);
	},
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
	const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

	if (allowedMimeTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error("Solo se permiten imágenes (jpeg, png, webp)"));
	}
};

export const uploadBusinessImage = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB máximo
	},
});

export const uploadProductImage = multer({
	storage: productStorage,
	fileFilter,
	limits: {
		fileSize: 5 * 1024 * 1024,
	},
});