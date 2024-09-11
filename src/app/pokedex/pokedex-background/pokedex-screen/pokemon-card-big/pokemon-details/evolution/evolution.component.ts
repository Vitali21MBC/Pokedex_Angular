import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-evolution',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './evolution.component.html',
  styleUrl: './evolution.component.scss'
})
export class EvolutionComponent {
  @Input() selectedPokemonId: number | null = null;

}
