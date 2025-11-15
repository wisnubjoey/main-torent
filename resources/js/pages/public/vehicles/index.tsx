"use client"

import { ProfileCard } from "@/components/ui/profile-card"
import { Head } from '@inertiajs/react';
import Navbar from '@/layouts/public/navbar';
import Footer from '@/layouts/public/footer';

export default function Vehicles() {
  return (
    <>
      <Head title="Public Vehicles" />
      <Navbar />
        <ProfileCard />
      <Footer />
    </>
  );
}