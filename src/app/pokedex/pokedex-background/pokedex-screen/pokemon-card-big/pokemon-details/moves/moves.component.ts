import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-moves',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './moves.component.html',
  styleUrl: './moves.component.scss'
})
export class MovesComponent {
  @Input() selectedPokemonId: number | null = null;

}
