import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Fee} from './fee';
import { Observable, map, of, tap } from 'rxjs';
import {FeeDetail} from './feedetail';

@Injectable({
  providedIn: 'root'
})
export class FeeService {
  private fees: Fee[] = [];
  private fee?: FeeDetail;
  private baseUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) {
  }

  getFees(): Observable<Fee[]> {
    const options = new HttpParams().set('limit', 10);
    const url = `${this.baseUrl}/fees`;

    // from chatgpt
    // this.http.get<Fee[]>(this.url)
    //   .pipe(
    //     map(response => {
    //       console.log('cw In map:', response);  // Now it runs!
    //       return response;
    //     })
    //   )
    //   .subscribe(data => {
    //     console.log('cw Final result:', data);
    //   });


    return this.http.get<Fee[]>(url, {
      params: options
    }).pipe(map(fees => {
      this.fees = fees;
      console.log('cw in da fees function');
      return fees;
    }));
  }

  getFee(code: string): Observable<FeeDetail> {
    const options = new HttpParams().set('limit', 10);
    const url = `${this.baseUrl}/fee/${code}`;
    return this.http.get<FeeDetail>(url, {
      params: options
    }).pipe(map(fee => {
      this.fee = fee;
      console.log('cw in da  fee detail function');
      return fee;
    }));
  }


  addFee(newFee: Partial<FeeDetail>): Observable<FeeDetail> {
    const url = `${this.baseUrl}/fee/`;
    return this.http.post<FeeDetail>(url, newFee).pipe(
      map(fee => {
        this.fees.push(fee);
        return fee;
      })
    );
  }





}
