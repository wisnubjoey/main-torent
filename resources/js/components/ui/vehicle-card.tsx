import { motion, useReducedMotion, Variants } from "framer-motion";
import { ShoppingCart, Plus, Check } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent, CardFooter } from "./card";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import type { Vehicle } from "@/types/vehicle";

interface VehicleCardProps {
  vehicle: Vehicle & { 
    image_url?: string | null; 
    primary_image_alt?: string | null;
    price_daily_idr: number;
    price_weekly_idr: number;
    price_monthly_idr: number;
  };
  className?: string;
}

export function VehicleCard({ vehicle, className }: VehicleCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const { addToCart, isInCart, isLoading } = useCart();
  
  const isInCartFlag = isInCart(vehicle.id);
  
  const containerVariants: Variants = {
    rest: { 
      scale: 1,
      y: 0,
    },
    hover: shouldReduceMotion ? {} : { 
      scale: 1.02, 
      y: -4,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 28,
        mass: 0.6,
      }
    },
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = async () => {
    await addToCart(vehicle.id);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="rest"
      whileHover="hover"
      className={cn("w-full", className)}
    >
      <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
        <CardContent className="p-0">
          {/* Vehicle Image */}
          <div className="relative h-48 overflow-hidden bg-muted">
            <img
              src={vehicle.image_url || "/logo.svg"}
              alt={vehicle.primary_image_alt || `${vehicle.brand} ${vehicle.model}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/logo.svg";
              }}
            />
            
            {/* In Cart Badge */}
            {isInCartFlag && (
              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Check className="w-3 h-3" />
                In Cart
              </div>
            )}
          </div>

          {/* Vehicle Details */}
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-lg leading-tight">
                {[vehicle.brand, vehicle.model].filter(Boolean).join(" ")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {[vehicle.production_year, vehicle.transmission, `${vehicle.seat_count} seats`]
                  .filter(Boolean)
                  .join(" • ")}
              </p>
              {vehicle.vehicle_class && (
                <p className="text-xs text-muted-foreground mt-1">
                  {vehicle.vehicle_class}
                </p>
              )}
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-muted/50 rounded p-2">
                  <p className="text-xs text-muted-foreground">Daily</p>
                  <p className="font-semibold text-sm">{formatPrice(vehicle.price_daily_idr)}</p>
                </div>
                <div className="bg-muted/50 rounded p-2">
                  <p className="text-xs text-muted-foreground">Weekly</p>
                  <p className="font-semibold text-sm">{formatPrice(vehicle.price_weekly_idr)}</p>
                </div>
                <div className="bg-muted/50 rounded p-2">
                  <p className="text-xs text-muted-foreground">Monthly</p>
                  <p className="font-semibold text-sm">{formatPrice(vehicle.price_monthly_idr)}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            className={cn(
              "w-full",
              isInCartFlag && "bg-green-600 hover:bg-green-700"
            )}
            onClick={handleAddToCart}
            disabled={isInCartFlag || isLoading}
          >
            {isInCartFlag ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                In Cart
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
