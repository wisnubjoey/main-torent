import { useState } from 'react';
import { router } from '@inertiajs/react';

export interface Brand { id: number; name: string }
export interface VehicleClass { id: number; name: string }

export function useBrandClassManagement() {
  const [isBrandDialogOpen, setIsBrandDialogOpen] = useState(false);
  const [isClassDialogOpen, setIsClassDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [editingClass, setEditingClass] = useState<VehicleClass | null>(null);
  const [brandName, setBrandName] = useState('');
  const [className, setClassName] = useState('');
  const [brandProcessing, setBrandProcessing] = useState(false);
  const [classProcessing, setClassProcessing] = useState(false);

  const openCreateBrand = () => {
    setEditingBrand(null);
    setBrandName('');
    setIsBrandDialogOpen(true);
  };

  const openEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setBrandName(brand.name);
    setIsBrandDialogOpen(true);
  };

  const submitBrand = () => {
    setBrandProcessing(true);
    const url = `/admin/brand-management${editingBrand ? `/${editingBrand.id}` : ''}`;
    const method = editingBrand ? 'put' : 'post';
    router[method](url, { name: brandName }, {
      preserveScroll: true,
      onFinish: () => setBrandProcessing(false),
      onSuccess: () => setIsBrandDialogOpen(false),
    });
  };

  const deleteBrand = (brand: Brand) => {
    router.delete(`/admin/brand-management/${brand.id}`, {
      preserveScroll: true,
    });
  };

  const openCreateClass = () => {
    setEditingClass(null);
    setClassName('');
    setIsClassDialogOpen(true);
  };

  const openEditClass = (vc: VehicleClass) => {
    setEditingClass(vc);
    setClassName(vc.name);
    setIsClassDialogOpen(true);
  };

  const submitClass = () => {
    setClassProcessing(true);
    const url = `/admin/vehicle-class-management${editingClass ? `/${editingClass.id}` : ''}`;
    const method = editingClass ? 'put' : 'post';
    router[method](url, { name: className }, {
      preserveScroll: true,
      onFinish: () => setClassProcessing(false),
      onSuccess: () => setIsClassDialogOpen(false),
    });
  };

  const deleteClass = (vc: VehicleClass) => {
    router.delete(`/admin/vehicle-class-management/${vc.id}`, {
      preserveScroll: true,
    });
  };

  return {
    // state
    isBrandDialogOpen,
    isClassDialogOpen,
    editingBrand,
    editingClass,
    brandName,
    className,
    brandProcessing,
    classProcessing,
    // setters for controlled components / dialog open changes
    setIsBrandDialogOpen,
    setIsClassDialogOpen,
    setBrandName,
    setClassName,
    // actions
    openCreateBrand,
    openEditBrand,
    submitBrand,
    deleteBrand,
    openCreateClass,
    openEditClass,
    submitClass,
    deleteClass,
  };
}