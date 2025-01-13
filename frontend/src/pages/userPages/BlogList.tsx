import React, { useEffect, useState } from 'react';
import LegalFooter from '../../layout/footer';
import { BlogListing } from '../../components/BlogListing';
import { useDispatch } from 'react-redux';
import { BlogType } from '../../utils/type/lawyerType';
import { AppDispatch } from '../../services/store/store';
import { fetchAllBlog } from '../../services/store/features/userServices';
import Navbar from '../../layout/Navbar';

const Blogs: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [blogs, setBlogs] = useState<BlogType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [lawyerPerPage] = useState<number>(6);

    const fetchBlogs = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const response = await dispatch(fetchAllBlog({
                currentPage,
                limit: lawyerPerPage,
            })).unwrap();

            setBlogs(prev => {
                // Filter out duplicates based on _id
                const newBlogs = response.result.filter(
                    (newBlog: BlogType) => !prev.some(existingBlog => existingBlog._id === newBlog._id)
                );
                return [...prev, ...newBlogs];
            });


            setHasMore(response.hasMore);
        } catch (error) {
            console.error("Failed to fetch blogs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, [currentPage]);

    const handleLoadMore = async () => {
        setCurrentPage(prev => prev + 1);
    };

    return (
        <div>
            <Navbar />
            <BlogListing
                blogs={blogs}
                who='user'
                loading={loading}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
            />
            <LegalFooter />
        </div>
    );
};

export default Blogs;