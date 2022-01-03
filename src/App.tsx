import { useState } from 'react'
import TreeCanvas, { DrawSettings, TreeBuilderSettings } from './components/tree-canvas'
import { FuzzyNumber } from './web-worker/tree-builder.worker'

function App() {
  const [treeSettings, setTreeSettings] = useState<TreeBuilderSettings | null>(null)
  const [loading, setLoading] = useState(false)
  const [dimentions, setDimentions] = useState({ width: 700, height: 700 })

  const drawSettings: DrawSettings = {
    strokeStyle: '#000',
    fillStyle: '#530',
    shadowBlur: 7,
    shadowColor: '#222',
    bend: { minNumber: -25, maxNumber: 25 },
    wireframe: false
  }

  const treeBuilderSettings: TreeBuilderSettings = {
    tree: [[{
      depth: 0,
      x: 300,
      y: 600,
      length: 50,
      angle: 0 - Math.random() * 1,
      width: 30
    }]],
    maxTreeLength: 5,
    lengthMultiplier: { minNumber: 0.75, maxNumber: 1.5 },
    widthMultiplier: { minNumber: 0.5, maxNumber: 1 },

    //main trunk
    //survival RANGE
    //angle RANGE

    //side branches
    //survival RANGE
    //angle RANGE

    //Fruit Chance
    //Leafe Chance

  }

  const createTree = () => {
    setLoading(true)
    setTreeSettings(treeBuilderSettings)
  }

  const finishedTree = (callbackMessage: string) => {
    // console.log(callbackMessage)
    setLoading(false)
  }

  const cancelTree = () => {
    setTreeSettings(null)
    setLoading(false)
  }

  return (
    <div>
      <TreeCanvas dimentions={dimentions} builderSettings={treeSettings} callBackDone={finishedTree} drawSettings={drawSettings} />
      <button disabled={loading} onClick={createTree}>Genorate</button>
      <button disabled={!loading} onClick={cancelTree}>Cancel</button>
    </div>
  );
}

export default App
