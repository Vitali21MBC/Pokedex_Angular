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
export class OneFirstEvoComponent {
  @Input() selectedPokemonId: number | null = null;
  @Input() lvlUpTrigger: string | null = null;
  @Input() pokemon: any;
  @Input() firstEvoPokemonName: any;


  constructor(private pokemonDataService: PokemonDataService) { }

}

