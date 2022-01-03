import { useState, useEffect } from "react";
import PureCanvas, { dimentions } from './pure-canvas'
import { Branch } from '../web-worker/tree-builder.worker'

export type { dimentions } from './pure-canvas'

export interface DrawSettings {
    strokeStyle: string
    fillStyle: string
    shadowBlur: number
    shadowColor: string
    bend: number | undefined
}

const Canvas = ({ drawProps, drawSettings, version, dimentions }: { drawProps: Array<Branch>, drawSettings: DrawSettings, version: number, dimentions: dimentions }) => {
    const [ctx, setCtx] = useState<CanvasRenderingContext2D>()

    useEffect(() => {
        if (!ctx) return
        ctx.strokeStyle = drawSettings.strokeStyle 
        ctx.fillStyle = drawSettings.fillStyle 
        ctx.shadowBlur = drawSettings.shadowBlur 
        ctx.shadowColor = drawSettings.shadowColor 
        const bend = drawSettings.bend

        drawProps.map((branch: Branch) => {
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
            if (bend) {
                ctx.quadraticCurveTo(
                    bottomRightX-bend, topRightY/2, 
                  bottomRightX, bottomRightY);

                  ctx.lineTo(bottomLeftX, bottomLeftY);

                  ctx.quadraticCurveTo(
                    topLeftX-bend, topLeftY/2, 
                    topLeftX, topLeftY);
            }
            else {
                ctx.lineTo(topLeftX, topLeftY);
                ctx.lineTo(bottomLeftX, bottomLeftY);
                ctx.lineTo(bottomRightX, bottomRightY);
            }
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
            ctx.restore();
        })


    }, [drawProps])


    useEffect(() => {
        if (!ctx) return
        ctx.clearRect(0, 0, dimentions.width, dimentions.height);
    }, [version])


    return (
        <PureCanvas contextRef={setCtx} dimentions={dimentions} />
    )
}

export default Canvas
