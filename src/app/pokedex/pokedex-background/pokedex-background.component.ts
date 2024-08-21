import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PokedexScreenComponent } from '../pokedex-screen/pokedex-screen.component';

@Component({
  selector: 'app-pokedex-background',
  standalone: true,
  imports: [CommonModule, PokedexScreenComponent],
  templateUrl: './pokedex-background.component.html',
  styleUrl: './pokedex-background.component.scss'
})
export class PokedexBackgroundComponent {

}
