import Image from "next/image";


interface PageProps {
    params: Promise<{ locale: string; slug: string | string[] }>;
  }
export default async function Page({ params }: PageProps) {
    const par=await params

return (

    <div className="bg-red-600 h-screen w-screen mt-14">{par.slug}</div>
)
}
