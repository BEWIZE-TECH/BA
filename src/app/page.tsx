import Navbar from "../components/General/navbar";
import { HeroSection } from "@/components/Landing/hero";
import { SolutionArchitecture } from '../components/Landing/solution';
import React from 'react';
import Section from '../components/Landing/problem';
import FeaturesGridBento from "../components/Landing/features";
import PrivacyManifesto from '../components/Landing/security';
import TechStackTicker from "../components/Landing/Source";
import FAQAccordion from "../components/Landing/FQA";
import StickyFooterDemoPage from "../components/General/footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <Section/>
      <FeaturesGridBento />
      <PrivacyManifesto />
      <SolutionArchitecture />
      <FAQAccordion />
      <TechStackTicker />
      <StickyFooterDemoPage />
    </main>
  );
}

