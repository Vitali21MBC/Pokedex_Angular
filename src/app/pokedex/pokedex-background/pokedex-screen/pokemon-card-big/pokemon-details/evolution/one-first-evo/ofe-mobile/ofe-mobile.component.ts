import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ofe-mobile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ofe-mobile.component.html',
  styleUrl: './ofe-mobile.component.scss'
})
export class OfeMobileComponent {
  @Input() selectedPokemonId: number | null = null;
  @Input() lvlUpTrigger: string | null = null;
  @Input() pokemon: any;
  @Input() pokemonDetailsOfEvoChain: any;

}
