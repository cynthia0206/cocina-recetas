import { Routes } from '@angular/router';
import { ListaRecetasComponent } from './lista-recetas/lista-recetas.component';
import { FormRecetaComponent } from './form-receta/form-receta.component';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: ListaRecetasComponent },
  { path: 'agregar', component: FormRecetaComponent },
  { path: 'editar/:id', component: FormRecetaComponent },
  { path: 'favoritos', component: ListaRecetasComponent },
  { path: '**', redirectTo: 'inicio' }
];
