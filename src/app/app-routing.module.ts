import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FeedbacktableComponent } from './feedbacktable/feedbacktable.component';

const routes: Routes = [
  {component:HomeComponent,path:''},
  {component:FeedbacktableComponent,path:'feedbacktable'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
