import React, { useEffect, useState } from 'react'
import AdminNavbar from '../../layout/AdminNavbar'
import LegalFooter from '../../layout/footer'
import ViewOneBlog from '../../components/ViewOneBlog'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../services/store/store'
import CustomToast from '../../components/userComponents/CustomToast'
import { toast } from 'sonner'
import { BlogType } from '../../utils/type/lawyerType'
import { DeleteBlog, fetchOneBlog } from '../../services/store/features/lawyerServices'
import { Button } from '@nextui-org/react'

const ViewBlog: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { blogId } = useParams()
    const navigate = useNavigate()
    const [blogs, setBlogs] = useState<BlogType>();
    const confirmDelete = () => {
        toast(
            <div>
                <p>Are you sure you want to delete this blog?</p>
                <div className="flex justify-end gap-2 mt-2">
                    <Button
                        size="sm"
                        className="bg-red-600 text-white"
                        onClick={() => {
                            toast.dismiss();
                            handleDelete();
                        }}
                    >
                        Yes, Delete
                    </Button>
                    <Button
                        size="sm"
                        className="bg-gray-300 text-black"
                        onClick={() => toast.dismiss()}
                    >
                        Cancel
                    </Button>
                </div>
            </div>,
            {
                duration: Infinity, // Keep the toast open until dismissed
            }
        );

    };

    const handleDelete = async () => {
        try {
            const response = await dispatch(DeleteBlog(blogId as string)).unwrap();
            toast(<CustomToast message={response.message || "Blog deleted successfully"} type="success" />);
            navigate("/lawyer/blog");
        } catch (error: any) {
            toast(<CustomToast message={error.message || "Failed to delete blog"} type="error" />);
        }
    };

    const handleEdit = () => {
        navigate(`/lawyer/editBlog/${blogId}`);
    };
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await dispatch(fetchOneBlog(blogId as string)).unwrap();
                setBlogs(response.result)
            } catch (error: any) {
                toast(<CustomToast message={error.message || 'Failed to fetch blog'} type="error" />);
            }
        };

        if (blogId) {
            fetchBlog();
        }
    }, [blogId, dispatch]);



    return (
        <div>
            <AdminNavbar />
            <div className="md:max-w-5xl max-w-sm px-10 container mt-5 flex justify-end">
                <div className="flex items-center gap-2">
                    <Button className="bg-red-600 flex" onClick={confirmDelete}>
                        Delete
                    </Button>
                    <Button className="bg-yellow-400 flex" onClick={() => handleEdit()}>Edit</Button>
                </div>
            </div>
            <ViewOneBlog blogs={blogs} />
            <LegalFooter />
        </div >
    )
}

export default ViewBlog
