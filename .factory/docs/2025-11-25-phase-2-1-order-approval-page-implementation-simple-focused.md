# Phase 2.1: Order Approval Page Implementation (Simple & Focused)

## Current State
The Approval page is currently a placeholder. The backend `RentalOrderController::index()` already provides all necessary order data.

## Implementation Plan (Using Existing UI Patterns)

### 2.1.A Update Approval.tsx Page
**File:** `/resources/js/pages/admin/orders/Approval.tsx`

Replace placeholder with a functional table following vehicle-management page pattern:

1. **Import Required Components** (following vehicle-management pattern)
   - Table components (Table, TableBody, TableCell, TableHead, TableHeader, TableRow)
   - Button component
   - Badge component (existing)
   - Dialog components (for confirmations)
   - Icons from lucide-react
   - PlaceholderPattern component (for "no orders" state)

2. **Order Table Structure**
   - Use existing Table components with consistent styling
   - Columns: ID, User Name, Vehicle Count, Period, Total, Status, Actions
   - Follow vehicle-management table pattern for responsive design
   - Add empty state handling when no orders exist

3. **"No Approval" Placeholder Implementation**
   - When `orders.length === 0`, show placeholder similar to overview page
   - Use existing `PlaceholderPattern` component
   - Add appropriate message: "No orders pending approval"
   - Follow overview page placeholder pattern with icon and description

4. **Status Badge Implementation**
   - Use existing Badge component with conditional styling
   - Draft: `bg-gray-100 text-gray-800`
   - Ongoing: `bg-blue-100 text-blue-800`
   - Follow vehicle-management status badge pattern

5. **Action Buttons**
   - View Details: Button variant="outline" (links to order detail page)
   - Start Rent: Button variant="default" (for draft orders)
   - Complete Rent: Button variant="secondary" (for ongoing orders)
   - Cancel Order: Button variant="destructive" (for draft/ongoing orders)
   - Use AlertDialog for destructive action confirmations

### 2.1.B API Integration (Simple Pattern)

1. **Data Source**
   - Use `props.orders` from Inertia page props
   - Follow vehicle-management pattern for accessing page data
   - Handle empty array case for placeholder

2. **Action Handlers**
   - Start Rent: `router.post('/admin/orders/' + order.id + '/start')`
   - Complete Rent: `router.post('/admin/orders/' + order.id + '/complete')`
   - Cancel Order: `router.post('/admin/orders/' + order.id + '/cancel')`
   - Follow vehicle-management pattern for form submissions

3. **Confirmation Dialogs**
   - Use existing AlertDialog components
   - Pattern: `AlertDialog` with `AlertDialogAction` for confirm button
   - Follow vehicle-management delete confirmation pattern

### 2.1.C Component Implementation Details

```tsx
// Structure following vehicle-management pattern:
export default function ApprovalPage() {
    const { orders } = usePage().props;
    
    // If no orders, show placeholder
    if (!orders || orders.length === 0) {
        return (
            <AdminLayout title="Order Approval" description="Manage and approve rental orders.">
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Order Approval</h1>
                    <div className="relative h-96 rounded-xl border border-dashed border-sidebar-border/70 bg-muted/40 overflow-hidden">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                            <div className="text-center">
                                <h3 className="text-lg font-semibold mb-2">No orders pending approval</h3>
                                <p className="text-muted-foreground">All rental orders are currently processed</p>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }
    
    // Action handlers following vehicle-management pattern
    const handleStart = (orderId) => { ... };
    const handleComplete = (orderId) => { ... };
    const handleCancel = (orderId) => { ... };
    
    return (
        <AdminLayout title="Order Approval" description="Manage and approve rental orders.">
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Order Approval</h1>
                
                {/* Order Table */}
                <div className="bg-background rounded-lg shadow overflow-hidden border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Vehicle Count</TableHead>
                                <TableHead>Period</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    {/* Table cells following vehicle-management pattern */}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                
                {/* Confirmation Dialogs */}
                <AlertDialog>
                    {/* Cancel confirmation */}
                </AlertDialog>
            </div>
        </AdminLayout>
    );
}
```

### 2.1.D Key Features Implementation

1. **"No Orders" State**
   - Use PlaceholderPattern component like overview page
   - Centered message with appropriate icon
   - Professional empty state design
   - Consistent with other admin pages

2. **Order Information Display**
   - Order ID
   - User name and phone (from order.user)
   - Vehicle count (from order.vehicle_count)
   - Period (from order.period)
   - Total price formatted as IDR
   - Status badge with appropriate color

3. **Action Logic**
   - Show "Start" only for 'draft' orders
   - Show "Complete" only for 'ongoing' orders
   - Show "Cancel" for 'draft' and 'ongoing' orders
   - Disable buttons based on order status

### 2.1.E Success Criteria

1. **Functional Requirements**
   - ✅ Display "No orders pending approval" placeholder when empty
   - ✅ Display list of draft and ongoing orders when present
   - ✅ Show all order information clearly
   - ✅ Implement all required actions (Start, Complete, Cancel)
   - ✅ Handle API responses and errors
   - ✅ Provide confirmation for destructive actions

2. **UI Requirements**
   - ✅ Follow existing admin page patterns
   - ✅ Use existing UI components only
   - ✅ Use PlaceholderPattern for empty state
   - ✅ Responsive design
   - ✅ Proper loading and error states
   - ✅ Consistent styling with vehicle-management

3. **Technical Requirements**
   - ✅ TypeScript type safety
   - ✅ Follow existing patterns
   - ✅ Integration with Inertia.js
   - ✅ Proper error handling

This approach keeps the implementation simple, uses existing UI components, follows established patterns from the codebase, and provides a proper "no orders" placeholder using the existing PlaceholderPattern component.