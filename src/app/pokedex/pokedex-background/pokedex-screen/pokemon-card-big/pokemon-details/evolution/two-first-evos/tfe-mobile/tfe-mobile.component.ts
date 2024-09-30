import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tfe-mobile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tfe-mobile.component.html',
  styleUrl: './tfe-mobile.component.scss'
})
export class TfeMobileComponent {
  @Input() selectedPokemonId: number | null = null;
  @Input() lvlUpTrigger: string | null = null;
  @Input() pokemon: any;
  @Input() pokemonDetailsOfEvoChain: any;

}
