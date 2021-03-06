import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';

import { jqxDataTableComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdatatable';
import { jqxChartComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxchart';
import { jqxLoaderComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxloader';
import { jqxFileUploadComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxfileupload';

import { FormsModule} from '@angular/forms';


@NgModule({
    imports: [
        CommonModule,
        LayoutRoutingModule,
        TranslateModule,
        NgbDropdownModule.forRoot(),
        
       
    ],
    declarations: [
        LayoutComponent, 
        SidebarComponent, 
        HeaderComponent,
        jqxDataTableComponent,
        jqxChartComponent,
        jqxLoaderComponent,
        jqxFileUploadComponent
        ],
    exports: [
        jqxDataTableComponent,
        jqxChartComponent,
        jqxLoaderComponent,
        FormsModule,
        jqxFileUploadComponent,

        
        
        
    ]
})
export class LayoutModule {}
