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
                    'speed',
                    'speed',
                    1,
                    1000,
                    this.logSliderReverse(rain.speedDefault, 1, rain.speedMax),
                    (slider) => {
                        rain.setSpeed(
                            this.logSlider(slider.value, 1, rain.speedMax)
                        )
                    },
                    (slider) => {
                        slider.value = this.logSliderReverse(
                            rain.speedDefault,
                            1,
                            rain.speedMax
                        )
                        rain.setSpeed()
                    }
                )
            ],
            [
                this.slider(
                    'parallax',
                    'parallax',
                    1,
                    1000,
                    this.logSliderReverse(
                        rain.parallaxDefault,
                        rain.parallaxMin,
                        1
                    ),
                    (slider) => {
                        rain.parallax = this.logSlider(
                            slider.value,
                            rain.parallaxMin,
                            1
                        )
                    },
                    (slider) => {
                        slider.value = this.logSliderReverse(
                            rain.parallaxDefault,
                            rain.parallaxMin,
                            1
                        )
                        rain.parallax = rain.parallaxDefault
                    }
                )
            ]
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

    slider(labelText, className, min, max, initialValue, input, reset) {
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
            input(slider)
        })
        const resetButton = this.button('⟲', () => {
            reset(slider)
        })
        const sliderContainer = document.createElement('DIV')
        sliderContainer.classList.add(className)
        sliderContainer.appendChild(label)
        sliderContainer.appendChild(slider)
        sliderContainer.appendChild(resetButton)
        return sliderContainer
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
            background-color: ${rain.controlColor};
            padding: 0.1em;
            bottom: 1em;
            right: 1em;
            width: auto;
            text-align: right;
        }
        .${className} .controls{
            max-width: 0;
            display: inline-block;
            overflow: hidden;
            transition: all 1s;
            line-height: 3em;
            max-height: 3em;
            text-align: left;
        }
        .${className} .controls>div{
            white-space: nowrap;
        }
        .${className} .controlsContainer
        #${this.controlsTriggerCheckId}:checked+.controls{
            max-width: calc(360px - 2em);
            padding-left: 1em;
            padding-right: 1em;
            max-height: 20em;
        }
        .${className} .controlsContainer #${this.controlsTriggerCheckId}{
            display: none;
        }
        .${className} .controlsContainer .controlsTrigger{
            color: ${rain.textColor};
            font-size: 3em;
            line-height: 1em;
            cursor: pointer;
            padding: 0;
        }
        .${className} .controls label{
            color: ${rain.textColor};
            padding-left: 1em;
            width: 5em;
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
