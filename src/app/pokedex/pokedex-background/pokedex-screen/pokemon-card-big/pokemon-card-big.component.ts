import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PokemonIllustrationComponent } from './pokemon-illustration/pokemon-illustration.component';
import { PokemonDetailsComponent } from './pokemon-details/pokemon-details.component';

@Component({
  selector: 'app-pokemon-card-big',
  standalone: true,
  imports: [CommonModule, PokemonIllustrationComponent, PokemonDetailsComponent],
  templateUrl: './pokemon-card-big.component.html',
  styleUrl: './pokemon-card-big.component.scss'
})
export class PokemonCardBigComponent {
  @Input() selectedPokemonId: number | null = null;
}
