import GeminiHero from "../components/Landing/hero";
import Navbar from "../components/Landing/navbar";
import { SolutionArchitecture } from '../components/Landing/solution';
import React from 'react';
import Section from '../components/Landing/problem';
import FeaturesGridBento from "../components/Landing/features";
import PrivacyManifesto from '../components/Landing/security';
import TechStackTicker from "../components/Landing/Source";
import FAQAccordion from "../components/Landing/FQA";
import StickyFooterDemoPage from "../components/Landing/footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <GeminiHero />
      <Section/>
      <SolutionArchitecture />
      <FeaturesGridBento />
      <PrivacyManifesto />
      <FAQAccordion />
      <TechStackTicker />
      <StickyFooterDemoPage />
    </main>
  );
}

