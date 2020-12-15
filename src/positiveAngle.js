const positiveAngle = (angle) => {
    while (angle >= 360) {
        angle = angle - 360
    }
    while (angle < 0) {
        angle = angle + 360
    }
    return angle
}
export default positiveAngle
