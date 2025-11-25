import React from 'react'
import { TrainingBookingWithDetails} from "@/types/index"
interface Props {
    data:TrainingBookingWithDetails
}

 function UserDetailsCard(data:Props) {
const booking = data.data ;
  return (
   <div className="border rounded-2xl shadow-sm p-5 bg-white">
          <h2 className="text-lg font-semibold mb-4 text-[#676e32]">
            User Information
          </h2>
          <dl className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-gray-600">Name:</dt>
              <dd className="ml-2">
                {booking.first_name ?? "—"} {booking.last_name ?? ""}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-gray-600">Email:</dt>
              <dd className="ml-2">
                {booking.email ? (
                  <a
                    href={`mailto:${booking.email}`}
                    className="underline text-[#676e32] hover:text-[#7d8d07]"
                  >
                    {booking.email}
                  </a>
                ) : (
                  "—"
                )}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-gray-600">User ID:</dt>
              <dd className="ml-2">{booking.user_id ?? "—"}</dd>
            </div>
          </dl>
        </div>
)
}

export default UserDetailsCard