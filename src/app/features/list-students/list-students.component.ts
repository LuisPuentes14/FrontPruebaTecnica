import { Component, OnInit } from '@angular/core';
import { CreditProgramsService, StudentsService } from '../../api/services';
import { CreditProgram, Student } from '../../api/models';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { Dialog } from 'primeng/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Select } from 'primeng/select';
import { subscribe } from 'diagnostics_channel';
import { AngleLeftIcon } from 'primeng/icons';


interface City {
  name: string;
  code: string;
}

@Component({
  standalone: true,
  imports: [TableModule, RouterModule, CommonModule, InputTextModule, TagModule, Dialog, ReactiveFormsModule,
    SelectModule, MultiSelectModule, ButtonModule, IconFieldModule, InputIconModule, ButtonModule],
  selector: 'app-list-students',
  templateUrl: './list-students.component.html',
  styleUrls: ['./list-students.component.css']
})
export default class ListStudentsComponent implements OnInit {

  public students: Student[] = [];
  public creditProgram: CreditProgram[] = [];
  loading: boolean = true;
  visible: boolean = false;

  studenForm = new FormGroup({
    name: new FormControl('Campor requerido', [Validators.required, Validators.minLength(2)]),
    identification: new FormControl('Campor requerido', [Validators.required, Validators.minLength(6)]),
    selectedcreditProgram: new FormControl('Campor requerido', [Validators.required])
  });

  constructor(private api: StudentsService, private apiCrediPrograms: CreditProgramsService) {
    this.api.apiStudentsGet$Json().subscribe(
      (response) => {
        this.students = response;
        console.log(this.students);
      },
      (error) => {
        console.error('Error fetching students:', error);
      }
    );
  }

  ngOnInit() {
    this.apiCrediPrograms.apiCreditProgramsGet$Json().subscribe(
      (response) => {
        console.log(response);
        this.creditProgram = response;
      },
      (error) => {
        console.error('Error fetching students:', error);
      }
    )
  }

  showDialog() {
    this.visible = true;
  }

  onSubmit() {
  
    if (this.studenForm.valid) {
      console.log(this.studenForm.value);
    } else {
      this.studenForm.markAllAsTouched(); // Para mostrar errores si no ha tocado los campos
    }
  }

}
