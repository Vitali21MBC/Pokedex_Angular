import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-thfe-desktop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './thfe-desktop.component.html',
  styleUrl: './thfe-desktop.component.scss'
})
export class THFEDesktopComponent {
  @Input() selectedPokemonId: number | null = null;
  @Input() lvlUpTrigger: string | null = null;
  @Input() pokemon: any;
  @Input() pokemonDetailsOfEvoChain: any;
}
