"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SectionEditor } from "../SectionEditor"




interface SectionModalProps {
  isOpen: boolean
  onClose: () => void
  section: string | null
  data: any
  onChange: (newData: any) => void
}

export function SectionModal({ isOpen, onClose, section, data, onChange }: SectionModalProps) {
  if (!section) return null

  const sectionTitles: Record<string, string> = {
    navbar: "Landing Section",
    menu: "Menu Section",
    chefs: "Chefs Feed",
    about: "About Us",
    contact: "Contact",
    reviews: "Reviews",
    gallery: "Gallery"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{sectionTitles[section]}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <SectionEditor
            section={section}
            data={data}
            onChange={onChange}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}