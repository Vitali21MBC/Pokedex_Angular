import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PokemonDataService, PokemonEvolutions, Evolution, EvolutionDetails } from '../../../../../../pokemon-data.service';
import { OneFirstEvoComponent } from "./one-first-evo/one-first-evo.component";
import { NoEvolutionComponent } from "./no-evolution/no-evolution.component";
import { OneFirstOneSecondEvoComponent } from './one-first-one-second-evo/one-first-one-second-evo.component';
import { TwoFirstEvosComponent } from './two-first-evos/two-first-evos.component';
import { OneFirstTwoSecondEvosComponent } from './one-first-two-second-evos/one-first-two-second-evos.component';
import { ThreeFirstEvosComponent } from './three-first-evos/three-first-evos.component';
import { EightFirstEvosComponent } from "./eight-first-evos/eight-first-evos.component";

@Component({
  selector: 'app-evolution',
  standalone: true,
  imports: [
    CommonModule,
    OneFirstEvoComponent,
    NoEvolutionComponent,
    OneFirstOneSecondEvoComponent,
    TwoFirstEvosComponent,
    OneFirstTwoSecondEvosComponent,
    ThreeFirstEvosComponent,
    EightFirstEvosComponent,
  ],
  templateUrl: './evolution.component.html',
  styleUrl: './evolution.component.scss'
})
export class EvolutionComponent implements OnInit {
  @Input() selectedPokemonId: number | null = null;
  pokemon: any = {};
  basicDataURL = this.pokemonDataService.basicDataURL;
  pokemonDetailsOfEvoChain: any = {};
  pokemonEvoData: any;
  pokemonNamesOfEvoChain: string[] = [];
  lvlUpTrigger: any = [];
  notDeclared: any;

  constructor(private pokemonDataService: PokemonDataService) { }

  async ngOnInit() {
    await this.fetchPokemonEvolutionsData();
    this.loadPokemonEvolutionDataFromArray();
    if (this.pokemonNamesOfEvoChain.length > 0) {
      await this.fetchAndProcessEachPokemon();
      this.loadEachPokemon();
      this.getLevelUpInfo(this.pokemonEvoData['evolutions']);
    }
  }

  // Diese Funktion fetcht die Evolutionsdaten des Basis Pokemon.
  // Das dient dazu, dass ich die Namen der Entwicklungen vom Basis Pokemon erhalte.
  async fetchPokemonEvolutionsData() {
    try {
      const data = await this.pokemonDataService.fetchPokemonEvolutionsData().toPromise();
      this.pushPokemonEvolutionDataInArray(data);

    } catch (error) {
      console.error('Fehler beim Laden der Pokemon-Spezies-Daten:', error);
    }
  }

  // Diese Funktion baut das Array auf, damit die Daten abgespeichert werden, wie gewünscht.
  pushPokemonEvolutionDataInArray(eachPokemon: any) {
    // Hilfsfunktion, um die Evolutionen rekursiv aufzubauen
    const buildEvolutions = (evolutionChain: any): Evolution[] => {
      return evolutionChain.map((evolution: any) => ({
        name: evolution?.species?.name || '',
        evolves_to: evolution?.evolves_to ? buildEvolutions(evolution.evolves_to) : [],
        evolution_details: evolution.evolution_details.map((detail: any): EvolutionDetails => ({
          gender: detail.gender,
          held_item: detail.held_item?.name || null,
          item: detail.item?.name || null,
          known_move: detail.known_move?.name || null,
          known_move_type: detail.known_move_type?.name || null,
          location: detail.location?.name || null,
          min_affection: detail.min_affection,
          min_beauty: detail.min_beauty,
          min_happiness: detail.min_happiness,
          min_level: detail.min_level,
          needs_overworld_rain: detail.needs_overworld_rain,
          party_species: detail.party_species?.name || null,
          party_type: detail.party_type?.name || null,
          relative_physical_stats: detail.relative_physical_stats,
          time_of_day: detail.time_of_day,
          trade_species: detail.trade_species?.name || null,
          trigger: detail.trigger?.name || '',
          turn_upside_down: detail.turn_upside_down
        }))
      }));
    };

    // Basis-Pokémon und dessen erste Entwicklungen mit möglichen weiteren Entwicklungen
    const pokemonEvolutionsData: PokemonEvolutions = {
      base_pokemon: eachPokemon?.chain?.species?.name || '', // Basis-Pokémon
      evolutions: buildEvolutions(eachPokemon?.chain?.evolves_to || []) // Erstes Level der Entwicklungen
    };

    this.pokemonDataService.addPokemonEvolutions(pokemonEvolutionsData);
    console.log("TEEEESSSST", pokemonEvolutionsData);
  }

  loadPokemonEvolutionDataFromArray() {
    this.pokemonEvoData = this.pokemonDataService.getPokemonEvolutions();
    this.pokemonNamesOfEvoChain = [];
    this.pokemonNamesOfEvoChain.push(this.pokemonEvoData.base_pokemon);
    this.collectEvolutionNames(this.pokemonEvoData.evolutions);
    console.log("All Evolution Names:", this.pokemonNamesOfEvoChain);
  }

  collectEvolutionNames(evolutionChain: any[]) {
    for (let i = 0; i < evolutionChain.length; i++) {
      const evolutionName = evolutionChain[i].name;
      this.pokemonNamesOfEvoChain.push(evolutionName);

      if (evolutionChain[i].evolves_to && evolutionChain[i].evolves_to.length > 0) {
        this.collectEvolutionNames(evolutionChain[i].evolves_to);
      }
    }
  }

  // Da die Entwicklungen des Basis Pokemon nun in einem Array vorhanden sind, kann nun mit dieser Funktion die Grunddaten der Entwicklungen gefetcht werden.
  // Damit ich Zugriff auf das Sprite der Entwicklung habe und es darstellen kann.
  // Das wäre theoretisch bereits möglich über die Grunddaten der in der Übersicht bereits geladenen Pokemon.
  // Jedoch haben manche Pokemon Entwicklungen, die aus späteren Generationen erst dazugekommen sind. Diese könnten dann noch nicht vorhanden sein im Grunddaten
  // Array, wenn nicht genügend Pokemon vorgeladen worden sind.
  async fetchAndProcessEachPokemon() {
    this.pokemonDataService.pokemonFirstEvolutions = [];
    for (let i = 0; i < this.pokemonNamesOfEvoChain.length; i++) {
      try {
        const firstEvoPokemonName = this.pokemonNamesOfEvoChain[i];
        const data = await this.pokemonDataService.fetchEachPokemon(firstEvoPokemonName).toPromise();
        this.pushEachPokemonInArray(data);
        console.log("data", data);
      } catch (error) {
        console.error('Fehler beim Laden der Pokemon-Spezies-Daten:', error);
      }
    }
  }

  // Diese Funktion speichert die benötigten Daten der Entwicklung des Base Pokemon ab, damit diese abgerufen werden können.
  pushEachPokemonInArray(eachPokemon: any) {
    const pokemonFirstEvoBaseData = {
      id: eachPokemon['id'],
      name: eachPokemon['name'],
      sprite_big: eachPokemon['sprites']['other']['official-artwork']['front_default'],
    };
    this.pokemonDataService.addEachPokemon(pokemonFirstEvoBaseData);
  }

  loadEachPokemon() {
    this.pokemonDetailsOfEvoChain = this.pokemonDataService.getEachPokemon();
    console.log("this.pokemonDetailsOfEvoChain", this.pokemonDetailsOfEvoChain);
  }

  getLevelUpInfo(evolutionChain: any[]) {
    for (let i = 0; i < evolutionChain.length; i++) {
      const evoDetails = evolutionChain[i]['evolution_details'][0];
      let reqText = "";
      if (evoDetails['trigger'] == 'level-up') {
        if (evoDetails['min_level'] !== null && evoDetails['relative_physical_stats'] !== null) {
          if (evoDetails['relative_physical_stats'] == 1) {
            reqText = `Lvl ${evoDetails['min_level']} with (Attack > Defense)`;
          } else if (evoDetails['relative_physical_stats'] == -1) {
            reqText = `Lvl ${evoDetails['min_level']} with (Attack < Defense)`;
          } else if (evoDetails['relative_physical_stats'] == 0) {
            reqText = `Lvl ${evoDetails['min_level']} with (Attack = Defense)`;
          }
        } else if (evoDetails['min_level'] !== null) {
          reqText = `Lvl ` + evoDetails['min_level'];
        } else if (evoDetails['time_of_day'] !== "") {
          reqText = `LvlUp during ` + evoDetails['time_of_day'] + ` Time`;
        } else if (evoDetails['min_happiness'] !== null) {
          reqText = `LvlUp with Happiness ` + evoDetails['min_happiness'];
        } else if (evoDetails['known_move'] !== null) {
          reqText = `LvlUp with Learned Move ` + `"` + evoDetails['known_move'] + `"`;
        } else if (evoDetails['known_move_type'] !== null) {
          reqText = `LvlUp with ` + evoDetails['known_move_type'] + `-Type Move learned`;
        } else if (evoDetails['location'] !== null) {
          reqText = `LvlUp in Location ` + evoDetails['location'];
        }
      } else if (evoDetails['trigger'] == 'use-item') {
        if (evoDetails['item'] !== null) {
          reqText = evoDetails['item'];
        }
      } else if (evoDetails['trigger'] == 'trade') {
        if (evoDetails['held_item'] !== null) {
          reqText = `Trade with Held Item ` + `"` + evoDetails['held_item'] + `"`;
        } else {
          reqText = `Trade`;
        }
      } else if (evoDetails['trigger'] == 'three-critical-hits') {
        reqText = `Give 3x Crit. Hits in one Battle`;
      }
      this.lvlUpTrigger.push(reqText);
      if (evolutionChain[i]['evolves_to'] && evolutionChain[i]['evolves_to'].length > 0) {
        this.getLevelUpInfo(evolutionChain[i]['evolves_to']);
      }
    }
    console.log("pokemonEvoData", this.pokemonEvoData);
    console.log("LVL UP TRIGGER", this.lvlUpTrigger);
  }
}