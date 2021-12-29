import React, { useState, useEffect } from "react";
import PureCanvas from './pure-canvas'

const Canvas = ({ drawProps }) => {
    const [ctx, setCtx] = useState(false)

    useEffect(() => {
        if (!ctx) return

        drawProps.map((prop) => {

            // ctx.strokeStyle = '#eee';
            // ctx.fillStyle = '#530';
            // ctx.shadowBlur = 20;
            // ctx.shadowColor = '#222';

            let topRightX = 0 + (prop.width / 2);
            let topRightY = -prop.length;
            let topLeftX = 0 - (prop.width / 2);
            let topLeftY = -prop.length;

            let bottomRightX = prop.width / 2;
            let bottomRightY = 0;
            let bottomLeftX = 0 - (prop.width / 2);
            let bottomLeftY = 0;

            ctx.save()

            ctx.translate(prop.x, prop.y);
            ctx.rotate(prop.angle * Math.PI / 180);

            ctx.beginPath();
            ctx.moveTo(topRightX, topRightY);

            const bend = 0.5

            ctx.bezierCurveTo(topRightX, topRightY, (topRightX) + (topRightY / bend), topRightY / 2, bottomRightX, bottomRightY);
            ctx.lineTo(bottomLeftX, bottomLeftY);
            ctx.bezierCurveTo(bottomLeftX, bottomLeftY, (topLeftX) + (topRightY / bend), topRightY / 2, topLeftX, topLeftY);
            //TODO with and withought cerves
            // ctx.lineTo(topLeftX, topLeftY);
            // ctx.lineTo(bottomLeftX, bottomLeftY);
            // ctx.lineTo(bottomRightX, bottomRightY);



            ctx.closePath();
            ctx.stroke();
            ctx.fill();

            ctx.restore();
        })


    })

    return (
        <PureCanvas contextRef={setCtx} />
    )
}

export default Canvas
