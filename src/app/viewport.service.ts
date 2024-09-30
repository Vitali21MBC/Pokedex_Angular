import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewportService {

  private mobileSubject = new BehaviorSubject<boolean>(false);
  isMobile$ = this.mobileSubject.asObservable();

  constructor() { 
    this.updateViewPort();
    window.addEventListener('resize', () => this.updateViewPort());
  }

  private updateViewPort() {
    this.mobileSubject.next(window.innerWidth < 768); // Beispiel: unter 768px ist "Mobile"
  }
}
