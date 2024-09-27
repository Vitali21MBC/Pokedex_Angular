import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-one-first-two-second-evos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './one-first-two-second-evos.component.html',
  styleUrl: './one-first-two-second-evos.component.scss'
})
export class OneFirstTwoSecondEvosComponent {
  @Input() selectedPokemonId: number | null = null;
  @Input() lvlUpTrigger: string | null = null;
  @Input() pokemon: any;
  @Input() firstEvoPokemonName: any;
}
