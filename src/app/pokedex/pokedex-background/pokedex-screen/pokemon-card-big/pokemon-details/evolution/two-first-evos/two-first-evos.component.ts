import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-two-first-evos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './two-first-evos.component.html',
  styleUrl: './two-first-evos.component.scss'
})
export class TwoFirstEvosComponent {
  @Input() selectedPokemonId: number | null = null;
  @Input() lvlUpTrigger: string | null = null;
  @Input() pokemon: any;
  @Input() basePokemonData: any;
  @Input() firstEvoPokemonName: any;
}
