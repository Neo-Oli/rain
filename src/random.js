const random = (max, min = 0, pow = 1) => {
    return Math.round(Math.pow(Math.random(), pow) * (max - min) + min)
}
export default random
