Based on the plan.md specifications and existing model patterns, I will create two Eloquent models for the rental order system:

**1. RentalOrder Model**
- Location: `app/Models/RentalOrder.php`
- Relationships: belongsTo User, hasMany RentalOrderItem
- Fillable fields: status, total_price_idr, notes
- Casts: total_price_idr to integer
- Status validation: draft, ongoing, completed, cancelled

**2. RentalOrderItem Model**  
- Location: `app/Models/RentalOrderItem.php`
- Relationships: belongsTo RentalOrder, belongsTo Vehicle
- Fillable fields: mode, quantity, start_at, end_at, price_per_unit_idr, subtotal_price_idr
- Casts: quantity, price_per_unit_idr, subtotal_price_idr to integers; start_at, end_at to datetime
- Mode validation: daily, weekly, monthly
- Date validation: end_at > start_at, quantity > 0

**Model Implementation Details:**
- Follow existing code style and patterns from User.php and Vehicle.php
- Use HasFactory trait
- Include proper fillable arrays for mass assignment
- Implement appropriate casts for data types
- Define relationships following Laravel conventions
- Add validation rules as model properties or methods
- Include proper namespace declarations matching existing models

Both models will integrate seamlessly with the existing vehicle management system and follow the established architectural patterns in the codebase.