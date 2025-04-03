import {Component, DestroyRef,  OnInit, signal, inject} from '@angular/core';
import {map, Observable} from 'rxjs';
import {Fee} from '../fee';
import {FeeService} from '../fee.service';
import { SortPipe } from '../sort.pipe';
import {AsyncPipe} from '@angular/common';
import {Product} from '../product';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-fee-list',
  providers: [FeeService],

  templateUrl: './fee-list.component.html',
  styleUrl: './fee-list.component.css'
})
export class FeeListComponent implements OnInit {
  feesSignal = signal<Fee[] | undefined>(undefined);
  private httpClient = inject(HttpClient);
  fees$: Observable<Fee[]> | undefined;
  products$: Observable<Product[]> | undefined;
  selectedFee: Fee | undefined;
  private destroyRef = inject(DestroyRef);

  constructor(private feeService: FeeService) {
  }


  ngOnInit(): void {
    console.log('ng init called');
    this.getFees();
    const subscription = this.httpClient
      .get<Fee[]>('http://localhost:3001')
      // .pipe(
      //   map((resData) => resData.places)
      // )
      .subscribe({
        next: (fees) => {
          this.feesSignal.set(fees);
        },
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  public getFees() {
    console.log('getting fees')
    this.fees$ = this.feeService.getFees();
  }

}
