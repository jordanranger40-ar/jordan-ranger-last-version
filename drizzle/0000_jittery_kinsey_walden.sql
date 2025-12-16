-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."booking_type" AS ENUM('activity', 'training', 'room');--> statement-breakpoint
CREATE TYPE "public"."booking_type_enum" AS ENUM('activity', 'training', 'room');--> statement-breakpoint
CREATE TYPE "public"."category_ar_enum" AS ENUM('تدريب المدارس', 'بناء فرق الشركات');--> statement-breakpoint
CREATE TYPE "public"."category_en_enum" AS ENUM('Schools Training', 'Corporate Team Building');--> statement-breakpoint
CREATE TYPE "public"."location_ar" AS ENUM('داخلي', 'خارجي');--> statement-breakpoint
CREATE TYPE "public"."location_en" AS ENUM('indoor', 'outdoor');--> statement-breakpoint
CREATE TYPE "public"."room_type_ar" AS ENUM('الغرف', 'الخيام');--> statement-breakpoint
CREATE TYPE "public"."room_type_en" AS ENUM('cabins', 'tents');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "banners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"alt" varchar(255),
	"image" text,
	"description_en" text,
	"description_ar" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "booking_disabled_dates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" varchar(255) NOT NULL,
	"ref_id" uuid NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reset_password_token" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "reset_password_token_token_key" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "activities_booking" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"activity_id" uuid,
	"user_id" uuid,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"is_confirmed" boolean DEFAULT false,
	"is_deleted" boolean DEFAULT false,
	"price" numeric DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name_en" varchar(255) NOT NULL,
	"description_en" text NOT NULL,
	"name_ar" varchar(255) NOT NULL,
	"description_ar" text NOT NULL,
	"card_image" varchar(255),
	"location_type_en" "location_en" NOT NULL,
	"location_type_ar" "location_ar" NOT NULL,
	"is_deleted" boolean DEFAULT false,
	"capacity" integer,
	"price" numeric DEFAULT '1' NOT NULL,
	"slug" varchar(255) NOT NULL,
	"header_image" varchar(255),
	"poster_image" varchar(255),
	"minimum_quantity" integer DEFAULT 0,
	"coming_soon" boolean DEFAULT false,
	CONSTRAINT "activities_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "training" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name_en" varchar(225) NOT NULL,
	"description_en" text,
	"name_ar" varchar(255) NOT NULL,
	"description_ar" text,
	"card_image" varchar(255),
	"category_en" "category_en_enum",
	"category_ar" "category_ar_enum",
	"capacity" integer,
	"price" integer,
	"start_date" timestamp,
	"end_date" timestamp,
	"is_deleted" boolean DEFAULT false,
	"slug" varchar(255) NOT NULL,
	"header_image" varchar(255),
	"post_image" varchar(255),
	CONSTRAINT "training_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "careers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(255),
	"last_name" varchar(255),
	"email" varchar(255),
	"phone_number" varchar(255),
	"city" varchar(255),
	"cv" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"logo" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "accommodation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_name_en" varchar(255) NOT NULL,
	"category_name_ar" varchar(255) NOT NULL,
	"description_en" text,
	"description_ar" text,
	"image" varchar(255),
	"slug" varchar(255),
	CONSTRAINT "accommodation_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title_en" varchar(255) NOT NULL,
	"title_ar" varchar(255) NOT NULL,
	"description_en" text,
	"description_ar" text,
	"target_audience_en" text[],
	"target_audience_ar" text[],
	"delivery_method_en" text[],
	"delivery_method_ar" text[],
	"duration_en" varchar(255),
	"duration_ar" varchar(255),
	"image" text,
	"training_id" uuid
);
--> statement-breakpoint
CREATE TABLE "our_team" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name_en" varchar(255),
	"name_ar" varchar(255),
	"description_en" text,
	"description_ar" text,
	"position_en" varchar(255),
	"position_ar" varchar(255),
	"image" varchar(255),
	"display_order" integer DEFAULT 0,
	"main" boolean DEFAULT false,
	CONSTRAINT "our_team_display_order_key" UNIQUE("display_order")
);
--> statement-breakpoint
CREATE TABLE "role" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name_en" varchar(255) NOT NULL,
	"name_ar" varchar(255) NOT NULL,
	"description_en" varchar(255),
	"description_ar" varchar(255),
	"category_id" uuid,
	"image" text
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key_name_en" varchar(255),
	"key_name_ar" varchar(255),
	"value_en" text,
	"value_ar" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cart" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"total_amount" numeric DEFAULT '0',
	"is_paid" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"checked_out_at" timestamp,
	"expires_at" timestamp DEFAULT (now() + '24:00:00'::interval) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "training_booking" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"training_id" uuid,
	"is_deleted" boolean DEFAULT false,
	"is_confirmed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"quantity" integer DEFAULT 1,
	"price" numeric DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(225) NOT NULL,
	"last_name" varchar(225),
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	CONSTRAINT "users_email_key" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "cart_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cart_id" uuid,
	"booking_type" "booking_type_enum" NOT NULL,
	"booking_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"price" numeric DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "room_booking" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"room_id" uuid,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"is_confirmed" boolean DEFAULT false,
	"is_deleted" boolean DEFAULT false,
	"price" numeric DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rooms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name_en" varchar(255) NOT NULL,
	"description_en" varchar(255),
	"name_ar" varchar(255) NOT NULL,
	"description_ar" varchar(255),
	"cover_image" varchar(255),
	"price" integer,
	"room_images" text[],
	"is_deleted" boolean DEFAULT false,
	"room_type_en" "room_type_en" DEFAULT 'cabins' NOT NULL,
	"room_type_ar" "room_type_ar" DEFAULT 'الغرف' NOT NULL,
	"slug" varchar(255) NOT NULL,
	CONSTRAINT "rooms_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "rooms_with_features" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"room_id" uuid,
	"room_features_id" uuid
);
--> statement-breakpoint
CREATE TABLE "room_features" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"feature_title_en" varchar(255),
	"feature_title_ar" varchar(255),
	"feature_description_en" varchar(255),
	"feature_description_ar" varchar(255),
	"is_deleted" boolean DEFAULT false
);
--> statement-breakpoint
ALTER TABLE "reset_password_token" ADD CONSTRAINT "reset_password_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activities_booking" ADD CONSTRAINT "activities_booking_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activities_booking" ADD CONSTRAINT "activities_booking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."accommodation"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_booking" ADD CONSTRAINT "training_booking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_booking" ADD CONSTRAINT "training_booking_training_id_fkey" FOREIGN KEY ("training_id") REFERENCES "public"."training"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "public"."cart"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_booking" ADD CONSTRAINT "room_booking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_booking" ADD CONSTRAINT "room_booking_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rooms_with_features" ADD CONSTRAINT "rooms_with_features_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rooms_with_features" ADD CONSTRAINT "rooms_with_features_room_features_id_fkey" FOREIGN KEY ("room_features_id") REFERENCES "public"."room_features"("id") ON DELETE no action ON UPDATE no action;
*/