import { Product } from './../products/product.interface';
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'; 
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

@Injectable()
export class ProductService {

    private baseUrl: string = 'http://storerestservice.azurewebsites.net/api/products';

    private products$: Observable<Product[]>;

    constructor(private http: HttpClient) { }

    getProducts(): Observable<Product[]> | any {
        if(!this.products$){
            this.products$ = this.http
            .get<Product[]>(this.baseUrl)
            .shareReplay()
            .catch(this.handleError);
        }
        
        return this.products$;
    }

    getProductById(id:number): Observable<Product>{
        return  this.getProducts()
                    .flatMap(product => product)
                    .filter(p => p.id === id)
                    .catch(this.handleError)
    }

    clearCache(){
        this.products$ = null;
    }

    private handleError(errorResponse: HttpErrorResponse) {
        let errorMsg: string;
        if (errorResponse.error instanceof Error) {
            // A client-side or network error occurred. Handle it accordingly.
            errorMsg = 'An error occurred:' + errorResponse.error.message;
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            errorMsg = `Backend returned code ${errorResponse.status}, body was: ${errorResponse.error}`;
        }
        console.error(errorMsg);
        return Observable.throw(errorMsg);
    }
}