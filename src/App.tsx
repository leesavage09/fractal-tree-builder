import { useState, useEffect } from 'react'
import TreeCanvas, { DrawSettings, TreeBuilderSettings } from './components/tree-canvas'
import styles from './App.module.scss'
import debounce from 'lodash.debounce';
import _ from 'lodash';

const defaultTreeBuilderInputs = {
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
}

const defaultDrawSettingInputs = {
  strokeStyle: 'rgb(55,38,25)',
  fillStyle: 'rgb(55,38,25)',
  shadowBlur: 20,//
  shadowColor: 'rgba(65,48,25,0.75)',//
  bend: { minNumber: -0.3, maxNumber: 0.3 },
  wireframe: false
}

function App() {
  const [loading, setLoading] = useState(false)
  const [dimentions, setDimentions] = useState({ width: 700, height: 700 })
  const [treeBuilderInputs, setTreeBuilderInputs] = useState(defaultTreeBuilderInputs)
  const [drawSettingInputs, setDrawSettingInputs] = useState(defaultDrawSettingInputs)
  const [drawSettings, setDrawSettings] = useState<DrawSettings>(drawSettingInputs)
  const [treeBuilderSettings, setTreeBuilderSettings] = useState<TreeBuilderSettings | null>(treeBuilderInputs)

  const hangelTreeBuilderInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextState = { ...treeBuilderInputs }
    _.set(nextState, e.target.name, parseInt(e.target.value))
    setTreeBuilderInputs(nextState)
  }

  const handelDrawSettingInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextState = { ...drawSettingInputs }
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    _.set(nextState, e.target.name, value)
    setDrawSettingInputs(nextState)
  }

  useEffect(() => {
    const f = debounce(() => {
      setDimentions({
        width: window.innerWidth * 0.6,
        height: window.innerHeight
      })
    }, 500)
    window.addEventListener('resize', f)
    f()
  }, [])

  const renderTree = () => {
    setDrawSettings({ ...drawSettingInputs })
  }

  const createTree = () => {
    setLoading(true)
    setDrawSettings({ ...drawSettingInputs })
    setTreeBuilderSettings({ ...treeBuilderInputs })
  }

  const finishedTree = (callbackMessage: string) => {
    setLoading(false)
  }

  const cancelTree = () => {
    // renderTree()
    setTreeBuilderSettings(null)
    setLoading(false)
  }

  return (
    <div className={styles.container}>

      <TreeCanvas className={styles.canvas} dimentions={dimentions} builderSettings={treeBuilderSettings} callBackDone={finishedTree} drawSettings={drawSettings} />
      <div className={styles.settings}>

        <h1>Settings</h1>
        <p>Maximum tree depth: <input className={styles.inputNum} value={treeBuilderInputs.maxTreeDepth} onChange={hangelTreeBuilderInputs} name='maxTreeDepth' /></p>

        <h1>Main Branch</h1>
        <p>Length: <input className={styles.inputNum} value={treeBuilderInputs.tree[0][0].length} onChange={hangelTreeBuilderInputs} name='tree[0][0].length' />Width: <input className={styles.inputNum} value={treeBuilderInputs.tree[0][0].width} onChange={hangelTreeBuilderInputs} name='tree[0][0].width' /></p>
        <p>Survival rate: <input className={styles.inputNum} value={treeBuilderInputs.mainBranch.survivalRate} onChange={hangelTreeBuilderInputs} name='mainBranch.survivalRate' /></p>
        <p className={styles.paragraph}>Length multiplier: <input className={styles.inputNum} value={treeBuilderInputs.mainBranch.lengthMultiplier.minNumber} onChange={hangelTreeBuilderInputs} name='mainBranch.lengthMultiplier.minNumber' /> To <input className={styles.inputNum} value={treeBuilderInputs.mainBranch.lengthMultiplier.maxNumber} onChange={hangelTreeBuilderInputs} name='mainBranch.lengthMultiplier.maxNumber' /></p>
        <p>Width multiplier: <input
          className={styles.inputNum}
          value={treeBuilderInputs.mainBranch.widthMultiplier.minNumber}
          onChange={hangelTreeBuilderInputs}
          name='mainBranch.widthMultiplier.minNumber' /> To <input
            className={styles.inputNum}
            value={treeBuilderInputs.mainBranch.widthMultiplier.maxNumber}
            onChange={hangelTreeBuilderInputs}
            name='mainBranch.widthMultiplier.maxNumber'
          /></p>
        <p>Next angle: <input
          className={styles.inputNum}
          value={treeBuilderInputs.mainBranch.nextAngle.minNumber}
          onChange={hangelTreeBuilderInputs}
          name='mainBranch.nextAngle.minNumber' /> To <input
            className={styles.inputNum}
            value={treeBuilderInputs.mainBranch.nextAngle.maxNumber}
            onChange={hangelTreeBuilderInputs}
            name='mainBranch.nextAngle.maxNumber' /></p>


        <h1>Side Branch</h1>

        <button disabled={loading} onClick={createTree}>Genorate</button>
        <button disabled={!loading} onClick={cancelTree}>Cancel</button>

        <h1>Render Settings</h1>

        <input
          name="wireframe"
          type="checkbox"
          checked={drawSettingInputs.wireframe}
          onChange={handelDrawSettingInputs} />
        <button onClick={renderTree}>Render</button>
      </div>

    </div>
  );
}

export default App
