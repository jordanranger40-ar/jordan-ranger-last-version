export async function checkActivityAvailability(
  activityId: string,
  start: string,
 
): Promise<{ success: boolean; available?: number; message?: string }> {
  if (!start ) {
    return { success: false, message: "Please choose start and end time" };
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/activityBooking/checkAvailbility/${activityId}`,
      {
        method: "POST",
        body: JSON.stringify({
          start_time: new Date(start).toISOString(),
       
        }),
      }
    );

    const data = await res.json();

    if (res.ok && data.data !== null) {
      if (data.data > 0) {
        return { success: true, available: data.data };
      } else {
        console.log(" data:v : ",data);
        
        return { success: false, message: "Not available for selected time." };
      }
    } else {
      return {
        success: false,
        message: data?.message || "Error checking availability",
      };
    }
  } catch (error) {
    console.error("Error checking activity availability:", error);
    return { success: false, message: "Network error" };
  }
}
