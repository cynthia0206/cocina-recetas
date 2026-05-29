import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Receta } from '../models/receta.model';
import { RecetaService } from '../services/receta.service';

@Component({
  selector: 'app-form-receta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './form-receta.component.html',
  styleUrl: './form-receta.component.css'
})
export class FormRecetaComponent implements OnInit {
  recetaForm!: FormGroup;
  id: string = '';
  esEdicion: boolean = false;
  categorias: string[] = ['Desayuno', 'Entrada', 'Almuerzo', 'Cena', 'Postre', 'Bebida', 'Otro'];

  constructor(
    private fb: FormBuilder,
    private recetaService: RecetaService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    const recipeId = this.route.snapshot.paramMap.get('id');
    if (recipeId) {
      this.esEdicion = true;
      const receta = this.recetaService.getRecetaById(recipeId);
      if (receta) {
        this.id = receta.id;
        this.cargarDatosFormulario(receta);
      } else {
        alert('La receta no existe.');
        this.router.navigate(['/inicio']);
      }
    }
  }

  private inicializarFormulario(): void {
    this.recetaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      categoria: ['Almuerzo', [Validators.required]],
      tiempoPreparacion: [30, [Validators.required, Validators.min(1)]],
      imagenUrl: ['', [Validators.pattern(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/)]],
      ingredientesInput: ['', [Validators.required]],
      instruccionesInput: ['', [Validators.required]],
      esFavorita: [false]
    });
  }

  private cargarDatosFormulario(receta: Receta): void {
    this.recetaForm.patchValue({
      nombre: receta.nombre,
      descripcion: receta.descripcion,
      categoria: receta.categoria,
      tiempoPreparacion: receta.tiempoPreparacion,
      imagenUrl: receta.imagenUrl || '',
      ingredientesInput: receta.ingredientes.join('\n'),
      instruccionesInput: receta.instrucciones.join('\n'),
      esFavorita: receta.esFavorita
    });
  }

  // Getters de validación rápidos para el HTML
  get f() {
    return this.recetaForm.controls;
  }

  guardarReceta(): void {
    if (this.recetaForm.invalid) {
      this.recetaForm.markAllAsTouched();
      return;
    }

    const formValues = this.recetaForm.value;

    // Procesar ingredientes (un ingrediente por línea)
    const ingredientes = (formValues.ingredientesInput as string)
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    if (ingredientes.length === 0) {
      alert('Por favor, añade al menos un ingrediente válido.');
      return;
    }

    // Procesar instrucciones (una instrucción por línea)
    const instrucciones = (formValues.instruccionesInput as string)
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    if (instrucciones.length === 0) {
      alert('Por favor, añade al menos un paso para la preparación.');
      return;
    }

    const recetaData = {
      nombre: formValues.nombre.trim(),
      descripcion: formValues.descripcion.trim(),
      tiempoPreparacion: formValues.tiempoPreparacion,
      categoria: formValues.categoria,
      esFavorita: formValues.esFavorita,
      imagenUrl: formValues.imagenUrl.trim() || undefined,
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
