import RoomBookingWizard from "@/components/roomBooking/RoomBookingWizard";
import {  getAllbookingsByRoomId } from "@/app/models/db/lib/services/room_booking"; // adjust paths
import {getRoomById} from "@/app/models/db/lib/services/rooms"
export default async function RoomBookingPage({ params }: { params: { id: string } }) {
  const room = await getRoomById(params.id);
  const bookingData = await getAllbookingsByRoomId(params.id); 

  const bookedDates= bookingData.data.map((ele)=>{
    return {
        start: ele.start_time.toISOString(),
        end:ele.end_time.toISOString()
    }
  })

  return (
    <div className=" flex flex-col items-center justify-center text-[#676e32]  py-10 mt-14">
      <h1 className="text-2xl font-semibold mb-6">Book {room.name_en}</h1>
      <RoomBookingWizard room={room} bookedDates={bookedDates} />
    </div>
  );
}
