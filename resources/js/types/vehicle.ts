export interface Vehicle {
    id: number;
    name: string;
    model: string;
    year: number;
    license_plate: string;
    created_at?: string;
    updated_at?: string;
}

export interface VehicleFormData {
    name: string;
    model: string;
    year: number;
    license_plate: string;
}

export interface VehicleErrors {
    name?: string;
    model?: string;
    year?: string;
    license_plate?: string;
}