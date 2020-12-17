export default class Ui {
    constructor(rain, timestamp) {
        this.rain = rain
        this.className = rain.className
        this.controlsTriggerCheckId = `${rain.className}_TriggerCheck`
        this.uiContainer = document.createElement('DIV')
        this.uiContainer.appendChild(this.getStyles())

        const controlsContainer = document.createElement('DIV')
        controlsContainer.classList.add('controlsContainer')
        this.uiContainer.appendChild(controlsContainer)
        const controls = document.createElement('DIV')
        controls.classList.add('controls')

        const controlsTriggerCheck = document.createElement('INPUT')
        controlsTriggerCheck.type = 'checkbox'
        controlsTriggerCheck.id = this.controlsTriggerCheckId

        const controlsTrigger = document.createElement('LABEL')
        controlsTrigger.classList.add('controlsTrigger')
        controlsTrigger.innerHTML = '⚙'
        controlsTrigger.htmlFor = this.controlsTriggerCheckId

        controlsContainer.appendChild(controlsTriggerCheck)
        controlsContainer.appendChild(controls)
        controlsContainer.appendChild(controlsTrigger)

        this.uiContainer.appendChild(
            this.button(
                'play',
                () => {
                    rain.play()
                },
                'playbutton'
            )
        )
        const controlPanel = [
            [
                this.button('debug', () => {
                    rain.debug = !rain.debug
                }),
                this.button(
                    'pause',
                    () => {
                        rain.pause()
                    },
                    'pauseButton'
                ),
                this.button(
                    'play',
                    () => {
                        rain.unpause()
                    },
                    'unpauseButton'
                ),
                this.button('stop', () => {
                    rain.stop()
                })
            ],
            [
                this.slider(
                    'drops/s',
                    'dps',
                    1,
                    1000,
                    this.logSliderReverse(
                        rain.dps,
                        rain.dpsMin + 1,
                        rain.dpsMax + 1
                    ) - 1,
                    (value, initialValue) => {
                        rain.dps = Math.ceil(
                            this.logSlider(
                                value,
                                rain.dpsMin + 1,
                                rain.dpsMax + 1
                            ) - 1
                        )
                    },
                    null,
                    (state) => {
                        rain.dpsLock = state
                    },
                    false
                )
            ],
            [
                this.slider(
                    'wind',
                    'wind',
                    0 - rain.windRange,
                    rain.windRange,
                    rain.wind,
                    (value) => {
                        rain.wind = value
                        rain.getadps()
                    },
                    null,
                    (state) => {
                        rain.windLock = state
                    },
                    false
                )
            ],
            [
                this.slider(
                    'speed',
                    'speed',
                    1,
                    1000,
                    this.logSliderReverse(rain.speed, 1, rain.speedMax),
                    (value) => {
                        rain.setSpeed(this.logSlider(value, 1, rain.speedMax))
                    },
                    (value, initialValue) => {
                        rain.setSpeed(
                            this.logSlider(initialValue, 1, rain.speedMax)
                        )
                        return initialValue
                    }
                )
            ],
            [
                this.slider(
                    'parallax',
                    'parallax',
                    1,
                    1000,
                    this.logSliderReverse(rain.parallax, rain.parallaxMin, 1),
                    (value) => {
                        rain.parallax = this.logSlider(
                            value,
                            rain.parallaxMin,
                            1
                        )
                    },
                    (value, initialValue) => {
                        rain.parallax = this.logSlider(
                            initialValue,
                            rain.parallaxMin,
                            1
                        )
                        return initialValue
                    }
                )
            ],
            [this.title('rain color')],
            ...this.sliderGroup('rainColor'),
            [
                this.toggle(
                    (state) => {
                        rain.randomColors = state
                    },
                    false,
                    'random colors'
                )
            ],
            [this.title('background color')],
            ...this.sliderGroup('bgColor')
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
    }

    button(label, click, className) {
        const button = document.createElement('BUTTON')
        if (className) {
            button.classList.add(className)
        }
        button.innerHTML = `<div>${label}</div>`
        button.addEventListener('click', click)
        return button
    }

    title(string) {
        const label = document.createElement('div')
        label.classList.add('title')
        label.innerHTML = string
        return label
    }

    sliderGroup(color) {
        const rain = this.rain
        return [
            [
                this.slider(
                    'hue',
                    'hue',
                    0,
                    360,
                    rain[color]().hue(),
                    (value) => {
                        rain[color](rain[color]().hue(value))
                    },
                    (value, initialValue) => {
                        rain[color](rain[color]().hue(initialValue))
                        return initialValue
                    }
                )
            ],
            [
                this.slider(
                    'saturation',
                    'saturation',
                    0,
                    100,
                    rain[color]().saturationl(),
                    (value) => {
                        rain[color](rain[color]().saturationl(value))
                    },
                    (value, initialValue) => {
                        rain[color](rain[color]().saturationl(initialValue))
                        return initialValue
                    }
                )
            ],
            [
                this.slider(
                    'lightness',
                    'lightness',
                    0,
                    100,
                    rain[color]().lightness(),
                    (value) => {
                        rain[color](rain[color]().lightness(value))
                    },
                    (value, initialValue) => {
                        rain[color](rain[color]().lightness(initialValue))
                        return initialValue
                    }
                )
            ]
        ]
    }

    slider(
        labelText,
        className,
        min,
        max,
        initialValue,
        input,
        reset,
        toggle,
        toggleInitial
    ) {
        const sliderContainer = document.createElement('DIV')
        const slider = document.createElement('INPUT')
        const label = document.createElement('LABEL')
        label.innerHTML = `${labelText}:`
        slider.id = `${this.className}_${className}`
        label.htmlFor = slider.id
        slider.type = 'range'
        slider.min = min
        slider.max = max
        slider.value = initialValue
        slider.addEventListener('input', () => {
            input(slider.value)
        })
        sliderContainer.classList.add(className)
        sliderContainer.appendChild(label)
        sliderContainer.appendChild(slider)
        if (reset) {
            const resetButton = this.button('⟲', () => {
                slider.value = reset(slider.value, initialValue)
            })
            sliderContainer.appendChild(resetButton)
        }
        if (toggle) {
            sliderContainer.appendChild(
                this.toggle((state, toggleInitial) => {
                    slider.disabled = !state
                    input(slider.value)
                    toggle(state, initialValue)
                }, toggleInitial)
            )
            slider.disabled = !toggleInitial.checked
        }
        return sliderContainer
    }

    toggle(func, toggleInitial, label) {
        const toggleBoxContainer = document.createElement('SPAN')
        const toggleBox = document.createElement('INPUT')
        toggleBox.type = 'checkbox'
        toggleBox.addEventListener('input', () => {
            const state = toggleBox.checked
            func(state)
        })
        toggleBox.checked = toggleInitial
        if (label) {
            const labelEl = document.createElement('LABEL')
            const labelText = document.createElement('span')
            labelText.innerHTML = label
            labelEl.appendChild(toggleBox)
            labelEl.appendChild(labelText)
            toggleBoxContainer.appendChild(labelEl)
        } else {
            toggleBoxContainer.appendChild(toggleBox)
        }
        return toggleBoxContainer
    }

    get() {
        return this.uiContainer
    }

    logSlider(position, min, max) {
        const minp = 1
        const maxp = 1000
        const minv = Math.log(min)
        const maxv = Math.log(max)
        const scale = (maxv - minv) / (maxp - minp)
        return Math.exp(minv + scale * (position - minp))
    }

    logSliderReverse(speed, min, max) {
        const minp = 1
        const maxp = 1000
        const minv = Math.log(min)
        const maxv = Math.log(max)
        const scale = (maxv - minv) / (maxp - minp)
        return (Math.log(speed) - minv) / scale + minp
    }

    getStyles() {
        const rain = this.rain
        const className = this.className
        const styles = document.createElement('STYLE')
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
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
        }
        .${className} .controls{
            max-width: 0;
            overflow: hidden;
            transition: all 1s;
            line-height: 3em;
            max-height: 0em;
            background-color: ${rain.controlColor};
            position: absolute;
            bottom: 3em;
            right: 0;
        }
        .${className} .controls>div{
            white-space: nowrap;
        }
        .${className} .controlsContainer
        #${this.controlsTriggerCheckId}:checked+.controls{
            max-width: calc(360px - 2em);
            padding-left: 1em;
            padding-right: 1em;
            max-height: calc(100% - 3em);
            overflow-y: auto;
            animation: hide-scroll 1s backwards;
        }
        @keyframes hide-scroll {
            from, to { overflow: hidden; }
        }
        .${className} .controlsContainer #${this.controlsTriggerCheckId}{
            display: none;
        }
        .${className} .controlsContainer .controlsTrigger{
            background-color: ${rain.controlColor};
            color: ${rain.textColor};
            font-size: 3em;
            line-height: 1em;
            cursor: pointer;
            position: absolute;
            bottom: 0;
            right: 0;
        }
        .${className} .controls .title{
            color: ${rain.textColor};
        }

        .${className} .controls label input + span{
            margin-left: 1em;
        }
        .${className} .controls label{
            color: ${rain.textColor};
            padding-left: 1em;
            width: 7em;
            display: inline-block
        }
        .${className} button{
            background: transparent;
            color: ${rain.textColor};
            border: none;
            font-size: 1em;
            cursor: pointer;
        }
        `
        return styles
    }
}
