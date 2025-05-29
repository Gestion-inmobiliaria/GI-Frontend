import { cn } from "@/lib/utils"
import { LucideImage, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { Imagen } from "@/modules/state/models/imagen.models"

interface ImageGalleryProps {
  images: Imagen[]
}

export function ImageGallery({ images }: ImageGalleryProps) {
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-muted rounded-xl border">
        <LucideImage className="w-8 h-8 text-muted-foreground mr-2" />
        <span className="text-muted-foreground">Sin imágenes disponibles</span>
      </div>
    )
  }

  const [currentIndex, setCurrentIndex] = useState(0)
  const selectedImage = images[currentIndex]?.url || ""

  const showPrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))

  const showNext = () =>
    setCurrentIndex((prev) => (prev + 1) % images.length)

  return (
    <div>
      {/* Imagen principal con navegación */}
      <div className="w-full h-64 sm:h-72 md:h-96 relative rounded-xl overflow-hidden mb-4 border bg-black flex items-center justify-center">
        <img
          src={selectedImage}
          alt={`Imagen ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain sm:object-cover transition-opacity duration-300 ease-in-out"
        />

        {/* Flechas planas */}
        <button
          onClick={showPrev}
          aria-label="Imagen anterior"
          className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:text-primary transition"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
        <button
          onClick={showNext}
          aria-label="Imagen siguiente"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:text-primary transition"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        {/* Indicador de posición */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Miniaturas */}
      <div className="flex gap-2 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-muted/10">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "min-w-[64px] h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden border",
              currentIndex === index ? "ring-2 ring-primary" : "opacity-70"
            )}
            aria-label={`Seleccionar imagen ${index + 1}`}
          >
            <img
              src={img.url}
              alt={`Miniatura ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}