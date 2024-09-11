import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  type_1: string;
  type_2?: string;
  sprite: string;
  sprite_big: string;
  sprite_shiny: string;
}

interface PokemonSpecies {
  id: number;
  name: string;
  flavor_text: string;
  genus: string;
  habitat: string;
  capture_rate: number;
  growth_rate: string;
}

@Injectable({
  providedIn: 'root'
})
export class PokemonDataService {
  public pokemonIndex = 1;
  private pokemons: Pokemon[] = [];
  private pokemonSpecies: PokemonSpecies[] = [];

  private pokemonInfoIsOpenSubject = new BehaviorSubject<boolean>(false);
  public pokemonInfoIsOpen$ = this.pokemonInfoIsOpenSubject.asObservable();

  constructor(private http: HttpClient) { }

  readonly pokemonTypes = [
    { "type": "normal", "color": "#A8A77A", "colorLight": "#F5F5DC" },
    { "type": "fire", "color": "#FB6C6C", "colorLight": "#F8D8D8" },
    { "type": "water", "color": "#76BDFE", "colorLight": "#D8F0F8" },
    { "type": "electric", "color": "#FFD86F", "colorLight": "#F8F0D8" },
    { "type": "grass", "color": "#48D0B0", "colorLight": "#D8F8D8" },
    { "type": "ice", "color": "#98D8D8", "colorLight": "#E0F8F8" },
    { "type": "fighting", "color": "#C03028", "colorLight": "#F0D8D8" },
    { "type": "poison", "color": "#A040A0", "colorLight": "#E0D8F0" },
    { "type": "ground", "color": "#B1736C", "colorLight": "#F0E0D8" },
    { "type": "flying", "color": "#A890F0", "colorLight": "#D8E0F8" },
    { "type": "psychic", "color": "#7C538C", "colorLight": "#F8D8E0" },
    { "type": "bug", "color": "#A8B820", "colorLight": "#D8F0E0" },
    { "type": "rock", "color": "#B8A038", "colorLight": "#E0D8E0" },
    { "type": "ghost", "color": "#705898", "colorLight": "#E0E0F8" },
    { "type": "dragon", "color": "#7038F8", "colorLight": "#E0D8F8" },
    { "type": "dark", "color": "#705848", "colorLight": "#D8D8E0" },
    { "type": "steel", "color": "#B8B8D0", "colorLight": "#D8D8D8" },
    { "type": "fairy", "color": "#E0A8E0", "colorLight": "#F8E0F8" },
  ];

  readonly moveLearnMethod = ['Level Up', 'TM/HM', 'Egg', 'Tutor'];

  readonly pokemonGameVersions = ['RB', 'Y', 'GS', 'C', 'RS', 'E', 'FRLG', 'DP', 'P', 'HGSS', 'BW', 'B2W2', 'XY', 'ORAS', 'SM', 'USUM', 'LGPLGE', 'SS', 'BDSP', 'SV'];

  fetchPokemonOverviewData(): Observable<any> {
    const url = `https://pokeapi.co/api/v2/pokemon/${this.pokemonIndex}`;
    console.log(this.pokemonIndex);
    this.pokemonIndex++;
    return this.http.get(url);
  }

  getPokemonById(id: number): Pokemon | undefined {
    return this.pokemons.find(pokemon => pokemon.id === id);
  }

  addPokemon(pokemon: Pokemon) {
    this.pokemons.push(pokemon);
    console.log(pokemon.id);
  }

  getPokemons(): Pokemon[] {
    console.log('Pokemon Basic Data geholt aus Service', this.pokemons);
    return this.pokemons;
  }

  getPokemonTypes() {
    return this.pokemonTypes;
  }

  // Methode, um den Zustand von pokemonInfoIsOpen zu setzen
  setPokemonInfoIsOpen(isOpen: boolean) {
    this.pokemonInfoIsOpenSubject.next(isOpen);  // Zustand ändern
  }

  fetchPokemonSpeciesData(pokemonId: number): Observable<any> {
    const url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`;
    return this.http.get(url);
  }

  addPokemonSpecies(pokemon: PokemonSpecies) {
    this.pokemonSpecies.push(pokemon);
    console.log("Gepushpter Datensatz: ", pokemon);
    console.log("Array Nach dem pushen: ", this.pokemonSpecies);
  }

  getPokemonSpecies(): PokemonSpecies[] {
    console.log('Pokemon Species Data geholt aus Service', this.pokemonSpecies);
    return this.pokemonSpecies;
  }
}
