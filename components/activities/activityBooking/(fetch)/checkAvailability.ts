"use server";
import { checkAvailableActivities } from "@/app/models/db/lib/services/activity_booking";

export async function checkActivityAvailabilityAction(
  activityId: string,
  start: string
) {
  // 1️⃣ Validate input
  if (!activityId || !start) {
    return { success: false, message: "Please provide activity ID and start time",status:400,data:null };
  }

  try {

    // 3️⃣ Call DB service to check availability directly
    const available = await checkAvailableActivities(activityId, {start_time:new Date(start)});

    if (available.status===409) {
      return { success: true, status:409, message:"Activity Not available for the selected time.",data:null};
    } else if(available.status===200) {
      return { success: false, message: "Activity is available for the selected time.",status:200, data:available.data };
    }
  } catch (error) {
    console.error("Error checking activity availability:", error);
    return { success: false, message: "Error checking availability",status:500, data:null  };
  }
}
