import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PokemonDataService, PokemonEvolutions, Evolution, EvolutionDetails } from '../../../../../../pokemon-data.service';
import { OneFirstEvoComponent } from "./one-first-evo/one-first-evo.component";
import { NoEvolutionComponent } from "./no-evolution/no-evolution.component";
import { OneFirstOneSecondEvoComponent } from './one-first-one-second-evo/one-first-one-second-evo.component';
import { TwoFirstEvosComponent } from './two-first-evos/two-first-evos.component';
import { OneFirstTwoSecondEvosComponent } from './one-first-two-second-evos/one-first-two-second-evos.component';
import { ThreeFirstEvosComponent } from './three-first-evos/three-first-evos.component';

@Component({
  selector: 'app-evolution',
  standalone: true,
  imports:
    [
      CommonModule,
      OneFirstEvoComponent,
      NoEvolutionComponent,
      OneFirstOneSecondEvoComponent,
      TwoFirstEvosComponent,
      OneFirstTwoSecondEvosComponent,
      ThreeFirstEvosComponent
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
  firstEvolutionName: any;
  firstEvolutionSecondName: any; // Name der 1. Entwicklung aber der 2. Möglichen Entwicklung. Siehe Mauzi als Beispiel.
  firstEvolutionThirdName: any;
  secondEvolutionName: any;
  secondEvolutionSecondName: any;
  lvlUpTrigger: string | null = null;
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
    if (this.firstEvolutionName) {
      await this.fetchAndProcessPokemonFirstEvolution();
      this.loadPokemonFirstEvolutionDetails();
      this.getLevelUpInfoFirstEvo();
    }
    if (this.firstEvolutionSecondName) {
      await this.fetchAndProcessPokemonFirstEvolutionSecondPokemon();
      this.loadPokemonFirstEvolutionSecondPokemonDetails();
      this.getLevelUpInfoFirstEvoSecondPokemon();
    }

    if (this.firstEvolutionThirdName) {
      await this.fetchAndProcessPokemonFirstEvolutionThirdPokemon();
      this.loadPokemonFirstEvolutionThirdPokemonDetails();
      this.getLevelUpInfoFirstEvoThirdPokemon();
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
      this.firstEvolutionName = this.pokemonEvoData.evolutions[0].name;
      console.log("pokemonEvoData:", this.pokemonEvoData);


      if (this.pokemonEvoData.evolutions[1]) {
        this.firstEvolutionSecondName = this.pokemonEvoData.evolutions[1].name;
      }

      if (this.pokemonEvoData.evolutions[2]) {
        this.firstEvolutionThirdName = this.pokemonEvoData.evolutions[2].name;
      }

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
      this.firstEvolutionName = null;
      this.firstEvolutionSecondName = null;
      this.firstEvolutionThirdName = null;
      this.secondEvolutionName = null;
      this.secondEvolutionSecondName = null;
      console.log("No evolutions available.");
    }

    // Debug-Ausgaben
    console.log("Base Pokemon Name:", this.basePokemonName);
    console.log("First Evolution Name:", this.firstEvolutionName);
    console.log("First Evolution Second Name:", this.firstEvolutionSecondName);
    console.log("Second Evolution Third Name:", this.firstEvolutionThirdName);
    console.log("Second Evolution Name:", this.secondEvolutionName);
    console.log("Second Evolution Second Name:", this.secondEvolutionSecondName);
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
    try {
      const data = await this.pokemonDataService.fetchPokemonFirstEvolutionsData(this.firstEvolutionName).toPromise();
      this.pushPokemonFirstEvolutionInfoInArray(data);
      console.log("data", data);

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
    console.log("this.firstEvoPokemonName", this.firstEvoPokemonName);
  }

  async fetchAndProcessPokemonFirstEvolutionSecondPokemon() {
    try {
      const data = await this.pokemonDataService.fetchPokemonFirstEvolutionsSecondPokemonData(this.firstEvolutionSecondName).toPromise();
      this.pushPokemonFirstEvolutionSecondPokemonInfoInArray(data);
      console.log("data", data);

    } catch (error) {
      console.error('Fehler beim Laden der Pokemon-Spezies-Daten:', error);
    }
  }

  // Diese Funktion speichert die benötigten Daten der Entwicklung des Base Pokemon ab, damit diese abgerufen werden können.
  pushPokemonFirstEvolutionSecondPokemonInfoInArray(eachPokemon: any) {
    const pokemonFirstEvoBaseData = {
      id: eachPokemon['id'],
      name: eachPokemon['name'],
      sprite_big: eachPokemon['sprites']['other']['official-artwork']['front_default'],
    };
    this.pokemonDataService.addPokemonFirstEvolutionsSecondPokemon(pokemonFirstEvoBaseData);
  }

  loadPokemonFirstEvolutionSecondPokemonDetails() {
    this.firstEvoSecondPokemonName = this.pokemonDataService.getPokemonFirstEvolutionsSecondPokemon();
    console.log("this.firstEvoSecondPokemonName", this.firstEvoSecondPokemonName);
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





  // Da die Entwicklungen des Basis Pokemon nun in einem Array vorhanden sind, kann nun mit dieser Funktion die Grunddaten der Entwicklungen gefetcht werden.
  // Damit ich Zugriff auf das Sprite der Entwicklung habe und es darstellen kann.
  // Das wäre theoretisch bereits möglich über die Grunddaten der in der Übersicht bereits geladenen Pokemon.
  // Jedoch haben manche Pokemon Entwicklungen, die aus späteren Generationen erst dazugekommen sind. Diese könnten dann noch nicht vorhanden sein im Grunddaten
  // Array, wenn nicht genügend Pokemon vorgeladen worden sind.
  async fetchAndProcessPokemonFirstEvolutionThirdPokemon() {
    try {
      const data = await this.pokemonDataService.fetchPokemonFirstEvolutionsThirdPokemonData(this.firstEvolutionThirdName).toPromise();
      this.pushPokemonFirstEvolutionThirdPokemonInfoInArray(data);

    } catch (error) {
      console.error('Fehler beim Laden der Pokemon-Spezies-Daten:', error);
    }
  }

  // Diese Funktion speichert die benötigten Daten der Entwicklung des Base Pokemon ab, damit diese abgerufen werden können.
  pushPokemonFirstEvolutionThirdPokemonInfoInArray(eachPokemon: any) {
    const pokemonSecondEvoBaseData = {
      id: eachPokemon['id'],
      name: eachPokemon['name'],
      sprite_big: eachPokemon['sprites']['other']['official-artwork']['front_default'],
    };
    this.pokemonDataService.addPokemonFirstEvolutionsThirdPokemon(pokemonSecondEvoBaseData);
  }

  loadPokemonFirstEvolutionThirdPokemonDetails() {
    this.firstEvoThirdPokemonData = this.pokemonDataService.getPokemonFirstEvolutionsThirdPokemon();
    console.log("TEST secondEvoPokemonName", this.firstEvoThirdPokemonData);
  }







  getLevelUpInfoFirstEvo() {
    if (this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['trigger'] == 'level-up') {

      if (this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['min_level'] !== null && this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['relative_physical_stats'] !== null) {
        if (this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['relative_physical_stats'] == 1) {
          this.lvlUpTrigger = `Lvl ${this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['min_level']} with (Attack > Defense)`;
        } else if (this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['relative_physical_stats'] == -1) {
          this.lvlUpTrigger = `Lvl ${this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['min_level']} with (Attack < Defense)`;
        } else if (this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['relative_physical_stats'] == 0) {
          this.lvlUpTrigger = `Lvl ${this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['min_level']} with (Attack = Defense)`;
        }
      } else if (this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['min_level'] !== null) {
        this.lvlUpTrigger = `Lvl ` + this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['min_level'];
      } else if (this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['min_happiness'] !== null) {
        this.lvlUpTrigger = `LvlUp with Happiness ` + this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['min_happiness'];
      } else if (this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['known_move'] !== null) {
        this.lvlUpTrigger = `LvlUp with Learned Move ` + `"` + this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['known_move'] + `"`;
      } else if (this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['time_of_day'] !== null && this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['held_item'] !== null) {
        this.lvlUpTrigger = `LvlUp during ` + this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['time_of_day'] + `time and item held ` + this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['held_item'];
      } else if (this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['location'] !== null) {
        this.lvlUpTrigger = `LvlUp in Location ` + this.pokemonEvoData['evolutions'][`0`]['evolution_details'][`0`]['location'];
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


  getLevelUpInfoFirstEvoSecondPokemon() {
    if (this.pokemonEvoData['evolutions'][`1`]['evolution_details'][`0`]['trigger'] == 'level-up') {

      if (this.pokemonEvoData['evolutions'][`1`]['evolution_details'][`0`]['min_level'] !== null && this.pokemonEvoData['evolutions'][`1`]['evolution_details'][`0`]['relative_physical_stats'] !== null) {
        if (this.pokemonEvoData['evolutions'][`1`]['evolution_details'][`0`]['relative_physical_stats'] == 1) {
          this.lvlUpTriggerFirstEvoSecondPokemon = `Lvl ${this.pokemonEvoData['evolutions'][`1`]['evolution_details'][`0`]['min_level']} with (Attack > Defense)`;
        } else if (this.pokemonEvoData['evolutions'][`1`]['evolution_details'][`0`]['relative_physical_stats'] == -1) {
          this.lvlUpTriggerFirstEvoSecondPokemon = `Lvl ${this.pokemonEvoData['evolutions'][`1`]['evolution_details'][`0`]['min_level']} with (Attack < Defense)`;
        } else if (this.pokemonEvoData['evolutions'][`1`]['evolution_details'][`0`]['relative_physical_stats'] == 0) {
          this.lvlUpTriggerFirstEvoSecondPokemon = `Lvl ${this.pokemonEvoData['evolutions'][`1`]['evolution_details'][`0`]['min_level']} with (Attack = Defense)`;
        }
      } else if (this.pokemonEvoData['evolutions'][`1`]['evolution_details'][`0`]['min_level'] !== null) {
        this.lvlUpTriggerFirstEvoSecondPokemon = `Lvl ` + this.pokemonEvoData['evolutions'][`1`]['evolution_details'][`0`]['min_level'];
      } else if (this.pokemonEvoData['evolutions'][`1`]['evolution_details'][`0`]['min_happiness'] !== null) {
        this.lvlUpTriggerFirstEvoSecondPokemon = `LvlUp with Happiness ` + this.pokemonEvoData['evolutions'][`1`]['evolution_details'][`0`]['min_happiness'];
      } else if (this.pokemonEvoData['evolutions'][`1`]['evolution_details'][`0`]['known_move'] !== null) {
        this.lvlUpTriggerFirstEvoSecondPokemon = `LvlUp with Learned Move ` + `"` + this.pokemonEvoData['evolutions'][`1`]['evolution_details'][`0`]['known_move'] + `"`;
      } else if (this.pokemonEvoData['evolutions'][`1`]['evolution_details'][`0`]['time_of_day'] !== null && this.pokemonEvoData['evolutions'][`1`]['evolution_details'][`0`]['held_item'] !== null) {
        this.lvlUpTriggerFirstEvoSecondPokemon = `LvlUp during ` + this.pokemonEvoData['evolutions'][`1`]['evolution_details'][`0`]['time_of_day'] + `time and item held ` + this.pokemonEvoData['evolutions'][`1`]['evolution_details'][`0`]['held_item'];
      } else if (this.pokemonEvoData['evolutions'][`1`]['evolution_details'][`0`]['location'] !== null) {
        this.lvlUpTriggerFirstEvoSecondPokemon = `LvlUp in Location ` + this.pokemonEvoData['evolutions'][`1`]['evolution_details'][`0`]['location'];
      } else {
        this.notDeclared = `Noch etwas anderes`;
      }

    } else if (this.pokemonEvoData['evolutions'][`1`]['evolution_details'][`0`]['trigger'] == 'use-item') {
      if (this.pokemonEvoData['evolutions'][`1`]['evolution_details'][`0`]['item'] !== null) {
        this.lvlUpTriggerFirstEvoSecondPokemon = this.pokemonEvoData['evolutions'][`1`]['evolution_details'][`0`]['item'];
      } else {
        this.notDeclared = `Noch etwas anderes`;
      }

    } else if (this.pokemonEvoData['evolutions'][`1`]['evolution_details'][`0`]['trigger'] == 'trade') {
      if (this.pokemonEvoData['evolutions'][`1`]['evolution_details'][`0`]['held_item'] !== null) {
        this.lvlUpTriggerFirstEvoSecondPokemon = `Trade with Held Item ` + `"` + this.pokemonEvoData['evolutions'][`1`]['evolution_details'][`0`]['held_item'] + `"`;
      } else if (this.pokemonEvoData['evolutions'][`1`]['evolution_details'][`0`]['held_item'] == null) {
        this.lvlUpTriggerFirstEvoSecondPokemon = `Trade`;
      } else {
        this.notDeclared = `Noch etwas anderes`;
      }

    } else if (this.pokemonEvoData['evolutions'][`1`]['evolution_details'][`0`]['trigger'] == 'three-critical-hits') {
      this.lvlUpTriggerFirstEvoSecondPokemon = `Give 3x Crit. Hits in one Battle`;
    }



    console.log("pokemonEvoData", this.pokemonEvoData);
  }



  getLevelUpInfoFirstEvoThirdPokemon() {
    if (this.pokemonEvoData['evolutions'][`2`]['evolution_details'][`0`]['trigger'] == 'level-up') {

      if (this.pokemonEvoData['evolutions'][`2`]['evolution_details'][`0`]['min_level'] !== null && this.pokemonEvoData['evolutions'][`2`]['evolution_details'][`0`]['relative_physical_stats'] !== null) {
        if (this.pokemonEvoData['evolutions'][`2`]['evolution_details'][`0`]['relative_physical_stats'] == 1) {
          this.lvlUpTriggerFirstEvoThirdPokemon = `Lvl ${this.pokemonEvoData['evolutions'][`2`]['evolution_details'][`0`]['min_level']} with (Attack > Defense)`;
        } else if (this.pokemonEvoData['evolutions'][`2`]['evolution_details'][`0`]['relative_physical_stats'] == -1) {
          this.lvlUpTriggerFirstEvoThirdPokemon = `Lvl ${this.pokemonEvoData['evolutions'][`2`]['evolution_details'][`0`]['min_level']} with (Attack < Defense)`;
        } else if (this.pokemonEvoData['evolutions'][`2`]['evolution_details'][`0`]['relative_physical_stats'] == 0) {
          this.lvlUpTriggerFirstEvoThirdPokemon = `Lvl ${this.pokemonEvoData['evolutions'][`2`]['evolution_details'][`0`]['min_level']} with (Attack = Defense)`;
        }
      } else if (this.pokemonEvoData['evolutions'][`2`]['evolution_details'][`0`]['min_level'] !== null) {
        this.lvlUpTriggerFirstEvoThirdPokemon = `Lvl ` + this.pokemonEvoData['evolutions'][`2`]['evolution_details'][`0`]['min_level'];
      } else if (this.pokemonEvoData['evolutions'][`2`]['evolution_details'][`0`]['min_happiness'] !== null) {
        this.lvlUpTriggerFirstEvoThirdPokemon = `LvlUp with Happiness ` + this.pokemonEvoData['evolutions'][`2`]['evolution_details'][`0`]['min_happiness'];
      } else if (this.pokemonEvoData['evolutions'][`2`]['evolution_details'][`0`]['known_move'] !== null) {
        this.lvlUpTriggerFirstEvoThirdPokemon = `LvlUp with Learned Move ` + `"` + this.pokemonEvoData['evolutions'][`2`]['evolution_details'][`0`]['known_move'] + `"`;
      } else if (this.pokemonEvoData['evolutions'][`2`]['evolution_details'][`0`]['time_of_day'] !== null && this.pokemonEvoData['evolutions'][`2`]['evolution_details'][`0`]['held_item'] !== null) {
        this.lvlUpTriggerFirstEvoThirdPokemon = `LvlUp during ` + this.pokemonEvoData['evolutions'][`2`]['evolution_details'][`0`]['time_of_day'] + `time and item held ` + this.pokemonEvoData['evolutions'][`2`]['evolution_details'][`0`]['held_item'];
      } else if (this.pokemonEvoData['evolutions'][`2`]['evolution_details'][`0`]['location'] !== null) {
        this.lvlUpTriggerFirstEvoThirdPokemon = `LvlUp in Location ` + this.pokemonEvoData['evolutions'][`2`]['evolution_details'][`0`]['location'];
      } else {
        this.notDeclared = `Noch etwas anderes`;
      }

    } else if (this.pokemonEvoData['evolutions'][`2`]['evolution_details'][`0`]['trigger'] == 'use-item') {
      if (this.pokemonEvoData['evolutions'][`2`]['evolution_details'][`0`]['item'] !== null) {
        this.lvlUpTriggerFirstEvoThirdPokemon = this.pokemonEvoData['evolutions'][`2`]['evolution_details'][`0`]['item'];
      } else {
        this.notDeclared = `Noch etwas anderes`;
      }

    } else if (this.pokemonEvoData['evolutions'][`2`]['evolution_details'][`0`]['trigger'] == 'trade') {
      if (this.pokemonEvoData['evolutions'][`2`]['evolution_details'][`0`]['held_item'] !== null) {
        this.lvlUpTriggerFirstEvoThirdPokemon = `Trade with Held Item ` + `"` + this.pokemonEvoData['evolutions'][`2`]['evolution_details'][`0`]['held_item'] + `"`;
      } else if (this.pokemonEvoData['evolutions'][`2`]['evolution_details'][`0`]['held_item'] == null) {
        this.lvlUpTriggerFirstEvoThirdPokemon = `Trade`;
      } else {
        this.notDeclared = `Noch etwas anderes`;
      }

    } else if (this.pokemonEvoData['evolutions'][`2`]['evolution_details'][`0`]['trigger'] == 'three-critical-hits') {
      this.lvlUpTriggerFirstEvoThirdPokemon = `Give 3x Crit. Hits in one Battle`;
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
