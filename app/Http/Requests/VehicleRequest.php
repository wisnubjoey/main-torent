<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class VehicleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Temporarily allow all requests while testing
        return true;
        
        // Uncomment this when you have proper admin authentication set up
        // return $this->user() && $this->user()->is_admin;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'vehicle_class' => ['required', 'string', 'max:255'],
            'brand' => ['required', 'string', 'max:255'],
            'model' => ['required', 'string', 'max:255'],
            'production_year' => ['required', 'integer', 'min:1900', 'max:' . (date('Y') + 1)],
            'plate_no' => [
                'required',
                'string',
                'max:20',
                Rule::unique('vehicles', 'plate_no'),
            ],
            // Pricing (IDR): optional, non-negative integers
            'price_daily_idr' => ['nullable', 'integer', 'min:0'],
            'price_weekly_idr' => ['nullable', 'integer', 'min:0'],
            'price_monthly_idr' => ['nullable', 'integer', 'min:0'],
            'status' => ['required', 'string', 'in:active,maintenance,retired'],

            // Newly added fields in the form
            'seat_count' => ['nullable', 'integer', 'min:1', 'max:99'],
            'transmission' => ['nullable', 'string', 'in:manual,automatic,semi-automatic'],
            'engine_spec' => ['nullable', 'string', 'max:1000'],
            'vehicle_type' => ['nullable', 'string', 'in:car,motorcycle'],
        ];

        // If this is an update request, exclude the current vehicle from unique validation
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $vehicleId = $this->route('vehicle');
            $rules['plate_no'][3] = Rule::unique('vehicles', 'plate_no')->ignore($vehicleId);
        }

        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'vehicle_class.required' => 'The vehicle class is required.',
            'brand.required' => 'The vehicle brand is required.',
            'model.required' => 'The vehicle model is required.',
            'production_year.required' => 'The production year is required.',
            'production_year.integer' => 'The production year must be a valid year.',
            'production_year.min' => 'The production year must be at least 1900.',
            'production_year.max' => 'The production year cannot be in the future.',
            'plate_no.required' => 'The plate number is required.',
            'plate_no.unique' => 'This plate number is already registered.',
            'status.required' => 'The vehicle status is required.',
            'status.in' => 'The vehicle status must be active, maintenance, or retired.',

            // Messages for newly added fields
            'seat_count.integer' => 'Seats must be a number.',
            'seat_count.min' => 'Seats must be at least 1.',
            'seat_count.max' => 'Seats may not be greater than 99.',
            'transmission.in' => 'Transmission must be manual, automatic, or semi-automatic.',
            'engine_spec.max' => 'Engine spec may not be greater than 1000 characters.',
            'vehicle_type.in' => 'Vehicle type must be car or motorcycle.',

            // Price messages
            'price_daily_idr.integer' => 'Daily price must be an integer.',
            'price_daily_idr.min' => 'Daily price must be zero or greater.',
            'price_weekly_idr.integer' => 'Weekly price must be an integer.',
            'price_weekly_idr.min' => 'Weekly price must be zero or greater.',
            'price_monthly_idr.integer' => 'Monthly price must be an integer.',
            'price_monthly_idr.min' => 'Monthly price must be zero or greater.',
        ];
    }
}