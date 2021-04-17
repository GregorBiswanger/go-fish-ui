import { Pipe, PipeTransform } from '@angular/core';
import Card from 'src/models/Card';

@Pipe({
  name: 'cardToImagePath'
})
export class CardToImagePathPipe implements PipeTransform {

  transform(card: Card, ...args: unknown[]): string {
    const firstColorLetter = this.colors[card.color];
    const valueAsNumberOfFirstLetter = this.values[card.value];

    return `/assets/cards/${valueAsNumberOfFirstLetter}${firstColorLetter}.png`
  }

  colors = {
    'Hearts': 'H',
    'Tiles': 'D',
    'Clovers': 'C',
    'Pikes': 'S'
  }

  values = {
    'Two': 2,
    'Three': 3,
    'Four': 4,
    'Five': 5,
    'Six': 6,
    'Seven': 7,
    'Eight': 8,
    'Nine': 9,
    'Ten': 10,
    'Ace': 'A',
    'Jack': 'J',
    'King': 'K',
    'Queen': 'Q'
  }
}
