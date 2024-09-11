import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AboutComponent } from './about/about.component';
import { StatsComponent } from './stats/stats.component';
import { EvolutionComponent } from './evolution/evolution.component';
import { MovesComponent } from './moves/moves.component';

@Component({
  selector: 'app-pokemon-details',
  standalone: true,
  imports: [CommonModule, AboutComponent, StatsComponent, EvolutionComponent, MovesComponent],
  templateUrl: './pokemon-details.component.html',
  styleUrl: './pokemon-details.component.scss'
})
export class PokemonDetailsComponent implements OnInit{
  @Input() selectedPokemonId: number | null = null;
  activeMenu: number = 0; // Track which menu is active
  activePosition: number = 0; // Position des Unterstrichs
  activeWidth: number = 0; // Breite des Unterstrichs

  @ViewChild('menu', { static: true }) menu!: ElementRef; // Referenz auf das Menü

  ngOnInit() {
    // Berechne die Startposition für das erste Menüelement
    setTimeout(() => {
      this.setActiveMenu(0); // Standardmäßiger Menüpunkt (z.B. der erste)
    }, 25);
  }

  setActiveMenu(index: number) {
    this.activeMenu = index;

    const menuItems = this.menu.nativeElement.querySelectorAll('.nav-bar-menu-item');
    const activeItem = menuItems[index];
  
    // Finde den übergeordneten Container, auf den sich das Menüelement bezieht
    const parentElement = this.menu.nativeElement.querySelector('.nav-bar-menu-list');
    const parentLeft = parentElement.getBoundingClientRect().left;
    const paddingLeft = parseFloat(getComputedStyle(parentElement).paddingLeft);
  
    // Berechne die relative Position des aktiven Menüpunkts zur Parent-Komponente
    const itemRect = activeItem.getBoundingClientRect();
    this.activePosition = itemRect.left - parentLeft - paddingLeft;
  
    // Breite des aktiven Menüpunkts
    this.activeWidth = activeItem.offsetWidth;
  }

}
