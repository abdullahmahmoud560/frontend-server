"use client";
import React from "react";
import dynamic from "next/dynamic";
import Header from "../components/Header";
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

        {/* Fixed Twitter Logo */}
        <div className="fixedTwitterLogo">
          <a
            href="https://x.com/Bisha_cci"
            target="_blank"
            rel="noopener noreferrer"
            className="fixedTwitterButton"
            title="تابعنا على تويتر"
          >
            <svg viewBox="0 0 24 24" className="fixedXLogo" aria-hidden="true">
              <g>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </g>
            </svg>
          </a>
        </div>

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
