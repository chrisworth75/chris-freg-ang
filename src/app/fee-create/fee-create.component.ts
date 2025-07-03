import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';  // <--- import CommonModule

@Component({
  selector: 'app-fee-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],  // <--- add CommonModule here
  templateUrl: './fee-create.component.html',
})
export class FeeCreateComponent {
  feeForm = new FormGroup({
    code: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    value: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0.01)] }),
    description: new FormControl<string>('', { nonNullable: true }),
    status: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
  });

  constructor(private http: HttpClient) {}

  createFee() {
    if (this.feeForm.invalid) {
      this.feeForm.markAllAsTouched();
      return;
    }

    const feeData = this.feeForm.value;

    this.http.post('/fee', feeData).subscribe({
      next: () => {
        alert('Fee created successfully!');
        this.feeForm.reset();
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 409) {
          this.feeForm.controls.code.setErrors({ duplicate: true });
          this.feeForm.controls.code.markAsTouched();
        } else {
          alert('An unexpected error occurred.');
        }
      },
    });
  }
}
