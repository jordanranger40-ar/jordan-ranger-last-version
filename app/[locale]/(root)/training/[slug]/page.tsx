import TrainingBookingPanel from "@/components/trainingBooking/TrainingBookingPanel";
import { getTrainingBySlug } from "@/app/models/db/lib/services/training";
import { getQuantityOfATraining } from "@/app/models/db/lib/services/training_booking";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}
export default async function Page({ params }: PageProps) {
  const par = await params;
  const slug = (await params).slug;
  const training = await getTrainingBySlug(slug);
  console.log("training ,, :",training);
  
  const numberOfBooked = (
    await getQuantityOfATraining(training.data[0].id ?? "")
  ).total_booked;
  console.log(" elrvbjgh numberOfBooked: ", numberOfBooked);

  return (
    <div>
      <div>{par.slug}</div>
      {
        <TrainingBookingPanel
          training={training.data[0]}
          numberOfBooked={Number(numberOfBooked)}
        />
      }
    </div>
  );
}
