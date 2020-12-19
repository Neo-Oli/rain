import random from './random'
import intersexImage from './colorModeImages/intersex.png'
import jollyrogerImage from './colorModeImages/jollyroger.png'
import demisexualImage from './colorModeImages/demisexual.png'
import polyamoryImage from './colorModeImages/polyamory.png'
import Color from 'color'

const colorsFromImage = (x, y, imageSrc, rain) => {
    if (rain.image.src !== imageSrc) {
        rain.image.src = imageSrc
    }
    const smallx = Math.max(
        0,
        Math.min(
            Math.round((x / rain.width) * rain.imgResolution),
            rain.imgResolution
        )
    )
    const smally = Math.max(
        0,
        Math.min(
            Math.round((y / rain.height) * rain.imgResolution),
            rain.imgResolution
        )
    )
    if (rain.imgCache[smallx]) {
        if (rain.imgCache[smallx][smally]) {
            return rain.imgCache[smallx][smally]
        }
    } else {
        rain.imgCache[smallx] = {}
    }
    const color = Color.rgb(rain.imgCtx.getImageData(smallx, smally, 1, 1).data)
    rain.imgCache[smallx][smally] = color
    return color
}

const colorStripesBoth = (name, stripes, rain) => {
    return {
        [`${name}_vertical`]: {
            func: (x, y) => {
                return colorStripes(
                    x + (0 - rain.min),
                    rain.max + (0 - rain.min),
                    stripes
                )
            }
        },
        [`${name}_horizontal`]: {
            func: (x, y) => {
                return colorStripes(y, rain.height, stripes)
            },
            always: true
        }
    }
}

const colorStripes = (pos, range, stripes) => {
    return Color(
        stripes[
            Math.max(
                0,
                Math.min(
                    Math.round(((stripes.length - 1) / range) * pos),
                    stripes.length - 1
                )
            )
        ]
    )
}

const colorModes = (rain) => {
    return {
        rain: {
            func: (x, y) => {
                return rain.rainColor()
            }
        },
        random: {
            func: (x, y) => {
                return Color.hsl([
                    random(0, 360),
                    random(0, 100),
                    random(0, 100)
                ])
            }
        },
        'random (hue only)': {
            func: (x, y) => {
                return rain.rainColor(rain.rainColor().hue(random(0, 360)))
            }
        },
        ...colorStripesBoth(
            'pride',
            ['#e40303', '#ff8c00', '#ffed00', '#008026', '#004dff', '#750787'],
            rain
        ),
        ...colorStripesBoth(
            'agender',
            [
                '#000000',
                '#b9b9b9',
                '#ffffff',
                '#b8f483',
                '#ffffff',
                '#b9b9b9',
                '#000000'
            ],
            rain
        ),
        ...colorStripesBoth(
            'aromantic',
            ['#3da542', '#a7d379', '#ffffff', '#a9a9a9', '#000000'],
            rain
        ),
        ...colorStripesBoth(
            'asexual',
            ['#000000', '#a3a3a3', '#ffffff', '#810081'],
            rain
        ),
        ...colorStripesBoth(
            'bi',
            ['#d60270', '#d60270', '#9b4f96', '#0038a8', '#0038a8'],
            rain
        ),
        ...colorStripesBoth(
            'demiboy',
            [
                '#7f7f7f',
                '#c4c4c4',
                '#9cd8eb',
                '#ffffff',
                '#9cd8eb',
                '#c4c4c4',
                '#7f7f7f'
            ],
            rain
        ),
        ...colorStripesBoth(
            'demigender',
            [
                '#7f7f7f',
                '#c4c4c4',
                '#faff74',
                '#ffffff',
                '#faff74',
                '#c4c4c4',
                '#7f7f7f'
            ],
            rain
        ),
        ...colorStripesBoth(
            'demigirl',
            [
                '#7f7f7f',
                '#c4c4c4',
                '#ffaec9',
                '#ffffff',
                '#ffaec9',
                '#c4c4c4',
                '#7f7f7f'
            ],
            rain
        ),
        demisexual: {
            func: (x, y) => {
                return colorsFromImage(x, y, demisexualImage, rain)
            },
            always: true
        },
        ...colorStripesBoth(
            'genderfluid',
            ['#ff76a4', '#ffffff', '#bf11d7', '#000000', '#303cbe'],
            rain
        ),
        ...colorStripesBoth(
            'genderqueer',
            ['#b57edc', '#ffffff', '#4a8123'],
            rain
        ),
        intersex: {
            func: (x, y) => {
                return colorsFromImage(x, y, intersexImage, rain)
            },
            always: true
        },
        ...colorStripesBoth(
            'lesbian',
            ['#a78c8d', '#ff9b55', '#ffffff', '#d462a6', '#a50062'],
            rain
        ),
        ...colorStripesBoth(
            'neutrois',
            ['#ffffff', '#1cb34b', '#000000'],
            rain
        ),
        ...colorStripesBoth(
            'nonbinary',
            ['#fcf431', '#ffffff', '#9d59d2', '#282828'],
            rain
        ),
        ...colorStripesBoth('pan', ['#ff218c', '#ffd800', '#21b1ff'], rain),
        ...colorStripesBoth(
            'pangender',
            [
                '#fff798',
                '#ffddcd',
                '#ffddcd',
                '#ffffff',
                '#ffddcd',
                '#ffddcd',
                '#fff798'
            ],
            rain
        ),
        polyamory: {
            func: (x, y) => {
                return colorsFromImage(x, y, polyamoryImage, rain)
            },
            always: true
        },
        ...colorStripesBoth(
            'polysexual',
            ['#f616ba', '#00d669', '#1593f6'],
            rain
        ),
        ...colorStripesBoth(
            'trans',
            ['#76cff0', '#f5abb9', '#ffffff', '#f5abb9', '#5bcffa'],
            rain
        ),
        jollyroger: {
            func: (x, y) => {
                return colorsFromImage(x, y, jollyrogerImage, rain)
            },
            always: true
        }
    }
}

export default colorModes
