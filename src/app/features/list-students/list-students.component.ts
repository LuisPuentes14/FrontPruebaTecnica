import { Component, OnInit } from '@angular/core';
import { CreditProgramsService, StudentsService } from '../../api/services';
import { CreditProgram, Student, StudentSubject } from '../../api/models';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { Dialog } from 'primeng/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';



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
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    identification: new FormControl('', [Validators.required, Validators.minLength(6)]),
    selectedcreditProgram: new FormControl('', [Validators.required])
  });

  constructor(private api: StudentsService,
    private apiCrediPrograms: CreditProgramsService) {
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
      this.visible = false;

      this.api.apiStudentsPost$Json({
        body: {
          name: this.studenForm.value.name ?? '',
          numberDocument: this.studenForm.value.identification ?? '',
          idCreditProgram: (this.studenForm.value.selectedcreditProgram as CreditProgram).idCreditProgram?? 0 ,
        }
      }).subscribe(
        (response) => {
          console.log('Student created successfully:', response);
          this.students.push(response); // Agregar el nuevo estudiante a la lista
          this.studenForm.reset(); // Limpiar el formulario después de enviar
        },
        (error) => {
          console.error('Error creating student:', error);
        }
      );

    } else {
      this.studenForm.markAllAsTouched(); // Para mostrar errores si no ha tocado los campos
    }
  }

}
