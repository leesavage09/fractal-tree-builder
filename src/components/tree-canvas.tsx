import React, { useState, useEffect, useRef } from "react";
import Canvas from './canvas'
import useAnimationFrame from '../hooks/use-animation-frame'
import { WorkerBuilder, treeBuilder } from "../web-worker/tree-builder.worker";
import { Branch } from '../web-worker/tree-builder.worker'
import {dimentions} from './pure-canvas'

const TreeCanvas = ({ rootBranch, callBackDone, dimentions }: { rootBranch: Branch | null, callBackDone:Function, dimentions:dimentions }) => {
  const treeParts: React.MutableRefObject<Array<Array<Branch>>> = useRef([[]]);
  const [drawProps, setDrawProps] = useState<Array<Branch>>([])
  const [version, setVersion] = useState(0)

  useEffect(() => {
    setVersion(version+1)
    treeParts.current = [[]]
    if (!rootBranch) return
    const worker = WorkerBuilder(treeBuilder)
    worker.onmessage = (message) => {
      if (message) {
        treeParts.current = message.data
        callBackDone("Finished")
        worker.terminate()
      }
    };
    worker.postMessage([[rootBranch]]);
    return () => {
      worker.terminate()
    }
  }, [rootBranch])

  useAnimationFrame((deltaTime: number) => {
    if (treeParts.current.length >= 1) {
      let parts = treeParts.current.shift()
      let drawParts = parts
       
      if (parts && drawParts) {
        if (parts.length>500) {
          drawParts = parts.splice(0,500)
          treeParts.current.unshift(parts)
        }
        setDrawProps(drawParts)
      }
    }
  })

  return <Canvas drawProps={drawProps} version={version} dimentions={dimentions} />
}

export default TreeCanvas
