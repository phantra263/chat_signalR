import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './pages/chat/chat.component';
import { Chat_v2Component } from './pages/chat_v2/chat_v2.component';
import { ChatDetailComponent } from './pages/chatDetail/chatDetail.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/chat' },
  // { path: 'chat', component: ChatComponent },
  // { path: 'chat', component: Chat_v2Component },
  { path: 'chat', component: Chat_v2Component,
    children: [
      { path: ':id', component: ChatDetailComponent }
    ]
  },
  { path: '**', redirectTo: 'page/404', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
