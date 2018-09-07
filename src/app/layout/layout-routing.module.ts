import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
            { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
            { path: 'data', loadChildren: './data/data.module#DataModule' },
            { path: 'hasil', loadChildren: './hasil/hasil.module#HasilModule' },
            { path: 'pengaturan', loadChildren: './pengaturan/pengaturan.module#PengaturanModule' },
            { path: 'setting', loadChildren: './setting/setting.module#SettingModule' },
         
            
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
