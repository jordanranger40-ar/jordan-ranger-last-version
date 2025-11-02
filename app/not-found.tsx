import Link from "next/link"

import { Home, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-md p-8 text-center">

        <div className="from-primary to-primary/50 mb-4 bg-linear-to-r bg-clip-text text-9xl font-black text-transparent">
          404
        </div>
        <h1 className="mb-4 text-2xl font-bold text-gray-800">
          Page Not Found
        </h1>
        <p className="mb-8 text-gray-600">
          not found.
        </p>


        <div className="space-y-4">
          

          <Button asChild variant="outline" className="w-full">
            <Link href="/" className="flex items-center justify-center gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
