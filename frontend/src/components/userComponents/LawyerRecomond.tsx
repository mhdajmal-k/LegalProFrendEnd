import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../services/store/store';
import { topLawyers } from '../../services/store/features/userServices';
import { Lawyer } from '../../utils/type/lawyerType';
import CustomToast from './CustomToast';
import { toast } from 'sonner';
import CommonCard from '../ProfileCard';
import CardSkelton from '../CardSkeltton';

const TopLawyer: React.FC = () => {
    const [lawyers, setLawyers] = useState<Lawyer[]>([]);
    const { loading } = useSelector((state: RootState) => state.user);

    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        const fetchTopLawyers = async () => {
            try {
                const response = await dispatch(topLawyers()).unwrap();
                setLawyers(response.result);
            } catch (error: any) {
                toast(<CustomToast message={error || error.message} type="error" />);
                console.error('Error fetching top lawyers:', error);
            }
        };

        fetchTopLawyers();
    }, [dispatch]);

    return (
        <div className="p-6 m-10">
            <h1 className="text-2xl font-bold mb-6 text-center sm:text-left">
                Our Recommended Lawyers
            </h1>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    Array.from({ length: 3 }).map((_, index) => <CardSkelton key={index} />)
                ) : (
                    lawyers.length > 0 ? (
                        lawyers.map((lawyer) => (
                            <CommonCard key={lawyer._id} lawyer={lawyer} />
                        ))
                    ) : (
                        <p className="text-center font-semibold text-lg col-span-full">
                            No Lawyers Found
                        </p>
                    )
                )}
            </div>
        </div>
    );
};

export default TopLawyer;
