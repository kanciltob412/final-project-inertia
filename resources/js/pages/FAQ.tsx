import { Head } from '@inertiajs/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

const faqData: FAQItem[] = [
    {
        question: "What makes Lavanya ceramics special?",
        answer: "Our ceramics are handcrafted using traditional techniques passed down through generations, combined with modern design sensibilities. Each piece is unique and made with high-quality, food-safe materials."
    },
    {
        question: "Are your ceramics food safe?",
        answer: "Yes, all of our ceramics are made with food-safe glazes and fired at high temperatures to ensure they're safe for food and beverage use. They're also dishwasher and microwave safe unless otherwise noted."
    },
    {
        question: "How should I care for my ceramic pieces?",
        answer: "Most of our pieces are dishwasher safe, but we recommend hand washing with mild soap for longevity. Avoid extreme temperature changes and use coasters under hot items to prevent thermal shock."
    },
    {
        question: "Do you offer custom orders?",
        answer: "Yes, we accept custom orders for special occasions or specific design requirements. Please contact us at custom@lavanyaceramics.com with your specifications, and we'll provide a quote and timeline."
    },
    {
        question: "How long does shipping take?",
        answer: "Standard shipping takes 5-7 business days within the US. Express shipping (2-3 days) and overnight options are also available. International shipping times vary by location."
    },
    {
        question: "What if my item arrives damaged?",
        answer: "We package all items carefully, but if your ceramic arrives damaged, please contact us immediately with photos. We'll arrange for a replacement or full refund at no cost to you."
    },
    {
        question: "Can I track my order?",
        answer: "Yes, once your order ships, you'll receive a tracking number via email. You can use this to monitor your package's progress on our shipping partner's website."
    },
    {
        question: "Do you have a physical store?",
        answer: "Currently, we operate online only, but we do participate in select craft fairs and art shows. Follow our newsletter or social media for upcoming event announcements."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and other digital payment methods through our secure checkout process."
    },
    {
        question: "How do I know what size to order?",
        answer: "Each product page includes detailed dimensions and size comparisons. If you're unsure, feel free to contact our customer service team for guidance on selecting the right size for your needs."
    }
];

export default function FAQ() {
    const [openItems, setOpenItems] = useState<number[]>([]);

    const toggleItem = (index: number) => {
        setOpenItems(prev => 
            prev.includes(index) 
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    return (
        <div>
            <Head title="Frequently Asked Questions" />
            <Navbar />
            
            
            {/* Hero Banner */}
            <div className="relative h-[400px] md:h-[420px] overflow-hidden">
                                <img src="/inspire-1.jpg" alt="FAQ" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center">
                    <div className="max-w-6xl w-full mx-auto px-4 transform translate-y-12 md:translate-y-16">
                        <h1 className="text-4xl md:text-5xl text-white font-semibold uppercase tracking-wide">FREQUENTLY ASKED QUESTIONS</h1>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto py-16 px-4">
                <div className="text-center mb-12">
                    <p className="text-lg text-gray-700">
                        Find answers to common questions about our ceramics, shipping, and policies.
                    </p>
                </div>
                    
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="divide-y divide-gray-200">
                        {faqData.map((item, index) => (
                            <div key={index} className="p-6">
                                <button
                                    className="flex justify-between items-center w-full text-left focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-lg"
                                    onClick={() => toggleItem(index)}
                                >
                                    <h3 className="text-xl font-medium pr-4">
                                        {item.question}
                                    </h3>
                                    {openItems.includes(index) ? (
                                        <ChevronUp className="h-5 w-5 text-gray-500 shrink-0" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-gray-500 shrink-0" />
                                    )}
                                </button>
                                {openItems.includes(index) && (
                                    <div className="mt-4 pr-12">
                                        <p className="text-gray-700 leading-relaxed">
                                            {item.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                    
                <div className="mt-12 text-center">
                    <div className="bg-gray-50 rounded-lg p-8">
                        <h3 className="text-2xl font-medium mb-3">Still have questions?</h3>
                        <p className="text-gray-700 mb-6 leading-relaxed">
                            Can't find what you're looking for? Our customer service team is here to help.
                        </p>
                        <a 
                            href="/contact" 
                            className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                        >
                            Contact Us
                        </a>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}