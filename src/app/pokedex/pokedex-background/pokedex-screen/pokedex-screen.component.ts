import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { PokemonDataService } from '../../../pokemon-data.service';
import { PokemonCardSmallComponent } from './pokemon-card-small/pokemon-card-small.component';
import { PokemonCardBigComponent } from './pokemon-card-big/pokemon-card-big.component';

@Component({
  selector: 'app-pokedex-screen',
  standalone: true,
  imports: [CommonModule, HttpClientModule, PokemonCardSmallComponent, PokemonCardBigComponent],
  templateUrl: './pokedex-screen.component.html',
  styleUrl: './pokedex-screen.component.scss'
})
export class PokedexScreenComponent implements OnInit {
  @ViewChild(PokemonCardSmallComponent) pokemonList!: PokemonCardSmallComponent;
  @ViewChild(PokemonCardBigComponent) bigPokemonCard!: PokemonCardBigComponent;

  selectedPokemonId: number | null = null;

  searchQuery: string = '';

  isLoading: boolean = false;
  newPokemonLoaded = new Subject<void>();
  pokemonInfoIsOpen: boolean = false;

  // Store the last scroll position of pokemon-list
  lastScrollPosition: number = 0;

  constructor(private pokemonDataService: PokemonDataService) { }

  ngOnInit(): void {
    this.initialLoadOfPokemon();
    this.pokemonDataService.pokemonInfoIsOpen$.subscribe((isOpen: boolean) => {
      this.pokemonInfoIsOpen = isOpen;
      if (!isOpen) {
        setTimeout(() => {
          this.scrollToElement('pokemon-list', this.lastScrollPosition);
          // Stelle sicher, dass der Filter erneut angewendet wird, wenn der Suchtext existiert
          if (this.searchQuery.length >= 3) {
            this.searchPokemon();
          }
        }, 25);
      }
    });
  }

  async initialLoadOfPokemon() {
    this.isLoading = true;
    for (let i = 2; i < 32; i++) {
      await this.fetchAndProcessPokemon();
    }
    this.isLoading = false;
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
      height: eachPokemon['height'],
      weight: eachPokemon['weight'],
      type_1: eachPokemon['types'][0]['type']['name'],
      type_2: eachPokemon['types'][1]['type']['name'],
      sprite: eachPokemon['sprites']['front_default'],
      sprite_big: eachPokemon['sprites']['other']['official-artwork']['front_default'],
      sprite_shiny: eachPokemon['sprites']['other']['official-artwork']['front_shiny'],
    };
    this.pokemonDataService.addPokemon(pokemonBasicData);
  }

  pushOneTypeInArray(eachPokemon: any) {
    const pokemonBasicData = {
      id: eachPokemon['id'],
      name: eachPokemon['name'],
      height: eachPokemon['height'],
      weight: eachPokemon['weight'],
      type_1: eachPokemon['types'][0]['type']['name'],
      sprite: eachPokemon['sprites']['front_default'],
      sprite_big: eachPokemon['sprites']['other']['official-artwork']['front_default'],
      sprite_shiny: eachPokemon['sprites']['other']['official-artwork']['front_shiny'],
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
  
    // Wende den Filter erneut an, wenn die Suchleiste nicht leer ist
    if (this.searchQuery.length >= 3) {
      this.searchPokemon();
    }
  }

searchPokemon() {
  const searchElement = document.getElementById('searchPokemon') as HTMLInputElement;

  if (searchElement) {
    this.searchQuery = searchElement.value.toLowerCase();

    if (this.searchQuery.length >= 3) {
      const filteredPokemons = this.pokemonDataService.getPokemons().filter((element: any) => {
        return element['type_1'].toLowerCase().includes(this.searchQuery) ||
          element['name'].toLowerCase().includes(this.searchQuery);
      });

      this.pokemonList.setFilteredPokemons(filteredPokemons);
    } else {
      this.pokemonList.setFilteredPokemons(this.pokemonDataService.getPokemons());
    }
  }
}

  openPokemonInfoCard(pokemonId: number) {
    this.getScrollPosition();
    console.log("lastScrollPosition", this.lastScrollPosition);
    this.selectedPokemonId = pokemonId;
    this.pokemonInfoIsOpen = true;
    this.pokemonDataService.setPokemonInfoIsOpen(this.pokemonInfoIsOpen);
  }

  getScrollPosition() {
    const pokemonList = document.getElementById('pokemon-list');
    if (pokemonList) {
      this.lastScrollPosition = pokemonList.scrollTop;
      console.log('Scroll position:', this.lastScrollPosition);
    }
  }

  scrollToElement(elementId: string, scrollTo: number) {
    const element = document.getElementById(elementId);

    if (element) {
      // Berechne die genaue Position, abhängig von deinem Layout und den Elementen
      const targetPosition = scrollTo; // Passe diesen Wert an deine Bedürfnisse an

      // Scrollen zur berechneten Position mit einem sanften Effekt
      element.scrollTo({
        top: targetPosition,
      });
    } else {
      console.error('Element with ID', elementId, 'not found');
    }
  }

}
