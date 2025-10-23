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
