import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  Disc3,
  DollarSign,
  Gift,
  HeartHandshake,
  ListMusic,
  Monitor,
  Music2,
  PlayCircle,
  QrCode,
  Radio,
  Smartphone,
  Sparkles,
  Store,
  Ticket,
  Users,
  Utensils
} from "lucide-react";
import { SiteFooter } from "@/components/ui/site-footer";
import { getAppUrl, getQrImageUrl } from "@/lib/utils";

const demoPath = "/event/sunset-rooftop-party";
const contactHref = "mailto:consultoriaalterna@gmail.com?subject=Start%20DJ%20Connect";

const audienceCards = [
  {
    title: "DJs",
    description: "Manage song requests, tips, profiles, live polls and bookings from one mobile-friendly dashboard.",
    icon: Disc3
  },
  {
    title: "Bars & Nightclubs",
    description: "Turn busy nights into interactive experiences with QR access, promos, sponsors and screen mode.",
    icon: Building2
  },
  {
    title: "Restaurants & Lounges",
    description: "Add music interaction, digital menus, event promos and guest engagement without adding friction.",
    icon: Utensils
  },
  {
    title: "Event Organizers",
    description: "Create QR-powered experiences for private parties, weddings, corporate events and festivals.",
    icon: CalendarDays
  }
];

const steps = [
  {
    title: "Create Your Event",
    description: "Set up the DJ, venue, date, promos, menus and live features from the admin dashboard."
  },
  {
    title: "Share the QR Code",
    description: "Display the event QR on tables, flyers, screens or social media so guests can join instantly."
  },
  {
    title: "Guests Interact Live",
    description: "Guests request songs, vote in polls, view promos, see menus, tip the DJ and open the DJ profile."
  },
  {
    title: "Manage Everything",
    description: "The DJ and venue team review requests, update statuses, launch polls and monitor engagement."
  }
];

const features = [
  {
    title: "Song Requests",
    description: "Guests send songs with artist details and optional music links for quick identification.",
    icon: ListMusic
  },
  {
    title: "Live Polls",
    description: "Launch genre, song or custom polls and see results update while the event is happening.",
    icon: Radio
  },
  {
    title: "Digital Drinks Menu",
    description: "Show cocktails, beer, bottle service, specials, availability and promo labels.",
    icon: Utensils
  },
  {
    title: "Event Promos",
    description: "Highlight offers, sponsors, venue specials and limited-time promotions.",
    icon: Gift
  },
  {
    title: "Tip the DJ",
    description: "Connect guests to external PayPal, Venmo, Cash App, Stripe or Mercado Pago tip links.",
    icon: DollarSign
  },
  {
    title: "DJ Profile",
    description: "Show bio, genres, social links, gallery, packages, upcoming events and booking actions.",
    icon: Users
  },
  {
    title: "Upcoming Events",
    description: "Promote future dates so guests can keep following the DJ and venue calendar.",
    icon: CalendarDays
  },
  {
    title: "Screen Mode",
    description: "Display a large QR code, event info, promos, sponsors and DJ social handles on TVs.",
    icon: Monitor
  },
  {
    title: "Sponsors & Partners",
    description: "Give brands, venues and partners a clean place to appear during the event experience.",
    icon: HeartHandshake
  },
  {
    title: "Admin Dashboard",
    description: "Manage DJs, venues, events, requests, polls, menus, promos, packages and gallery content.",
    icon: BarChart3
  },
  {
    title: "QR Event Access",
    description: "Every event gets a public QR-ready link guests can open without creating an account.",
    icon: QrCode
  },
  {
    title: "Mobile-First Experience",
    description: "Built for phones first, with responsive layouts for tablets, laptops and screen displays.",
    icon: Smartphone
  }
];

const benefits = [
  "More Guest Interaction",
  "Better Event Experience",
  "More Visibility for DJs",
  "More Promotion Opportunities",
  "Simple QR Access",
  "Professional Presentation",
  "Flexible for Any Event"
];

const useCases = [
  {
    title: "Nightclubs & Bars",
    description: "Create a live connection between the booth, venue, sponsors and guests during peak nights.",
    icon: Building2
  },
  {
    title: "Restaurants & Lounges",
    description: "Pair music, promos, menus and guest interaction in a polished branded experience.",
    icon: Store
  },
  {
    title: "Weddings & Private Parties",
    description: "Let guests request songs and vote while the DJ keeps control of the flow.",
    icon: HeartHandshake
  },
  {
    title: "Corporate Events",
    description: "Use QR access, screen mode and polls for networking nights, launches and brand events.",
    icon: Users
  },
  {
    title: "DJs & Mobile DJs",
    description: "Show a professional profile, collect requests, promote services and drive bookings.",
    icon: Music2
  },
  {
    title: "Festivals & Outdoor Events",
    description: "Share schedules, promos, sponsors and interactive moments from any stage or booth.",
    icon: Ticket
  }
];

export function LandingPage() {
  const appUrl = getAppUrl();
  const demoUrl = appUrl + demoPath;
  const qrUrl = getQrImageUrl(demoUrl, 420);

  return (
    <main className="min-h-screen overflow-hidden bg-night text-white">
      <LandingHero demoPath={demoPath} contactHref="#start" />
      <WhoIsThisFor />
      <HowItWorks />
      <FeatureGrid />
      <BenefitsSection />
      <UseCasesSection />
      <DemoSection demoPath={demoPath} demoUrl={demoUrl} qrUrl={qrUrl} />
      <FinalCTA demoPath={demoPath} contactHref={contactHref} />
      <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
        <SiteFooter />
      </div>
    </main>
  );
}

function LandingHero({ demoPath, contactHref }: { demoPath: string; contactHref: string }) {
  return (
    <section className="relative isolate flex min-h-[86vh] items-center border-b border-line/70 px-4 py-8 sm:px-6 lg:px-8">
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=2200&q=85')"
        }}
      />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.35),transparent_38%),linear-gradient(180deg,rgba(0,0,0,0.68),#050505_92%)]" />

      <div className="mx-auto grid w-full max-w-6xl gap-10 pt-8">
        <nav className="flex items-center justify-between rounded-full border border-white/10 bg-black/35 px-4 py-3 backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet">DJ Connect</p>
            <p className="text-xs text-white/70">Interactive QR System for DJs, Bars, Restaurants & Events</p>
          </div>
          <Link
            href={demoPath}
            className="hidden rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-violet hover:bg-violet/20 sm:inline-flex"
          >
            View demo
          </Link>
        </nav>

        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet/40 bg-violet/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet">
            <Sparkles size={14} />
            QR-powered live event app
          </p>
          <h1 className="text-4xl font-black leading-tight text-white sm:text-6xl lg:text-7xl">
            Turn Every Event Into an Interactive Experience
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-white/75 sm:text-lg">
            Let guests request songs, vote in live polls, explore promos, view menus, tip the DJ and connect with the
            event in real time using one simple QR code.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={demoPath}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet via-electric to-magenta px-6 py-3 text-sm font-bold text-white shadow-glow transition hover:scale-[1.01]"
            >
              View Live Demo
              <ArrowRight size={18} />
            </Link>
            <Link
              href={contactHref}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-black/45 px-6 py-3 text-sm font-bold text-white transition hover:border-violet hover:bg-white/10"
            >
              Get Started
            </Link>
          </div>
        </div>

        <LandingAppPreview />
      </div>
    </section>
  );
}

function LandingAppPreview() {
  return (
    <div className="mx-auto w-full max-w-4xl rounded-[24px] border border-white/10 bg-black/55 p-3 shadow-glow backdrop-blur">
      <div className="overflow-hidden rounded-[20px] border border-line bg-surface">
        <div
          className="h-36 bg-cover bg-center sm:h-48"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1600&q=85')"
          }}
        />
        <div className="grid gap-4 p-4 sm:grid-cols-[1.15fr_0.85fr] sm:p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet">Active Event</p>
            <h2 className="mt-2 text-2xl font-black text-white">Sunset Rooftop Party</h2>
            <p className="mt-1 text-sm text-muted">Alex Beat at Rooftop Lounge</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <PreviewFeature icon={Music2} label="Request a Song" />
              <PreviewFeature icon={Radio} label="Live Polls" />
              <PreviewFeature icon={Gift} label="Event Promos" />
              <PreviewFeature icon={DollarSign} label="Tip the DJ" />
            </div>
          </div>
          <div className="rounded-[22px] border border-line bg-black p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-white">Requested Songs</p>
                <p className="text-xs text-muted">Live from the dance floor</p>
              </div>
              <span className="rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-100">
                LIVE
              </span>
            </div>
            <div className="mt-4 space-y-2">
              {["One More Time", "Blinding Lights", "La Chona"].map((song, index) => (
                <div key={song} className="flex items-center justify-between rounded-2xl border border-line bg-surface2 p-3">
                  <span className="text-sm font-semibold text-white">{song}</span>
                  <span className="text-xs text-muted">{index === 0 ? "Pending" : "Played"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewFeature({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-black/70 p-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-violet/10 text-violet">
        <Icon size={18} />
      </span>
      <span className="text-sm font-semibold text-white">{label}</span>
    </div>
  );
}

function WhoIsThisFor() {
  return (
    <LandingSection>
      <SectionHeading
        eyebrow="Who Is This For?"
        title="Built for DJs, Venues, Bars, Restaurants & Event Organizers"
        description="DJ Connect helps teams create a branded, interactive experience guests can open instantly from a QR code."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {audienceCards.map((card) => (
          <FeatureCard key={card.title} {...card} />
        ))}
      </div>
    </LandingSection>
  );
}

function HowItWorks() {
  return (
    <LandingSection className="bg-surface/35">
      <SectionHeading
        eyebrow="How It Works"
        title="A Simple Flow from Setup to Live Interaction"
        description="Create the event, share the QR code and let guests interact while the DJ and venue manage everything live."
      />
      <div className="grid gap-4 lg:grid-cols-4">
        {steps.map((step, index) => (
          <article key={step.title} className="rounded-[22px] border border-line bg-black/70 p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r from-violet to-electric text-sm font-black text-white">
              {index + 1}
            </span>
            <h3 className="mt-5 text-lg font-bold text-white">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{step.description}</p>
          </article>
        ))}
      </div>
    </LandingSection>
  );
}

function FeatureGrid() {
  return (
    <LandingSection>
      <SectionHeading
        eyebrow="Main Features"
        title="Everything You Need to Make Your Event Interactive"
        description="A full QR event system for music requests, polls, menus, promos, tips, screens, sponsors and admin control."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </LandingSection>
  );
}

function BenefitsSection() {
  return (
    <LandingSection className="bg-surface/35">
      <SectionHeading
        eyebrow="Benefits"
        title="Why Businesses and DJs Use DJ Connect"
        description="The app gives every event a cleaner guest flow, more engagement and a more professional presentation."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit) => (
          <BenefitCard key={benefit} title={benefit} />
        ))}
      </div>
    </LandingSection>
  );
}

function UseCasesSection() {
  return (
    <LandingSection>
      <SectionHeading
        eyebrow="Use Cases"
        title="Flexible for Any Type of Event"
        description="Use the same platform for nightlife, private events, venues, restaurants and mobile DJ services."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {useCases.map((useCase) => (
          <UseCaseCard key={useCase.title} {...useCase} />
        ))}
      </div>
    </LandingSection>
  );
}

function DemoSection({ demoPath, demoUrl, qrUrl }: { demoPath: string; demoUrl: string; qrUrl: string }) {
  return (
    <LandingSection className="bg-surface/35">
      <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet">Demo</p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">Try the Live Demo</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
            Open the live event demo to see the guest experience exactly like an attendee would: song requests, polls,
            promos, drinks, DJ profile and QR navigation.
          </p>
          <Link
            href={demoPath}
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet via-electric to-magenta px-6 py-3 text-sm font-bold text-white shadow-glow transition hover:scale-[1.01]"
          >
            Open Demo Event
            <PlayCircle size={18} />
          </Link>
        </div>
        <QRCodeBlock demoUrl={demoUrl} qrUrl={qrUrl} />
      </div>
    </LandingSection>
  );
}

function FinalCTA({ demoPath, contactHref }: { demoPath: string; contactHref: string }) {
  return (
    <section id="start" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-[24px] border border-violet/30 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.28),transparent_38%),#111111] px-5 py-12 text-center shadow-glow sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet">Ready to launch</p>
        <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">Ready to Make Your Next Event Interactive?</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted">
          Start with a branded QR experience for your DJs, venue, guests, promos, sponsors and live event screens.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={contactHref}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet via-electric to-magenta px-6 py-3 text-sm font-bold text-white shadow-glow transition hover:scale-[1.01]"
          >
            Start My App
            <ArrowRight size={18} />
          </Link>
          <Link
            href={demoPath}
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-black/45 px-6 py-3 text-sm font-bold text-white transition hover:border-violet hover:bg-white/10"
          >
            View Demo
          </Link>
        </div>
      </div>
    </section>
  );
}

function QRCodeBlock({ demoUrl, qrUrl }: { demoUrl: string; qrUrl: string }) {
  return (
    <article className="mx-auto w-full max-w-sm rounded-[24px] border border-line bg-black/70 p-5 text-center shadow-glow">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-violet/10 text-violet">
        <QrCode size={22} />
      </span>
      <h3 className="mt-4 text-xl font-bold text-white">Scan QR</h3>
      <p className="mt-2 text-sm text-muted">Scan to open the demo event on your phone.</p>
      <img src={qrUrl} alt="QR code for DJ Connect demo event" className="mx-auto mt-5 rounded-[22px] bg-white p-3" />
      <p className="mt-4 break-all text-xs text-muted">{demoUrl}</p>
    </article>
  );
}

function LandingSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={className}>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8 max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-black leading-tight text-white sm:text-5xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-muted">{description}</p>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon: Icon
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <article className="rounded-[22px] border border-line bg-surface p-5 shadow-glow">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-line bg-black text-violet">
        <Icon size={21} />
      </span>
      <h3 className="mt-5 text-lg font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
    </article>
  );
}

function BenefitCard({ title }: { title: string }) {
  return (
    <article className="flex items-center gap-3 rounded-[22px] border border-line bg-black/70 p-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-500/10 text-emerald-200">
        <CheckCircle2 size={18} />
      </span>
      <h3 className="text-sm font-bold text-white">{title}</h3>
    </article>
  );
}

function UseCaseCard({
  title,
  description,
  icon: Icon
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <article className="rounded-[22px] border border-line bg-surface p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-line bg-black text-violet">
          <Icon size={20} />
        </span>
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
    </article>
  );
}
