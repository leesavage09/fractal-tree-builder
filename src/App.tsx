import { useState } from 'react'
import TreeCanvas, { DrawSettings, TreeBuilderSettings } from './components/tree-canvas'
import { FuzzyNumber } from './web-worker/tree-builder.worker'

function App() {
  const [treeSettings, setTreeSettings] = useState<TreeBuilderSettings | null>(null)
  const [loading, setLoading] = useState(false)
  const [dimentions, setDimentions] = useState({ width: 700, height: 700 })

  const drawSettings: DrawSettings = {
    strokeStyle: 'rgb(55,38,25)',
    fillStyle: 'rgb(55,38,25)',
    shadowBlur: 20,
    shadowColor: 'rgba(65,48,25,0.75)',
    bend: { minNumber: -0.3, maxNumber: 0.3 },
    wireframe: true
  }

  const treeBuilderSettings: TreeBuilderSettings = {
    tree: [[{
      depth: 0,
      x: 300,
      y: 600,
      length: 127,
      angle: 0 - Math.random() * 1,
      width: 71,
      nextWidth: 50
    }]],
    maxTreeLength: 16,
    lengthMultiplier: { minNumber: 0.5, maxNumber: 0.9 },
    widthMultiplier: { minNumber: 0.3, maxNumber: 0.55 },
    mainBranchSurvival: 90,
    mainBranchAngle: { minNumber: -20, maxNumber: 20 },
    sideBranchSurvival: 75,
    sideBranchAngle: { minNumber: 27, maxNumber: 35 }
    
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
