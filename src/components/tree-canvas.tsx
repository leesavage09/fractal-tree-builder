import React, { useState, useEffect, useRef } from "react";
import Canvas, { dimentions } from './canvas'
import useAnimationFrame from '../hooks/use-animation-frame'
import { getTreeBuilderWorker, Branch, TreeBuilderSettings } from "../web-worker/tree-builder.worker";

export type { Branch } from '../web-worker/tree-builder.worker'

const TreeCanvas = ({ rootBranch, callBackDone, dimentions }: { rootBranch: Branch | null, callBackDone: Function, dimentions: dimentions }) => {
  const treeParts: React.MutableRefObject<Array<Array<Branch>>> = useRef([[]]);
  const [drawProps, setDrawProps] = useState<Array<Branch>>([])
  const [version, setVersion] = useState(0)

  useEffect(() => {
    treeParts.current = [[]]
    if (!rootBranch) return

    const treeSettings: TreeBuilderSettings = {
      tree: [[rootBranch]],
      maxTreeLength: 5
    }

    const worker = getTreeBuilderWorker()
    worker.onmessage = (message) => {
      if (message) {
        setVersion(version + 1)
        treeParts.current = message.data
        callBackDone("Finished")
        worker.terminate()
      }
    };
    worker.postMessage(treeSettings);
    return () => {
      worker.terminate()
    }
  }, [rootBranch])

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

  return <Canvas drawProps={drawProps} version={version} dimentions={dimentions} />
}

export default TreeCanvas
