import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PokemonDataService } from '../../../../../../../pokemon-data.service';

@Component({
  selector: 'app-no-evolution',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './no-evolution.component.html',
  styleUrl: './no-evolution.component.scss'
})
export class NoEvolutionComponent {

  constructor(private pokemonDataService: PokemonDataService) { }

}
