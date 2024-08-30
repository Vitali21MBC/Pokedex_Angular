import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PokemonDataService } from '../pokemon-data.service';
import { HttpClientModule } from '@angular/common/http';

// interface Pokemon {
//   id: number;
//   name: string;
//   type_1: string;
//   type_2?: string;
//   sprite: string;
// }

@Component({
  selector: 'app-pokemon-card-small',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './pokemon-card-small.component.html',
  styleUrl: './pokemon-card-small.component.scss'
})
export class PokemonCardSmallComponent implements OnInit {
  // pokemons: Pokemon[] = [];

  constructor(private pokemonDataService: PokemonDataService) { }

  ngOnInit(): void {
    this.initialLoadOfPokemon();
  }

  async initialLoadOfPokemon() {
    for (let i = 2; i < 32; i++) {
      await this.fetchAndProcessPokemon();
    }
    await this.loadPokemonAsBuffer();
  }

  async loadPokemonAsBuffer() {
    for (let i = 2; i < 32; i++) {
      await this.fetchAndProcessPokemon();
    }
  }

  async fetchAndProcessPokemon() {
    try {
      const data = await this.pokemonDataService.fetchPokemonOverviewData().toPromise();
      this.pushPokemonInfoInArray(data);
      // console.log(data);
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
    if (pokemonBasicData.id <= 30 || pokemonBasicData.id < (pokemonBasicData.id - 31)) {
      this.pokemonDataService.addPokemon(pokemonBasicData);
    }
    console.log(pokemonBasicData);
  }

  pushOneTypeInArray(eachPokemon: any) {
    const pokemonBasicData = {
      id: eachPokemon['id'],
      name: eachPokemon['name'],
      type_1: eachPokemon['types'][0]['type']['name'],
      sprite: eachPokemon['sprites']['front_default'],
    };
    if (pokemonBasicData.id <= 30 || pokemonBasicData.id < (pokemonBasicData.id - 31)) {
      this.pokemonDataService.addPokemon(pokemonBasicData);
    }
    console.log(pokemonBasicData);
  }

  getPokemons() {
    return this.pokemonDataService.getPokemons();
  }

  formatPokemonId(id: number): string {
    if (id < 10) return `#00${id}`;
    else if (id < 100) return `#0${id}`;
    else return `#${id}`;
  }

  backgroundColorAsType(type: string): string {
    const pokemonTypes = this.pokemonDataService.getPokemonTypes();
    const matchedType = pokemonTypes.find(t => t.type === type);
    return matchedType ? matchedType.color : 'gray';
  }

}
