import Drop from './drop'
import schedule from './schedule'
import random from './random'
import Ui from './ui'
import Color from 'color'
export default class Rain {
    constructor(id, overwriteOptions) {
        this.id = id
        this.overwriteOptions = overwriteOptions
        this.defaults()
    }

    defaults() {
        Object.assign(this, {
            ...{
                dps: 100, // drops per second
                dpsLock: false,
                dpsMin: 0, // min drops per second
                dpsMax: 500, // max drops per second
                adpsMax: 1000, // max drops per second absolute
                dropsMax: 3000, // max drops, if all else fails
                wind: 15, // This is an angle in degrees
                windLock: false,
                windRange: 60, // Max wind angle
                parallax: 0.02,
                parallaxMin: 0.0001,
                canvasError:
                    'Your browser does not support the canvas element.',
                debug: false,
                color: '#001659',
                controlColor: '#00000055',
                textColor: 'white',
                backgroundColor: '#070215',
                backgroundOpacity: 1,
                className: 'rain-container',
                speed: 100,
                speedMax: 1000,
                ui: true,
                colorMode: 'rain',
                imgResolution: 20
            },
            ...this.overwriteOptions
        })
        this.color = Color(this.color)
        this.min = 0
        this.max = 0
        this.savedSpeed = this.speed
        this.windRange = Math.min(this.windRange, 89) // don't go over 90

        this.elapsed = 0
        this.stopped = false

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
        this.paused = false
        this.width = 0
        this.height = 0

        this.container = document.getElementById(this.id)
        this.container.innerHTML = '' // removes nojs element
        this.canvas = document.createElement('CANVAS')
        this.ctx = this.canvas.getContext('2d')
        this.canvas.innerHTML = this.canvasError
        this.innerContainer = document.createElement('DIV')
        this.innerContainer.classList.add(this.className)
        this.container.appendChild(this.innerContainer)
        this.innerContainer.appendChild(this.canvas)
        this.canvas.style.display = 'block'
        this.bgColor(Color(this.backgroundColor))

        // cache for image color schemes
        const imageCanvas = document.createElement('CANVAS')
        imageCanvas.width = this.imgResolution
        imageCanvas.height = this.imgResolution
        this.image = new Image()
        this.image.onload = () => {
            this.imgCtx.drawImage(
                this.image,
                0,
                0,
                this.imgResolution,
                this.imgResolution
            )
            this.imgCache = {}
        }
        this.imgCache = {}
        this.imgCtx = imageCanvas.getContext('2d')
        this.imagesrc = ''
        if (this.ui) {
            const ui = new Ui(this)
            this.innerContainer.appendChild(ui.get())
        }
    }

    bgColor(color) {
        if (color) {
            this.backgroundColor = color
            const rgb = color.alpha(this.backgroundOpacity).rgb().string()
            this.innerContainer.style.backgroundColor = rgb
        }
        return this.backgroundColor
    }

    rainColor(color) {
        if (color) {
            this.color = color
        }
        return this.color
    }

    // clear the canvas
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    // This is the drawing loop. It draws all the things to the canvas
    draw(d) {
        this.clear()
        if (!this.stopped) {
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
                    `fps: ${this.fps}`,
                    `speed: ${this.speed}`,
                    `parallax: ${this.parallax}`,
                    `elapsed time: ${Math.floor(this.elapsed)}`,
                    `work done: ${Math.floor(this.worked)}`,
                    `drops (all): ${this.drops.length}`,
                    `drops (rendered): ${this.dropsRendered}`,
                    `drops per second: ${this.dps}`,
                    `drops per second locked: ${this.dpsLock}`,
                    `drops per second (width compensated): ${this.adps}`,
                    `wind: ${this.wind}`,
                    `wind locked: ${this.windLock}`,
                    `min x: ${this.min}`,
                    `max x: ${this.max}`,
                    `color mode: ${this.colorMode}`
                ]
                for (const s in stats) {
                    this.ctx.fillText(stats[s], 10, 10 + s * 12)
                }
            }
        }
    }

    // Do some randomness to the wind to simulate changing wind intensity
    windChangeCalc() {
        if (!this.windLock) {
            if (random(0, 5) === 0) {
                this.windPositiveChange = !this.windPositiveChange
            }
            this.windChange = random(0, this.windRange / 4, 0.1)
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
                this.getadps()
            }
        }
    }

    /*
     * Do some randomness to the drops per second in order to simulate changing
     * rain intensity
     */
    dpsChangeCalc() {
        if (!this.dpsLock) {
            if (random(0, 5) === 0) {
                this.dpsPositiveChange = !this.dpsPositiveChange
            }
            this.dpsChange = random(0, this.dpsMax, 0.01)
            if (this.dpsPositiveChange) {
                this.dps += this.dpsChange
            } else {
                this.dps -= this.dpsChange
            }
            if (this.dps > this.dpsMax) {
                this.dps = this.dpsMax
                this.dpsPositiveChange = !this.dpsPositiveChange
            }

            if (this.dps < this.dpsMin) {
                this.dps = this.dpsMin
                this.dpsPositiveChange = !this.dpsPositiveChange
            }
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
        this.getadps()
    }

    /*
     * Drops per second assumes a width of 1000 in order for the rain density
     * to be consistent. So we need to factor in the actual size of the spawn
     * area (min/max from getRange())
     */
    getadps() {
        this.getRange()
        this.adps = Math.round((this.dps / 1000) * (0 - this.min + this.max))
        if (this.adps > this.adpsMax) {
            this.adps = this.adpsMax
        }
    }

    setSpeed(value) {
        if (!this.paused) {
            this.speed = Math.round(value)
        } else {
            this.savedSpeed = Math.round(value)
        }
    }

    /*
     * because drops can travel horizontaly, we need to increase the max area
     * that we need to spawn drops. We're calculating this based on the current
     * wind angle so we don't need to calculate drops that will not be rendered.
     * When the wind suddenly changes there moght be a short window where some
     * area doesn't have drops, but it's usually not noticable
     */
    getRange() {
        let min = 0
        let max = this.width
        const wind = this.wind
        // this is a right triangle
        const alpha = 90 - wind
        if (alpha) {
            const alphaRad = (alpha * Math.PI) / 180
            const a = this.height
            const c = a / Math.sin(alphaRad)
            const b = Math.sqrt(Math.pow(c, 2) - Math.pow(a, 2))
            if (wind < 0) {
                max = this.width + b
            }
            if (wind > 0) {
                min = 0 - b
            }
        }
        this.min = min
        this.max = max
    }

    // Spawn a new raindrop
    spawn(timestamp) {
        const drop = new Drop(this, timestamp)
        if (this.drops.length <= this.dropsMax) {
            this.drops.push(drop)
            return drop
        }
    }

    /*
     * this is where all movement and spawning is done.
     * Basically the main loop
     */
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
        if (this.stopped) {
            this.defaults()
        }
        this.stopped = false
        this.updateCanvas()
        this.innerContainer.classList.add('playing')
        delete this.start
        this.drops = []
        this.worked = 0
        const graphicsloop = (timestamp) => {
            this.tick(timestamp)
            this.draw()
            if (!this.stopped) {
                requestAnimationFrame(graphicsloop)
            }
        }
        requestAnimationFrame(graphicsloop)
    }

    pause() {
        this.savedSpeed = this.speed
        this.speed = 0
        this.innerContainer.classList.add('paused')
        this.paused = true
    }

    unpause() {
        this.speed = this.savedSpeed
        this.innerContainer.classList.remove('paused')
        this.paused = false
    }

    stop() {
        if (this.paused) {
            this.unpause()
        }
        this.stopped = true
        this.innerContainer.classList.remove('playing')
    }
}
