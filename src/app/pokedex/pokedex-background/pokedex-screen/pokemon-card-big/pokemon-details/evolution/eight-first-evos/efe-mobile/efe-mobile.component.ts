import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-efe-mobile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './efe-mobile.component.html',
  styleUrl: './efe-mobile.component.scss'
})
export class EFEMobileComponent {
  @Input() selectedPokemonId: number | null = null;
  @Input() lvlUpTrigger: string | null = null;
  @Input() pokemon: any;
  @Input() pokemonDetailsOfEvoChain: any;
  indices = Array.from({ length: 8 }, (_, index) => index+1);
}
