"use client"

import * as React from "react"
import { X, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Accordion } from "@/components/ui/accordion"

const navigationItems = [
  { title: "Prompt1", href: "#" },
  { title: "Prompt2", href: "#" },
  { title: "Prompt3", href: "#" },
  { title: "Prompt4", href: "#" },
]

export function Sidebar() {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button  size="icon" className="fixed top-22 m-5 right-4 z-50 bg-white  border-black border-4">
          <Menu className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full bg-[#948979] p-6 border-8 border-black">
        <SheetHeader className="flex flex-row items-center justify-between mb-8">
          <SheetTitle className="text-xl font-semibold text-black">Chat History</SheetTitle>
          <Button
            size="icon"
            onClick={() => setOpen(false)}
            className="h-6 w-6 p-0 hover:bg-transparent"
          >
            <X className="h-5 w-5 text-black" />
            <span className="sr-only">Close menu</span>
          </Button>
        </SheetHeader>

        <nav className="flex flex-col gap-2 ">
          {navigationItems.map((item) => (
            <Button
              key={item.title}
              onClick={() => setOpen(false)}
              className="w-full h-15"
              // className="block w-full p-4 text-center text-black font-medium bg-white border-2 border-black rounded-lg hover:bg-gray-50 transition-colors"
            >
              {item.title}
            </Button>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
