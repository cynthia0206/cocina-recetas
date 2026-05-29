import { Injectable } from '@angular/core';
import { Receta } from '../models/receta.model';

@Injectable({
  providedIn: 'root'
})
export class RecetaService {
  private STORAGE_KEY = 'recetas_app';
  private recetas: Receta[] = [];

  constructor() {
    this.cargarRecetas();
  }

  private cargarRecetas(): void {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      this.recetas = JSON.parse(data);
    } else {
      // Recetas por defecto si localStorage está vacío
      this.recetas = [
        {
          id: '1',
          nombre: 'Tacos al Pastor',
          descripcion: 'Deliciosos tacos tradicionales mexicanos con carne de cerdo marinada, cebolla, cilantro y piña.',
          ingredientes: [
            '500g de carne de cerdo (lomo o pierna)',
            '3 cucharadas de pasta de achiote',
            '1/2 taza de jugo de piña',
            '2 cucharadas de vinagre blanco',
            '1 cucharadita de orégano',
            'Tortillas de maíz',
            '1 taza de piña picada',
            '1/2 cebolla picada fina',
            '1/2 taza de cilantro picado',
            'Limones al gusto'
          ],
          instrucciones: [
            'Licuar el achiote, jugo de piña, vinagre, orégano y sal al gusto para crear el marinado.',
            'Cortar la carne de cerdo en filetes delgados y marinarla en la mezcla durante al menos 2 horas en el refrigerador.',
            'Cocinar la carne en una sartén muy caliente con un poco de aceite hasta que esté bien dorada y cocida.',
            'Picar la carne cocida finamente.',
            'Calentar las tortillas de maíz, servir una porción de carne y decorar con piña picada, cebolla, cilantro y unas gotas de limón.'
          ],
          tiempoPreparacion: 45,
          categoria: 'Almuerzo',
          esFavorita: true,
          imagenUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60'
        },
        {
          id: '2',
          nombre: 'Tarta de Manzana Clásica',
          descripcion: 'Un postre reconfortante con una base crujiente de hojaldre y láminas dulces de manzana al horno con canela.',
          ingredientes: [
            '1 lámina de masa de hojaldre estirada',
            '3 manzanas medianas (preferiblemente rojas o Golden)',
            '3 cucharadas de azúcar morena',
            '1 cucharadita de canela en polvo',
            '2 cucharadas de mermelada de albaricoque o durazno',
            '1 huevo (para pintar los bordes)'
          ],
          instrucciones: [
            'Precalentar el horno a 180°C (350°F).',
            'Pelar las manzanas, retirar el corazón y cortarlas en láminas muy delgadas.',
            'Colocar la masa de hojaldre sobre una bandeja de horno cubierta con papel sulfurizado.',
            'Colocar las láminas de manzana de forma concéntrica o superpuesta, cubriendo la masa pero dejando 1.5 cm libre en los bordes.',
            'Espolvorear el azúcar morena y la canela sobre las manzanas.',
            'Pintar los bordes libres de la masa con huevo batido.',
            'Hornear durante 30 a 35 minutos hasta que el hojaldre esté dorado y las manzanas estén suaves.',
            'Retirar del horno, pintar las manzanas calientes con la mermelada diluida en un poco de agua tibia para darles brillo y dejar enfriar.'
          ],
          tiempoPreparacion: 50,
          categoria: 'Postre',
          esFavorita: false,
          imagenUrl: 'https://images.unsplash.com/photo-1568569302495-16020f84bc35?w=500&auto=format&fit=crop&q=60'
        },
        {
          id: '3',
          nombre: 'Ensalada César con Pollo',
          descripcion: 'Una ensalada fresca y crocante acompañada de pechuga de pollo a la plancha, crutones de pan de ajo y queso parmesano.',
          ingredientes: [
            '1 cabeza de lechuga romana fresca',
            '1 pechuga de pollo entera deshuesada',
            '1/2 taza de queso parmesano rallado o en lascas',
            '1 taza de crutones de pan tostado',
            '1 cucharadita de sazonador de ajo en polvo',
            '1/2 taza de aderezo César comercial o casero',
            'Sal y pimienta negra al gusto'
          ],
          instrucciones: [
            'Sazonar la pechuga de pollo con sal, pimienta negra y ajo en polvo al gusto.',
            'Cocinar el pollo a la plancha a fuego medio hasta que esté bien cocido y dorado por ambos lados. Dejar reposar y luego cortar en tiras de 1 cm.',
            'Lavar muy bien la lechuga, secarla y cortarla en trozos grandes con las manos.',
            'En un tazón grande, mezclar la lechuga romana limpia, las tiras de pollo cocido, los crutones y el queso parmesano.',
            'Añadir el aderezo César y mezclar suavemente justo antes de servir para mantener la lechuga crujiente.'
          ],
          tiempoPreparacion: 20,
          categoria: 'Entrada',
          esFavorita: false,
          imagenUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&auto=format&fit=crop&q=60'
        }
      ];
      this.guardarEnStorage();
    }
  }

  private guardarEnStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.recetas));
  }

  getRecetas(): Receta[] {
    return [...this.recetas];
  }

  getRecetaById(id: string): Receta | undefined {
    return this.recetas.find(r => r.id === id);
  }

  agregarReceta(receta: Omit<Receta, 'id'>): void {
    const nuevaReceta: Receta = {
      ...receta,
      id: Date.now().toString()
    };
    this.recetas.push(nuevaReceta);
    this.guardarEnStorage();
  }

  actualizarReceta(recetaActualizada: Receta): void {
    const index = this.recetas.findIndex(r => r.id === recetaActualizada.id);
    if (index !== -1) {
      this.recetas[index] = { ...recetaActualizada };
      this.guardarEnStorage();
    }
  }

  eliminarReceta(id: string): void {
    this.recetas = this.recetas.filter(r => r.id !== id);
    this.guardarEnStorage();
  }

  toggleFavorito(id: string): void {
    const receta = this.recetas.find(r => r.id === id);
    if (receta) {
      receta.esFavorita = !receta.esFavorita;
      this.guardarEnStorage();
    }
  }
}
