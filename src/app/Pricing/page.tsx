'use client';
import { useEffect, useState } from 'react';
import Pricing from '@/components/pricing/pricing';
import Navbar from '@/components/General/navbar';
import Footer from '@/components/General/footer';


export default function Page() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <Pricing />
      <Footer />
    </div>
  );
}