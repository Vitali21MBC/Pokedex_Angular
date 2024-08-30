import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PokemonCardSmallComponent } from '../../pokemon-card-small/pokemon-card-small.component';
import { PokemonDataService } from '../../pokemon-data.service';

@Component({
  selector: 'app-pokedex-screen',
  standalone: true,
  imports: [CommonModule, PokemonCardSmallComponent],
  templateUrl: './pokedex-screen.component.html',
  styleUrl: './pokedex-screen.component.scss'
})
export class PokedexScreenComponent {

  constructor(private pokemonDataService: PokemonDataService) { }

  async loadMorePokemon() {
    console.log("Geklickt");
    for (let i = 0; i < this.pokemonDataService.getPokemons().length; i++) {
      // await this.fetchAndProcessPokemon();
    }
    // await this.loadPokemonAsBuffer();
  }

}
