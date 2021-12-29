import React, { useState, useEffect } from "react";
import Canvas from './canvas'
import useAnimationFrame from './hooks/use-animation-frame'

const Animation = () => {

  const [drawProps, setDrawProps] = useState([])

  const treeParts = React.useRef([[]]);
  const maxTreeDebth = 14;

  useEffect(() => {
    genorateTree({
      level: 0,
      depth: 0,
      angle: 0,
      x: 300,
      y: 600,
      length: 100,
      width: 4
    })

  }, [])

  const genorateTree = ({ angle, x, y, length, width, level, depth }) => {
    if (depth >= maxTreeDebth) return

    //ani,ation
    for (let i = 1; i < length; i = 1 + i + (length / 10)) {
      if (treeParts.current[level] == null) treeParts.current[level] = []
      treeParts.current[level].push({
        level,
        depth,
        x,
        y,
        angle,
        length: i,
        width
      })
      level++
    }

    if (treeParts.current[level] == null) treeParts.current[level] = []

    treeParts.current[level].push({
      level,
      depth,
      x,
      y,
      angle,
      length,
      width
    })

  }

  function findNewPoint(x, y, angle, distance) {
    var result = {};
    angle = angle - 90
    result.x = Math.round(Math.cos(angle * Math.PI / 180) * distance + x);
    result.y = Math.round(Math.sin(angle * Math.PI / 180) * distance + y);
    return result;
  }



  useAnimationFrame(deltaTime => {
    if (treeParts.current.length >= 1) {
      const partsLevel = treeParts.current.shift()

      if (treeParts.current.length === 0) {
        const nodes = partsLevel


        nodes.map((node) => {
          const pos = findNewPoint(node.x, node.y, node.angle, node.length)

          genorateTree({
            level: 0,
            depth: node.depth + 1,
            x: pos.x,
            y: pos.y,
            length: node.length * 0.75,
            angle: node.angle + 35,
            width: node.width * 0.75
          })

          genorateTree({
            level: 0,
            depth: node.depth + 1,
            x: pos.x,
            y: pos.y,
            length: node.length * 0.75,
            angle: node.angle - 35,
            width: node.width * 0.75
          })
        })
      }

      setDrawProps(prevDrawProps => {
        return partsLevel
      })
    }
  })

  return (
    <Canvas drawProps={drawProps} />
  )
}

export default Animation
