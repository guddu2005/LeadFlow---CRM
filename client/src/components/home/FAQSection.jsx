import React, { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = [
        {
            question: "What is LeadFlow and how does it help my sales team?",
            answer: "LeadFlow is an end-to-end intelligent Lead & CRM Management platform. It unifies lead capture, automated outreach sequences, AI-powered intent scoring, and a visual Kanban pipeline so sales teams can close deals faster with zero data entry friction.",
        },
        {
            question: "Does LeadFlow support both Dark and Light mode?",
            answer: "Yes! LeadFlow features built-in native Dark and Light mode support. You can switch themes seamlessly at any time using the theme toggle in the header navigation or footer. Your preference is automatically remembered across sessions.",
        },
        {
            question: "How does the AI Lead Scoring algorithm work?",
            answer: "LeadFlow analyzes prospect firmographics, company size, engagement patterns (e.g. email opens, deck views, website visits), and historical conversion data to generate a real-time score from 1 to 100, highlighting your highest priority leads.",
        },
        {
            question: "Can I import leads from external spreadsheets or existing CRMs?",
            answer: "Absolutely. LeadFlow supports CSV/Excel imports, REST API webhooks, and direct synchronization with popular CRM tools, instantly enriching imported contacts with clear company firmographics.",
        },
        {
            question: "Is LeadFlow secure and compliant with data privacy laws?",
            answer: "Security is our highest priority. LeadFlow employs SOC2-compliant practices, end-to-end TLS encryption, role-based access control (RBAC), and strict GDPR compliance standards to protect your customer data.",
        },
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-20 lg:py-28 bg-white dark:bg-slate-900 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span>Got Questions?</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
                        Find answers to common questions about LeadFlow features, onboarding, and platform capabilities.
                    </p>
                </div>

                {/* Accordion */}
                <div className="mt-12 space-y-4">
                    {faqs.map((faq, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <div
                                key={idx}
                                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                                    isOpen
                                        ? "bg-slate-50 dark:bg-slate-800/80 border-blue-500/50 shadow-md"
                                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                                }`}
                            >
                                <button
                                    onClick={() => toggleFAQ(idx)}
                                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                                >
                                    <span className="text-base font-bold text-slate-900 dark:text-white">
                                        {faq.question}
                                    </span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0 transition-transform duration-200 ${
                                            isOpen ? "rotate-180 text-blue-600 dark:text-blue-400" : ""
                                        }`}
                                    />
                                </button>

                                {isOpen && (
                                    <div className="px-5 pb-5 pt-0 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/50 dark:border-slate-700/50 mt-1">
                                        <p className="pt-3">{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
