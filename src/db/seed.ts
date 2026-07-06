// import { hashPassword } from "../utils/passwords";
// import { db } from "./connection";
// import { users } from "./schema";

// /**
//  * Script de seed para poblar datos iniciales en la base de datos.
//  */
// const seed = async () => {
// 	const appStage = process.env.APP_STAGE;

// 	if (appStage === "production") {
// 		console.error("ERROR: Cannot run seed script in production environment!");
// 		process.exit(1);
// 	}

// 	console.log(`Running seed in ${appStage} environment...`);

// 	try {
// 		console.log("Deleting existing data...");
// 		await db.delete(users).execute();

// 		console.log("Inserting seed data...");

// 		const hashedPassword = await hashPassword("password123");

// 		await db.insert(users).values([
// 			{
// 				name: "Alice Smith",
// 				email: "alice@example.com",
// 				password: hashedPassword,
// 				role: "tourist",
// 			},
// 			{
// 				name: "Bob Johnson",
// 				email: "bob@example.com",
// 				password: hashedPassword,
// 				role: "seller",
// 			},
// 		]);

// 		console.log("Seed completed successfully!");
// 	} catch (error) {
// 		console.error("Error during seeding:", error);
// 		process.exit(1);
// 	}
// };

// if (require.main === module) {
// 	seed()
// 		.then(() => {
// 			console.log("Seed script finished.");
// 			process.exit(0);
// 		})
// 		.catch((error) => {
// 			console.error("Error running seed script:", error);
// 			process.exit(1);
// 		});
// }

// export default seed;
import { db } from "./connection";
import { businesses, favorites, products, reviews, users, categoryEnum, businessTypeEnum } from "./schema";

/**
 * Seed adicional para negocios, productos y reseñas.
 * No borra datos existentes: agrega contenido nuevo y evita duplicados por nombre de negocio.
 */

type Category = (typeof categoryEnum.enumValues)[number];
type BusinessType = (typeof businessTypeEnum.enumValues)[number];

interface ProductSeed {
	image: string;
	name: string;
	price: string;
	description: string;
}

interface BusinessSeed {
	image: string;
	name: string;
	description: string;
	category: Category;
	type: BusinessType;
	city: string;
	lat: string;
	lng: string;
	products: ProductSeed[];
}

// ---------------------------------------------------------------------------
// Coordenadas de referencia dentro de Costa Rica
// ---------------------------------------------------------------------------

const SAN_JOSE = { city: "San José", lat: "9.9281", lng: "-84.0907" };
const ESPARZA = { city: "Esparza", lat: "9.9989", lng: "-84.6636" };
const PUNTARENAS = { city: "Puntarenas", lat: "9.9763", lng: "-84.8384" };
const MONTEVERDE = { city: "Monteverde", lat: "10.3181", lng: "-84.8064" };
const LA_FORTUNA = { city: "La Fortuna", lat: "10.4679", lng: "-84.6428" };
const GOLFITO = { city: "Golfito", lat: "8.6415", lng: "-83.1568" };
const TAMARINDO = { city: "Tamarindo", lat: "10.2993", lng: "-85.8371" };
const HEREDIA = { city: "Heredia", lat: "9.9981", lng: "-84.1169" };
const ALAJUELA = { city: "Alajuela", lat: "10.0163", lng: "-84.2116" };
const CARTAGO = { city: "Cartago", lat: "9.8644", lng: "-83.9181" };
const LIBERIA = { city: "Liberia", lat: "10.6350", lng: "-85.4378" };
const QUEPOS = { city: "Quepos", lat: "9.4236", lng: "-84.1657" };
const PUERTO_VIEJO = { city: "Puerto Viejo", lat: "9.6533", lng: "-82.7547" };

// ---------------------------------------------------------------------------
// Negocios curados con categorías, productos y reseñas alineadas
// ---------------------------------------------------------------------------

const BUSINESS_SEEDS: BusinessSeed[] = [
	{
		image: "cafeCostaRica.jpg",
		name: "Café de Altura Tarrazú",
		description:
			"Finca familiar dedicada a producir café de altura con procesos tradicionales y vistas panorámicas hacia las montañas.",
		category: "Gastronomy",
		type: "service",
		...SAN_JOSE,
		products: [
			{
				image: "tiramisu.jpg",
				name: "Café en grano especial",
				price: "8.50",
				description: "Café 100% costarricense cultivado en las montañas de Tarrazú.",
			},
			{
				image: "carlota.jpg",
				name: "Café con panela artesanal",
				price: "4.50",
				description: "Bebida preparada con panela y notas florales de la cosecha local.",
			},
			{
				image: "parfeifresa.jpg",
				name: "Panes de café con cacao",
				price: "6.00",
				description: "Delicia horneada con granos locales y cacao de la región.",
			},
			{
				image: "bolsotradicional.jpg",
				name: "Taza de cerámica local",
				price: "14.00",
				description: "Ideal para llevar como recuerdo de Costa Rica.",
			},
		],
	},
	{
		image: "batido.jpg",
		name: "Chocolatería Artesanal La Selva",
		description:
			"Pequeña chocolatería que combina cacao local con recetas tradicionales y una fuerte identidad artesanal.",
		category: "Gastronomy",
		type: "service",
		...HEREDIA,
		products: [
			{
				image: "postremango.webp",
				name: "Chocolate amargo 70%",
				price: "7.00",
				description: "Elaborado artesanalmente por productores locales.",
			},
			{
				image: "postrefresa.jpg",
				name: "Bombón de café y naranja",
				price: "4.50",
				description: "Una mezcla equilibrada de cacao, café y cítricos tropicales.",
			},
			{
				image: "flan.jpg",
				name: "Mousse de chocolate",
				price: "5.50",
				description: "Postre cremoso con cacao fino y toque de vainilla local.",
			},
			{
				image: "gelatina.jpg",
				name: "Caja de chocolates surtidos",
				price: "12.00",
				description: "Regalo perfecto para compartir con amigos o familiares.",
			},
		],
	},
	{
		image: "localcomida.jpg",
		name: "Trapiche Tradicional El Arenal",
		description:
			"Trapiche familiar donde se conserva la tradición del jugo de caña y la producción artesanal de panela.",
		category: "Local Food",
		type: "service",
		...ALAJUELA,
		products: [
			{
				image: "alimentacion.jpg",
				name: "Panela fresca",
				price: "3.50",
				description: "Panela de caña elaborada con procesos tradicionales en el trapiche.",
			},
			{
				image: "hiervabuena.jpg",
				name: "Guaro de caña artesanal",
				price: "11.00",
				description: "Bebida fermentada preparada con caña de la región.",
			},
			{
				image: "boquitadebar.jpg",
				name: "Tortas de panela",
				price: "4.75",
				description: "Tortas suaves y aromáticas con sabor a caña de azúcar.",
			},
			{
				image: "tragoslimon.jpg",
				name: "Caña de azúcar molida",
				price: "2.25",
				description: "Producto tradicional ideal para preparar bebidas caseras.",
			},
		],
	},
	{
		image: "postremaracuya.jpg",
		name: "Finca Orgánica Los Pinos",
		description:
			"Finca ecológica que combina cultivos orgánicos, turismo rural y experiencias de aprendizaje para visitantes.",
		category: "Artisan Goods",
		type: "activity",
		...CARTAGO,
		products: [
			{
				image: "carlota.jpg",
				name: "Miel orgánica de flores",
				price: "9.00",
				description: "Miel pura recolectada en huertos y jardines de la finca.",
			},
			{
				image: "estofado.jpg",
				name: "Salsa de hierbas orgánicas",
				price: "5.50",
				description: "Salsa preparada con plantas aromáticas del cultivo local.",
			},
			{
				image: "mielcruda.jpg",
				name: "Té de hierbas medicinales",
				price: "4.25",
				description: "Infusión de plantas aromáticas cultivadas sin agroquímicos.",
			},
			{
				image: "jabon.jpg",
				name: "Jabón de aloe y lavanda",
				price: "6.00",
				description: "Elaborado artesanalmente con ingredientes de la finca.",
			},
		],
	},
	{
		image: "biodiversityCostaRica.jpg",
		name: "Jardín Botánico Las Nubes",
		description:
			"Espacio natural con senderos, colecciones de plantas nativas y guías especializados en conservación.",
		category: "Tours & Adventures",
		type: "activity",
		...HEREDIA,
		products: [
			{
				image: "guiatourbiodiversidad.jpg",
				name: "Guía de senderismo ecológico",
				price: "22.00",
				description: "Experiencia guiada por expertos certificados.",
			},
			{
				image: "equipofotostourbiodiversidad.jpg",
				name: "Kit de observación botánica",
				price: "12.50",
				description: "Incluye lupa, libreta y guía práctica para identificar especies.",
			},
			{
				image: "alimentaciontourbiodiversidad.jpg",
				name: "Cesta de picnic ecológica",
				price: "8.50",
				description: "Picnic preparado con productos locales y reciclables.",
			},
			{
				image: "bolsotradcional2.jpg",
				name: "Botella térmica de viaje",
				price: "16.00",
				description: "Ideal para recorrer jardines y bosques de forma cómoda.",
			},
		],
	},
	{
		image: "rioTourCostaRica.jpg",
		name: "Mariposario El Bosque",
		description:
			"Mariposario dedicado a la conservación de especies locales y a la educación ambiental para familias y turistas.",
		category: "Tours & Adventures",
		type: "activity",
		...ALAJUELA,
		products: [
			{
				image: "kayakEquipo.jpg",
				name: "Entrada con guía especializado",
				price: "18.00",
				description: "Visita guiada por expertos en mariposas y polinización.",
			},
			{
				image: "transporte.jpg",
				name: "Traslado desde la zona central",
				price: "10.00",
				description: "Servicio cómodo para quienes llegan desde San José o Alajuela.",
			},
			{
				image: "mielesespeciales.jpg",
				name: "Kit de fotografía natural",
				price: "14.00",
				description: "Ideal para capturar imágenes de mariposas en su entorno.",
			},
			{
				image: "explicacionabejas.jpg",
				name: "Taller de conservación",
				price: "9.00",
				description: "Sesión breve sobre biodiversidad, hábitats y cuidado del entorno.",
			},
		],
	},
	{
		image: "parquenacionalCostaRicacolaballena.jpg",
		name: "Refugio de Perezosos Monteverde",
		description:
			"Refugio de vida silvestre enfocado en el cuidado de perezosos y la educación ambiental en la zona de Monteverde.",
		category: "Tours & Adventures",
		type: "activity",
		...MONTEVERDE,
		products: [
			{
				image: "transporte4x4rio.jpg",
				name: "Tour de observación de vida silvestre",
				price: "24.00",
				description: "Ruta guiada para observar perezosos y aves en su hábitat.",
			},
			{
				image: "actividadenrio.jpg",
				name: "Entrada con guía local",
				price: "16.00",
				description: "Recorrido guiado por expertos en fauna de montaña.",
			},
			{
				image: "estadia.jpg",
				name: "Paquete de fotografía de fauna",
				price: "20.00",
				description: "Perfecto para quienes desean capturar animales en su entorno natural.",
			},
			{
				image: "miradormontanaargentinaroja.jpg",
				name: "Café de montaña para llevar",
				price: "6.50",
				description: "Bebida típica para cerrar la visita con un sabor local.",
			},
		],
	},
	{
		image: "tourCostaRicamiel.jpg",
		name: "Tour de Cacao del Caribe",
		description:
			"Experiencia de campo donde se aprende sobre la cosecha, fermentación y elaboración del cacao local.",
		category: "Tours & Adventures",
		type: "activity",
		...PUERTO_VIEJO,
		products: [
			{
				image: "mielcruda.jpg",
				name: "Chocolate artesanal con cacao local",
				price: "8.50",
				description: "Chocolate producido con cacao de origen local y recetas tradicionales.",
			},
			{
				image: "velasceraabeja.jpg",
				name: "Cacao tostado premium",
				price: "10.00",
				description: "Cacao seleccionado con notas frutales y un perfil aromático muy particular.",
			},
			{
				image: "parfeifresa.jpg",
				name: "Taller de fermentación",
				price: "15.00",
				description: "Clase práctica para conocer los procesos del cacao desde la cosecha.",
			},
			{
				image: "carlota.jpg",
				name: "Mousse de cacao tropical",
				price: "5.50",
				description: "Postre suave con un toque de fruta tropical del Caribe.",
			},
		],
	},
	{
		image: "tourgirasolesCostarica.jpg",
		name: "Tour de Café de la Montaña",
		description:
			"Recorrido por fincas cafetaleras donde se explica el proceso del café desde la siembra hasta la taza.",
		category: "Tours & Adventures",
		type: "activity",
		...CARTAGO,
		products: [
			{
				image: "tiramisu.jpg",
				name: "Café de especialidad",
				price: "9.50",
				description: "Café de finca con perfil aromático complejo y cuerpo equilibrado.",
			},
			{
				image: "carlota.jpg",
				name: "Café con leche de coco",
				price: "5.50",
				description: "Bebida cremosa inspirada en los sabores tropicales de Costa Rica.",
			},
			{
				image: "jabon.jpg",
				name: "Aceite de café artesanal",
				price: "7.00",
				description: "Producto inspirado en los procesos tradicionales del café.",
			},
			{
				image: "bolsotradicional.jpg",
				name: "Molinillo de café manual",
				price: "13.50",
				description: "Herramienta artesanal perfecta para preparar café en casa.",
			},
		],
	},
	{
		image: "puestolocalbolsos.jpg",
		name: "Tienda Indígena Bribri",
		description:
			"Espacio de comercio justo donde se promueve el arte y la tradición de la comunidad Bribri.",
		category: "Shopping",
		type: "product",
		...PUERTO_VIEJO,
		products: [
			{
				image: "bolsotradcional2.jpg",
				name: "Mochila tejida a mano",
				price: "19.00",
				description: "Hecha a mano con técnicas tradicionales y materiales locales.",
			},
			{
				image: "ojoturco.jpg",
				name: "Collar de semillas y fibras",
				price: "8.50",
				description: "Diseño artesanal con significado cultural y valor decorativo.",
			},
			{
				image: "faldasouvenir.jpg",
				name: "Falda de algodón tradicional",
				price: "22.00",
				description: "Prenda inspirada en los textiles de las comunidades locales.",
			},
			{
				image: "bolsotradicional.jpg",
				name: "Bolso de fibras naturales",
				price: "16.50",
				description: "Ideal para llevar recuerdos de Costa Rica con estilo.",
			},
		],
	},
	{
		image: "soda.jpg",
		name: "Mercado de Artesanías Sarchí",
		description:
			"Mercado tradicional donde convergen artesanos, madera fina y recuerdos de las diferentes regiones del país.",
		category: "Shopping",
		type: "product",
		...ALAJUELA,
		products: [
			{
				image: "alimentacionmuseo.jpg",
				name: "Juguete de madera tallada",
				price: "11.00",
				description: "Pieza artesanal creada por artesanos locales con detalles únicos.",
			},
			{
				image: "alimentacionpescado.jpg",
				name: "Cesta tejida a mano",
				price: "14.00",
				description: "Diseño útil y decorativo con técnicas heredadas de generación en generación.",
			},
			{
				image: "pedicure.jpg",
				name: "Cuadro de barrio tradicional",
				price: "18.50",
				description: "Obra inspirada en los paisajes y la vida cotidiana de Costa Rica.",
			},
			{
				image: "facemask.jpg",
				name: "Set de artesanías para regalo",
				price: "24.00",
				description: "Perfecto para llevar como souvenir de una experiencia auténtica.",
			},
		],
	},
	{
		image: "spaCostaRica.jpg",
		name: "Escuela de Surf Playa Hermosa",
		description:
			"Escuela de surf con instructores certificados, clases para principiantes y una gran conexión con el mar.",
		category: "Wellness",
		type: "service",
		...LIBERIA,
		products: [
			{
				image: "pedicure.jpg",
				name: "Clase de surf iniciación",
				price: "35.00",
				description: "Clase guiada para quienes quieren aprender en aguas tranquilas.",
			},
			{
				image: "jabon.jpg",
				name: "Alquiler de tabla de surf",
				price: "18.00",
				description: "Tabla lista para usar con protección y asesoría del instructor.",
			},
			{
				image: "flan.jpg",
				name: "Paquete de fotos de surf",
				price: "15.00",
				description: "Sesión de fotos para conservar el recuerdo de la primera experiencia.",
			},
			{
				image: "gelatina.jpg",
				name: "Clase de seguridad en el mar",
				price: "12.00",
				description: "Taller práctico para aprender a leer olas y moverse con seguridad.",
			},
		],
	},
	{
		image: "tourManzanasCostaRica.jpg",
		name: "Alquiler de Bicicletas Costa Rica",
		description:
			"Servicio de bicicletas para recorrer playas, parques y ciudades con rutas guiadas y equipamiento básico.",
		category: "Transport",
		type: "product",
		...QUEPOS,
		products: [
			{
				image: "campoManzanas.jpg",
				name: "Bicicleta urbana híbrida",
				price: "16.00",
				description: "Ideal para recorrer senderos y avenidas con comodidad.",
			},
			{
				image: "degustacionVinoManZana.jpg",
				name: "Bicicleta de montaña",
				price: "24.00",
				description: "Perfecta para rutas de tierra y recorridos más exigentes.",
			},
			{
				image: "tiramisu.jpg",
				name: "Casco y kit de seguridad",
				price: "10.00",
				description: "Incluye casco, candado y luces para un viaje seguro.",
			},
			{
				image: "carlota.jpg",
				name: "Ruta guiada en bicicleta",
				price: "20.00",
				description: "Recorrido acompañado por un guía local para descubrir la zona.",
			},
		],
	},
	{
		image: "equipoparanieve.jpg",
		name: "Pesca Deportiva Mar Azul",
		description:
			"Operador de pesca deportiva con salidas guiadas en embarcaciones pequeñas y experiencia en aguas costeras.",
		category: "Beach",
		type: "activity",
		...QUEPOS,
		products: [
			{
				image: "equipocompletosnowboarding.jpg",
				name: "Salida de media jornada",
				price: "80.00",
				description: "Ideal para quienes desean disfrutar una experiencia de pesca en poco tiempo.",
			},
			{
				image: "actividadsnowboarding.jpg",
				name: "Equipo de pesca incluido",
				price: "35.00",
				description: "Varas, señuelos y cajón de herramientas para toda la salida.",
			},
			{
				image: "transporte4x4rio.jpg",
				name: "Traslado al puerto",
				price: "12.00",
				description: "Servicio cómodo y directo hacia el punto de embarque.",
			},
			{
				image: "estadia.jpg",
				name: "Pack de fotos de pesca",
				price: "18.00",
				description: "Captura recuerdos de la experiencia con fotos de alta calidad.",
			},
		],
	},
	{
		image: "tacosdebirria.jpg",
		name: "Observación de Tortugas Las Baulas",
		description:
			"Programa guiado para observar tortugas marinas y aprender sobre conservación en zonas costeras protegidas.",
		category: "Beach",
		type: "activity",
		...LIBERIA,
		products: [
			{
				image: "alimentacionaguacoco.jpg",
				name: "Tour nocturno de tortugas",
				price: "25.00",
				description: "Observación guiada en horarios especiales para ver a las tortugas en su hábitat.",
			},
			{
				image: "parfeifresa.jpg",
				name: "Kit de conservación",
				price: "9.00",
				description: "Incluye guía de campo y materiales de educación ambiental.",
			},
			{
				image: "mielcruda.jpg",
				name: "Entrada con guía experto",
				price: "16.00",
				description: "Experiencia guiada por profesionales certificados en conservación marina.",
			},
			{
				image: "carlota.jpg",
				name: "Pack de fotos de la experiencia",
				price: "12.00",
				description: "Momentos únicos para recordar la visita a la playa protegida.",
			},
		],
	},
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MIN_DESCRIPTION_LENGTH = 20;

/** Garantiza que la descripción tenga al menos MIN_DESCRIPTION_LENGTH caracteres. */
function ensureMinDescription(description: string, fallbackSuffix: string): string {
	if (description.trim().length >= MIN_DESCRIPTION_LENGTH) return description;
	return `${description} ${fallbackSuffix}`.trim();
}

/** Genera un email de seller a partir del nombre del negocio, sin espacios ni tildes. */
function emailFromBusinessName(name: string): string {
	const slug = name
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "") // quita tildes
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, ".")
		.replace(/^\.+|\.+$/g, "");
	return `${slug}.seller@example.com`;
}

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------

const seedBusinessesAndProducts = async () => {
	const appStage = process.env.APP_STAGE;

	if (appStage === "production") {
		console.error("ERROR: Cannot run seed script in production environment!");
		process.exit(1);
	}

	console.log(`Running businesses/products seed in ${appStage} environment...`);
	console.log("Modo aditivo: no se borra ningún dato existente.");

	try {
		// 1. Evitar duplicar negocios ya existentes (comparando por nombre)
		const existingBusinesses = await db.select({ name: businesses.name }).from(businesses);
		const existingBusinessNames = new Set(existingBusinesses.map((b) => b.name));

		const pendingBusinesses = BUSINESS_SEEDS.filter((b) => !existingBusinessNames.has(b.name));

		if (pendingBusinesses.length === 0) {
			console.log("No hay negocios nuevos que insertar (ya existían todos).");
			return;
		}

		// 2. Crear un usuario seller dedicado por cada negocio nuevo
		console.log(`Creando ${pendingBusinesses.length} sellers (uno por negocio nuevo)...`);
		const { hashPassword } = await import("../utils/passwords");
		const hashedPassword = await hashPassword("Password123");

		const usedEmails = new Set((await db.select({ email: users.email }).from(users)).map((u) => u.email));

		const sellerDrafts = pendingBusinesses.map((b, i) => {
			let email = emailFromBusinessName(b.name);
			if (usedEmails.has(email)) {
				email = `${email.split("@")[0]}.${i}.${Date.now()}@example.com`;
			}
			usedEmails.add(email);
			return {
				name: `${b.name} Owner`,
				email,
				password: hashedPassword,
				role: "seller" as const,
			};
		});

		const touristDrafts = [
			{ name: "María Sol", email: "maria.tourist@example.com", password: hashedPassword, role: "tourist" as const },
			{ name: "Carlos Vega", email: "carlos.tourist@example.com", password: hashedPassword, role: "tourist" as const },
			{ name: "Sofía Ramírez", email: "sofia.tourist@example.com", password: hashedPassword, role: "tourist" as const },
		].map((draft, index) => {
			let email = draft.email;
			if (usedEmails.has(email)) {
				email = `${draft.email.split("@")[0]}.${index}.${Date.now()}@example.com`;
			}
			usedEmails.add(email);
			return { ...draft, email };
		});

		const allUserDrafts = [...sellerDrafts, ...touristDrafts];
		const insertedUsers = await db.insert(users).values(allUserDrafts).returning();
		const insertedSellers = insertedUsers.slice(0, sellerDrafts.length);
		const insertedTourists = insertedUsers.slice(sellerDrafts.length);

		// 3. Insertar los negocios, cada uno con su seller recién creado como owner
		const newBusinessRows = pendingBusinesses.map((b, i) => ({
			owner_id: insertedSellers[i].id,
			name: b.name,
			description: ensureMinDescription(b.description, "Descubrí una experiencia auténtica en Costa Rica."),
			category: b.category,
			type: b.type,
			phone: null,
			image_url: `/uploads/businesses/${b.image}`,
			address: b.city,
			city: b.city,
			lat: b.lat,
			lng: b.lng,
		}));

		console.log(`Insertando ${newBusinessRows.length} negocios nuevos...`);
		const insertedBusinesses = await db.insert(businesses).values(newBusinessRows).returning();

		// 4. Insertar los productos asociados a cada negocio recién creado
		const newProductRows = pendingBusinesses.flatMap((b, i) => {
			const business = insertedBusinesses[i];
			return b.products.map((p) => ({
				business_id: business.id,
				image: `/uploads/products/${p.image}`,
				name: p.name,
				description: ensureMinDescription(p.description, "Producto preparado con identidad local y cariño."),
				price: p.price,
			}));
		});

		if (newProductRows.length > 0) {
			console.log(`Insertando ${newProductRows.length} productos nuevos...`);
			await db.insert(products).values(newProductRows);
		} else {
			console.log("No hay productos nuevos que insertar.");
		}

		// 5. Insertar reseñas personalizadas según el negocio
		const existingReviews = await db.select({ business_id: reviews.business_id, user_id: reviews.user_id }).from(reviews);
		const reviewedPairs = new Set(existingReviews.map((review) => `${review.business_id}:${review.user_id}`));

		const reviewRows = insertedBusinesses.flatMap((business, index) => {
			const businessSeed = pendingBusinesses[index];
			const reviewTemplates = reviewVariantsForBusiness(businessSeed);
			return reviewTemplates.flatMap((review, reviewIndex) => {
				const reviewer = insertedTourists[(index + reviewIndex) % insertedTourists.length];
				if (!reviewer) return [];
				const key = `${business.id}:${reviewer.id}`;
				if (reviewedPairs.has(key)) return [];
				reviewedPairs.add(key);
				return [
					{
						user_id: reviewer.id,
						business_id: business.id,
						rating: review.rating,
						title: review.title,
						body: review.body,
					},
				];
			});
		});

		if (reviewRows.length > 0) {
			console.log(`Insertando ${reviewRows.length} reseñas nuevas...`);
			await db.insert(reviews).values(reviewRows);
		}

		// 6. Insertar favoritos para algunos turistas
		const existingFavorites = await db.select({ user_id: favorites.user_id, business_id: favorites.business_id }).from(favorites);
		const favoritePairs = new Set(existingFavorites.map((favorite) => `${favorite.user_id}:${favorite.business_id}`));

		const favoriteRows = insertedTourists.flatMap((tourist, touristIndex) => {
			const selectedBusinesses = insertedBusinesses.filter((_, businessIndex) => businessIndex % 3 === touristIndex % 3).slice(0, 2);
			return selectedBusinesses
				.map((business) => {
					const key = `${tourist.id}:${business.id}`;
					if (favoritePairs.has(key)) return undefined;
					favoritePairs.add(key);
					return { user_id: tourist.id, business_id: business.id };
				})
				.filter((row): row is { user_id: string; business_id: string } => row !== undefined);
		});

		if (favoriteRows.length > 0) {
			console.log(`Insertando ${favoriteRows.length} favoritos nuevos...`);
			await db.insert(favorites).values(favoriteRows);
		}

		console.log("Seed de negocios/productos completado exitosamente!");
	} catch (error) {
		console.error("Error durante el seed de negocios/productos:", error);
		process.exit(1);
	}
};

function reviewForBusiness(business: BusinessSeed) {
	const lowerName = business.name.toLowerCase();
	if (
		business.category === "Gastronomy" ||
		lowerName.includes("café") ||
		lowerName.includes("chocolatería") ||
		lowerName.includes("cacao") ||
		lowerName.includes("trapiche")
	) {
		return {
			rating: 5,
			title: "Sabor auténtico",
			body: `${business.name} ofrece una experiencia muy acogedora, con sabores que recuerdan a los lugares más tradicionales de Costa Rica.`,
		};
	}

	if (
		business.category === "Tours & Adventures" ||
		lowerName.includes("tour") ||
		lowerName.includes("mariposario") ||
		lowerName.includes("tortuga") ||
		lowerName.includes("refugio")
	) {
		return {
			rating: 5,
			title: "Experiencia inolvidable",
			body: `La guía, la logística y el entorno hicieron que ${business.name} fuera una visita muy memorable y llena de aprendizaje.`,
		};
	}

	if (business.category === "Wellness") {
		return {
			rating: 5,
			title: "Relajación total",
			body: `El trato fue excelente y el ambiente de ${business.name} hizo que el descanso fuera realmente reparador.`,
		};
	}

	if (business.category === "Shopping" || business.category === "Artisan Goods") {
		return {
			rating: 4,
			title: "Recuerdo especial",
			body: `Encontré piezas muy bonitas y con un valor cultural muy claro en ${business.name}.`,
		};
	}

	return {
		rating: 5,
		title: "Muy recomendable",
		body: `${business.name} refleja la identidad local y ofrece una experiencia auténtica para quienes visitan la zona.`,
	};
}

function reviewVariantsForBusiness(business: BusinessSeed) {
	const primary = reviewForBusiness(business);
	const secondary = {
		...primary,
		rating: primary.rating === 5 ? 4 : 5,
		title: primary.title === "Sabor auténtico" ? "Perfecto para regresar" : "Recomendado por la calidad",
		body:
			primary.title === "Sabor auténtico"
				? `Volvería a visitar ${business.name} por la calidez del servicio y la autenticidad de cada detalle.`
				: `La experiencia en ${business.name} fue muy bien organizada y dejó una impresión muy positiva.`,
	};
	return [primary, secondary];
}

if (require.main === module) {
	seedBusinessesAndProducts()
		.then(() => {
			console.log("Seed script finished.");
			process.exit(0);
		})
		.catch((error) => {
			console.error("Error running seed script:", error);
			process.exit(1);
		});
}

export default seedBusinessesAndProducts;