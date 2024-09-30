import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Evolution, EvolutionDetails, PokemonDataService, PokemonEvolutions } from '../../../../../../../pokemon-data.service';
import { OfeDesktopComponent } from './ofe-desktop/ofe-desktop.component';
import { OfeMobileComponent } from './ofe-mobile/ofe-mobile.component';
import { ViewportService } from '../../../../../../../viewport.service';

@Component({
  selector: 'app-one-first-evo',
  standalone: true,
  imports: [CommonModule, OfeDesktopComponent, OfeMobileComponent],
  templateUrl: './one-first-evo.component.html',
  styleUrl: './one-first-evo.component.scss'
})
export class OneFirstEvoComponent implements OnInit {
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

