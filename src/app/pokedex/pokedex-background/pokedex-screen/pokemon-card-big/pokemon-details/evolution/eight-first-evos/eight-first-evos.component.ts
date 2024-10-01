import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { EFEDesktopComponent } from './efe-desktop/efe-desktop.component';
import { EFEMobileComponent } from './efe-mobile/efe-mobile.component';
import { ViewportService } from '../../../../../../../viewport.service';

@Component({
  selector: 'app-eight-first-evos',
  standalone: true,
  imports: [CommonModule, EFEDesktopComponent, EFEMobileComponent],
  templateUrl: './eight-first-evos.component.html',
  styleUrl: './eight-first-evos.component.scss'
})
export class EightFirstEvosComponent {
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
