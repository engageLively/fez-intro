/* global Audio */
import { Morph, Text, part, Image } from 'lively.morphic';
import { pt, Color } from 'lively.graphics';
import { ButtonDefault } from 'lively.components/buttons.cp.js';
'format esm';
export class FezHolder extends Morph {
  get texts () {
    return [
      { text: 25, position: pt(72, 124) },
      { text: 15, position: pt(72, 175) },
      { text: 1, position: pt(72, 221) },
      { text: 25, position: pt(72, 271) },
      { text: 15, position: pt(72, 321) },
      { text: 1, position: pt(72, 371) },
      { text: 25, position: pt(72, 421) },
      { text: 15, position: pt(72, 471) },
      { text: 1, position: pt(72, 521) }
    ];
  }

  onLoad () {
    this.extent = pt(1920, 1080);
    this.position = pt(0, 0);

    this.background = new Image({
      // imageUrl: 'https://matt.engagelively.com/assets/ITF/Marketplace_Scene_5.png',
      imageUrl: 'https://matt.engagelively.com/assets/ITF/Intro-to-Fez-Background.png',
      autoResize: true,
      name: 'market',
      position: pt(0, 0),
      borderwidth: 0
    });
    this.startButton = part(ButtonDefault, {
      fill: Color.rgb(245, 124, 0),
      position: pt(899, 450),
      extent: pt(144, 52),
      name: 'start'
    });

    const label = this.startButton.getSubmorphNamed('label');
    label.fontFamily = 'Sans-serif';
    label.fontSize = 24;
    label.textString = 'Start Game';
    label.fontColor = Color.white;
    this.addMorph(this.startButton);
    this.startButton.viewModel.action = _ => { this.play(); this.startButton.remove(); };

    this.addMorph(this.background);
    this.inventory = new Image({
      imageUrl: 'https://matt.engagelively.com/assets/ITF/Fez_Sim_Inventory_NEW-removebg-preview.png',
      fill: Color.rgba(0, 0, 0, 0),
      borderwidth: 0,
      autoResize: true,
      name: 'inventory',
      position: pt(1200, 200)
    });
    this.addMorph(this.inventory);
    this.addMorph(this.startButton);
    this.spiel = new Audio('https://matt.engagelively.com/assets/ITF/IBN_audio_for_Interim_page_inlcuding_Inventory_list.wav');
    this.whenRendered().then(_ => {
      const xScale = Math.min(window.innerWidth / 1920, 1);
      const yScale = Math.min(window.innerHeight / 1080, 1);
      this.scale = Math.min(xScale, yScale);
      const pixels = pt(this.extent.x, this.extent.y).scaleBy(this.scale);
      this.position = pt(window.innerWidth, window.innerHeight).subPt(pixels).scaleBy(0.5);
    });
  }

  play () {
    this.spiel.play();
    this.showInventory();
  }

  showInventory () {
    this.index = 0;
    this.clearItems();
    this.startStepping(30000 / this.texts.length, 'showNextItem');
  }

  clearItems () {
    if (this.items) {
      this.items.forEach(item => item.remove());
    }
    this.items = [];
  }

  showNextItem () {
    if (this.index == this.texts.length) {
      this.stopStepping();
    } else {
      const item = new Text({
        textString: this.texts[this.index].text,
        position: this.texts[this.index].position,
        textAlign: 'center',
        fixedWidth: true,
        fixedHeight: true,
        borderWidth: 0,
        fill: Color.rgba(0, 0, 0, 0),
        extent: pt(24, 32),
        fontFamily: 'Garamond',
        fontSize: 17,
        fontColor: Color.rgb(152, 47, 10)
      });
      this.inventory.addMorph(item);
      this.items.push(item);
      this.index++;
    }
  }
}

export async function main () {
  new FezHolder().openInWorld();
  $world.fill = Color.brown;
}
