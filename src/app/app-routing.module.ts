import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './pages/user/chat/chat.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/chat' },
  { 
    path: 'chat',
    data: { breadcrumb: 'List chat' },
    children: [
      { path: '', component: ChatComponent, data: { breadcrumb: '' } },
      { path: ':id', component: ChatComponent, data: { breadcrumb: 'Nội dung tin nhắn' } },
    ]
  },
  { path: '**', redirectTo: 'page/404', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
