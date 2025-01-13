/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Button,
    Card,
    CardBody,
    Input,
    Textarea
} from '@nextui-org/react';
import { toast } from 'sonner';
import { AppDispatch } from '../../services/store/store';
import { editBlog, fetchOneBlog } from '../../services/store/features/lawyerServices';
import CustomToast from '../../components/userComponents/CustomToast';
import AdminNavbar from '../../layout/AdminNavbar';
import LegalFooter from '../../layout/footer';


const EditBlogPage: React.FC = () => {

    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const { blogId } = useParams();

    // State for form fields
    const [articleName, setArticleName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                const response = await dispatch(fetchOneBlog(blogId as string)).unwrap();
                const blog = response.result;
                setArticleName(blog.title || '');
                setDescription(blog.content || '');
                setCategory(blog.category || '');
                if (blog.image) {
                    setPreviewImage(blog.image);
                }
            } catch (error: any) {
                toast(<CustomToast
                    message={error.message || "Failed to fetch blog"}
                    type="error"
                />);
                navigate('/yourBlog');
            }
        };

        if (blogId) {
            fetchBlogData();
        }
    }, [blogId, dispatch, navigate]);


    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };


    const handleRemoveImage = () => {
        if (previewImage) {
            URL.revokeObjectURL(previewImage);
        }
        setSelectedImage(null);
        setPreviewImage(null);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {


            const formData = new FormData();
            formData.append('title', articleName);
            formData.append('content', description);
            formData.append('category', category);

            if (selectedImage) {
                formData.append('image', selectedImage);
            }


            const response = await dispatch(
                editBlog({
                    id: blogId as string,
                    updateData: formData
                })
            ).unwrap();


            toast(<CustomToast
                message={response.message || "Blog updated successfully"}
                type="success"
            />);


            navigate(`/lawyer/blog/`);
        } catch (error: any) {


            toast(<CustomToast
                message={error.message || "Failed to update blog"}
                type="error"
            />);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <AdminNavbar />
            <div className='container'>
                <Card className="w-full max-w-4xl mx-auto p-4 my-5">
                    <h1 className='text-2xl font-bold'>Edit Blog</h1>
                    <h4 className='text-base mt-2'>Update your blog details</h4>

                    <CardBody>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="articleName" className="text-sm font-medium">
                                    <label>Main Title</label>
                                </label>
                                <Input
                                    id="articleName"
                                    value={articleName}
                                    onChange={(e) => setArticleName(e.target.value)}
                                    placeholder="Enter article name"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="description" className="text-sm font-medium">
                                    Description
                                </label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter article description"
                                    required
                                />
                            </div>

                            <div className='m-4'>
                                <input
                                    type='file'
                                    onChange={handleImageChange}
                                    accept='image/*'
                                />
                            </div>


                            {previewImage && (
                                <div style={{ marginTop: '10px' }}>
                                    <img
                                        src={previewImage}
                                        alt='Selected'
                                        className='w-24 h-24 object-contain border'
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="mt-2 text-red-500 text-sm flex items-center space-x-1"
                                    >
                                        Remove Image
                                    </button>
                                </div>
                            )}



                            <label className="block text-sm font-medium mb-2">Category</label>

                            <div className='w-2/3'>
                                <label>Blog Category</label>
                                <Input
                                    className='my-2'
                                    placeholder="Enter your Blog Category (e.g., Real Estate, Family Law)"
                                    variant="bordered"
                                    name="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                />
                            </div>


                            <Button
                                color="primary"
                                type="submit"
                                className="w-full"
                                isLoading={isLoading}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Updating...' : 'Update Blog'}
                            </Button>
                        </form>
                    </CardBody>
                </Card>
            </div>
            <LegalFooter />
        </div>
    );
};

export default EditBlogPage;