import React, {useEffect} from "react";

const useAnimationFrame = (callback:Function) => {
    const requestRef:React.MutableRefObject<number> = React.useRef(0);
    const previousTimeRef:React.MutableRefObject<number|undefined> = React.useRef();

    const animate = (time:number) => {
        if (previousTimeRef.current != undefined) {
            const deltaTime = time - previousTimeRef.current;
            callback(deltaTime)
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    }

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);
}

export default useAnimationFrame
