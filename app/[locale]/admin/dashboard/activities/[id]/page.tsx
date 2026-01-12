import { editActivityAction } from "../(fetch)/editActivity";
import EditActivityForm from "@/components/activities/dashboardComponents/editActivityForm";
import { getActivityById } from "@/app/models/db/lib/services/activities";
async function page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const activity = await getActivityById(params.id);

  return (
   <>
   <EditActivityForm activity={activity[0]}  action={editActivityAction}/>
   </>
  );
}

export default page;
