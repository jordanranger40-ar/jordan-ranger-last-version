import React from 'react'
import Paralexsection from '@/components/paralexsection/Paralexsection'

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
