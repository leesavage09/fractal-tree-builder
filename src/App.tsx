import { useState } from 'react'
import { Branch } from './web-worker/tree-builder.worker'
import TreeCanvas from './components/tree-canvas'


function App() {
  const [rootBranch, setRootBranch] = useState<Branch | null>(null)
  const [loading, setLoading] = useState(false)
  const [dimentions, setDimentions] = useState({width:700,height:700})

  return (
    <div>
      <TreeCanvas rootBranch={rootBranch} callBackDone={(message:string) => { 
        console.log(message)
        setLoading(false) 
        }}
        dimentions={dimentions} />
      <button
        disabled={loading}
        onClick={() => {
          setLoading(true)
          setRootBranch({
            depth: 0,
            x: 300,
            y: 600,
            length: 50 + Math.random() * 100,
            angle: 25 - Math.random() * 50,
            width: Math.random() * 10
          })
        }}
      >gen tree</button>

      <button
        onClick={() => {
          setRootBranch(null)
          setLoading(false) 
        }}
      >cancel tree</button>
    </div>
  );
}

export default App;
