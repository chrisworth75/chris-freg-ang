import { Component, OnInit } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {FeeService} from '../fee.service';

@Component({
  selector: 'app-fee-create',
  templateUrl: './fee-create.component.html',
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true,
  styleUrls: ['./fee-create.component.css']
})
export class FeeCreateComponent implements OnInit {
  form!: FormGroup;

  constructor(private feeService: FeeService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      amount: [null, [Validators.required, Validators.min(0)]]
    });
  }

  createFee(): void {
  }

  onSubmit() {

  }
}
