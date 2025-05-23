import { Routes } from '@angular/router';

export const routes: Routes = [
    {
      path: 'list-students',
      title: 'Lista de Estudiantes',
      loadComponent: () => import('./features/list-students/list-students.component'),
      children: [],
    },
    {
      path: 'list-subjects-students/:idStudent/:idCreditProgram',
      title: 'Lista de Estudiantes',
      loadComponent: () => import('./features/list-subjects-students/list-subjects-students.component'),
      children: [],
    },
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'list-students'
    }

];
