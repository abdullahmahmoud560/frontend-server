"use client";
import React from "react";
import dynamic from "next/dynamic";
import Header from "../components/Header";
import XIcon from "../components/XIcon";
import Footer from "../components/Footer";
import AppWrapper from "../components/AppWrapper";
import mapStyles from "../styles/Map.module.css";
import Main from "./Main";
import NewsSections from "./NewsSections";
import Mainservices from "./Mainservices";
import DetailsBisha from "./DetailsBisha";
import TwitterSection from "./TwiterSection";
import AboutBisha from "./AboutBisha";
import EventsSection from "./EventsSection";
// Dynamically import the MapClient component with no SSR
const MapClient = dynamic(() => import("../components/MapClient"), {
  ssr: false,
});

const HomePage = () => {
  // Format date to show day, month and year

  return (
    <AppWrapper>
      <div>
        <Header />
        <Main />
        <NewsSections />
        <AboutBisha />
        <EventsSection />
        <Mainservices />
        <DetailsBisha />
        <TwitterSection />

        {/* Interactive Map Section */}
        <section className={mapStyles.mapSection}>
          <MapClient />
        </section>

        {/* Footer Section */}
        <Footer />
      </div>
    </AppWrapper>
  );
};

export default HomePage;
