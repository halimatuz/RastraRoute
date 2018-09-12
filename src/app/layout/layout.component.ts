import { Component, OnInit } from '@angular/core';
import { GudangService } from '../shared/services/gudang/gudang.service';
import { RastraService } from '../shared/services/rastra/rastra.service';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    providers :[GudangService, RastraService]
})
export class LayoutComponent implements OnInit {
    constructor(private gudangService : GudangService, private rastraService : RastraService) {}

    ngOnInit() {}
}
