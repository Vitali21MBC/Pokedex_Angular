import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { OftseDesktopComponent } from './oftse-desktop/oftse-desktop.component';
import { OftseMobileComponent } from './oftse-mobile/oftse-mobile.component';
import { ViewportService } from '../../../../../../../viewport.service';

@Component({
  selector: 'app-one-first-two-second-evos',
  standalone: true,
  imports: [CommonModule, OftseDesktopComponent, OftseMobileComponent],
  templateUrl: './one-first-two-second-evos.component.html',
  styleUrl: './one-first-two-second-evos.component.scss'
})
export class OneFirstTwoSecondEvosComponent {
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
