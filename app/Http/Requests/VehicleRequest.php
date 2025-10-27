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
            'name' => ['required', 'string', 'max:255'],
            'model' => ['required', 'string', 'max:255'],
            'year' => ['required', 'integer', 'min:1900', 'max:' . (date('Y') + 1)],
            'license_plate' => [
                'required',
                'string',
                'max:20',
                Rule::unique('vehicles', 'license_plate'),
            ],
        ];

        // If this is an update request, exclude the current vehicle from unique validation
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $vehicleId = $this->route('vehicle');
            $rules['license_plate'][3] = Rule::unique('vehicles', 'license_plate')->ignore($vehicleId);
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
            'name.required' => 'The vehicle name is required.',
            'model.required' => 'The vehicle model is required.',
            'year.required' => 'The vehicle year is required.',
            'year.integer' => 'The vehicle year must be a valid year.',
            'year.min' => 'The vehicle year must be at least 1900.',
            'year.max' => 'The vehicle year cannot be in the future.',
            'license_plate.required' => 'The license plate is required.',
            'license_plate.unique' => 'This license plate is already registered.',
        ];
    }
}