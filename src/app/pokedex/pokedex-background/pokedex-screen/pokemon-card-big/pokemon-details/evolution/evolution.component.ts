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
  pokemonEvo: any;
  pokemonFirstEvo: any;
  basicDataURL = this.pokemonDataService.basicDataURL;
  firstEvoPokemonName: any = {};
  basePokemonData: any = {};
  firstEvoSecondPokemonName: any = {};
  firstEvoThirdPokemonData: any = {};
  secondEvoPokemonName: any = {};
  secondEvoSecondPokemonData: any = {};

  pokemonEvoData: any;
  basePokemonName: any;

  firstEvolutionNames: string[] = [];

  secondEvolutionName: any;
  secondEvolutionSecondName: any;
  lvlUpTrigger: any = [];
  lvlUpTriggerFirstEvoSecondPokemon: string | null = null;
  lvlUpTriggerFirstEvoThirdPokemon: string | null = null;
  lvlUpTriggerSecondEvo: string | null = null;
  lvlUpTriggerSecondEvoSecondPokemon: string | null = null;
  notDeclared: any;

  constructor(private pokemonDataService: PokemonDataService) { }

  async ngOnInit() {
    await this.fetchAndProcessPokemonEvolutions();
    this.loadPokemonEvolutionDetails();
    if (this.basePokemonName) {
      await this.fetchAndProcessBasePokemon();
      this.loadBasePokemonDetails();
    }
    if (this.firstEvolutionNames.length > 0) {
      await this.fetchAndProcessPokemonFirstEvolution();
      this.loadPokemonFirstEvolutionDetails();
      this.getLevelUpInfoFirstEvo();
    }
    if (this.secondEvolutionName) {
      await this.fetchAndProcessPokemonSecondEvolution();
      this.loadPokemonSecondEvolutionDetails();
      this.getLevelUpInfoSecondEvo();
    }
    if (this.secondEvolutionSecondName) {
      await this.fetchAndProcessPokemonSecondEvolutionSecondPokemon();
      this.loadPokemonSecondEvolutionSecondPokemonDetails();
      this.getLevelUpInfoSecondEvoSecondPokemon();
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
    console.log("TEEEESSSST", pokemonEvolutionsData);
  }

  // Mit dieser Funktion werden die Evolutionsdaten aus dem DataServce geladen, damit man von hier aus zugreifen kann.
  loadPokemonEvolutionDetails() {
    this.pokemonEvoData = this.pokemonDataService.getPokemonEvolutions();

    // Prüfen, ob das evolutions-Array existiert und mindestens ein Element enthält
    if (this.pokemonEvoData.evolutions && this.pokemonEvoData.evolutions.length > 0) {
      // Basis-Pokemon-Name setzen
      this.basePokemonName = this.pokemonEvoData.base_pokemon;
      for (let i = 0; i < this.pokemonEvoData.evolutions.length; i++) {
        const element = this.pokemonEvoData.evolutions[i].name;
        this.firstEvolutionNames.push(element);
      }
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!:", this.firstEvolutionNames);
      console.log("pokemonEvoData:", this.pokemonEvoData);

      // Prüfen, ob die erste Evolution eine weitere Evolution hat
      if (this.pokemonEvoData.evolutions[0].evolves_to && this.pokemonEvoData.evolutions[0].evolves_to.length > 0) {
        this.secondEvolutionName = this.pokemonEvoData.evolutions[0].evolves_to[0].name;

        if (this.pokemonEvoData.evolutions[0].evolves_to[1]) {
          this.secondEvolutionSecondName = this.pokemonEvoData.evolutions[0].evolves_to[1].name;
        }


      }

    } else {
      // Wenn keine Evolution vorhanden ist
      this.basePokemonName = this.pokemonEvoData.base_pokemon;
      this.secondEvolutionName = null;
      this.secondEvolutionSecondName = null;
      console.log("No evolutions available.");
    }

    // Debug-Ausgaben
    console.log("Base Pokemon Name:", this.basePokemonName);
    console.log("Second Evolution Name:", this.secondEvolutionName);
    console.log("Second Evolution Second Name:", this.secondEvolutionSecondName);
    console.log("FIRST EVOLUTION NAMES:", this.firstEvolutionNames);
  }

  // Da die Entwicklungen des Basis Pokemon nun in einem Array vorhanden sind, kann nun mit dieser Funktion die Grunddaten der Entwicklungen gefetcht werden.
  // Damit ich Zugriff auf das Sprite der Entwicklung habe und es darstellen kann.
  // Das wäre theoretisch bereits möglich über die Grunddaten der in der Übersicht bereits geladenen Pokemon.
  // Jedoch haben manche Pokemon Entwicklungen, die aus späteren Generationen erst dazugekommen sind. Diese könnten dann noch nicht vorhanden sein im Grunddaten
  // Array, wenn nicht genügend Pokemon vorgeladen worden sind.
  async fetchAndProcessBasePokemon() {
    try {
      const data = await this.pokemonDataService.fetchBasePokemonData(this.basePokemonName).toPromise();
      this.pushBasePokemonInfoInArray(data);
      console.log("dataBASE", data);
    } catch (error) {
      console.error('Fehler beim Laden der Pokemon-Spezies-Daten:', error);
    }
  }

  // Diese Funktion speichert die benötigten Daten der Entwicklung des Base Pokemon ab, damit diese abgerufen werden können.
  pushBasePokemonInfoInArray(eachPokemon: any) {
    const pokemonBaseData = {
      id: eachPokemon['id'],
      name: eachPokemon['name'],
      sprite_big: eachPokemon['sprites']['other']['official-artwork']['front_default'],
    };
    this.pokemonDataService.addBasePokemon(pokemonBaseData);
  }

  loadBasePokemonDetails() {
    this.basePokemonData = this.pokemonDataService.getBasePokemon();
    console.log("this.basePokemonData!!!!", this.basePokemonData);
  }

  // Da die Entwicklungen des Basis Pokemon nun in einem Array vorhanden sind, kann nun mit dieser Funktion die Grunddaten der Entwicklungen gefetcht werden.
  // Damit ich Zugriff auf das Sprite der Entwicklung habe und es darstellen kann.
  // Das wäre theoretisch bereits möglich über die Grunddaten der in der Übersicht bereits geladenen Pokemon.
  // Jedoch haben manche Pokemon Entwicklungen, die aus späteren Generationen erst dazugekommen sind. Diese könnten dann noch nicht vorhanden sein im Grunddaten
  // Array, wenn nicht genügend Pokemon vorgeladen worden sind.
  async fetchAndProcessPokemonFirstEvolution() {
    this.pokemonDataService.pokemonFirstEvolutions = [];
    for (let i = 0; i < this.firstEvolutionNames.length; i++) {
      try {
        const firstEvoPokemonName = this.firstEvolutionNames[i];
        const data = await this.pokemonDataService.fetchPokemonFirstEvolutionsData(firstEvoPokemonName).toPromise();
        this.pushPokemonFirstEvolutionInfoInArray(data);
        console.log("data", data);
      } catch (error) {
        console.error('Fehler beim Laden der Pokemon-Spezies-Daten:', error);
      }
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
    console.log("this.firstEvoPokemonName", this.firstEvoPokemonName);
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

  // Da die Entwicklungen des Basis Pokemon nun in einem Array vorhanden sind, kann nun mit dieser Funktion die Grunddaten der Entwicklungen gefetcht werden.
  // Damit ich Zugriff auf das Sprite der Entwicklung habe und es darstellen kann.
  // Das wäre theoretisch bereits möglich über die Grunddaten der in der Übersicht bereits geladenen Pokemon.
  // Jedoch haben manche Pokemon Entwicklungen, die aus späteren Generationen erst dazugekommen sind. Diese könnten dann noch nicht vorhanden sein im Grunddaten
  // Array, wenn nicht genügend Pokemon vorgeladen worden sind.
  async fetchAndProcessPokemonSecondEvolutionSecondPokemon() {
    try {
      const data = await this.pokemonDataService.fetchPokemonSecondEvolutionsSecondPokemonData(this.secondEvolutionSecondName).toPromise();
      this.pushPokemonSecondEvolutionSecondPokemonInfoInArray(data);
    } catch (error) {
      console.error('Fehler beim Laden der Pokemon-Spezies-Daten:', error);
    }
  }

  // Diese Funktion speichert die benötigten Daten der Entwicklung des Base Pokemon ab, damit diese abgerufen werden können.
  pushPokemonSecondEvolutionSecondPokemonInfoInArray(eachPokemon: any) {
    const pokemonSecondEvoBaseData = {
      id: eachPokemon['id'],
      name: eachPokemon['name'],
      sprite_big: eachPokemon['sprites']['other']['official-artwork']['front_default'],
    };
    this.pokemonDataService.addPokemonSecondEvolutionsSecondPokemon(pokemonSecondEvoBaseData);
  }

  loadPokemonSecondEvolutionSecondPokemonDetails() {
    this.secondEvoSecondPokemonData = this.pokemonDataService.getPokemonSecondEvolutionsSecondPokemon();
    console.log("TEST secondEvoPokemonName", this.secondEvoSecondPokemonData);
  }

  getLevelUpInfoFirstEvo() {
    for (let i = 0; i < this.pokemonEvoData['evolutions'].length; i++) {
      const evoDetails = this.pokemonEvoData['evolutions'][i]['evolution_details'][`0`];
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
        } else if (evoDetails['time_of_day'] !== "" && evoDetails['held_item'] !== null) {
          reqText = `LvlUp during ` + evoDetails['time_of_day'] + `time and item held ` + evoDetails['held_item'];
        } else if (evoDetails['location'] !== null) {
          reqText = `LvlUp in Location ` + evoDetails['location'];
        } else {
          this.notDeclared = `Noch etwas anderes`;
        }
      } else if (evoDetails['trigger'] == 'use-item') {
        if (evoDetails['item'] !== null) {
          reqText = evoDetails['item'];
        } else {
          this.notDeclared = `Noch etwas anderes`;
        }
      } else if (evoDetails['trigger'] == 'trade') {
        if (evoDetails['held_item'] !== null) {
          reqText = `Trade with Held Item ` + `"` + evoDetails['held_item'] + `"`;
        } else if (evoDetails['held_item'] == null) {
          reqText = `Trade`;
        } else {
          this.notDeclared = `Noch etwas anderes`;
        }
      } else if (evoDetails['trigger'] == 'three-critical-hits') {
        reqText = `Give 3x Crit. Hits in one Battle`;
      }
      this.lvlUpTrigger.push(reqText);
    }
    console.log("pokemonEvoData", this.pokemonEvoData);
    console.log("LVL UP TRIGGER", this.lvlUpTrigger);
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
        this.lvlUpTriggerSecondEvo = `LvlUp during ` + this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`0`]['evolution_details'][`0`]['time_of_day'] + `time and item held ` + this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`0`]['evolution_details'][`0`]['held_item'];
      } else if (this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`0`]['evolution_details'][`0`]['location'] !== null) {
        this.lvlUpTriggerSecondEvo = `LvlUp in Location ` + this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`0`]['evolution_details'][`0`]['location'];
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
    } else if (this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`0`]['evolution_details'][`0`]['trigger'] == 'other') {
      if (this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`0`]['name'] === 'annihilape') {
        this.lvlUpTriggerSecondEvo = `Use 20x Attack "Rage Fist"`;
      }
    } else if (this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`0`]['evolution_details'][`0`]['trigger'] == 'three-critical-hits') {
      this.lvlUpTriggerSecondEvo = `Give 3x Crit. Hits in one Battle`;
    }
    console.log("pokemonEvoData", this.pokemonEvoData);
  }

  getLevelUpInfoSecondEvoSecondPokemon() {
    if (this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`1`]['evolution_details'][`0`]['trigger'] == 'level-up') {
      if (this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`1`]['evolution_details'][`0`]['min_level'] !== null) {
        this.lvlUpTriggerSecondEvoSecondPokemon = `Lvl ` + this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`1`]['evolution_details'][`0`]['min_level'];
      } else if (this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`1`]['evolution_details'][`0`]['min_happiness'] !== null) {
        this.lvlUpTriggerSecondEvoSecondPokemon = `LvlUp with Happiness ` + this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`1`]['evolution_details'][`0`]['min_happiness'];
      } else if (this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`1`]['evolution_details'][`0`]['known_move'] !== null) {
        this.lvlUpTriggerSecondEvoSecondPokemon = `LvlUp with Learned Move ` + `"` + this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`1`]['evolution_details'][`0`]['known_move'] + `"`;
      } else if (this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`1`]['evolution_details'][`0`]['time_of_day'] !== null && this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`1`]['evolution_details'][`0`]['held_item'] !== null) {
        this.lvlUpTriggerSecondEvoSecondPokemon = `LvlUp during ` + this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`1`]['evolution_details'][`0`]['time_of_day'] + `time and item held ` + this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`1`]['evolution_details'][`0`]['held_item'];
      } else if (this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`1`]['evolution_details'][`0`]['location'] !== null) {
        this.lvlUpTriggerSecondEvoSecondPokemon = `LvlUp in Location ` + this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`1`]['evolution_details'][`0`]['location'];
      } else {
        this.notDeclared = `Noch etwas anderes`;
      }
    } else if (this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`1`]['evolution_details'][`0`]['trigger'] == 'use-item') {
      if (this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`1`]['evolution_details'][`0`]['item'] !== null) {
        this.lvlUpTriggerSecondEvoSecondPokemon = this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`1`]['evolution_details'][`0`]['item'];
      } else {
        this.notDeclared = `Noch etwas anderes`;
      }
    } else if (this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`1`]['evolution_details'][`0`]['trigger'] == 'trade') {
      if (this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`1`]['evolution_details'][`0`]['held_item'] !== null) {
        this.lvlUpTriggerSecondEvoSecondPokemon = `Trade with Held Item ` + `"` + this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`1`]['evolution_details'][`0`]['held_item'] + `"`;
      } else if (this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`1`]['evolution_details'][`0`]['held_item'] == null) {
        this.lvlUpTriggerSecondEvoSecondPokemon = `Trade`;
      } else {
        this.notDeclared = `Noch etwas anderes`;
      }
    } else if (this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`1`]['evolution_details'][`0`]['trigger'] == 'other') {
      if (this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`1`]['name'] === 'annihilape') {
        this.lvlUpTriggerSecondEvoSecondPokemon = `Use 20x Attack "Rage Fist"`;
      }
    } else if (this.pokemonEvoData['evolutions'][`0`][`evolves_to`][`1`]['evolution_details'][`0`]['trigger'] == 'three-critical-hits') {
      this.lvlUpTriggerSecondEvoSecondPokemon = `Give 3x Crit. Hits in one Battle`;
    }
    console.log("pokemonEvoData", this.pokemonEvoData);
  }
}
