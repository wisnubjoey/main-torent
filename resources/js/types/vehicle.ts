export type VehicleType = 'car' | 'motorcycle';
export type VehicleClass = 'luxury' | 'sport' | 'vacation';
export type BodyType = 'sedan' | 'van' | 'suv' | 'hatchback';
export type VacationUsage = 'family' | 'compact' | 'offroad';
export type Transmission = 'manual' | 'automatic' | 'semi-automatic';
export type ActiveStatus = 'active' | 'maintenance' | 'retired';

export interface Vehicle {
    id: number;
    vehicle_type: VehicleType;
    vehicle_class: VehicleClass;
    brand: string;
    model: string;
    production_year: number;
    plate_no: string;
    vin?: string;
    seat_count?: number;
    transmission?: Transmission;
    engine_spec?: string;
    base_daily_rate: number;
    status: ActiveStatus;
    created_at?: string;
    luxury?: VehicleSpecLuxury;
    sport?: VehicleSpecSport;
    vacation?: VehicleSpecVacation;
}

export interface VehicleSpecLuxury {
    vehicle_id: number;
    body: 'sedan' | 'van';
    driver_included: boolean;
}

export interface VehicleSpecSport {
    vehicle_id: number;
    zero_to_100_sec: number;
    engine_spec: string;
    transmission: Transmission;
}

export interface VehicleSpecVacation {
    vehicle_id: number;
    seater: number;
    usage: VacationUsage;
    body: BodyType;
}

export interface VehicleFormData {
    vehicle_type: VehicleType;
    vehicle_class: VehicleClass;
    brand: string;
    model: string;
    production_year: number;
    plate_no: string;
    vin?: string;
    seat_count?: number;
    transmission?: Transmission;
    engine_spec?: string;
    base_daily_rate: number;
    status: ActiveStatus;
    specs?: {
        luxury?: Omit<VehicleSpecLuxury, 'vehicle_id'>;
        sport?: Omit<VehicleSpecSport, 'vehicle_id'>;
        vacation?: Omit<VehicleSpecVacation, 'vehicle_id'>;
    };
}

export interface VehicleErrors {
    vehicle_type?: string;
    vehicle_class?: string;
    brand?: string;
    model?: string;
    production_year?: string;
    plate_no?: string;
    vin?: string;
    seat_count?: string;
    transmission?: string;
    engine_spec?: string;
    base_daily_rate?: string;
    status?: string;
    'specs.luxury.body'?: string;
    'specs.luxury.driver_included'?: string;
    'specs.sport.zero_to_100_sec'?: string;
    'specs.sport.engine_spec'?: string;
    'specs.sport.transmission'?: string;
    'specs.vacation.seater'?: string;
    'specs.vacation.usage'?: string;
    'specs.vacation.body'?: string;
}