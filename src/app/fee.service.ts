import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Fee} from './fee';
import { Observable, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeeService {
  private fees: Fee[] = [];
  private url = 'http://localhost:3001';

  constructor(private http: HttpClient) {
  }

  getFees(): Observable<Fee[]> {
    const options = new HttpParams().set('limit', 10);

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


    return this.http.get<Fee[]>(this.url, {
      params: options
    }).pipe(map(fees => {
      this.fees = fees;
      console.log('cw in da function');
      return fees;
    }));
  }
}
