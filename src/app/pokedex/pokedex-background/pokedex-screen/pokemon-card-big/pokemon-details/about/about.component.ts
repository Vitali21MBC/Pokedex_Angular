import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PokemonDataService } from '../../../../../../pokemon-data.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {
  @Input() selectedPokemonId: number | null = null;
  pokemonSpecies: any; // Speicher für das Pokémon
  pokemon: any; // Speicher für das Pokémon
  pokemonWeight: any;
  pokemonHeight: any;

  constructor(private pokemonDataService: PokemonDataService) { }

  async ngOnInit() {
    if (this.selectedPokemonId) {
      console.log('Pokemon ID von ZU ABout:', this.selectedPokemonId);
      await this.loadingPokemonSpeciesData();
      this.loadPokemonSpeciesDetails(this.selectedPokemonId);
      this.loadPokemonDetails(this.selectedPokemonId);
    }
  }

  async loadingPokemonSpeciesData() {
    await this.fetchAndProcessPokemonSpecies();
  }

  async fetchAndProcessPokemonSpecies() {
    try {
      const data = await this.pokemonDataService.fetchPokemonSpeciesData(this.selectedPokemonId!).toPromise();
      this.pushPokemonSpeciesInfoInArray(data);
      console.log("LOL", data);
    } catch (error) {
      console.error('Fehler beim Laden der Pokemon-Spezies-Daten:', error);
    }
  }

  pushPokemonSpeciesInfoInArray(eachPokemon: any) {
    const pokemonSpeciesData = {
      id: eachPokemon['id'],
      name: eachPokemon['name'],
      flavor_text: eachPokemon['flavor_text_entries']['15']['flavor_text'],
      genus: eachPokemon['genera']['7']['genus'],
      habitat: eachPokemon['habitat']['name'],
      capture_rate: eachPokemon['capture_rate'],
      growth_rate: eachPokemon['growth_rate']['name'],
    };
    this.pokemonDataService.addPokemonSpecies(pokemonSpeciesData);
    console.log("Pokemon SPEZIES DATA: ", pokemonSpeciesData);
  }

  loadPokemonSpeciesDetails(selectedPokemonId: number) {
    const pokemons = this.pokemonDataService.getPokemonSpecies();
    console.log('pokemon SPEZIES From Service:', pokemons); // Überprüfe die Liste der Pokémon
    this.pokemonSpecies = pokemons.find(p => p.id === selectedPokemonId) || null;
    console.log('Found pokemon Species ID form Service:', selectedPokemonId);
    console.log('Found pokemon Species form Service:', this.pokemonSpecies);
  }

  loadPokemonDetails(selectedPokemonId: number) {
    const pokemons = this.pokemonDataService.getPokemons();
    console.log('pokemon From Service:', pokemons); // Überprüfe die Liste der Pokémon
    this.pokemon = pokemons.find(p => p.id === selectedPokemonId) || null;
    console.log('Found pokemon ID form Service:', selectedPokemonId);
    console.log('Found pokemon form Service:', this.pokemon);
    this.calculateHeightAndWeight();
  }

  calculateHeightAndWeight(){
    this.pokemonHeight = +this.pokemon.height / 10;
    this.pokemonWeight = +this.pokemon.weight / 10;
  }
}
