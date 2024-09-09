import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PokedexScreenComponent } from './pokedex-screen/pokedex-screen.component';
import { PokemonDataService } from '../../pokemon-data.service';

@Component({
  selector: 'app-pokedex-background',
  standalone: true,
  imports: [CommonModule, PokedexScreenComponent],
  templateUrl: './pokedex-background.component.html',
  styleUrl: './pokedex-background.component.scss'
})
export class PokedexBackgroundComponent implements OnInit{

  pokemonInfoIsOpen: boolean = false;

  constructor(private pokemonDataService: PokemonDataService) { }

  ngOnInit(): void {
    // Abonniere den Zustand aus dem Service
    this.pokemonDataService.pokemonInfoIsOpen$.subscribe((isOpen: boolean) => {
      this.pokemonInfoIsOpen = isOpen;
    });
  }

  // Beispiel-Methode, um den Zustand zu ändern
  togglePokemonInfo() {
    this.pokemonDataService.setPokemonInfoIsOpen(!this.pokemonInfoIsOpen);
  }

  

}
