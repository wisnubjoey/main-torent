import React from "react";
import type { Vehicle } from "@/types/vehicle";

export type SecondaryImage = {
  id: number;
  path: string;
  url: string;
  alt_text: string | null;
  position: number;
};

export type ImagesVehicle = {
  id: number;
  brand: string;
  model: string;
  plate_no: string | null;
  image_url: string | null;
  primary_image_alt: string | null;
};

function getCsrfToken(): string {
  const el = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
  return el?.content || "";
}

export function useVehicleImages() {
  const [isImagesDialogOpen, setIsImagesDialogOpen] = React.useState(false);
  const [imagesVehicle, setImagesVehicle] = React.useState<ImagesVehicle | null>(null);
  const [secImages, setSecImages] = React.useState<SecondaryImage[]>([]);
  const [maxSecondary, setMaxSecondary] = React.useState<number>(10);
  const [imagesBusy, setImagesBusy] = React.useState(false);
  const [imagesError, setImagesError] = React.useState<string | null>(null);
  const [primaryFile, setPrimaryFile] = React.useState<File | null>(null);
  const [primaryAlt, setPrimaryAlt] = React.useState("");
  const [uploadFiles, setUploadFiles] = React.useState<File[]>([]);

  async function openImagesDialog(vehicle: Vehicle) {
    setIsImagesDialogOpen(true);
    setImagesError(null);
    setImagesBusy(true);
    try {
      const res = await fetch(`/admin/vehicles/${vehicle.id}/images`, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error("Failed to load images");
      const data = await res.json();
      const v = data.vehicle as ImagesVehicle;
      setImagesVehicle(v);
      setPrimaryAlt(v.primary_image_alt || "");
      const secondary = Array.isArray(data.secondaryImages) ? data.secondaryImages : [];
      setSecImages(secondary.sort((a: SecondaryImage, b: SecondaryImage) => a.position - b.position));
      setMaxSecondary(typeof data.maxSecondary === "number" ? data.maxSecondary : 10);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unable to load image data";
      setImagesError(message);
    } finally {
      setImagesBusy(false);
    }
  }

  async function uploadPrimary() {
    if (!imagesVehicle || !primaryFile) return;
    setImagesBusy(true); setImagesError(null);
    const fd = new FormData();
    fd.append("image", primaryFile);
    if (primaryAlt) fd.append("alt", primaryAlt);
    const res = await fetch(`/admin/vehicles/${imagesVehicle.id}/primary`, { method: "POST", headers: { "X-CSRF-TOKEN": getCsrfToken() }, body: fd });
    setImagesBusy(false);
    if (!res.ok) { setImagesError("Failed to upload primary image"); return; }
    const refresh = await fetch(`/admin/vehicles/${imagesVehicle.id}/images`, { headers: { Accept: "application/json" } });
    if (refresh.ok) {
      const data = await refresh.json();
      const v = data.vehicle as ImagesVehicle;
      setImagesVehicle(v);
      setPrimaryAlt(v.primary_image_alt || "");
    }
    setPrimaryFile(null);
  }

  async function deletePrimary() {
    if (!imagesVehicle) return;
    setImagesBusy(true); setImagesError(null);
    const res = await fetch(`/admin/vehicles/${imagesVehicle.id}/primary`, { method: "DELETE", headers: { "X-CSRF-TOKEN": getCsrfToken() } });
    setImagesBusy(false);
    if (!res.ok) { setImagesError("Failed to delete primary image"); return; }
    setImagesVehicle({ ...imagesVehicle, image_url: null });
  }

  async function uploadSecondary() {
    if (!imagesVehicle || !uploadFiles.length) return;
    setImagesBusy(true); setImagesError(null);
    const fd = new FormData();
    uploadFiles.forEach(f => fd.append("images[]", f));
    const res = await fetch(`/admin/vehicles/${imagesVehicle.id}/secondary`, { method: "POST", headers: { "X-CSRF-TOKEN": getCsrfToken() }, body: fd });
    setImagesBusy(false);
    if (!res.ok) { setImagesError("Failed to upload secondary images"); return; }
    const data = await res.json();
    const created: SecondaryImage[] = Array.isArray(data.created) ? data.created : [];
    setSecImages(prev => [...prev, ...created].sort((a,b)=>a.position-b.position));
    setUploadFiles([]);
  }

  async function deleteSecondary(id: number) {
    if (!imagesVehicle) return;
    setImagesBusy(true); setImagesError(null);
    const res = await fetch(`/admin/vehicles/${imagesVehicle.id}/secondary/${id}`, { method: "DELETE", headers: { "X-CSRF-TOKEN": getCsrfToken() } });
    setImagesBusy(false);
    if (!res.ok) { setImagesError("Failed to delete image"); return; }
    setSecImages(prev => prev.filter(i => i.id !== id));
  }

  async function promoteSecondary(id: number) {
    if (!imagesVehicle) return;
    setImagesBusy(true); setImagesError(null);
    const res = await fetch(`/admin/vehicles/${imagesVehicle.id}/secondary/${id}/promote`, { method: "POST", headers: { "X-CSRF-TOKEN": getCsrfToken() } });
    setImagesBusy(false);
    if (!res.ok) { setImagesError("Failed to promote image"); return; }
    setSecImages(prev => prev.filter(i => i.id !== id));
    const refresh = await fetch(`/admin/vehicles/${imagesVehicle.id}/images`, { headers: { Accept: "application/json" } });
    if (refresh.ok) {
      const data = await refresh.json();
      const v = data.vehicle as ImagesVehicle;
      setImagesVehicle(v);
      setPrimaryAlt(v.primary_image_alt || "");
    }
  }

  async function saveAlt(id: number, alt_text: string) {
    if (!imagesVehicle) return;
    setImagesBusy(true); setImagesError(null);
    const res = await fetch(`/admin/vehicles/${imagesVehicle.id}/secondary/${id}/alt`, { method: "PUT", headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": getCsrfToken() }, body: JSON.stringify({ alt_text }) });
    setImagesBusy(false);
    if (!res.ok) { setImagesError("Failed to update alt text"); return; }
    setSecImages(prev => prev.map(i => i.id===id? { ...i, alt_text }: i));
  }

  async function saveReorder() {
    if (!imagesVehicle) return;
    setImagesBusy(true); setImagesError(null);
    const orders = secImages.map(i => ({ id: i.id, position: i.position }));
    const res = await fetch(`/admin/vehicles/${imagesVehicle.id}/secondary/reorder`, { method: "PUT", headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": getCsrfToken() }, body: JSON.stringify({ orders }) });
    setImagesBusy(false);
    if (!res.ok) { setImagesError("Failed to reorder images"); return; }
    setSecImages(prev => [...prev].sort((a,b)=>a.position-b.position));
  }

  return {
    // state
    isImagesDialogOpen,
    setIsImagesDialogOpen,
    imagesVehicle,
    secImages,
    setSecImages,
    maxSecondary,
    imagesBusy,
    imagesError,
    primaryFile,
    setPrimaryFile,
    primaryAlt,
    setPrimaryAlt,
    uploadFiles,
    setUploadFiles,
    // actions
    openImagesDialog,
    uploadPrimary,
    deletePrimary,
    uploadSecondary,
    deleteSecondary,
    promoteSecondary,
    saveAlt,
    saveReorder,
  } as const;
}