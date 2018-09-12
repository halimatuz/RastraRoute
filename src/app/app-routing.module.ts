import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';
import { UserResolver } from './shared/guard/user.resolver';

const routes: Routes = [
    { path: '', loadChildren: './layout/layout.module#LayoutModule', resolve: { data: UserResolver}  },
    { path: 'login', loadChildren: './login/login.module#LoginModule', canActivate: [AuthGuard] },
    { path: 'signup', loadChildren: './signup/signup.module#SignupModule', canActivate: [AuthGuard]},
    { path: 'error', loadChildren: './server-error/server-error.module#ServerErrorModule', canActivate: [AuthGuard]},
    { path: 'access-denied', loadChildren: './access-denied/access-denied.module#AccessDeniedModule',canActivate: [AuthGuard] },
    { path: 'not-found', loadChildren: './not-found/not-found.module#NotFoundModule', canActivate: [AuthGuard]},
    { path: '**', redirectTo: 'not-found' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
