import { useEffect } from 'react';

interface ScrollToTopProps {
    trigger: any; // Can be page state, route, or any value that changes on navigation
}

export function ScrollToTop({ trigger }: ScrollToTopProps) {
    useEffect(() => {
        // Scroll to top smoothly when trigger changes
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }, [trigger]);

    return null; // This component doesn't render anything
}
