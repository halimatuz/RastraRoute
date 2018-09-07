import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HasilComponent } from './hasil.component';

const routes: Routes = [
    {
        path: '', component: HasilComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HasilRoutingModule {
}
