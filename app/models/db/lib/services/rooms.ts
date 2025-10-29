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
    roomFeatures,
    room_images,
  } = newRoom;

  const result1 = await pool.query<newRoom>(
    "INSERT INTO rooms (name_en, description_en, name_ar, description_ar, cover_image, price, room_images) VALUES ($1,$2,$3,$4,$5,$6, $7::text[]) RETURNING *",
    [
      name_en,
      description_en,
      name_ar,
      description_ar,
      cover_image,
      price,
      room_images,
    ]
  );

  const checkFeature = await Promise.all(
    roomFeatures.map(async (feature) => {
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
    "SELECT r.id, r.name_en, r.description_en, r.name_ar, r.description_ar, r.cover_image, r.price, r.room_images, json_agg(json_build_object('id', f.id,'feature_title_en', f.feature_title_en,'feature_description_en', f.feature_description_en,'feature_title_ar', f.feature_title_ar,'feature_description_ar', f.feature_description_ar) ) AS features FROM rooms r LEFT JOIN rooms_with_features rwf ON r.id = rwf.room_id LEFT JOIN room_features f ON f.id = rwf.room_features_id GROUP BY r.id;"
  );

  return result.rows;
};

export const editRoom = async (id: string, modifiedRoom: modifiedRoom) => {
  const result = await pool.query<modifiedRoom>(
    "update rooms set name_en= coalesce($1,name_en), description_en= coalesce($2,description_en), name_ar= coalesce($3,name_ar), description_ar= coalesce ($4, description_ar), cover_image= coalesce ($5,cover_image), price= coalesce ($6,price), room_images= coalesce ($7,room_images) where rooms.id=$8  returning * ",
    [
      modifiedRoom.name_en,
      modifiedRoom.description_en,
      modifiedRoom.name_ar,
      modifiedRoom.description_ar,
      modifiedRoom.cover_image,
      modifiedRoom.price,
      modifiedRoom.room_images,
      id,
    ]
  );

  //  console.log("modifiedRoom.roomFeatures: ", modifiedRoom.roomFeatures);

  if (modifiedRoom.roomFeatures && modifiedRoom.roomFeatures.length > 0) {
    await pool.query(
      "UPDATE room_features SET is_deleted = true WHERE id IN (SELECT f.id FROM room_features f JOIN rooms_with_features rwf ON f.id = rwf.room_features_id WHERE rwf.room_id = $1)",
      [id]
    ); // update is_deleted from room features based on room.id to delete then after deleting the links from room_with_features

    await pool.query("delete from rooms_with_features where room_id= $1", [id]); // delete feature link from room_with_features

    await pool.query("delete from room_features where is_deleted=true"); // delete feature  from room_features based on is_deleted

    const checkFeature = await Promise.all(
      modifiedRoom.roomFeatures.map(async (feature) => {
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
          [result.rows[0].id, featureId]
        );

        return { ...feature, id: featureId };
      })
    );
  } else {
    return { room: result.rows[0] };
  }
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
  const result = await pool.query(
    "SELECT r.id, r.name_en, r.description_en, r.name_ar, r.description_ar, r.cover_image, r.price, r.room_images, json_agg(json_build_object('id', f.id,'feature_title_en', f.feature_title_en,'feature_description_en', f.feature_description_en,'feature_title_ar', f.feature_title_ar,'feature_description_ar', f.feature_description_ar) ) AS features FROM rooms r LEFT JOIN rooms_with_features rwf ON r.id = rwf.room_id LEFT JOIN room_features f ON f.id = rwf.room_features_id where r.id=$1 GROUP BY r.id; ",
    [id]
  );

  return result.rows;
};
