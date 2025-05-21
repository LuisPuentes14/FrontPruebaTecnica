import { routes } from './../../app.routes';
import { StudentSubject } from '../../api/models';
import { StudentSubjectsService } from './../../api/services/student-subjects.service';
import { Component, OnInit } from '@angular/core';
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

@Component({
  standalone: true,
  imports: [TableModule,  CommonModule, InputTextModule, TagModule,
    SelectModule, MultiSelectModule,  ButtonModule, IconFieldModule, InputIconModule, ButtonModule],
  selector: 'app-list-subjects-students',
  templateUrl: './list-subjects-students.component.html',
  styleUrls: ['./list-subjects-students.component.css']
})
export default class ListSubjectsStudentsComponent implements OnInit {

  public subjects: StudentSubject[] = [];
  private idStudent: number = 0;

  constructor(api :StudentSubjectsService, private routes: ActivatedRoute) {

    this.routes.paramMap.subscribe(params => {
      this.idStudent = params.get('idStudent')! ? Number(params.get('idStudent')) : 0;
    });

    api.apiStudentSubjectsIdGet$Json({id : this.idStudent}).subscribe(
      (response) => {
        this.subjects = response;
        console.log(response);
        console.log(this.idStudent);
      },
      (error) => {
        console.error('Error fetching subjects:', error.status);
      }
    );
  }

  ngOnInit() {
  }

}
