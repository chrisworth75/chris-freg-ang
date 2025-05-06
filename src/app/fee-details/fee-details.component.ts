import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-fee-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fee-details.component.html',
  styleUrl: './fee-details.component.css'
})
export class FeeDetailsComponent{
  @Input() feeCode!: string;

}
