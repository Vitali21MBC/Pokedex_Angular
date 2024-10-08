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
  abilities: string[];
  moves: string[];
}

interface PokemonSpecies {
  id: number;
  name: string;
  flavor_text: string;
  genus: string;
  habitat: string;
  capture_rate: number;
  growth_rate: string;
  evo_url: string;
}

export interface EvolutionDetails {
  gender: number | null;
  held_item: string | null;
  item: string | null;
  known_move: string | null;
  known_move_type: string | null;
  location: string | null;
  min_affection: number | null;
  min_beauty: number | null;
  min_happiness: number | null;
  min_level: number | null;
  needs_overworld_rain: boolean;
  party_species: string | null;
  party_type: string | null;
  relative_physical_stats: number | null;
  time_of_day: string;
  trade_species: string | null;
  trigger: string;
  turn_upside_down: boolean;
}

export interface Evolution {
  name: string;
  evolves_to: Evolution[];
  evolution_details: EvolutionDetails[]; // Evolution-Anforderungen
}

export interface PokemonEvolutions {
  base_pokemon: string;
  evolutions: Evolution[]; // Verschachtelte Evolutionen
}
interface BasePokemon {
  id: number,
  name: string,
  sprite_big: string,
}

interface PokemonFirstEvolutions {
  id: number,
  name: string,
  sprite_big: string,
}

interface PokemonSecondEvolutions {
  id: number,
  name: string,
  sprite_big: string,
}

export interface MovesData {
  name: string,
  gameGeneration: string,
  levelLearnedAt: number,
  learnMethod: string,
  type: string,
  damageClass: string,
  power: number,
  powerPoint: number,
  accuracy: number,
}

@Injectable({
  providedIn: 'root'
})
export class PokemonDataService {

  public basicDataURL = "https://pokeapi.co/api/v2/pokemon/";
  private speciesDataURL = "https://pokeapi.co/api/v2/pokemon-species/";
  private moveDataURL = "https://pokeapi.co/api/v2/move/";

  public pokemonIndex = 1;
  private pokemons: Pokemon[] = [];
  private pokemonSpecies: PokemonSpecies | null = null;
  private pokemonEvolutions: PokemonEvolutions | null = null;
  public basePokemon: PokemonFirstEvolutions | null = null;
  public pokemonFirstEvolutions: PokemonFirstEvolutions[] = [];
  public pokemonSecondEvolutions: PokemonSecondEvolutions | null = null;

  private pokemonInfoIsOpenSubject = new BehaviorSubject<boolean>(false);
  public pokemonInfoIsOpen$ = this.pokemonInfoIsOpenSubject.asObservable();

  private pokemonMovesData: MovesData[] = [];

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
    { "type": "bug", "color": "#A8B820", "colorLight": "#e9f1ac" },
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
    const url = this.basicDataURL + this.pokemonIndex;
    this.pokemonIndex++;
    return this.http.get(url);
  }

  getPokemonById(id: number): Pokemon | undefined {
    return this.pokemons.find(pokemon => pokemon.id === id);
  }

  addPokemon(pokemon: Pokemon) {
    this.pokemons.push(pokemon);
  }

  getPokemons(): Pokemon[] {
    return this.pokemons;
  }

  getPokemonTypes() {
    return this.pokemonTypes;
  }

  extractFormattedMoves(pokemonData: any): any[] {
    return pokemonData.moves.map((moveItem: any) => ({
      name: moveItem.move.name,
      version_group_details: moveItem.version_group_details.map((detail: any) => ({
        level_learned_at: detail.level_learned_at,
        move_learn_method_name: detail.move_learn_method.name,
        version_group_name: detail.version_group.name
      }))
    }));
  }

  // Methode, um den Zustand von pokemonInfoIsOpen zu setzen
  setPokemonInfoIsOpen(isOpen: boolean) {
    this.pokemonInfoIsOpenSubject.next(isOpen);  // Zustand ändern
  }

  fetchPokemonSpeciesData(pokemonId: number): Observable<any> {
    const url = this.speciesDataURL + pokemonId;
    return this.http.get(url);
  }

  addPokemonSpecies(pokemon: PokemonSpecies) {
    this.pokemonSpecies = pokemon;
  }

  getPokemonSpecies(): PokemonSpecies | null {
    return this.pokemonSpecies;

  }



  fetchPokemonEvolutionsData(): Observable<any> {
    if (this.pokemonSpecies && this.pokemonSpecies.evo_url) {
      const url = this.pokemonSpecies.evo_url;
      return this.http.get(url);
    } else {
      throw new Error("Pokemon species data is null or undefined");
    }
  }

  addPokemonEvolutions(pokemon: PokemonEvolutions) {
    this.pokemonEvolutions = pokemon;  // Speichere das Pokemon als einzelnes Objekt
  }

  getPokemonEvolutions(): PokemonEvolutions | null {
    return this.pokemonEvolutions;
  }

  fetchEachPokemon(pokemonName: string): Observable<any> {
    const url = this.basicDataURL + pokemonName;
    return this.http.get(url);
  }

  addEachPokemon(pokemon: PokemonFirstEvolutions) {
    this.pokemonFirstEvolutions.push(pokemon);  // Speichere das Pokemon als einzelnes Objekt
    console.log("???????????????", this.pokemonFirstEvolutions);
  }

  getEachPokemon(): PokemonFirstEvolutions[] {
    return this.pokemonFirstEvolutions;
  }


  fetchPokemonMovesData(move: string): Observable<any> {
    const url = this.moveDataURL + move;
    console.log("Move URL", url);
    return this.http.get(url);
  }

  addPokemonMovesData(move: MovesData) {
    this.pokemonMovesData.push(move);
    console.log("Gepushte Moves", this.pokemonMovesData);
  }

  getPokemonMovesData(): MovesData[] {
    return this.pokemonMovesData;
  }

  clearPokemonMovesData() {
    this.pokemonMovesData = [];
  }
  
}