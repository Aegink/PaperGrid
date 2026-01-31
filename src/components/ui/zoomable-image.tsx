"use client"

import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { ComponentProps } from "react"

interface ZoomableImageProps extends ComponentProps<"img"> {
  src: string
  alt?: string
}

export function ZoomableImage({ src, alt, className, ...props }: ZoomableImageProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <img
          src={src}
          alt={alt}
          className={cn("cursor-zoom-in transition-opacity hover:opacity-90", className)}
          {...props}
        />
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] max-h-[95vh] border-none bg-transparent p-0 shadow-none sm:max-w-[95vw] flex items-center justify-center">
        <DialogTitle className="sr-only">{alt || "View Image"}</DialogTitle>
        <div className="relative w-full h-full flex items-center justify-center p-4">
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
