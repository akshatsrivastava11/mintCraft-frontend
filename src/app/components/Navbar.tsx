"use client"

import * as React from "react"
import { X, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Accordion } from "@/components/ui/accordion"

const navigationItems = [
  { title: "Home", href: "#" },
  { title: "About", href: "#" },
  { title: "FAQ", href: "#" },
  { title: "Contact", href: "#" },
]

export function Sidebar() {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="fixed top-25 right-4 z-50 bg-white border-2 border-black">
          <Menu className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full bg-[#e5d5d0] p-6 border-r-2 border-black">
        <SheetHeader className="flex flex-row items-center justify-between mb-8">
          <SheetTitle className="text-xl font-semibold text-black">Menu</SheetTitle>
          <Button
            size="icon"
            onClick={() => setOpen(false)}
            className="h-6 w-6 p-0 hover:bg-transparent"
          >
            <X className="h-5 w-5 text-black" />
            <span className="sr-only">Close menu</span>
          </Button>
        </SheetHeader>

        <nav className="flex flex-col gap-4">
          {navigationItems.map((item) => (
            <Button
              key={item.title}
              onClick={() => setOpen(false)}
              className="block w-full p-4 text-center text-black font-medium bg-white border-2 border-black rounded-lg hover:bg-gray-50 transition-colors"
            >
              {item.title}
            </Button>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
