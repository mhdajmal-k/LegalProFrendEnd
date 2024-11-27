

import React from "react"
import { motion } from "framer-motion"
import { Gavel, Search, MessageCircle, CheckCircle } from 'lucide-react'
import { Card, CardBody, CardHeader } from "@nextui-org/react"
import LegalFooter from "../layout/footer"
import Navbar from "../layout/Navbar"

const AboutUs: React.FC = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    }

    return (
        <>

            <Navbar />
            <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
                <motion.div className=" sm:max-w-4xl mx-auto" {...fadeIn}>
                    <header className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">About Us</h1>
                        <p className="text-xl text-gray-600">Your Trusted Partner for Expert Legal Support</p>
                    </header>

                    <motion.section className="mb-12" {...fadeIn}>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Journey</h2>
                        <Card>
                            <CardBody className="p-6">
                                <p className="text-gray-700">
                                    The idea for <strong className="text-primary">The Legal Pro</strong> was born from a simple belief:
                                    access to trusted legal support should be straightforward and stress-free.
                                    From a small concept of empowering individuals with accessible legal solutions,
                                    we have grown into a thriving platform where thousands connect with seasoned advocates.
                                </p>
                            </CardBody>
                        </Card>
                    </motion.section>

                    <motion.section className="mb-12 bg-white " {...fadeIn}>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Choose Us?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { title: "Trusted Professionals", description: "Our lawyers are thoroughly vetted to ensure you receive expert advice.", icon: <Gavel className="h-6 w-6 text-primary" /> },
                                { title: "Seamless Experience", description: "From finding the right advocate to scheduling appointments, we make the process simple and efficient.", icon: <CheckCircle className="h-6 w-6 text-primary" /> },
                                { title: "Diverse Specializations", description: "Corporate law, family law, intellectual property, and beyond—our experts cover it all.", icon: <Search className="h-6 w-6 text-primary" /> },
                                { title: "Client-Centric Approach", description: "Personalized assistance tailored to meet your specific legal needs.", icon: <MessageCircle className="h-6 w-6 text-primary" /> }
                            ].map((item, index) => (
                                <Card key={index} className="bg-primary">
                                    <CardHeader className="flex flex-row items-center gap-4  ">
                                        {item.icon}
                                        <h4 className="text-white text-center font-bold">{item.title}</h4>
                                    </CardHeader>
                                    <CardBody>
                                        <p className="text-white">{item.description}</p>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    </motion.section>

                    <motion.section className="mb-12" {...fadeIn}>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
                        <Card>
                            <CardBody className="p-6">
                                <p className="text-gray-700">
                                    At <strong className="text-primary">The Legal Pro</strong>, our mission is to transform global legal access
                                    by connecting users with trusted professionals. With a secure platform,
                                    modern technology, and a client-first mindset, we ensure personalized and reliable
                                    legal support for everyone.
                                </p>
                            </CardBody>
                        </Card>
                    </motion.section>

                    <motion.section className="mb-12" {...fadeIn}>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">How It Works</h2>
                        <Card>
                            <CardBody className="p-6">
                                <ol className="list-decimal list-inside space-y-4">
                                    <li className="text-gray-700"><strong className="text-primary">Search:</strong> Enter your legal needs, and our system will match you with experienced advocates in your area.</li>
                                    <li className="text-gray-700"><strong className="text-primary">Consult:</strong> Choose from a list of verified lawyers and schedule a consultation at your convenience.</li>
                                    <li className="text-gray-700"><strong className="text-primary">Resolve:</strong> Get expert advice, take informed decisions, and move forward with confidence.</li>
                                </ol>
                            </CardBody>
                        </Card>
                    </motion.section>


                </motion.div>
            </div>
            <LegalFooter />
        </>
    )
}

export default AboutUs

