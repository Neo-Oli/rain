import Drop from './drop'
import positiveAngle from './positiveAngle'
import schedule from './schedule'
export default class Rain {
    constructor(id, controller) {
        this.dps = 100 // drops per second
        this.dpsMax = 500 // max drops per second
        this.adpsMax = 1000 // max drops per second absolute
        this.dropsMax = 3000 // max drops, if all else fails
        this.min = 0
        this.max = 0
        this.wind = 15
        this.windRange = 60 // don't go over 90
        this.speed = 100
        const canvasError = 'Your browser does not support the canvas element.'
        this.debug = false
        this.debugGraphics = false
        this.color = '#001659'

        this.id = id
        this.elapsed = 0
        this.worked = 0
        this.stopped = true
        this.container = document.getElementById(id)
        this.container.innerHTML = ''
        this.canvas = document.createElement('CANVAS')
        this.canvas.innerHTML = canvasError
        this.container.appendChild(this.canvas)
        this.drops = []
        this.ctx = this.canvas.getContext('2d')
        this.fps = 0
        this.fpsCur = 0
        this.dropsRendered = 0
        this.dropsRenderedCur = 0
        this.adps = this.dps
        this.dpsChange = 0
        this.dpsPositiveChange = true
        this.windPositiveChange = true
        this.windChange = 0
        this.tickObjects = ['drops']
    }

    draw(d) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        for (const o in this.tickObjects) {
            const name = this.tickObjects[o]
            for (const e in this[name]) {
                if (this[name][e].draw()) {
                    this.dropsRenderedCur++
                }
            }
        }
        this.dropsRendered = this.dropsRenderedCur
        this.dropsRenderedCur = 0
        if (this.debug) {
            this.ctx.fillStyle = '#ffffff'
            const stats = [
                `fps:${this.fps}`,
                `elapsed:${Math.floor(this.elapsed)}`,
                `worked:${Math.floor(this.worked)}`,
                `drops:${this.drops.length}`,
                `drops rendered:${this.dropsRendered}`,
                `dps:${this.dps}`,
                `adps:${this.adps}`,
                `wind:${this.wind}`,
                `min:${this.min}`,
                `max:${this.max}`,
                `windChange:${this.windChange}`
            ]
            for (const s in stats) {
                this.ctx.fillText(stats[s], 10, 10 + s * 12)
            }
        }
    }

    random(max, min = 0, pow = 1) {
        return Math.round(Math.pow(Math.random(), pow) * (max - min) + min)
    }

    windChangeCalc() {
        if (this.random(0, 5) === 0) {
            this.windPositiveChange = !this.windPositiveChange
        }
        this.windChange = this.random(0, this.windRange / 4, 0.1)
        if (this.windChange) {
            if (this.windPositiveChange) {
                this.wind += this.windChange
            } else {
                this.wind -= this.windChange
            }
            if (this.wind > this.windRange) {
                this.wind = this.windRange
                this.windPositiveChange = !this.windPositiveChange
            }
            if (this.wind < 0 - this.windRange) {
                this.wind = 0 - this.windRange
                this.windPositiveChange = !this.windPositiveChange
            }
            this.getRange()
            this.getadps()
        }
    }

    dpsChangeCalc() {
        if (this.random(0, 5) === 0) {
            this.dpsPositiveChange = !this.dpsPositiveChange
        }
        this.dpsChange = this.random(0, this.dpsMax, 0.01)
        if (this.dpsPositiveChange) {
            this.dps += this.dpsChange
        } else {
            this.dps -= this.dpsChange
        }
        if (this.dps > this.dpsMax) {
            this.dps = this.dpsMax
            this.dpsPositiveChange = !this.dpsPositiveChange
        }

        if (this.dps < 0) {
            this.dps = 0
            this.dpsPositiveChange = !this.dpsPositiveChange
        }
    }

    updateCanvas() {
        const newWidth = this.container.offsetWidth
        const newHeight = this.container.offsetHeight
        if (this.width !== newWidth || this.height !== newHeight) {
            this.canvas.width = newWidth
            this.canvas.height = newHeight
            this.width = newWidth
            this.height = newHeight
        }
        this.getRange()
        this.getadps()
    }

    getadps() {
        this.adps = Math.round((this.dps / 1000) * (0 - this.min + this.max))
        if (this.adps > this.adpsMax) {
            this.adps = this.adpsMax
        }
    }

    getRange() {
        let min = 0
        let max = this.width
        // this is a right triangle
        const alpha = 90 - positiveAngle(this.wind)
        if (alpha) {
            const alphaRad = (alpha * Math.PI) / 180
            const a = this.height
            const c = a / Math.sin(alphaRad)
            const b = Math.sqrt(Math.pow(c, 2) - Math.pow(a, 2))
            if (this.wind < 0) {
                max = this.width + b
            }
            if (this.wind > 0) {
                min = 0 - b
            }
        }
        this.min = min
        this.max = max
    }

    spawn(timestamp) {
        const drop = new Drop(this, timestamp)
        if (this.drops.length <= this.dropsMax) {
            this.drops.push(drop)
            return drop
        }
    }

    tick(timestamp) {
        if (this.start === undefined) {
            this.start = timestamp
        }
        const elapsed = timestamp - this.start
        const work = ((elapsed - this.elapsed) / 100) * this.speed
        this.elapsed = elapsed
        // real time
        schedule((1000 / 100) * this.speed, this.worked, work, () => {
            this.updateCanvas()
            this.fps = this.fpsCur
            this.fpsCur = 0
        })
        // not real time
        schedule(1000, this.worked, work, () => {
            this.windChangeCalc()
            this.dpsChangeCalc()
        })
        const adpsInterval = 1000 / this.adps
        if (Math.floor(adpsInterval)) {
            schedule(adpsInterval, this.worked, work, () => {
                this.spawn()
            })
        }
        this.fpsCur++
        this.worked += work
        for (const o in this.tickObjects) {
            const name = this.tickObjects[o]
            for (const e in this[name]) {
                if (!this[name][e].tick(work)) {
                    this[name].splice(e, 1)
                }
            }
        }
    }

    play() {
        this.stopped = false
        this.updateCanvas()
        const graphicsloop = (timestamp) => {
            this.tick(timestamp)
            this.draw()
            if (!this.stopped) {
                requestAnimationFrame(graphicsloop)
            }
        }
        requestAnimationFrame(graphicsloop)
    }

    stop() {
        this.stopped = true
    }
}
