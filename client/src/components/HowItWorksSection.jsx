import React from 'react';
import { motion } from 'framer-motion';
import { Download, Mic, BarChart } from 'lucide-react';

const HowItWorksSection = () => {
    const steps = [
        {
            icon: <Download className="text-[#00FF94]" size={24} />,
            title: "Connect",
            description: "Install the plugin and link your Microsoft 365 account securely."
        },
        {
            icon: <Mic className="text-[#A855F7]" size={24} />,
            title: "Command",
            description: "Use your voice to describe what you want to do with your data."
        },
        {
            icon: <BarChart className="text-blue-400" size={24} />,
            title: "Visualize",
            description: "Watch as SheetSense builds charts and tables in real-time."
        }
    ];

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#A855F7]/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#00FF94]/10 blur-[120px] rounded-full"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-center mb-16"
                    >
                        From Thought to <span className="text-[#A855F7]">Result</span> in Seconds
                    </motion.h2>

                    <div className="relative">
                        {/* Connecting Line */}
                        <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#00FF94] via-[#A855F7] to-transparent -translate-x-1/2 hidden md:block"></div>

                        <div className="space-y-12">
                            {steps.map((step, index) => (
                                <div key={index} className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                    {/* Content */}
                                    <motion.div
                                        initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.2 }}
                                        className="flex-1 bg-white/[0.03] p-8 rounded-2xl border border-white/5 w-full"
                                    >
                                        <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                                        <p className="text-gray-400">{step.description}</p>
                                    </motion.div>

                                    {/* Icon Node */}
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        viewport={{ once: true }}
                                        className="w-20 h-20 rounded-full bg-[#0A0A0A] border border-white/10 flex items-center justify-center relative z-10 shrink-0"
                                    >
                                        <div className="absolute inset-0 bg-white/5 rounded-full blur-xl"></div>
                                        {step.icon}
                                    </motion.div>

                                    {/* Empty Space for Grid Layout */}
                                    <div className="flex-1 hidden md:block"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
