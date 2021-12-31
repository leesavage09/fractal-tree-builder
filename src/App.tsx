import { useState } from 'react'
import TreeCanvas, { Branch, DrawSettings, TreeBuilderSettings } from './components/tree-canvas'

function App() {
  const [treeSettings, setTreeSettings] = useState<TreeBuilderSettings | null>(null)
  const [loading, setLoading] = useState(false)
  const [dimentions, setDimentions] = useState({ width: 700, height: 700 })

  const drawSettings: DrawSettings = {
    strokeStyle: '#eee',
    fillStyle: '#530',
    shadowBlur: 7,
    shadowColor: '#222',
    bend: 10
  }

  const createTree = () => {
    setLoading(true)
    const treeSettings: TreeBuilderSettings = {
      tree: [[{
        depth: 0,
        x: 300,
        y: 600,
        length: 50 + Math.random() * 100,
        angle: 25 - Math.random() * 50,
        width: Math.random() * 10
      }]],
      maxTreeLength: 19
    }
    setTreeSettings(treeSettings)
  }

  const finishedTree = (callbackMessage: string) => {
    console.log(callbackMessage)
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
