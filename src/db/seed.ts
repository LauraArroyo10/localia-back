import { hashPassword } from "../utils/passwords";
import { db } from "./connection";
import { users } from "./schema";

/**
 * Script de seed para poblar datos iniciales en la base de datos.
 */
const seed = async () => {
	const appStage = process.env.APP_STAGE;

	if (appStage === "production") {
		console.error("ERROR: Cannot run seed script in production environment!");
		process.exit(1);
	}

	console.log(`Running seed in ${appStage} environment...`);

	try {
		console.log("Deleting existing data...");
		await db.delete(users).execute();

		console.log("Inserting seed data...");

		const hashedPassword = await hashPassword("password123");

		await db.insert(users).values([
			{
				name: "Alice Smith",
				email: "alice@example.com",
				password: hashedPassword,
				role: "tourist",
			},
			{
				name: "Bob Johnson",
				email: "bob@example.com",
				password: hashedPassword,
				role: "seller",
			},
		]);

		console.log("Seed completed successfully!");
	} catch (error) {
		console.error("Error during seeding:", error);
		process.exit(1);
	}
};

if (require.main === module) {
	seed()
		.then(() => {
			console.log("Seed script finished.");
			process.exit(0);
		})
		.catch((error) => {
			console.error("Error running seed script:", error);
			process.exit(1);
		});
}

export default seed;
