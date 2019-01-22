import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { GudangService } from '../../shared/services/gudang/gudang.service';
import { Gudang } from '../../shared/services/gudang/gudang.model';

import { DataranTinggiService } from '../../shared/services/dataran-tinggi/dataran-tinggi.service';
import { DataranTinggi } from '../../shared/services/dataran-tinggi/dataran-tinggi.model';

import { RastraService } from '../../shared/services/rastra/rastra.service';
import { Rastra } from '../../shared/services/rastra/rastra.model';

import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Genalgov2Service } from '../../shared/services/route/genalgov2.service';


@Component({
    selector: 'app-pengaturan',
    templateUrl: './pengaturan.component.html',
    styleUrls: ['./pengaturan.component.scss'],
    animations: [routerTransition()]
})
export class PengaturanComponent implements OnInit {
    
    public searchString: string;
    gudangList: Gudang[];
    dataranList: DataranTinggi[];
    rastraList: Rastra[];
    listdat: string[][];
constructor(
  private gudangService: GudangService, 
  private dataranTinggiService: DataranTinggiService,  
  private rastraService: RastraService, 
  private tostr: ToastrService,
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
      
    });
    //read dataran tinggi
     var a = this.dataranTinggiService.getData();
        a.snapshotChanges().subscribe(item => {
      this.dataranList= [];
      this.listdat=[];
      let i=0;
      item.forEach(element => {
        this.listdat[i]=[];
        var b = element.payload.toJSON();
        b["$key"] = element.key;
        this.listdat[i]['desa']=b["desa"] ;
        this.listdat[i]['kecamatan']=b["kecamatan"] ;
        this.dataranList.push(b as DataranTinggi);
        i++;
      });
      
    });
   this.loadRastra();
    this.resetForm();
    }
    onSubmit(employeeForm: NgForm) {
    if (employeeForm.value.$key == null)
      this.tostr.info('Data Gudang yang Diedit !', 'Silahkan Memilih');
    else{
        if(employeeForm.value.kapasitas>=employeeForm.value.stok){
            this.gudangService.updateEmployee(employeeForm.value);
            this.resetForm(employeeForm);
            this.tostr.success('Berhasil Diedit !', 'Data Gudang');
            this.gen2.cekStok().then(res =>{
              if(res){
                this.tostr.error('Kapasitas Gudang tidak Mencukupi!', 'Error');
              }
              else{
                this.tostr.success('Kapasitas Gudang Mencukupi !', 'Success');
              }
            })
        }
        else
        this.tostr.error('Kapasitas Gudang terlalu kecil dari stok!', 'Error');
    
    }
     
  }
  loadRastra(){
    //read data rastra
     var c = this.rastraService.getData();
        c.snapshotChanges().subscribe(item => {
      this.rastraList= [];
      item.forEach(element => {
        var d= element.payload.toJSON();
        let exist:boolean=false;
            //cek existed
           for(let i=0;i<this.listdat.length;i++){
             if(this.listdat[i]['desa']==d["desa"] && this.listdat[i]['kecamatan']==d["kecamatan"])
             exist=true;
           }
        if(!exist){
          d["$key"] = element.key;
        this.rastraList.push(d as Rastra);
        }
        
      });
      
    });
  }
 
  resetForm(employeeForm?: NgForm) {
    if (employeeForm != null)
      employeeForm.reset();
    this.gudangService.selectedGudang = {
      $key: null,
      namaGudang: '',
      kapasitas: 0,
      stok: 0
    }
  }
  onEdit(emp: Gudang) {
    this.gudangService.selectedGudang = Object.assign({}, emp);
  }
 
  onDelete(key: string) {
    if (confirm('Apakah anda yakin ingin menghapus data ini ?') == true) {
      this.gudangService.deleteEmployee(key);
      this.tostr.error('Berhasil Dihapus !', 'Data Gudang');
    }
  } 
  onAdd(kec:string, desa:string) {
      this.dataranTinggiService.insertDataran(kec,desa);
   this.loadRastra();
    this.tostr.success('Berhasil Ditambahkan !', 'Dataran Tinggi : '+desa);

  }  
  onDelete_dataran(key: string, desa:string) {
    if (confirm('Apakah anda yakin ingin menghapus data ini ?') == true) {
      this.dataranTinggiService.deleteDataran(key);
      this.loadRastra();
      this.tostr.error('Berhasil Dihapus !', 'Dataran Tinggi : '+desa);
    }
  } 

}
