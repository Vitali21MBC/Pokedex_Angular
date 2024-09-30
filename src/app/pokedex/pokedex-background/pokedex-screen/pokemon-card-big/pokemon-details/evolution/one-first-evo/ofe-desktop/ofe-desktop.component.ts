import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ofe-desktop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ofe-desktop.component.html',
  styleUrl: './ofe-desktop.component.scss'
})
export class OfeDesktopComponent {
  @Input() selectedPokemonId: number | null = null;
  @Input() lvlUpTrigger: string | null = null;
  @Input() pokemon: any;
  @Input() pokemonDetailsOfEvoChain: any;

}
