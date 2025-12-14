import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin } from 'lucide-react';

const ContactSection = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const subject = `Contact from SheetSense: ${formData.name}`;
        const body = `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`;
        window.location.href = `mailto:tahabutt5238@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <section className="py-24 bg-white/[0.02]">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid md:grid-cols-2 gap-20">
                    {/* Info Side */}
                    <div className="space-y-12">
                        <div>
                            <motion.h2
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="text-5xl font-bold mb-6 font-outfit"
                            >
                                Get in Touch
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="text-xl text-gray-400 leading-relaxed"
                            >
                                Have questions about enterprise deployment or custom integrations? We're here to help.
                            </motion.p>
                        </div>

                        <div className="space-y-8">
                            <ContactItem
                                icon={<Mail size={20} />}
                                title="Email"
                                content={
                                    <>
                                        <p>tahabutt5238@gmail.com</p>
                                        <p>awaiskamboh0810@gmail.com</p>
                                    </>
                                }
                                delay={0.4}
                            />
                            <ContactItem
                                icon={<MapPin size={20} />}
                                title="HQ"
                                content="Riphah International University, Lahore"
                                delay={0.6}
                            />
                        </div>
                    </div>

                    {/* Form Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="bg-white/[0.03] p-10 rounded-[32px] border border-white/10"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <InputField
                                label="Name"
                                name="name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            <InputField
                                label="Work Email"
                                name="email"
                                type="email"
                                placeholder="john@company.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="4"
                                    required
                                    placeholder="Tell us about your needs..."
                                    className="w-full bg-black/20 text-white rounded-xl border border-white/10 focus:border-[#00FF94] focus:outline-none p-4 transition-colors resize-none placeholder-white/20"
                                ></textarea>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full bg-[#00FF94] text-black py-4 rounded-2xl font-bold text-lg hover:shadow-[0_0_20px_-5px_#00FF94] transition-all"
                            >
                                Send Message
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

const ContactItem = ({ icon, title, content, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        className="flex gap-4"
    >
        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#00FF94] shrink-0">
            {icon}
        </div>
        <div>
            <h4 className="text-sm text-gray-500 mb-1">{title}</h4>
            <div className="font-semibold text-lg">{content}</div>
        </div>
    </motion.div>
);

const InputField = ({ label, name, type = "text", placeholder, value, onChange }) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            required
            placeholder={placeholder}
            className="w-full bg-black/20 text-white rounded-xl border border-white/10 focus:border-[#00FF94] focus:outline-none p-4 transition-colors placeholder-white/20"
        />
    </div>
);

export default ContactSection;
