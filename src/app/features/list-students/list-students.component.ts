import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';


interface City {
  name: string;
  code: string;
}

@Component({
  standalone: true,
  imports: [TableModule, RouterModule, CommonModule, InputTextModule, TagModule, Dialog, ReactiveFormsModule,Toast,
    SelectModule, MultiSelectModule, ButtonModule, IconFieldModule, InputIconModule, ButtonModule, ConfirmDialogModule],
  providers: [ MessageService, ConfirmationService],
  encapsulation: ViewEncapsulation.None,
  selector: 'app-list-students',
  styleUrls: ['./list-students.component.scss'],
  templateUrl: './list-students.component.html'
  
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
    private apiCrediPrograms: CreditProgramsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {
  
  }

  ngOnInit() {

    this.loadStudens();

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

  loadStudens() {

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
          idCreditProgram: (this.studenForm.value.selectedcreditProgram as CreditProgram).idCreditProgram ?? 0,
        }
      }).subscribe(
        (response) => {
          console.log('Student created successfully:', response);
          this.loadStudens() ; // Recargar la lista de estudiantes
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

   show(tipo: string, mensaje: string, detail: string) {
    this.messageService.add({
      severity: tipo,
      summary: mensaje,
      detail: detail,
    });
  }

  confirmDelte(student: Student, callback?: () => void) {
 
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar este registro?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        // Aquí va la lógica de eliminación real (llamada a servicio, etc.)
        console.log('Registro eliminado');
        this.api
          .apiStudentsIdDelete({ id: student.idStudent ?? 0 })
          .subscribe(
            (response) => {
              console.log('Registro eliminado:', response);
              this.loadStudens();
              this.show('success', 'OK', 'Estudiante eliminado');
            },
            (error) => {
              console.error('Error eliminando registro:', error.error);
              this.show('error', 'Invalid form', error.error);
            }
          );

      }
    });
  }

}
