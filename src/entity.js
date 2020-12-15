export default class Entity {
    constructor(rain, timestamp) {
        this.rain = rain
        this.worked = 0
        this.destroyed = false
    }

    destroy() {
        this.destroyed = true
    }

    work() {}

    tick(work) {
        this.work(work)
        this.worked += work
        return !this.destroyed
    }

    draw() {
        return !this.destroyed
    }
}
