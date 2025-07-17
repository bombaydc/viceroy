"use client";

import ArticleCard from "@/components/ui/ArticleCard";
import FilterTab from "@/components/ui/FilterTab";
import "./index.scss";
import { formateDate } from "@/utils/formateDate";
import { useCallback, useEffect, useRef, useState } from "react";
import { callApi } from "@/utils/apiClient";
import Loader from "@/components/core/loader";

interface BlogListingProps {
    options: { label: string; value: string }[];
    blogs?: any[];
    type?: string;
    meta?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

const BlogListing: React.FC<BlogListingProps> = ({ options = [], blogs = [], meta, type = "all" }) => {
    const [blogList, setBlogList] = useState<any[]>(blogs);
    const [page, setPage] = useState(meta?.page || 1);
    const [totalPages, setTotalPages] = useState(meta?.totalPages || 1);
    const [loading, setLoading] = useState(false);

    const loaderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (loading || page >= totalPages) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadMore();
            }
        }, {
            rootMargin: "200px",
        });

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [loaderRef, page, loading, totalPages]);

    const loadMore = async () => {
        if (loading || page >= totalPages) return;
        setLoading(true);
        try {
            const nextPage = page + 1;
            const res = await callApi("blogs", {
                params: { page: nextPage, type },
            });
            const newBlogs = res.data.blogs;
            setBlogList(prev => [...prev, ...newBlogs]);
            setPage(nextPage);
            setTotalPages(res.data.meta.totalPages);
        } catch (error) {
            console.error("Failed to load more blogs:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchInitialBlogs = useCallback(async () => {
        setLoading(true);

        try {
            const res = await callApi("blogs", { params: { page: 1, type } });
            setBlogList(res.data.blogs);
            setPage(1);
            setTotalPages(res.data.meta.totalPages);
        } catch (err) {
            console.error("Error fetching initial blogs:", err);
        } finally {
            setLoading(false);
        }
    }, [type]);

    useEffect(() => {
        fetchInitialBlogs();
    }, [type]);

    return (
        <section className="ui-blog-listing">
            <FilterTab activeValue={type} options={options} />
            <div className="ui-blog-listing__container">
                {
                    blogList.length === 0 && !loading && (
                        <div className="ui-blog-listing__empty">
                            <p>No blogs found.</p>
                        </div>
                    )
                }
                <ul className="ui-blog-listing__list">
                    {blogList.map((blog: any, index: number) => (
                        <li key={index} className="ui-blog-listing__item">
                            <ArticleCard
                                title={blog.title}
                                href={`/blogs/${blog.slug}`}
                                label={`${formateDate(blog.createdAt)} • ${blog.publisher}`}
                                image={blog.desktopimage?.url ?? ""}
                            />
                        </li>
                    ))}
                </ul>
                {loading &&
                    <div className="ui-blog-listing__loading">
                        <Loader type="dots" />
                    </div>
                }
                <div ref={loaderRef} style={{ height: "1px" }} />
            </div>
        </section>
    )
}

export default BlogListing