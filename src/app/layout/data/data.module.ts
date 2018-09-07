import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataRoutingModule } from './data-routing.module';
import { DataComponent } from './data.component';
import { PageHeaderModule } from './../../shared';
import { HttpClientModule } from '@angular/common/http';
import { jqxBarGaugeComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbargauge';
import { jqxDataTableComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdatatable';
import { jqxFileUploadComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxfileupload';
import { LayoutModule } from '../layout.module';

@NgModule({
    imports: [
        CommonModule, 
        DataRoutingModule, 
        PageHeaderModule, 
        HttpClientModule,
        LayoutModule
        
        ],
    declarations: [
        DataComponent
        ]
})
export class DataModule {

    
}
