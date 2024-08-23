import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PokemonDataService } from '../pokemon-data.service';
import { HttpClientModule } from '@angular/common/http';

interface Pokemon {
  id: number;
  name: string;
  type_1: string;
  type_2?: string;
  sprite: string;
}

@Component({
  selector: 'app-pokemon-card-small',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './pokemon-card-small.component.html',
  styleUrl: './pokemon-card-small.component.scss'
})
export class PokemonCardSmallComponent implements OnInit {
  pokemons: Pokemon[] = [];

  constructor(private pokemonDataService: PokemonDataService) { }

  ngOnInit(): void {
    this.initialLoadOfPokemon();
  }

  async initialLoadOfPokemon() {
    for (let i = 2; i < 32; i++) {
      await this.fetchAndProcessPokemon();
    }
    this.loadPokemonAsBuffer();
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
    const pokemonBasicData: Pokemon = {
      id: eachPokemon['id'],
      name: eachPokemon['name'],
      type_1: eachPokemon['types'][0]['type']['name'],
      type_2: eachPokemon['types'][1]['type']['name'],
      sprite: eachPokemon['sprites']['front_default'],
    };
    this.pokemons.push(pokemonBasicData);
  }

  pushOneTypeInArray(eachPokemon: any) {
    const pokemonBasicData: Pokemon = {
      id: eachPokemon['id'],
      name: eachPokemon['name'],
      type_1: eachPokemon['types'][0]['type']['name'],
      sprite: eachPokemon['sprites']['front_default'],
    };
    this.pokemons.push(pokemonBasicData);
  }

  loadPokemonAsBuffer() {
    // Implementiere eine Logik für das Puffern der Pokémon, falls erforderlich
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







  onMouseEnter(event: MouseEvent, index: number): void {
    const cardElement = document.getElementById(`overviewPokemonCard${index}`);
    if (!cardElement) return;

    const timeoutId = setTimeout(() => {
      cardElement.classList.add('is-flipped');
    }, 1000);

    cardElement.setAttribute('data-timeout-id', timeoutId.toString());
  }

  // Event-Handler für das Verlassen des Hovers
  onMouseLeave(event: MouseEvent, index: number): void {
    const cardElement = document.getElementById(`overviewPokemonCard${index}`);
    if (!cardElement) return;

    const timeoutId = cardElement.getAttribute('data-timeout-id');
    if (timeoutId) {
      clearTimeout(parseInt(timeoutId));
      cardElement.removeAttribute('data-timeout-id');
    }

    cardElement.classList.remove('is-flipped');
  }
}
