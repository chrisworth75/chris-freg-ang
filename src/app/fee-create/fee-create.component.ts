import { Component, OnInit } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {FeeService} from '../fee.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-fee-create',
  templateUrl: './fee-create.component.html',
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true,
  styleUrls: ['./fee-create.component.css']
})
export class FeeCreateComponent {
  feeForm = new FormGroup({
    code: new FormControl('', {
      nonNullable: true,
      validators: Validators.required
    }),
    value: new FormControl<number | undefined>(undefined, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.min(1)
      ]
    }),
    status: new FormControl('', { nonNullable: true }),
    description: new FormControl('', { nonNullable: true })
  });

  constructor(private feeService: FeeService, private router: Router) {}

  createFee() {
    console.log('create fee');
    this.feeService.addFee(this.feeForm!.value).subscribe({
      next: fee => console.log('Fee posted:', fee),
      error: err => console.error('Error posting fee:', err)
    });
  }
}
