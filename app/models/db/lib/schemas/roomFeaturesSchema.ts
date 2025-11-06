import {z} from "zod"

export const getRoomFeaturesSchema= ()=>{
    return z.object({
        feature_title_en: z.string().min(1,"English Title Is Required"),
        feature_title_ar: z.string().min(1,"Arabic Title Is Required"),
        feature_description_en:z.string().min(1,"English Description Is Required"),
        feature_description_ar:z.string().min(1,"Arabic Description Is Required")

    })
}


export type roomFeaturesType= z.infer<ReturnType<typeof getRoomFeaturesSchema>>;