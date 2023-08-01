import { NgModule } from '@angular/core';
import { AppGuard } from './guards/app.guard';
import { AuthGuard } from './guards/auth.guard';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ChatComponent } from './pages/user/chat/chat.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  {
    path: '',
    // runGuardsAndResolvers: 'always',
    // canActivate: [AppGuard],
    children: [
       { 
        path: 'chat',
        data: { breadcrumb: 'List chat' },
        children: [
          { path: '', component: ChatComponent, data: { breadcrumb: '' } },
          { path: ':id', component: ChatComponent, data: { breadcrumb: 'Nội dung tin nhắn' } },
        ]
       }
    ]
  },

  { path: '**', redirectTo: 'page/404', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
