import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';

import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'app-pengujian',
    templateUrl: './pengujian.component.html',
    styleUrls: ['./pengujian.component.scss'],
    animations: [routerTransition()]
})
export class PengujianComponent implements OnInit {
    num_iterasi: number=0;
    prob_crossover: number=0;
    prob_mutation: number=0;
    
constructor(private tostr: ToastrService){
    }
    ngOnInit() {
        
    }
    onSubmit(employeeForm: NgForm) {
  }
 
  resetForm(employeeForm?: NgForm) {
    if (employeeForm != null)
      employeeForm.reset();
  
  }
   

}
