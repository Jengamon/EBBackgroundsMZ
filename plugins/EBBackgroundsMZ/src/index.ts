/* eslint-disable @typescript-eslint/no-this-alias */
import * as json5 from "json5";
import { $gameSystem, PluginManager, Bitmap, Scene_Battle, Sprite, Spriteset_Battle, Sprite_Battleback, Graphics } from "rmmz";
import { Configuration, EBBFilter } from "./layer_config";
import { getFileFromServer } from "./utils";
import * as PIXI from "pixi.js";

const parameters = PluginManager.parameters("JM_EarthBoundBackgroundsMZ");

const conf_file = parameters["config"] || "ebb/ebb_config.json";

console.log(conf_file);

const config = {};

getFileFromServer(conf_file, res => res.text())
    .then(res => Object.assign(config, json5.parse(res)))
    .catch(err => {
        console.error(err);
    });

console.log(config);

export function greet(name: string) {
    return `Hello, ${name}`;
}

export const configuration1 = new Configuration({
    type: "horizontal",
    amplitude: 0.1,
    frequency: 5,
});

export const configuration2 = new Configuration({
    type: "horizontal_interlaced",
    amplitude: 10,
    frequency: 45,
});

class Spriteset_BattleEBB extends Spriteset_Battle {
    _ebb1Sprite: Sprite;
    _ebb2Sprite: Sprite;

    constructor() {
        console.log("dumb");
        
        super();

        console.log(Graphics.width, Graphics.height);
        const b1 = new Bitmap(Graphics.width, Graphics.height);
        b1.drawCircle(Graphics.width / 2, Graphics.height / 2, Graphics.height / 2, "#ff00ff");
        this._ebb1Sprite = new Sprite(b1);
        this._ebb2Sprite = new Sprite();
        this._ebb1Sprite.filters = [new EBBFilter(configuration1)];
        this._ebb2Sprite.filters = [new EBBFilter(configuration1)];

        this.attachEBBSprites();

        console.log(`${window.$gameActors.actor(1)?.name()} knows nothing...`);
    }

    override initialize() {
        super.initialize();
    }

    attachEBBSprites() {
        this._baseSprite.addChild(this._ebb1Sprite);
        this._baseSprite.addChild(this._ebb2Sprite);

        console.log("ghasi");
    }

    override createBattleback() {
        super.createBattleback();

        this._back1Sprite.visible = false;
        this._back2Sprite.visible = false;

        console.log("joomla");
    }
}
window.Spriteset_Battle = Spriteset_BattleEBB;

// Alternate way of overriding methods. Not fun tho, as you can't add members this way.
// const SB_createBattleback = Spriteset_Battle.prototype.createBattleback;
// Spriteset_Battle.prototype.createBattleback = function (this: Spriteset_Battle) {
//     SB_createBattleback.apply(this, []);
//     this._back1Sprite.visible = false;
//     this._back2Sprite.visible = false;
//     console.log("goomba");
// }