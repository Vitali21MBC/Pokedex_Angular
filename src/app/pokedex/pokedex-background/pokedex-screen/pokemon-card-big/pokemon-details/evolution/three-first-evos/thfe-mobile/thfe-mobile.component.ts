import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-thfe-mobile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './thfe-mobile.component.html',
  styleUrl: './thfe-mobile.component.scss'
})
export class THFEMobileComponent {
  @Input() selectedPokemonId: number | null = null;
  @Input() lvlUpTrigger: string | null = null;
  @Input() pokemon: any;
  @Input() pokemonDetailsOfEvoChain: any;
}
