export type VehicleType = 'car' | 'motorcycle';
export type VehicleClass = string;
export type ActiveStatus = 'active' | 'maintenance' | 'retired';

export interface Vehicle {
    id: number;
    vehicle_type: VehicleType;
    vehicle_class: VehicleClass;
    brand: string;
    brand_id?: number;
    vehicle_class_id?: number;
    model: string;
    production_year: number;
    plate_no: string;
    seat_count?: number;
    transmission?: 'manual' | 'automatic' | 'semi-automatic';
    engine_spec?: string;
    status: ActiveStatus;
    created_at?: string;
}

export interface VehicleFormData {
    vehicle_type: VehicleType;
    vehicle_class: VehicleClass;
    brand: string;
    brand_id?: number;
    vehicle_class_id?: number;
    model: string;
    production_year: number;
    plate_no: string;
    seat_count?: number;
    transmission?: 'manual' | 'automatic' | 'semi-automatic';
    engine_spec?: string;
    status: ActiveStatus;
}

export interface VehicleErrors {
    vehicle_type?: string;
    vehicle_class?: string;
    brand?: string;
    model?: string;
    production_year?: string;
    plate_no?: string;
    seat_count?: string;
    transmission?: string;
    engine_spec?: string;
    status?: string;
}

export interface BrandOption {
    id: number;
    name: string;
}

export interface VehicleClassOption {
    id: number;
    name: string;
}