"use client";

import ArticleCard from "@/components/ui/ui-article-card";
import { useEffect, useRef, useState } from "react";
import { callApi } from "@/utils/apiClient";
import Loader from "@/components/core/loader";
import { cn } from "@/utils/cn";
import "./index.scss"; 

interface NewsListingProps {
    options?: { label: string; value: string }[];
    className?: string;
    medias?: any[];
    type?: string;
    endpoint?: string;
    meta?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

const NewsListing: React.FC<NewsListingProps> = ({ options = [], medias = [], meta, className = "", endpoint = "blogs" }) => {
    const [blogList, setBlogList] = useState<any[]>(medias);
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
            const res = await callApi(endpoint, {
                params: { page: nextPage },
            });
            const newBlogs = res.data.medias;
            setBlogList(prev => [...prev, ...newBlogs]);
            setPage(nextPage);
            setTotalPages(res.data.meta.totalPages);
        } catch (error) {
            console.error("Failed to load more blogs:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section data-stagger-motion-observer  className={cn("ui-news-listing", className)}>
            <div className="ui-news-listing__container">
                {
                    blogList.length === 0 && !loading && (
                        <div className="ui-news-listing__empty">
                            <p>No blogs found.</p>
                        </div>
                    )
                }
                <ul className="ui-news-listing__list">
                    {blogList.map((blog: any, index: number) => (
                        <li key={index} className="ui-news-listing__item"  data-stagger-motion-index={1 + index} data-stagger-motion-type="md">
                            <ArticleCard
                                title={blog.title}
                                href={blog.link}
                                label={blog.label}
                                hasImage={false}
                                image={blog.image}
                                isExternal={blog.isExternal}
                                
                            />
                        </li>
                    ))}
                </ul>
                {loading &&
                    <div className="ui-news-listing__loading">
                        <Loader type="dots" />
                    </div>
                }
                <div ref={loaderRef} style={{ height: "1px" }} />
            </div>
        </section>
    )
}

export default NewsListing