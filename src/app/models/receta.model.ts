export interface Receta {
  id: string;
  nombre: string;
  descripcion: string;
  ingredientes: string[];
  instrucciones: string[];
  tiempoPreparacion: number;
  categoria: string;
  esFavorita: boolean;
  imagenUrl?: string;
}
