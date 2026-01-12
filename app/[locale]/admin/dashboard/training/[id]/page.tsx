import { editTrainingAction } from "../(fetch)/editTraining";
import EditTrainingForm from "@/components/training/editTrainingForm";
import { getTrainingById } from "@/app/models/db/lib/services/training";
async function page(prop: { params: Promise<{ id: string }> }) {
  const params = await prop.params;
  const training = (await getTrainingById(params.id)).data;
  

  return (
    <div>
      <EditTrainingForm training={training[0]} action={editTrainingAction} />
    </div>
  );
}

export default page;


