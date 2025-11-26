import { motion, useReducedMotion, Variants } from "framer-motion"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { router } from "@inertiajs/react"
interface VehicleCardProps {
  name?: string
  description?: string
  image?: string
  seatCount?: number | string | null
  transmission?: string | null
  priceDailyIdr?: number | string | null
  enableAnimations?: boolean
  className?: string
  vehicleId?: number
  rentHref?: string
  onRent?: () => void
  inCart?: boolean
}

export function VehicleCard({
  name = "Vehicle",
  description = "",
  image = "/logo.svg",
  seatCount = null,
  transmission = null,
  priceDailyIdr = null,
  enableAnimations = true,
  className,
  vehicleId,
  rentHref = "/cart/items",
  onRent,
  inCart = false,
}: VehicleCardProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hovered, setHovered] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const shouldAnimate = enableAnimations && !shouldReduceMotion
  const [renting, setRenting] = useState(false)
  const [optimisticAdded, setOptimisticAdded] = useState<boolean | null>(null)
  const added = optimisticAdded ?? !!inCart
  const [toastOpen, setToastOpen] = useState(false)
  const [toastText, setToastText] = useState("")

  

  const handleRent = () => {
    if (added) {
      if (vehicleId != null) {
        setRenting(true)
        router.delete(`/cart/items/by-vehicle/${vehicleId}`, {
          onSuccess: () => {
            setRenting(false)
            setOptimisticAdded(false)
            setToastText("Removed from cart")
            setToastOpen(true)
            setTimeout(() => setToastOpen(false), 2000)
          },
          onFinish: () => setRenting(false),
        })
      }
      return
    }
    if (onRent) {
      onRent()
      return
    }
    if (vehicleId != null) {
      setRenting(true)
      router.post(rentHref, { vehicle_id: vehicleId }, {
        onSuccess: () => {
          setOptimisticAdded(true)
          setToastText("Added to cart")
          setToastOpen(true)
          setTimeout(() => setToastOpen(false), 2000)
        },
        onFinish: () => setRenting(false),
      })
    }
  }

  const containerVariants: Variants = {
  rest: { 
    scale: 1,
    y: 0,
    filter: "blur(0px)",
  },
  hover: shouldAnimate ? { 
    scale: 1.02, 
    y: -4,
    filter: "blur(0px)",
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 28,
      mass: 0.6,
    }
  } : {},
  }


  const imageVariants: Variants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
  }

  const contentVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      filter: "blur(4px)",
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 28,
        mass: 0.6,
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 15,
      scale: 0.95,
      filter: "blur(2px)",
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        mass: 0.5,
      },
    },
  }

  const letterVariants: Variants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        damping: 8,
        stiffness: 200,
        mass: 0.8,
      },
    },
  }

  return (
    <motion.div
      data-slot="vehicle-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial="rest"
      whileHover="hover"
      variants={containerVariants as never}
      className={cn(
        "relative w-80 h-96 rounded-3xl border border-border/20 text-card-foreground overflow-hidden shadow-xl shadow-black/5 cursor-pointer group backdrop-blur-sm",
        "dark:shadow-black/20",
        className
      )}
    >
      {/* Full Cover Image */}
      <motion.img
        src={image}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover"
        variants={imageVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />

      {/* Smooth Blur Overlay - Multiple layers for seamless fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 via-background/20 via-background/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background/90 via-background/60 via-background/30 via-background/15 via-background/8 to-transparent backdrop-blur-[1px]" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/85 via-background/40 to-transparent backdrop-blur-sm" />

      {/* Content */}
      <motion.div 
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        className="absolute bottom-0 left-0 right-0 p-6 space-y-4"
      >
      {/* Name */}
      <motion.div variants={itemVariants} className="flex items-center gap-2">
        <motion.h2 
          className="text-2xl font-bold text-foreground"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.02,
              }
            }
          }}
        >
          {name.split("").map((letter, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              className="inline-block"
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </motion.h2>
      </motion.div>

      {/* Description */}
      <motion.p 
        variants={itemVariants}
        className="text-muted-foreground text-sm leading-relaxed"
      >
        {description}
      </motion.p>

      {/* Vehicle facts */}
      <motion.div 
        variants={itemVariants}
        className="flex items-center gap-3 pt-2 text-xs text-muted-foreground"
      >
        {seatCount != null && (
          <span className="inline-flex items-center gap-1">{String(seatCount)} seats</span>
        )}
        {transmission && (
          <span className="inline-flex items-center gap-1 capitalize">{transmission}</span>
        )}
        {priceDailyIdr != null && (
          <span className="ml-auto font-medium text-foreground">Daily: IDR {priceDailyIdr}</span>
        )}
      </motion.div>

      {/* Rent Button */}
      <motion.button
        variants={itemVariants}
        onClick={handleRent}
        whileHover={{ 
          scale: 1.02,
          transition: { type: "spring", stiffness: 400, damping: 25 }
        }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "w-full cursor-pointer py-3 px-4 rounded-2xl font-semibold text-sm transition-all duration-200",
          "border border-border/20 shadow-sm",
          added ? "bg-red-600 text-white hover:bg-red-700" : "bg-foreground text-background hover:bg-foreground/90",
          "transform-gpu"
        )}
        disabled={renting}
      >
        {added ? "Cancel" : "+ Rent"}
      </motion.button>

      {toastOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="pointer-events-none fixed right-4 top-16 z-50 flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm shadow"
        >
          <span className="font-medium">{toastText}</span>
        </motion.div>
      )}
      </motion.div>
    </motion.div>
  )
}
