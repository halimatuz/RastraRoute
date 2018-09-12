import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PengujianComponent } from './pengujian.component';

const routes: Routes = [
    {
        path: '', component: PengujianComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PengujianRoutingModule {
}
