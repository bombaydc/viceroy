"use client";

import ArticleCard from "@/components/ui/ui-article-card";
import FilterTab from "@/components/ui/ui-filter-tab";
import "./index.scss"; 
import { useCallback, useEffect, useRef, useState } from "react";
import { callApi } from "@/utils/apiClient";
import Loader from "@/components/core/loader";
import { cn } from "@/utils/cn"; 

interface ArticleListingProps {
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

const ArticleListing: React.FC<ArticleListingProps> = ({ options = [], medias = [], meta, type = "all", className = "", endpoint = "blogs" }) => {
    const [blogList, setBlogList] = useState<any[]>(medias);
    const [page, setPage] = useState(meta?.page || 1);
    const [totalPages, setTotalPages] = useState(meta?.totalPages || 1);
    const [loading, setLoading] = useState(false);

    const loaderRef = useRef<HTMLDivElement>(null);
    const listingRef = useRef<HTMLElement>(null); 

    const loadMore = useCallback(async () => {
        if (loading || page >= totalPages) return;
        setLoading(true);
        try {
            const nextPage = page + 1;
            const res = await callApi(endpoint, {
                params: { page: nextPage, type },
            });
            const newBlogs = res.data.medias;
            setBlogList(prev => [...prev, ...newBlogs]);
            setPage(nextPage);
            setTotalPages(res.data.meta.totalPages);

            setTimeout(() => {
                if (listingRef.current?.staggerInstance) {
                    listingRef.current?.staggerInstance.retriggerAnimationToNewElement();
                }
            }, 50);
        } catch (error) {
            console.error("Failed to load more blogs:", error);
        } finally {
            setLoading(false);
        }
    }, [endpoint, type, loading, page, totalPages]);

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
    }, [loaderRef, page, loading, totalPages, loadMore]);

    const handleFliter = () => {
        setTimeout(() => {
            if (listingRef.current?.staggerInstance) {
                listingRef.current?.staggerInstance.reInitStaggerElements();
                listingRef.current?.staggerInstance.retriggerAnimation();
            }
        }, 50);
    };

    useEffect(() => {
        handleFliter();
    }, [type]);

    useEffect(() => {
        setBlogList(medias);
        if (meta) {
            setPage(meta.page || 1);
            setTotalPages(meta.totalPages || 1);
        }
    }, [medias, meta]);

    return (
        <section data-stagger-motion-observer ref={listingRef} className={cn("ui-article-listing", className)}>
            <div data-stagger-motion-index={1} data-stagger-motion-type="sm" >
                <FilterTab activeValue={type} options={options} />
            </div>
            <div className="ui-article-listing__container">
                {
                    blogList.length === 0 && !loading && (
                        <div className="ui-article-listing__empty">
                            <p>No blogs found.</p>
                        </div>
                    )
                }
                <ul className="ui-article-listing__list">
                    {blogList.map((blog: any, index: number) => (
                        <li key={index} className="ui-article-listing__item" data-stagger-motion-retrigger-target data-stagger-motion-index={1 + index} data-stagger-motion-type="sm">
                            <ArticleCard
                                title={blog.title}
                                href={blog.link}
                                label={blog.label}
                                hasImage={!!blog.image}
                                image={blog.image}
                                isExternal={blog.isExternal}
                            />
                        </li>
                    ))}
                </ul>
                {loading &&
                    <div className="ui-article-listing__loading">
                        <Loader type="dots" />
                    </div>
                }
                <div ref={loaderRef} style={{ height: "1px" }} />
            </div>
        </section>
    )
}

export default ArticleListing