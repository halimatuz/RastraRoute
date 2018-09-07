import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PengaturanComponent } from './pengaturan.component';

const routes: Routes = [
    {
        path: '', component: PengaturanComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PengaturanRoutingModule {
}
