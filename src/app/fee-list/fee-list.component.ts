import {Component, OnInit} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {Observable} from 'rxjs';
import {Fee} from '../fee';
import {FeeService} from '../fee.service';
import { RouterLink} from '@angular/router';

@Component({
  selector: 'app-fee-details-list',
  providers: [FeeService],
  imports: [AsyncPipe,
  RouterLink],
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

  protected readonly console = console;
}
