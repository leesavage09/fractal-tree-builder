import React, { useState, useEffect, useRef } from "react";
import Canvas, { dimentions, DrawSettings } from './canvas'
import useAnimationFrame from '../hooks/use-animation-frame'
import { getTreeBuilderWorker, Branch, TreeBuilderSettings } from "../web-worker/tree-builder.worker";

export type { Branch } from '../web-worker/tree-builder.worker'
export type { DrawSettings } from './canvas'
export type { TreeBuilderSettings } from '../web-worker/tree-builder.worker'

const TreeCanvas = ({ drawSettings, builderSettings, callBackDone, dimentions }: { drawSettings: DrawSettings, builderSettings:TreeBuilderSettings|null, callBackDone: Function, dimentions: dimentions }) => {
  const treeParts: React.MutableRefObject<Array<Array<Branch>>> = useRef([[]]);
  const [drawProps, setDrawProps] = useState<Array<Branch>>([])
  const [version, setVersion] = useState(0)

  useEffect(() => {
    treeParts.current = [[]]
    if (!builderSettings) return

    const worker = getTreeBuilderWorker()
    worker.onmessage = (message) => {
      if (message) {
        setVersion(version + 1)
        treeParts.current = message.data
        callBackDone("Finished")
        worker.terminate()
      }
    };
    worker.postMessage(builderSettings);
    return () => {
      worker.terminate()
    }
  }, [builderSettings])

  useAnimationFrame((deltaTime: number) => {
    if (treeParts.current.length >= 1) {
      let parts = treeParts.current.shift()
      let drawParts = parts

      if (parts && drawParts) {
        if (parts.length > 500) {
          drawParts = parts.splice(0, 500)
          treeParts.current.unshift(parts)
        }
        setDrawProps(drawParts)
      }
    }
  })

  return <Canvas drawProps={drawProps} version={version} dimentions={dimentions} drawSettings={drawSettings} />
}

export default TreeCanvas
