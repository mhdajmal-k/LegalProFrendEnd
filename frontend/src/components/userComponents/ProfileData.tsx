import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../services/store/store';
import { Button, Input } from '@nextui-org/react';
import { useFormik } from 'formik';
import { FaCirclePlus } from "react-icons/fa6";
import { getUserProfileData, updateUserProfileData } from '../../services/store/features/userServices';
import CustomToast from './CustomToast';
import { toast } from 'sonner';
import { userDataUpdateValidator } from '../../utils/validator/loginValidaotr';

interface FormValues {
    userName: string;
    email: string;
    phoneNumber: string;
    profile_picture?: string;
}

const ProfileData: React.FC = () => {
    const { userInfo, error, loading } = useSelector((state: RootState) => state.user);
    const [editMode, setEditMode] = useState(false);
    const [previewImage, setPreviewImage] = useState<string>("");
    const [userData, setUserData] = useState<any>(null);
    const [image, setImage] = useState<File | null>(null);
    const fileRef = useRef<HTMLInputElement | null>(null);
    const dispatch: AppDispatch = useDispatch();

    const fetchUserData = async () => {
        try {
            const response = await dispatch(getUserProfileData()).unwrap();
            setUserData(response.result);
            // Reset form with new values
            formik.resetForm({
                values: {
                    userName: response.result.userName || '',
                    email: response.result.email || '',
                    phoneNumber: response.result.phoneNumber || '',
                }
            });
        } catch (error: any) {
            toast(<CustomToast message={error || error.message} type="error" />);
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [dispatch]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
        } else {
            setImage(null);
            setPreviewImage('');
        }
    };

    const formik = useFormik({
        initialValues: {
            userName: userData?.userName || '',
            email: userData?.email || '',
            phoneNumber: userData?.phoneNumber || '',
        },
        validationSchema: userDataUpdateValidator,
        enableReinitialize: true, // Enable form reinitialization when initialValues change
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (values: FormValues) => {
            const formData = new FormData();


            // Only append changed values
            Object.entries(values).forEach(([key, value]) => {
                if (value !== userData[key]) {
                    formData.append(key, value as string);
                }
            });

            if (image) {
                formData.append("profilePic", image);
            }

            try {

                const response = await dispatch(updateUserProfileData({
                    profileData: formData,
                })).unwrap();

                if (response.status) {
                    toast(<CustomToast message={response.message} type="success" />);
                    setEditMode(false);
                    // Refresh user data after successful update
                    fetchUserData();
                }
            } catch (error: any) {
                toast(<CustomToast
                    message={error || error.message || 'An error occurred during update'}
                    type="error"
                />);
            }
        },
    });

    const handleEditToggle = () => {
        if (editMode) {
            // Reset form when canceling edit
            formik.resetForm({
                values: {
                    userName: userData?.userName || '',
                    email: userData?.email || '',
                    phoneNumber: userData?.phoneNumber || '',
                }
            });
            setPreviewImage('');
            setImage(null);
        }
        setEditMode(!editMode);
    };

    return (
        <div>
            <div className="mb-4 items-center flex justify-center flex-col">
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden relative cursor-pointer">
                    <img
                        src={previewImage || userData?.profilePicture || 'https://via.placeholder.com/150'}
                        alt="User Avatar"
                        className="w-full h-full object-contain rounded-full"
                        onClick={() => editMode && fileRef.current?.click()}
                    />
                    {editMode && (
                        <div className='absolute bottom-1 right-5'>
                            <FaCirclePlus className='text-primary text-xl' />
                        </div>
                    )}
                </div>

                <input
                    type='file'
                    ref={fileRef}
                    accept='image/*'
                    className='hidden'
                    onChange={handleFileChange}
                    disabled={!editMode}
                />
                <p className='my-5'>Welcome {userData?.userName}.</p>
                <form className='w-full md:w-2/3 pr-0 md:pr-4 md:ml-2 space-y-4 h-full' onSubmit={formik.handleSubmit}>
                    <Input
                        type="text"
                        label="Username"
                        name='userName'
                        size="sm"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={editMode && !!formik.errors.userName && !!formik.touched.userName}
                        value={formik.values.userName}
                        variant={editMode ? "bordered" : "flat"}
                        readOnly={!editMode}
                    />
                    {formik.errors.userName && formik.touched.userName && editMode && (
                        <div className='text-red-500 text-sm'>{formik.errors.userName}</div>
                    )}
                    <Input
                        type="email"
                        label="Email"
                        name='email'
                        size="sm"
                        value={formik.values.email}
                        readOnly
                    />
                    <Input
                        type="tel"
                        label="Phone Number"
                        name='phoneNumber'
                        size="sm"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={editMode && !!formik.errors.phoneNumber && !!formik.touched.phoneNumber}
                        value={formik.values.phoneNumber}
                        variant={editMode ? "bordered" : "flat"}
                        readOnly={!editMode}
                    />
                    {formik.errors.phoneNumber && formik.touched.phoneNumber && editMode && (
                        <div className='text-red-500 text-sm'>{formik.errors.phoneNumber}</div>
                    )}
                    <div className='flex gap-3'>
                        <Button
                            color={editMode ? "default" : "primary"}
                            type="button"
                            className="flex-1"
                            onClick={handleEditToggle}
                        >
                            {editMode ? 'Cancel' : 'Edit'}
                        </Button>
                        {editMode && (
                            <Button
                                color="success"
                                type="submit"
                                className="flex-1"
                                disabled={loading || !formik.dirty}
                            >
                                {loading ? 'Updating...' : 'Update'}
                            </Button>
                        )}
                    </div>
                    {error && <div className="text-red-500 mt-2 text-center">{error}</div>}
                </form>
            </div>
        </div>
    );
};

export default ProfileData;