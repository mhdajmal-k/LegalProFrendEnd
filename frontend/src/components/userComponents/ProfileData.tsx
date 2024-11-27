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
    phoneNumber?: string;
    profile_picture?: string
}

const ProfileData: React.FC = () => {
    const { userInfo, error, loading } = useSelector((state: RootState) => state.user);
    const [editMode, setEditMode] = useState(false);
    const [previewImage, setPreviewImage] = useState<string>("");
    const [user, setUser] = useState<any>("");
    const [image, setImage] = useState<File | null>(null);
    const fileRef = useRef<HTMLInputElement | null>(null);
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {

        const fetchUserData = async () => {

            try {
                const response = await dispatch(getUserProfileData()).unwrap();
                setUser(response.result);
                console.log(response, "is the response");
            } catch (error: any) {
                toast(<CustomToast message={error || error.message} type="error" />);
                console.error('Error fetching lawyer data:', error);
            }

        };
        fetchUserData();
    }, [dispatch,]);



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
            userName: user?.userName,
            email: '',
            phoneNumber: '',
        },
        validationSchema: userDataUpdateValidator,
        validateOnChange: editMode,
        validateOnBlur: editMode,
        onSubmit: async (values: FormValues) => {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                formData.append(key, value as string);
            });
            if (image) {
                formData.append("profilePic", image);
            }
            setEditMode(false);
            try {
                const response = await dispatch(updateUserProfileData({ profileData: formData, id: userInfo?._id })).unwrap();
                if (response.status) {
                    toast(<CustomToast message={response.message} type="success" />);
                }
            } catch (error: any) {
                toast(<CustomToast message={error || error.message || 'An error occurred during Update password'} type="error" />);
            }
        },

    });

    return (
        <div>
            <div className="mb-4 items-center flex justify-center flex-col">
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden relative cursor-pointer">
                    <img
                        src={previewImage || user?.profilePicture || 'https://via.placeholder.com/150'}
                        alt="User Avatar"
                        className="w-full h-full object-contain rounded-full"
                        onClick={() => fileRef.current?.click()}
                    />
                    <div className='absolute bottom-1 right-5'>
                        <FaCirclePlus className='text-primary text-xl' />
                    </div>
                </div>

                <input type='file' ref={fileRef} accept='image/*' className='hidden' onChange={handleFileChange} />
                <p className='my-5'>Welcome {userInfo?.userName}.</p>
                <form className='w-full md:w-2/3 pr-0 md:pr-4 md:ml-2 space-y-4 h-full' onSubmit={formik.handleSubmit}>
                    <Input
                        type="text"
                        label="Username"
                        name='userName'
                        size="sm"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={editMode && !!formik.errors.userName && !!formik.touched.userName}
                        value={formik.values.userName ?? user?.userName}
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
                        value={user?.email || formik.values.email}
                        readOnly
                    />
                    <Input
                        type="tel"
                        label="Phone Number"
                        name='phoneNumber'
                        size="sm"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={!!formik.errors.phoneNumber && !!formik.touched.phoneNumber}
                        value={user?.phoneNumber ?? formik.values.phoneNumber}
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
                            className=" flex-1"
                            onClick={() => setEditMode((prevEditMode) => !prevEditMode)} // Toggle edit mode
                        >
                            {editMode ? 'Cancel' : 'Edit'} {/* Change button text based on edit mode */}
                        </Button>
                        {editMode && (
                            <Button
                                color="success"
                                type="submit"
                                className="flex-1"
                                disabled={loading}
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
