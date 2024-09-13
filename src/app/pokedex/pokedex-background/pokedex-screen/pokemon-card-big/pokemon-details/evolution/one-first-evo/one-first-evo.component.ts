import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Evolution, EvolutionDetails, PokemonDataService, PokemonEvolutions } from '../../../../../../../pokemon-data.service';

@Component({
  selector: 'app-one-first-evo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './one-first-evo.component.html',
  styleUrl: './one-first-evo.component.scss'
})
export class OneFirstEvoComponent implements OnInit {
  @Input() selectedPokemonId: number | null = null;
  pokemon: any;
  pokemonEvoData: any;
  firstEvolutionName: any;
  basePokemonName: any;
  firstEvoPokemonName: any;

  constructor(private pokemonDataService: PokemonDataService) { }

  async ngOnInit() {
    await this.fetchAndProcessPokemonEvolutions();
    this.loadPokemonEvolutionDetails();
    this.loadPokemonDetails();
    await this.fetchAndProcessPokemonFirstEvolution();
    this.loadPokemonFirstEvolutionDetails();
  }

  // Diese Funktion holt sich die Daten aus dem DataService um den Namen und das Bild des Basis Pokemons darzustellen.
  // Da dieses bereits im pokemons Array vorhanden ist, durch die ursprüngliche Darstellung der Pokemonübersicht, muss hier nicht neu gefetcht werden.
  loadPokemonDetails() {
    const pokemons = this.pokemonDataService.getPokemons();
    this.pokemon = pokemons.find(p => p.name === this.basePokemonName) || null;
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
    this.basePokemonName = this.pokemonEvoData.base_pokemon;
    this.firstEvolutionName = this.pokemonEvoData.evolutions[0].name;
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
}
