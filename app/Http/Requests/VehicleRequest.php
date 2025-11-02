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
            'brand' => ['required', 'string', 'max:255'],
            'model' => ['required', 'string', 'max:255'],
            'production_year' => ['required', 'integer', 'min:1900', 'max:' . (date('Y') + 1)],
            'plate_no' => [
                'required',
                'string',
                'max:20',
                Rule::unique('vehicles', 'plate_no'),
            ],
            'base_daily_rate' => ['required', 'numeric', 'min:0'],
            'status' => ['required', 'string', 'in:active,maintenance,retired'],
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
            'brand.required' => 'The vehicle brand is required.',
            'model.required' => 'The vehicle model is required.',
            'production_year.required' => 'The production year is required.',
            'production_year.integer' => 'The production year must be a valid year.',
            'production_year.min' => 'The production year must be at least 1900.',
            'production_year.max' => 'The production year cannot be in the future.',
            'plate_no.required' => 'The plate number is required.',
            'plate_no.unique' => 'This plate number is already registered.',
            'base_daily_rate.required' => 'The daily rate is required.',
            'base_daily_rate.numeric' => 'The daily rate must be a number.',
            'base_daily_rate.min' => 'The daily rate must be at least 0.',
            'status.required' => 'The vehicle status is required.',
            'status.in' => 'The vehicle status must be active, maintenance, or retired.',
        ];
    }
}