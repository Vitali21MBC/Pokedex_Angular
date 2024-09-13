import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PokemonDataService, PokemonEvolutions, Evolution, EvolutionDetails } from '../../../../../../pokemon-data.service';
import { OneFirstEvoComponent } from "./one-first-evo/one-first-evo.component";

@Component({
  selector: 'app-evolution',
  standalone: true,
  imports: [CommonModule, OneFirstEvoComponent],
  templateUrl: './evolution.component.html',
  styleUrl: './evolution.component.scss'
})
export class EvolutionComponent implements OnInit {
  @Input() selectedPokemonId: number | null = null;
  pokemon: any;
  pokemonEvo: any;
  pokemonFirstEvo: any;
  basicDataURL = this.pokemonDataService.basicDataURL;

  constructor(private pokemonDataService: PokemonDataService) { }

  async ngOnInit() {
    if (this.selectedPokemonId) {
    }
  }
}
