import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-oftse-desktop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './oftse-desktop.component.html',
  styleUrl: './oftse-desktop.component.scss'
})
export class OftseDesktopComponent {
  @Input() selectedPokemonId: number | null = null;
  @Input() lvlUpTrigger: string | null = null;
  @Input() pokemon: any;
  @Input() pokemonDetailsOfEvoChain: any;
}
