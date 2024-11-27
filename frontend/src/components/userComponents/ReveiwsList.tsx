import { Avatar, Card, CardBody, CardHeader, Skeleton } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactStars from "react-stars";
import { AppDispatch, RootState } from "../../services/store/store";
import { Review } from "../../utils/type/userType";
import { getReviews } from "../../services/store/features/userServices";
import CustomToast from "./CustomToast";
import { toast } from "sonner";

export function ReviewCard({ appointmentId }: { appointmentId: string | undefined }) {
    const dispatch: AppDispatch = useDispatch();
    const [review, setReview] = useState<Review[] | null>([]);
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        const fetchLawyerData = async () => {
            if (appointmentId) {
                try {
                    setLoading(true)
                    const response = await dispatch(getReviews(appointmentId)).unwrap();
                    setReview(response.result);
                    setLoading(false)
                } catch (error: any) {
                    toast(<CustomToast message={error || error.message} type="error" />);
                    console.error('Error fetching lawyer data:', error);
                } finally {
                    setLoading(false)
                }
            }
        };
        fetchLawyerData();
    }, [appointmentId]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 items-center justify-center">
            {loading ? (
                // Show shimmer while loading
                Array(6)
                    .fill(null)
                    .map((_, idx) => (
                        <Card key={idx} className="p-3 shadow-lg">
                            <CardHeader className="flex items-center gap-3 pb-4">
                                <Skeleton className="rounded-full h-12 w-1/4" />
                                <div className="flex flex-col w-full">
                                    <Skeleton className="rounded-lg h-6 w-full mb-2" />
                                    <Skeleton className="rounded-lg h-6 w-full mb-2" />
                                </div>
                            </CardHeader>
                            <CardBody className="text-gray-700">
                                <Skeleton />
                                <Skeleton />
                            </CardBody>
                        </Card>
                    ))
            ) : review?.length === 0 ? (
                <p>No reviews available.</p>
            ) : (
                review?.map((value, key) => (
                    <div key={key} className="flex flex-row">
                        <Card className="p-3 shadow-lg">
                            <CardHeader className="flex items-center gap-3 pb-4">
                                <Avatar
                                    alt={value?.userId?.userName || "User"}
                                />
                                <div className="flex flex-col">
                                    <div className="flex justify-between items-center my-2">
                                        <h5 className="text-lg font-semibold text-blue-gray-800 pr-2">
                                            {value?.userId?.userName || "User"}
                                        </h5>
                                        <span className="text-sm text-gray-600 m-1 text-end">
                                            {new Date(value?.createdAt || "").toLocaleString("en-US", {
                                                year: "2-digit",
                                                month: "short",
                                                day: "2-digit",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                    <ReactStars
                                        edit={false}
                                        count={5}
                                        value={value?.rating || 0}
                                        size={24}
                                        color2="#ffd700"
                                    />
                                </div>
                            </CardHeader>
                            <CardBody className="text-gray-700">
                                <p className="text-sm">{value?.review || "No review provided."}</p>
                            </CardBody>
                        </Card>
                    </div>
                ))
            )}
        </div>

    );
}