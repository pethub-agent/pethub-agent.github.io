import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { liveQuery } from 'dexie';
import { from } from 'rxjs';
import { db } from '../../core/services/database/db';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
})
export class TestComponent {
  species = from(liveQuery(() => this.listSpecies()));

  listSpecies() {
    return db.specie.toArray();
  }

  add() {
    db.specie.add({
      name: 'Teste',
    });
  }
}
