import { Component, OnInit, ViewChild  } from '@angular/core';

import { routerTransition } from '../../router.animations';

import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GenalgoService } from '../../shared/services/route/genalgo.service';
import { Genalgov2Service } from '../../shared/services/route/genalgov2.service';

import { UjiService } from '../../shared/services/uji/uji.service';
import { Uji } from '../../shared/services/uji/uji.model';

import { jqxLoaderComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxloader';



@Component({
    selector: 'app-pengujian',
    templateUrl: './pengujian.component.html',
    styleUrls: ['./pengujian.component.scss'],
    animations: [routerTransition()]
})
export class PengujianComponent implements OnInit {
@ViewChild('jqxLoader') jqxLoader: jqxLoaderComponent;
    // lineChart
    public lineChartData: Array<any>;
    public lineChartLabels: Array<any>;
    public lineChartOptions: any = {
        responsive: true
    };
    public lineChartColors: Array<any> = [
        {
            // grey
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        },
        {
            // dark grey
            backgroundColor: 'rgba(77,83,96,0.2)',
            borderColor: 'rgba(77,83,96,1)',
            pointBackgroundColor: 'rgba(77,83,96,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(77,83,96,1)'
        },
        {
            // grey
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        },
        {
            backgroundColor: 'rgba(220,220,220,0.2)',
            borderColor: 'rgba(220,220,220,1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(220,220,220,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(220,220,220,1)'
        },
        {
            backgroundColor: 'rgba(151,187,205,0.2)',
            borderColor: 'rgba(151,187,205,1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(151,187,205,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(151,187,205,1)'
        }
    ];
    public lineChartLegend: boolean = true;
    public lineChartType: string = 'line';

   //htmlToAdd="fg";

    populasi:any[][][][];
     ujiList: Uji[];
     hasil: any[]=[];
     executionTime: any[]=[];
     Elite: any[]=[];
     initTime=0;
constructor(
    private tostr: ToastrService, 
    public gen : GenalgoService,
    private gen2 : Genalgov2Service,
    public ujiService: UjiService,
    ){
        this.gen.getRoute2016();
        this.gen.getRoute2017();
        // this.gen2.GA(10,100,0.8,0.01);
        
        
    }
   
    ngOnInit() {
      //read uji
      
        var x = this.ujiService.getData();
        x.snapshotChanges().subscribe(item => {
      this.ujiList= [];
      item.forEach(element => {
        var y = element.payload.toJSON();
        y["$key"] = element.key;
        this.ujiList.push(y as Uji);
      });
    });
   
     
   
    this.resetForm();
}

calculate(){
    this.jqxLoader.open();
    console.log(this.ujiList);
    let before=performance.now();
    let after=0;
    this.gen2.GenInitialPop(50)
    .then(res =>{
                after=performance.now();
                this.initTime=after-before;
                before=performance.now();
                this.populasi=this.gen2.deepCopy(res);
                return this.gen2.Loop(this.gen2.deepCopy(this.populasi),this.ujiList[0]['numGen'],this.ujiList[0]['pc'],this.ujiList[0]['pm']);
      })
     .then(res =>{
         after=performance.now();
         this.executionTime.push(after-before);
          before=performance.now();
            this.hasil.push(res);
          return this.gen2.Loop(this.gen2.deepCopy(this.populasi),this.ujiList[1]['numGen'],this.ujiList[1]['pc'],this.ujiList[1]['pm']);
      })
      .then(res =>{
          after=performance.now();
                this.executionTime.push(after-before);
                before=performance.now();
            this.hasil.push(res);
          return this.gen2.Loop(this.gen2.deepCopy(this.populasi),this.ujiList[2]['numGen'],this.ujiList[2]['pc'],this.ujiList[2]['pm']);
      })
       .then(res =>{
           after=performance.now();
                this.executionTime.push(after-before);
                before=performance.now();
            this.hasil.push(res);
          return this.gen2.Loop(this.gen2.deepCopy(this.populasi),this.ujiList[3]['numGen'],this.ujiList[3]['pc'],this.ujiList[3]['pm']);
      })
      .then(res =>{
          after=performance.now();
                this.executionTime.push(after-before);
                before=performance.now();
            this.hasil.push(res);
          return this.gen2.Loop(this.gen2.deepCopy(this.populasi),this.ujiList[4]['numGen'],this.ujiList[4]['pc'],this.ujiList[4]['pm']);
      })
      .then(res =>{
          after=performance.now();
                this.executionTime.push(after-before);
                before=performance.now();
          this.hasil.push(res);
          let iter:number[]=[];
          for(let i=1;i<=res[0].length;i++){
            iter.push(i);
          }
          for(let a=0;a<this.hasil.length;a++){
            this.Elite.push(this.hasil[a][0].slice(-1).pop())
          }
        //   console.log(this.Elite);
          this.lineChartLabels=iter;
        this.lineChartData=[
        { data:  this.hasil[0][0] , label: 'Series 1' },
         { data:  this.hasil[1][0] , label: 'Series 2' },
          { data:  this.hasil[2][0] , label: 'Series 3' },
           { data:  this.hasil[3][0] , label: 'Series 4' },
           { data:  this.hasil[4][0] , label: 'Series 5' }
    ];
    this.jqxLoader.close();
    // console.log(this.executionTime);
      });
}
    onSubmit(ujiForm: NgForm) {
    if (ujiForm.value.$key == null){
         this.tostr.info('Data Gudang yang Diedit !', 'Silahkan Memilih');
    } 
    else{
            this.ujiService.updateUji(ujiForm.value);
            this.resetForm(ujiForm);
            this.tostr.success('Berhasil Diedit !', 'Data Gudang');
    
    }
    }
  resetForm(ujiForm?: NgForm) {
    if (ujiForm != null)
      ujiForm.reset();
    this.ujiService.selectedUji = {
      $key: null,
      numPop : 0,
      numGen : 0,
      pc : 0,
      pm : 0
    }
  }
  onEdit(emp: Uji) {
    
    this.ujiService.selectedUji = Object.assign({}, emp);
  }
 
   

}
