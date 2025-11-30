import RoomBookingWizard from "@/components/roomBooking/RoomBookingWizard";
import { getAllbookingsByRoomId } from "@/app/models/db/lib/services/room_booking";
import { getRoomById } from "@/app/models/db/lib/services/rooms";
import { getDisabledDatesByRoomId } from "@/app/models/db/lib/services/booking_disabled_dates";
import { authOptions } from "@/app/models/db/authOptions";
import {  getCartItemsByUserId } from "@/app/models/db/lib/services/cart";
import { getServerSession } from "next-auth";

export default async function RoomBookingPage({
  params,
}: {
  params:Promise < { id: string,locale:string }>;
}) {
  const par= await params
  const room = await getRoomById(par.id);
  const bookingData = await getAllbookingsByRoomId(par.id);
  const disabledData = await getDisabledDatesByRoomId(par.id);
 const uniqueTypes:string[]= []
  const userInfo= await getServerSession(authOptions)
   const userId= userInfo?.user.id
  if (userId) {
    const cartItems = await getCartItemsByUserId(userId ?? "");
    if (cartItems.data !== null) {
      const bookingsTypes = cartItems.data.map((ele, i) => {
        if (!uniqueTypes.includes(ele.booking_type)) {
          uniqueTypes.push(ele.booking_type);
        }
        return uniqueTypes;
      });
    } else {
      console.log("User has no cart");
    }
  }


  const bookedDates = bookingData.data.map((ele) => {
    return {
      start: ele.start_time.toISOString(),
      end: ele.end_time.toISOString(),
    };
  });

  const disabledDates = disabledData.map((ele) => {
    return {
      start: ele.start_date?.toString() ?? "",
      end: ele.end_date?.toString() ?? "",
    };
  });

  const combinedDates = [...disabledDates, ...bookedDates];

  return (
    <div className=" flex flex-col items-center justify-center text-[#676e32]  py-10 mt-14">
      <h1 className="text-2xl font-semibold mb-6">Book {room.name_en}</h1>
      <RoomBookingWizard room={room} bookedDates={combinedDates} locale={par.locale} uniqueTypes={uniqueTypes} />
    </div>
  );
}
