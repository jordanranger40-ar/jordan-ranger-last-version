import pool from "../index";
import { roomFeatures, newRoom, modifiedRoom } from "@/types/index";

export const addNewRoom = async (newRoom: newRoom) => {
  const {
    name_en,
    description_en,
    name_ar,
    description_ar,
    cover_image,
    price,
    room_features,
    room_images,
    slug,
    room_type_en,
    room_type_ar,
  } = newRoom;

  const result1 = await pool.query<newRoom>(
    "INSERT INTO rooms (name_en, description_en, name_ar, description_ar, cover_image, price, room_images,slug, room_type_en,room_type_ar) VALUES ($1,$2,$3,$4,$5,$6, $7::text[],$8,$9,$10) RETURNING *",
    [
      name_en,
      description_en,
      name_ar,
      description_ar,
      cover_image,
      price,
      room_images,
      slug,
      room_type_en,
      room_type_ar,
    ]
  );

  const checkFeature = await Promise.all(
    room_features.map(async (feature) => {
      const existing = await pool.query<roomFeatures>(
        `SELECT id FROM room_features 
         WHERE feature_title_en = $1 AND feature_description_en = $2`,
        [feature.feature_title_en, feature.feature_description_en]
      );

      let featureId: string = "";

      if (existing.rows.length > 0) {
        if (existing.rows[0].id) {
          featureId = existing.rows[0].id;
        }
      } else {
        const insertfeature = await pool.query(
          "insert into room_features ( feature_title_en,feature_title_ar,feature_description_en,feature_description_ar) values ($1,$2,$3,$4) returning *",
          [
            feature.feature_title_en,
            feature.feature_title_ar,
            feature.feature_description_en,
            feature.feature_description_ar,
          ]
        );

        featureId = insertfeature.rows[0].id;
      }
      await pool.query(
        "insert into rooms_with_features (room_id,room_features_id) values ($1,$2)",
        [result1.rows[0].id, featureId]
      );

      return { ...feature, id: featureId };
    })
  );
  return { room: result1.rows[0], features: checkFeature };
};

export const getAllRooms = async () => {
  const result = await pool.query(
    "SELECT r.id, r.name_en, r.description_en, r.name_ar,  r.room_type_en, r.room_type_ar, r.description_ar, r.cover_image, r.price, r.room_images, json_agg(json_build_object('id', f.id,'feature_title_en', f.feature_title_en,'feature_description_en', f.feature_description_en,'feature_title_ar', f.feature_title_ar,'feature_description_ar', f.feature_description_ar) ) AS features FROM rooms r LEFT JOIN rooms_with_features rwf ON r.id = rwf.room_id LEFT JOIN room_features f ON f.id = rwf.room_features_id GROUP BY r.id;"
  );

  return result.rows;
};

export const editRoom = async (id: string, modifiedRoom: modifiedRoom) => {
  const result = await pool.query<modifiedRoom>(
    `UPDATE rooms 
     SET name_en = COALESCE($1, name_en),
         description_en = COALESCE($2, description_en),
         name_ar = COALESCE($3, name_ar),
         description_ar = COALESCE($4, description_ar),
         cover_image = COALESCE($5, cover_image),
         price = COALESCE($6, price),
         room_images = COALESCE($7, room_images),
         slug = COALESCE($8, slug),
         room_type_en = COALESCE($9, room_type_en),
         room_type_ar = COALESCE($10, room_type_ar)
     WHERE id = $11
     RETURNING *`,
    [
      modifiedRoom.name_en,
      modifiedRoom.description_en,
      modifiedRoom.name_ar,
      modifiedRoom.description_ar,
      modifiedRoom.cover_image,
      modifiedRoom.price,
      modifiedRoom.room_images,
      modifiedRoom.slug,
      modifiedRoom.room_type_en,
      modifiedRoom.room_type_ar,
      id,
    ]
  );

  // ✅ Remove all old links for this room
  await pool.query("DELETE FROM rooms_with_features WHERE room_id = $1", [id]);

  // ✅ Re-insert new links
  if (modifiedRoom.room_features && modifiedRoom.room_features.length > 0) {
    for (const feature of modifiedRoom.room_features) {
      // Ensure the feature exists (if new)
      let featureId = feature.id;

      if (!featureId) {
        const existing = await pool.query<roomFeatures>(
          `SELECT id FROM room_features 
           WHERE feature_title_en = $1 AND feature_description_en = $2`,
          [feature.feature_title_en, feature.feature_description_en]
        );

        if (existing.rows.length > 0) {
          featureId = existing.rows[0].id;
        } else {
          const insertFeature = await pool.query(
            `INSERT INTO room_features 
             (feature_title_en, feature_title_ar, feature_description_en, feature_description_ar)
             VALUES ($1, $2, $3, $4)
             RETURNING id`,
            [
              feature.feature_title_en,
              feature.feature_title_ar,
              feature.feature_description_en,
              feature.feature_description_ar,
            ]
          );
          featureId = insertFeature.rows[0].id;
        }
      }

      // ✅ Insert into linker table
      await pool.query(
        `INSERT INTO rooms_with_features (room_id, room_features_id) VALUES ($1, $2)`,
        [id, featureId]
      );
    }
  }

  return { room: result.rows[0] };
};

export const deleteRoomById = async (id: string) => {
  await pool.query("delete from rooms_with_features where room_id= $1", [id]);

  const result = await pool.query(
    " delete from rooms where id=$1 returning *",
    [id]
  );

  return result.rows;
};

export const getRoomById = async (id: string) => {
  console.log("idmnbtrftyuiopoiugf id: ", id);

  const result = await pool.query(
    "SELECT r.id, r.name_en, r.description_en, r.name_ar, r.description_ar, r.cover_image, r.price, r.room_images,r.slug, r.room_type_en,r.room_type_ar, json_agg(json_build_object('id', f.id,'feature_title_en', f.feature_title_en,'feature_description_en', f.feature_description_en,'feature_title_ar', f.feature_title_ar,'feature_description_ar', f.feature_description_ar) ) AS room_features FROM rooms r LEFT JOIN rooms_with_features rwf ON r.id = rwf.room_id LEFT JOIN room_features f ON f.id = rwf.room_features_id where r.id=$1 GROUP BY r.id; ",
    [id]
  );

  console.log("result: ", result);

  return result.rows[0];
};

export const getRoomBySlug = async (slug: string) => {
  const result = await pool.query<newRoom>(
    "SELECT r.id, r.name_en, r.description_en, r.name_ar, r.description_ar, r.cover_image, r.price, r.room_images, json_agg(json_build_object('id', f.id,'feature_title_en', f.feature_title_en,'feature_description_en', f.feature_description_en,'feature_title_ar', f.feature_title_ar,'feature_description_ar', f.feature_description_ar) ) AS features FROM rooms r LEFT JOIN rooms_with_features rwf ON r.id = rwf.room_id LEFT JOIN room_features f ON f.id = rwf.room_features_id where r.slug=$1 GROUP BY r.id; ",
    [slug]
  );

  return result.rows[0];
};

export const getRoomsByRoomType = async (roomType: string) => {
  const result = await pool.query<newRoom>(
    "SELECT r.id, r.name_en, r.description_en, r.slug , r.name_ar, r.description_ar, r.cover_image, r.price, r.room_images, json_agg(json_build_object('id', f.id,'feature_title_en', f.feature_title_en,'feature_description_en', f.feature_description_en,'feature_title_ar', f.feature_title_ar,'feature_description_ar', f.feature_description_ar) ) AS features FROM rooms r LEFT JOIN rooms_with_features rwf ON r.id = rwf.room_id LEFT JOIN room_features f ON f.id = rwf.room_features_id where r.room_type_en=$1  GROUP BY r.id ",
    [roomType]
  );

  return result.rows;
};


export const getRoomsNameAndId= async ()=>{

  try {
    const result= await pool.query<{ id: string; name_en: string }>("select id,name_en from rooms")
    return result.rows
  } catch (error) {
    console.log(error);
    return "Error In Getting The Rooms Names And ID"
    
  }
}