import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
      console.log('pokemonId changed:', this.selectedPokemonId);
      this.loadPokemonDetails();
    }
  }

  loadPokemonDetails() {
    const pokemons = this.pokemonDataService.getPokemons();
    console.log('All pokemons:', pokemons); // Überprüfe die Liste der Pokémon
    this.pokemon = pokemons.find(p => p.id === this.selectedPokemonId) || null;
    console.log('Found pokemon:', this.pokemon);
  }

  getPokemons() {
    const pokemons = this.pokemonDataService.getPokemons();
    console.log('Pokemons from service:', pokemons); // Überprüfe die Struktur der Daten
    return pokemons;
  }

  formatPokemonId(id: number): string {
    if (id < 10) return `#000${id}`;
    else if (id < 100) return `#00${id}`;
    else if (id < 1000) return `#0${id}`;
    else return `#${id}`;
  }
}
