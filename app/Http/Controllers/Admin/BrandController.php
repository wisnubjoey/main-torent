<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BrandController extends Controller
{
    public function index()
    {
        $brands = Brand::orderBy('name')->get();
        return Inertia::render('admin/brand-management/index', [
            'brands' => $brands,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:brands,name'],
        ]);

        $brand = Brand::create($validated);
        Log::info('Created brand', $brand->toArray());
        return redirect()->back()->with('success', 'Brand created');
    }

    public function destroy(Brand $brand)
    {
        $brand->delete();
        return redirect()->back()->with('success', 'Brand deleted');
    }

    public function update(Request $request, Brand $brand)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('brands', 'name')->ignore($brand->id),
            ],
        ]);

        $brand->update($validated);
        return redirect()->back()->with('success', 'Brand updated');
    }
}