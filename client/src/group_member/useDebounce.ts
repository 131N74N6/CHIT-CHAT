import { useEffect, useState } from "react";

export default function useDebounce<T>(delay: number, value: T): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [delay, value]);

    return debouncedValue;
}