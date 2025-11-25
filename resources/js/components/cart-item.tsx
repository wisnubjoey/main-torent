import { useState } from "react";
import { Trash2, Calendar, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/cart-context";

interface CartItemProps {
  itemId: number;
  className?: string;
}

export function CartItem({ itemId, className }: CartItemProps) {
  const { cart, updateCartItem, removeFromCart, isLoading } = useCart();
  const item = cart[itemId];
  
  const [isExpanded, setIsExpanded] = useState(false);

  if (!item) return null;

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDateTime = (dateTimeString: string): string => {
    return new Date(dateTimeString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleModeChange = (mode: 'daily' | 'weekly' | 'monthly') => {
    updateCartItem(itemId, { mode });
  };

  const handleQuantityChange = (quantity: number) => {
    if (quantity >= 1 && quantity <= 99) {
      updateCartItem(itemId, { quantity });
    }
  };

  const handleStartDateChange = (start_at: string) => {
    updateCartItem(itemId, { start_at });
  };

  const handleRemove = () => {
    removeFromCart(itemId);
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">
              {item.vehicle.brand} {item.vehicle.model}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {item.vehicle.production_year} • {item.vehicle.plate_no}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={isLoading}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Summary */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4" />
            <span className="capitalize">{item.mode}</span>
            <span>•</span>
            <span>Qty: {item.quantity}</span>
          </div>
          <div className="text-right">
            <p className="font-semibold">{formatPrice(item.subtotal_price_idr || 0)}</p>
          </div>
        </div>

        {/* Expandable Configuration */}
        <div className={cn("space-y-3", !isExpanded && "hidden")}>
          {/* Mode Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Rental Mode</label>
            <Select
              value={item.mode}
              onValueChange={(value: 'daily' | 'weekly' | 'monthly') => handleModeChange(value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">
                  <div className="flex items-center justify-between w-full">
                    <span>Daily</span>
                    <span className="text-muted-foreground">{formatPrice(item.vehicle.price_daily_idr)}</span>
                  </div>
                </SelectItem>
                <SelectItem value="weekly">
                  <div className="flex items-center justify-between w-full">
                    <span>Weekly</span>
                    <span className="text-muted-foreground">{formatPrice(item.vehicle.price_weekly_idr)}</span>
                  </div>
                </SelectItem>
                <SelectItem value="monthly">
                  <div className="flex items-center justify-between w-full">
                    <span>Monthly</span>
                    <span className="text-muted-foreground">{formatPrice(item.vehicle.price_monthly_idr)}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Quantity</label>
            <Input
              type="number"
              min="1"
              max="99"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              disabled={isLoading}
            />
          </div>

          {/* Start Date/Time */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Start Date & Time</label>
            <Input
              type="datetime-local"
              value={item.start_at}
              onChange={(e) => handleStartDateChange(e.target.value)}
              disabled={isLoading}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          {/* Calculated End Date */}
          {item.end_at && (
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date & Time</label>
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-md">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{formatDateTime(item.end_at)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Expand/Collapse Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full"
        >
          {isExpanded ? "Show Less" : "Configure"}
        </Button>
      </CardContent>
    </Card>
  );
}
