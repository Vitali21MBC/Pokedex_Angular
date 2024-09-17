import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PokemonDataService, PokemonEvolutions, Evolution, EvolutionDetails } from '../../../../../../pokemon-data.service';
import { OneFirstEvoComponent } from "./one-first-evo/one-first-evo.component";
import { NoEvolutionComponent } from "./no-evolution/no-evolution.component";
import { OneFirstOneSecondEvoComponent } from './one-first-one-second-evo/one-first-one-second-evo.component';

@Component({
  selector: 'app-evolution',
  standalone: true,
  imports: [CommonModule, OneFirstEvoComponent, NoEvolutionComponent, OneFirstOneSecondEvoComponent],
  templateUrl: './evolution.component.html',
  styleUrl: './evolution.component.scss'
})
export class EvolutionComponent implements OnInit {
  @Input() selectedPokemonId: number | null = null;
  pokemon: any = {};
  pokemonEvo: any;
  pokemonFirstEvo: any;
  basicDataURL = this.pokemonDataService.basicDataURL;
  firstEvoPokemonName: any = {};
  secondEvoPokemonName: any = {};

  pokemonEvoData: any;
  basePokemonName: any;
  firstEvolutionName: any;
  secondEvolutionName: any;
  lvlUpTrigger: string | null = null;
  lvlUpTriggerSecondEvo: string | null = null;
  notDeclared: any;

  constructor(private pokemonDataService: PokemonDataService) { }

  async ngOnInit() {
    await this.fetchAndProcessPokemonEvolutions();
    this.loadPokemonEvolutionDetails();
    this.loadPokemonDetails();
    if (this.firstEvolutionName) {
      await this.fetchAndProcessPokemonFirstEvolution();
      this.loadPokemonFirstEvolutionDetails();
      this.getLevelUpInfoFirstEvo();
    }
    if (this.secondEvolutionName) {
      await this.fetchAndProcessPokemonSecondEvolution();
      this.loadPokemonSecondEvolutionDetails();
      this.getLevelUpInfoSecondEvo();
    }
  }

  // Diese Funktion fetcht die Evolutionsdaten des Basis Pokemon.
  // Das dient dazu, dass ich die Namen der Entwicklungen vom Basis Pokemon erhalte.
  async fetchAndProcessPokemonEvolutions() {
    try {
      const data = await this.pokemonDataService.fetchPokemonEvolutionsData().toPromise();
      this.pushPokemonEvolutionInfoInArray(data);

    } catch (error) {
      console.error('Fehler beim Laden der Pokemon-Spezies-Daten:', error);
    }
  }

  // Diese Funktion baut das Array auf, damit die Daten abgespeichert werden, wie gewünscht.
  pushPokemonEvolutionInfoInArray(eachPokemon: any) {
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
  }

  // Mit dieser Funktion werden die Evolutionsdaten aus dem DataServce geladen, damit man von hier aus zugreifen kann.
  loadPokemonEvolutionDetails() {
    this.pokemonEvoData = this.pokemonDataService.getPokemonEvolutions();

    // Prüfen, ob das evolutions-Array existiert und mindestens ein Element enthält
    if (this.pokemonEvoData.evolutions && this.pokemonEvoData.evolutions.length > 0) {
      // Basis-Pokemon-Name setzen
      this.basePokemonName = this.pokemonEvoData.base_pokemon;
      this.firstEvolutionName = this.pokemonEvoData.evolutions[0].name;

      // Prüfen, ob die erste Evolution eine weitere Evolution hat
      if (this.pokemonEvoData.evolutions[0].evolves_to && this.pokemonEvoData.evolutions[0].evolves_to.length > 0) {
        this.secondEvolutionName = this.pokemonEvoData.evolutions[0].evolves_to[0].name;
        console.log("Second Evolution Name:", this.secondEvolutionName);
      } else {
        // Wenn die erste Evolution keine weitere Evolution hat
        this.secondEvolutionName = null;
        console.log("No second evolution available.");
      }

    } else {
      // Wenn keine Evolution vorhanden ist
      this.basePokemonName = this.pokemonEvoData.base_pokemon;
      this.firstEvolutionName = null;
      this.secondEvolutionName = null;
      console.log("No evolutions available.");
    }

    // Debug-Ausgaben
    console.log("Base Pokemon Name:", this.basePokemonName);
    console.log("First Evolution Name:", this.firstEvolutionName);
    console.log("Second Evolution Name:", this.secondEvolutionName);
  }



  // Diese Funktion holt sich die Daten aus dem DataService um den Namen und das Bild des Basis Pokemons darzustellen.
  // Da dieses bereits im pokemons Array vorhanden ist, durch die ursprüngliche Darstellung der Pokemonübersicht, muss hier nicht neu gefetcht werden.
  loadPokemonDetails() {
    const pokemons = this.pokemonDataService.getPokemons();
    this.pokemon = pokemons.find(p => p.name === this.basePokemonName) || null;
  }

  // Da die Entwicklungen des Basis Pokemon nun in einem Array vorhanden sind, kann nun mit dieser Funktion die Grunddaten der Entwicklungen gefetcht werden.
  // Damit ich Zugriff auf das Sprite der Entwicklung habe und es darstellen kann.
  // Das wäre theoretisch bereits möglich über die Grunddaten der in der Übersicht bereits geladenen Pokemon.
  // Jedoch haben manche Pokemon Entwicklungen, die aus späteren Generationen erst dazugekommen sind. Diese könnten dann noch nicht vorhanden sein im Grunddaten
  // Array, wenn nicht genügend Pokemon vorgeladen worden sind.
  async fetchAndProcessPokemonFirstEvolution() {
    try {
      const data = await this.pokemonDataService.fetchPokemonFirstEvolutionsData(this.firstEvolutionName).toPromise();
      this.pushPokemonFirstEvolutionInfoInArray(data);

    } catch (error) {
      console.error('Fehler beim Laden der Pokemon-Spezies-Daten:', error);
    }
  }

  // Diese Funktion speichert die benötigten Daten der Entwicklung des Base Pokemon ab, damit diese abgerufen werden können.
  pushPokemonFirstEvolutionInfoInArray(eachPokemon: any) {
    const pokemonFirstEvoBaseData = {
      id: eachPokemon['id'],
      name: eachPokemon['name'],
      sprite_big: eachPokemon['sprites']['other']['official-artwork']['front_default'],
    };
    this.pokemonDataService.addPokemonFirstEvolutions(pokemonFirstEvoBaseData);
  }

  loadPokemonFirstEvolutionDetails() {
    this.firstEvoPokemonName = this.pokemonDataService.getPokemonFirstEvolutions();
  }

  // Da die Entwicklungen des Basis Pokemon nun in einem Array vorhanden sind, kann nun mit dieser Funktion die Grunddaten der Entwicklungen gefetcht werden.
  // Damit ich Zugriff auf das Sprite der Entwicklung habe und es darstellen kann.
  // Das wäre theoretisch bereits möglich über die Grunddaten der in der Übersicht bereits geladenen Pokemon.
  // Jedoch haben manche Pokemon Entwicklungen, die aus späteren Generationen erst dazugekommen sind. Diese könnten dann noch nicht vorhanden sein im Grunddaten
  // Array, wenn nicht genügend Pokemon vorgeladen worden sind.
  async fetchAndProcessPokemonSecondEvolution() {
    try {
      const data = await this.pokemonDataService.fetchPokemonSecondEvolutionsData(this.secondEvolutionName).toPromise();
      this.pushPokemonSecondEvolutionInfoInArray(data);

    } catch (error) {
      console.error('Fehler beim Laden der Pokemon-Spezies-Daten:', error);
    }
  }

  // Diese Funktion speichert die benötigten Daten der Entwicklung des Base Pokemon ab, damit diese abgerufen werden können.
  pushPokemonSecondEvolutionInfoInArray(eachPokemon: any) {
    const pokemonSecondEvoBaseData = {
      id: eachPokemon['id'],
      name: eachPokemon['name'],
      sprite_big: eachPokemon['sprites']['other']['official-artwork']['front_default'],
    };
    this.pokemonDataService.addPokemonSecondEvolutions(pokemonSecondEvoBaseData);
  }

  loadPokemonSecondEvolutionDetails() {
    this.secondEvoPokemonName = this.pokemonDataService.getPokemonSecondEvolutions();
    console.log("TEST secondEvoPokemonName", this.secondEvoPokemonName);
  }

  getLevelUpInfoFirstEvo() {
    if (this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['trigger'] == 'level-up') {
      if (this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['min_level'] !== null) {
        this.lvlUpTrigger = `Lvl ` + this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['min_level'];
      } else if (this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['min_happiness'] !== null) {
        this.lvlUpTrigger = `LvlUp with Happiness ` + this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['min_happiness'];
      } else if (this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['known_move'] !== null) {
        this.lvlUpTrigger = `LvlUp with Learned Move ` + `"` + this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['known_move'] + `"`;
      } else if (this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['time_of_day'] !== null && this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['held_item'] !== null) {
        this.lvlUpTrigger = `LvlUp during ` + this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['time_of_day'] + `time and item held` + this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['held_item'];
      } else {
        this.notDeclared = `Noch etwas anderes`;
      }

    } else if (this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['trigger'] == 'use-item') {
      if (this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['item'] !== null) {
        this.lvlUpTrigger = this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['item'];
      } else {
        this.notDeclared = `Noch etwas anderes`;
      }

    } else if (this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['trigger'] == 'trade') {
      if (this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['held_item'] !== null) {
        this.lvlUpTrigger = `Trade with Held Item ` + `"` + this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['held_item'] + `"`;
      } else if (this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['held_item'] == null) {
        this.lvlUpTrigger = `Trade`;
      } else {
        this.notDeclared = `Noch etwas anderes`;
      }

    } else if (this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['trigger'] == 'three-critical-hits') {
      this.lvlUpTrigger = `Give 3x Crit. Hits in one Battle`;
    }

    console.log("pokemonEvoData", this.pokemonEvoData);
  }

  getLevelUpInfoSecondEvo() {
    if (this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`0`]['evolution_details'][`0`]['trigger'] == 'level-up') {
      if (this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`0`]['evolution_details'][`0`]['min_level'] !== null) {
        this.lvlUpTriggerSecondEvo = `Lvl ` + this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`0`]['evolution_details'][`0`]['min_level'];
      } else if (this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`0`]['evolution_details'][`0`]['min_happiness'] !== null) {
        this.lvlUpTriggerSecondEvo = `LvlUp with Happiness ` + this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`0`]['evolution_details'][`0`]['min_happiness'];
      } else if (this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`0`]['evolution_details'][`0`]['known_move'] !== null) {
        this.lvlUpTriggerSecondEvo = `LvlUp with Learned Move ` + `"` + this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`0`]['evolution_details'][`0`]['known_move'] + `"`;
      } else if (this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`0`]['evolution_details'][`0`]['time_of_day'] !== null && this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`0`]['evolution_details'][`0`]['held_item'] !== null) {
        this.lvlUpTriggerSecondEvo = `LvlUp during ` + this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`0`]['evolution_details'][`0`]['time_of_day'] + `time and item held` + this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`0`]['evolution_details'][`0`]['held_item'];
      } else {
        this.notDeclared = `Noch etwas anderes`;
      }

    } else if (this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`0`]['evolution_details'][`0`]['trigger'] == 'use-item') {
      if (this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`0`]['evolution_details'][`0`]['item'] !== null) {
        this.lvlUpTriggerSecondEvo = this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`0`]['evolution_details'][`0`]['item'];
      } else {
        this.notDeclared = `Noch etwas anderes`;
      }

    } else if (this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`0`]['evolution_details'][`0`]['trigger'] == 'trade') {
      if (this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`0`]['evolution_details'][`0`]['held_item'] !== null) {
        this.lvlUpTriggerSecondEvo = `Trade with Held Item ` + `"` + this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`0`]['evolution_details'][`0`]['held_item'] + `"`;
      } else if (this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`0`]['evolution_details'][`0`]['held_item'] == null) {
        this.lvlUpTriggerSecondEvo = `Trade`;
      } else {
        this.notDeclared = `Noch etwas anderes`;
      }

    } else if (this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`0`]['evolution_details'][`0`]['trigger'] == 'three-critical-hits') {
      this.lvlUpTriggerSecondEvo = `Give 3x Crit. Hits in one Battle`;
    }

    console.log("pokemonEvoData", this.pokemonEvoData);
  }

}
