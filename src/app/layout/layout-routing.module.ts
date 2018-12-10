import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { UserResolver } from '../shared/guard/user.resolver';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
            { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule'},
            { path: 'data', loadChildren: './data/data.module#DataModule' },
            { path: 'hasil', loadChildren: './hasil/hasil.module#HasilModule' },
            { path: 'download', loadChildren: './download/download.module#DownloadModule' },
            { path: 'pengaturan', loadChildren: './pengaturan/pengaturan.module#PengaturanModule' },
            { path: 'pengujian', loadChildren: './pengujian/pengujian.module#PengujianModule' },
            { path: 'setting', loadChildren: './setting/setting.module#SettingModule', resolve: { data: UserResolver},
            
         },
         
            
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
