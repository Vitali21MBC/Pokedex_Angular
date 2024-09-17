import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-one-first-one-second-evo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './one-first-one-second-evo.component.html',
  styleUrl: './one-first-one-second-evo.component.scss'
})
export class OneFirstOneSecondEvoComponent {
  @Input() selectedPokemonId: number | null = null;
  @Input() lvlUpTrigger: string | null = null;
  @Input() lvlUpTriggerSecondEvo: string | null = null;
  @Input() pokemon: any;
  @Input() firstEvoPokemonName: any;
  @Input() secondEvoPokemonName: any;
}
