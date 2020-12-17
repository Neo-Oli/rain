import Entity from './entity'
import Color from 'color'
import positiveAngle from './positiveAngle'
export default class Drop extends Entity {
    constructor(rain, timestamp) {
        super(rain, timestamp)
        this.rain = rain
        this.x = this.getRandomPos()
        this.z = this.rain.random(1, 100, rain.parallax)
        this.blur = Math.pow(this.z / 100, 0.5)
        this.size = this.rain.random(1, 5, 0.1)
        this.length = 20 * this.z
        this.y = 0 - this.length
        this.speedModifier = 1 + this.size / 5
        this.speed = 100 * this.speedModifier
        this.color = Color(this.rain.rainColor).fade(this.blur).array()
    }

    // get a random position inside the x axis of the spawnable area
    getRandomPos() {
        return (
            Math.floor(Math.random() * (this.rain.max - this.rain.min)) +
            this.rain.min
        )
    }

    destroy() {
        super.destroy()
    }

    // calculate the changes based on the time(work) passed
    work(work) {
        super.work(work)
        let speed = this.speed * (this.z * 10)
        speed = (speed / 1000) * work
        this.y += speed
        // this is a right triangle
        const alpha = 90 - positiveAngle(this.rain.wind)
        if (alpha) {
            const alphaRad = (alpha * Math.PI) / 180
            const a = speed
            const c = a / Math.sin(alphaRad)
            const b = Math.sqrt(Math.pow(c, 2) - Math.pow(a, 2))
            const windspeed = b
            if (this.rain.wind > 0) {
                this.x += windspeed
            } else {
                this.x -= windspeed
            }
        }
        if (this.y > this.rain.height + this.length) {
            this.destroy()
        }
        return !this.destroyed
    }

    draw() {
        if (!super.draw()) {
            return false
        }
        const ctx = this.rain.ctx
        const x = this.x
        const y = this.y
        const size = this.size * this.z
        const angle = 0 - this.rain.wind
        const length = this.length
        if (x > 0 - size && x < this.rain.width + size) {
            ctx.beginPath() // start new path
            ctx.fillStyle = `rgba(${this.color})`
            ctx.ellipse(
                x,
                y,
                size, // radiusX
                length, // radiusY
                (angle * Math.PI) / 180, // rotation
                0, // startAngle
                2 * Math.PI // endAngle
            )
            ctx.fill() // actually draw
            return true
        }
        return false
    }
}
