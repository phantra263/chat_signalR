import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './pages/chat/chat.component';
import { Chat_v2Component } from './pages/chat_v2/chat_v2.component';
import { ChatDetailComponent } from './pages/chatDetail/chatDetail.component';
import { PageNotFoundComponent } from './pages/pageNotFound/pageNotFound.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/chat' },
  // { path: 'chat', component: ChatComponent },
  // { path: 'chat', component: Chat_v2Component },
  { path: 'chat',
    children: [
      { path: '', component: Chat_v2Component },
      { path: ':id', component: Chat_v2Component }
    ]
  },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
