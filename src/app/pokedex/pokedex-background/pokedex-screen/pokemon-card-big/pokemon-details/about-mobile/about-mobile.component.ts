import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PokemonDataService } from '../../../../../../pokemon-data.service';

@Component({
  selector: 'app-about-mobile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-mobile.component.html',
  styleUrl: './about-mobile.component.scss'
})
export class AboutMobileComponent implements OnInit{
  @Input() selectedPokemonId: number | null = null;
  pokemonSpecies: any; // Speicher für das Pokémon
  pokemon: any; // Speicher für das Pokémon
  pokemonWeight: any;
  pokemonHeight: any;
  chainID: any;

  constructor(private pokemonDataService: PokemonDataService) { }

  async ngOnInit() {
    if (this.selectedPokemonId) {
      this.loadPokemonDetails(this.selectedPokemonId);
      await this.fetchAndProcessPokemonSpecies();
      this.loadPokemonSpeciesDetails(this.selectedPokemonId);
    }
  }

  loadPokemonDetails(selectedPokemonId: number) {
    const pokemons = this.pokemonDataService.getPokemons();

    if (pokemons) {
      this.pokemon = pokemons.find(p => p.id === selectedPokemonId) || null;
      this.calculateHeightAndWeight();
    } else {
      console.error('Pokemons data is null or undefined.');
    }
  }

  async fetchAndProcessPokemonSpecies() {
    try {
      const data = await this.pokemonDataService.fetchPokemonSpeciesData(this.selectedPokemonId!).toPromise();
      this.pushPokemonSpeciesInfoInArray(data);
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
      evo_url: eachPokemon['evolution_chain']['url'],
    };
    this.pokemonDataService.addPokemonSpecies(pokemonSpeciesData);
  }

  loadPokemonSpeciesDetails(selectedPokemonId: number) {
    const pokemonSpecies = this.pokemonDataService.getPokemonSpecies();

    // Prüfen, ob pokemonSpecies null ist
    if (pokemonSpecies && pokemonSpecies.id === selectedPokemonId) {
      this.pokemonSpecies = pokemonSpecies;
    } else {
      console.error('Pokemon species data is null or does not match the selected ID.');
    }
  }



  calculateHeightAndWeight() {
    this.pokemonHeight = +this.pokemon.height / 10;
    this.pokemonWeight = +this.pokemon.weight / 10;
  }

}
