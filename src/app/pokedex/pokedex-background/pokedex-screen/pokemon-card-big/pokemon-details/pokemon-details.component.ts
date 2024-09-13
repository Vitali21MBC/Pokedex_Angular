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
  
    // Manuelle Anpassungen basierend auf dem Menüindex
    if (index === 0) {
      // Erster Menüpunkt - Manuelle Anpassung (z.B. etwas nach rechts verschieben)
      this.activePosition += 3.2; // Verschiebe den Unterstrich um 2px nach rechts
    } else if (index === 1) {
      // Zweiter Menüpunkt - Manuelle Anpassung
      this.activePosition += 7; // Verschiebe den Unterstrich um 4px nach rechts
    } else if (index === 2) {
      // Dritter Menüpunkt - Manuelle Anpassung
      this.activePosition += 7; // Verschiebe den Unterstrich um 3px nach links
    } else if (index === 3) {
      // Vierter Menüpunkt - Manuelle Anpassung
      this.activePosition += 4; // Verschiebe den Unterstrich um 2px nach links
    }
  }
  

}
