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
GA(numberPop:number, numberGen: number, Pc:number, Pm: number){
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
    console.log(this.gudang.length);
    console.log(this.gudang);
   
    
    
    return this.InitializeDataran();

  })
  .then(res =>{
     if(res)
   return this.groupingCust( this.deepCopy(this.rastra));
    
    
  })
  .then(res =>{
     if(!res){
      this.AssignSingleCust();
    console.log(this.deepCopy(this.rastraGroup));
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
      
    return this.scheduling(this.deepCopy(this.populasi),this.deepCopy(this.info_dating), this.deepCopy(this.fromG));
     }
     else{
      console.log('Tidak Cukup');
     }
  })
  .then(res =>{
     if(res){
      this.populasi=this.deepCopy(res);
      console.log(this.deepCopy(this.populasi));
     let jarak=this.evaluasiClark();
     console.log(jarak);
      let y=this.calculateFitness(this.deepCopy(jarak));
      let sel=this.selection(this.deepCopy(this.populasi),this.deepCopy(y),this.deepCopy(this.fromG),this.deepCopy(this.info_Col), this.deepCopy(this.info_dating) );
      console.log(sel);
      this.crossover(this.deepCopy(sel[0]), this.deepCopy(sel[1]), this.deepCopy(this.populasi),  this.deepCopy(sel[2]), this.deepCopy(this.fromG), this.deepCopy(sel[3]), this.deepCopy(this.info_Col), this.deepCopy(sel[4]), this.deepCopy(this.info_dating) );
     }
   return true;
    
    
  })
  });
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
  let dist=this.deepCopy(this.distance);
  let gdg = this.deepCopy(this.gudang);
  let i=0;
  let notfound =false;
  let sum=0;

  while( i<ras.length&&!notfound){
     let assign =false;
    let x=dist[i+7].slice(0,7);
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
for(let i=0; i<gdg.length;i++){
   console.log(Math.floor((gdg[i]['stok']*1000/15)));
}
console.log(notfound);
console.log(sum);
console.log(ras);
if(!notfound){
  return resolve(false);//jika  cukup maka false
  }
  else
  return resolve(true);//jika tidak cukup maka true
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
        if(y["colli"]!=0){
        this.sum_colli+=y["colli"];
        y["$key"]=i;
        this.rastra.push(y as Rastra);
        
        i++;
        }
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
                    vdat[i]=this.vDating-rasgrup[c].colli;
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
console.log(kromosom);
console.log(fgd);
console.log(colli_on_Subroute);
console.log(datFlag);

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
      if(!datFlag[i][j]&&population[i][j].length>1){
        
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
        }
         newSubrute.push(this.deepCopy(subRute[0])); 
      }
     else{
       newSubrute.push(this.deepCopy(subRute[0]));
     }
     
        
        }
        if(newSubrute.length>0)
     pol[i].push(this.deepCopy(newSubrute));
     else
     pol[i].push(this.deepCopy(population[i][j]));
        
    }
  }
  return resolve(pol);
  });
}

evaluasiClark(){
let evl :number[]=[];

  let i=0;
let sumJarak=0;
while(i<this.populasi.length){//loop sebanyak populasi
  let j=0;
  let jarak_route=0;
  while(j<this.populasi[i].length){//loop sebanyak sub route
    let k=0;
    let jarak_subroute=0;
    jarak_subroute+=Number(this.distance[this.fromG[i][j]][this.populasi[i][j][k]["index"]+7]) //jarak depot-customer
    
    // console.log([route[i][j].length-1]);
    
    // console.log(route[i][j][route[i][j].length-1]["index"]+7);
    // console.log(f_gudang[i][j]);
    jarak_subroute+=Number(this.distance[this.populasi[i][j][this.populasi[i][j].length-1]["index"]+7][this.fromG[i][j]]) //jarak customer-depot
    while(k<this.populasi[i][j].length-1){//loop sebanyak desa dalam sub route
      jarak_subroute+=Number(this.distance[this.populasi[i][j][k]["index"]+7][this.populasi[i][j][k+1]["index"]+7]) //jarak depot-customer
      k++;
    }
    jarak_route+=jarak_subroute;
    j++;
  }
  evl[i]=jarak_route;
  sumJarak+=jarak_route;
  i++;
}
evl[this.populasi.length]=sumJarak; 
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
  
  //menghitung kumulatif fitness
  while(i<fitness.length){
    x+=fitness[i];
    cumulative[i]=x;
    i++;
  }
  let j=0;
  //menghitung probability 
  while(j<cumulative.length){
    pcumulative[j]=cumulative[j]/cumulative[cumulative.length-1];
    j++;
  }
  //select candidate
  let choosed:number[]=[];
  let k=0;
  while(k<pcumulative.length){
    let rnd=Math.random(); //generate angka random [0,1)
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

  return [offs,choosed,f_gudang, infoCol, infoDat];

}

//crossover

crossover(offs : any[][][][], choosed :number[], parent: any[][][][], fgudangOffs: any[][], fgudangPar:any[][], subcollioffs : any[][], subcollipar: any [][], datOffs: any[][], datPar: any[][]){
  let i=0;
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
       console.log(choosed[i]+"_"+randomParent);

       let randomRoute1 = Math.floor(Math.random() * offs[i].length);
       let randomRoute2 = Math.floor(Math.random() * parent[randomParent].length);
        console.log("Route: "+randomRoute1+"_"+randomRoute2);
        console.log(offs[i][randomRoute1]);
        console.log(parent[randomParent][randomRoute2]);
        //menampung index desa untuk proses removing
        let listRoute1=[];
        for(let a=0; a<offs[i][randomRoute1].length;a++){
          listRoute1.push(offs[i][randomRoute1][a]['index']);
        }
        let listRoute2=[];
        for(let a=0; a<parent[randomParent][randomRoute2].length;a++){
          listRoute2.push(parent[randomParent][randomRoute2][a]['index']);
        }
        console.log(listRoute1);
        console.log(listRoute2);
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
        console.log(this.deepCopy(offs[i]));
        console.log(this.deepCopy(subcollioffs[i]));
        console.log(this.deepCopy(fgudangOffs[i]));
        console.log(this.deepCopy(datOffs[i]));
        //menghapus desa di parent 1
        for(let a=0; a<parent1.length;a++){
          if(fgud1[a]==fgud2[randomRoute2]){
            let found=false;
            let idxr=0;
            while(idxr<parent1[a].length){
              if(listRoute2.includes(parent1[a][idxr]['index'])){
                console.log(idxr+"_"+parent1[a].length);
                console.log(a);
                console.log(parent1[a][idxr]);
                subpar1[a]-=parent1[a][idxr]['load'];
                
                parent1[a].splice(idxr,1);
                idxr--;
                
              }

              idxr++;
            }
            if(parent1[a].length==0){
                  parent1.splice(a,1);
                }
            if(subpar1[a]==0){
                  subpar1.splice(a,1);
                  fgud1.splice(a,1);
                  datflag1.splice(a,1);
                }
          }
        }
        console.log(parent1);
        console.log(subpar1);
        console.log(fgud1);
        console.log(datflag1);
        console.log('Parent 2')
        console.log(this.deepCopy(parent[randomParent]));
        console.log(this.deepCopy(subcollipar[randomParent]));
        console.log(this.deepCopy(fgudangPar[randomParent]));
        console.log(this.deepCopy(datPar[randomParent]));
        //menghapus desa di parent 1
        for(let a=0; a<parent2.length;a++){
          if(fgud2[a]==fgudangOffs[i][randomRoute1]){
            let found=false;
            let idxr=0;
            while(idxr<parent2[a].length){
              if(listRoute1.includes(parent2[a][idxr]['index'])){
                console.log(idxr+"_"+parent2[a].length);
                console.log(a);
                console.log(parent2[a][idxr]);
                subpar2[a]-=parent2[a][idxr]['load'];
                
                parent2[a].splice(idxr,1);
                idxr--;
                
              }

              idxr++;
            }
            if(parent2[a].length==0){
                  parent2.splice(a,1);
                }
            if(subpar2[a]==0){
                  subpar2.splice(a,1);
                  fgud2.splice(a,1);
                  datflag2.splice(a,1);
                }
          }
        }
        console.log(parent2);
        console.log(subpar2);
        console.log(fgud2);
        console.log(datflag2);
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
       
        console.log(feaInsert1);
        let feaInsert2=[];
        //parent 2
        
          for(let b=0; b<parent2.length;b++){
            if(fgud2[b]==fgudangOffs[i][randomRoute1]){
              if(subpar2[b]<this.vCap && !datflag2[b]){
                  feaInsert2.push(b);
              }
            }
          }
          console.log(feaInsert2);
          //generate random number 0-1 untuk mementukan crossover dilakukan
          var randNum = Math.random();
          console.log(randNum);
          if(randNum<this.prob_cross){
            console.log('Crossover occur');
            
          }
        
        

    i++;
  }
  
  

}


}
