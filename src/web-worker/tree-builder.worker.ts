
export type FuzzyNumber = {
    minNumber: number
    maxNumber: number
}

export interface Branch {
    angle: number
    x: number
    y: number
    length: number
    width: number
    nextWidth: number
}

export interface TreeBuilderSettings {
    tree: Array<Array<Branch>>
    maxTreeDepth: number
    mainBranch: {
        lengthMultiplier: FuzzyNumber
        widthMultiplier: FuzzyNumber
        survivalRate: number
        nextAngle: FuzzyNumber
    }
    sideBranch: {
        lengthMultiplier: FuzzyNumber
        widthMultiplier: FuzzyNumber
        survivalRate: number
        nextAngle: FuzzyNumber
    }
}

//TODO import scripts
const treeBuilder = () => {

    const defineNumber = (fuzzy: FuzzyNumber): number => {
        const variance = Math.random() * (fuzzy.maxNumber - fuzzy.minNumber)
        return fuzzy.minNumber + variance
    }

    // eslint-disable-next-line no-restricted-globals
    self.onmessage = ({ data }) => {
        const tree = createTree(data)
        postMessage(tree);
    }


    // given a tree and a max tree length grow the tree to max length and return
    const createTree = (settings: TreeBuilderSettings): Array<Array<Branch>> => {
        const tree = settings.tree
        if (tree.length >= settings.maxTreeDepth) return tree

        const lastBranches = tree[tree.length - 1]
        const nextBranches_arr = lastBranches.map((branch) => {
            return nextBranchs(branch, settings)
        })
        tree.push(nextBranches_arr.flat())

        return createTree(settings)
    }

    //takes a branch and returns the child branches
    const nextBranchs = ({ angle, x, y, length, nextWidth }: Branch, settings: TreeBuilderSettings): Array<Branch> => {
        const pos = findNewPoint(x, y, angle, length)

        const branches = []

        if (settings.sideBranch.survivalRate > Math.random() * 100) {
            const thisWidth = nextWidth * defineNumber(settings.sideBranch.widthMultiplier)
            const theNextWidth = thisWidth * defineNumber(settings.sideBranch.widthMultiplier)
            branches.push({
                x: pos.x,
                y: pos.y,
                length: length * defineNumber(settings.sideBranch.lengthMultiplier),
                angle: angle + defineNumber(settings.sideBranch.nextAngle),
                width: thisWidth,
                nextWidth: theNextWidth
            })
        }
        if (settings.mainBranch.survivalRate > Math.random() * 100) {
            const nextAngle = Math.random()>0.5 ? angle-defineNumber(settings.mainBranch.nextAngle): angle+defineNumber(settings.mainBranch.nextAngle)
            branches.push({
                x: pos.x,
                y: pos.y,
                length: length * defineNumber(settings.mainBranch.lengthMultiplier),
                angle: nextAngle,
                width: nextWidth,
                nextWidth: nextWidth * defineNumber(settings.mainBranch.widthMultiplier)
            })
        }
        if (settings.sideBranch.survivalRate > Math.random() * 100) {
            const thisWidth = nextWidth * defineNumber(settings.sideBranch.widthMultiplier)
            const theNextWidth = thisWidth * defineNumber(settings.sideBranch.widthMultiplier)
            branches.push({
                x: pos.x,
                y: pos.y,
                length: length * defineNumber(settings.sideBranch.lengthMultiplier),
                angle: angle + 0 - defineNumber(settings.sideBranch.nextAngle),
                width: thisWidth,
                nextWidth: theNextWidth
            })
        }

        return branches
    }

    const findNewPoint = (x: number, y: number, angle: number, distance: number) => {
        return {
            x: Math.round(Math.cos((angle - 90) * Math.PI / 180) * distance + x),
            y: Math.round(Math.sin((angle - 90) * Math.PI / 180) * distance + y)
        }
    }

}

export const getTreeBuilderWorker = () => {
    const code = treeBuilder.toString();
    const blob = new Blob([`(${code})()`]);
    return new Worker(URL.createObjectURL(blob));
}