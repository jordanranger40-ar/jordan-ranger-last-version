export type newClient = {
  id?: string;
  name: string;
  logo: string;
};

export type newCategory = {
  id?: string;
  slug?: string;
  category_name_en: string;
  category_name_ar: string;
  description_en: string;
  description_ar: string;
  image: string | null;
};

export type newCourse = {
  id?: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  target_audience_en: string[];
  target_audience_ar: string[];
  delivery_method_en: string[];
  delivery_method_ar: string[];
  duration_en: string;
  duration_ar: string;
  training_id: string;
  image: string;
};

export type user = {
  id: string;
  first_name: string;
  last_name?: string | null;
  email: string;
  password: string;
  role: string;
};
export type newMember = {
  id?: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  position_en: string;
  position_ar: string;
  image: string;
  display_order?: number;
  main: boolean;
};

export type newMemberDragAndDrop = {
  id: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  position_en: string;
  position_ar: string;
  image: string;
  display_order?: number;
  main: boolean;
};

export type resetToken = {
  id?: string;
  user_id: string;
  token: string;
  expires_at: Date;
  created_at: Date;
};

export type users = {
  id?: string;
  first_name: string;
  last_name?: string;
  email: string;
  password: string;
};
export type newService = {
  id?: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  category_id: string;
  image: string;
};
export type newTraining = {
  id?: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  category_en: string;
  category_ar: string;
  start_date: Date;
  end_date: Date;
  price: number;
  capacity: number;
  image: string;
  is_deleted: boolean;
  slug: string;
};
export type newUser = {
  id?: string;
  first_name: string;
  last_name?: string;
  email: string;
  password: string;
};

export type modifiedUser = {
  id?: string;
  first_name: string;
  last_name?: string;
  email: string;
  password: string;
  role: string;
};

export type DBUser = {
  id: string;
  first_name: string;
  last_name?: string | null;
  email: string;
  password: string;
  role: string;
};

export type userInfo = {
  email: string;
  password: string;
};

export type BannerData = {
  id: string;
  alt: string;
  image: string;
  description_en: string;
  description_ar: string;
};

export type newBanner = {
  id?: string;
  alt: string;
  description_en: string;
  description_ar: string;
  image: string | null;
  created_at?: Date;
};

export type getService = {
  id: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  category_id: string;
  category_name_en: string;
  category_name_ar: string;
  image: string;
  slug: string;
};

export interface editService {
  id?: string;
  name_en: string;
  name_ar: string;
  category_name_en: string;
  category_id: string;
  description_en: string;
  description_ar: string;
  image: string;
}

export interface editCourse {
  id?: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  target_audience_en: string[];
  target_audience_ar: string[];
  delivery_method_en: string[];
  delivery_method_ar: string[];
  duration_en: string;
  duration_ar: string;
  training_id: string;
  training_name_en: string;
  image: string;
}

export interface getCourses {
  id?: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  target_audience_en: string[];
  target_audience_ar: string[];
  delivery_method_en: string[];
  delivery_method_ar: string[];
  duration_en: string;
  duration_ar: string;
  training_id: string;
  training_name_en: string;
  training_name_ar: string;
  training_description_en: string;
  training_description_ar: string;
  image: string;
}

export type getClients = {
  id?: string;
  name: string;
  logo: string;
  created_at: Date;
};

export type memeberOrder = {
  id: string;
  display_order: number;
};

export type newSetting = {
  id?: string;
  key_name_en?: string;
  key_name_ar?: string;
  value_en?: string;
  value_ar?: string;
  created_at?: Date;
};
export type newCareer = {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  city: string;
  phone_number: string | null;
  cv: string;
  created_at?: Date;
};

export type RoomBookingWithDetails = {
  id?: string;
  start_time: Date;
  end_time: Date;
  created_at: Date;
  is_confirmed: boolean;
  is_deleted: boolean;
  user_id: string;
  first_name: string;
  last_name?: string;
  email: string;
  room_id: string;
  name_en: string;
  description_en: string;
  name_ar: string;
  description_ar: string;
  cover_image: string;
  price: number;
  room_images: string[];
  room_type_en: string;
  room_type_ar: string;
  booking_price:number;
  slug: string;
};

export type ActivityBookingWithDetails= {

  id: string; // training_booking id
  is_confirmed: boolean;
  is_deleted: boolean;
  created_at: Date;
  quantity: number;
  
  start_time: Date;
  end_time: Date;
booking_price:Number;
  activity_id?: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  location_type_en: string;
  location_type_ar: string;
  card_image: string;
  poster_image: string;
  header_image: string;
  capacity: number;
  activity_price: number;
  slug: string;

  //user Deatils
  
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;


}

export type TrainingBookingWithDetails = {
  id: string; // training_booking id
  training_id: string;
  is_confirmed: boolean;
  is_deleted: boolean;
  created_at: Date;
  quantity: number;
  price: number;

  user_id: string;
  first_name: string;
  last_name: string;
  email: string;

  // Training details
  name_en: string;
  description_en: string;
  name_ar: string;
  description_ar: string;
  image: string;
  category_en: string;
  category_ar: string;
  capacity: number;
  training_price: number;
  start_date: Date;
  end_date: Date;
  slug: string;
};

export type roomFeatures = {
  id?: string;
  feature_title_en: string;
  feature_description_en: string;
  feature_title_ar: string;
  feature_description_ar: string;
  room_id?: string;
};

export type newRoom = {
  id?: string;
  name_en: string;
  description_en: string;
  name_ar: string;
  description_ar: string;
  cover_image: string;
  price: number;
  room_images: string[];
  is_deleted?: boolean;
  roomFeatures: roomFeatures[];
  room_type_en: string;
  room_type_ar: string;
  slug: string;
};

export type modifiedRoom = {
  id?: string;
  name_en: string;
  description_en: string;
  name_ar: string;
  description_ar: string;
  cover_image: string;
  price: number;
  room_images: string[];
  is_deleted?: boolean;
  roomFeatures: roomFeatures[];
  room_type_en: string;
  room_type_ar: string;
  slug: string;
};

export type tokenPayload = {
  user_id: string;
  role: string;
  name: string;
};

export type newBooking = {
  id?: string;
  start_time: Date;
  end_time: Date;
  created_at: Date;
  is_confirmed: boolean;
  user_id: string;
  room_id: string;
  price: number;
};

export type userDetails = {
  id?: string;
  email: string;
  role: string;
  first_name: string;
};

export type newActivity = {
  id?: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  location_type_en: string;
  location_type_ar: string;
  card_image: string;
  poster_image: string;
  header_image: string;
  capacity: number;
  price: number;
  slug: string;
};

export type newActivityBooking = {
  id?: string;
  start_time: Date;
  end_time: Date;
  created_at: Date;
  is_confirmed: boolean;
  user_id: string;
  activity_id: string;
  quantity: number;
  price: number;
};

export type updateActivityBooking = {
  id?: string;
  start_time: Date;
  end_time: Date;
  created_at: Date;
  is_confirmed: boolean;
  activity_id: string;
  quantity: number;
};

export type newTrainingBooking = {
  id?: string;
  user_id: string;
  training_id: string;
  quantity: number;
  is_confirmed?: boolean;
  is_deleted?: boolean;
  created_at?: Date;
  price: number;
};

export type newCart = {
  id?: string;
  user_id?: string;
  total_amount: number;
  created_at?: Date;
  checked_out_at?: Date;
  is_paid?: boolean;
};

export type cartWithItems = {
  id?: string;
  user_id: string;
  total_amount: number;
  created_at: Date;
  checked_out_at: Date;
  booking_type: string;
  booking_id: string;
};

export type newCartItem = {
  id?: string;
  cart_id: string;
  created_at?: Date;
  booking_type: string;
  booking_id: string;
  price: number;
};
