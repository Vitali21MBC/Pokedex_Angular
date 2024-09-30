import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ofose-desktop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ofose-desktop.component.html',
  styleUrl: './ofose-desktop.component.scss'
})
export class OFOSEDesktopComponent {
  @Input() selectedPokemonId: number | null = null;
  @Input() lvlUpTrigger: string | null = null;
  @Input() pokemon: any;
  @Input() pokemonDetailsOfEvoChain: any;
}
