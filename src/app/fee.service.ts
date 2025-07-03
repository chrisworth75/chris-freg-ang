import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Fee } from './fee';
import { Observable, map } from 'rxjs';
import { FeeDetail } from './feedetail';

@Injectable({
  providedIn: 'root'
})
export class FeeService {
  private fees: Fee[] = [];
  private fee?: FeeDetail;

  constructor(private http: HttpClient) {}

  getFees(): Observable<Fee[]> {
    const options = new HttpParams().set('limit', '10');
    const url = `/fees`;  // Relative URL for proxying

    return this.http.get<Fee[]>(url, { params: options }).pipe(
      map(fees => {
        this.fees = fees;
        return fees;
      })
    );
  }

  getFee(code: string): Observable<FeeDetail> {
    const url = `/fee/${code}`;  // Relative URL for proxying

    return this.http.get<FeeDetail>(url).pipe(
      map(fee => {
        this.fee = fee;
        return fee;
      })
    );
  }

  addFee(newFee: Partial<FeeDetail>): Observable<FeeDetail> {
    const url = `/fee/`;  // Relative URL for proxying
    console.log('posting fee:', newFee);

    return this.http.post<FeeDetail>(url, newFee).pipe(
      map(fee => {
        this.fees.push(fee);
        return fee;
      })
    );
  }
}
