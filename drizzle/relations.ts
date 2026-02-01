import { relations } from "drizzle-orm/relations";
import { users, resetPasswordToken, activities, activitiesBooking, cart, payments, accommodation, services, trainingBooking, training, cartItems, roomBooking, rooms, roomsWithFeatures, roomFeatures } from "./schema";

export const resetPasswordTokenRelations = relations(resetPasswordToken, ({one}) => ({
	user: one(users, {
		fields: [resetPasswordToken.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	resetPasswordTokens: many(resetPasswordToken),
	activitiesBookings: many(activitiesBooking),
	payments: many(payments),
	carts: many(cart),
	trainingBookings: many(trainingBooking),
	roomBookings: many(roomBooking),
}));

export const activitiesBookingRelations = relations(activitiesBooking, ({one}) => ({
	activity: one(activities, {
		fields: [activitiesBooking.activityId],
		references: [activities.id]
	}),
	user: one(users, {
		fields: [activitiesBooking.userId],
		references: [users.id]
	}),
}));

export const activitiesRelations = relations(activities, ({many}) => ({
	activitiesBookings: many(activitiesBooking),
}));

export const paymentsRelations = relations(payments, ({one}) => ({
	cart: one(cart, {
		fields: [payments.cartId],
		references: [cart.id]
	}),
	user: one(users, {
		fields: [payments.userId],
		references: [users.id]
	}),
}));

export const cartRelations = relations(cart, ({one, many}) => ({
	payments: many(payments),
	user: one(users, {
		fields: [cart.userId],
		references: [users.id]
	}),
	cartItems: many(cartItems),
}));

export const servicesRelations = relations(services, ({one}) => ({
	accommodation: one(accommodation, {
		fields: [services.categoryId],
		references: [accommodation.id]
	}),
}));

export const accommodationRelations = relations(accommodation, ({many}) => ({
	services: many(services),
}));

export const trainingBookingRelations = relations(trainingBooking, ({one}) => ({
	user: one(users, {
		fields: [trainingBooking.userId],
		references: [users.id]
	}),
	training: one(training, {
		fields: [trainingBooking.trainingId],
		references: [training.id]
	}),
}));

export const trainingRelations = relations(training, ({many}) => ({
	trainingBookings: many(trainingBooking),
}));

export const cartItemsRelations = relations(cartItems, ({one}) => ({
	cart: one(cart, {
		fields: [cartItems.cartId],
		references: [cart.id]
	}),
}));

export const roomBookingRelations = relations(roomBooking, ({one}) => ({
	user: one(users, {
		fields: [roomBooking.userId],
		references: [users.id]
	}),
	room: one(rooms, {
		fields: [roomBooking.roomId],
		references: [rooms.id]
	}),
}));

export const roomsRelations = relations(rooms, ({many}) => ({
	roomBookings: many(roomBooking),
	roomsWithFeatures: many(roomsWithFeatures),
}));

export const roomsWithFeaturesRelations = relations(roomsWithFeatures, ({one}) => ({
	room: one(rooms, {
		fields: [roomsWithFeatures.roomId],
		references: [rooms.id]
	}),
	roomFeature: one(roomFeatures, {
		fields: [roomsWithFeatures.roomFeaturesId],
		references: [roomFeatures.id]
	}),
}));

export const roomFeaturesRelations = relations(roomFeatures, ({many}) => ({
	roomsWithFeatures: many(roomsWithFeatures),
}));