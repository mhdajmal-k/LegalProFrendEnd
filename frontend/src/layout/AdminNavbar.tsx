import React, { useState } from 'react';
import Logo from '../assets/images/logo.png';
import { Button } from "@nextui-org/button";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../services/store/store';



const AdminNavbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    // const dispatch: AppDispatch = useDispatch()
    const { lawyerInfo } = useSelector((state: RootState) => state.lawyer)
    return (
        <nav className="bg-primary p-2 ">
            <div className="max-w-7xl mx-auto flex justify-between items-center ">
                {/* Logo and Title */}
                <div className="flex items-center mx-2.5  m:items-center m:space-x-2  ">
                    <img src={Logo} className='w-10' alt="logo" />

                    <Link to="/lawyer" className=" ml-3 first-line:font-bold text-white">
                        Legal_Pro
                    </Link>


                </div>


                <div className="hidden md:flex space-x-6 text-white">
                    <Link to="/lawyer" className="hover:text-black">
                        HOME
                    </Link>
                    <Link to="/lawyer/blog" className="hover:text-black">
                        BLOG
                    </Link>
                </div>

                <div>
                    {lawyerInfo?.userName ? (
                        <div className='flex items-center space-x-4'>
                            <div>
                                <span className="text-sm font-medium">{lawyerInfo.userName}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="sm:flex sm:space-x-4 hidden">
                            <Button size="sm" className="bg-secondary text-black font-bold hover:bg-secondary-50">
                                signup
                            </Button>
                            <Button size="sm" className="bg-secondary text-black font-bold hover:bg-secondary-50">
                                <Link to="/lawyer/signup" className='uppercase'>
                                    Become a Lawyer
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>


                <div className="md:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="focus:outline-none"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                            />
                        </svg>
                    </button>
                </div>
            </div>


            {isOpen && (
                <div className="md:hidden mt-4 space-y-2 text-white">


                    <Link to="/blogs" className="block hover:underline">
                        BLOG
                    </Link>
                    <div>
                        <Button size='sm' className="bg-secondary text-black font-bold hover:bg-slate-200">
                            <Link to="/">
                                Back to User                            </Link>
                        </Button>
                        <Button size='sm' className="bg-secondary text-black font-bold hover:bg-slate-200 ml-2">
                            <Link to="/lawyer/signup" className='uppercase'>
                                Become a Lawyer
                            </Link>
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default AdminNavbar;
