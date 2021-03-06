import { useState, useEffect } from "react";
import PureCanvas, { dimentions } from './pure-canvas'
import { Branch } from '../web-worker/tree-builder.worker'
import { FuzzyNumber, defineNumber } from '../web-worker/tree-builder.worker'

export type { dimentions } from './pure-canvas'

export interface DrawSettings {
    strokeStyle: string
    fillStyle: string
    shadowBlur: number
    shadowColor: string
    bend: FuzzyNumber
    wireframe: boolean
}

const Canvas = ({ drawProps, drawSettings, version, dimentions, className }: { drawProps: Array<Branch>, drawSettings: DrawSettings, version: number, dimentions: dimentions, className: string }) => {
    const [ctx, setCtx] = useState<CanvasRenderingContext2D>()

    useEffect(() => {
        if (!ctx) return
        ctx.strokeStyle = drawSettings.strokeStyle
        ctx.fillStyle = drawSettings.fillStyle
        ctx.lineWidth = 0.5;
        // ctx.shadowBlur = drawSettings.shadowBlur
        // ctx.shadowColor = drawSettings.shadowColor
        const bend = drawSettings.bend

        drawProps.map((branch: Branch) => {
            let topRightX = 0 + (branch.nextWidth / 2);
            let topRightY = -branch.length;
            let topLeftX = 0 - (branch.nextWidth / 2);
            let topLeftY = -branch.length;
            let bottomRightX = branch.width / 2;
            let bottomRightY = 0;
            let bottomLeftX = 0 - (branch.width / 2);
            let bottomLeftY = 0;

            ctx.save()
            ctx.translate(branch.x + (ctx.canvas.width / 2), branch.y + ctx.canvas.height);
            ctx.rotate(branch.angle * Math.PI / 180);

            ctx.beginPath();
            ctx.moveTo(topRightX, topRightY);

            const thisBend = defineNumber(bend) * branch.width
            ctx.quadraticCurveTo(
                bottomRightX - thisBend, topRightY / 2,
                bottomRightX, bottomRightY);

            ctx.lineTo(bottomLeftX, bottomLeftY);

            ctx.quadraticCurveTo(
                topLeftX - thisBend, topLeftY / 2,
                topLeftX, topLeftY);

            ctx.translate(0, -branch.length);
            ctx.arc(0, 0, branch.nextWidth / 2, 0, 2 * Math.PI);
            if (!drawSettings.wireframe) ctx.fill();

            ctx.closePath();

            ctx.stroke();
            ctx.restore();
        })
    }, [drawProps])


    useEffect(() => {
        if (!ctx) return
        ctx.clearRect(0, 0, dimentions.width, dimentions.height);
    }, [version])


    return (
        <PureCanvas className={className} contextRef={setCtx} dimentions={dimentions} />
    )
}

export default Canvas
