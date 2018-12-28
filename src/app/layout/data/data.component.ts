import { Component, OnInit, ViewChild } from '@angular/core';
import { routerTransition } from '../../router.animations';

import { RastraService } from '../../shared/services/rastra/rastra.service';
import { Rastra } from '../../shared/services/rastra/rastra.model';
import { jqxLoaderComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxloader';

import * as XLSX from 'xlsx';

@Component({
    selector: 'app-data',
    templateUrl: './data.component.html',
    styleUrls: ['./data.component.scss'],
    animations: [routerTransition()]
})
export class DataComponent implements OnInit {
  @ViewChild('jqxLoader') jqxLoader: jqxLoaderComponent;
     data:any[];
    source: any ;
    rastra : any [];

    dataAdapter: any;
    rastraList: Rastra[];
    
    columns: any[] =
    [
            { text: 'Kabupaten/Kota', dataField: 'kabupaten' },
            { text: 'Kecamatan', dataField: 'kecamatan' },
            { text: 'Desa/Kelurahan', dataField: 'desa' },
            { text: 'Colli', dataField: 'colli' }
    ];
    constructor(private rastraService: RastraService){

    }
    ngOnInit() {
      // console.log(this.jqxLoader);

    var x = this.rastraService.getData();
        x.snapshotChanges().subscribe(item => {
      this.rastraList= [];
      item.forEach(element => {
        var y = element.payload.toJSON();
        y["$key"] = element.key;
        this.rastraList.push(y as Rastra);
      });
      //load data into table
      // console.log(this.rastraList);
      this.source =
        {
        localData: this.rastraList,
        dataType: 'array',
        dataFields:
        [
            
            { name: 'kabupaten', type: 'string' },
            { name: 'kecamatan', type: 'string' },
            { name: 'desa', type: 'string' },
            { name: 'colli', type: 'number' }
        ]
    };
    this.dataAdapter=new jqx.dataAdapter(this.source);
    // this.jqxLoader.close();
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
      console.log(this.rastra);
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
arr['kabupaten']=x[0];
arr['kecamatan']=x[1];
arr['desa']=x[2];
arr['colli']=x[3];
arr['idx']=index;
this.rastra.push(arr);
}
onCreate(x:Rastra) {
      this.rastraService.insertEmployee(x);
   
  }
}
