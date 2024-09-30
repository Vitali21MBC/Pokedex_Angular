import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tfe-desktop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tfe-desktop.component.html',
  styleUrl: './tfe-desktop.component.scss'
})
export class TfeDesktopComponent {
  @Input() selectedPokemonId: number | null = null;
  @Input() lvlUpTrigger: string | null = null;
  @Input() pokemon: any;
  @Input() pokemonDetailsOfEvoChain: any;

}
