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
    bend: { minNumber: -20, maxNumber: 20 },
    wireframe: false
  }

  const treeBuilderSettings: TreeBuilderSettings = {
    tree: [[{
      depth: 0,
      x: 300,
      y: 600,
      length: 150,
      angle: 0 - Math.random() * 1,
      width: 20
    }]],
    maxTreeLength: 5,
    lengthMultiplier: { minNumber: 0.75, maxNumber: 0.75 },
    widthMultiplier: { minNumber: 0.55, maxNumber: 0.55 },
    mainBranchSurvival: 90,
    mainBranchAngle: { minNumber: -20, maxNumber: 20 },
    sideBranchSurvival: 70,
    sideBranchAngle: { minNumber: 20, maxNumber: 45 }
    
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
