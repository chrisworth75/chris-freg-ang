import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Fee} from './fee';
import { Observable, map, of, tap } from 'rxjs';
import {Product} from './product';

@Injectable({
  providedIn: 'root'
})
export class FeeService {
  private fees: Fee[] = [];
  private products: Product[] = [];
  private url = 'http://localhost:3001';
  private productsUrl = 'https://fakestoreapi.com/products';

  constructor(private http: HttpClient) {
  }

  getFees(): Observable<Fee[]> {
    const options = new HttpParams().set('limit', 10);
    return this.http.get<Fee[]>(this.url, {
      params: options
    }).pipe(map(fees => {
      this.fees = fees;
      console.log('cw in da function');
      return fees;
    }));
  }

  getProducts(): Observable<Product[]> {
    const options = new HttpParams().set('limit', 10);
    return this.http.get<Product[]>(this.productsUrl, {
      params: options
    }).pipe(map(products => {
      this.products = products;
      return products;
    }));

  }
}
