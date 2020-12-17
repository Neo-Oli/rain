export const ui = (rain) => {
    const uiContainer = document.createElement('DIV')
    const className = rain.className

    const controlsContainer = document.createElement('DIV')
    controlsContainer.classList.add('controlsContainer')
    uiContainer.appendChild(controlsContainer)
    const controls = document.createElement('DIV')
    controls.classList.add('controls')

    const controlsInput = document.createElement('INPUT')
    controlsInput.type = 'checkbox'
    controlsInput.id = `${rain.className}_Input`

    const controlsTrigger = document.createElement('LABEL')
    controlsTrigger.classList.add('controlsTrigger')
    controlsTrigger.innerHTML = '⚙'
    controlsTrigger.htmlFor = controlsInput.id

    controlsContainer.appendChild(controlsInput)
    controlsContainer.appendChild(controls)
    controlsContainer.appendChild(controlsTrigger)

    const styles = document.createElement('STYLE')
    uiContainer.appendChild(styles)
    styles.innerHTML = `
    .${className}{
        user-select: none;
        position: relative;
        height: 100%;
        width: 100%;
    }
    .${className} canvas{
        display: block;
        color: ${rain.textColor}
    }
    .${className}.playing .controlsContainer{
        display: block;
    }
    .${className} .unpauseButton{
        display: none;
    }
    .${className}.paused .unpauseButton{
        display: inline;
    }
    .${className}.paused .pauseButton{
        display: none;
    }
    .${className}.playing .playbutton{
        display: none;
    }
    .${className} .playbutton{
        position: absolute;
        width: 10em;
        height: 10em;
        padding: 0;
        background-color: ${rain.controlColor};
        left: calc(50% - 5em);
        top: calc(50% - 5em);
    }
    .${className} .playbutton>div{
        position: absolute;
        right: 1em;
        bottom: 1em;
    }
    .${className} .controls .reset{
        font-size: 2em;
        position: relative;
        top: 0.25em;
    }
    .${className} .controls input[type=range]{
        position: relative;
        top: 0.5em;
    }
    .${className} .playbutton:before{
        display: inline-block;
        content: '▶';
        line-height: 100px;
        font-size: 7em;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
    }
    .${className} .controlsContainer{
        display: none;
        position: absolute;
        background-color: ${rain.controlColor};
        padding: 0.1em;
        bottom: 1em;
        right: 1em;
        width: auto;
    }
    .${className} .controls{
        max-width: 0;
        display: inline-block;
        overflow: hidden;
        transition: all 1s;
        line-height: 3em;
        max-height: 3em;
    }
    .${className} .controls>div{
        white-space: nowrap;
    }
    .${className} .controlsContainer #${controlsInput.id}:checked+.controls{
        max-width: 360px;
        padding-left: 1em;
        padding-right: 1em;
        max-height: 20em;
    }
    .${className} .controlsContainer #${controlsInput.id}{
        display: none;
    }
    .${className} .controlsContainer .controlsTrigger{
        font-size: 3em;
        line-height: 1em;
        cursor: pointer;
        padding: 0;
    }
    .${className} label{
        color: ${rain.textColor};
        padding-left: 1em;
    }
    .${className} button{
        background: transparent;
        padding: 0 1em;
        color: ${rain.textColor};
        border: none;
        font-size: 1em;
        cursor: pointer;
    }
    `
    const debugButton = document.createElement('BUTTON')
    debugButton.classList.add('debugbutton')
    debugButton.innerHTML = rain.lDebug
    debugButton.addEventListener('click', () => {
        rain.debug = !rain.debug
    })

    const pauseButton = document.createElement('BUTTON')
    pauseButton.classList.add('pauseButton')
    pauseButton.innerHTML = rain.lPause
    pauseButton.addEventListener('click', () => {
        rain.pause()
    })

    const unpauseButton = document.createElement('BUTTON')
    unpauseButton.classList.add('unpauseButton')
    unpauseButton.innerHTML = rain.lPlay
    unpauseButton.addEventListener('click', () => {
        rain.unpause()
    })

    const stopButton = document.createElement('BUTTON')
    stopButton.classList.add('stopbutton')
    stopButton.innerHTML = rain.lStop
    stopButton.addEventListener('click', () => {
        rain.stop()
    })

    const playButton = document.createElement('BUTTON')
    playButton.classList.add('playbutton')
    playButton.innerHTML = `<div>${rain.lPlay}</div>`
    playButton.addEventListener('click', () => {
        rain.play()
    })
    uiContainer.appendChild(playButton)

    const speedSlider = document.createElement('INPUT')
    const speedLabel = document.createElement('LABEL')
    speedLabel.innerHTML = `${rain.lSpeed}:`
    speedSlider.id = `${rain.className}_speedLabel`
    speedLabel.htmlFor = speedSlider.id
    speedSlider.type = 'range'
    speedSlider.min = '1'
    speedSlider.max = 1000
    speedSlider.value = logSliderReverse(rain.speedDefault, 1, rain.speedMax)
    speedSlider.addEventListener('input', () => {
        rain.setSpeed(logSlider(speedSlider.value, 1, rain.speedMax))
    })

    const speedSliderReset = document.createElement('BUTTON')
    speedSliderReset.innerHTML = '⟲'
    speedSliderReset.classList.add('reset')
    speedSliderReset.addEventListener('click', () => {
        speedSlider.value = logSliderReverse(
            rain.speedDefault,
            1,
            rain.speedMax
        )
        rain.setSpeed()
    })
    const parallaxMin = 0.0001
    const parallaxSlider = document.createElement('INPUT')
    const parallaxLabel = document.createElement('LABEL')
    parallaxLabel.innerHTML = `${rain.lParallax}:`
    parallaxSlider.id = `${rain.className}_parallaxLabel`
    parallaxLabel.htmlFor = parallaxSlider.id
    parallaxSlider.type = 'range'
    parallaxSlider.min = '1'
    parallaxSlider.max = 1000
    parallaxSlider.value = logSliderReverse(
        rain.parallaxDefault,
        parallaxMin,
        1
    )
    parallaxSlider.addEventListener('input', () => {
        rain.parallax = logSlider(parallaxSlider.value, parallaxMin, 1)
    })

    const parallaxSliderReset = document.createElement('BUTTON')
    parallaxSliderReset.innerHTML = '⟲'
    parallaxSliderReset.classList.add('reset')
    parallaxSliderReset.addEventListener('click', () => {
        parallaxSlider.value = logSliderReverse(
            rain.parallaxDefault,
            parallaxMin,
            1
        )
        rain.parallax = rain.parallaxDefault
    })

    const controlPanel = [
        [debugButton, pauseButton, unpauseButton, stopButton],
        [speedLabel, speedSlider, speedSliderReset],
        [parallaxLabel, parallaxSlider, parallaxSliderReset]
    ]
    for (const l in controlPanel) {
        const line = controlPanel[l]
        const lineDiv = document.createElement('DIV')
        controls.appendChild(lineDiv)
        for (const e in line) {
            const element = line[e]
            lineDiv.appendChild(element)
        }
    }
    return uiContainer
}
const logSlider = (position, min, max) => {
    const minp = 1
    const maxp = 1000
    const minv = Math.log(min)
    const maxv = Math.log(max)
    const scale = (maxv - minv) / (maxp - minp)
    return Math.exp(minv + scale * (position - minp))
}
const logSliderReverse = (speed, min, max) => {
    const minp = 1
    const maxp = 1000
    const minv = Math.log(min)
    const maxv = Math.log(max)
    const scale = (maxv - minv) / (maxp - minp)
    return (Math.log(speed) - minv) / scale + minp
}
export default ui
