const schedule = (interval, worked, work, func) => {
    if (work > 0) {
        for (let i = worked; i + interval < worked + work; i += interval) {
            func()
        }
        if (
            (worked + work) % interval >= interval / 2 &&
            worked % interval < interval / 2
        ) {
            func()
        }
    }
}
export default schedule
