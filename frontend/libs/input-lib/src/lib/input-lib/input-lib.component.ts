import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NxErrorModule } from '@aposin/ng-aquila/base';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxDropdownComponent, NxDropdownItemComponent } from '@aposin/ng-aquila/dropdown';
import { NxFormfieldComponent } from '@aposin/ng-aquila/formfield';
import { NxColComponent, NxLayoutComponent, NxRowComponent } from '@aposin/ng-aquila/grid';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMessageModule } from '@aposin/ng-aquila/message';

import { InputStore } from './store/input.store';
import { Input } from './store/input.store.interfaces';

@Component({
  selector: 'lib-input-lib',
  standalone: true,
  imports: [CommonModule, NxLayoutComponent, NxRowComponent, NxColComponent, NxFormfieldComponent, NxDropdownComponent, NxDropdownItemComponent, NxInputModule, NxErrorModule, NxButtonModule, NxMessageModule],
  templateUrl: './input-lib.component.html',
  styleUrl: './input-lib.component.scss',
})
export class InputLibComponent implements OnInit {
  protected readonly inputStore = inject(InputStore);
  protected maxDate = '';

  ngOnInit(): void {
    // Set max date to today to prevent future dates
    this.maxDate = new Date().toISOString().split('T')[0];
  }

  updateInputs(input: Input): void {
    this.inputStore.updateInputs(input);
  }

  async calculate(): Promise<void> {
    await this.inputStore.calculate();
  }

  clearError(): void {
    this.inputStore.clearError();
  }

  calculateAge(birthDate: string): number {
    if (!birthDate) return 0;
    
    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear() - 
      (today.getMonth() < birth.getMonth() || 
       (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate()) ? 1 : 0);
    
    return age;
  }
}
