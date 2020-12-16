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
    controlsTrigger.innerHTML = '⚙'
    controlsTrigger.htmlFor = controlsInput.id

    controlsContainer.appendChild(controlsInput)
    controlsContainer.appendChild(controls)
    controlsContainer.appendChild(controlsTrigger)

    const styles = document.createElement('STYLE')
    styles.innerHTML = `
    .${className}{
        user-select: none;
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
        text-align: right;
        height: 3em;
    }
    .${className} .controls{
        max-width: 0;
        display: inline-block;
        overflow: hidden;
        transition: all 1s;
        white-space: nowrap;
        line-height: 3em;
    }
    .${className} .controlsContainer #${controlsInput.id}:checked+.controls{
        max-width: 20em;
        padding-left: 1em;
        padding-right: 1em;
    }
    .${className} .controlsContainer input{
        display: none;
    }
    .${className} .controlsContainer label{
        color: ${rain.textColor};
        font-size: 3em;
        line-height: 1em;
        float: right;
        cursor: pointer;
    }
    .${className} button{
        background: transparent;
        color: ${rain.textColor};
        border: none;
        cursor: pointer;
    }
    `
    const debugButton = document.createElement('BUTTON')
    debugButton.classList.add('debugbutton')
    debugButton.innerHTML = rain.lDebug
    debugButton.addEventListener('click', () => {
        rain.debug = !rain.debug
    })
    controls.appendChild(debugButton)

    const pauseButton = document.createElement('BUTTON')
    pauseButton.classList.add('pauseButton')
    pauseButton.innerHTML = rain.lPause
    pauseButton.addEventListener('click', () => {
        rain.pause()
    })
    controls.appendChild(pauseButton)

    const unpauseButton = document.createElement('BUTTON')
    unpauseButton.classList.add('unpauseButton')
    unpauseButton.innerHTML = rain.lPlay
    unpauseButton.addEventListener('click', () => {
        rain.unpause()
    })
    controls.appendChild(unpauseButton)

    const stopButton = document.createElement('BUTTON')
    stopButton.classList.add('stopbutton')
    stopButton.innerHTML = rain.lStop
    stopButton.addEventListener('click', () => {
        rain.stop()
    })
    controls.appendChild(stopButton)

    const playButton = document.createElement('BUTTON')
    playButton.classList.add('playbutton')
    playButton.innerHTML = `<div>${rain.lPlay}</div>`
    playButton.addEventListener('click', () => {
        rain.play()
    })
    uiContainer.appendChild(playButton)
    uiContainer.appendChild(styles)
    return uiContainer
}
export default ui
