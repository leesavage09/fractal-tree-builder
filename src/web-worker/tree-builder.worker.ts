
export type FuzzyNumber = {
    minNumber: number
    maxNumber: number
}

export interface Branch {
    depth: number
    angle: number
    x: number
    y: number
    length: number
    width: number
    nextWidth: number
}

export interface TreeBuilderSettings {
    tree: Array<Array<Branch>>
    maxTreeLength: number
    lengthMultiplier: FuzzyNumber
    widthMultiplier: FuzzyNumber
    mainBranchSurvival: number
    mainBranchAngle: FuzzyNumber
    sideBranchSurvival: number
    sideBranchAngle: FuzzyNumber
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
        if (tree.length >= settings.maxTreeLength) return tree

        const lastBranches = tree[tree.length - 1]
        const nextBranches_arr = lastBranches.map((branch) => {
            return nextBranchs(branch, settings)
        })
        tree.push(nextBranches_arr.flat())

        return createTree(settings)
    }

    //takes a branch and returns the child branches
    const nextBranchs = ({ depth, angle, x, y, length, width, nextWidth }: Branch, settings: TreeBuilderSettings): Array<Branch> => {
        const pos = findNewPoint(x, y, angle, length)

        const branches = []

        if (settings.sideBranchSurvival > Math.random() * 100) {
            const thisWidth = nextWidth * defineNumber(settings.widthMultiplier)
            const theNextWidth = thisWidth * defineNumber(settings.widthMultiplier)
            branches.push({
                depth: depth + 1,
                x: pos.x,
                y: pos.y,
                length: length * defineNumber(settings.lengthMultiplier),
                angle: angle + defineNumber(settings.sideBranchAngle),
                width: thisWidth,
                nextWidth: theNextWidth
            })
        }

        if (settings.mainBranchSurvival > Math.random() * 100) {
            branches.push({
                depth: depth + 1,
                x: pos.x,
                y: pos.y,
                length: length * defineNumber(settings.lengthMultiplier),
                angle: angle + defineNumber(settings.mainBranchAngle),
                width: nextWidth,
                nextWidth: nextWidth * defineNumber(settings.widthMultiplier)
            })
        }

        if (settings.sideBranchSurvival > Math.random() * 100) {
            const thisWidth = nextWidth * defineNumber(settings.widthMultiplier)
            const theNextWidth = thisWidth * defineNumber(settings.widthMultiplier)
            branches.push({
                depth: depth + 1,
                x: pos.x,
                y: pos.y,
                length: length * defineNumber(settings.lengthMultiplier),
                angle: angle + 0 - defineNumber(settings.sideBranchAngle),
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