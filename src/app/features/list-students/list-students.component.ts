import { Component, OnInit } from '@angular/core';
import { StudentsService } from '../../api/services';
import { Student } from '../../api/models';
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

@Component({
  standalone: true,
  imports: [TableModule, RouterModule,  CommonModule, InputTextModule, TagModule,
    SelectModule, MultiSelectModule,  ButtonModule, IconFieldModule, InputIconModule, ButtonModule],
  selector: 'app-list-students',
  templateUrl: './list-students.component.html',
  styleUrls: ['./list-students.component.css']
})
export default class ListStudentsComponent implements OnInit {

  public students: Student[] = [];
  loading: boolean = true;

  constructor(private api :StudentsService) {
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


  }

}
