import React, { useState, useEffect } from "react";
import PureCanvas, { dimentions } from './pure-canvas'
import { Branch } from '../web-worker/tree-builder.worker'

interface drawProps {
    branches: Array<Branch>

}

const Canvas = ({ drawProps, version, dimentions }: { drawProps: Array<Branch>, version: number, dimentions: dimentions }) => {
    const [ctx, setCtx] = useState<CanvasRenderingContext2D>()

    useEffect(() => {
        if (!ctx || !drawProps) return
        drawProps.map((branch: Branch) => {
            // if (branch.depth == 0) ctx.clearRect(0, 0, 700, 700);//TODO fix size

            ctx.strokeStyle = '#eee';
            ctx.fillStyle = '#530';
            ctx.shadowBlur = 7;
            ctx.shadowColor = '#222';

            let topRightX = 0 + (branch.width / 2);
            let topRightY = -branch.length;
            let topLeftX = 0 - (branch.width / 2);
            let topLeftY = -branch.length;

            let bottomRightX = branch.width / 2;
            let bottomRightY = 0;
            let bottomLeftX = 0 - (branch.width / 2);
            let bottomLeftY = 0;

            ctx.save()

            ctx.translate(branch.x, branch.y);
            ctx.rotate(branch.angle * Math.PI / 180);

            ctx.beginPath();
            ctx.moveTo(topRightX, topRightY);

            const bend = 4

            // ctx.bezierCurveTo(topRightX, topRightY, (topRightX) + (topRightY / bend), topRightY / 2, bottomRightX, bottomRightY);
            // ctx.lineTo(bottomLeftX, bottomLeftY);
            // ctx.bezierCurveTo(bottomLeftX, bottomLeftY, (topLeftX) + (topRightY / bend), topRightY / 2, topLeftX, topLeftY);
            //TODO with and withought cerves
            ctx.lineTo(topLeftX, topLeftY);
            ctx.lineTo(bottomLeftX, bottomLeftY);
            ctx.lineTo(bottomRightX, bottomRightY);

            ctx.closePath();
            ctx.stroke();
            ctx.fill();

            ctx.restore();
        })


    }, [drawProps])


    useEffect(() => {
        console.log(version)
        if (!ctx) return
        ctx.clearRect(0, 0, dimentions.width, dimentions.height);//TODO fix size: ;
    }, [version])


    return (
        <PureCanvas contextRef={setCtx} dimentions={dimentions} />
    )
}

export default Canvas
