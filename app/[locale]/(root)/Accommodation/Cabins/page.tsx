import React from 'react'
import {getRoomsByRoomType} from "@/app/models/db/lib/services/rooms"
import FlippingCard from '@/components/flippingcard/flippingcard'
import Link from 'next/link'

export default async function page() {
  const data=await getRoomsByRoomType("cabins")
 
  return (
    <div className='my-14'>
      <div>dfdfdfd</div>


   
      <Link   key={data.id}  href={`/Accommodation/Cabins/${data.slug ?? ""}`}>
      <FlippingCard data={data}/>
      </Link>
      
    </div>
  )
}
