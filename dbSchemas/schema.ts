import { pgTable, uuid, varchar, text, timestamp, foreignKey, unique, integer, boolean, numeric, jsonb, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const bookingType = pgEnum("booking_type", ['activity', 'training', 'room'])
export const bookingTypeEnum = pgEnum("booking_type_enum", ['activity', 'training', 'room'])
export const categoryArEnum = pgEnum("category_ar_enum", ['تدريب المدارس', 'بناء فرق الشركات'])
export const categoryEnEnum = pgEnum("category_en_enum", ['Schools Training', 'Corporate Team Building'])
export const locationAr = pgEnum("location_ar", ['داخلي', 'خارجي'])
export const locationEn = pgEnum("location_en", ['indoor', 'outdoor'])
export const roomTypeAr = pgEnum("room_type_ar", ['الغرف', 'الخيام'])
export const roomTypeEn = pgEnum("room_type_en", ['cabins', 'tents'])
export const userRole = pgEnum("user_role", ['user', 'admin'])


export const banners = pgTable("banners", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	alt: varchar({ length: 255 }),
	image: text(),
	descriptionEn: text("description_en"),
	descriptionAr: text("description_ar"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const bookingDisabledDates = pgTable("booking_disabled_dates", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	type: varchar({ length: 255 }).notNull(),
	refId: uuid("ref_id").notNull(),
	startDate: timestamp("start_date", { mode: 'string' }).notNull(),
	endDate: timestamp("end_date", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const resetPasswordToken = pgTable("reset_password_token", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id"),
	token: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "reset_password_token_user_id_fkey"
		}).onDelete("cascade"),
	unique("reset_password_token_token_key").on(table.token),
]);

export const activitiesBooking = pgTable("activities_booking", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	activityId: uuid("activity_id"),
	userId: uuid("user_id"),
	startTime: timestamp("start_time", { mode: 'string' }).notNull(),
	endTime: timestamp("end_time", { mode: 'string' }).notNull(),
	quantity: integer().default(1).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	isConfirmed: boolean("is_confirmed").default(false),
	isDeleted: boolean("is_deleted").default(false),
	price: numeric().default('0').notNull(),
}, (table) => [
	foreignKey({
			columns: [table.activityId],
			foreignColumns: [activities.id],
			name: "activities_booking_activity_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "activities_booking_user_id_fkey"
		}).onDelete("cascade"),
]);

export const activities = pgTable("activities", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	nameEn: varchar("name_en", { length: 255 }).notNull(),
	descriptionEn: text("description_en").notNull(),
	nameAr: varchar("name_ar", { length: 255 }).notNull(),
	descriptionAr: text("description_ar").notNull(),
	cardImage: varchar("card_image", { length: 255 }),
	locationTypeEn: locationEn("location_type_en").notNull(),
	locationTypeAr: locationAr("location_type_ar").notNull(),
	isDeleted: boolean("is_deleted").default(false),
	capacity: integer(),
	price: numeric().default('1').notNull(),
	slug: varchar({ length: 255 }).notNull(),
	headerImage: varchar("header_image", { length: 255 }),
	posterImage: varchar("poster_image", { length: 255 }),
	minimumQuantity: integer("minimum_quantity").default(0),
	comingSoon: boolean("coming_soon").default(false),
}, (table) => [
	unique("activities_slug_key").on(table.slug),
]);

export const training = pgTable("training", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	nameEn: varchar("name_en", { length: 225 }).notNull(),
	descriptionEn: text("description_en"),
	nameAr: varchar("name_ar", { length: 255 }).notNull(),
	descriptionAr: text("description_ar"),
	cardImage: varchar("card_image", { length: 255 }),
	categoryEn: categoryEnEnum("category_en"),
	categoryAr: categoryArEnum("category_ar"),
	capacity: integer(),
	price: integer(),
	startDate: timestamp("start_date", { mode: 'string' }),
	endDate: timestamp("end_date", { mode: 'string' }),
	isDeleted: boolean("is_deleted").default(false),
	slug: varchar({ length: 255 }).notNull(),
	headerImage: varchar("header_image", { length: 255 }),
	postImage: varchar("post_image", { length: 255 }),
}, (table) => [
	unique("training_slug_key").on(table.slug),
]);

export const systemJobs = pgTable("system_jobs", {
	name: text().primaryKey().notNull(),
	lastRun: timestamp("last_run", { mode: 'string' }),
});

export const payments = pgTable("payments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	cartId: uuid("cart_id").notNull(),
	userId: uuid("user_id").notNull(),
	amount: numeric({ precision: 10, scale:  2 }).notNull(),
	currency: varchar({ length: 3 }).default('JOD').notNull(),
	provider: varchar({ length: 50 }).default('hyperpay').notNull(),
	checkoutId: varchar("checkout_id", { length: 255 }),
	transactionId: varchar("transaction_id", { length: 255 }),
	status: varchar({ length: 20 }).notNull(),
	rawResponse: jsonb("raw_response"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	method: varchar({ length: 20 }).default('CARD').notNull(),
	billingCountry: varchar("billing_country", { length: 2 }),
	billingState: varchar("billing_state", { length: 100 }),
	billingCity: varchar("billing_city", { length: 100 }),
	billingStreet: varchar("billing_street", { length: 255 }),
	customerEmail: varchar("customer_email", { length: 255 }),
	customerFirstName: varchar("customer_first_name", { length: 225 }),
	customerLastName: varchar("customer_last_name", { length: 225 }),
	billingPostalCode: varchar("billing_postal_code", { length: 255 }),
}, (table) => [
	foreignKey({
			columns: [table.cartId],
			foreignColumns: [cart.id],
			name: "fk_payment_cart"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "fk_payment_user"
		}).onDelete("cascade"),
]);

export const careers = pgTable("careers", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	firstName: varchar("first_name", { length: 255 }),
	lastName: varchar("last_name", { length: 255 }),
	email: varchar({ length: 255 }),
	phoneNumber: varchar("phone_number", { length: 255 }),
	city: varchar({ length: 255 }),
	cv: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const clients = pgTable("clients", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	logo: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const accommodation = pgTable("accommodation", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	categoryNameEn: varchar("category_name_en", { length: 255 }).notNull(),
	categoryNameAr: varchar("category_name_ar", { length: 255 }).notNull(),
	descriptionEn: text("description_en"),
	descriptionAr: text("description_ar"),
	image: varchar({ length: 255 }),
	slug: varchar({ length: 255 }),
}, (table) => [
	unique("accommodation_slug_key").on(table.slug),
]);

export const courses = pgTable("courses", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	titleEn: varchar("title_en", { length: 255 }).notNull(),
	titleAr: varchar("title_ar", { length: 255 }).notNull(),
	descriptionEn: text("description_en"),
	descriptionAr: text("description_ar"),
	targetAudienceEn: text("target_audience_en").array(),
	targetAudienceAr: text("target_audience_ar").array(),
	deliveryMethodEn: text("delivery_method_en").array(),
	deliveryMethodAr: text("delivery_method_ar").array(),
	durationEn: varchar("duration_en", { length: 255 }),
	durationAr: varchar("duration_ar", { length: 255 }),
	image: text(),
	trainingId: uuid("training_id"),
});

export const ourTeam = pgTable("our_team", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	nameEn: varchar("name_en", { length: 255 }),
	nameAr: varchar("name_ar", { length: 255 }),
	descriptionEn: text("description_en"),
	descriptionAr: text("description_ar"),
	positionEn: varchar("position_en", { length: 255 }),
	positionAr: varchar("position_ar", { length: 255 }),
	image: varchar({ length: 255 }),
	displayOrder: integer("display_order").default(0),
	main: boolean().default(false),
}, (table) => [
	unique("our_team_display_order_key").on(table.displayOrder),
]);

export const role = pgTable("role", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar(),
});

export const services = pgTable("services", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	nameEn: varchar("name_en", { length: 255 }).notNull(),
	nameAr: varchar("name_ar", { length: 255 }).notNull(),
	descriptionEn: varchar("description_en", { length: 255 }),
	descriptionAr: varchar("description_ar", { length: 255 }),
	categoryId: uuid("category_id"),
	image: text(),
}, (table) => [
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [accommodation.id],
			name: "services_category_id_fkey"
		}),
]);

export const settings = pgTable("settings", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	keyNameEn: varchar("key_name_en", { length: 255 }),
	keyNameAr: varchar("key_name_ar", { length: 255 }),
	valueEn: text("value_en"),
	valueAr: text("value_ar"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const cart = pgTable("cart", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id"),
	totalAmount: numeric("total_amount").default('0'),
	isPaid: boolean("is_paid").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	checkedOutAt: timestamp("checked_out_at", { mode: 'string' }),
	expiresAt: timestamp("expires_at", { mode: 'string' }).default(sql`(now() + '24:00:00'::interval)`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "cart_user_id_fkey"
		}).onDelete("cascade"),
]);

export const trainingBooking = pgTable("training_booking", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id"),
	trainingId: uuid("training_id"),
	isDeleted: boolean("is_deleted").default(false),
	isConfirmed: boolean("is_confirmed").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	quantity: integer().default(1),
	price: numeric().default('0').notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "training_booking_user_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.trainingId],
			foreignColumns: [training.id],
			name: "training_booking_training_id_fkey"
		}).onDelete("cascade"),
]);

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	firstName: varchar("first_name", { length: 225 }).notNull(),
	lastName: varchar("last_name", { length: 225 }),
	email: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	role: userRole().default('user').notNull(),
}, (table) => [
	unique("users_email_key").on(table.email),
]);

export const cartItems = pgTable("cart_items", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	cartId: uuid("cart_id"),
	bookingType: bookingTypeEnum("booking_type").notNull(),
	bookingId: uuid("booking_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	price: numeric().default('0').notNull(),
}, (table) => [
	foreignKey({
			columns: [table.cartId],
			foreignColumns: [cart.id],
			name: "cart_items_cart_id_fkey"
		}).onDelete("cascade"),
]);

export const roomBooking = pgTable("room_booking", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id"),
	roomId: uuid("room_id"),
	startTime: timestamp("start_time", { mode: 'string' }).notNull(),
	endTime: timestamp("end_time", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	isConfirmed: boolean("is_confirmed").default(false),
	isDeleted: boolean("is_deleted").default(false),
	price: numeric().default('0').notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "room_booking_user_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.roomId],
			foreignColumns: [rooms.id],
			name: "room_booking_room_id_fkey"
		}).onDelete("cascade"),
]);

export const rooms = pgTable("rooms", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	nameEn: varchar("name_en", { length: 255 }).notNull(),
	descriptionEn: varchar("description_en", { length: 255 }),
	nameAr: varchar("name_ar", { length: 255 }).notNull(),
	descriptionAr: varchar("description_ar", { length: 255 }),
	coverImage: varchar("cover_image", { length: 255 }),
	price: numeric({ precision: 6, scale:  2 }),
	roomImages: text("room_images").array(),
	isDeleted: boolean("is_deleted").default(false),
	roomTypeEn: roomTypeEn("room_type_en").default('cabins').notNull(),
	roomTypeAr: roomTypeAr("room_type_ar").default('الغرف').notNull(),
	slug: varchar({ length: 255 }).notNull(),
}, (table) => [
	unique("rooms_slug_key").on(table.slug),
]);

export const roomsWithFeatures = pgTable("rooms_with_features", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	roomId: uuid("room_id"),
	roomFeaturesId: uuid("room_features_id"),
}, (table) => [
	foreignKey({
			columns: [table.roomId],
			foreignColumns: [rooms.id],
			name: "rooms_with_features_room_id_fkey"
		}),
	foreignKey({
			columns: [table.roomFeaturesId],
			foreignColumns: [roomFeatures.id],
			name: "rooms_with_features_room_features_id_fkey"
		}),
]);

export const roomFeatures = pgTable("room_features", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	featureTitleEn: varchar("feature_title_en", { length: 255 }),
	featureTitleAr: varchar("feature_title_ar", { length: 255 }),
	featureDescriptionEn: varchar("feature_description_en", { length: 255 }),
	featureDescriptionAr: varchar("feature_description_ar", { length: 255 }),
	isDeleted: boolean("is_deleted").default(false),
});
