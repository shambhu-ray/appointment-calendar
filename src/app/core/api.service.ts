import {Inject, Injectable, InjectionToken} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {IErrorResponseModel} from '../models/error-response';
import {ToasterService} from './toaster.service';

export const BASE_URL = new InjectionToken<string>('BASE_URL');

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private _baseUrl: string;

    constructor(
        private _http: HttpClient,
        private _roasterService: ToasterService,
        @Inject(BASE_URL) baseUrl?: string
    ) {
        this._baseUrl = baseUrl
    }

    private getHeaders(headers?: HttpHeaders): HttpHeaders {
        return headers ? headers :
            new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    }

    /**
     * GET request
     * @param url
     * @param headers
     * @param params
     */
    public get<T>(url: string, headers?: HttpHeaders, params?: HttpParams): Observable<T> {
        return this._http.get<T>(this._baseUrl + url, {params: params, headers: this.getHeaders(headers)})
            .pipe(catchError(this.handleError));
    }

    /**
     * POST request
     * @param url
     * @param requestBody
     * @param headers
     */
    public post<T>(url: string, requestBody: Object, headers?: HttpHeaders): Observable<T> {
        return this._http.post<T>(this._baseUrl + url, requestBody, {headers: this.getHeaders(headers)})
            .pipe(catchError(this.handleError));
    }

    /**
     * DELETE request
     * @param url
     * @param headers
     */
    public delete<T>(url: string, headers?: HttpHeaders): Observable<T> {
        return this._http.delete<T>(this._baseUrl + url, {headers: this.getHeaders(headers)})
            .pipe(catchError(this.handleError));
    }

    public patch<T>(url: string, headers?: HttpHeaders): Observable<T> {
        return this._http.patch(this._baseUrl + url, {headers: this.getHeaders(headers)})
            .pipe(catchError(this.handleError))
    }

    /**
     * PUT request
     * @param url
     * @param requestBody
     * @param headers
     */
    public put<T>(url: string, requestBody: Object, headers?: HttpHeaders): Observable<T> {
        return this._http.put<T>(this._baseUrl + url, requestBody, {headers: this.getHeaders(headers)})
            .pipe(catchError(this.handleError));
    }

    /**
     * Error handler
     * @param response
     */
    private handleError = (response: HttpErrorResponse): Observable<any> => {
        const errorResponse: IErrorResponseModel = {
            statusCode: response.status,
            message: response.error ?
                response.error.message ?
                    response.error.message :
                    response.message :
                response.message
        };
        this._roasterService.presentToast(errorResponse.message);
        return throwError(response);
    }

}
