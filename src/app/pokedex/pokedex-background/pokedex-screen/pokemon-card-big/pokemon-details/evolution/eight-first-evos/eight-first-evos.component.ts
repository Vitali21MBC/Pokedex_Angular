import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-eight-first-evos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eight-first-evos.component.html',
  styleUrl: './eight-first-evos.component.scss'
})
export class EightFirstEvosComponent {
  @Input() selectedPokemonId: number | null = null;
  @Input() lvlUpTrigger: string | null = null;
  @Input() pokemon: any;
  @Input() firstEvoPokemonName: any;
}
