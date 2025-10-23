export type newClient = {
  id?: string;
  name: string;
  logo: string ;
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
  image:string
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
  display_order?:number;
  main:boolean
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
  display_order?:number,
  main:boolean

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
  image:string
};
export type newTraining = {
  id?: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
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
  image:string
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
  training_name_en:string,
  image:string
}


export interface getCourses{
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
  image:string
}


export type getClients={
 id?: string;
  name: string;
  logo: string;
  created_at:Date
}


export type memeberOrder = {
  id: string;
  display_order: number;
};

export type newSetting={
  id?:string,
  key_name_en?:string,
  key_name_ar?:string,
  value_en?:string,
  value_ar?:string,
  created_at?:Date
}
export type newCareer= {
  id?:string,
  first_name:string,
  last_name:string,
  email:string,
  city:string,
  phone_number:string | null,
  cv:string,
  created_at?:Date
}