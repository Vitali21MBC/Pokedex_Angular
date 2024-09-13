import { Component, Input, OnInit } from '@angular/core';
import { PokemonDataService } from '../../../../../pokemon-data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-illustration',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-illustration.component.html',
  styleUrl: './pokemon-illustration.component.scss'
})
export class PokemonIllustrationComponent implements OnInit {
  @Input() selectedPokemonId: number | null = null;
  pokemon: any; // Speicher für das Pokémon
  pokemonTypes: any[] = []; // Speicher für die Typen

  constructor(private pokemonDataService: PokemonDataService) { }

  ngOnInit() {
    if (this.selectedPokemonId) {
      this.loadPokemonDetails();
    }
  }

  loadPokemonDetails() {
    const pokemons = this.pokemonDataService.getPokemons();
    this.pokemon = pokemons.find(p => p.id === this.selectedPokemonId) || null;
  }

  getPokemons() {
    const pokemons = this.pokemonDataService.getPokemons();
    return pokemons;
  }

  formatPokemonId(id: number): string {
    if (id < 10) return `#000${id}`;
    else if (id < 100) return `#00${id}`;
    else if (id < 1000) return `#0${id}`;
    else return `#${id}`;
  }

  backgroundColorAsType(type: string): string {
    const pokemonTypes = this.pokemonDataService.getPokemonTypes();
    const matchedType = pokemonTypes.find(t => t.type === type);
    return matchedType ? matchedType.color : 'gray';
  }
}
