import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './pages/chat/chat.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/chat' },
  { path: 'chat', component: ChatComponent },
  { path: '**', redirectTo: 'page/404', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
