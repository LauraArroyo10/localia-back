import env from "./env";
import app from "./src/app";
import express from "express";

// import created routes
// import userRoutes from './src/routes/userRoutes';
import authRoutes from "./src/routes/authRoutes";
import reviewsRoutes from "./src/routes/reviewsRoutes";
import businessRoutes from "./src/routes/businessesRoutes";
import searchRoutes from "./src/routes/searchRoutes";
import favoritesRoutes from "./src/routes/favoritesRoutes";
import productsRoutes from "./src/routes/productsRoutes";
import userRoutes from "./src/routes/userRoutes"; // O la ruta correspondiente de importación


app.use("/auth", authRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/api/businesses", reviewsRoutes);
app.use("/api/search", searchRoutes);
app.use("/users", favoritesRoutes);
app.use("/api/users", userRoutes); // 👈 ¡REGISTRAMOS tus rutas de usuario reales!
app.use("/api/products", productsRoutes);


app.use("/uploads", express.static("uploads"));

app.use("/api", (_req, res) => {
	res.status(404).json({ message: "Endpoint not found" });
});

app.listen(env.PORT, () => {
	console.log(`Server running on port ${env.PORT}`);
});