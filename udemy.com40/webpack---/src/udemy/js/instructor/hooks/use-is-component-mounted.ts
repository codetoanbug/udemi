import {useEffect, useRef} from 'react';

export function useIsComponentMounted() {
    const isComponentMounted = useRef(false);
    useEffect(() => {
        isComponentMounted.current = true;
        return () => {
            isComponentMounted.current = false;
        };
    }, []);
    return isComponentMounted;
}
