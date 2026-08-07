import React from "react";
import {
    Navbar,
    HeroSection,
    FeaturesSection,
    InteractiveDemo,
    HowItWorks,
    StatsSection,
    TestimonialsSection,
    FAQSection,
    Footer,
} from "../components/home";

export default function Home() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 selection:bg-blue-500 selection:text-white">
            <Navbar />
            <main>
                <HeroSection />
                <FeaturesSection />
                <InteractiveDemo />
                <HowItWorks />
                <StatsSection />
                <TestimonialsSection />
                <FAQSection />
            </main>
            <Footer />
        </div>
    );
}
