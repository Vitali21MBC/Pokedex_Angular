import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-oftse-mobile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './oftse-mobile.component.html',
  styleUrl: './oftse-mobile.component.scss'
})
export class OftseMobileComponent {
  @Input() selectedPokemonId: number | null = null;
  @Input() lvlUpTrigger: string | null = null;
  @Input() pokemon: any;
  @Input() pokemonDetailsOfEvoChain: any;
}
