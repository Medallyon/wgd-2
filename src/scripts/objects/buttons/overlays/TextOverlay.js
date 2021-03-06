import * as Phaser from "phaser";

import BaseOverlay from "./BaseOverlay.js";

class TextOverlay extends BaseOverlay
{
	constructor(scene, text, data = { text: {} })
	{
		super(Object.assign({ scene }, data));

		this.text = new Phaser.GameObjects.Text(this.scene, 0, 0, text, Object.assign({
			align: "center",
			fontSize: 64
		}, data.text))
			.setOrigin(.5, .5)
			.setResolution(1);
		this.add(this.text);
	}
}

export default TextOverlay;
