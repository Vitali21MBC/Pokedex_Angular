import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MovesData, PokemonDataService } from '../../../../../../pokemon-data.service';

@Component({
  selector: 'app-moves',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './moves.component.html',
  styleUrl: './moves.component.scss'
})
export class MovesComponent implements OnInit {
  @Input() selectedPokemonId: number | null = null;
  pokemon: any; // Speicher für das Pokémon
  pokemonTypes: any[] = []; // Speicher für die Typen
  moveLearnMethods: string[] = [];
  pokemonGameVersions: string[] = [];
  pokemonMoves: MovesData[] = [];
  activeLearnType = "level-up";
  activeGameVersion = "red-blue";
  movesFilteredByLearnMethod: any;
  movesFilteredByGameVersion: any;

  activeLearnTypeNonFormatted: any;
  activeGameVerisonNonFormatted: any;

  hoveredLearnType: string | null = null;
  hoveredGameVersion: string | null = null;  // Variable für den Hover-Zustand

  constructor(private pokemonDataService: PokemonDataService) { }

  async ngOnInit() {
    this.moveLearnMethods = this.pokemonDataService.moveLearnMethod;
    this.pokemonGameVersions = this.pokemonDataService.pokemonGameVersions;
    if (this.selectedPokemonId) {
      this.loadPokemonDetails();
      this.setActiveLearnType("Level Up");
      this.setActiveGameVersion("RB");
      await this.fetchAndProcessMovesData();
      this.loadPokemonMoves();
      this.filterMovesByLearnType();

    }
  }

  loadPokemonDetails() {
    const pokemons = this.pokemonDataService.getPokemons();
    this.pokemon = pokemons.find(p => p.id === this.selectedPokemonId) || null;
    console.log("MOVES", this.pokemon.moves);
  }

  getPokemons() {
    const pokemons = this.pokemonDataService.getPokemons();
    return pokemons;
  }

  colorAsType(type: string): string {
    const pokemonTypes = this.pokemonDataService.getPokemonTypes();
    const matchedType = pokemonTypes.find(t => t.type === type);
    return matchedType ? matchedType.color : 'gray';
  }

  lightColorAsType(type: string): string {
    const pokemonTypes = this.pokemonDataService.getPokemonTypes();
    const matchedType = pokemonTypes.find(t => t.type === type);
    return matchedType ? matchedType.colorLight : 'gray';
  }



  onMouseEnterType(learnType: string) {
    this.hoveredLearnType = learnType;  // Setzt das aktuell gehoverte Element
  }

  onMouseLeaveType() {
    this.hoveredLearnType = null;  // Entfernt den Hover-Zustand, wenn die Maus den Container verlässt
  }


  onMouseEnterVersion(version: string) {
    this.hoveredGameVersion = version;  // Setzt das aktuell gehoverte Element
  }

  onMouseLeaveVersion() {
    this.hoveredGameVersion = null;  // Entfernt den Hover-Zustand, wenn die Maus den Container verlässt
  }

  setActiveLearnType(learnType: string) {
    this.activeLearnTypeNonFormatted = learnType;

    if (learnType === "Level Up") {
      learnType = "level-up"
    } else if (learnType === "TM/HM") {
      learnType = "machine"
    } else if (learnType === "Tutor") {
      learnType = "tutor"
    } else if (learnType === "Egg") {
      learnType = "egg"
    }

    this.activeLearnType = learnType;
    console.log(this.activeLearnType);
    this.filterMovesByLearnType();

  }

  filterMovesByLearnType() {
    this.movesFilteredByLearnMethod = "";
    this.movesFilteredByLearnMethod = this.pokemonMoves.filter((move: MovesData) => move.learnMethod === this.activeLearnType);
    console.log("Learn Type GEFILTERTE ATTACKEN", this.movesFilteredByLearnMethod);
    if (this.activeGameVersion) {
      this.filterMovesByGameVersion()
    }
  }

  setActiveGameVersion(gameVersion: string) {
    this.activeGameVerisonNonFormatted = gameVersion;

    if (gameVersion === "RB") {
      gameVersion = "red-blue"
    } else if (gameVersion === "Y") {
      gameVersion = "yellow"
    } else if (gameVersion === "GS") {
      gameVersion = "gold-silver"
    } else if (gameVersion === "C") {
      gameVersion = "crystal"
    } else if (gameVersion === "RS") {
      gameVersion = "ruby-sapphire"
    } else if (gameVersion === "E") {
      gameVersion = "emerald"
    } else if (gameVersion === "FRLG") {
      gameVersion = "firered-leafgreen"
    } else if (gameVersion === "DP") {
      gameVersion = "diamond-pearl"
    } else if (gameVersion === "P") {
      gameVersion = "platinum"
    } else if (gameVersion === "HGSS") {
      gameVersion = "heartgold-soulsilver"
    } else if (gameVersion === "BW") {
      gameVersion = "black-white"
    } else if (gameVersion === "B2W2") {
      gameVersion = "black-2-white-2"
    } else if (gameVersion === "XY") {
      gameVersion = "x-y"
    } else if (gameVersion === "ORAS") {
      gameVersion = "omega-ruby-alpha-sapphire"
    } else if (gameVersion === "SM") {
      gameVersion = "sun-moon"
    } else if (gameVersion === "USUM") {
      gameVersion = "ultra-sun-ultra-moon"
    } else if (gameVersion === "LGPLGE") {
      gameVersion = "lets-go-pikachu-lets-go-eevee"
    } else if (gameVersion === "SS") {
      gameVersion = "sword-shield"
    } else if (gameVersion === "BDSP") {
      gameVersion = "brilliant-diamond-and-shining-pearl"
    } else if (gameVersion === "SV") {
      gameVersion = "scarlet-violet"
    }

    this.activeGameVersion = gameVersion;
    console.log(this.activeGameVersion);
    this.filterMovesByGameVersion();
  }

  filterMovesByGameVersion() {
    this.movesFilteredByGameVersion = "";
    this.movesFilteredByGameVersion = this.movesFilteredByLearnMethod.filter((move: MovesData) => move.gameGeneration === this.activeGameVersion);
    this.movesFilteredByGameVersion.sort((a: MovesData, b: MovesData) => a.levelLearnedAt - b.levelLearnedAt);
    console.log("Kombo", this.activeLearnType, this.activeGameVersion);
    console.log("VERSIONEN GEFILTERTE ATTACKEN", this.movesFilteredByGameVersion);
  }

  async fetchAndProcessMovesData() {
    console.log("Fetch Move geht los");
    for (let i = 0; i < this.pokemon.moves.length; i++) {
      const move = this.pokemon.moves[i].name;
      console.log("Jeder Move", move);



      try {
        const data = await this.pokemonDataService.fetchPokemonMovesData(move).toPromise();
        this.pushPokemonMovesDataInArray(data, i);

      } catch (error) {
        console.error('Fehler beim Laden der Pokemon-Moves-Daten:', error);
      }
    }
  }

  pushPokemonMovesDataInArray(moveData: any, i: number) {
    console.log("moveDATA", moveData);
    console.log("Pokemon", this.pokemon);
    console.log("------------", this.pokemon.moves[i]['version_group_details']['0']['version_group_name']);
    console.log("+++++++++++++");

    for (let j = 0; j < this.pokemon.moves[i]['version_group_details'].length; j++) {
      const element = this.pokemon.moves[i]['version_group_details'][j];


      const pokemonMovesData = {
        name: this.pokemon.moves[i]['name'],
        gameGeneration: this.pokemon.moves[i]['version_group_details'][j]['version_group_name'],
        levelLearnedAt: this.pokemon.moves[i]['version_group_details'][j]['level_learned_at'],
        learnMethod: this.pokemon.moves[i]['version_group_details'][j]['move_learn_method_name'],
        type: moveData['type']['name'],
        damageClass: moveData['damage_class']['name'],
        power: moveData['power'],
        powerPoint: moveData['pp'],
        accuracy: moveData['accuracy']
      };
      console.log("pokemonMovesData", pokemonMovesData);
      this.pokemonDataService.addPokemonMovesData(pokemonMovesData);
    }
  }

  loadPokemonMoves() {
    this.pokemonMoves = this.pokemonDataService.getPokemonMovesData();
    console.log("this.pokemonMoves", this.pokemonMoves);
  }



}
