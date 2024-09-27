import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-three-first-evos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './three-first-evos.component.html',
  styleUrl: './three-first-evos.component.scss'
})
export class ThreeFirstEvosComponent {
  @Input() selectedPokemonId: number | null = null;
  @Input() lvlUpTrigger: string | null = null;
  @Input() pokemon: any;
  @Input() pokemonDetailsOfEvoChain: any;
}
