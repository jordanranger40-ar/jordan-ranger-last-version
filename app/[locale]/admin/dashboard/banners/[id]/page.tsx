import { getBannerbyId } from "@/app/models/db/lib/services/banners";
import EditBannerForm from "@/components/banner/editBannerForm"
import { editBannerAction } from "../(actions)/editBannerAction";
async function page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const banner = await getBannerbyId(params.id);

  return (
   <>
   <EditBannerForm banner={banner[0]}  action={editBannerAction}/>
   </>
  );
}

export default page;
