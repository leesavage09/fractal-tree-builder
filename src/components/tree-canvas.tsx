import React, { useState, useEffect, useRef } from "react";
import Canvas, { dimentions, DrawSettings } from './canvas'
import useAnimationFrame from '../hooks/use-animation-frame'
import { getTreeBuilderWorker, Branch, TreeBuilderSettings } from "../web-worker/tree-builder.worker";
import { cloneDeep } from 'lodash'

export type { Branch } from '../web-worker/tree-builder.worker'
export type { DrawSettings } from './canvas'
export type { TreeBuilderSettings } from '../web-worker/tree-builder.worker'

const TreeCanvas = ({ drawSettings, builderSettings, callBackDone, dimentions, className }: { drawSettings: DrawSettings, builderSettings: TreeBuilderSettings | null, callBackDone: Function, dimentions: dimentions, className: string }) => {
  const treeParts: React.MutableRefObject<Array<Array<Branch>>> = useRef([[]]);
  const [drawProps, setDrawProps] = useState<Array<Branch>>([])
  const [version, setVersion] = useState(0)
  const [tree, setTree] = useState<Array<Array<Branch>>>([])

  useEffect(() => {
    if (!builderSettings) return

    const worker = getTreeBuilderWorker()
    worker.onmessage = (message) => {
      if (message) {
        setTree(message.data)
        callBackDone("Finished")
        worker.terminate()
      }
    };
    worker.postMessage(builderSettings);
    return () => {
      worker.terminate()
    }
  }, [builderSettings])

  useEffect(() => {
    setVersion(version + 1)
    treeParts.current = cloneDeep(tree)
  }, [dimentions, tree])

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

  return <Canvas className={className} drawProps={drawProps} version={version} dimentions={dimentions} drawSettings={drawSettings} />
}

export default TreeCanvas
