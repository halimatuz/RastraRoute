import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs/Observable';

import { RastraService } from '../rastra/rastra.service';
import { Rastra } from '../rastra/rastra.model';

import { GudangService } from '../gudang/gudang.service';
import { Gudang } from '../gudang/gudang.model';

import { DataranTinggiService } from '../dataran-tinggi/dataran-tinggi.service';
import { DataranTinggi } from '../dataran-tinggi/dataran-tinggi.model';

import { Route2016Service } from '../route2016/route2016.service';
import { Route2016 } from '../route2016/route2016.model';
@Injectable({
  providedIn: 'root'
})
export class Genalgov2Service {
distance:any[][]; //data jarak
  rastra: Rastra[];  //data kelurahan dan colli
  gudang : Gudang[]; //data stok
  dataran : DataranTinggi[]; //data dataran tinggi
  route : any[][][][]; //data rute yang dihasilkan
  f_gudang : number[][]; //data gudang asal rute diantarkan
  sum_colli : number=0; //data jumlah colli yang diantarkan
  sub_colli : number[][];//data jumlah colli tiap sub route
  prob_cross :number;
  prob_mutation: number;
  numIter :number;
  group_rastra : any[][];
  jarak2016: number=0;
  vCap: number=533;
  vDating: number =400;
  rastraGroup: any[][];
  matrixSaving : any;
  listSaving : any;
  ass : any;
  sumGroup:any[];
  RouteGroup: any[];
  populasi: any[];
  populasi_fit : any[];
  fromG : any[];
  subCol : any[];
  Dating_Flag: any[];
  info_Col:any[];
  info_dating: any[];

  constructor(
    private http: HttpClient,
    private rastraService: RastraService,
    private gudangService: GudangService,
    private dataranTinggiService: DataranTinggiService,
    private route2016Service : Route2016Service
    ) { 
  //this.GA(50,100,0.6,0.001);
 
}
//loop GA
GA_withoutInitial(numberPop:number, numberGen: number, Pc:number, Pm: number){
  return new Promise((resolve,reject) =>{
  
   this.InitializeDistance()
  .then(res =>{
     if(res){
      this.AssignSingleCust()
      // this.rastraGroup=this.deepCopy(rasgroup);
    console.log(this.deepCopy(this.rastraGroup));
    // console.log(this.deepCopy(this.RouteGroup));
    this.matrixSavings(this.deepCopy(this.rastraGroup),this.deepCopy(this.distance));
    let i=0;
    while(i<numberPop){
      console.log(i);
      
      let x=this.Routing(i);
      // console.log(x);
      this.populasi.push(x[0]);
      this.fromG.push(x[1]);
      this.info_Col.push(x[2]);
      this.info_dating.push(x[3]);
      
      i++;
    }
      // let jarak=this.evaluasiClark(this.populasi,this.fromG);
      // console.log(jarak);
    return this.scheduling(this.deepCopy(this.populasi),this.deepCopy(this.info_dating), this.deepCopy(this.fromG));
     }
     else{
      console.log('Tidak Cukup');
     }
  })
  .then(res =>{
     if(res){
      this.populasi=this.deepCopy(res);
      // console.log(this.deepCopy(this.populasi));
      // console.log(this.deepCopy(this.info_Col));
      let jarak=this.evaluasiClark(this.populasi,this.fromG);
      // console.log(jarak);
      let a=this.minVal(this.deepCopy(jarak));
      let elite=a[0];
      let eliteidx=a[1];
      let histElite: number []=[];
      let idx=0;
      let pop=this.deepCopy(this.populasi);
      let fromGud=this.deepCopy(this.fromG);
      let subCol=this.deepCopy(this.info_Col);
      let datF=this.deepCopy(this.info_dating);
      let individu:any[][][]=this.deepCopy(this.populasi[a[1]]);
      let fgudang : number[]=this.deepCopy(this.fromG[a[1]]);
     
      while(idx<this.numIter){
        console.log("iter : "+idx);
      let y=this.calculateFitness(this.deepCopy(jarak));
      let sel=this.selection(this.deepCopy(pop),this.deepCopy(y),this.deepCopy(fromGud),this.deepCopy(subCol), this.deepCopy(datF) );
      // console.log(sel);
      let cross=this.crossover(this.deepCopy(sel[0]), this.deepCopy(sel[1]), this.deepCopy(pop),  this.deepCopy(sel[2]), this.deepCopy(fromGud), this.deepCopy(sel[3]), this.deepCopy(subCol), this.deepCopy(sel[4]), this.deepCopy(datF), this.deepCopy(this.rastra) );
      // console.log(cross);
      let mut=this.mutation(this.deepCopy(cross[0]),this.deepCopy(cross[1]),this.deepCopy(cross[2]),this.deepCopy(cross[3]));
      // console.log(mut);
      pop=this.deepCopy(mut[0]);
      fromGud=this.deepCopy(mut[1]);
      subCol=this.deepCopy(mut[2]);
      datF=this.deepCopy(mut[3]);
      jarak=this.evaluasiClark(pop,fromGud);
      let val=this.minVal(this.deepCopy(jarak));
      histElite[idx]=elite;
      if(elite>val[0]){
        elite=val[0];
        eliteidx=val[1];
        let ind=this.deepCopy(mut[0]);
        individu=ind[eliteidx];
        let gud=this.deepCopy(mut[1]);
        fgudang=gud[eliteidx];
        // console.log('fgud: '+idx);
        // console.log(gud[eliteidx]);
        
      }
      idx++;
    }
    console.log(histElite);
    console.log(elite);
    console.log(fgudang);
    console.log(individu);
      
     return resolve([histElite,individu, fgudang]);
     }
   
    
    
  })
  });
}
GA_withInitial(numberPop:number, numberGen: number, Pc:number, Pm: number){
  return new Promise((resolve,reject) =>{
  this.distance=[]; //data jarak
  this.rastra=[];  //data kelurahan dan colli
  this.gudang=[]; //data stok
  this.dataran =[]; //data dataran tinggi
  this.route=[]; //data rute yang dihasilkan
  this.f_gudang=[]; //data gudang asal rute diantarkan
  this.sum_colli=0; //data jumlah colli yang diantarkan
  this.sub_colli=[];//data jumlah colli tiap sub route
  this.rastraGroup=[];
  this.sumGroup=[];
  this.RouteGroup=[];
  this.populasi=[];
  this.populasi_fit=[];
  this.fromG=[];
  this.subCol=[];
  this.Dating_Flag=[];
  this.info_Col=[];
  this.info_dating=[];
  this.prob_cross=Pc;
  this.prob_mutation=Pm;
  this.numIter=numberGen;
   this.InitializeDistance()
  .then(res =>{
    if(res){
      //console.log(this.distance);
      
      return this.InitializeRastra();
    }
  })
  .then(res =>{
    if(res){
      
      // console.log(this.rastra);
      
      //console.log(this.sum_colli);
      return this.InitializeGudang();
    }
  })
  .then(res =>{
     if(res)
    // console.log(this.gudang.length);
    // console.log(this.gudang);
   
    
    
    return this.InitializeDataran();

  })
  .then(res =>{
     if(res)
   return this.groupingCust( this.deepCopy(this.rastra));
    
    
  })
  .then(res =>{
     if(!res){
      this.AssignSingleCust();
      // this.rastraGroup=this.deepCopy(rasgroup);
    console.log(this.deepCopy(this.rastraGroup));
    // console.log(this.deepCopy(this.RouteGroup));
    this.matrixSavings(this.deepCopy(this.rastraGroup),this.deepCopy(this.distance));
    let i=0;
    while(i<numberPop){
      console.log(i);
      
      let x=this.Routing(i);
      // console.log(x);
      this.populasi.push(x[0]);
      this.fromG.push(x[1]);
      this.info_Col.push(x[2]);
      this.info_dating.push(x[3]);
      
      i++;
    }
      // let jarak=this.evaluasiClark(this.populasi,this.fromG);
      // console.log(jarak);
    return this.scheduling(this.deepCopy(this.populasi),this.deepCopy(this.info_dating), this.deepCopy(this.fromG));
     }
     else{
      console.log('Tidak Cukup');
     }
  })
  .then(res =>{
     if(res){
      this.populasi=this.deepCopy(res);
      // console.log(this.deepCopy(this.populasi));
      // console.log(this.deepCopy(this.info_Col));
      let jarak=this.evaluasiClark(this.populasi,this.fromG);
      // console.log(jarak);
      let a=this.minVal(this.deepCopy(jarak));
      let elite=a[0];
      let eliteidx=a[1];
      let histElite: number []=[];
      let idx=0;
      let pop=this.deepCopy(this.populasi);
      let fromGud=this.deepCopy(this.fromG);
      let subCol=this.deepCopy(this.info_Col);
      let datF=this.deepCopy(this.info_dating);
      let individu:any[][][]=this.deepCopy(this.populasi[a[1]]);
      let fgudang : number[]=this.deepCopy(this.fromG[a[1]]);
     
      while(idx<this.numIter){
        console.log("iter : "+idx);
      let y=this.calculateFitness(this.deepCopy(jarak));
      let sel=this.selection(this.deepCopy(pop),this.deepCopy(y),this.deepCopy(fromGud),this.deepCopy(subCol), this.deepCopy(datF) );
      // console.log(sel);
      let cross=this.crossover(this.deepCopy(sel[0]), this.deepCopy(sel[1]), this.deepCopy(pop),  this.deepCopy(sel[2]), this.deepCopy(fromGud), this.deepCopy(sel[3]), this.deepCopy(subCol), this.deepCopy(sel[4]), this.deepCopy(datF), this.deepCopy(this.rastra) );
      // console.log(cross);
      let mut=this.mutation(this.deepCopy(cross[0]),this.deepCopy(cross[1]),this.deepCopy(cross[2]),this.deepCopy(cross[3]));
      // console.log(mut);
      pop=this.deepCopy(mut[0]);
      fromGud=this.deepCopy(mut[1]);
      subCol=this.deepCopy(mut[2]);
      datF=this.deepCopy(mut[3]);
      jarak=this.evaluasiClark(pop,fromGud);
      let val=this.minVal(this.deepCopy(jarak));
      histElite[idx]=elite;
      if(elite>val[0]){
        elite=val[0];
        eliteidx=val[1];
        let ind=this.deepCopy(mut[0]);
        individu=ind[eliteidx];
        let gud=this.deepCopy(mut[1]);
        fgudang=gud[eliteidx];
        // console.log('fgud: '+idx);
        // console.log(gud[eliteidx]);
        
      }
      idx++;
    }
    console.log(histElite);
    console.log(elite);
    console.log(fgudang);
    console.log(individu);
      
     return resolve([histElite,individu, fgudang]);
     }
   
    
    
  })
  });
}
//generate initial populasi
GenInitialPop(numberPop:number){
  return new Promise((resolve,reject) =>{
   this.InitializeDistance()
  .then(res =>{
     if(res){
      this.AssignSingleCust();
    // console.log(this.deepCopy(this.rastraGroup));
    this.matrixSavings(this.deepCopy(this.rastraGroup),this.deepCopy(this.distance));
    let i=0;
    while(i<numberPop){
      console.log(i);
      let x=this.Routing(i);
      this.populasi.push(x[0]);
      this.fromG.push(x[1]);
      this.info_Col.push(x[2]);
      this.info_dating.push(x[3]);
      
      i++;
    }
      let sced=this.scheduling(this.deepCopy(this.populasi),this.deepCopy(this.info_dating), this.deepCopy(this.fromG));
    return resolve(sced);
     }
     else{
      console.log('Tidak Cukup');
     }
  })
  });
  }
//loop
//generate initial populasi
Loop(po_p:any[][][][], numberGen: number, Pc:number, Pm: number){
  return new Promise((resolve,reject) =>{
      this.prob_cross=Pc;
      this.prob_mutation=Pm;
      this.numIter=numberGen;
     this.populasi=this.deepCopy(po_p);
      // console.log(this.deepCopy(this.populasi));
      let jarak=this.evaluasiClark(this.populasi,this.fromG);
      // console.log(jarak);
      let a=this.minVal(this.deepCopy(jarak));
      let elite=a[0];
      let eliteidx=a[1];
      let histElite: number []=[];
      let idx=0;
      let pop=this.deepCopy(this.populasi);
      let fromGud=this.deepCopy(this.fromG);
      let subCol=this.deepCopy(this.info_Col);
      let datF=this.deepCopy(this.info_dating);
      let individu:any[][][]=this.deepCopy(this.populasi[a[1]]);
      let fgudang : number[]=this.deepCopy(this.fromG[a[1]]);
      
      while(idx<this.numIter){
        console.log("iter : "+idx);
      let y=this.calculateFitness(this.deepCopy(jarak));
      let sel=this.selection(this.deepCopy(pop),this.deepCopy(y),this.deepCopy(fromGud),this.deepCopy(subCol), this.deepCopy(datF) );
      // console.log(sel);
      let cross=this.crossover(this.deepCopy(sel[0]), this.deepCopy(sel[1]), this.deepCopy(pop),  this.deepCopy(sel[2]), this.deepCopy(fromGud), this.deepCopy(sel[3]), this.deepCopy(subCol), this.deepCopy(sel[4]), this.deepCopy(datF), this.deepCopy(this.rastra) );
      // console.log(cross);
      let mut=this.mutation(this.deepCopy(cross[0]),this.deepCopy(cross[1]),this.deepCopy(cross[2]),this.deepCopy(cross[3]));
      
      pop=this.deepCopy(mut[0]);
      fromGud=this.deepCopy(mut[1]);
      subCol=this.deepCopy(mut[2]);
      datF=this.deepCopy(mut[3]);
      jarak=this.evaluasiClark(pop,fromGud);
      let val=this.minVal(this.deepCopy(jarak));
      histElite[idx]=elite;
      if(elite>val[0]){
        elite=val[0];
        eliteidx=val[1];
        let ind=this.deepCopy(mut);
        individu=ind[a[1]];
        let gud=this.deepCopy(mut[1]);
        fgudang=gud[a[1]];
        
      }
      idx++;
    }
    console.log(histElite);
    console.log(elite);
      
     return resolve([histElite,individu, fgudang]);
  
  });
  }


// mereturn max value
minVal(dist:number[]){
 let min=dist[0];
 let idx=0;
 for(let i=0; i<dist.length-1;i++){
   if(dist[i]<min){
    min=dist[i];
    idx=i;
   }
   
 }
 return [min,idx];
}

//mengambil data jarak json
  public getJSON(): Observable<any> {
        return this.http.get("./assets/data.json")
    }
//menyimpan data jarak json in array
  InitializeDistance(){
return new Promise((resolve,reject) =>{
    
 let i=0;
    this.distance=[];
    this.getJSON().subscribe(data => {
      data["Distance"].forEach(item =>{
        this.distance[i]=[];
        this.distance[i]=item;
         i++;
      });
       return resolve(true);
        });
});
       

    
  }
//grouping cust berdasarakan jarak terdekat ke depot
groupingCust(ras : Rastra[]){
  return new Promise((resolve,reject) =>{
    //init matriks jarak dan udang
  let dist=this.deepCopy(this.distance);
  let gdg = this.deepCopy(this.gudang);
  let i=0;
  let notfound =false;
  let sum=0;
  //loop sebanyak desa
  while( i<ras.length&&!notfound){
    if(ras[i]['colli']!=0){
     let assign =false;
    let x=dist[ras[i].$key+7].slice(0,7);
    let xc=this.deepCopy(x);
    let val = this.deepCopy(x);
    val=val.sort((a,b)=>a-b);
    let idx=xc.indexOf(val[0]);
    let idxRemove=xc.indexOf(val[0]);
    
    while(!assign&&x.length>0){
    let jml=Math.floor((gdg[idx]['stok']*1000/15));

    if(jml<=ras[i]['colli']){
      x.splice(idxRemove,1);
 
      
      val = this.deepCopy(x);
      val=val.sort((a,b)=>a-b);
      idx=xc.indexOf(val[0]);
      idxRemove=x.indexOf(val[0]);
      
    }
    else{
    gdg[idx]['stok']-=(ras[i]['colli']*15/1000);
    this.sumGroup[idx]+=ras[i]['colli'];
    sum+=ras[i]['colli'];
    this.rastraGroup[idx].push(ras[i]);
    assign=true;
    i++;
  }
}

if(!assign){
notfound=true;
}
    }
    else{
      i++;
    }
  
    
}
// for(let i=0; i<gdg.length;i++){
//    console.log(Math.floor((gdg[i]['stok']*1000/15)));
// }
// console.log(notfound);
// console.log(sum);
// console.log(ras);
if(!notfound){
  return resolve(false);//jika  cukup maka false
  }
  else
  return resolve(true);//jika tidak cukup maka true
  });
}
cekStok(){
  return new Promise((resolve,reject) =>{
  this.distance=[]; //data jarak
  this.rastra=[];  //data kelurahan dan colli
  this.gudang=[]; //data stok
  this.dataran =[]; //data dataran tinggi
  this.route=[]; //data rute yang dihasilkan
  this.f_gudang=[]; //data gudang asal rute diantarkan
  this.sum_colli=0; //data jumlah colli yang diantarkan
  this.sub_colli=[];//data jumlah colli tiap sub route
  this.rastraGroup=[];
  this.sumGroup=[];
  this.RouteGroup=[];
  this.populasi=[];
  this.populasi_fit=[];
  this.fromG=[];
  this.subCol=[];
  this.Dating_Flag=[];
  this.info_Col=[];
  this.info_dating=[];
  this.InitializeDistance()
  .then(res =>{
    if(res){
      //console.log(this.distance);
      
      return this.InitializeRastra();
    }
  })
  .then(res =>{
    if(res){
      
      //console.log(this.rastra);
      
      //console.log(this.sum_colli);
      return this.InitializeGudang();
    }
  })
  .then(res =>{
     if(res)
    // console.log(this.gudang.length);
    // console.log(this.gudang);
   
    
    
    return this.InitializeDataran();

  })
  .then(res =>{
     if(res)
   return this.groupingCust( this.deepCopy(this.rastra));
    
    
  })
   .then(res =>{
  if(!res){
    console.log(this.rastraGroup);
  return resolve(false);//jika  cukup maka false
  }
  else
  return resolve(true);//jika tidak cukup maka true
  })
  });

}
//generate route untuk customer dengan demand > vCap
AssignSingleCust(){
  for(let i=0; i<this.rastraGroup.length; i++){
    this.RouteGroup[i]=[];
    this.subCol[i]=[];
    this.Dating_Flag[i]=[];
    let idx=0;
    for(let j=0; j<this.rastraGroup[i].length; j++){
      let b=[];
      if(this.isDataranTinggi(this.rastraGroup[i][j].desa,this.rastraGroup[i][j].kecamatan )){
        if(this.rastraGroup[i][j].colli>=this.vDating){
          let r=[];
          r["index"]=this.rastraGroup[i][j].$key;
          r["desa"]=this.rastraGroup[i][j].desa;
          r["kecamatan"]=this.rastraGroup[i][j].kecamatan;
          r["kab"]=this.rastraGroup[i][j].kabupaten;
          r["load"]=this.vDating; 
           this.subCol[i].push(this.vDating);
          this.sumGroup[i]-= this.vDating; 
          this.Dating_Flag[i].push(true);
          this.rastraGroup[i][j].colli-=this.vDating;  
          b.push(r);              
          this.RouteGroup[i].push(b);
          if(this.rastraGroup[i][j].colli==0)
            this.rastraGroup[i].splice(j,1);
        }
      }
      else{
        if(this.rastraGroup[i][j].colli>=this.vCap){
          let r=[];
          r["index"]=this.rastraGroup[i][j].$key;
          r["desa"]=this.rastraGroup[i][j].desa;
          r["kecamatan"]=this.rastraGroup[i][j].kecamatan;
          r["kab"]=this.rastraGroup[i][j].kabupaten;
          r["load"]=this.vCap; 
          this.subCol[i].push(this.vCap);
           this.sumGroup[i]-= this.vCap; 
           this.Dating_Flag[i].push(false);
          this.rastraGroup[i][j].colli-=this.vCap;                
          b.push(r);              
          this.RouteGroup[i].push(b);
          if(this.rastraGroup[i][j].colli==0)
            this.rastraGroup[i].splice(j,1);
        }
      }
      
    }
    
  }
}

//routing clark and Wright
matrixSavings(rasgroup : any[][][], dist: any[][]){
 let x=[];
 let list=[];
 let asslist=[];
 for(let i=0; i<rasgroup.length;i++){
   x[i]=[];
   list[i]=[];
   asslist[i]=[];
   for(let j=0; j<rasgroup[i].length;j++){
     x[i][j]=[];
     
     for(let k=0; k<j;k++){
let saving=Number(dist[rasgroup[i][j]['$key']+7][i])+Number(dist[rasgroup[i][k]['$key']+7][i])-Number(dist[rasgroup[i][j]['$key']+7][rasgroup[i][k]['$key']+7]);
     
      x[i][j].push(saving);
      list[i].push(saving);
      let b=[];
      b[0]=rasgroup[i][j]['$key'];
      b[1]=rasgroup[i][k]['$key'];
      asslist[i].push(b);
     }
    
   }
   
 }
 this.listSaving=list;
 this.ass=asslist;
this.matrixSaving=x;
}
//mengambil list dari matrix
getCust(gudangId : number){
let sv=this.deepCopy(this.listSaving[gudangId]);
let aslist=this.deepCopy(this.ass[gudangId]);

for(let i=0; i<aslist.length-1;i++){
  for(let j=0;j<aslist.length-1-i;j++){
    if(sv[j]<sv[j+1]){
      let z=sv[j];
      sv[j]=sv[j+1];
      sv[j+1]=z;
      let y=aslist[j];
      aslist[j]=aslist[j+1];
      aslist[j+1]=y;
    }
    
  }
}
return aslist;

}



//menyimpan data rastra dlm array
InitializeRastra(){
    return new Promise((resolve,reject) =>{
    this.rastra=[];
    var x = this.rastraService.getData();
        x.snapshotChanges().subscribe(item => {
          let i=0;
      
      item.forEach(element => {
        var y = element.payload.toJSON();
        
        this.sum_colli+=y["colli"];
        y["$key"]=y['idx'];
        this.rastra.push(y as Rastra);
        
        i++;
        
      });
      return resolve(true);
        });
    });
        
}
//menyimpan data kapasitas gudang dlm array
InitializeGudang(){
  return new Promise((resolve,reject) =>{
    this.gudang=[];
    var x = this.gudangService.getData();
        x.snapshotChanges().subscribe(item => {
      
      let i=0;
      item.forEach(element => {
         
        var y = element.payload.toJSON();
         this.gudang.push(y as Gudang);
          this.rastraGroup[i]=[];
          this.sumGroup[i]=0;
        i++;
      });
      return resolve(true);
    });
    

  });
  
}

//menyimpan data constrain dataran tinggi dlm array
InitializeDataran(){
 
return new Promise((resolve,reject) =>{
    var a = this.dataranTinggiService.getData();
     a.snapshotChanges().subscribe(item => {
      
      let i=0;
       this.dataran=[];
      item.forEach(element => {
        
        var b = element.payload.toJSON();
        this.dataran.push(b as DataranTinggi);
        i++;
      });
      return resolve(true);
      
    });
});
    

}


//mengecek dataran tinggi
isDataranTinggi(desa :string, kec :string): boolean{
  let dating=false;
for(let a=0;a<this.dataran.length;a++){
      if(desa==this.dataran[a].desa && kec==this.dataran[a].kecamatan)
      dating=true;
}
return dating;

}


findIdx(gidx:number, key: number){
  let i=0;
  let found=false;
  let idx=-1;
  while(i<this.rastraGroup[gidx].length&&!found){
    if(key==this.rastraGroup[gidx][i]['$key']){
      found=true;
      idx=i;
    }
    i++
  }
  return idx;
}

//Generate Random route
Routing(kidx: number){
   
   //jika colli lebih besar dari vcap maka diassign dalm saru rute
let gidx=0;
let ruteGrup=this.deepCopy(this.RouteGroup);
// console.log(this.deepCopy(this.RouteGroup));
let subColli=this.deepCopy(this.subCol);
let dating_flag_or=this.deepCopy(this.Dating_Flag);
let kromosom=[];
let fgd=[];
let colli_on_Subroute=[];
let datFlag=[];
let vdatshow=[];
let vkapshow=[];


while(gidx<this.RouteGroup.length){
    
   let rute=[];
   let datingFlag=[];
   let vdat=[];
   let vkap=[];
   let colli_in_subroute=[];
   let rasgrup=this.deepCopy(this.rastraGroup[gidx]);
   let aslist=this.getCust(gidx);
   let i=0; //index subroute
   rute[i]=[]
   let sumC=this.sumGroup[gidx];
   let gdg = this.deepCopy(this.gudang);
   let sub_colli=[];
   let k=kidx;//index aslist

    while(k<aslist.length&&sumC>0){ //loop hingga kapasitas kendaraan -> menghasilkan 1 sub route
         //console.log(k);
            //  console.log(aslist[k]);
            let bridge=aslist[k];
            let c=this.findIdx(gidx,bridge[0]);
            let d=this.findIdx(gidx,bridge[1]);
            // console.log(sumC)
            // console.log(rasgrup[c].colli);
            // console.log(rasgrup[d].colli);
            // console.log(rasgrup[c].colli>0 || rasgrup[d].colli>0);
            if(rasgrup[c].colli>0 || rasgrup[d].colli>0){
              //apakah pernah di route?
              let a=0;
              let ada=false;
              let notpenuh=false;
              let subrute=-1;
              let nmras=-1;
              let selbridge=-1;
              while(a<rute.length&&!notpenuh){
                let b=0
                while(b<rute[a].length&&!notpenuh){
                  
                  if(bridge[0]==rute[a][b].index||bridge[1]==rute[a][b].index){
                    ada=true;
                    // console.log(vkap[a]);
                    if(b==0 && vkap[a]>0 ){
                      notpenuh=true;
                      subrute=a;
                      nmras=b;
                    }else {
                      
                      if(b==rute[a].length-1 && datingFlag[a]==true && vdat[a]>0 && vkap[a]>0){
                      notpenuh=true;
                      subrute=a;
                      nmras=b;
                    }
                    else{
                      if(b==rute[a].length-1 && datingFlag[a]==false  && vkap[a]>0){
                      notpenuh=true;
                      subrute=a;
                      nmras=b;
                    }
                  }
                   }
                   if(notpenuh&&bridge[0]==rute[a][b].index&&rasgrup[c].colli>0){
                    selbridge=bridge[0];
                   }else{
                    if(bridge[0]==rute[a][b].index)
                    selbridge=bridge[1];
                    else
                    selbridge=bridge[0];
                   }
                  
                    
                  }

                  b++;
                }
                a++;
              }
              // console.log(k+'_'+ada+'_'+notpenuh+'_'+selbridge);

              //jika ada=false maka assign ke rute baru
            if(ada==false){
              rute[i]=[];
              colli_in_subroute[i]=0;
              let r=[];
                if(this.isDataranTinggi(rasgrup[c].desa,rasgrup[c].kecamatan)){//jika dataran tinggi
                datingFlag[i]=true;
                //jika kapasitas muatan dataran tinggi > demand
                // console.log('vdat : '+this.vDating+'_'+rasgrup[c].colli);
                    if(this.vDating>=rasgrup[c].colli){
                      //maka semua demand diantarkan
                    r["index"]=rasgrup[c].$key;
                    r["desa"]=rasgrup[c].desa;
                    r["kecamatan"]=rasgrup[c].kecamatan;
                    r["kab"]=rasgrup[c].kabupaten;
                    r["load"]=rasgrup[c].colli;
                    vdat[i]=this.vDating-rasgrup[c].colli;
                    vkap[i]=this.vCap-rasgrup[c].colli;
                    colli_in_subroute[i]+=rasgrup[c].colli;
                    sumC-=rasgrup[c].colli;
                    rasgrup[this.findIdx(gidx,bridge[0])].colli=0;
                    
                  }
                  //jika kapasitas muatan dataran tinggi < demand
                  else{
                    //maka sebagian demand diantarkan
                    r["index"]=rasgrup[c].$key;
                    r["desa"]=rasgrup[c].desa;
                    r["kecamatan"]=rasgrup[c].kecamatan;
                    r["kab"]=rasgrup[c].kabupaten;
                    r["load"]=this.vDating;
                    rasgrup[this.findIdx(gidx,bridge[0])].colli=rasgrup[c].colli-this.vDating;
                    vdat[i]=0;
                    vkap[i]=this.vCap-this.vDating;
                    colli_in_subroute[i]+=this.vDating; 
                    sumC-=this.vDating; 
                  }
                }
                //bukan dataran tinggi
                else{
                  datingFlag[i]=false;
               //jika kapasitas truk > demand
                    if(this.vCap>=rasgrup[c].colli){
                      //maka semua demand diantarkan
                    r["index"]=rasgrup[c].$key;
                    r["desa"]=rasgrup[c].desa;
                    r["kecamatan"]=rasgrup[c].kecamatan;
                    r["kab"]=rasgrup[c].kabupaten;
                    r["load"]=rasgrup[c].colli;
                    vdat[i]=this.vDating;
                    vkap[i]=this.vCap-rasgrup[c].colli;
                    colli_in_subroute[i]=+rasgrup[c].colli;
                    sumC-=rasgrup[c].colli;
                    rasgrup[this.findIdx(gidx,bridge[0])].colli=0;
                  }
                  //jika kapasitas truk < demand
                  else{
                    //maka sebagian demand diantarkan
                     r["index"]=rasgrup[c].$key;
                    r["desa"]=rasgrup[c].desa;
                    r["kecamatan"]=rasgrup[c].kecamatan;
                    r["kab"]=rasgrup[c].kabupaten;
                    r["load"]=this.vCap;
                    rasgrup[this.findIdx(gidx,bridge[0])].colli=rasgrup[c].colli-this.vCap;
                    vdat[i]=this.vDating;
                    vkap[i]=this.vCap-this.vCap;
                    colli_in_subroute[i]+=this.vCap; 
                    sumC-=this.vCap;
                  }
            }
            rute[i].push(r);

            //memasukkan bridge kedua 
            if(vdat[i]>0 && vkap[i]>0){
                r=[];
                if(!datingFlag[i] )
                datingFlag[i]=this.isDataranTinggi(rasgrup[this.findIdx(gidx,bridge[1])].desa,rasgrup[this.findIdx(gidx,bridge[1])].kecamatan);
                if(datingFlag[i] ){//jika dataran tinggi
                  //jika kapasitas truk >= kapasitas muatan dataran tinggi
                if(vkap[i]>=vdat[i]){
                //jika kapasitas muatan dataran tinggi > demand
                    if(vdat[i]>=rasgrup[d].colli){
                      //maka semua demand diantarkan
                    r["index"]=rasgrup[d].$key;
                    r["desa"]=rasgrup[d].desa;
                    r["kecamatan"]=rasgrup[d].kecamatan;
                    r["kab"]=rasgrup[d].kabupaten;
                    r["load"]=rasgrup[d].colli;
                    vdat[i]-=rasgrup[d].colli;
                    vkap[i]-=rasgrup[d].colli;
                    colli_in_subroute[i]+=rasgrup[d].colli;
                    sumC-=rasgrup[d].colli;
                    rasgrup[this.findIdx(gidx,bridge[1])].colli=0;
                  }
                  //jika kapasitas muatan dataran tinggi < demand
                  else{
                    //maka sebagian demand diantarkan
                    r["index"]=rasgrup[d].$key;
                    r["desa"]=rasgrup[d].desa;
                    r["kecamatan"]=rasgrup[d].kecamatan;
                    r["kab"]=rasgrup[d].kabupaten;
                    r["load"]=vdat[i];
                    rasgrup[this.findIdx(gidx,bridge[1])].colli=rasgrup[d].colli-vdat[i];
                    vkap[i]-=vdat[i];
                    colli_in_subroute[i]+=vdat[i]; 
                    sumC-=vdat[i]; 
                    vdat[i]-=vdat[i];
                  }
                }
                //jika kapasitas truk < kapasitas muatan dataran tinggi
                else{
                  
                  //jika kapasitas truk > demand
                    if(vkap[i]>=rasgrup[d].colli){
                      //maka semua demand diantarkan
                    r["index"]=rasgrup[d].$key;
                    r["desa"]=rasgrup[d].desa;
                    r["kecamatan"]=rasgrup[d].kecamatan;
                    r["kab"]=rasgrup[d].kabupaten;
                    r["load"]=rasgrup[d].colli;
                    vdat[i]-=rasgrup[d].colli;
                    vkap[i]-=rasgrup[d].colli;
                    colli_in_subroute[i]+=rasgrup[d].colli;
                    sumC-=rasgrup[d].colli;
                    rasgrup[this.findIdx(gidx,bridge[1])].colli=0;
                  }
                  //jika kapasitas truk < demand
                  else{
                    //maka sebagian demand diantarkan
                    r["index"]=rasgrup[d].$key;
                    r["desa"]=rasgrup[d].desa;
                    r["kecamatan"]=rasgrup[d].kecamatan;
                    r["kab"]=rasgrup[d].kabupaten;
                    r["load"]=vkap[i];
                    rasgrup[this.findIdx(gidx,bridge[1])].colli=rasgrup[d].colli-vkap[i];
                    vdat[i]-=vkap[i];
                    colli_in_subroute[i]+=vkap[i]; 
                    sumC-=vkap[i];
                    vkap[i]-=vkap[i];
                  }

                }
              }
              //bukan dataran tinggi
                else{
               //jika kapasitas truk > demand
                    if(vkap[i]>=rasgrup[d].colli){
                      //maka semua demand diantarkan
                    r["index"]=rasgrup[d].$key;
                    r["desa"]=rasgrup[d].desa;
                    r["kecamatan"]=rasgrup[d].kecamatan;
                    r["kab"]=rasgrup[d].kabupaten;
                    r["load"]=rasgrup[d].colli;
                    vdat[i]=this.vDating;
                    vkap[i]-=rasgrup[d].colli;
                    colli_in_subroute[i]+=rasgrup[d].colli;
                    sumC-=rasgrup[d].colli;
                    rasgrup[this.findIdx(gidx,bridge[1])].colli=0;
                  }
                  //jika kapasitas truk < demand
                  else{
                    //maka sebagian demand diantarkan
                     r["index"]=rasgrup[d].$key;
                    r["desa"]=rasgrup[d].desa;
                    r["kecamatan"]=rasgrup[d].kecamatan;
                    r["kab"]=rasgrup[d].kabupaten;
                    r["load"]=vkap[i];
                    rasgrup[this.findIdx(gidx,bridge[1])].colli=rasgrup[d].colli-vkap[i];
                    vdat[i]=this.vDating;
                    colli_in_subroute[i]+=vkap[i]; 
                    sumC-=vkap[i];
                    vkap[i]-=vkap[i];
                  }
            }
            rute[i].push(r);
            }
            if(vkap[i]==0){
                vdat[i]=0;
              }
              

            i++;
          }
          //jika ada=true dan not penuh=true maka tanyakan apakah demand telah diload semua
          else{
            if(ada==true && notpenuh==true && vkap[subrute]>0){
              let indexSel=this.findIdx(gidx,selbridge);
              if(vkap[subrute]==0){
                vdat[subrute]=0;
              }
              // console.log(rasgrup[indexSel].colli);
              if(rasgrup[indexSel].colli>0){ //jika demand belum terpenuhi
                 //console.log(vdat[subrute]+"_"+vkap[subrute]);
              
              let r=[];
              //apakah desa termasuk dating
              if(this.isDataranTinggi(rasgrup[indexSel].desa,rasgrup[indexSel].kecamatan)){
                //jika dating, maka apakah desa berada di belakang rute?
                if(nmras!=0){
                  
                      if(datingFlag[subrute]){//jika dataran tinggi
                        datingFlag[i]=true;
                        //jika kapasitas truk >= kapasitas muatan dataran tinggi
                      if(vkap[subrute]>=vdat[subrute]){
                      //jika kapasitas muatan dataran tinggi > demand
                          if(vdat[subrute]>=rasgrup[indexSel].colli){
                            //maka semua demand diantarkan
                          r["index"]=rasgrup[indexSel].$key;
                          r["desa"]=rasgrup[indexSel].desa;
                          r["kecamatan"]=rasgrup[indexSel].kecamatan;
                          r["kab"]=rasgrup[indexSel].kabupaten;
                          r["load"]=rasgrup[indexSel].colli;
                          vdat[subrute]-=rasgrup[indexSel].colli;
                          vkap[subrute]-=rasgrup[indexSel].colli;
                          colli_in_subroute[subrute]+=rasgrup[indexSel].colli;
                          sumC-=rasgrup[indexSel].colli;
                          rasgrup[indexSel].colli=0;
                        }
                        //jika kapasitas muatan dataran tinggi < demand
                        else{
                          //maka sebagian demand diantarkan
                          r["index"]=rasgrup[indexSel].$key;
                          r["desa"]=rasgrup[indexSel].desa;
                          r["kecamatan"]=rasgrup[indexSel].kecamatan;
                          r["kab"]=rasgrup[indexSel].kabupaten;
                          r["load"]=vdat[subrute];
                          rasgrup[indexSel].colli=rasgrup[indexSel].colli-vdat[subrute];
                          vkap[subrute]-=vdat[subrute];
                          colli_in_subroute[subrute]+=vdat[subrute]; 
                          sumC-=vdat[subrute]; 
                          vdat[subrute]-=vdat[subrute];
                        }
                      }
                      //jika kapasitas truk < kapasitas muatan dataran tinggi
                      else{
                        
                        //jika kapasitas truk > demand
                          if(vkap[subrute]>=rasgrup[indexSel].colli){
                            //maka semua demand diantarkan
                          r["index"]=rasgrup[indexSel].$key;
                          r["desa"]=rasgrup[indexSel].desa;
                          r["kecamatan"]=rasgrup[indexSel].kecamatan;
                          r["kab"]=rasgrup[indexSel].kabupaten;
                          r["load"]=rasgrup[indexSel].colli;
                          vdat[subrute]-=rasgrup[indexSel].colli;
                          vkap[subrute]-=rasgrup[indexSel].colli;
                          colli_in_subroute[subrute]+=rasgrup[indexSel].colli;
                          sumC-=rasgrup[indexSel].colli;
                          rasgrup[indexSel].colli=0;
                        }
                        //jika kapasitas truk < demand
                        else{
                          //maka sebagian demand diantarkan
                          r["index"]=rasgrup[indexSel].$key;
                          r["desa"]=rasgrup[indexSel].desa;
                          r["kecamatan"]=rasgrup[indexSel].kecamatan;
                          r["kab"]=rasgrup[indexSel].kabupaten;
                          r["load"]=vkap[subrute];
                          rasgrup[indexSel].colli=rasgrup[indexSel].colli-vkap[subrute];
                          vdat[subrute]-=vkap[subrute];
                          colli_in_subroute[subrute]+=vkap[subrute]; 
                          sumC-=vkap[subrute];
                          vkap[subrute]-=vkap[subrute];
                        }

                      }
                    }
                    //bukan dataran tinggi
                      else{
                    //jika kapasitas truk > demand
                          if(vkap[subrute]>=rasgrup[indexSel].colli){
                            //maka semua demand diantarkan
                          r["index"]=rasgrup[indexSel].$key;
                          r["desa"]=rasgrup[indexSel].desa;
                          r["kecamatan"]=rasgrup[indexSel].kecamatan;
                          r["kab"]=rasgrup[indexSel].kabupaten;
                          r["load"]=rasgrup[indexSel].colli;
                          vdat[subrute]=this.vDating;
                          vkap[subrute]-=rasgrup[indexSel].colli;
                          colli_in_subroute[subrute]+=rasgrup[indexSel].colli;
                          sumC-=rasgrup[indexSel].colli;
                          rasgrup[indexSel].colli=0;
                        }
                        //jika kapasitas truk < demand
                        else{
                          //maka sebagian demand diantarkan
                          r["index"]=rasgrup[indexSel].$key;
                          r["desa"]=rasgrup[indexSel].desa;
                          r["kecamatan"]=rasgrup[indexSel].kecamatan;
                          r["kab"]=rasgrup[indexSel].kabupaten;
                          r["load"]=vkap[subrute];
                          rasgrup[indexSel].colli=rasgrup[indexSel].colli-vkap[subrute];
                          vdat[subrute]=this.vDating;
                          colli_in_subroute[subrute]+=vkap[subrute]; 
                          sumC-=vkap[subrute];
                          vkap[subrute]-=vkap[subrute];
                        }
                  }
                  rute[subrute].push(r); //memasukkan customer dating ke cust paing akhir di rute
                }

              }
              //jika bukan desa datran tinggi
               else{
                 //apakah di depan rute?
                 if(nmras==0){ //di depan rute
                      if(datingFlag[subrute] && vdat[subrute]>0){//jika dataran tinggi
                          //jika kapasitas truk >= kapasitas muatan dataran tinggi
                        if(vkap[subrute]>=vdat[subrute]){
                        //jika kapasitas muatan dataran tinggi > demand
                            if(vdat[subrute]>=rasgrup[indexSel].colli){
                              //maka semua demand diantarkan
                            r["index"]=rasgrup[indexSel].$key;
                            r["desa"]=rasgrup[indexSel].desa;
                            r["kecamatan"]=rasgrup[indexSel].kecamatan;
                            r["kab"]=rasgrup[indexSel].kabupaten;
                            r["load"]=rasgrup[indexSel].colli;
                            vdat[subrute]-=rasgrup[indexSel].colli;
                            vkap[subrute]-=rasgrup[indexSel].colli;
                            colli_in_subroute[subrute]+=rasgrup[indexSel].colli;
                            sumC-=rasgrup[indexSel].colli;
                            rasgrup[indexSel].colli=0;
                          }
                          //jika kapasitas muatan dataran tinggi < demand
                          else{
                            //maka sebagian demand diantarkan
                            r["index"]=rasgrup[indexSel].$key;
                            r["desa"]=rasgrup[indexSel].desa;
                            r["kecamatan"]=rasgrup[indexSel].kecamatan;
                            r["kab"]=rasgrup[indexSel].kabupaten;
                            r["load"]=vdat[subrute];
                            rasgrup[indexSel].colli=rasgrup[indexSel].colli-vdat[subrute];
                            vkap[subrute]-=vdat[subrute];
                            colli_in_subroute[subrute]+=vdat[subrute]; 
                            sumC-=vdat[subrute]; 
                            vdat[subrute]-=vdat[subrute];
                          }
                        }
                        //jika kapasitas truk < kapasitas muatan dataran tinggi
                        else{
                          
                          //jika kapasitas truk > demand
                            if(vkap[subrute]>=rasgrup[indexSel].colli){
                              //maka semua demand diantarkan
                            r["index"]=rasgrup[indexSel].$key;
                            r["desa"]=rasgrup[indexSel].desa;
                            r["kecamatan"]=rasgrup[indexSel].kecamatan;
                            r["kab"]=rasgrup[indexSel].kabupaten;
                            r["load"]=rasgrup[indexSel].colli;
                            vdat[subrute]-=rasgrup[indexSel].colli;
                            vkap[subrute]-=rasgrup[indexSel].colli;
                            colli_in_subroute[subrute]+=rasgrup[indexSel].colli;
                            sumC-=rasgrup[indexSel].colli;
                            rasgrup[indexSel].colli=0;
                          }
                          //jika kapasitas truk < demand
                          else{
                            //maka sebagian demand diantarkan
                            r["index"]=rasgrup[indexSel].$key;
                            r["desa"]=rasgrup[indexSel].desa;
                            r["kecamatan"]=rasgrup[indexSel].kecamatan;
                            r["kab"]=rasgrup[indexSel].kabupaten;
                            r["load"]=vkap[subrute];
                            rasgrup[indexSel].colli=rasgrup[indexSel].colli-vkap[subrute];
                            vdat[subrute]-=vkap[subrute];
                            colli_in_subroute[subrute]+=vkap[subrute]; 
                            sumC-=vkap[subrute];
                            vkap[subrute]-=vkap[subrute];
                          }

                        }
                      }
                      //bukan dataran tinggi
                        else{ 
                      //jika kapasitas truk > demand
                            if(vkap[subrute]>=rasgrup[indexSel].colli){
                              //maka semua demand diantarkan
                            r["index"]=rasgrup[indexSel].$key;
                            r["desa"]=rasgrup[indexSel].desa;
                            r["kecamatan"]=rasgrup[indexSel].kecamatan;
                            r["kab"]=rasgrup[indexSel].kabupaten;
                            r["load"]=rasgrup[indexSel].colli;
                            vdat[subrute]=this.vDating;
                            vkap[subrute]-=rasgrup[indexSel].colli;
                            colli_in_subroute[subrute]+=rasgrup[indexSel].colli;
                            sumC-=rasgrup[indexSel].colli;
                            rasgrup[indexSel].colli=0;
                          }
                          //jika kapasitas truk < demand
                          else{
                            //maka sebagian demand diantarkan
                            r["index"]=rasgrup[indexSel].$key;
                            r["desa"]=rasgrup[indexSel].desa;
                            r["kecamatan"]=rasgrup[indexSel].kecamatan;
                            r["kab"]=rasgrup[indexSel].kabupaten;
                            r["load"]=vkap[subrute];
                            rasgrup[indexSel].colli=rasgrup[indexSel].colli-vkap[subrute];
                            vdat[subrute]=this.vDating;
                            colli_in_subroute[subrute]+=vkap[subrute]; 
                            sumC-=vkap[subrute];
                            vkap[subrute]-=vkap[subrute];
                          }
                    }
                    rute[subrute].unshift(r); //memasukkan customer dating ke cust paing depan di rute
                 }

                 else{//di belakang
                          if(datingFlag[subrute] && vdat[subrute]>0){//jika dataran tinggi
                                //jika kapasitas truk >= kapasitas muatan dataran tinggi
                              if(vkap[subrute]>=vdat[subrute]){
                              //jika kapasitas muatan dataran tinggi > demand
                                  if(vdat[subrute]>=rasgrup[indexSel].colli){
                                    //maka semua demand diantarkan
                                  r["index"]=rasgrup[indexSel].$key;
                                  r["desa"]=rasgrup[indexSel].desa;
                                  r["kecamatan"]=rasgrup[indexSel].kecamatan;
                                  r["kab"]=rasgrup[indexSel].kabupaten;
                                  r["load"]=rasgrup[indexSel].colli;
                                  vdat[subrute]-=rasgrup[indexSel].colli;
                                  vkap[subrute]-=rasgrup[indexSel].colli;
                                  colli_in_subroute[subrute]+=rasgrup[indexSel].colli;
                                  sumC-=rasgrup[indexSel].colli;
                                  rasgrup[indexSel].colli=0;
                                }
                                //jika kapasitas muatan dataran tinggi < demand
                                else{
                                  //maka sebagian demand diantarkan
                                  r["index"]=rasgrup[indexSel].$key;
                                  r["desa"]=rasgrup[indexSel].desa;
                                  r["kecamatan"]=rasgrup[indexSel].kecamatan;
                                  r["kab"]=rasgrup[indexSel].kabupaten;
                                  r["load"]=vdat[subrute];
                                  rasgrup[indexSel].colli=rasgrup[indexSel].colli-vdat[subrute];
                                  vkap[subrute]-=vdat[subrute];
                                  colli_in_subroute[subrute]+=vdat[subrute]; 
                                  sumC-=vdat[subrute]; 
                                  vdat[subrute]-=vdat[subrute];
                                }
                              }
                              //jika kapasitas truk < kapasitas muatan dataran tinggi
                              else{
                                
                                //jika kapasitas truk > demand
                                  if(vkap[subrute]>=rasgrup[indexSel].colli){
                                    //maka semua demand diantarkan
                                  r["index"]=rasgrup[indexSel].$key;
                                  r["desa"]=rasgrup[indexSel].desa;
                                  r["kecamatan"]=rasgrup[indexSel].kecamatan;
                                  r["kab"]=rasgrup[indexSel].kabupaten;
                                  r["load"]=rasgrup[indexSel].colli;
                                  vdat[subrute]-=rasgrup[indexSel].colli;
                                  vkap[subrute]-=rasgrup[indexSel].colli;
                                  colli_in_subroute[subrute]+=rasgrup[indexSel].colli;
                                  sumC-=rasgrup[indexSel].colli;
                                  rasgrup[indexSel].colli=0;
                                }
                                //jika kapasitas truk < demand
                                else{
                                  //maka sebagian demand diantarkan
                                  r["index"]=rasgrup[indexSel].$key;
                                  r["desa"]=rasgrup[indexSel].desa;
                                  r["kecamatan"]=rasgrup[indexSel].kecamatan;
                                  r["kab"]=rasgrup[indexSel].kabupaten;
                                  r["load"]=vkap[subrute];
                                  rasgrup[indexSel].colli=rasgrup[indexSel].colli-vkap[subrute];
                                  vdat[subrute]-=vkap[subrute];
                                  colli_in_subroute[subrute]+=vkap[subrute]; 
                                  sumC-=vkap[subrute];
                                  vkap[subrute]-=vkap[subrute];
                                }

                              }
                            }
                            //bukan dataran tinggi
                              else{
                            //jika kapasitas truk > demand
                                  if(vkap[subrute]>=rasgrup[indexSel].colli){
                                    //maka semua demand diantarkan
                                  r["index"]=rasgrup[indexSel].$key;
                                  r["desa"]=rasgrup[indexSel].desa;
                                  r["kecamatan"]=rasgrup[indexSel].kecamatan;
                                  r["kab"]=rasgrup[indexSel].kabupaten;
                                  r["load"]=rasgrup[indexSel].colli;
                                  vdat[subrute]=this.vDating;
                                  vkap[subrute]-=rasgrup[indexSel].colli;
                                  colli_in_subroute[subrute]+=rasgrup[indexSel].colli;
                                  sumC-=rasgrup[indexSel].colli;
                                  rasgrup[indexSel].colli=0;
                                }
                                //jika kapasitas truk < demand
                                else{
                                  //maka sebagian demand diantarkan
                                  r["index"]=rasgrup[indexSel].$key;
                                  r["desa"]=rasgrup[indexSel].desa;
                                  r["kecamatan"]=rasgrup[indexSel].kecamatan;
                                  r["kab"]=rasgrup[indexSel].kabupaten;
                                  r["load"]=vkap[subrute];
                                  rasgrup[indexSel].colli=rasgrup[indexSel].colli-vkap[subrute];
                                  vdat[subrute]=this.vDating;
                                  colli_in_subroute[subrute]+=vkap[subrute]; 
                                  sumC-=vkap[subrute];
                                  vkap[subrute]-=vkap[subrute];
                                }
                          }
                          rute[subrute].push(r); //memasukkan customer dating ke cust paing depan di rute
                 }
               }//end else bukan cust dataran tinggi
               

              }
            }//endif else of ada=true && notpenuh=true
            else{
              if(ada==true && notpenuh==false){
                //membuat rute baru
                let indexnew1=this.findIdx(gidx,bridge[0]);
                let indexnew2=this.findIdx(gidx,bridge[1]);
              //   if(rasgrup[indexnew1].colli==0){
              //   indexnew1=this.findIdx(gidx,bridge[1]);
              //   indexnew2=this.findIdx(gidx,bridge[0]);
              //   console.log('swap');
              // }
                if(rasgrup[indexnew1].colli>0&&rasgrup[indexnew2].colli>0){
                  
                   
                  
                    rute[i]=[];
                    colli_in_subroute[i]=0;
                    let r=[];
                      if(this.isDataranTinggi(rasgrup[indexnew1].desa,rasgrup[indexnew1].kecamatan )){//jika dataran tinggi
                      datingFlag[i]=true;
                      //jika kapasitas muatan dataran tinggi > demand
                      
                          if(this.vDating>=rasgrup[indexnew1].colli){
                            //maka semua demand diantarkan
                          r["index"]=rasgrup[indexnew1].$key;
                          r["desa"]=rasgrup[indexnew1].desa;
                          r["kecamatan"]=rasgrup[indexnew1].kecamatan;
                          r["kab"]=rasgrup[indexnew1].kabupaten;
                          r["load"]=rasgrup[indexnew1].colli;
                          vdat[i]=this.vDating-rasgrup[indexnew1].colli;
                          vkap[i]=this.vCap-rasgrup[indexnew1].colli;
                          colli_in_subroute[i]+=rasgrup[indexnew1].colli;
                          sumC-=rasgrup[indexnew1].colli;
                          rasgrup[indexnew1].colli=0;
                        }
                        //jika kapasitas muatan dataran tinggi < demand
                        else{
                          //maka sebagian demand diantarkan
                          r["index"]=rasgrup[indexnew1].$key;
                          r["desa"]=rasgrup[indexnew1].desa;
                          r["kecamatan"]=rasgrup[indexnew1].kecamatan;
                          r["kab"]=rasgrup[indexnew1].kabupaten;
                          r["load"]=this.vDating;
                          rasgrup[indexnew1].colli=rasgrup[indexnew1].colli-this.vDating;
                          vdat[i]=this.vDating-this.vDating;
                          vkap[i]=this.vCap-this.vDating;
                          colli_in_subroute[i]+=this.vDating; 
                          sumC-=this.vDating; 
                        }
                      }
                      //bukan dataran tinggi
                      else{
                        datingFlag[i]=false;
                    //jika kapasitas truk > demand
                          if(this.vCap>=rasgrup[indexnew1].colli){
                            //maka semua demand diantarkan
                          r["index"]=rasgrup[indexnew1].$key;
                          r["desa"]=rasgrup[indexnew1].desa;
                          r["kecamatan"]=rasgrup[indexnew1].kecamatan;
                          r["kab"]=rasgrup[indexnew1].kabupaten;
                          r["load"]=rasgrup[indexnew1].colli;
                          vdat[i]=this.vDating;
                          vkap[i]=this.vCap-rasgrup[indexnew1].colli;
                          colli_in_subroute[i]+=rasgrup[indexnew1].colli;
                          sumC-=rasgrup[indexnew1].colli;
                          rasgrup[indexnew1].colli=0;
                        }
                        //jika kapasitas truk < demand
                        else{
                          //maka sebagian demand diantarkan
                          r["index"]=rasgrup[indexnew1].$key;
                          r["desa"]=rasgrup[indexnew1].desa;
                          r["kecamatan"]=rasgrup[indexnew1].kecamatan;
                          r["kab"]=rasgrup[indexnew1].kabupaten;
                          r["load"]=this.vCap;
                          rasgrup[indexnew1].colli=rasgrup[indexnew1].colli-this.vCap;
                          vdat[i]=this.vDating;
                          vkap[i]=this.vCap-this.vCap;
                          colli_in_subroute[i]+=this.vCap; 
                          sumC-=this.vCap;
                        }
                         
                  }
                  rute[i].push(r);

                  //memasukkan bridge kedua
                  if(vdat[i]>0 && vkap[i]>0&&rasgrup[indexnew2].colli>0) {
                  r=[];
                  datingFlag[i]=this.isDataranTinggi(rasgrup[indexnew2].desa,rasgrup[indexnew1].kecamatan);
                      if(datingFlag[i] ){//jika dataran tinggi
                        //jika kapasitas truk >= kapasitas muatan dataran tinggi
                      if(vkap[i]>=vdat[i]){
                      //jika kapasitas muatan dataran tinggi > demand
                          if(vdat[i]>=rasgrup[indexnew2].colli){
                            //maka semua demand diantarkan
                          r["index"]=rasgrup[indexnew2].$key;
                          r["desa"]=rasgrup[indexnew2].desa;
                          r["kecamatan"]=rasgrup[indexnew2].kecamatan;
                          r["kab"]=rasgrup[indexnew2].kabupaten;
                          r["load"]=rasgrup[indexnew2].colli;
                          vdat[i]-=rasgrup[indexnew2].colli;
                          vkap[i]-=rasgrup[indexnew2].colli;
                          colli_in_subroute[i]+=rasgrup[indexnew2].colli;
                          sumC-=rasgrup[indexnew2].colli;
                          rasgrup[indexnew2].colli=0;
                        }
                        //jika kapasitas muatan dataran tinggi < demand
                        else{
                          //maka sebagian demand diantarkan
                          r["index"]=rasgrup[indexnew2].$key;
                          r["desa"]=rasgrup[indexnew2].desa;
                          r["kecamatan"]=rasgrup[indexnew2].kecamatan;
                          r["kab"]=rasgrup[indexnew2].kabupaten;
                          r["load"]=vdat[i];
                          rasgrup[indexnew2].colli=rasgrup[indexnew2].colli-vdat[i];
                          vkap[i]-=vdat[i];
                          colli_in_subroute[i]+=vdat[i]; 
                          sumC-=vdat[i]; 
                          vdat[i]-=vdat[i];
                        }
                      }
                      //jika kapasitas truk < kapasitas muatan dataran tinggi
                      else{
                        
                        //jika kapasitas truk > demand
                          if(vkap[i]>=rasgrup[indexnew2].colli){
                            //maka semua demand diantarkan
                          r["index"]=rasgrup[indexnew2].$key;
                          r["desa"]=rasgrup[indexnew2].desa;
                          r["kecamatan"]=rasgrup[indexnew2].kecamatan;
                          r["kab"]=rasgrup[indexnew2].kabupaten;
                          r["load"]=rasgrup[indexnew2].colli;
                          vdat[i]-=rasgrup[indexnew2].colli;
                          vkap[i]-=rasgrup[indexnew2].colli;
                          colli_in_subroute[i]+=rasgrup[indexnew2].colli;
                          sumC-=rasgrup[indexnew2].colli;
                          rasgrup[indexnew2].colli=0;
                        }
                        //jika kapasitas truk < demand
                        else{
                          //maka sebagian demand diantarkan
                          r["index"]=rasgrup[indexnew2].$key;
                          r["desa"]=rasgrup[indexnew2].desa;
                          r["kecamatan"]=rasgrup[indexnew2].kecamatan;
                          r["kab"]=rasgrup[indexnew2].kabupaten;
                          r["load"]=vkap[i];
                          rasgrup[indexnew2].colli=rasgrup[indexnew2].colli-vkap[i];
                          vdat[i]-=vkap[i];
                          colli_in_subroute[i]+=vkap[i]; 
                          sumC-=vkap[i];
                          vkap[i]-=vkap[i];
                        }

                      }
                    }
                    //bukan dataran tinggi
                      else{
                    //jika kapasitas truk > demand
                          if(vkap[i]>=rasgrup[indexnew2].colli){
                            //maka semua demand diantarkan
                          r["index"]=rasgrup[indexnew2].$key;
                          r["desa"]=rasgrup[indexnew2].desa;
                          r["kecamatan"]=rasgrup[indexnew2].kecamatan;
                          r["kab"]=rasgrup[indexnew2].kabupaten;
                          r["load"]=rasgrup[indexnew2].colli;
                          vdat[i]=this.vDating;
                          vkap[i]-=rasgrup[indexnew2].colli;
                          colli_in_subroute[i]+=rasgrup[indexnew2].colli;
                          sumC-=rasgrup[indexnew2].colli;
                          rasgrup[indexnew2].colli=0;
                        }
                        //jika kapasitas truk < demand
                        else{
                          //maka sebagian demand diantarkan
                          r["index"]=rasgrup[indexnew2].$key;
                          r["desa"]=rasgrup[indexnew2].desa;
                          r["kecamatan"]=rasgrup[indexnew2].kecamatan;
                          r["kab"]=rasgrup[indexnew2].kabupaten;
                          r["load"]=vkap[i];
                          rasgrup[indexnew2].colli=rasgrup[indexnew2].colli-vkap[i];
                          vdat[i]=this.vDating;
                          colli_in_subroute[i]+=vkap[i]; 
                          sumC-=vkap[i];
                          vkap[i]-=vkap[i];
                        }
                       
                  }
                  rute[i].push(r);
                  }
                  if(vkap[i]==0){
                    vdat[i]=0;
                  }
                  i++;
                }


              }
            }
          }
    }
          k++;
          
    }
    let list=this.getUnassignCust(rasgrup);
    let e=0;
    while(sumC>0&& e<list.length){
      
                    let indexnew1=this.findIdx(gidx,list[e]);
                   rute[i]=[];
                    colli_in_subroute[i]=0;
                    let r=[];
                      if(this.isDataranTinggi(rasgrup[indexnew1].desa,rasgrup[indexnew1].kecamatan )){//jika dataran tinggi
                      datingFlag[i]=true;
                      //jika kapasitas muatan dataran tinggi > demand
                      
                          if(this.vDating>=rasgrup[indexnew1].colli){
                            //maka semua demand diantarkan
                          r["index"]=rasgrup[indexnew1].$key;
                          r["desa"]=rasgrup[indexnew1].desa;
                          r["kecamatan"]=rasgrup[indexnew1].kecamatan;
                          r["kab"]=rasgrup[indexnew1].kabupaten;
                          r["load"]=rasgrup[indexnew1].colli;
                          vdat[i]=this.vDating-rasgrup[indexnew1].colli;
                          vkap[i]=this.vCap-rasgrup[indexnew1].colli;
                          colli_in_subroute[i]+=rasgrup[indexnew1].colli;
                          sumC-=rasgrup[indexnew1].colli;
                          rasgrup[indexnew1].colli=0;
                        }
                        //jika kapasitas muatan dataran tinggi < demand
                        else{
                          //maka sebagian demand diantarkan
                          r["index"]=rasgrup[indexnew1].$key;
                          r["desa"]=rasgrup[indexnew1].desa;
                          r["kecamatan"]=rasgrup[indexnew1].kecamatan;
                          r["kab"]=rasgrup[indexnew1].kabupaten;
                          r["load"]=this.vDating;
                          rasgrup[indexnew1].colli=rasgrup[indexnew1].colli-this.vDating;
                          vdat[i]=this.vDating-this.vDating;
                          vkap[i]=this.vCap-this.vDating;
                          colli_in_subroute[i]+=this.vDating; 
                          sumC-=this.vDating; 
                        }
                      }
                      //bukan dataran tinggi
                      else{
                        datingFlag[i]=false;
                    //jika kapasitas truk > demand
                          if(this.vCap>=rasgrup[indexnew1].colli){
                            //maka semua demand diantarkan
                          r["index"]=rasgrup[indexnew1].$key;
                          r["desa"]=rasgrup[indexnew1].desa;
                          r["kecamatan"]=rasgrup[indexnew1].kecamatan;
                          r["kab"]=rasgrup[indexnew1].kabupaten;
                          r["load"]=rasgrup[indexnew1].colli;
                          vdat[i]=this.vDating;
                          vkap[i]=this.vCap-rasgrup[indexnew1].colli;
                          colli_in_subroute[i]+=rasgrup[indexnew1].colli;
                          sumC-=rasgrup[indexnew1].colli;
                          rasgrup[indexnew1].colli=0;
                        }
                        //jika kapasitas truk < demand
                        else{
                          //maka sebagian demand diantarkan
                          r["index"]=rasgrup[indexnew1].$key;
                          r["desa"]=rasgrup[indexnew1].desa;
                          r["kecamatan"]=rasgrup[indexnew1].kecamatan;
                          r["kab"]=rasgrup[indexnew1].kabupaten;
                          r["load"]=this.vCap;
                          rasgrup[indexnew1].colli=rasgrup[indexnew1].colli-this.vCap;
                          vdat[i]=this.vDating;
                          vkap[i]=this.vCap-this.vCap;
                          colli_in_subroute[i]+=this.vCap; 
                          sumC-=this.vCap;
                        }
                         
                  }
                  rute[i].push(r);

                  

                  i++;
                  e++;
    }

    for(let z=0;z<ruteGrup[gidx].length;z++){
      kromosom.push(ruteGrup[gidx][z]);
      colli_on_Subroute.push(subColli[gidx][z]);
      fgd.push(gidx);
      datFlag.push(dating_flag_or[gidx][z]);
      vdatshow.push(false);
      vkapshow.push(false);
      
    }
    if(rute[0].length>0){
      for(let y=0;y<rute.length;y++){
       kromosom.push(rute[y]);
       colli_on_Subroute.push(colli_in_subroute[y]);
       fgd.push(gidx);
       datFlag.push(datingFlag[y]);
       vdatshow.push(vdat[y]);
      vkapshow.push(vkap[y]);
  }
    }
  
    
    gidx++;

}
// console.log(kromosom);
// console.log(fgd);
// console.log(colli_on_Subroute);
// console.log(datFlag);

return [kromosom,fgd,colli_on_Subroute,datFlag] ;
 
}
//scheduliang phase
scheduling(population : any[][][][], datFlag: any[][], fromgud: any[][]){
  return new Promise((resolve,reject) =>{
  
  let pol=[];
  for(let i=0; i<population.length;i++){
  pol[i]=[];
    for(let j=0;j<population[i].length;j++){
      let newSubrute=[];
      //apakah dataran tinggi?
      let jarakBefore=0;
      if(!datFlag[i][j]&&population[i][j].length>1){
        jarakBefore=this.calDistSubRute(population[i][j],fromgud[i][j]);
        //jika bukan dataran tinggi cari dea paling dekat dengan gudang
        let subRute=this.deepCopy(population[i][j]);
        let k=0;
        let selectedDesa=0;
        let idxSelected=population[i][j][k]['index'];
        let min=Number(this.distance[fromgud[i][j]][population[i][j][k]['index']+7]);
        k++;
        while(k<population[i][j].length){
          if(min>Number(this.distance[fromgud[i][j]][population[i][j][k]['index']+7])){
            min=Number(this.distance[fromgud[i][j]][population[i][j][k]['index']+7]);
            selectedDesa=k;
            idxSelected=population[i][j][k]['index'];
          }
          k++;
        }
        newSubrute.push(this.deepCopy(population[i][j][selectedDesa]));
        subRute.splice(selectedDesa,1);
        if(subRute.length>1){
        
          for(let l=0;l<subRute.length;l++){
            
            let m=0;
            let selectedDesa=0;
            let min=Number(this.distance[idxSelected+7][subRute[m]['index']+7]);
            m++;
            while(m<subRute.length){
              if(min>Number(this.distance[idxSelected+7][subRute[m]['index']+7])){
                min=Number(this.distance[idxSelected+7][subRute[m]['index']+7]);
                selectedDesa=m;
                idxSelected=subRute[m]['index'];
              }
              m++;
            }
           newSubrute.push(this.deepCopy(subRute[selectedDesa])); 
           subRute.splice(selectedDesa,1);
           if(subRute.length>1){
             l--;
           }
           
        }
         newSubrute.push(this.deepCopy(subRute[0])); 
      }
     else{
       newSubrute.push(this.deepCopy(subRute[0]));
     }
     
        
        }
        if(newSubrute.length>0){
          let jarakAfter=this.calDistSubRute(newSubrute,fromgud[i][j]);
          if(jarakAfter<jarakBefore){
            // console.log('lebih baik');
            // console.log(jarakAfter+'_'+jarakBefore);
          pol[i].push(this.deepCopy(newSubrute));
          }
          else
          pol[i].push(this.deepCopy(population[i][j]));
        }
     else
     pol[i].push(this.deepCopy(population[i][j]));
        
    }
  }
  // console.log([pol,fromgud,datFlag]);
  return resolve(pol);
  });
}
calDistSubRute(subrute:any[][], fgud:number){

    let k=0;
    let jarak_subroute=0;
    jarak_subroute+=Number(this.distance[fgud][subrute[k]["index"]+7]) //jarak depot-customer
    
    // console.log([route[i][j].length-1]);
    
    // console.log(route[i][j][route[i][j].length-1]["index"]+7);
    // console.log(f_gudang[i][j]);
    // console.log(subrute[subrute.length-1]);
    jarak_subroute+=Number(this.distance[subrute[subrute.length-1]["index"]+7][fgud]); //jarak customer-depot
    while(k<subrute.length-1){//loop sebanyak desa dalam sub route
      jarak_subroute+=Number(this.distance[subrute[k]["index"]+7][subrute[k+1]["index"]+7]) //jarak depot-customer
      k++;
    }
    return jarak_subroute;
}

evaluasiClark(pop: any[][][], fgud: any[][]){
let evl :number[]=[];

  let i=0;
let sumJarak=0;
while(i<pop.length){//loop sebanyak populasi
  let j=0;
  let jarak_route=0;
  while(j<pop[i].length){//loop sebanyak sub route
    let k=0;
    let jarak_subroute=0;
    jarak_subroute+=Number(this.distance[fgud[i][j]][pop[i][j][k]["index"]+7]) //jarak depot-customer
    
    // console.log([route[i][j].length-1]);
    
    // console.log(route[i][j][route[i][j].length-1]["index"]+7);
    // console.log(f_gudang[i][j]);
    // console.log(pop[i][j]);
    jarak_subroute+=Number(this.distance[pop[i][j][pop[i][j].length-1]["index"]+7][fgud[i][j]]) //jarak customer-depot
    while(k<pop[i][j].length-1){//loop sebanyak desa dalam sub route
      jarak_subroute+=Number(this.distance[pop[i][j][k]["index"]+7][pop[i][j][k+1]["index"]+7]) //jarak depot-customer
      k++;
    }
    jarak_route+=jarak_subroute;
    j++;
  }
  evl[i]=jarak_route;
  sumJarak+=jarak_route;
  i++;
}
evl[pop.length]=sumJarak; 
return evl;
}

// mengambil desa yang belum terpenuhi demand nya
getUnassignCust(rastragrup: any[][]){
  let list=[];
  for(let i=0;i<rastragrup.length;i++){
    if(rastragrup[i]['colli']>0){
      list.push(rastragrup[i]['$key']);
    }
  }
  return list;
}


//deep copy array
deepCopy(obj) {
 if(typeof obj === 'object') {
  return Object.keys(obj)
   .map(k => ({ [k]: this.deepCopy(obj[k]) }))
   .reduce((a, c) => Object.assign(a, c), []);
 } else if(Array.isArray(obj)) {
  return obj.map(this.deepCopy)
 }
 return obj;
}

//menghitung fitness
calculateFitness(totJarak: number[]):number[]{
  let i=0;
  let fitness:number[]=[];
  while(i<totJarak.length-1){//menghitung fitness tiap individu
    //fitness = total jarak route 1 populasi/total jarak route 1 ind
    fitness[i]=totJarak[totJarak.length-1]/totJarak[i];
    i++;
  }
  return fitness;
}

//selection
selection(route:any[][][][], fitness:number[], f_gud:number[][], subcol: any[][], datFlag: any [][]){

  let offs:any[][][][]=[];
  let f_gudang:number[][]=[];
  let infoCol :any[][]=[];
  let infoDat : any[][]=[];
  let cumulative: number[]=[];
  let pcumulative: number[]=[];
  let i=0;
  let x=0
  //  console.log(fitness);
  //menghitung kumulatif fitness
  while(i<fitness.length){
    x+=fitness[i];
    cumulative[i]=x;
    i++;
  }
  // console.log(cumulative);
  let j=0;
  //menghitung probability 
  while(j<cumulative.length){
    pcumulative[j]=cumulative[j]/cumulative[cumulative.length-1];
    j++;
  }
  // console.log(pcumulative);
  //select candidate
  let choosed:number[]=[];
  let k=0;
  
  while(k<pcumulative.length){
    let rnd=Math.random(); //generate angka random [0,1)
    // let randomVal=[0.7960147630850072,0.25445883886940335, 0.7986107653779335, 0.0027807857853223705,0.7856157292503474];
    // rnd=randomVal[k];
    let l=0;
    while(l<pcumulative.length){
      if(rnd>pcumulative[l]){
        l++;
      }
      else{
        break;
      }
    }
    choosed[k]=l;
    offs.push(route[l]);
    f_gudang.push(f_gud[l]);
    infoCol.push(subcol[l]);
    infoDat.push(datFlag[l]);
    k++;
  }
//  console.log([choosed,offs,f_gudang, infoDat]);
  return [offs,choosed,f_gudang, infoCol, infoDat];

}

//crossover

crossover(offs : any[][][][], choosed :number[], parent: any[][][][], fgudangOffs: any[][], fgudangPar:any[][], subcollioffs : any[][], subcollipar: any [][], datOffs: any[][], datPar: any[][], rastra:any[][]){
  // console.log('Crossover');
  let i=0;
  let newOffs=[];
  let newGud=[];
  let newsub=[];
  let newdatFlag=[];
  while(i<offs.length){
    var randomParent = Math.floor(Math.random() * offs.length);
    let same=true;
       if(choosed[i]!=randomParent)
       same=false;
       while(same){
         randomParent = Math.floor(Math.random() * offs.length);
         if(choosed[i]!=randomParent)
          same=false;
       }
      //  let rparent=[3,2,0,1,1];
      //  randomParent=rparent[i];
      //  console.log(choosed[i]+"_"+randomParent);
       
       let randomRoute1 = Math.floor(Math.random() * offs[i].length);
       let randomRoute2 = Math.floor(Math.random() * parent[randomParent].length);

      //  let rr1=[5,5,1,3,5];
      //  let rr2=[5,2,1,5,2];
      //  randomRoute1=rr1[i];
      //  randomRoute2=rr2[i];
        // console.log("Route: "+randomRoute1+"_"+randomRoute2);
        // console.log(offs[i][randomRoute1]);
        // console.log(parent[randomParent][randomRoute2]);
        //menampung index desa untuk proses removing
        let listRoute1=[];
        for(let a=0; a<offs[i][randomRoute1].length;a++){
          listRoute1.push(offs[i][randomRoute1][a]['index']);
        }
        let listRoute2=[];
        for(let a=0; a<parent[randomParent][randomRoute2].length;a++){
          listRoute2.push(parent[randomParent][randomRoute2][a]['index']);
        }
        // console.log(listRoute1);
        // console.log(listRoute2);
        //parent 1
        let parent1=this.deepCopy(offs[i]);
        let fgud1=this.deepCopy(fgudangOffs[i]);
        let subpar1=this.deepCopy(subcollioffs[i]);
        let datflag1=this.deepCopy(datOffs[i]);
        //parent 2
        let parent2=this.deepCopy(parent[randomParent]);
        let fgud2=this.deepCopy(fgudangPar[randomParent]);
        let subpar2=this.deepCopy(subcollipar[randomParent]);
        let datflag2=this.deepCopy(datPar[randomParent]);
      

        let orInd1=this.calDistance(this.deepCopy(offs[i]),this.deepCopy(fgudangOffs[i]));
        let orInd2=this.calDistance(this.deepCopy(parent[randomParent]),this.deepCopy(fgudangPar[randomParent]));

        var randNum = Math.random();
          // let raand=[0.7594149767052774, 0.003940952666833697, 0.49973236574322266, 0.7575797201626049, 0.6679742643282924];
          // randNum=raand[i];
          if(randNum<this.prob_cross){
        // console.log(this.deepCopy(offs[i]));
        // console.log(this.deepCopy(subcollioffs[i]));
        // console.log(this.deepCopy(fgudangOffs[i]));
        // console.log(this.deepCopy(datOffs[i]));
        // console.log(this.cekSum(subcollioffs[i]));
        //generate random number 0-1 untuk mementukan crossover dilakukan child 1
          
        //menghapus desa di parent 1
        // console.log('p1');
        for(let a=0; a<parent1.length;a++){
          if(fgud1[a]==fgud2[randomRoute2]){
            let found=false;
            let idxr=0;
            // console.log(this.deepCopy(parent1[a]));
            while(idxr<parent1[a].length){
              if(listRoute2.includes(parent1[a][idxr]['index'])){
                // console.log(idxr+"_"+parent1[a].length);
                // console.log(a);
                // console.log(parent1[a][idxr]);
                subpar1[a]-=parent1[a][idxr]['load'];
                


                parent1[a].splice(idxr,1);
                
                if(datflag1[a]){
                  let changeFlag=false;
                  let c=0;
                  while(changeFlag&&c<parent1[a].length){
                    changeFlag=this.isDataranTinggi(parent1[a][c]['desa'],parent1[a][c]['kecamatan']);
                    c++;
                  }
                  datflag1[a]=changeFlag;
                }
                
              }else{
                idxr++;
              }
            }
            if(subpar1[a]==0){
                   parent1.splice(a,1);
                  subpar1.splice(a,1);
                  fgud1.splice(a,1);
                  datflag1.splice(a,1);
                  a--;
                }
                
          }
        }
        // console.log(this.deepCopy(parent1));
        // console.log(this.deepCopy(subpar1));
        // console.log(this.deepCopy(fgud1));
        // console.log(datflag1);
        // console.log('Parent 2')
        // console.log(this.deepCopy(parent[randomParent]));
        // console.log(this.deepCopy(subcollipar[randomParent]));
        // console.log(this.deepCopy(fgudangPar[randomParent]));
        // console.log(this.deepCopy(datPar[randomParent]));
        //menghapus desa di parent 2
        // console.log('p2');
        for(let a=0; a<parent2.length;a++){
          if(fgud2[a]==fgudangOffs[i][randomRoute1]){
            let found=false;
            let idxr=0;
            // console.log(this.deepCopy(parent2[a]));
            while(idxr<parent2[a].length){
              if(listRoute1.includes(parent2[a][idxr]['index'])){
                // console.log(idxr+"_"+parent2[a].length);
                // console.log(a);
                // console.log(parent2[a][idxr]);
                subpar2[a]-=parent2[a][idxr]['load'];
                
                parent2[a].splice(idxr,1);
                if(datflag2[a]){
                  let changeFlag=false;
                  let c=0;
                  while(changeFlag&&c<parent2[a].length){
                    changeFlag=this.isDataranTinggi(parent2[a][c]['desa'],parent2[a][c]['kecamatan']);
                    c++;
                  }
                  datflag2[a]=changeFlag;
                }
                
              }else{
                idxr++;
              }

              
            }
            
            if(subpar2[a]==0){
                parent2.splice(a,1);
                  subpar2.splice(a,1);
                  fgud2.splice(a,1);
                  datflag2.splice(a,1);
                  a--;
                }
                
          }
        }
        // console.log(parent2);
        // console.log(subpar2);
        // console.log(fgud2);
        // console.log(datflag2);
        
          // console.log('c1');
            //masukkan cust ke sub route
            for(let a=0;a<listRoute2.length;a++){ //loop sebanyak cust
              // console.log(listRoute2[a]);
              let sum=rastra[listRoute2[a]]['colli'];
              if(!this.isDataranTinggi(rastra[listRoute2[a]]['desa'], rastra[listRoute2[a]]['kecamatan'])){

              // console.log(sum);
              //generate feasible flag insertion for every sub-route
              let feaInsert1=[];
                //parent 1
                
                  for(let b=0; b<parent1.length;b++){
                    if(fgud1[b]==fgudangPar[randomParent][randomRoute2]){
                      if(subpar1[b]<this.vCap && !datflag1[b]){
                          feaInsert1.push(b);
                      }
                    }
                  }
              
                // console.log(feaInsert1);
              while(sum>0){ //loop sampai cust terassign semua colli nya
                for(let b=0;b<feaInsert1.length;b++){ //loop sebanyak feasible insertion
                  //check diaasign ke yang mana berdasarkan jarak terkecil
                  let idx=this.checkLeastDist(listRoute2[a],this.deepCopy(parent1[feaInsert1[b]]),fgudangPar[randomParent][randomRoute2]);
                  
                  // console.log(feaInsert1[b]);
                  // console.log(parent1[feaInsert1[b]]);
                  let r=[];
                   r["index"]=rastra[listRoute2[a]]['$key'];
                   r["desa"]=rastra[listRoute2[a]]['desa'];
                   r["kecamatan"]=rastra[listRoute2[a]]['kecamatan'];
                   r["kab"]=rastra[listRoute2[a]]['kabupaten'];
                   if(sum>0){
                   if(this.vCap-subpar1[feaInsert1[b]]<=sum){
                   r["load"]=this.vCap-subpar1[feaInsert1[b]];
                   sum-=(this.vCap-subpar1[feaInsert1[b]]);
                   parent1[feaInsert1[b]].splice(idx,0,r);
                   subpar1[feaInsert1[b]]=this.vCap;
                   feaInsert1.splice(b,1);
                   b--;
                   

                  }
                  else{
                    r["load"]=sum;
                    subpar1[feaInsert1[b]]+=sum;
                    sum-=sum;
                    parent1[feaInsert1[b]].splice(idx,0,r);
                  }
                  //  console.log(r);
                   }
                }//end for

                let feaInsertDating1=[];
                //parent 1

                
                  for(let b=0; b<parent1.length;b++){
                    if(fgud1[b]==fgudangPar[randomParent][randomRoute2]){
                      if(subpar1[b]<this.vCap && datflag1[b]){
                          feaInsertDating1.push(b);
                      }
                    }
                  }
                  for(let b=0;b<feaInsertDating1.length;b++){ //loop sebanyak feasible insertion
                  //check diaasign ke yang mana berdasarkan jarak terkecil
                  let idx=0;
                  
                  // console.log(feaInsertDating1[b]);
                  // console.log(parent1[feaInsertDating1[b]]);
                  let r=[];
                   r["index"]=rastra[listRoute2[a]]['$key'];
                   r["desa"]=rastra[listRoute2[a]]['desa'];
                   r["kecamatan"]=rastra[listRoute2[a]]['kecamatan'];
                   r["kab"]=rastra[listRoute2[a]]['kabupaten'];
                   if(sum>0){
                   if(this.vCap-subpar1[feaInsertDating1[b]]<=sum){
                   r["load"]=this.vCap-subpar1[feaInsertDating1[b]];
                   sum-=(this.vCap-subpar1[feaInsertDating1[b]]);
                   parent1[feaInsertDating1[b]].splice(idx,0,r);
                   subpar1[feaInsertDating1[b]]=this.vCap;
                   feaInsertDating1.splice(b,1);
                   b--;
                   

                  }
                  else{
                    r["load"]=sum;
                    subpar1[feaInsertDating1[b]]+=sum;
                    sum-=sum;
                    parent1[feaInsertDating1[b]].splice(idx,0,r);
                  }
                  //  console.log(r);
                   }
                }//end for


                  if(sum>0){
                    let r=[];
                   r["index"]=rastra[listRoute2[a]]['$key'];
                   r["desa"]=rastra[listRoute2[a]]['desa'];
                   r["kecamatan"]=rastra[listRoute2[a]]['kecamatan'];
                   r["kab"]=rastra[listRoute2[a]]['kabupaten'];
                   if(this.vCap<=sum){
                   r["load"]=this.vCap;
                   sum-=this.vCap;
                   parent1.push([]);
                   parent1[parent1.length-1].push(r);
                   subpar1.push(this.vCap);
                   datflag1.push(false);
                   fgud1.push(fgudangPar[randomParent][randomRoute2]);

                  }
                  else{
                    r["load"]=sum;
                    parent1.push([]);
                   parent1[parent1.length-1].push(r);
                    subpar1.push(sum);
                    datflag1.push(false);
                   fgud1.push(fgudangPar[randomParent][randomRoute2]);
                   sum-=sum;
                  }
                  // console.log(r);
                  
                }            
              }
             
            }
            else{
              console.log('dating1');
               // console.log(sum);
              let feaInsert1=[];
                //parent 1
                
                  for(let b=0; b<parent1.length;b++){
                    if(fgud1[b]==fgudangPar[randomParent][randomRoute2]){
                      if(subpar1[b]<this.vCap && !datflag1[b]){
                          feaInsert1.push(b);
                      }
                    }
                  }
              
                // console.log(feaInsert1);
              while(sum>0){ //loop sampai cust terassign semua colli nya
                for(let b=0;b<feaInsert1.length;b++){ //loop sebanyak feasible insertion
                  //check diaasign ke yang mana berdasarkan jarak terkecil
                  let idx=parent1[feaInsert1[b]].length;
                  
                  // console.log(feaInsert1[b]);
                  // console.log(parent1[feaInsert1[b]]);
                  let r=[];
                   r["index"]=rastra[listRoute2[a]]['$key'];
                   r["desa"]=rastra[listRoute2[a]]['desa'];
                   r["kecamatan"]=rastra[listRoute2[a]]['kecamatan'];
                   r["kab"]=rastra[listRoute2[a]]['kabupaten'];
                   if(sum>0){
                   if(this.vCap-subpar1[feaInsert1[b]]<=sum){
                     if(this.vCap-subpar1[feaInsert1[b]]<this.vDating){
                      r["load"]=this.vCap-subpar1[feaInsert1[b]];
                      sum-=(this.vCap-subpar1[feaInsert1[b]]);
                      subpar1[feaInsert1[b]]+=this.vCap-subpar1[feaInsert1[b]];
                     }
                     else{
                       r["load"]=this.vDating;
                       sum-=(this.vDating);
                       subpar1[feaInsert1[b]]+=this.vDating;
                     }
                   
                   parent1[feaInsert1[b]].splice(idx,0,r);
                   datflag1[feaInsert1[b]]=true;
                   feaInsert1.splice(b,1);
                   b--;
                   

                  }
                  else{
                    r["load"]=sum;
                    subpar1[feaInsert1[b]]+=sum;
                    sum-=sum;
                    datflag1[feaInsert1[b]]=true;
                    parent1[feaInsert1[b]].splice(idx,0,r);
                  }
                  //  console.log(r);
                   }
                  
                  
                   

                }//end for
                  if(sum>0){
                    let r=[];
                   r["index"]=rastra[listRoute2[a]]['$key'];
                   r["desa"]=rastra[listRoute2[a]]['desa'];
                   r["kecamatan"]=rastra[listRoute2[a]]['kecamatan'];
                   r["kab"]=rastra[listRoute2[a]]['kabupaten'];
                   if(this.vDating<=sum){
                   r["load"]=this.vDating;
                   sum-=this.vDating;
                   parent1.push([]);
                   parent1[parent1.length-1].push(r);
                   subpar1.push(this.vDating);
                   datflag1.push(true);
                   fgud1.push(fgudangPar[randomParent][randomRoute2]);

                  }
                  else{
                    r["load"]=sum;
                    parent1.push([]);
                   parent1[parent1.length-1].push(r);
                    subpar1.push(sum);
                    datflag1.push(true);
                   fgud1.push(fgudangPar[randomParent][randomRoute2]);
                   sum-=sum;
                  }
                  // console.log(r);
                  
                }            
              }
            }
            }
          
        
// console.log('c2');
        //masukkan cust ke sub route for child 2
            for(let a=0;a<listRoute1.length;a++){ //loop sebanyak cust
              let sum=rastra[listRoute1[a]]['colli'];
              if(!this.isDataranTinggi(rastra[listRoute1[a]]['desa'], rastra[listRoute1[a]]['kecamatan'])){

              // console.log(sum);
              //generate feasible flag insertion for every sub-route
                
                let feaInsert2=[];
                //parent 2
                
                  for(let b=0; b<parent2.length;b++){
                    if(fgud2[b]==fgudangOffs[i][randomRoute1]){
                      if(subpar2[b]<this.vCap && !datflag2[b]){
                          feaInsert2.push(b);
                      }
                    }
                  }
                  // console.log(feaInsert2);
              while(sum>0){ //loop sampai cust terassign semua colli nya
                for(let b=0;b<feaInsert2.length;b++){ //loop sebanyak feasible insertion
                  //check diaasign ke yang mana berdasarkan jarak terkecil
                  let idx=this.checkLeastDist(listRoute1[a],this.deepCopy(parent2[feaInsert2[b]]),fgudangPar[randomParent][randomRoute1]);
                  
                  // console.log(feaInsert2[b]);
                  // console.log(parent1[feaInsert1[b]]);
                  let r=[];
                   r["index"]=rastra[listRoute1[a]]['$key'];
                   r["desa"]=rastra[listRoute1[a]]['desa'];
                   r["kecamatan"]=rastra[listRoute1[a]]['kecamatan'];
                   r["kab"]=rastra[listRoute1[a]]['kabupaten'];
                   if(sum>0){
                   if(this.vCap-subpar2[feaInsert2[b]]<=sum){
                   r["load"]=this.vCap-subpar2[feaInsert2[b]];
                   sum-=(this.vCap-subpar2[feaInsert2[b]]);
                   parent2[feaInsert2[b]].splice(idx,0,r);
                   subpar2[feaInsert2[b]]=this.vCap;
                   feaInsert2.splice(b,1);
                   b--;
                   

                  }
                  else{
                    r["load"]=sum;
                    subpar2[feaInsert2[b]]+=sum;
                    sum-=sum;
                    parent2[feaInsert2[b]].splice(idx,0,r);
                  }
                  //  console.log(r);
                   }
                  
                  
                   

                }//end for

              let feaInsertDating2=[];
                //parent 1

                
                  for(let b=0; b<parent2.length;b++){
                    if(fgud2[b]==fgudangOffs[i][randomRoute1]){
                      if(subpar2[b]<this.vCap && datflag2[b]){
                          feaInsertDating2.push(b);
                      }
                    }
                  }
                  
                  // console.log(feaInsertDating2);
                  // console.log(datflag2);
                  // console.log(subpar2);
                  for(let b=0;b<feaInsertDating2.length;b++){ //loop sebanyak feasible insertion
                  //check diaasign ke yang mana berdasarkan jarak terkecil
                  let idx=0;
                  
                  // console.log(feaInsertDating2[b]);
                  // console.log(parent2[feaInsertDating2[b]]);
                  let r=[];
                   r["index"]=rastra[listRoute1[a]]['$key'];
                   r["desa"]=rastra[listRoute1[a]]['desa'];
                   r["kecamatan"]=rastra[listRoute1[a]]['kecamatan'];
                   r["kab"]=rastra[listRoute1[a]]['kabupaten'];
                   if(sum>0){
                   if(this.vCap-subpar2[feaInsertDating2[b]]<=sum){
                   r["load"]=this.vCap-subpar2[feaInsertDating2[b]];
                   sum-=(this.vCap-subpar2[feaInsertDating2[b]]);
                   parent2[feaInsertDating2[b]].splice(idx,0,r);
                   subpar2[feaInsertDating2[b]]=this.vCap;
                   feaInsertDating2.splice(b,1);
                   b--;
                   

                  }
                  else{
                    r["load"]=sum;
                    subpar2[feaInsertDating2[b]]+=sum;
                    sum-=sum;
                    parent2[feaInsertDating2[b]].splice(idx,0,r);
                  }
                  //  console.log(r);
                   }
                }//end for

                  if(sum>0){
                    let r=[];
                   r["index"]=rastra[listRoute1[a]]['$key'];
                   r["desa"]=rastra[listRoute1[a]]['desa'];
                   r["kecamatan"]=rastra[listRoute1[a]]['kecamatan'];
                   r["kab"]=rastra[listRoute1[a]]['kabupaten'];
                   if(this.vCap<=sum){
                   r["load"]=this.vCap;
                   sum-=this.vCap;
                   parent2.push([]);
                   parent2[parent2.length-1].push(r);
                   subpar2.push(this.vCap);
                   datflag2.push(false);
                   fgud2.push(fgudangOffs[i][randomRoute1]);

                  }
                  else{
                    r["load"]=sum;
                    parent2.push([]);
                   parent2[parent2.length-1].push(r);
                    subpar2.push(sum);
                    datflag2.push(false);
                   fgud2.push(fgudangOffs[i][randomRoute1]);
                   sum-=sum;
                  }
                  // console.log(r);
                  
                }            
              }
             
            }
            else{
              console.log('dating2');
               // console.log(sum);
              let feaInsert2=[];
                //parent 2
                
                  for(let b=0; b<parent2.length;b++){
                    if(fgud2[b]==fgudangOffs[i][randomRoute1]){
                      if(subpar2[b]<this.vCap && !datflag2[b]){
                          feaInsert2.push(b);
                      }
                    }
                  }
              
                // console.log(feaInsert2);
              while(sum>0){ //loop sampai cust terassign semua colli nya
                for(let b=0;b<feaInsert2.length;b++){ //loop sebanyak feasible insertion
                  //check diaasign ke yang mana berdasarkan jarak terkecil
                  let idx=parent1[feaInsert2[b]].length;
                  
                  // console.log(feaInsert2[b]);
                  // console.log(parent1[feaInsert1[b]]);
                  let r=[];
                   r["index"]=rastra[listRoute1[a]]['$key'];
                   r["desa"]=rastra[listRoute1[a]]['desa'];
                   r["kecamatan"]=rastra[listRoute1[a]]['kecamatan'];
                   r["kab"]=rastra[listRoute1[a]]['kabupaten'];
                   if(sum>0){
                   if(this.vCap-subpar2[feaInsert2[b]]<=sum){
                     if(this.vCap-subpar2[feaInsert2[b]]<this.vDating){
                      r["load"]=this.vCap-subpar2[feaInsert2[b]];
                      sum-=(this.vCap-subpar2[feaInsert2[b]]);
                      subpar2[feaInsert2[b]]+=this.vCap-subpar2[feaInsert2[b]];
                     }
                     else{
                       r["load"]=this.vDating;
                       sum-=(this.vDating);
                       subpar2[feaInsert2[b]]+=this.vDating;
                     }
                   
                   parent2[feaInsert2[b]].splice(idx,0,r);
                   datflag2[feaInsert2[b]]=true;
                   feaInsert2.splice(b,1);
                   b--;
                   

                  }
                  else{
                    r["load"]=sum;
                    subpar2[feaInsert2[b]]+=sum;
                    sum-=sum;
                    datflag2[feaInsert2[b]]=true;
                    parent2[feaInsert2[b]].splice(idx,0,r);
                  }
                  //  console.log(r);
                   }
                  
                  
                   

                }//end for
                  if(sum>0){
                    let r=[];
                   r["index"]=rastra[listRoute1[a]]['$key'];
                   r["desa"]=rastra[listRoute1[a]]['desa'];
                   r["kecamatan"]=rastra[listRoute1[a]]['kecamatan'];
                   r["kab"]=rastra[listRoute1[a]]['kabupaten'];
                   if(this.vDating<=sum){
                   r["load"]=this.vDating;
                   sum-=this.vDating;
                   parent2.push([]);
                   parent2[parent2.length-1].push(r);
                   subpar2.push(this.vDating);
                   datflag2.push(true);
                   fgud2.push(fgudangOffs[i][randomRoute1]);

                  }
                  else{
                    r["load"]=sum;
                    parent2.push([]);
                   parent2[parent2.length-1].push(r);
                    subpar2.push(sum);
                    datflag2.push(true);
                   fgud2.push(fgudangOffs[i][randomRoute1]);
                   sum-=sum;
                  }
                  // console.log(r);
                  
                }            
              }
            }
          }
          // console.log(this.deepCopy(fgud1));

          // console.log(this.deepCopy(fgud2));
          let indv1=this.calDistance(this.deepCopy(parent1),this.deepCopy(fgud1));
          let indv2=this.calDistance(this.deepCopy(parent2),this.deepCopy(fgud2));
          // console.log(orInd1);
          // console.log(orInd2);
          // console.log(indv1);
          // console.log(indv2);
          if(indv1>orInd1 && indv2>orInd1 && orInd1<=orInd2){
            // console.log('orpar1');
            newOffs.push(this.deepCopy(offs[i]));
            newGud.push(this.deepCopy(fgudangOffs[i]));
            newsub.push(this.deepCopy(subcollioffs[i]));
            newdatFlag.push(this.deepCopy(datOffs[i]));
          }
          else if(indv1>orInd2 && indv2>orInd2 && orInd1>orInd2){
            // console.log('orpar2');
            newOffs.push(this.deepCopy(parent[randomParent]));
            newGud.push(this.deepCopy(fgudangPar[randomParent]));
            newsub.push(this.deepCopy(subcollipar[randomParent]));
            newdatFlag.push(this.deepCopy(datPar[randomParent]));
          }
          else
           if(indv1<indv2){
            // console.log('par1');
            newOffs.push(this.deepCopy(parent1));
            newGud.push(this.deepCopy(fgud1));
            newsub.push(this.deepCopy(subpar1));
            newdatFlag.push(this.deepCopy(datflag1));
          }
          else {
            // console.log('par2');
            newOffs.push(this.deepCopy(parent2));
            newGud.push(this.deepCopy(fgud2));
            newsub.push(this.deepCopy(subpar2));
            newdatFlag.push(this.deepCopy(datflag2));
          }
          
          
          }
          else{
            // console.log('original');
            newOffs.push(this.deepCopy(offs[i]));
            newGud.push(this.deepCopy(fgudangOffs[i]));
            newsub.push(this.deepCopy(subcollioffs[i]));
            newdatFlag.push(this.deepCopy(datOffs[i]));
          }
          // console.log(this.calDistance(this.deepCopy(newOffs[i]),this.deepCopy(newGud[i])));
          // console.log('tot_'+this.cekSum(newsub[i]));
            
    i++;
  }
  // console.log(newOffs);
  // console.log(newGud);
  // console.log(newsub);
  // console.log(newdatFlag);
  // console.log([newOffs, newGud, newdatFlag]);
 return [newOffs, newGud, newsub, newdatFlag];
  
  

}
 checkLeastDist(cust:number, arrCust:any[][], gudf:number){
    let subrute=[];
    for(let a=0;a<arrCust.length;a++){
      subrute.push(arrCust[a]['index']);
    }
    let list=this.deepCopy(subrute);
    list.splice(0,0,cust);
    let minJarak=0;
    let selectedIdx=0;
    if(list[0]==undefined){
      console.log(gudf);
      console.log(list[0]);
    }
    
    minJarak+=Number(this.distance[gudf][list[0]+7]) //jarak depot-customer
    
    minJarak+=Number(this.distance[list[list.length-1]+7][gudf]) //jarak customer-depot
    let k=0;
    while(k<list.length-1){//loop sebanyak desa dalam sub route
      minJarak+=Number(this.distance[list[k]+7][list[k+1]+7]) //jarak customer-customer
      k++;
    }
    for(let b=1;b<=arrCust.length+1;b++){
      list=this.deepCopy(subrute);
      list.splice(b,0,cust);
      let jarak=0;
        jarak+=Number(this.distance[gudf][list[0]+7]) //jarak depot-customer
        
        jarak+=Number(this.distance[list[list.length-1]+7][gudf]) //jarak customer-depot
        let k=0;
        while(k<list.length-1){//loop sebanyak desa dalam sub route
          jarak+=Number(this.distance[list[k]+7][list[k+1]+7]) //jarak customer-customer
          k++;
        }
        if(minJarak>jarak){
          selectedIdx=k;
          minJarak=jarak;
        }
    }
    return selectedIdx;
    
  }
  cekSum(ind: any[]){
    let sum=0;
    for(let i=0;i<ind.length;i++){
      sum+=ind[i];
    }
    return sum;
  }
  calDistance(ind1: any[][][], fgud1: any[]){
    let j=0;
  let jarak_route=0;
  while(j<ind1.length){//loop sebanyak sub route
    let k=0;
    let jarak_subroute=0;
    jarak_subroute+=Number(this.distance[fgud1[j]][ind1[j][k]["index"]+7]) //jarak depot-customer
    
    // console.log([route[i][j].length-1]);
    
    // console.log(route[i][j][route[i][j].length-1]["index"]+7);
    // console.log(f_gudang[i][j]);
    jarak_subroute+=Number(this.distance[ind1[j][ind1[j].length-1]["index"]+7][fgud1[j]]) //jarak customer-depot
    while(k<ind1[j].length-1){//loop sebanyak desa dalam sub route
      jarak_subroute+=Number(this.distance[ind1[j][k]["index"]+7][ind1[j][k+1]["index"]+7]) //jarak depot-customer
      k++;
    }
    jarak_route+=jarak_subroute;
    j++;
  }
  return jarak_route;
}
mutation(offs: any[][][], fgudang: any[][], subcol: any[][], datFlag:any[][]){
  
  for(let i=0;i<offs.length;i++){
      var randNum = Math.random();
      // let ranMut=[0.8420177079802431, 0.09089368637028095, 0.6700244426744686, 0.2203473916288734, 0.3545417872432999 ];
      // randNum=ranMut[i];
      // console.log(randNum);
      if(randNum<this.prob_mutation){
        // console.log('Mutation');
        // console.log(this.deepCopy(offs[i]));
        // console.log(this.deepCopy(subcol[i]));
        // console.log('disb_'+this.calDistance(this.deepCopy(offs[i]),this.deepCopy(fgudang[i])));


        //memilih depot yang dilakukanmutasi secara random
        var randomDepot = Math.floor(Math.random() * fgudang[i].length);
        // randomDepot=5;
        // console.log(randomDepot);

        //masukkan route non dating pada depot yang sama ke dalam array x
        let gudangRnd=fgudang[i][randomDepot];
        let selRoute=[];
        for(let a=0; a<offs[i].length;a++){
          if(fgudang[i][a]==gudangRnd && !datFlag[i][a]){
            selRoute.push(a);
          }
        }
        // console.log(selRoute);
        //pilih dua cut point dr array tersebut
        var cut2 = Math.floor(Math.random() * selRoute.length);
        var cut1 = Math.floor(Math.random() * cut2);
        // cut1=1;
        // cut2=3;
        if(cut1!=cut2){
          // console.log(cut1);
          // console.log(cut2);
           let cutInside1=Math.floor(Math.random() * offs[i][selRoute[cut1]].length);
           let cutInside2=Math.floor(Math.random() * offs[i][selRoute[cut2]].length);
          //hapus rute yang terpilih dr individu.
          // cutInside1=0;
          // cutInside2=0;
          // console.log(cutInside1);
          // console.log(cutInside2);
          let custHead=[];
          let custPop=[];
          let custTail=[];
          let s=0;
          for(let b=0;b<selRoute.length;b++){
            if(b>=cut1 && b<=cut2){
             
              for(let c=0;c<offs[i][selRoute[b]].length;c++){
                s+=offs[i][selRoute[b]][c]['load'];
                if(b==cut1 && c<=cutInside1){
                  custHead.push(this.deepCopy(offs[i][selRoute[b]][c]));
                  
              
                }
                else 
                if(b==cut2 && c>=cutInside2){
                  custTail.push(this.deepCopy(offs[i][selRoute[b]][c]));
                  
                   
                }
                else
                {
                  custPop.push(this.deepCopy(offs[i][selRoute[b]][c]));
                  
                }
              
              
              }
              
              offs[i][selRoute[b]]=[];
              
            }
          }
        //   console.log(s);
        //  console.log(this.deepCopy(offs[i]));
          for(let b=0;b<offs[i].length;b++){
                        
              if(offs[i][b].length==0 ){
              offs[i].splice(b,1);
              fgudang[i].splice(b,1);
              subcol[i].splice(b,1);
              datFlag[i].splice(b,1);
              b--;
            }
            
            
            
            
            
          }
          // console.log(this.deepCopy(custHead));
          // console.log(this.deepCopy(custPop));
          // console.log(this.deepCopy(custTail));
          // console.log(this.deepCopy(offs[i]));
          

          // //lakukan inversion 
          let inver=[];
          let subInver=[];
          let idx=0;
          //assign head first
          inver[idx]=[];
          subInver[idx]=0;
          for(let a=0;a<custHead.length;a++){
            inver[idx].push(this.deepCopy(custHead[a]));
            subInver[idx]+=custHead[a]['load'];
          }
          if(subInver[idx]==this.vCap){
            idx++;
            inver[idx]=[];
            subInver[idx]=0;
          }
          //assign reversal cust
          for(let a=custPop.length-1;a>=0;a--){
           
            if(this.vCap-subInver[idx]>=custPop[a]['load']){
              inver[idx].push(this.deepCopy(custPop[a]));
              subInver[idx]+=custPop[a]['load'];
              custPop.splice(a,1);
            }
            else {
              let sisa=custPop[a]['load']-(this.vCap-subInver[idx]);
              custPop[a]['load']-=sisa;
              inver[idx].push(this.deepCopy(custPop[a]));
              subInver[idx]+=custPop[a]['load'];
              custPop[a]['load']=sisa;
              a++;
            }
            
            if(subInver[idx]==this.vCap){
            idx++;
            inver[idx]=[];
            subInver[idx]=0;
            }
          }
          //assign custTail
           for(let a=0;a<custTail.length;a++){

            if(this.vCap-subInver[idx]>=custTail[a]['load']){
              inver[idx].push(this.deepCopy(custTail[a]));
              subInver[idx]+=custTail[a]['load'];
              custTail.splice(a,1);
              a--;
            }
            else{
              let sisa=custTail[a]['load']-(this.vCap-subInver[idx]);
              custTail[a]['load']-=sisa;
              inver[idx].push(this.deepCopy(custTail[a]));
              subInver[idx]+=custTail[a]['load'];
              custTail[a]['load']=sisa;
              a--;
            }
            
            if(subInver[idx]==this.vCap&&custTail.length>0){
            idx++;
            inver[idx]=[];
            subInver[idx]=0;
            }
          }
          // console.log(inver);
          // console.log(subInver);
          // assign to the offs
          for(let a=0; a<inver.length;a++){
            offs[i].push(inver[a]);
            fgudang[i].push(gudangRnd);
            subcol[i].push(subInver[a]);
            datFlag[i].push(false);
          }
          // console.log(this.deepCopy(offs[i]));
          // repairing same desa
          for(let a=0; a<offs[i].length;a++){
            for(let b=0; b<offs[i][a].length;b++){
              //cari yang sama
             
              let c=b+1;
              while(c<offs[i][a].length){
                if(offs[i][a][b]['index']==offs[i][a][c]['index']){
                  offs[i][a][b]['load']+=offs[i][a][c]['load'];
                  offs[i][a].splice(c,1);
                  c--;
                }
                c++;
              }
            }
          }
          // console.log(this.deepCopy(offs[i]));
          // console.log(this.deepCopy(fgudang[i]));
          //  console.log('dis_'+this.calDistance(offs[i],fgudang[i]));
          // console.log(this.cekSum(subcol[i]));
          // console.log(this.cekSubCol(offs[i],subcol[i]));
         
        
        
      }
      }
  }
  // console.log([offs, fgudang, datFlag]);
  return [offs, fgudang, subcol, datFlag];

}
cekSubCol(indv: any[][][], subcol: number[]){
  let bol=true;
  for(let a=0; a<indv.length;a++){
    let sub=0;
    for(let b=0; b<indv[a].length;b++){
      sub+=indv[a][b]['load'];
    }
    if(sub!=subcol[a]){
      bol=false;
      console.log(indv[a]);
      console.log(a+'_invalid');
    }
  }
  return bol;

}

}
