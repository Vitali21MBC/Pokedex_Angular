import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ofose-mobile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ofose-mobile.component.html',
  styleUrl: './ofose-mobile.component.scss'
})
export class OFOSEMobileComponent {
  @Input() selectedPokemonId: number | null = null;
  @Input() lvlUpTrigger: string | null = null;
  @Input() pokemon: any;
  @Input() pokemonDetailsOfEvoChain: any;
}
