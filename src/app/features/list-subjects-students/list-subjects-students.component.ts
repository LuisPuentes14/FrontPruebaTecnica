import { Subject } from './../../api/models/subject';
import { StudentSubjectsService } from './../../api/services/student-subjects.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute } from '@angular/router';
import { SubjectsService } from './../../api/services/subjects.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { StudentSubject } from '../../api/models';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { RouterModule } from '@angular/router';


@Component({
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    InputTextModule,
    TagModule,
    SelectModule,
    MultiSelectModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    ButtonModule,
    Dialog,
    ReactiveFormsModule,
    Toast,
    ConfirmDialogModule,
    RouterModule
  ],
  providers: [MessageService, ConfirmationService],
  selector: 'app-list-subjects-students',
  templateUrl: './list-subjects-students.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./list-subjects-students.component.scss'],
})
export default class ListSubjectsStudentsComponent implements OnInit {
  public subjects: Subject[] = [];
  public subjectsStudents: StudentSubject[] = [];
  public listStudents: any[] = [];
  private idStudent: number = 0;
  private idCreditProgram: number = 0;

  visible: boolean = false;
  visibleListStudents: boolean = false;

  subjectForm = new FormGroup({
    selectedSubject: new FormControl('', [Validators.required]),
  });

  constructor(
    private api: StudentSubjectsService,
    private routes: ActivatedRoute,
    private apiSubjects: SubjectsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.routes.paramMap.subscribe((params) => {
      this.idStudent = params.get('idStudent')!
        ? Number(params.get('idStudent'))
        : 0;
    });

    this.routes.paramMap.subscribe((params) => {
      this.idCreditProgram = params.get('idCreditProgram')!
        ? Number(params.get('idCreditProgram'))
        : 0;
    });

    this.loadStudensSubjects();

    this.apiSubjects
      .apiSubjectsIdGet$Json({ id: this.idCreditProgram })
      .subscribe(
        (response) => {
          this.subjects = response;
        },
        (error) => {
          console.error('Error fetching subjects:', error.status);
        }
      );
  }

  ngOnInit() { }

  showDialog() {
    this.visible = true;
  }

  onSubmit() {
    console.log(this.subjectForm.valid);

    if (this.subjectForm.valid) {
      console.log(this.subjectForm.value);
      this.visible = false;

      this.api
        .apiStudentSubjectsPost$Json({
          body: {
            idStudent: this.idStudent,
            subjectId:
              (this.subjectForm.value.selectedSubject as Subject).idSubject ??
              0,
          },
        })
        .subscribe(
          (response) => {
            console.log('Student created successfully:', response);
            this.loadStudensSubjects();
            this.show('success', 'OK', 'Materia registrada');
            this.subjectForm.reset(); // Limpiar el formulario después de enviar
          },
          (error) => {
            console.error('Error fetching subjects:', error.error);
            this.show('error', 'Invalid form', error.error);
          }
        );

      this.subjectForm.reset(); // Limpiar el formulario después de enviar
    } else {
      console.error('Error creating student:', 'Invalid form');
    }
  }

  show(tipo: string, mensaje: string, detail: string) {
    this.messageService.add({
      severity: tipo,
      summary: mensaje,
      detail: detail,
    });
  }

  loadStudensSubjects() {
    this.api.apiStudentSubjectsIdGet$Json({ id: this.idStudent }).subscribe(
      (response) => {
        this.subjectsStudents = response;
      },
      (error) => {
        console.error('Error fetching subjects:', error.status);
      }
    );

  }

  loadStudens(idSubject: number) {

    this.visibleListStudents = true;

    this.api.apiStudentSubjectsGetStudentSubjectsBySubjectIdSubjectIdGet$Json({ subjectId: idSubject }).subscribe(
      (response) => {
        this.listStudents = response;
        console.log(this.listStudents, ' ---- ', response);
      },
      (error) => {
        console.error('Error fetching subjects:', error.status);
      }
    );

  }

  confirmarEliminacion(studentSubject: StudentSubject, callback?: () => void) {

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
          .apiStudentSubjectsIdDelete({ id: studentSubject.idStudentSubject ?? 0 })
          .subscribe(
            (response) => {
              console.log('Registro eliminado:', response);
              this.loadStudensSubjects();
              this.show('success', 'OK', 'Materia eliminada');
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

