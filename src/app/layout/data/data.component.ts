import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';

import { RastraService } from '../../shared/services/rastra/rastra.service';
import { Rastra } from '../../shared/services/rastra/rastra.model'

import * as XLSX from 'xlsx';

@Component({
    selector: 'app-data',
    templateUrl: './data.component.html',
    styleUrls: ['./data.component.scss'],
    animations: [routerTransition()]
})
export class DataComponent implements OnInit {
     data:any[];
    source: any ;
    rastra : any [];

    dataAdapter: any;
    rastraList: Rastra[];
    
    columns: any[] =
    [
            { text: 'Tanggal', dataField: 'tanggal' },
            { text: 'Kabupaten/Kota', dataField: 'kabupaten' },
            { text: 'Kecamatan', dataField: 'kecamatan' },
            { text: 'Desa', dataField: 'desa' },
            { text: 'Colli', dataField: 'colli' }
    ];
    constructor(private rastraService: RastraService){

    }
    ngOnInit() {
    var x = this.rastraService.getData();
        x.snapshotChanges().subscribe(item => {
      this.rastraList= [];
      item.forEach(element => {
        var y = element.payload.toJSON();
        y["$key"] = element.key;
        this.rastraList.push(y as Rastra);
      });
      //load data into table
      this.source =
        {
        localData: this.rastraList,
        dataType: 'array',
        dataFields:
        [
            
            { name: 'tanggal', type: 'string' },
            { name: 'kabupaten', type: 'string' },
            { name: 'kecamatan', type: 'string' },
            { name: 'desa', type: 'string' },
            { name: 'colli', type: 'number' }
        ]
    };
    this.dataAdapter=new jqx.dataAdapter(this.source);
    });
    
    }
    uploadData(evt: any) : void { 
    // get data from file upload       
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = XLSX.utils.sheet_to_json(ws, {header: 1});
      console.log(this.data.shift());
      //change datatype into Rastra
      this.rastra=[];
      for(let i=0;i<this.data.length;i++){
        this.changetoRastra(this.data[i],i);
      }
      
      //remove past data and replaced with new one
      this.rastraService.removeData();
      //insert the new data
      for(let i=0;i<this.rastra.length;i++){
       this.onCreate(this.rastra[i]);
      }
      
      
      
    };
    
    reader.readAsBinaryString(target.files[0]);
}
changetoRastra(x : any[],index:number){
let arr= new Rastra ();
arr['$key']=null;
arr['tanggal']=x[0];
arr['kabupaten']=x[1];
arr['kecamatan']=x[2];
arr['desa']=x[3];
arr['colli']=x[4];
this.rastra.push(arr);
}
onCreate(x:Rastra) {
      this.rastraService.insertEmployee(x);
   
  }
}
