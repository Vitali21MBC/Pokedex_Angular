import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { OFOSEDesktopComponent } from './ofose-desktop/ofose-desktop.component';
import { OFOSEMobileComponent } from './ofose-mobile/ofose-mobile.component';
import { ViewportService } from '../../../../../../../viewport.service';

@Component({
  selector: 'app-one-first-one-second-evo',
  standalone: true,
  imports: [CommonModule, OFOSEDesktopComponent, OFOSEMobileComponent],
  templateUrl: './one-first-one-second-evo.component.html',
  styleUrl: './one-first-one-second-evo.component.scss'
})
export class OneFirstOneSecondEvoComponent {
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
