import React, { useState, useEffect, useRef } from "react";
import Canvas from './canvas'
import useAnimationFrame from '../hooks/use-animation-frame'
import { WorkerBuilder, treeBuilder } from "../web-worker/tree-builder.worker";
import { Branch } from '../web-worker/tree-builder.worker'

const TreeCanvas = () => {

  const [drawProps, setDrawProps] = useState<any>()
  const [isLoading, setIsLoading] = useState(false)

  const worker = useRef(WorkerBuilder(treeBuilder))
  const treeParts: React.MutableRefObject<Array<Array<Branch>>> = useRef([[]]);

  useEffect(() => {
    worker.current.onmessage = (message) => {
      if (message) {
        treeParts.current = message.data
        setIsLoading(false)
      }
    };

  }, [])

  useAnimationFrame((deltaTime: number) => {
    if (treeParts.current.length >= 1) {
      const partsLevel = treeParts.current.shift()
      setDrawProps((prevDrawProps: any) => {
        return partsLevel
      })
    }
  })

  return (
    <div>
      <Canvas drawProps={drawProps} />
      <button
        disabled={isLoading}
        onClick={() => {
          setIsLoading(true)
          const treeRoot: Array<Array<Branch>> = [[{
            depth: 0,
            x: 300,
            y: 500,
            length: 100,
            angle: 0,
            width: 10
          }]]
          worker.current.postMessage(treeRoot);
        }}
      >gen tree</button>

      <button
        onClick={() => {
          worker.current.terminate()
          worker.current = WorkerBuilder(treeBuilder)
          setIsLoading(false)
        }}
      >cancel tree</button>
    </div>
  )
}

export default TreeCanvas
