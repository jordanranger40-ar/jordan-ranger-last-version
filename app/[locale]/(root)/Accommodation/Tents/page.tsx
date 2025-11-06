import React from 'react'
import {getRoomsByRoomType} from "@/app/models/db/lib/services/rooms"
import FlippingCard from '@/components/flippingcard/flippingcard'


export default async function page() {
  const data=await getRoomsByRoomType("tents")
 
  return (
    <div className='mt-14'>
      <div>dfdfdfd</div>
      
      <FlippingCard data={data}/>


      
      
    </div>
  )
}
