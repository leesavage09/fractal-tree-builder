import { useState, useEffect } from 'react'
import TreeCanvas, { DrawSettings, TreeBuilderSettings } from './components/tree-canvas'
import { FuzzyNumber } from './web-worker/tree-builder.worker'
import styles from './App.module.scss'
import debounce from 'lodash.debounce';

function App() {
  const [treeBuilderSettings, setTreeBuilderSettings] = useState<TreeBuilderSettings | null>({
    tree: [[{
      x: 0,
      y: 0,
      length: 80,
      angle: 0,
      width: 71,
      nextWidth: 30
    }]],
    maxTreeDepth: 12,
    mainBranch: {
      survivalRate: 99,
      lengthMultiplier: { minNumber: 0.5, maxNumber: 0.9 },
      widthMultiplier: { minNumber: 0.3, maxNumber: 0.55 },
      nextAngle: { minNumber: 0, maxNumber: 20 },
    },
    sideBranch: {
      survivalRate: 80,
      lengthMultiplier: { minNumber: 0.5, maxNumber: 0.9 },
      widthMultiplier: { minNumber: 0.3, maxNumber: 0.55 },
      nextAngle: { minNumber: 27, maxNumber: 35 },
    }
  })
  const [loading, setLoading] = useState(false)
  const [dimentions, setDimentions] = useState({ width: 700, height: 700 })

  const debouncedResize = debounce(() => {
    setDimentions({
      width: window.innerWidth * 0.6,
      height: window.innerHeight
    })
  }, 500)

  useEffect(() => {
    window.addEventListener('resize', debouncedResize)
    setDimentions({
      width: window.innerWidth * 0.6,
      height: window.innerHeight
    })
  }, [])


  const drawSettings: DrawSettings = {
    strokeStyle: 'rgb(55,38,25)',
    fillStyle: 'rgb(55,38,25)',
    shadowBlur: 20,//
    shadowColor: 'rgba(65,48,25,0.75)',//
    bend: { minNumber: -0.3, maxNumber: 0.3 },
    wireframe: false
  }

  const createTree = () => {
    setLoading(true)
    setTreeBuilderSettings(treeBuilderSettings)
  }

  const finishedTree = (callbackMessage: string) => {
    setLoading(false)
  }

  const cancelTree = () => {
    setTreeBuilderSettings(null)
    setLoading(false)
  }

  return (
    <div className={styles.container}>

      <TreeCanvas className={styles.canvas} dimentions={dimentions} builderSettings={treeBuilderSettings} callBackDone={finishedTree} drawSettings={drawSettings} />
      <div className={styles.settings}>


        <button disabled={loading} onClick={createTree}>Genorate</button>
        <button disabled={!loading} onClick={cancelTree}>Cancel</button>

      </div>

    </div>
  );
}

export default App
