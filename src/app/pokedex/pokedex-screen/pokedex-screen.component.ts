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
    for (let i = 2; i < 32; i++) {
      await this.fetchAndProcessPokemon();
    }
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
}