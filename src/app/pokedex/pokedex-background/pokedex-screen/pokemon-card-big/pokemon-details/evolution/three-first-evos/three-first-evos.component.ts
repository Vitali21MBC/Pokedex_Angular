import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ViewportService } from '../../../../../../../viewport.service';
import { THFEDesktopComponent } from './thfe-desktop/thfe-desktop.component';
import { THFEMobileComponent } from './thfe-mobile/thfe-mobile.component';

@Component({
  selector: 'app-three-first-evos',
  standalone: true,
  imports: [CommonModule, THFEDesktopComponent, THFEMobileComponent],
  templateUrl: './three-first-evos.component.html',
  styleUrl: './three-first-evos.component.scss'
})
export class ThreeFirstEvosComponent {
  @Input() selectedPokemonId: number | null = null;
  @Input() lvlUpTrigger: string | null = null;
  @Input() pokemon: any;
  @Input() pokemonDetailsOfEvoChain: any;
  isMobile: boolean = false;

  
  constructor(
    private viewportService: ViewportService
  ) { }

  ngOnInit(): void {
    this.viewportService.isMobile$.subscribe((mobile) => {
      this.isMobile = mobile;
    });
  }
}
