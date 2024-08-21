import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PokemonCardSmallComponent } from '../../pokemon-card-small/pokemon-card-small.component';

@Component({
  selector: 'app-pokedex-screen',
  standalone: true,
  imports: [CommonModule, PokemonCardSmallComponent],
  templateUrl: './pokedex-screen.component.html',
  styleUrl: './pokedex-screen.component.scss'
})
export class PokedexScreenComponent {

}
