export interface Branch {
    depth: number
    angle: number
    x: number
    y: number
    length: number
    width: number
}

//TODO import scripts

export const treeBuilder = () => {

    // eslint-disable-next-line no-restricted-globals
    self.onmessage = (event) => {
        const tree = createTree(event.data, 10)
        postMessage(tree);
    }


    // given a tree and a max tree length grow the tree to max length and return
    const createTree = (tree: Array<Array<Branch>>, maxTreeLength: number): Array<Array<Branch>> => {
        if (tree.length >= maxTreeLength) return tree

        const lastBranches = tree[tree.length - 1]
        const nextBranches_arr = lastBranches.map((branch) => {
            return nextBranchs(branch)
        })
        tree.push(nextBranches_arr.flat())

        return createTree(tree, maxTreeLength)
    }

    //takes a branch and returns the child branches
    const nextBranchs = ({ depth, angle, x, y, length, width }: Branch): Array<Branch> => {
        const pos = findNewPoint(x, y, angle, length)

        return [{
            depth: depth + 1,
            x: pos.x,
            y: pos.y,
            length: length * 0.75,
            angle: angle + 35,
            width: width * 0.75
        }, {
            depth: depth + 1,
            x: pos.x,
            y: pos.y,
            length: length * 0.75,
            angle: angle - 35,
            width: width * 0.75
        }]
    }

    const findNewPoint = (x: number, y: number, angle: number, distance: number) => {
        return {
            x: Math.round(Math.cos((angle - 90) * Math.PI / 180) * distance + x),
            y: Math.round(Math.sin((angle - 90) * Math.PI / 180) * distance + y)
        }
    }


}

export const WorkerBuilder = (worker: Function) => {
    const code = worker.toString();
    const blob = new Blob([`(${code})()`]);
    return new Worker(URL.createObjectURL(blob));
}