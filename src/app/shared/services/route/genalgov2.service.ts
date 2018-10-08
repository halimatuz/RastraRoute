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
    this.groupingCust(this.deepCopy(this.distance), this.deepCopy(this.rastra));
    console.log(this.rastraGroup);
    this.matrixSavings(this.deepCopy(this.rastraGroup),this.deepCopy(this.distance));
    console.log(this.matrixSaving);
    this.getCust(2);
    
    
    return this.InitializeDataran();

  })
  .then(res =>{
     if(res)
      //console.log(this.dataran.length);

    return this.Routing(2);

  })
  .then(res =>{
     if(res)
      //console.log(this.dataran.length);

    return this.generateRoute(numberPop);

  }).then(res =>{
     if(res){
      // console.log(this.route);
      console.log(this.sub_colli);
     return this.generateDepot(this.route.length,this.deepCopy(this.sub_colli));
             
     }
  })
  .then(res =>{
     if(res){
       this.f_gudang=this.deepCopy(res);
      // console.log(this.f_gudang);
      let x=this.evaluasiPopulasi(this.deepCopy(this.route),this.deepCopy(res));
      // console.log(this.deepCopy(x));
      if(this.route.length==numberPop){
      let a=this.minVal(this.deepCopy(x));
      let elite=a[0];
      let eliteidx=a[1];
      let histElite: number []=[];
      let individu:any[][][]=this.deepCopy(this.route[a[1]]);
      //console.log(this.deepCopy(this.route[a[1]]));
      let fgudang : number[]=this.deepCopy(res[a[1]]);
      let idx=0;
      this.numIter=numberGen;
      while(idx<this.numIter){
        console.log("iter : "+idx);
      let y=this.calculateFitness(this.deepCopy(x));
      let sel=this.selection(this.deepCopy(this.route),this.deepCopy(y),this.deepCopy(res));
      // console.log(sel);
      this.prob_cross=Pc;
      let cross=this.crossover(this.deepCopy(sel[0]), this.deepCopy(this.route), this.deepCopy(sel[1]), this.deepCopy(sel[2]));
      // console.log(cross);
      this.prob_mutation=Pm;
      let mut=this.mutation(this.deepCopy(cross[0]));
      // console.log(mut);
      x=this.evaluasiPopulasi(this.deepCopy(mut),this.deepCopy(cross[1]));
      // console.log(this.deepCopy(x));
      let val=this.minVal(this.deepCopy(x));
      histElite[idx]=elite;
      if(elite>val[0]){
        elite=val[0];
        eliteidx=val[1];
        let ind=this.deepCopy(mut);
        individu=ind[a[1]];
        let gud=this.deepCopy(cross[1]);
        fgudang=gud[a[1]];

      }
      
      console.log(elite);
      idx++;
       }
    
    console.log(histElite);
    console.log(individu);
    console.log(fgudang);
    return resolve([histElite,individu, fgudang]);
      }else{
        //action mean gudang no cukup
        console.log("caonnot process : gudang stok tidkan mencukupi");
        return  resolve(false);
      }
    

            
     }
    
  });
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
groupingCust(dist: any[][], ras : Rastra[]){
  
  
  for(let i=0; i<ras.length;i++){
    let x=dist[i+7].slice(0,7);
    let val = x.sort((a,b)=>a-b);
    let idx=dist[i+7].slice(0,7).indexOf(val[0]);
    this.sumGroup[idx]+=ras[i]['colli'];
    this.rastraGroup[idx].push(ras[i]);
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

//mengecek stok gudang
isEnoughStok(subcolli: any[], gdg:any[][]): boolean {
 
  let isEnough= true;
  let x :number[]=[];
  let count : number[]=[];

  // grouping colli
  for(let i=0; i<subcolli.length; i++){ //sebanyak sub route
    let existed=x.indexOf(subcolli[i]); //cek apakah nilai colli pernah ada
    if(existed==-1){ //jika group blum ada
      let l=x.push(subcolli[i]);
      count[l-1]=1;
    }
    else{ // jika telah ada group
      count[existed]+=1;
    }
  }
//  console.log(x);
//  console.log(count); 
 
  //menghitung kecukupan stok
  for(let i=0; i<x.length;i++){
    let j=0;
    while( j<gdg.length&&count[i]>0){
      let jml=Math.floor((gdg[j]['stok']*1000/15)/x[i]); 
      if(jml<=count[i]){
        gdg[j]['stok']-=(jml*x[i]*15/1000);
        count[i]-=jml;
      }
      else{
        gdg[j]['stok']-=(count[i]*x[i]*15/1000);
        count[i]-=count[i];
      }
      j++;
    }
    if(count[i]>0){
      isEnough=false;
      }
  }
  return isEnough;
}
findIdx(gidx:number, key: number){
  let i=0;
  let found=false;
  let idx=-1;
  while(i<this.rastraGroup[gidx].length&&!found){
    if(key=this.rastraGroup[gidx][i]['$key']){
      found=true;
      idx=i;
    }
    i++
  }
  return idx;
}

//Generate Random route
Routing(gidx:number){
 return new Promise((resolve,reject) =>{
   let rute=[];
   let datingFlag=[];
   let vdat=[];
   let vkap=[];
   let colli_in_subroute=[];
   let ras=this.deepCopy(this.rastra);
   let rasgrup=this.deepCopy(this.rastraGroup[gidx]);
   let aslist=this.getCust(gidx);
   let i=0; //index subroute
   let sumC=this.sumGroup[gidx];
   let gdg = this.deepCopy(this.gudang);
   let sub_colli=[];
   let k=0;//index aslist
    while(k<aslist.length&&sumC>0){ //loop hingga kapasitas kendaraan -> menghasilkan 1 sub route
        
            
            let bridge=aslist[k];
              //apakah pernah di route?
              let a=0;
              let ada=false;
              let notpenuh=false;
              let subrute=-1;
              let nmras=-1;
              while(a<rute.length&&!ada){
                for(let b=0; b<rute[a].length;b++){
                  if(bridge[0]==rute[a][b].$key||bridge[1]==rute[a][b].$key){
                    ada=true;
                    if(b=0  && vkap[a]<this.vCap){
                      notpenuh=true;
                      subrute=a;
                      nmras=b;
                      break;
                    }else 
                    if(b!=0 && datingFlag[a]==true && vdat[a]<this.vDating){
                      notpenuh=true;
                      subrute=a;
                      nmras=b;
                      break;
                    }
                  }
                }
              }
              console.log(ada+'_'+notpenuh);

              //jika ada=false maka assign ke rute baru
            if(ada==false){
              rute[i]=[];
              let r=[];
                if(this.isDataranTinggi(ras[bridge[0]].desa,ras[bridge[0]].kecamatan )){//jika dataran tinggi
                datingFlag[i]=true;
                //jika kapasitas muatan dataran tinggi > demand
                
                    if(this.vDating>=ras[bridge[0]].colli){
                      //maka semua demand diantarkan
                    r["index"]=ras[bridge[0]].$key;
                    r["desa"]=ras[bridge[0]].desa;
                    r["kecamatan"]=ras[bridge[0]].kecamatan;
                    r["kab"]=ras[bridge[0]].kabupaten;
                    r["load"]=ras[bridge[0]].colli;
                    vdat[i]=this.vDating-ras[bridge[0]].colli;
                    vkap[i]=this.vCap-ras[bridge[0]].colli;
                    colli_in_subroute[i]=ras[bridge[0]].colli;
                    sumC-=ras[bridge[0]].colli;
                    rasgrup[this.findIdx(gidx,bridge[0])].colli=0;
                  }
                  //jika kapasitas muatan dataran tinggi < demand
                  else{
                    //maka sebagian demand diantarkan
                    r["index"]=ras[bridge[0]].$key;
                    r["desa"]=ras[bridge[0]].desa;
                    r["kecamatan"]=ras[bridge[0]].kecamatan;
                    r["kab"]=ras[bridge[0]].kabupaten;
                    r["load"]=this.vDating;
                    rasgrup[bridge[0]].colli=ras[bridge[0]].colli-this.vDating;
                    vdat[i]=this.vDating-ras[bridge[0]].colli;
                    vkap[i]=this.vCap-ras[bridge[0]].colli;
                    colli_in_subroute[i]+=this.vDating; 
                    sumC-=this.vDating; 
                  }
                }
                //bukan dataran tinggi
                else{
               //jika kapasitas truk > demand
                    if(this.vCap>=ras[bridge[0]].colli){
                      //maka semua demand diantarkan
                    r["index"]=ras[bridge[0]].$key;
                    r["desa"]=ras[bridge[0]].desa;
                    r["kecamatan"]=ras[bridge[0]].kecamatan;
                    r["kab"]=ras[bridge[0]].kabupaten;
                    r["load"]=ras[bridge[0]].colli;
                    vdat[i]=this.vDating;
                    vkap[i]=this.vCap-ras[bridge[0]].colli;
                    colli_in_subroute[i]=ras[bridge[0]].colli;
                    sumC-=ras[bridge[0]].colli;
                    rasgrup[this.findIdx(gidx,bridge[0])].colli=0;
                  }
                  //jika kapasitas truk < demand
                  else{
                    //maka sebagian demand diantarkan
                     r["index"]=ras[bridge[0]].$key;
                    r["desa"]=ras[bridge[0]].desa;
                    r["kecamatan"]=ras[bridge[0]].kecamatan;
                    r["kab"]=ras[bridge[0]].kabupaten;
                    r["load"]=this.vCap;
                    rasgrup[bridge[0]].colli=ras[bridge[0]].colli-this.vCap;
                    vdat[i]=this.vDating;
                    vkap[i]=this.vCap-ras[bridge[0]].colli;
                    colli_in_subroute[i]+=this.vCap; 
                    sumC-=this.vCap;
                  }
            }
            rute[i].push(r);

            //memasukkan bridge kedua 
            r=[];
                if(datingFlag[i] ){//jika dataran tinggi
                  //jika kapasitas truk >= kapasitas muatan dataran tinggi
                if(vkap[i]>=vdat[i]){
                //jika kapasitas muatan dataran tinggi > demand
                    if(vdat[i]>=ras[bridge[1]].colli){
                      //maka semua demand diantarkan
                    r["index"]=ras[bridge[1]].$key;
                    r["desa"]=ras[bridge[1]].desa;
                    r["kecamatan"]=ras[bridge[1]].kecamatan;
                    r["kab"]=ras[bridge[1]].kabupaten;
                    r["load"]=ras[bridge[1]].colli;
                    vdat[i]-=ras[bridge[1]].colli;
                    vkap[i]-=ras[bridge[1]].colli;
                    colli_in_subroute[i]=ras[bridge[1]].colli;
                    sumC-=ras[bridge[1]].colli;
                    rasgrup[this.findIdx(gidx,bridge[1])].colli=1;
                  }
                  //jika kapasitas muatan dataran tinggi < demand
                  else{
                    //maka sebagian demand diantarkan
                    r["index"]=ras[bridge[1]].$key;
                    r["desa"]=ras[bridge[1]].desa;
                    r["kecamatan"]=ras[bridge[1]].kecamatan;
                    r["kab"]=ras[bridge[1]].kabupaten;
                    r["load"]=vdat[i];
                    rasgrup[bridge[1]].colli=ras[bridge[1]].colli-vdat[i];
                    vkap[i]-=ras[bridge[1]].colli;
                    colli_in_subroute[i]+=vdat[i]; 
                    sumC-=vdat[i]; 
                    vdat[i]-=ras[bridge[1]].colli;
                  }
                }
                //jika kapasitas truk < kapasitas muatan dataran tinggi
                else{
                  
                  //jika kapasitas truk > demand
                    if(vkap[i]>=ras[bridge[1]].colli){
                      //maka semua demand diantarkan
                    r["index"]=ras[bridge[1]].$key;
                    r["desa"]=ras[bridge[1]].desa;
                    r["kecamatan"]=ras[bridge[1]].kecamatan;
                    r["kab"]=ras[bridge[1]].kabupaten;
                    r["load"]=ras[bridge[1]].colli;
                    vdat[i]-=ras[bridge[1]].colli;
                    vkap[i]-=ras[bridge[1]].colli;
                    colli_in_subroute[i]=ras[bridge[1]].colli;
                    sumC-=ras[bridge[1]].colli;
                    rasgrup[this.findIdx(gidx,bridge[1])].colli=1;
                  }
                  //jika kapasitas truk < demand
                  else{
                    //maka sebagian demand diantarkan
                    r["index"]=ras[bridge[1]].$key;
                    r["desa"]=ras[bridge[1]].desa;
                    r["kecamatan"]=ras[bridge[1]].kecamatan;
                    r["kab"]=ras[bridge[1]].kabupaten;
                    r["load"]=vkap[i];
                    rasgrup[bridge[1]].colli=ras[bridge[1]].colli-vkap[i];
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
                    if(this.vCap>=ras[bridge[1]].colli){
                      //maka semua demand diantarkan
                    r["index"]=ras[bridge[1]].$key;
                    r["desa"]=ras[bridge[1]].desa;
                    r["kecamatan"]=ras[bridge[1]].kecamatan;
                    r["kab"]=ras[bridge[1]].kabupaten;
                    r["load"]=ras[bridge[1]].colli;
                    vdat[i]=this.vDating;
                    vkap[i]-=ras[bridge[1]].colli;
                    colli_in_subroute[i]=ras[bridge[1]].colli;
                    sumC-=ras[bridge[1]].colli;
                    rasgrup[this.findIdx(gidx,bridge[1])].colli=0;
                  }
                  //jika kapasitas truk < demand
                  else{
                    //maka sebagian demand diantarkan
                     r["index"]=ras[bridge[1]].$key;
                    r["desa"]=ras[bridge[1]].desa;
                    r["kecamatan"]=ras[bridge[1]].kecamatan;
                    r["kab"]=ras[bridge[1]].kabupaten;
                    r["load"]=vkap[i];
                    rasgrup[bridge[1]].colli=ras[bridge[1]].colli-vkap[i];
                    vdat[i]=this.vDating;
                    colli_in_subroute[i]+=vkap[i]; 
                    sumC-=vkap[i];
                    vkap[i]-=ras[bridge[1]].colli;
                  }
            }
            rute[i].push(r);
            

            i++;
          }
          k++;
    }
    console.log(rute);
         
            
     
 return resolve(true);
 });
}


//Generate Random route
generateRoute(numberPopulation : number){
 return new Promise((resolve,reject) =>{
   let idx_populasi=numberPopulation;
   
   let idx=0;
   this.route=[];
    this.sub_colli=[];
    let cukupMax=0;
    let stop=false;
 while(idx<idx_populasi&&!stop){
 this.route[idx]=[];
 let i=0; //index subroute
 let sumC=this.sum_colli;
 let gdg = this.deepCopy(this.gudang);
 let ras=this.deepCopy(this.rastra);
  this.sub_colli[idx]=[];
 while(sumC>0){ // loop hingga semua colli ->menghasilkan 1 solusi=route=beberapa sub route
   this.route[idx][i]=[];
   let v_capacity=this.vCap; //kapasitas vehicle 8 ton =533 colli
   let j=0; //index desa dalam sub route
   let dating=false;
   let v_dating=this.vDating;
   let colli_in_subroute=0;
      while(v_capacity>0 && v_dating>0 && sumC>0){ //loop hingga kapasitas kendaraan -> menghasilkan 1 sub route
            this.route[idx][i][j]=[];
            
            var randomNumber = Math.floor(Math.random() * ras.length);
          
            //cek apakah desa merupakan dataran tinggi
              if(j==0){
                dating=this.isDataranTinggi(ras[randomNumber].desa,ras[randomNumber].kecamatan );
                  
              }
              else{
                if(!dating){
                  dating=this.isDataranTinggi(ras[randomNumber].desa,ras[randomNumber].kecamatan );
                }
              }
            
             
            //jika desa merupakan dataran tinggi
            if(dating){
              
                //jika kapasitas truk >= kapasitas muatan dataran tinggi
                if(v_capacity>=v_dating){
                     //jika kapasitas muatan dataran tinggi > demand
                    if(v_dating>=ras[randomNumber].colli){
                      //maka semua demand diantarkan
                    this.route[idx][i][j]["index"]=ras[randomNumber].$key;
                    this.route[idx][i][j]["desa"]=ras[randomNumber].desa;
                    this.route[idx][i][j]["kecamatan"]=ras[randomNumber].kecamatan;
                    this.route[idx][i][j]["kab"]=ras[randomNumber].kabupaten;
                    this.route[idx][i][j]["load"]=ras[randomNumber].colli;
                    v_capacity-=ras[randomNumber].colli;
                    v_dating-=ras[randomNumber].colli;
                    colli_in_subroute+=ras[randomNumber].colli;
                    sumC-=ras[randomNumber].colli;
                    ras.splice(randomNumber,1);
                  }
                  //jika kapasitas muatan dataran tinggi < demand
                  else{
                    //maka sebagian demand diantarkan
                    this.route[idx][i][j]["index"]=ras[randomNumber].$key;
                    this.route[idx][i][j]["desa"]=ras[randomNumber].desa;
                    this.route[idx][i][j]["kecamatan"]=ras[randomNumber].kecamatan;
                    this.route[idx][i][j]["kab"]=ras[randomNumber].kabupaten;
                    this.route[idx][i][j]["load"]=v_dating;
                    ras[randomNumber].colli=ras[randomNumber].colli-v_dating;
                    v_capacity-=v_dating;
                    colli_in_subroute+=v_dating; 
                    sumC-=v_dating; 
                    v_dating-=v_dating;
                  }
                }
                //jika kapasitas truk < kapasitas muatan dataran tinggi
                else{
                  
                  //jika kapasitas truk > demand
                    if(v_capacity>=ras[randomNumber].colli){
                      //maka semua demand diantarkan
                    this.route[idx][i][j]["index"]=ras[randomNumber].$key;
                    this.route[idx][i][j]["desa"]=ras[randomNumber].desa;
                    this.route[idx][i][j]["kecamatan"]=ras[randomNumber].kecamatan;
                    this.route[idx][i][j]["kab"]=ras[randomNumber].kabupaten;
                    this.route[idx][i][j]["load"]=ras[randomNumber].colli;
                    v_capacity-=ras[randomNumber].colli;
                    v_dating-=ras[randomNumber].colli;
                    colli_in_subroute+=ras[randomNumber].colli;
                    sumC-=ras[randomNumber].colli;
                    ras.splice(randomNumber,1);
                  }
                  //jika kapasitas truk < demand
                  else{
                    //maka sebagian demand diantarkan
                    this.route[idx][i][j]["index"]=ras[randomNumber].$key;
                    this.route[idx][i][j]["desa"]=ras[randomNumber].desa;
                    this.route[idx][i][j]["kecamatan"]=ras[randomNumber].kecamatan;
                    this.route[idx][i][j]["kab"]=ras[randomNumber].kabupaten;
                    this.route[idx][i][j]["load"]=v_capacity;
                    ras[randomNumber].colli=ras[randomNumber].colli-v_capacity;
                    v_dating-=v_capacity;
                    colli_in_subroute+=v_capacity;
                    sumC-=v_capacity;
                    v_capacity-=v_capacity;
                  }

                }
            }
            //jika desa bukan dataran tinggi
            else{
               //jika kapasitas truk > demand
                    if(v_capacity>=ras[randomNumber].colli){
                      //maka semua demand diantarkan
                    this.route[idx][i][j]["index"]=ras[randomNumber].$key;
                    this.route[idx][i][j]["desa"]=ras[randomNumber].desa;
                    this.route[idx][i][j]["kecamatan"]=ras[randomNumber].kecamatan;
                    this.route[idx][i][j]["kab"]=ras[randomNumber].kabupaten;
                    this.route[idx][i][j]["load"]=ras[randomNumber].colli;
                    v_capacity-=ras[randomNumber].colli;
                    colli_in_subroute+=ras[randomNumber].colli;
                    sumC-=ras[randomNumber].colli;
                    ras.splice(randomNumber,1);
                  }
                  //jika kapasitas truk < demand
                  else{
                    //maka sebagian demand diantarkan
                    this.route[idx][i][j]["index"]=ras[randomNumber].$key;
                    this.route[idx][i][j]["desa"]=ras[randomNumber].desa;
                    this.route[idx][i][j]["kecamatan"]=ras[randomNumber].kecamatan;
                    this.route[idx][i][j]["kab"]=ras[randomNumber].kabupaten;
                    this.route[idx][i][j]["load"]=v_capacity;
                    ras[randomNumber].colli=ras[randomNumber].colli-v_capacity;
                    colli_in_subroute+=v_capacity;
                     sumC-=v_capacity;
                    v_capacity-=v_capacity;
                   
                  }
            }
               
              j++;
            }
            this.sub_colli[idx][i]=colli_in_subroute;
         
i++;

 }
 let cukup=this.isEnoughStok(this.sub_colli[idx],gdg);
 //console.log(cukup);
 if(cukup){
  idx++;
  cukupMax=0;
 }
 else{
 
  if(cukupMax==10){
    stop=true;
  }
   cukupMax++;
 }
 
 }
 return resolve(true);
 });
}
//random gudang pengirim
generateDepot(numberPopulation:number, subcol:number[][]){
 
  return new Promise((resolve,reject) =>{
  let idx=0;

  let f_gudang:number[][]=[]; 
  while(idx<numberPopulation){ //loop sebanyak number of population
      let gdg=this.deepCopy(this.gudang); //data stok gudang
      let j=0;
      f_gudang[idx]=[];
      let stop=false;
      let countStop=0;
      while(j<this.route[idx].length&&!stop){   //loop sebanyak sub route dalam satu populasi
        if(gdg.length==0){
          break;
        }
        

        var randomNumber = Math.floor(Math.random() * gdg.length);
           let jml=Math.floor((gdg[randomNumber].stok*1000/15));
            if(subcol[idx][j]<=jml){
              f_gudang[idx][j]=randomNumber;
              gdg[randomNumber].stok-=subcol[idx][j]*15/1000;
              if(gdg[randomNumber].stok==0){
                gdg.splice(randomNumber,1);
              }
              countStop=0;
              j++
            }
            //else jika stok tidak mencukupi maka random gudang lagi;
            else{
              
              if(countStop==10){ //jika sampai 10 kali tidak ditemukan
                //console.log("No Random");
                let x=0;
                let ketemu=false;
                while(x<gdg.length&&!ketemu){
                  jml=Math.floor((gdg[x]['stok']*1000/15));
                  if(subcol[idx][j]<=jml){
                  f_gudang[idx][j]=x;
                  gdg[x].stok-=subcol[idx][j]*15/1000;
                  if(gdg[x].stok==0){
                    gdg.splice(x,1);
                  }
                  countStop=0;
                  j++
                  ketemu=true;
                }
                x++;
              }
              //console.log(idx+"_"+ketemu);
              if(ketemu==false){
                stop=true;
                break;
              }
                
              }else{
                countStop++;
              }
            }
      }
      if(stop==true){
        f_gudang.pop();
                break;
              }
          idx++;
      }
      return resolve(f_gudang);

    });
  }
//evaluasi populasi

evaluasiPopulasi(route: any[][][][], f_gudang:number[][]):any[]{
let evl :number[]=[];
let i=0;
let sumJarak=0;
while(i<route.length){//loop sebanyak populasi
  let j=0;
  let jarak_route=0;
  while(j<route[i].length){//loop sebanyak sub route
    let k=0;
    let jarak_subroute=0;
    jarak_subroute+=Number(this.distance[f_gudang[i][j]][route[i][j][k]["index"]+7]) //jarak depot-customer
    
    // console.log([route[i][j].length-1]);
    
    // console.log(route[i][j][route[i][j].length-1]["index"]+7);
    // console.log(f_gudang[i][j]);
    jarak_subroute+=Number(this.distance[route[i][j][route[i][j].length-1]["index"]+7][f_gudang[i][j]]) //jarak customer-depot
    while(k<route[i][j].length-1){//loop sebanyak desa dalam sub route
      jarak_subroute+=Number(this.distance[route[i][j][k]["index"]+7][route[i][j][k+1]["index"]+7]) //jarak depot-customer
      k++;
    }
    jarak_route+=jarak_subroute;
    j++;
  }
  sumJarak+=jarak_route;
  evl[i]=jarak_route;
  i++;
}
evl[route.length]=sumJarak; //menyimpan total jarak seluruh ind di array terakhir
return evl;
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
selection(route:any[][][][], fitness:number[], f_gud:number[][]){

  let offs:any[][][][]=[];
  let f_gudang:number[][]=[];
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
    k++;
  }

  return [offs,choosed,f_gudang];

}
//crossover
crossover(offspring:any[][][][],populasi:any[][][][],choosed:number[], from_gudang: number[][]){


let newOffspring: any[][][][]=[];
let newFGudang : number [][]=[];

//memilih indv yang dapat kawin
let i=0;
while(i<offspring.length){
    let rnd=Math.random();
    let child :any[][][]=[];
    let fgudang : number[]=[];
    if(rnd<this.prob_cross){  //individu dilakukan crossover jika bil random<pc
      //memilih pasangan 
       var randomParent = Math.floor(Math.random() * offspring.length);
       
       let same=true;
       if(choosed[i]!=randomParent)
       same=false;
       while(same){
         randomParent = Math.floor(Math.random() * offspring.length);
         if(choosed[i]!=randomParent)
          same=false;
       }
       let gdg=this.deepCopy(this.gudang); //data stok gudang
       let ras=this.deepCopy(this.rastra);//load rastra data
       //route based crossover
      //  console.log(i+"_"+choosed[i]+"_"+randomParent);
       let parent1=Math.floor(populasi[randomParent].length/3);
      //  console.log("Par: "+parent1);
       let idx=0;
       let idxparent2=parent1+1;
       let desalist :number[]=[];
       let sumC=this.sum_colli;
       let col_sub :number[]=[];
       let isLast=false;
       while(idx<offspring[i].length){
         let colli_in_subroute=0;
         if(idx<=parent1){
           //copy sebagian kecil dari parent 1 : original route
          child[idx]=populasi[i][idx]; //child
          fgudang[idx]=from_gudang[i][idx];//from gudang
          for(let c=0;c<populasi[i][idx].length;c++){ //update data desa yang telah masuk route
            if(!desalist.includes(populasi[i][idx][c]["index"])){ //jika desa belum ada maka dimasukkan
              desalist.push(populasi[i][idx][c]["index"]);
            }
             
              //kurangi data rastra
               ras[populasi[i][idx][c]["index"]].colli-=populasi[i][idx][c]["load"];
               sumC-=populasi[i][idx][c]["load"];
               colli_in_subroute+=populasi[i][idx][c]["load"];
              
          }
          col_sub[idx]=colli_in_subroute;
         }
         else{
           //copy sebagian lainnya dari parent 2 : offspring yang subroute nya tidak bertabrakan dengan parent 1
           let idxChild=0;
           let exist=false;

          while(idxChild<offspring[i][idx].length&&!exist){
            if(desalist.includes(offspring[i][idx][idxChild]["index"])){ //jika desa  ada maka dimasukkan
             exist=true;
            }
            idxChild++;
          }
          if(!exist){ //jika sub route tidak bertabrakan
            child[idxparent2]=offspring[i][idx];
            fgudang[idxparent2]=from_gudang[i][idx];//from gudang
            if(idx==offspring[i].length-1)
            isLast=true;
            
          for(let c=0;c<offspring[i][idx].length;c++){ //update data desa yang telah masuk route
              desalist.push(offspring[i][idx][c]["index"]);
              //kurangi data rastra 
                ras[offspring[i][idx][c]["index"]].colli-=offspring[i][idx][c]["load"];
                sumC-=offspring[i][idx][c]["load"];
                colli_in_subroute+=offspring[i][idx][c]["load"];
              
            }

            col_sub[idxparent2]=colli_in_subroute;
            idxparent2++;
            

          }
         }
         
         idx++;
       }

        //console.log(isLast);
       //repairing route
          //1. Repairing desa yang belum masuk dalam rute 
          
            //mencari desa yang belum terlayani
          
            let unassign: number[]=[];
            for(let h=0;h<ras.length;h++){ 
              if(ras[h].colli!=0){ //jika tidak terdapat dalam desalist
                unassign.push(h); //maka dimasukkan kedalam array 
                
              }
            }
            
            //mengecek  sub route terakhir apakah masih dapat ditambahi desa
            if(isLast){
            let sumcol=0;
            let dating=false;
            let sumDating=0;
            
            for(let m=0;m<child[child.length-1].length;m++){ 
              sumcol+=child[child.length-1][m]["load"];
              if(this.isDataranTinggi(child[child.length-1][m]["desa"],child[child.length-1][m]["kecamatan"])){
                dating=true;
              }
              if(dating){
                sumDating+=child[child.length-1][m]["load"];
              }
              
              
            }
            let v_capacity=this.vCap;
            let v_dating=this.vDating;
            let countidx=child[child.length-1].length;
            if(sumcol<v_capacity ){
              v_capacity-=sumcol;
              v_dating-=sumDating;
              let colli_in_subroute=sumcol;
             
              
              if(dating==true&&sumDating<v_dating){
                //dapat ditambahi desa lagi dalam constrint dataran tinggi
                
                while(v_capacity>0 && v_dating>0 &&unassign.length>0){
                  
                   var rndN = Math.floor(Math.random() * unassign.length);
                   let cc:any[]=[];
                   child[child.length-1][countidx]=[];
                //jika kapasitas truk >= kapasitas muatan dataran tinggi
                if(v_capacity>=v_dating){
                     //jika kapasitas muatan dataran tinggi > demand
                    if(v_dating>=ras[unassign[rndN]].colli){
                      //maka semua demand diantarkan
                    cc["index"]=ras[unassign[rndN]].$key;
                    cc["desa"]=ras[unassign[rndN]].desa;
                    cc["kecamatan"]=ras[unassign[rndN]].kecamatan;
                    cc["kab"]=ras[unassign[rndN]].kabupaten;
                    cc["load"]=ras[unassign[rndN]].colli;
                    child[child.length-1][countidx]=cc;
                    v_capacity-=ras[unassign[rndN]].colli;
                    v_dating-=ras[unassign[rndN]].colli;
                    colli_in_subroute+=v_dating; 
                    sumC-=ras[unassign[rndN]].colli;
                    ras[unassign[rndN]].colli-=ras[unassign[rndN]].colli;
                    unassign.splice(unassign.indexOf(unassign[rndN]),1);
                  }
                  //jika kapasitas muatan dataran tinggi < demand
                  else{
                    //maka sebagian demand diantarkan
                    cc["index"]=ras[unassign[rndN]].$key;
                    cc["desa"]=ras[unassign[rndN]].desa;
                    cc["kecamatan"]=ras[unassign[rndN]].kecamatan;
                    cc["kab"]=ras[unassign[rndN]].kabupaten;
                    cc["load"]=v_dating;
                    child[child.length-1][countidx]=cc;
                    v_capacity-=v_dating;
                    colli_in_subroute+=v_dating; 
                    sumC-=v_dating; 
                    ras[unassign[rndN]].colli-=v_dating;
                    v_dating-=v_dating;
                  }
                }
                //jika kapasitas truk < kapasitas muatan dataran tinggi
                else{
                  
                  //jika kapasitas truk > demand
                    if(v_capacity>=ras[unassign[rndN]].colli){
                      //maka semua demand diantarkan
                    cc["index"]=ras[unassign[rndN]].$key;
                    cc["desa"]=ras[unassign[rndN]].desa;
                    cc["kecamatan"]=ras[unassign[rndN]].kecamatan;
                    cc["kab"]=ras[unassign[rndN]].kabupaten;
                    cc["load"]=ras[unassign[rndN]].colli;
                    child[child.length-1][countidx]=cc;
                    v_capacity-=ras[unassign[rndN]].colli;
                    v_dating-=ras[unassign[rndN]].colli;
                    colli_in_subroute+=ras[unassign[rndN]].colli;
                    sumC-=ras[unassign[rndN]].colli;
                    ras[unassign[rndN]].colli-=ras[unassign[rndN]].colli;
                    unassign.splice(unassign.indexOf(unassign[rndN]),1);
                  }
                  //jika kapasitas truk < demand
                  else{
                    //maka sebagian demand diantarkan
                    cc["index"]=ras[unassign[rndN]].$key;
                    cc["desa"]=ras[unassign[rndN]].desa;
                    cc["kecamatan"]=ras[unassign[rndN]].kecamatan;
                    cc["kab"]=ras[unassign[rndN]].kabupaten;
                    cc["load"]=v_capacity;
                    child[child.length-1][countidx]=cc;
                    v_dating-=v_capacity;
                    colli_in_subroute+=v_capacity;
                    sumC-=v_capacity;
                    ras[unassign[rndN]].colli-=v_capacity;
                    v_capacity-=v_capacity;
                  }

                }
                countidx++;
              
              }//end while
              col_sub[child.length-1]=colli_in_subroute;
              }
              else{
                
                //dapat ditambahi desa lagi tanpa constrint dataran tinggi
                while(v_capacity>0 && v_dating>0 &&unassign.length>0){
                  
                  let cc:any[]=[];
                   child[child.length-1][countidx]=[];
                   var rndN = Math.floor(Math.random() * unassign.length);
                //jika kapasitas truk > demand
                    if(v_capacity>=ras[unassign[rndN]].colli){
                      //maka semua demand diantarkan
                    cc["index"]=ras[unassign[rndN]].$key;
                    cc["desa"]=ras[unassign[rndN]].desa;
                    cc["kecamatan"]=ras[unassign[rndN]].kecamatan;
                    cc["kab"]=ras[unassign[rndN]].kabupaten;
                    cc["load"]=ras[unassign[rndN]].colli;
                    child[child.length-1][countidx]=cc;
                    v_capacity-=ras[unassign[rndN]].colli;
                    colli_in_subroute+=ras[unassign[rndN]].colli;
                    sumC-=ras[unassign[rndN]].colli;
                    ras[unassign[rndN]].colli-=ras[unassign[rndN]].colli;
                    unassign.splice(unassign.indexOf(unassign[rndN]),1);
                  }
                  //jika kapasitas truk < demand
                  else{
                    //maka sebagian demand diantarkan
                    cc["index"]=ras[unassign[rndN]].$key;
                    cc["desa"]=ras[unassign[rndN]].desa;
                    cc["kecamatan"]=ras[unassign[rndN]].kecamatan;
                    cc["kab"]=ras[unassign[rndN]].kabupaten;
                    cc["load"]=v_capacity;
                    child[child.length-1][countidx]=cc;
                    colli_in_subroute+=v_capacity;
                     sumC-=v_capacity;
                     ras[unassign[rndN]].colli-=v_capacity;
                    v_capacity-=v_capacity;
                   
                  }
                  countidx++;
                }//end while
                
                col_sub[child.length-1]=colli_in_subroute;
              }
            }
          }
          
          //memasukkan desa yang belum terassign
          let idxNewchild=child.length;
         
          while(sumC>0){ // loop hingga semua colli ->menghasilkan 1 solusi=route=beberapa sub route
          let v_capacity=this.vCap; //kapasitas vehicle 8 ton =533 colli
          let j=0; //index desa dalam sub route
          let dating=false;
          let v_dating=this.vDating;
          let colli_in_subroute=0;
          child[idxNewchild]=[];
              while(v_capacity>0 && v_dating>0 && sumC>0){ //loop hingga kapasitas kendaraan -> menghasilkan 1 sub route
                child[idxNewchild][j]=[];
                
                    var rndN = Math.floor(Math.random() * unassign.length);
                    
                    //cek apakah desa merupakan dataran tinggi
                      if(j==0){
                        dating=this.isDataranTinggi(ras[unassign[rndN]].desa,ras[unassign[rndN]].kecamatan );
                          
                      }
                      else{
                        if(!dating){
                          dating=this.isDataranTinggi(ras[unassign[rndN]].desa,ras[unassign[rndN]].kecamatan );
                        }
                      }
                    
                    
                    //jika desa merupakan dataran tinggi
                    if(dating){
                      
                        //jika kapasitas truk >= kapasitas muatan dataran tinggi
                        if(v_capacity>=v_dating){
                            //jika kapasitas muatan dataran tinggi > demand
                            if(v_dating>=ras[unassign[rndN]].colli){
                              //maka semua demand diantarkan
                            child[idxNewchild][j]["index"]=ras[unassign[rndN]].$key;
                            child[idxNewchild][j]["desa"]=ras[unassign[rndN]].desa;
                            child[idxNewchild][j]["kecamatan"]=ras[unassign[rndN]].kecamatan;
                            child[idxNewchild][j]["kab"]=ras[unassign[rndN]].kabupaten;
                            child[idxNewchild][j]["load"]=ras[unassign[rndN]].colli;
                            v_capacity-=ras[unassign[rndN]].colli;
                            v_dating-=ras[unassign[rndN]].colli;
                            colli_in_subroute+=ras[unassign[rndN]].colli;
                            sumC-=ras[unassign[rndN]].colli;
                            ras[unassign[rndN]].colli-=ras[unassign[rndN]].colli;
                            unassign.splice(unassign.indexOf(unassign[rndN]),1);
                          }
                          //jika kapasitas muatan dataran tinggi < demand
                          else{
                            //maka sebagian demand diantarkan
                            child[idxNewchild][j]["index"]=ras[unassign[rndN]].$key;
                            child[idxNewchild][j]["desa"]=ras[unassign[rndN]].desa;
                            child[idxNewchild][j]["kecamatan"]=ras[unassign[rndN]].kecamatan;
                            child[idxNewchild][j]["kab"]=ras[unassign[rndN]].kabupaten;
                            child[idxNewchild][j]["load"]=v_dating;
                            ras[unassign[rndN]].colli-=v_dating;
                            v_capacity-=v_dating;
                            colli_in_subroute+=v_dating; 
                            sumC-=v_dating; 
                            v_dating-=v_dating;
                          }
                        }
                        //jika kapasitas truk < kapasitas muatan dataran tinggi
                        else{
                          
                          //jika kapasitas truk > demand
                            if(v_capacity>=ras[unassign[rndN]].colli){
                              //maka semua demand diantarkan
                            child[idxNewchild][j]["index"]=ras[unassign[rndN]].$key;
                            child[idxNewchild][j]["desa"]=ras[unassign[rndN]].desa;
                            child[idxNewchild][j]["kecamatan"]=ras[unassign[rndN]].kecamatan;
                            child[idxNewchild][j]["kab"]=ras[unassign[rndN]].kabupaten;
                            child[idxNewchild][j]["load"]=ras[unassign[rndN]].colli;
                            v_capacity-=ras[unassign[rndN]].colli;
                            v_dating-=ras[unassign[rndN]].colli;
                            colli_in_subroute+=ras[unassign[rndN]].colli;
                            sumC-=ras[unassign[rndN]].colli;
                            ras[unassign[rndN]].colli-=ras[unassign[rndN]].colli;
                            unassign.splice(unassign.indexOf(unassign[rndN]),1);
                          }
                          //jika kapasitas truk < demand
                          else{
                            //maka sebagian demand diantarkan
                            child[idxNewchild][j]["index"]=ras[unassign[rndN]].$key;
                            child[idxNewchild][j]["desa"]=ras[unassign[rndN]].desa;
                            child[idxNewchild][j]["kecamatan"]=ras[unassign[rndN]].kecamatan;
                            child[idxNewchild][j]["kab"]=ras[unassign[rndN]].kabupaten;
                            child[idxNewchild][j]["load"]=v_capacity;
                            ras[unassign[rndN]].colli-=v_capacity;
                            v_dating-=v_capacity;
                            colli_in_subroute+=v_capacity;
                            sumC-=v_capacity;
                            v_capacity-=v_capacity;
                          }

                        }
                    }
                    //jika desa bukan dataran tinggi
                    else{
                      //jika kapasitas truk > demand
                            if(v_capacity>=ras[unassign[rndN]].colli){
                              //maka semua demand diantarkan
                            child[idxNewchild][j]["index"]=ras[unassign[rndN]].$key;
                            child[idxNewchild][j]["desa"]=ras[unassign[rndN]].desa;
                            child[idxNewchild][j]["kecamatan"]=ras[unassign[rndN]].kecamatan;
                            child[idxNewchild][j]["kab"]=ras[unassign[rndN]].kabupaten;
                            child[idxNewchild][j]["load"]=ras[unassign[rndN]].colli;
                            v_capacity-=ras[unassign[rndN]].colli;
                            colli_in_subroute+=ras[unassign[rndN]].colli;
                            sumC-=ras[unassign[rndN]].colli;
                            ras[unassign[rndN]].colli-=ras[unassign[rndN]].colli;
                            unassign.splice(unassign.indexOf(unassign[rndN]),1);
                          }
                          //jika kapasitas truk < demand
                          else{
                            //maka sebagian demand diantarkan
                            child[idxNewchild][j]["index"]=ras[unassign[rndN]].$key;
                            child[idxNewchild][j]["desa"]=ras[unassign[rndN]].desa;
                            child[idxNewchild][j]["kecamatan"]=ras[unassign[rndN]].kecamatan;
                            child[idxNewchild][j]["kab"]=ras[unassign[rndN]].kabupaten;
                            child[idxNewchild][j]["load"]=v_capacity;
                            ras[unassign[rndN]].colli-=v_capacity;
                            colli_in_subroute+=v_capacity;
                            sumC-=v_capacity;
                            v_capacity-=v_capacity;
                          
                          }
                    }
                      
                      j++;
                    }
                    col_sub[idxNewchild]=colli_in_subroute;
                
                    idxNewchild++;

                  }//end while assig  unassign desa

                //2. Memperbaiki gudang yang melayani desa
               
                  
                  let j=0;
                  let idxbeforeG=fgudang.length;
                  let stop=false;
                  let countStop=0;
                  while(j<child.length&&!stop){   //loop sebanyak sub route dalam satu populasi
                    if(gdg.length==0){
                      break;
                    }
                    if(j<idxbeforeG){ //jika gudang telah terasiign cek apakah cukup
                      let jml=Math.floor((gdg[fgudang[j]].stok*1000/15));
                      if(col_sub[j]<=jml){ //jika cukup 
                        gdg[fgudang[j]].stok-=col_sub[j]*15/1000;// maka kurangi stok gudang
                        if(gdg[fgudang[j]].stok==0){
                                  gdg.splice(fgudang[j],1);
                                }
                                j++;
                      }
                      else{//jika tidak cukup maka cari gudang lain scr random
                          var randomNumber = Math.floor(Math.random() * gdg.length);
                            let jml=Math.floor((gdg[randomNumber].stok*1000/15));
                              if(col_sub[j]<=jml){
                                fgudang[j]=randomNumber; //assign new random gudang
                                gdg[randomNumber].stok-=col_sub[j]*15/1000;
                                if(gdg[randomNumber].stok==0){
                                  gdg.splice(randomNumber,1);
                                }
                                countStop=0;
                                j++
                              }
                              //else jika stok tidak mencukupi maka random gudang lagi;
                              else{
                                
                                if(countStop==10){ //jika sampai 10 kali tidak ditemukan
                                  //console.log("No Random");
                                  let x=0;
                                  let ketemu=false;
                                  while(x<gdg.length&&!ketemu){
                                    jml=Math.floor((gdg[x]['stok']*1000/15));
                                    if(col_sub[j]<=jml){
                                    fgudang[j]=x;
                                    gdg[x].stok-=col_sub[j]*15/1000;
                                    if(gdg[x].stok==0){
                                      gdg.splice(x,1);
                                    }
                                    countStop=0;
                                    j++
                                    ketemu=true;
                                  }
                                  x++;
                                }
                                //console.log(idx+"_"+ketemu);
                                if(ketemu==false){
                                  stop=true;
                                  break;
                                }
                              }else{
                                  countStop++;
                                }
                              }
                      }
                    }
                    else{ //jika gudang belum ter assign 
                      var randomNumber = Math.floor(Math.random() * gdg.length);
                      let jml=Math.floor((gdg[randomNumber].stok*1000/15));
                        if(col_sub[j]<=jml){
                          fgudang[j]=randomNumber;
                          gdg[randomNumber].stok-=col_sub[j]*15/1000;
                          if(gdg[randomNumber].stok==0){
                            gdg.splice(randomNumber,1);
                          }
                          countStop=0;
                          j++
                        }
                        //else jika stok tidak mencukupi maka random gudang lagi;
                        else{
                          
                          if(countStop==10){ //jika sampai 10 kali tidak ditemukan
                            //console.log("No Random");
                            let x=0;
                            let ketemu=false;
                            while(x<gdg.length&&!ketemu){
                              jml=Math.floor((gdg[x]['stok']*1000/15));
                              if(col_sub[j]<=jml){
                              fgudang[j]=x;
                              gdg[x].stok-=col_sub[j]*15/1000;
                              if(gdg[x].stok==0){
                                gdg.splice(x,1);
                              }
                              countStop=0;
                              j++
                              ketemu=true;
                            }
                            x++;
                          }
                          //console.log(idx+"_"+ketemu);
                          if(ketemu==false){
                            stop=true;
                            break;
                          }
                            
                          }else{
                            countStop++;
                          }
                        }
                    }
                    

                    
                  }//end while
                 
                    
          
        

       //assign child to newoffspring
       newOffspring[i]=child;
       //assign gudang yang melayani ke newFGudang
       newFGudang[i]=fgudang;


        if(stop==true){
          console.log("unfeasible");
          //jika child tidak feasible maka crossover ditolak
          newOffspring[i]=offspring[i];
          newFGudang[i]=from_gudang[i];
          }
    }
    else{
      newOffspring[i]=offspring[i];
      newFGudang[i]=from_gudang[i];
    }
    i++;
  
}
return [newOffspring,newFGudang];

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
//mutation
mutation(offspring : any[][][][]){
  let i=0;
  while(i<offspring.length){//loop sebanyak individu
    let j=0;
    while(j<offspring[i].length){
      //generate random value : jika < pm maka dilakukan mutasi
      let rnd = Math.random();
      if(rnd<this.prob_mutation){ //dilakukan mutasi
          if(offspring[i][j].length>2){
            
            let randomarray:number[]=[];
            for(let k=0;k<offspring[i][j].length;k++){
              randomarray.push(k);
            }
            let random1=Math.floor(Math.random() * randomarray.length);
            random1=randomarray[random1];
            randomarray.splice(random1,1);
            let random2=Math.floor(Math.random() * randomarray.length);
            random2=randomarray[random2];
            //console.log(i+"_"+j+"_"+random1+"_"+random2);
            let dat1=offspring[i][j][random1];
            offspring[i][j][random1]=offspring[i][j][random2];
            offspring[i][j][random2]=dat1;
          }
          
      }

      j++;
    }

    i++;
  }
  return offspring;
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


}