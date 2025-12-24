import React from "react";
import { motion } from "framer-motion";

const testimonials = [
    {
        text: "I got 3 interview calls within a week of creating my profile! The skill verification really helped me stand out to recruiters.",
        image: "https://randomuser.me/api/portraits/women/1.jpg",
        name: "Lakshmi Iyer",
        role: "React Developer",
    },
    {
        text: "Hire In Minutes helped me transition from marketing to product management. The career path guidance was incredibly valuable.",
        image: "https://randomuser.me/api/portraits/men/2.jpg",
        name: "Karthik Reddy",
        role: "Product Manager",
    },
    {
        text: "As a recruiter, this platform cut our hiring time by 60%. The verified candidates are exactly what we were looking for.",
        image: "https://randomuser.me/api/portraits/women/3.jpg",
        name: "Divya Nair",
        role: "HR Manager, TechCorp",
    },
    {
        text: "The skill assessments gave me confidence in my abilities. I landed a job with 40% higher salary than expected!",
        image: "https://randomuser.me/api/portraits/men/4.jpg",
        name: "Arun Kumar",
        role: "Data Scientist",
    },
    {
        text: "We found our entire development team through this platform. The quality of candidates is outstanding.",
        image: "https://randomuser.me/api/portraits/women/5.jpg",
        name: "Priya Menon",
        role: "CTO, StartupXYZ",
    },
    {
        text: "Finally, a platform that values skills over resumes. Got hired within 2 weeks of signing up!",
        image: "https://randomuser.me/api/portraits/women/6.jpg",
        name: "Anjali Krishnan",
        role: "UI/UX Designer",
    },
    {
        text: "The direct access to hiring managers made all the difference. No more waiting in the ATS black hole.",
        image: "https://randomuser.me/api/portraits/men/7.jpg",
        name: "Vijay Subramanian",
        role: "Full Stack Developer",
    },
    {
        text: "As a startup founder, finding pre-vetted talent this quickly was a game-changer for our growth.",
        image: "https://randomuser.me/api/portraits/women/8.jpg",
        name: "Meera Rao",
        role: "Founder, InnovateLabs",
    },
    {
        text: "The platform's AI matching is spot-on. Every job recommendation was relevant to my skills and career goals.",
        image: "https://randomuser.me/api/portraits/men/9.jpg",
        name: "Ravi Shankar",
        role: "DevOps Engineer",
    },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const TestimonialsColumn = (props: {
    className?: string;
    testimonials: typeof testimonials;
    duration?: number;
}) => {
    return (
        <div className={props.className}>
            <motion.div
                animate={{
                    translateY: "-50%",
                }}
                transition={{
                    duration: props.duration || 10,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop",
                }}
                className="flex flex-col gap-6 pb-6"
            >
                {[...new Array(2)].fill(0).map((_, index) => (
                    <React.Fragment key={index}>
                        {props.testimonials.map(({ text, image, name, role }, i) => (
                            <div className="p-10 rounded-3xl border border-slate-100 shadow-xl shadow-blue-500/5 bg-white max-w-xs w-full" key={i}>
                                <div className="text-slate-700 leading-relaxed mb-4">{text}</div>
                                <div className="flex items-center gap-3 mt-auto">
                                    <img
                                        width={40}
                                        height={40}
                                        src={image}
                                        alt={name}
                                        className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-500/20"
                                    />
                                    <div className="flex flex-col">
                                        <div className="font-bold text-slate-900 leading-5">{name}</div>
                                        <div className="text-sm text-slate-500 leading-5 mt-1">{role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </motion.div>
        </div>
    );
};

export const Testimonials = () => {
    return (
        <section className="min-h-screen flex flex-col justify-center bg-slate-50 py-24 relative overflow-hidden">
            <div className="container relative z-10 mx-auto px-4 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center justify-center max-w-[640px] mx-auto mb-12"
                >
                    <div className="flex justify-center mb-6">
                        <span className="bg-blue-100 text-blue-600 py-1 px-4 rounded-full text-sm font-semibold border border-blue-200">
                            Testimonials
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-center text-slate-900 mb-6">
                        What our users say
                    </h2>
                    <p className="text-center text-lg text-slate-600 max-w-2xl">
                        Real stories from job seekers and recruiters who found success on our platform.
                    </p>
                </motion.div>

                <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] maxHeight-[740px] overflow-hidden h-[600px]">
                    <TestimonialsColumn testimonials={firstColumn} duration={15} />
                    <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
                    <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
                </div>
            </div>
        </section>
    );
};
