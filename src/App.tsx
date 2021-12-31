import { useState } from 'react'
import TreeCanvas, { Branch } from './components/tree-canvas'

function App() {
  const [rootBranch, setRootBranch] = useState<Branch | null>(null)
  const [loading, setLoading] = useState(false)
  const [dimentions, setDimentions] = useState({ width: 700, height: 700 })

  const createTree = () => {
    setLoading(true)
    setRootBranch({
      depth: 0,
      x: 300,
      y: 600,
      length: 50 + Math.random() * 100,
      angle: 25 - Math.random() * 50,
      width: Math.random() * 10
    })
  }

  const finishedTree = (callbackMessage: string) => {
    console.log(callbackMessage)
    setLoading(false)
  }


  const cancelTree = () => {
    setRootBranch(null)
    setLoading(false)
  }


  return (
    <div>
      <TreeCanvas dimentions={dimentions} rootBranch={rootBranch} callBackDone={finishedTree} />
      <button disabled={loading} onClick={createTree}>Genorate</button>
      <button disabled={!loading} onClick={cancelTree}>Cancel</button>
    </div>
  );
}

export default App;
