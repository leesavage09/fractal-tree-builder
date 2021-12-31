import { memo } from "react";

export interface dimentions { width: number, height: number }

const PureCanvas = memo<{ contextRef: Function, dimentions: dimentions }>(
    ({ contextRef, dimentions }) => {
        return (
            <canvas width={dimentions.width} height={dimentions.height}
                ref={node => node ? contextRef(node.getContext('2d')) : null}
            />
        )
    }, (prevProps, nextProps) => {
        if (prevProps.dimentions.width != nextProps.dimentions.width || prevProps.dimentions.height != nextProps.dimentions.height) {
            return false
        }
        else {
            return true
        }
    })

export default PureCanvas
