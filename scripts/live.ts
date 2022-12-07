export default class Live {
    public canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D | null

    private universe: Array<number>[]

    private universeWidth = 20
    private universeHeight = 20

    private fillStyle = '#d6d6d6'
    private squareStyle = '#ffd100'
    private universePadding = 1
    private lineWidth = 1

    public squareWidth: number
    public squareHeight: number

    public stepTime: number

    public isRunning: boolean
    public steps: number

    constructor() {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement
        const universe: Array<number>[] = []

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.universe = universe

        this.squareWidth = 20
        this.squareHeight = 20

        this.canvas.width = this.universeWidth * this.squareWidth + this.universePadding
        this.canvas.height = this.universeHeight * this.squareHeight + this.universePadding

        this.stepTime = 1000

        this.isRunning = false
        this.steps = 0
    }

    set setStepTime(time: number) {
        this.stepTime = 1000 / time
    }

    watchClick(event: MouseEvent) {
        this.steps = 0

        const xClick = event.offsetX
        const yClick = event.offsetY

        const x = Math.floor(xClick / this.squareWidth)
        const y = Math.floor(yClick / this.squareHeight)

        if (this.universe[y][x] === 0) {
            return this.drawSqare(x, y)
        }
        if (this.universe[y][x] === 1) {
            return this.clearSquare(x, y)
        }
    }

    drawUniverse() {
        this.universe = []
        this.steps = 0

        for (let h = 0; h < this.universeHeight; h++) {
            const row: number[] = []
            for (let w = 0; w < this.universeWidth; w++) {
                row.push(0)

                if (this.ctx) {
                    this.ctx.beginPath()
                    this.ctx.fillStyle = this.fillStyle
                    this.ctx.fillRect(
                        w * this.squareWidth + this.lineWidth,
                        h * this.squareHeight + this.lineWidth,
                        this.squareWidth - this.lineWidth,
                        this.squareHeight - this.lineWidth
                    )
                    this.ctx.stroke()
                }
            }
            this.universe.push(row)
        }
    }

    draw() {
        this.universe.forEach((row, rowIndex) => {
            row.map((square, index) => {
                if (this.ctx) {
                    if (square === 0) {
                        this.clearSquare(index, rowIndex)
                    }
                    else {
                        this.drawSqare(index, rowIndex)
                    }
                }
            })
        })

        this.steps++
    }

    clearSquare(x: number, y: number) {
        if (this.ctx) {
            this.ctx.beginPath()
            this.ctx.fillStyle = this.fillStyle
            this.ctx.fillRect(
                x * this.squareWidth + this.lineWidth,
                y * this.squareHeight + this.lineWidth,
                this.squareWidth - this.lineWidth,
                this.squareHeight - this.lineWidth
            )
        }

        this.universe[y][x] = 0
    }

    drawSqare(x: number, y: number) {
        if (this.ctx) {
            this.ctx.beginPath()
            this.ctx.fillStyle = this.squareStyle
            this.ctx.fillRect(
                x * this.squareWidth + this.lineWidth,
                y * this.squareHeight + this.lineWidth,
                this.squareWidth - this.lineWidth,
                this.squareHeight - this.lineWidth
            )
        }

        this.universe[y][x] = 1
    }

    check() {
        const newUniverse: Array<number>[] = []

        for (let h = 0; h < this.universeHeight; h++) {
            const row: number[] = []
            for (let w = 0; w < this.universeWidth; w++) {
                row.push(0)
            }
            newUniverse.push(row)
        }

        this.universe = this.universe.map((row, rowInd) => {
            let up = 0
            let down = 0

            rowInd === 0 ? up = this.universeHeight - 1 : up = rowInd - 1
            rowInd === this.universeHeight - 1 ? down = 0 : down = rowInd + 1

            return row.map((square, index) => {
                let neighbor = 0
                let left = 0
                let right = 0

                index === 0 ? left = this.universeWidth - 1 : left = index - 1
                index === this.universeWidth - 1 ? right = 0 : right = index + 1

                // UP
                if (this.universe[up][left] !== 0) neighbor++
                if (this.universe[up][right] !== 0) neighbor++
                if (this.universe[up][index] !== 0) neighbor++

                // MIDDLE
                if (this.universe[rowInd][left] !== 0) neighbor++
                if (this.universe[rowInd][right] !== 0) neighbor++

                // DOWN
                if (this.universe[down][left] !== 0) neighbor++
                if (this.universe[down][right] !== 0) neighbor++
                if (this.universe[down][index] !== 0) neighbor++

                // LIVE OR DEAD
                if (square === 1) {
                    if (neighbor === 2 || neighbor === 3) {
                        return newUniverse[rowInd][index] = 1
                    }

                    if (neighbor <= 1) {
                        return newUniverse[rowInd][index] = 0
                    }

                    if (neighbor >= 4) {
                        return newUniverse[rowInd][index] = 0
                    }
                }
                else {
                    if (neighbor === 3) {
                        return newUniverse[rowInd][index] = 1
                    }
                }

                return newUniverse[rowInd][index] = 0
            })
        })

        this.universe = newUniverse
    }
}