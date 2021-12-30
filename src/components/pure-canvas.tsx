import { memo } from "react";

const PureCanvas = memo<{ contextRef: Function }>(
    ({ contextRef }) => {
        return (
            <canvas width="700" height="700"
                ref={node => node ? contextRef(node.getContext('2d')) : null}
            />
        )
    }, () => true)

export default PureCanvas
