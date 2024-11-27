import React, { lazy } from 'react'
import Navbar from '../../layout/Navbar'
import LegalFooter from '../../layout/footer'
import HeroSection from '../../components/userComponents/HeroSection'
import AboutUs from '../../components/userComponents/AboutUs'

import UserFeature from "../../components/userComponents/UserFeature"
import LegalServices from '../../components/userComponents/LegalServices'
const TopLawyer = lazy(() => import('../../components/userComponents/LawyerRecomond'))

const Home: React.FC = () => {
    return (
        <div>
            <Navbar />
            <HeroSection />
            <AboutUs />
            <UserFeature />
            <TopLawyer />
            <LegalServices />
            <LegalFooter />

        </div>

    )
}

export default Home