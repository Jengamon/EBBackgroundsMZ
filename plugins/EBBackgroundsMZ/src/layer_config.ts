import ebbShader from "./ebb_shader.frag.glsl";
import ebbVertShader from "./ebb_shader.vert.glsl";
import * as _ from "lodash";
import * as PIXI from "pixi.js";

const ImageModes = {
    Tiled: "tiled",
    Stretched: "stretched",
} as const;
type ImageMode = typeof ImageModes[keyof typeof ImageModes];

const EffectTypes = {
    None: "none",
    Horizontal: "horizontal",
    HorizontalInterlaced: "horizontal_interlaced",
    Vertical: "vertical"
} as const;
type EffectType = typeof EffectTypes[keyof typeof EffectTypes];

interface EffectConfiguration {
    type: EffectType,
    amplitude: number,
    frequency: number,
    speed: number,
    //palette_shift: number,
    //scroll: [number, number] // x, y
}

export class Configuration {
    _effectConf: EffectConfiguration;

    constructor(effectConf: Partial<EffectConfiguration>) {
        this._effectConf = Object.assign({
            type: "horizontal_interlaced",
            amplitude: 1,
            frequency: 1,
            speed: 1
        }, effectConf);
    }

    attachToSprite(sprite: PIXI.Sprite) {
        sprite.filters = [new EBBFilter(this)];
    }
}

// console.log(ebbShader);
export class EBBFilter extends PIXI.Filter {
    _uniforms: {
        eTime: number,
        eType: number
        eAmplitude: number,
        eFrequency: number,
        eSpeed: number,
        uPalette: PIXI.Texture,
        epOffset: number,
        epShiftOffset: number,
        eScaleFactor: number,
    };

    configuration: Configuration;

    tickTime: number;

    constructor(conf: Configuration) {
        const uniforms = {
            eTime: 0,
            eType: 0,
            eAmplitude: 0,
            eFrequency: 0,
            eSpeed: 1,
            uPalette: PIXI.Texture.EMPTY,
            epOffset: 0,
            epShiftOffset: 0,
            eScaleFactor: 1,
        };

        super(ebbVertShader, ebbShader, uniforms);

        this.configuration = conf;
        this.tickTime = 0;

        const ticker = PIXI.Ticker.shared;

        ticker.add(time => {
            // console.log(time, this.tickTime, ticker.deltaMS);
            this.tickTime += ticker.deltaMS;
            this.updateUniforms();
        })

        this._uniforms = uniforms;
    }

    private updateUniforms() {
        this._uniforms.eTime = this.tickTime / 1000;
        this._uniforms.eType = _.indexOf(["none", "horizontal", "horizontal_interlaced", "vertical"], this.configuration._effectConf.type);
        /*
        let sizeNormal = (this.uniforms.eType == 3 ? output.size.height : output.size.width);
        this.uniforms.eAmplitude = this.layer.effect._amplitude / (sizeNormal * 2);
        this.uniforms.eFrequency = this.layer.effect._frequency;
        this._uniforms.eSpeed = this.configuration.speed;
        this._uniforms.uPalette = this.palette_sprite._texture;
        this._uniforms.epOffset = this.epOffset;
        this._uniforms.epSize = this.palette_sprite.width;
        this._uniforms.epShiftOffset = this.layer.paletteShift.shift_offset;
        this._uniforms.eScaleFactor = this.options.scale_factor;
        */
        this._uniforms.eAmplitude = this.configuration._effectConf.amplitude;
        this._uniforms.eFrequency = this.configuration._effectConf.frequency;
        this._uniforms.eSpeed = this.configuration._effectConf.speed;
        //this._uniforms.uPalette = this.palette_sprite._texture;
        // this._uniforms.epOffset = this.epOffset;
        // this._uniforms.epSize = this.palette_sprite.width;
        // this._uniforms.epShiftOffset = this.layer.paletteShift.shift_offset;
        // this._uniforms.eScaleFactor = this.options.scale_factor;
    }
}