import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';

import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GenalgoService } from '../../shared/services/route/genalgo.service';

import { UjiService } from '../../shared/services/uji/uji.service';
import { Uji } from '../../shared/services/uji/uji.model';



@Component({
    selector: 'app-pengujian',
    templateUrl: './pengujian.component.html',
    styleUrls: ['./pengujian.component.scss'],
    animations: [routerTransition()]
})
export class PengujianComponent implements OnInit {
     ujiList: Uji[];
constructor(
    private tostr: ToastrService, 
    private gen : GenalgoService,
    private ujiService: UjiService,
    ){
  
    }
    ngOnInit() {
      //read gudang
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
