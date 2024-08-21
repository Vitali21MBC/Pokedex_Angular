import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PokedexBackgroundComponent } from './pokedex-background/pokedex-background.component';

@Component({
  selector: 'app-pokedex',
  standalone: true,
  imports: [CommonModule, PokedexBackgroundComponent],
  templateUrl: './pokedex.component.html',
  styleUrl: './pokedex.component.scss'
})
export class PokedexComponent {

}
