import React from "react";
import { getCaregoryById } from "@/app/models/db/lib/services/Accommodation";
import { editCategory } from "../(fetch)/editCategory";
import EditCategoryForm from "@/components/consulting/editCategoryForm";
async function page(prop: { params: Promise<{ id: string }> }) {
  const params = await prop.params;
  const category = await getCaregoryById(params.id);
  console.log("category: ", category);

  return (
    <div>
      <EditCategoryForm category={category[0]} action={editCategory} />
    </div>
  );
}

export default page;

/* 


import React from "react";
import { getBannerbyId } from "@/app/models/db/lib/services/banners";
import EditBannerForm from "@/components/banner/editBannerForm"
import { editBanner } from "../(actions)/editBannerAction";
async function page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const banner = await getBannerbyId(params.id);
  console.log(banner);

  return (
   <>
   <EditBannerForm banner={banner[0]}  action={editBanner}/>
   </>
  );
}

export default page;


*/
