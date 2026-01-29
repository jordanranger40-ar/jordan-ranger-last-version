import React from 'react'
import Paralexsection from '@/components/paralexsection/Paralexsection'

import {PAGE_METADATA} from "@/lib/constants/metadata"

export const metadata= PAGE_METADATA.resturent

interface Props {
  params:Promise<{locale:"en"|"ar"}>
}
export default async function page({params}:Props) {
  const locale= (await params).locale
  return (
    <div>
      <Paralexsection locale={locale} />
    </div>
  )
}
