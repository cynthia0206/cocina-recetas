import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Receta } from '../models/receta.model';

@Component({
  selector: 'app-detalle-receta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-receta.component.html',
  styleUrl: './detalle-receta.component.css'
})
export class DetalleRecetaComponent implements OnChanges {
  @Input() receta: Receta | null = null;
  @Output() cerrar = new EventEmitter<void>();

  // Arreglo para controlar qué ingredientes se han marcado como "listos"
  ingredientesCompletados: boolean[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['receta'] && this.receta) {
      // Reiniciar la lista de ingredientes marcados
      this.ingredientesCompletados = new Array(this.receta.ingredientes.length).fill(false);
    }
  }

  cerrarModal(): void {
    this.cerrar.emit();
  }

  toggleIngrediente(index: number): void {
    this.ingredientesCompletados[index] = !this.ingredientesCompletados[index];
  }
}
