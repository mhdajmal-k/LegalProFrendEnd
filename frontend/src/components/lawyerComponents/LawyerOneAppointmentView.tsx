import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../services/store/store';
import { Appointment } from '../../utils/type/Appointment';
import CustomToast from '../../components/userComponents/CustomToast';
import { toast } from 'sonner';
import { Button, Card, CardBody, CardHeader, Image, Skeleton } from '@nextui-org/react';
import { Clock, IndianRupee, User, X, Video } from 'lucide-react';
import { useSocket } from "../../contextAPI/useSocket";
import { SlCalender } from "react-icons/sl";
import { LawyerCancelAppointmentDataById, LawyerFetchAppointmentDataById } from '../../services/store/features/lawyerServices';
import VideoCallPage from '../../pages/userPages/UserVideoCall';

interface ViewOneAppointmentProps {
    AppointmentId: string | undefined;

}

const ViewOneAppointmentDetails: React.FC<ViewOneAppointmentProps> = ({ AppointmentId }) => {
    const { socket } = useSocket();
    const [appointment, setAppointments] = useState<Appointment>();
    const dispatch: AppDispatch = useDispatch();
    const { loading } = useSelector((state: RootState) => state.lawyer)
    const [showVideoCall, setShowVideoCall] = useState(false);
    const handleVideoCallClick = () => {

        socket?.emit("joinRoom", AppointmentId);
        setShowVideoCall(true)
    }
        ;
    const fetchAppointment = async (appointmentId: string | undefined) => {
        try {
            const response = await dispatch(LawyerFetchAppointmentDataById(appointmentId)).unwrap();
            setAppointments(response.result);
        } catch (error: any) {
            toast(<CustomToast message={error.message || 'Error fetching appointments'} type="error" />);
        }
    };
    useEffect(() => {
        fetchAppointment(AppointmentId);
    }, [dispatch, AppointmentId]);

    const handileCancel = (appointmentId: string | undefined) => {
        const today = new Date();
        const todayString = today.toISOString().split("T")[0];


        const fullDateTimeString = `${todayString} ${appointment?.appointmentTime}`;
        const appointmentTime = new Date(fullDateTimeString).getTime();
        const currentTime = Date.now();
        const oneHourInMs = 60 * 60 * 1000;
        if (appointmentTime - currentTime <= oneHourInMs) {
            toast(
                <span className="text-yellow-700">
                    <strong>Reminder:</strong> Cancellations are not allowed within 1 hour of the consultation time.
                </span>,
                { duration: 3000 }
            );
            return;
        }
        toast(
            <div >
                <p>Are you sure you want  Cancel this Appointment?</p>
                <div className="flex space-x-2 mt-3 ">
                    <button
                        className=" bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                        onClick={async () => {

                            const response = await dispatch(LawyerCancelAppointmentDataById(appointmentId)).unwrap();
                            if (response.status) {
                                fetchAppointment(AppointmentId);
                                toast(<CustomToast message={response.message || 'Error fetching appointments'} type="success" />);



                            } else {
                                toast(<CustomToast message={response.message || 'Error fetching appointments'} type="error" />);

                            }
                        }}
                    >
                        Confirm
                    </button>
                    <button
                        className="bg-gray-300 text-gray-700 px-3 py-1 rounded-md"
                        onClick={() => toast.dismiss()}
                    >
                        Cancel
                    </button>
                </div>
            </div>,
            {
                duration: 1500,
            }
        );

    }
    return (
        <div className="container sm:min-h-screen p-6 md:p-8 lg:p-8 bg-gray-50">
            {showVideoCall ? (
                <VideoCallPage
                    appointmentId={appointment?._id}
                    // lawyerId={appointment?.lawyerId?._id}
                    who="lawyer"
                // videoCallLink={appointment?.videoCallLink}
                />
            ) : (<div>
                <h1 className="text-3xl font-bold text-center mb-5">Appointment Details</h1>

                <div className="flex flex-col md:flex-row gap-5 items-start">
                    <div className="w-full md:w-2/3 mx-auto">
                        <Card className="w-full shadow-lg rounded-lg overflow-hidden">
                            <CardHeader className="bg-primary p-4">
                                <h2 className="text-xl font-semibold text-white">Appointment Overview</h2>
                            </CardHeader>
                            <CardBody className="p-6">
                                <div className=" grid gap-4">

                                    <div className="flex items-center text-lg">
                                        <SlCalender className="mr-2 h-5 w-5 text-blue-500" />
                                        <strong> Date: </strong>
                                        {loading ? (
                                            <Skeleton className="rounded-lg h-6 w-60 ml-2" />
                                        ) : appointment?.appointmentDate ? (
                                            new Date(appointment?.appointmentDate).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })
                                        ) : (
                                            'Date not available'
                                        )}
                                    </div>
                                    <div className="flex items-center text-lg">
                                        <Clock className="mr-2 h-5 w-5 text-blue-500" />
                                        <span>
                                            <strong>Time:</strong>{' '}
                                            {loading ? (
                                                <Skeleton className="rounded-lg h-6 w-40 ml-2" />
                                            ) : (
                                                <mark>{appointment?.appointmentTime || 'N/A'}</mark>
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-lg">
                                        <IndianRupee className="mr-2 h-5 w-5 text-green-500" />
                                        <span>
                                            <strong>Consultation Fee:</strong>{' '}
                                            {loading ? (
                                                <Skeleton className="rounded-lg h-6 w-40 ml-2" />
                                            ) : (
                                                `₹${appointment?.consultationFee || 'N/A'}`
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex items-start w-3/5">
                                        <div className="w-2/3">
                                            <div className="mb-2">
                                                <User className="inline-block mr-2 h-5 w-5 text-gray-600" />
                                                <span className="text-lg font-semibold">
                                                    {loading ? (
                                                        <Skeleton className="rounded-lg h-6 w-60" />
                                                    ) : (
                                                        `Client: ${appointment?.userId.userName || 'N/A'}`
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        {appointment?.userId?.profilePicture && (
                                            <div className="w-1/3">
                                                {loading ? (
                                                    <Skeleton className="rounded-lg h-20 w-20" />
                                                ) : (
                                                    <Image
                                                        src={appointment?.userId?.profilePicture || '/placeholder.png'}
                                                        alt="Client"
                                                        className="rounded-lg object-cover h-[80%]"
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className='w-1/2'>
                                        <p className=" border-gray-300 w-full rounded font-semibold ">  Case Description:</p>
                                        <h6>         {appointment?.description || ''}</h6>
                                        {appointment?.imageUrl && (
                                            <div>
                                                <a href={appointment?.imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mt-1 block">
                                                    View Image
                                                </a>
                                                <Image
                                                    src={appointment?.imageUrl || '/placeholder.png'}
                                                    alt="Lawyer profile"
                                                    className="rounded-lg  object-cover h-[80%]"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="md:flex flex-col gap-2 justify-between">
                                        <div>
                                            <span className="text-lg font-semibold">Total:</span>
                                            <span className="text-2xl font-bold text-gray-800">   {loading ? (
                                                <Skeleton className="rounded-lg h-6 w-40 mt-2 inline-block" />
                                            ) : (
                                                `₹${appointment?.consultationFee || 'N/A'}`
                                            )}</span>
                                        </div>
                                        {appointment?.status !== "Cancelled" ? (<div className='flex flex-col lg:flex lg:flex-row gap-3 lg:gap-6'>
                                            <div className=' flex flex-col gap-3 sm:flex sm:flex-row sm:gap-6'>

                                                <Button className='bg-red-700 text-white rounded-md' onClick={() => handileCancel(appointment?._id)}>     <X className="h-4 w-4" />Cancel Appointment</Button>
                                                <Button className='bg-green-700 px-10 rounded-md' onClick={handleVideoCallClick}>
                                                    <Video className="h-4 w-4" />Make Call
                                                </Button>                                                                    </div> </div>) : (<div>
                                                    <h6>Appointment :<strong className='text-red-600'> {appointment?.status}</strong></h6>
                                                </div>)}
                                    </div>
                                    <div className="text-right text-sm text-gray-500">
                                        Created on: {new Date(appointment?.createdAt || '').toLocaleString()}
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>)}
        </div>
    );
};

export default ViewOneAppointmentDetails;
