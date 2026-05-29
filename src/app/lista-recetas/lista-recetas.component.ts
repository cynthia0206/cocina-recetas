import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Receta } from '../models/receta.model';
import { RecetaService } from '../services/receta.service';
import { DetalleRecetaComponent } from '../detalle-receta/detalle-receta.component';

@Component({
  selector: 'app-lista-recetas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DetalleRecetaComponent],
  templateUrl: './lista-recetas.component.html',
  styleUrl: './lista-recetas.component.css'
})
export class ListaRecetasComponent implements OnInit {
  recetas: Receta[] = [];
  searchTerm: string = '';
  recetaSeleccionada: Receta | null = null;
  soloFavoritas: boolean = false;

  constructor(
    private recetaService: RecetaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.soloFavoritas = this.router.url.includes('favoritos');
    this.obtenerRecetas();
  }

  obtenerRecetas(): void {
    const todas = this.recetaService.getRecetas();
    if (this.soloFavoritas) {
      this.recetas = todas.filter(r => r.esFavorita);
    } else {
      this.recetas = todas;
    }
  }

  get recetasFiltradas(): Receta[] {
    if (!this.searchTerm.trim()) {
      return this.recetas;
    }
    const term = this.searchTerm.toLowerCase();
    return this.recetas.filter(r =>
      r.nombre.toLowerCase().includes(term) ||
      r.categoria.toLowerCase().includes(term) ||
      r.ingredientes.some(ing => ing.toLowerCase().includes(term))
    );
  }

  verDetalle(receta: Receta): void {
    this.recetaSeleccionada = receta;
  }

  cerrarDetalle(): void {
    this.recetaSeleccionada = null;
  }

  editarReceta(id: string): void {
    this.router.navigate(['/editar', id]);
  }

  eliminarReceta(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta receta?')) {
      this.recetaService.eliminarReceta(id);
      this.obtenerRecetas();
      if (this.recetaSeleccionada?.id === id) {
        this.recetaSeleccionada = null;
      }
    }
  }

  toggleFavorito(id: string): void {
    this.recetaService.toggleFavorito(id);
    this.obtenerRecetas();
  }
}
