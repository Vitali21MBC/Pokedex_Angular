import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-efe-desktop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './efe-desktop.component.html',
  styleUrl: './efe-desktop.component.scss'
})
export class EFEDesktopComponent {
  @Input() selectedPokemonId: number | null = null;
  @Input() lvlUpTrigger: string | null = null;
  @Input() pokemon: any;
  @Input() pokemonDetailsOfEvoChain: any;
}
