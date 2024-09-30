import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TfeDesktopComponent } from './tfe-desktop/tfe-desktop.component';
import { TfeMobileComponent } from './tfe-mobile/tfe-mobile.component';
import { PokemonDataService } from '../../../../../../../pokemon-data.service';
import { ViewportService } from '../../../../../../../viewport.service';

@Component({
  selector: 'app-two-first-evos',
  standalone: true,
  imports: [CommonModule, TfeDesktopComponent, TfeMobileComponent],
  templateUrl: './two-first-evos.component.html',
  styleUrl: './two-first-evos.component.scss'
})
export class TwoFirstEvosComponent {
  @Input() selectedPokemonId: number | null = null;
  @Input() lvlUpTrigger: string | null = null;
  @Input() pokemon: any;
  @Input() pokemonDetailsOfEvoChain: any;
  isMobile: boolean = false;

  constructor(
    private pokemonDataService: PokemonDataService,
    private viewportService: ViewportService
  ) { }

  ngOnInit(): void {
    this.viewportService.isMobile$.subscribe((mobile) => {
      this.isMobile = mobile;
    });
  }
}
