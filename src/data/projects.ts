import type { Project } from "@/types";

export const PROJECTS: Project[] = [
  {
    id: "travel-commerce-platform",
    index: "01",
    title: "Travel Commerce Platform",
    tagline: "White-label travel packages, built and priced in real time.",
    year: "2024",
    role: "Frontend Engineer",
    description:
      "A B2B SaaS platform that lets travel agencies, tour operators, and travel businesses build complete, custom travel packages — flights, hotels, activities, transfers, insurance — instead of selling them one at a time. Agents assemble an itinerary from live supplier inventory and it re-prices automatically as they customize it, then goes out under the agency's own brand.",
    highlights: [
      "Post-booking modification flow — swap a hotel, shift dates, or upgrade a flight on an existing booking, with pricing, taxes, and availability recalculated without rebuilding the package",
      "Package reusability — clone and edit an existing itinerary to requote a similar trip in minutes instead of building from scratch",
      "Quotation, itinerary, invoice, and voucher PDF generation, branded per agency",
      "Migrated the codebase across seven major versions, Angular 12 to 19, while shipping feature work in parallel",
    ],
    stack: ["Angular", "TypeScript", "Angular Material", "TailwindCSS", "REST APIs"],
    accent: "from-cyan-500/25 via-blue-500/15 to-transparent",
    visual: "itinerary",
    caseStudy: {
      problem:
        "Travel businesses — agencies, tour operators, DMCs, airlines — need to sell complete, custom trip packages under their own brand rather than individual flights or hotels. Assembling a multi-supplier itinerary by hand doesn't scale past a handful of bookings a day, and once a customer had booked, even a small change like a different hotel or a shifted date usually meant cancelling and rebuilding the whole package.",
      approach: [
        {
          title: "Dynamic package builder",
          detail:
            "Built the agent-facing UI for assembling flights, hotels, activities, transfers, and insurance from live supplier inventory into a single itinerary, with the price recalculating automatically as anything in it changes.",
        },
        {
          title: "Post-booking modifications",
          detail:
            "Built the flow for changing an existing booking — new hotel, new dates, an upgraded flight — without cancelling and recreating it, keeping pricing, taxes, and availability in sync with the change.",
        },
        {
          title: "Package reusability",
          detail:
            "Added clone-and-edit for itineraries so agents could duplicate a package, adjust it, and requote in minutes instead of starting over.",
        },
        {
          title: "Angular 12 → 19 migration",
          detail:
            "Migrated the codebase across seven major Angular versions — build tooling, deprecated APIs, component patterns — while the app kept shipping feature work in parallel.",
        },
      ],
      outcome:
        "A production platform that lets travel businesses build, price, customize, and modify complex multi-city packages in real time under their own brand — kept on a current, maintainable Angular version throughout rather than left to drift.",
    },
  },
  {
    id: "attendance",
    index: "02",
    title: "Attendance Admin Panel",
    tagline: "Admin panel for a WiFi-verified attendance system, built at Smart India Hackathon.",
    year: "2023",
    role: "Admin Panel Developer · Smart India Hackathon",
    description:
      "A team project built at Smart India Hackathon: an attendance system that verifies student check-ins against the campus WiFi network instead of a manual roll call. I built the admin panel — managing faculty and student records, running weekly lecture scheduling per class, and a live classroom dashboard pulled straight from the database.",
    highlights: [
      "Admin panel for managing faculty and student records across classes",
      "Weekly lecture scheduling with a day-by-day timetable per class",
      "Live classroom dashboard — WiFi-verified attendance and progress (done / in progress / to-do) pulled directly from the database",
      "Built and shipped my scope solo within the hackathon's timeframe",
    ],
    stack: ["HTML", "TailwindCSS", "JavaScript", "PHP"],
    accent: "from-emerald-500/25 via-teal-500/15 to-transparent",
    visual: "roster",
    image: {
      src: "/projects/attendance-admin.webp",
      alt: "Attendance admin panel — class timetable, faculty details, and a live classroom-progress dashboard",
      width: 3020,
      height: 1408,
    },
    caseStudy: {
      problem:
        "Manual roll call burns lecture time and doesn't stop proxy attendance — one student signing in for a friend who isn't in the room. Biometrics or extra hardware fix it but add cost and friction. Built as a team project at Smart India Hackathon, the system verifies attendance through the campus WiFi network instead — my part was the admin panel that runs and surfaces it.",
      approach: [
        {
          title: "Team concept: WiFi as the proof",
          detail:
            "The system validates a student's attendance only when their device is verifiably on the campus network — no biometrics, no extra hardware. The panel below is the piece I built.",
        },
        {
          title: "Admin panel as the control center",
          detail:
            "Built the admin panel end to end — managing faculty and student records, assigning classes, and running weekly lecture scheduling.",
        },
        {
          title: "Live attendance, not end-of-day reports",
          detail:
            "Built the classroom dashboard that pulls attendance and progress (done / in progress / to-do) straight from the database as lectures happen, instead of reconciling from sheets afterwards.",
        },
        {
          title: "Shipped at Smart India Hackathon",
          detail:
            "Scoped and built the admin panel end to end within the hackathon's timeframe, as my contribution to a team project.",
        },
      ],
      outcome:
        "An admin panel that gives faculty and coordinators full control over classes, scheduling, and live, WiFi-verified attendance — built as my share of a team project at Smart India Hackathon.",
    },
  },
];
