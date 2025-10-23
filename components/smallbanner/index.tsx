// components/SmallBanner.tsx
import React from 'react'
import Image from 'next/image'
import test from '@/public/images/molto2.svg'


const SmallBanner: React.FC = () => {
  return (
    <div className="py-16 bg-[#125892] text-white">
      <div className="container mx-auto px-6">
        <div className="lg:flex  justify-between items-center">
          
          {/* Text Section */}
          <div className="lg:w-6/12 lg:p-0 p-7">
            <h1 className="text-4xl font-bold leading-tight mb-5 capitalize">
              Professional Tailwind theme designed for developers.
            </h1>
            <p className="text-xl">
              With Tailwind, you can optimize the customization process to save your team time when building websites.
            </p>

            <div className="py-5">
              <a
                href="#"
                className="text-white rounded-full py-2 px-5 text-lg font-semibold bg-purple-600 inline-block border border-purple-600 mr-3"
              >
                Try for free
              </a>
              <a
                href="#"
                className="text-black rounded-full py-2 px-5 text-lg font-semibold bg-gray-400 inline-block border hover:bg-white hover:text-black"
              >
                Request a demo
              </a>
            </div>
          </div>

          {/* Image Section */}
          <div className="lg:w-5/12 order-2">
            <Image
              src={test}
              alt="Team working"
              width={600}
              height={400}
              className="rounded"
              style={{
                transform: 'scale(1) perspective(1040px) rotateY(-11deg) rotateX(2deg) rotate(2deg)',
              }}
            />
          </div>

        </div>
      </div>
    </div>
  )
}

export default SmallBanner
