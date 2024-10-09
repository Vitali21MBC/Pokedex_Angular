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

  excludedVersions: string[] = [];
  releaseOrder: string[] = [];
  uniqueSortedGameVersions: string[] = [];

  isLoading: boolean = false;

  activeLearnTypeNonFormatted: any;
  activeGameVerisonNonFormatted: any;

  hoveredLearnType: string | null = null;
  hoveredGameVersion: string | null = null;  // Variable für den Hover-Zustand

  versionAbbreviations: { [key: string]: string } = {
    'red-blue': 'RB',
    'yellow': 'Y',
    'gold-silver': 'GS',
    'crystal': 'C',
    'ruby-sapphire': 'RS',
    'emerald': 'E',
    'firered-leafgreen': 'FR/LG',
    'diamond-pearl': 'DP',
    'platinum': 'P',
    'heartgold-soulsilver': 'HG/SS',
    'black-white': 'BW',
    'black-2-white-2': 'B2/W2',
    'x-y': 'XY',
    'omega-ruby-alpha-sapphire': 'OR/AS',
    'sun-moon': 'SM',
    'ultra-sun-ultra-moon': 'US/UM',
    'sword-shield': 'Sw/Sh',
    'brilliant-diamond-and-shining-pearl': 'BD/SP',
    'scarlet-violet': 'SV',
    'colosseum': 'Col',
    'xd': 'XD',
    'lets-go-pikachu-lets-go-eevee': 'LGPE'
  };

  constructor(private pokemonDataService: PokemonDataService) { }

  async ngOnInit() {
    this.moveLearnMethods = this.pokemonDataService.moveLearnMethod;
    this.pokemonGameVersions = this.pokemonDataService.pokemonGameVersions;
    if (this.selectedPokemonId) {
      this.pokemonDataService.clearPokemonMovesData();
      this.loadPokemonDetails();
      this.setActiveLearnType("Level Up");
      await this.fetchAndProcessMovesData();
      this.loadPokemonMoves();
      this.filterMovesByLearnType();
      this.loadPokemonGameVersions()
      if (this.uniqueSortedGameVersions.length > 0) {
        this.setActiveGameVersion(this.uniqueSortedGameVersions[0]);
      }
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
    // Überprüfen, ob es überhaupt Moves gibt, die zum ausgewählten Learn Type passen.
    const movesByLearnType = this.pokemonMoves.filter((move: MovesData) => move.learnMethod === this.activeLearnType);

    // Setze die gefilterte Liste entweder auf die gefilterten Moves oder auf eine leere Liste.
    this.movesFilteredByLearnMethod = movesByLearnType.length > 0 ? movesByLearnType : [];

    console.log("Learn Type GEFILTERTE ATTACKEN", this.movesFilteredByLearnMethod);

    // Wenn keine Moves vorhanden sind, setze auch die game version Filter zurück.
    if (this.movesFilteredByLearnMethod.length === 0) {
      this.movesFilteredByGameVersion = [];
    } else if (this.activeGameVersion) {
      this.filterMovesByGameVersion();
    }
  }

  setActiveGameVersion(gameVersion: string) {
    console.log("setActiveGameVersion gameVersion", gameVersion);
    this.activeGameVerisonNonFormatted = gameVersion;
    console.log("setActiveGameVersion this.activeGameVerisonNonFormatted", this.activeGameVerisonNonFormatted);

    this.activeGameVersion = gameVersion;
    console.log(this.activeGameVersion);

    this.filterMovesByGameVersion();
  }

  filterMovesByGameVersion() {
    if (this.movesFilteredByLearnMethod.length > 0) {
      // Filtere nach Game Version, falls Moves für den Learn Type vorhanden sind.
      const movesByGameVersion = this.movesFilteredByLearnMethod.filter((move: MovesData) => move.gameGeneration === this.activeGameVersion);
      this.movesFilteredByGameVersion = movesByGameVersion.length > 0 ? movesByGameVersion : [];

      // Sortiere die gefilterten Moves nach Level.
      this.movesFilteredByGameVersion.sort((a: MovesData, b: MovesData) => a.levelLearnedAt - b.levelLearnedAt);
      console.log("VERSIONEN GEFILTERTE ATTACKEN", this.movesFilteredByGameVersion);
    } else {
      // Falls keine Moves für den Learn Type gefunden wurden, setze die Liste zurück.
      this.movesFilteredByGameVersion = [];
    }
  }

  async fetchAndProcessMovesData() {
    console.log("Fetch Move geht los");
    this.isLoading = true;
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
    this.isLoading = false;
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

  loadPokemonGameVersions() {
    this.excludeNonMainGames();
    this.getGameReleaseOrder();
    this.sortGameVersionAccordingRelease();
  }

  excludeNonMainGames() {
    this.excludedVersions = ['xd', 'colosseum', 'lets-go-pikachu-lets-go-eevee'];
  }

  getGameReleaseOrder() {
    this.releaseOrder = [
      'red-blue', 'yellow', 'gold-silver', 'crystal', 'ruby-sapphire',
      'emerald', 'firered-leafgreen', 'diamond-pearl', 'platinum',
      'heartgold-soulsilver', 'black-white', 'black-2-white-2', 'x-y',
      'omega-ruby-alpha-sapphire', 'sun-moon', 'ultra-sun-ultra-moon',
      'sword-shield', 'brilliant-diamond-and-shining-pearl', 'scarlet-violet'
    ];
  }

  sortGameVersionAccordingRelease() {
    this.uniqueSortedGameVersions = [
      ...new Set(
        this.pokemonMoves
          .filter(move => !this.excludedVersions.includes(move.gameGeneration))
          .map(move => move.gameGeneration)
      ),
    ].sort((a, b) => this.releaseOrder.indexOf(a) - this.releaseOrder.indexOf(b)); // Sortieren basierend auf der Reihenfolge
    console.log(this.uniqueSortedGameVersions);
  }

  getFullVersionName(version: string): string {
    const versionNames: { [key: string]: string } = {
      'RB': 'Red / Blue',
      'Y': 'Yellow',
      'GS': 'Gold / Silver',
      'C': 'Crystal',
      'RS': 'Ruby / Sapphire',
      'E': 'Emerald',
      'FRLG': 'Firered / Leafgreen',
      'DP': 'Diamond / Pearl',
      'P': 'Platinum',
      'HGSS': 'Heartgold / Soulsilver',
      'BW': 'Black / White',
      'B2W2': 'Black 2 / White 2',
      'XY': 'X / Y',
      'ORAS': 'Omega Ruby / Alpha-Sapphire',
      'SM': 'Sun / Moon',
      'USUM': 'Ultra Sun / Ultra Moon',
      'LGPLGE': 'Lets Go Pikachu / Lets Go Eevee',
      'SS': 'Sword / Shield',
      'BDSP': 'Brilliant Diamond / Shining Pearl',
      'SV': 'Scarlet / Violet',
      // Füge hier weitere Kürzel und ihre ausgeschriebenen Namen hinzu.
    };
    return versionNames[version] || version;
  }



}
