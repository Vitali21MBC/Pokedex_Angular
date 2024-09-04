import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PokemonDataService } from '../../pokemon-data.service';
import { HttpClientModule } from '@angular/common/http';
import { PokemonCardSmallComponent } from './pokemon-card-small/pokemon-card-small.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-pokedex-screen',
  standalone: true,
  imports: [CommonModule, HttpClientModule, PokemonCardSmallComponent],
  templateUrl: './pokedex-screen.component.html',
  styleUrl: './pokedex-screen.component.scss'
})
export class PokedexScreenComponent implements OnInit {
  @ViewChild(PokemonCardSmallComponent) smallPokemonCards!: PokemonCardSmallComponent;

  isLoading: boolean = false;
  newPokemonLoaded = new Subject<void>();

  constructor(private pokemonDataService: PokemonDataService) { }

  ngOnInit(): void {
    this.initialLoadOfPokemon();
  }

  async initialLoadOfPokemon() {
    this.isLoading = true;
    for (let i = 2; i < 32; i++) {
      await this.fetchAndProcessPokemon();
    }
    this.isLoading = false;
  }

  async fetchAndProcessPokemon() {
    try {
      const data = await this.pokemonDataService.fetchPokemonOverviewData().toPromise();
      this.pushPokemonInfoInArray(data);
    } catch (error) {
      console.error('Fehler beim Laden der Pokemon-Daten:', error);
    }
  }

  pushPokemonInfoInArray(eachPokemon: any) {
    if (eachPokemon['types'].length === 2) {
      this.pushTwoTypesInArray(eachPokemon);
    } else if (eachPokemon['types'].length === 1) {
      this.pushOneTypeInArray(eachPokemon);
    }
  }

  pushTwoTypesInArray(eachPokemon: any) {
    const pokemonBasicData = {
      id: eachPokemon['id'],
      name: eachPokemon['name'],
      type_1: eachPokemon['types'][0]['type']['name'],
      type_2: eachPokemon['types'][1]['type']['name'],
      sprite: eachPokemon['sprites']['front_default'],
    };
    this.pokemonDataService.addPokemon(pokemonBasicData);
  }

  pushOneTypeInArray(eachPokemon: any) {
    const pokemonBasicData = {
      id: eachPokemon['id'],
      name: eachPokemon['name'],
      type_1: eachPokemon['types'][0]['type']['name'],
      sprite: eachPokemon['sprites']['front_default'],
    };
    this.pokemonDataService.addPokemon(pokemonBasicData);
  }

  async loadMorePokemon() {
    this.isLoading = true;
    for (let i = 2; i < 32; i++) {
      await this.fetchAndProcessPokemon();
      this.newPokemonLoaded.next();
    }
    this.isLoading = false;
    console.log('New Pokemon loaded, emitting event'); // Debug log
  }

  searchPokemon() {
    const searchElement = document.getElementById('searchPokemon') as HTMLInputElement;

    if (searchElement) {
      let search = searchElement.value.toLowerCase();

      if (search.length >= 3) {
        // Filtere die Pokémon-Liste basierend auf der Suchanfrage
        const filteredPokemons = this.pokemonDataService.getPokemons().filter((element: any) => {
          return element['type_1'].toLowerCase().includes(search) ||
            element['name'].toLowerCase().includes(search);
        });

        // Setze die gefilterte Liste in der Child-Komponente
        this.smallPokemonCards.setFilteredPokemons(filteredPokemons);
      } else {
        // Setze alle Pokémon zurück, wenn der Suchbegriff weniger als 3 Zeichen hat
        this.smallPokemonCards.setFilteredPokemons(this.pokemonDataService.getPokemons());
      }
    }
  }
}