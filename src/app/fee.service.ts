import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Fee } from './fee';
import { FeeDetail } from './feedetail';

@Injectable({
  providedIn: 'root'
})
export class FeeService {
  private fees: Fee[] = [];
  private fee?: FeeDetail;

  constructor(private http: HttpClient) {}

  /**
   * Fetch a list of fees from the backend.
   */
  getFees(): Observable<Fee[]> {
    const options = new HttpParams().set('limit', '10');
    const url = `/api/fees`;

    return this.http.get<Fee[]>(url, { params: options }).pipe(
      map(fees => {
        this.fees = fees;
        return fees;
      })
    );
  }

  /**
   * Fetch detailed information about a single fee by code.
   */
  getFee(code: string): Observable<FeeDetail> {
    const url = `/api/fee/${code}`;

    return this.http.get<FeeDetail>(url).pipe(
      map(fee => {
        this.fee = fee;
        return fee;
      })
    );
  }

  /**
   * Create a new fee by sending a POST request to the backend.
   */
  createFee(newFee: Partial<FeeDetail>): Observable<FeeDetail> {
    const url = `/api/fee`;

    return this.http.post<FeeDetail>(url, newFee).pipe(
      map(fee => {
        this.fees.push(fee);
        return fee;
      })
    );
  }

  /**
   * Delete a fee by its unique code.
   */
  deleteFee(code: string): Observable<void> {
    const url = `/api/fee/${code}`;

    return this.http.delete<void>(url).pipe(
      map(() => {
        this.fees = this.fees.filter(f => f.code !== code);
      })
    );
  }
}
