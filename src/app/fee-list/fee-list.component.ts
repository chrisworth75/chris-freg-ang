import {Component, OnInit} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {Observable} from 'rxjs';
import {Fee} from '../fee';
import {FeeService} from '../fee.service';

@Component({
  selector: 'app-fee-list',
  providers: [FeeService],
  imports: [AsyncPipe],
  templateUrl: './fee-list.component.html',
  styleUrl: './fee-list.component.css'
})
export class FeeListComponent implements OnInit {
  fees$: Observable<Fee[]> | undefined;

  constructor(private feeService: FeeService) {
  }


  ngOnInit(): void {
    console.log('ng init called');
    this.getFees();
  }

  private getFees() {
    console.log('getting fees')
    this.fees$ = this.feeService.getFees();
  }

}
