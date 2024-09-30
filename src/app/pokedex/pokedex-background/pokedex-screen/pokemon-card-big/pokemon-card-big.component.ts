import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PokemonIllustrationComponent } from './pokemon-illustration/pokemon-illustration.component';
import { PokemonDetailsComponent } from './pokemon-details/pokemon-details.component';
import { ViewportService } from '../../../../viewport.service';
import { PokemonIllustrationMobileComponent } from './pokemon-illustration-mobile/pokemon-illustration-mobile.component';

@Component({
  selector: 'app-pokemon-card-big',
  standalone: true,
  imports: [CommonModule, PokemonIllustrationComponent, PokemonDetailsComponent, PokemonIllustrationMobileComponent],
  templateUrl: './pokemon-card-big.component.html',
  styleUrl: './pokemon-card-big.component.scss'
})
export class PokemonCardBigComponent implements OnInit{
  @Input() selectedPokemonId: number | null = null;
  isMobile: boolean = false;

  constructor(private viewportService: ViewportService) {}

  ngOnInit(): void {
    this.viewportService.isMobile$.subscribe((mobile) => {
      this.isMobile = mobile;
    });
  }
}
