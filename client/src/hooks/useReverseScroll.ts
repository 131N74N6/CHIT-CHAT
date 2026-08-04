import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from "@tanstack/react-query";
import { useEffect } from "react";

interface IReverseScroll {
    data: any[];
    fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    hasNextPage: boolean;
    initialLoadDoneRef: React.RefObject<boolean>;
    isFetchingNextPage: boolean;
    isFetchingRef: React.RefObject<boolean>;
    isProcessing: boolean;
    previousScrollHeightlRef: React.RefObject<number>;
    scrollContainerRef: React.RefObject<HTMLDivElement | null>;
    topSentinelRef: React.RefObject<HTMLDivElement | null>;
}

export default function useReverseScroll(props: IReverseScroll) {
    // Auto scroll ke bawah saat pertama kali data dimuat
    useEffect(() => {
        if (!props.initialLoadDoneRef.current && props.data.length > 0 && props.scrollContainerRef.current) {
            props.scrollContainerRef.current.scrollTop = props.scrollContainerRef.current.scrollHeight;
            props.initialLoadDoneRef.current = true;
        }
    }, [props.data.length]);

    // Simpan tinggi scroll sebelum fetch data lama
    useEffect(() => {
        if (props.isFetchingNextPage) {
            props.isFetchingRef.current = true;
            if (props.scrollContainerRef.current) {
                props.previousScrollHeightlRef.current = props.scrollContainerRef.current.scrollHeight;
            }
        }
    }, [props.isFetchingNextPage]);

    // scroll restoration: sesuaikan posisi scroll setelah data lama ditambahkan di atas
    useEffect(() => {
        if (props.isFetchingRef.current && !props.isFetchingNextPage) {
            if (props.scrollContainerRef.current) {
                const newScrollHeight = props.scrollContainerRef.current.scrollHeight;
                const heightDiff = newScrollHeight - props.previousScrollHeightlRef.current;

                // dorong scrollTop ke bawah sebesar tinggi elemen baru yang ditambahkan
                props.scrollContainerRef.current.scrollTop += heightDiff;
            }
            props.isFetchingRef.current = false;
        }
    }, [props.data.length, props.isFetchingNextPage]);

    // // intersection observer untuk reverse infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && props.hasNextPage && !props.isFetchingNextPage && !props.isProcessing) {
                props.fetchNextPage();
            }
        }, {
            root: props.scrollContainerRef.current,
            rootMargin: "50px 0px 0px 0px",
            threshold: 0
        });

        if (props.topSentinelRef.current) {
            observer.observe(props.topSentinelRef.current);
        }

        return () => observer.disconnect();
    }, [props.fetchNextPage, props.hasNextPage, props.isFetchingNextPage, props.isProcessing]);
}