import { useState } from 'react'
import TreeCanvas, { DrawSettings, TreeBuilderSettings } from './components/tree-canvas'
import {makeFuzzyNumber} from './web-worker/tree-builder.worker'

function App() {
  const [treeSettings, setTreeSettings] = useState<TreeBuilderSettings | null>(null)
  const [loading, setLoading] = useState(false)
  const [dimentions, setDimentions] = useState({ width: 700, height: 700 })

  const drawSettings: DrawSettings = {
    strokeStyle: '#eee',
    fillStyle: '#530',
    shadowBlur: 7,
    shadowColor: '#222',
    bend: makeFuzzyNumber(-25,25),
    wireframe: false 
  }

  const treeBuilderSettings: TreeBuilderSettings = {
    tree: [[{
      depth: 0,
      x: 300,
      y: 600,
      length: 100 + Math.random() * 100,
      angle: 0 - Math.random() * 1,
      width: Math.random() * 10
    }]],
    maxTreeLength: 5

    //next length RANGE
    //next width RANGE

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
