import "@babel/polyfill";
import * as Phaser from "phaser";
import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";

import SettingsManager from "./classes/SettingsManager.js";
import AudioManager from "./classes/AudioManager.js";
import ConnectionHandler from "./classes/ConnectionHandler.js";
import Voicepack from "./classes/Voicepack.js";

import Scene_Preload from "./scenes/Scene_Preload.js";
import Scene_Menu_Main from "./scenes/Scene_Menu_Main.js";
import Scene_Menu_Settings from "./scenes/Scene_Menu_Settings.js";
import Scene_Game from "./scenes/Scene_Game.js";

Array.prototype.first = function()
{
	return this[0];
};
Array.prototype.last = function()
{
	return this[this.length - 1];
};
Array.prototype.shuffle = function()
{
	// https://stackoverflow.com/a/12646864
	for (let i = this.length - 1; i > 0; i--)
	{
		const j = Math.floor(Math.random() * (i + 1));
		[this[i], this[j]] = [this[j], this[i]];
	}

	return this;
};
Array.prototype.random = function()
{
	return this[Math.floor(Math.random() * this.length)];
};

class Bingo extends Phaser.Game
{
	constructor(anchor = "game-anchor")
	{
		super({
			type: Phaser.AUTO,
			backgroundColor: "#ffffff",
			scale: {
				parent: anchor.replace(/^#/, ""),
				mode: Phaser.Scale.FIT,
				autoCenter: Phaser.Scale.CENTER_BOTH,
				width: 1280,
				height: 720
			},
			scene: [ Scene_Preload, Scene_Menu_Main, Scene_Menu_Settings, Scene_Game ],
			physics: {
				default: "arcade",
				arcade: {
					debug: false,
					gravity: {}
				}
			},
			callbacks: {
				preBoot: (game) =>
				{
					game.settings = new SettingsManager();
					game.audio = new AudioManager({
						master: Phaser.Sound.SoundManagerCreator.create(game),
						music: Phaser.Sound.SoundManagerCreator.create(game),
						voice: Phaser.Sound.SoundManagerCreator.create(game),
						effects: Phaser.Sound.SoundManagerCreator.create(game)
					});

					for (const [ key, man ] of Object.entries(game.audio.managers))
						man.setVolume(game.settings.get("volumes")[key]);
				}
			},
			plugins: {
				scene: [{
					key: "rexUI",
					plugin: RexUIPlugin,
					mapping: "rexUI"
				}]
			}
		});

		this.score = 0;
		this.xp = 0;

		this.announcer = new Voicepack();
		this.connection = new ConnectionHandler(this);
	}
}

window.addEventListener("load", () =>
{
	new Bingo("#phaser-game");

	// Disable the RMB context menu in the game
	/*document.getElementById("phaser-game").oncontextmenu = function(e)
	{
		e.preventDefault();
		e.stopPropagation();
	};*/
});
