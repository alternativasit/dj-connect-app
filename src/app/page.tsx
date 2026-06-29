import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";

export const metadata: Metadata = {
  title: "DJ Connect - Interactive QR App for DJs, Bars, Restaurants & Events",
  description:
    "A QR-powered event app where guests can request songs, vote live, view promos, explore menus, tip the DJ, and connect with the event in real time. Built for DJs, bars, restaurants, venues, and event organizers.",
  keywords: [
    "DJ app",
    "QR event app",
    "song request app",
    "live polls for events",
    "DJ tips app",
    "bar event app",
    "restaurant event app",
    "nightclub app",
    "venue app",
    "event interaction app",
    "QR app for events"
  ]
};

export default function HomePage() {
  return <LandingPage />;
}
