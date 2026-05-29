import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Receta } from '../models/receta.model';
import { RecetaService } from '../services/receta.service';

@Component({
  selector: 'app-form-receta',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './form-receta.component.html',
  styleUrl: './form-receta.component.css'
})
export class FormRecetaComponent implements OnInit {
  // Datos del formulario
  id: string = '';
  nombre: string = '';
  descripcion: string = '';
  tiempoPreparacion: number = 30;
  categoria: string = 'Almuerzo';
  esFavorita: boolean = false;
  imagenUrl: string = '';
  
  // Entradas de texto multilínea
  ingredientesInput: string = '';
  instruccionesInput: string = '';

  esEdicion: boolean = false;
  categorias: string[] = ['Desayuno', 'Entrada', 'Almuerzo', 'Cena', 'Postre', 'Bebida', 'Otro'];

  constructor(
    private recetaService: RecetaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const recipeId = this.route.snapshot.paramMap.get('id');
    if (recipeId) {
      this.esEdicion = true;
      const receta = this.recetaService.getRecetaById(recipeId);
      if (receta) {
        this.cargarDatos(receta);
      } else {
        alert('La receta no existe.');
        this.router.navigate(['/inicio']);
      }
    }
  }

  cargarDatos(receta: Receta): void {
    this.id = receta.id;
    this.nombre = receta.nombre;
    this.descripcion = receta.descripcion;
    this.tiempoPreparacion = receta.tiempoPreparacion;
    this.categoria = receta.categoria;
    this.esFavorita = receta.esFavorita;
    this.imagenUrl = receta.imagenUrl || '';
    
    // Convertir arreglos a texto separado por saltos de línea para el textarea
    this.ingredientesInput = receta.ingredientes.join('\n');
    this.instruccionesInput = receta.instrucciones.join('\n');
  }

  guardarReceta(): void {
    if (!this.nombre.trim() || !this.descripcion.trim()) {
      alert('Por favor, completa los campos obligatorios (Nombre y Descripción).');
      return;
    }

    // Procesar ingredientes (un ingrediente por línea)
    const ingredientes = this.ingredientesInput
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    if (ingredientes.length === 0) {
      alert('Por favor, añade al menos un ingrediente.');
      return;
    }

    // Procesar instrucciones (una instrucción por línea)
    const instrucciones = this.instruccionesInput
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    if (instrucciones.length === 0) {
      alert('Por favor, añade al menos un paso para la preparación.');
      return;
    }

    const recetaData = {
      nombre: this.nombre.trim(),
      descripcion: this.descripcion.trim(),
      tiempoPreparacion: this.tiempoPreparacion || 1,
      categoria: this.categoria,
      esFavorita: this.esFavorita,
      imagenUrl: this.imagenUrl.trim() || undefined,
      ingredientes,
      instrucciones
    };

    if (this.esEdicion) {
      this.recetaService.actualizarReceta({
        ...recetaData,
        id: this.id
      });
      alert('¡Receta actualizada con éxito!');
    } else {
      this.recetaService.agregarReceta(recetaData);
      alert('¡Receta agregada con éxito!');
    }

    this.router.navigate(['/inicio']);
  }
}
