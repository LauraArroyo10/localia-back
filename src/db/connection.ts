import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import env from "../../env";
import * as schema from "./schema";

/**
 * Crea y configura la conexión con la base de datos PostgreSQL.
 */
const createPool = () => {
	return new Pool({
		connectionString: env.DATABASE_URL,
		connectionTimeoutMillis: 10000,
		max: 1,
		ssl: {
			rejectUnauthorized: false,
		},
		/**
		 * Opciones adicionales del Pool. Mantener comentadas
		 * hasta que sea necesario ajustar el comportamiento de la conexión.
		 */
		/* idleTimeoutMillis: 0,
		keepAlive: true,
		keepAliveInitialDelayMillis: 10000 */
	});
};

export const db = drizzle(createPool(), { schema });
export default db;
