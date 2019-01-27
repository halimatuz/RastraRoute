import { Component, OnInit ,ViewChild} from '@angular/core';
import { routerTransition } from '../../router.animations';
import { jqxDataTableComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdatatable';
import { GenalgoService } from '../../shared/services/route/genalgo.service';
import { jqxLoaderComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxloader';

import { GudangService } from '../../shared/services/gudang/gudang.service';
import { Gudang } from '../../shared/services/gudang/gudang.model';

import { RouteService } from '../../shared/services/route/route.service';
import { Route } from '../../shared/services/route/route.model';
import { Genalgov2Service } from '../../shared/services/route/genalgov2.service';
@Component({
    selector: 'app-hasil',
    templateUrl: './hasil.component.html',
    styleUrls: ['./hasil.component.scss'],
    animations: [routerTransition()]
})


export class HasilComponent implements OnInit {
     @ViewChild('jqxLoader') jqxLoader: jqxLoaderComponent;
    @ViewChild('myDataTable') myDataTable: jqxDataTableComponent;
   
 columns: any[] =
    [
        { text: 'Sub Route', dataField: 'idx'},
        { text: 'Gudang', dataField: 'gudang' },
        { text: 'Kab/Kota', dataField: 'kab' },
        { text: 'Kecamatan', dataField: 'kecamatan' },
        { text: 'Desa', dataField: 'desa'},
        { text: 'Load', dataField: 'load'}
    ];
    gudangList: Gudang[];
    routeList: any[];
    source: any ;
    dataAdapter: any;
    constructor(
    private gen : GenalgoService,
    private gudangService: GudangService, 
    private routeService: RouteService,
    private gen2 : Genalgov2Service,
    ){
    }
    ngOnInit() {
     //read gudang
     var x = this.gudangService.getData();
        x.snapshotChanges().subscribe(item => {
      this.gudangList= [];
      item.forEach(element => {
        var y = element.payload.toJSON();
        y["$key"] = element.key;
        this.gudangList.push(y as Gudang);
      });
            //read Route
            var x = this.routeService.getData();
                x.snapshotChanges().subscribe(item => {
            this.routeList= [];
          
            item.forEach(element => {
                
                var y = element.payload.toJSON();
               
               let i=0;
               for(let idx of Object.values(y["subRoute"])){
                    let arr= {};
                    arr["infGudang"]=this.gudangList[y["fgudang"]]["namaGudang"];
                   if(i==0){
                    arr["idx"]=y["index"];
                    arr["gudang"]=this.gudangList[y["fgudang"]]["namaGudang"];
                   }
                   else{
                    arr["idx"]="";
                    arr["gudang"]=""; 
                   }
                    
                for (let [key, value] of Object.entries(idx)) {  
                    arr[key]=value; 
                }
                this.routeList.push(arr);
                i++;
               }
                

            });
           
                    //load data into table
                    this.source =
                        {
                        localData: this.routeList,
                        dataType: 'array',
                        dataFields:
                        [
                            
                            { name: 'idx', type: 'string' },
                            { name: 'gudang', type: 'string' },
                            { name: 'kab', type: 'string' },
                            { name: 'kecamatan', type: 'string' },
                            { name: 'desa', type: 'string' },
                            { name: 'load', type: 'string' }
                        ]
                    };
                    this.dataAdapter=new jqx.dataAdapter(this.source);
            });
    });
    }
    excelExport() {
        this.myDataTable.exportData('xls');
    }
    calculate(){
       if(this.gen2.rastraGroup){
       this.jqxLoader.open();
        this.gen2.GA_withoutInitial(5,10,0.6,0.01)
        .then(res =>{
            console.log(res);
            this.routeService.removeData();
            for(let i=0; i<res[1].length; i++){
                let x=new Route();
                x.fgudang=res[2][i];
                x.index=i;
                x.subRoute=res[1][i];
                this.routeService.insertEmployee(x);
            }

            this.jqxLoader.close();
        });
       }else{
           this.jqxLoader.open();
        this.gen2.GA_withInitial(5,10,0.6,0.01)
        .then(res =>{
            console.log(res);
            this.routeService.removeData();
            for(let i=0; i<res[1].length; i++){
                let x=new Route();
                x.fgudang=res[2][i];
                x.index=i;
                x.subRoute=res[1][i];
                this.routeService.insertEmployee(x);
            }

            this.jqxLoader.close();
        });
       }
        
    }
    onChange(val :any){
        if(val!="all"){
        let newlist=[];
        for(let i=0; i<this.routeList.length;i++){
            if(this.routeList[i]["infGudang"]==this.gudangList[val].namaGudang){
                newlist.push(this.routeList[i]);
            }
        }
            //load data into table
                    this.source =
                        {
                        localData: newlist,
                        dataType: 'array',
                        dataFields:
                        [
                            
                            { name: 'idx', type: 'string' },
                            { name: 'gudang', type: 'string' },
                            { name: 'kab', type: 'string' },
                            { name: 'kecamatan', type: 'string' },
                            { name: 'desa', type: 'string' },
                            { name: 'load', type: 'string' }
                        ]
                    };
                    this.dataAdapter=new jqx.dataAdapter(this.source);        
    
}
else{
    //load data into table
                    this.source =
                        {
                        localData: this.routeList,
                        dataType: 'array',
                        dataFields:
                        [
                            
                            { name: 'idx', type: 'string' },
                            { name: 'gudang', type: 'string' },
                            { name: 'kab', type: 'string' },
                            { name: 'kecamatan', type: 'string' },
                            { name: 'desa', type: 'string' },
                            { name: 'load', type: 'string' }
                        ]
                    };
                    this.dataAdapter=new jqx.dataAdapter(this.source);  
}
}
}
