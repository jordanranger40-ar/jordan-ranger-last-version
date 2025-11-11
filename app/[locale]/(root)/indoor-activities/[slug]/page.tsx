import { getActivityBySlug } from "@/app/models/db/lib/services/activities";
import ActivityBookingPanel from "@/components/activities/activityBooking/ActivityBookingPanel";

interface PageProps {
    params: Promise<{ locale: string; slug: string  }>;
  }
export default async function ProductPage({ params }: PageProps) {
    const par=await params
    const activity= await getActivityBySlug(par.slug)

    console.log("activity: ",activity);
    
return (

    <div className="mt-20">{par.slug}
     <ActivityBookingPanel
        activity={{
          id: activity[0].id,
          name: activity[0].name_en,
          capacity: activity[0].capacity,
          price: activity[0].price,
        }}
      />
    </div>
)
}