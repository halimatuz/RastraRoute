import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';

@Component({
    selector: 'app-hasil',
    templateUrl: './hasil.component.html',
    styleUrls: ['./hasil.component.scss'],
    animations: [routerTransition()]
})
export class HasilComponent implements OnInit {
    
 columns: any[] =
    [
        { text: 'First Name', dataField: 'First Name'},
        { text: 'Last Name', dataField: 'Last Name' },
        { text: 'Product', dataField: 'Product' },
        { text: 'Unit Price', dataField: 'Price', align: 'right', cellsAlign: 'right', cellsFormat: 'c2' },
        { text: 'Quantity', dataField: 'Quantity', align: 'right', cellsAlign: 'right', cellsFormat: 'n' }
    ];

    ngOnInit() {
    
    }
}
