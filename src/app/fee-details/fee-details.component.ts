import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FeeService} from '../fee.service';
import {Observable} from 'rxjs';
import {Fee} from '../fee';
import {FeeDetail} from '../feedetail';

@Component({
  selector: 'app-fee-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fee-details.component.html',
  styleUrl: './fee-details.component.css'
})
export class FeeDetailsComponent{
  @Input() feeCode!: string;
  fee$: Observable<FeeDetail> | undefined;

  constructor(private feeService: FeeService) {
  }


  ngOnInit(): void {
    console.log('ng init called');
    this.getFee();
  }

  private getFee() {
    console.log('getting fee')
    this.fee$ = this.feeService.getFee(this.feeCode);
  }

  protected readonly console = console;

}
