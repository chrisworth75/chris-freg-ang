import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { FeeService } from '../fee.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-fee-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './fee-create.component.html',
})
export class FeeCreateComponent {
  feeForm = new FormGroup({
    code: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    value: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(0.01)],
    }),
    description: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    status: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  successMessage = '';
  showSuccess = false;

  constructor(private feeService: FeeService) {}

  createFee() {
    if (this.feeForm.invalid) {
      this.feeForm.markAllAsTouched();
      return;
    }

    const formValue = this.feeForm.value;
    const cleanedFeeData = {
      ...formValue,
      value: formValue.value ?? undefined,
    };

    this.feeService.createFee(cleanedFeeData).subscribe({
      next: () => {
        this.successMessage = 'Fee created successfully!';
        this.showSuccess = true;
        this.feeForm.reset();

        // Hide the message after 3 seconds (optional)
        setTimeout(() => {
          this.showSuccess = false;
        }, 3000);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 409) {
          this.feeForm.controls.code.setErrors({ duplicate: true });
          this.feeForm.controls.code.markAsTouched();
        } else {
          // You could show a red alert here if desired
          console.error('Unexpected error:', err);
        }
      },
    });
  }
}
