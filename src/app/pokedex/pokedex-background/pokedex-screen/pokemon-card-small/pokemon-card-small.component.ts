import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { PokedexScreenComponent } from '../pokedex-screen.component';
import { Subscription } from 'rxjs';
import { PokemonDataService } from '../../../../pokemon-data.service';

@Component({
  selector: 'app-pokemon-card-small',
  standalone: true,
  imports: [CommonModule, HttpClientModule, PokedexScreenComponent],
  templateUrl: './pokemon-card-small.component.html',
  styleUrl: './pokemon-card-small.component.scss'
})
export class PokemonCardSmallComponent implements OnInit, OnDestroy {
  private subscription?: Subscription;
  @Output() pokemonCardButtonClicked = new EventEmitter<void>();

  constructor(
    private pokemonDataService: PokemonDataService,
    private pokedexScreenComponent: PokedexScreenComponent,
    private el: ElementRef
  ) { }

  filteredPokemons: any[] = [];

  ngOnInit() {
    console.log('PokemonCardSmallComponent initialized');
    this.filteredPokemons = this.getPokemons(); // Initialisierung mit allen Pokémon
    this.subscription = this.pokedexScreenComponent.newPokemonLoaded.subscribe(() => {
      console.log('New Pokemon loaded event received');
      this.scrollToBottom();
    });
}

setFilteredPokemons(pokemons: any[]) {
  this.filteredPokemons = pokemons;
}

ngOnDestroy() {
  if (this.subscription) {
    this.subscription.unsubscribe();
  }
}

getPokemons() {
  return this.pokemonDataService.getPokemons();
}

formatPokemonId(id: number): string {
  if (id < 10) return `#000${id}`;
  else if (id < 100) return `#00${id}`;
  else if (id < 1000) return `#0${id}`;
  else return `#${id}`;
}

backgroundColorAsType(type: string): string {
  const pokemonTypes = this.pokemonDataService.getPokemonTypes();
  const matchedType = pokemonTypes.find(t => t.type === type);
  return matchedType ? matchedType.color : 'gray';
}

private scrollToBottom() {
  console.log('Attempting to scroll to bottom');
  setTimeout(() => {
    const container = this.el.nativeElement;
    console.log('Scrollable container:', container);
    console.log('Scrolling to:', container.scrollHeight);
    container.scrollTop = container.scrollHeight;
  }, 300);
}

openPokemonInfoCard() {
  this.pokemonCardButtonClicked.emit();
}



}
