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
    profilePic?: File | null;
}

const ProfileData: React.FC = () => {
    const { error, loading } = useSelector((state: RootState) => state.user);
    const [editMode, setEditMode] = useState(false);
    const [previewImage, setPreviewImage] = useState<string>("");
    const [userData, setUserData] = useState<any>(null);
    const fileRef = useRef<HTMLInputElement | null>(null);
    const dispatch: AppDispatch = useDispatch();

    const fetchUserData = async () => {
        try {
            const response = await dispatch(getUserProfileData()).unwrap();
            setUserData(response.result);
            formik.resetForm({
                values: {
                    userName: response.result.userName || '',
                    email: response.result.email || '',
                    phoneNumber: response.result.phoneNumber || '',
                    profilePic: null
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
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
            // Set the file in Formik values
            formik.setFieldValue('profilePic', file);
        } else {
            setPreviewImage('');
            formik.setFieldValue('profilePic', null);
        }
    };

    const formik = useFormik<FormValues>({
        initialValues: {
            userName: userData?.userName || '',
            email: userData?.email || '',
            phoneNumber: userData?.phoneNumber || '',
            profilePic: null
        },
        validationSchema: userDataUpdateValidator,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (values: FormValues) => {
            const formData = new FormData();

            // Only append changed text values
            Object.entries(values).forEach(([key, value]) => {
                if (key !== 'profilePic' && value !== userData[key]) {
                    formData.append(key, value as string);
                }
            });

            // Always append the image if it exists in form values
            if (values.profilePic) {
                formData.append("profilePic", values.profilePic);
            }

            try {
                const response = await dispatch(updateUserProfileData({
                    profileData: formData,
                })).unwrap();

                if (response.status) {
                    toast(<CustomToast message={response.message} type="success" />);
                    setEditMode(false);
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
            formik.resetForm({
                values: {
                    userName: userData?.userName || '',
                    email: userData?.email || '',
                    phoneNumber: userData?.phoneNumber || '',
                    profilePic: null
                }
            });
            setPreviewImage('');
        }
        setEditMode(!editMode);
    };

    const isFormChanged = formik.dirty || !!formik.values.profilePic;

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
                                disabled={loading || !isFormChanged}
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