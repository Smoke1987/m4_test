import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { AppService } from './app.service';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // loader
  private requestStack: any[] = [];
  private loader: any = null;
  private isLoading = false;

  URL_API = 'https://jsonplaceholder.typicode.com';

  constructor(private http: HttpClient,
              private appService: AppService,
  ) {
  }


  /**
   * Запрос на АПИ
   * @param {string} endPoint
   * @param requestBody
   * @param requestOptions
   * @param callBackFnParams
   * @param silence
   * @param loaderContent
   * @returns {Observable}
   */
  public callApiGET<T>(
    endPoint: string,
    requestBody: any,
    requestOptions ?: any,
    callBackFnParams ?: any,
    silence = false,
    loaderContent = null,
  ): Observable<T | object> {

    let _requestOptions: {
      headers?: HttpHeaders | {
        [header: string]: string | string[];
      };
      observe?: 'body';
      params?: HttpParams | {
        [param: string]: string | string[];
      };
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    } | any = {};

    _requestOptions.responseType = 'json';

    // положим в стек наш запрос
    let _request = {id: Math.round(Math.random() * 1000)};
    this.requestStack.push(_request);
    // console.log('ApiService @ callApi():: ', {loader: this.loader, silence});
    if (this.loader == null && !silence) {
      // this.loadingService.present(loaderContent);
      this.loader = _request.id;
    }

    // Если передаем какие-либо опции запроса
    if (requestOptions) {
      Object.keys(requestOptions).map((key) => {
        _requestOptions[key] = requestOptions[key];
      });
    }

    if (!_requestOptions.headers) {
      _requestOptions.headers = {};
    }

    return this.http.get<T | Object>(this.URL_API + endPoint, _requestOptions).pipe(
      map((response) => {
        // console.log('ApiService @ callApiGET -> RESPONSE:: ', {response, endPoint, requestBody});

        // удалим из стека наш запрос, тк запрос уже выполнен
        this.removeRequest(_request);

        return response;
      }),
      catchError(this.handleError.bind(this, {reason: 'catch from call API', request: _request}))
    );
  }

  /**
   * Запрос на АПИ
   * @param {string} endPoint
   * @param requestBody
   * @param requestOptions
   * @param callBackFnParams
   * @param silence
   * @param loaderContent
   * @returns {Observable}
   */
  public callApi(
    endPoint: string,
    requestBody: any,
    requestOptions ?: any,
    callBackFnParams ?: any,
    silence = false,
    loaderContent = null,
  ): Observable<any> {

    let _requestOptions: {
      headers?: HttpHeaders | {
        [header: string]: string | string[];
      };
      observe?: 'body';
      params?: HttpParams | {
        [param: string]: string | string[];
      };
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    } | any = {};

    _requestOptions.responseType = 'json';

    // положим в стек наш запрос
    let _request = {id: Math.round(Math.random() * 1000)};
    this.requestStack.push(_request);
    // console.log('ApiService @ callApi():: ', {loader: this.loader, silence});
    if (this.loader == null && !silence) {
      // this.loadingService.present(loaderContent);
      this.loader = _request.id;
    }

    // Если передаем какие-либо опции запроса
    if (requestOptions) {
      Object.keys(requestOptions).map((key) => {
        _requestOptions[key] = requestOptions[key];
      });
    }

    if (!_requestOptions.headers) {
      _requestOptions.headers = {};
    }

    return this.http.post<Object>(this.URL_API + endPoint, requestBody, _requestOptions).pipe(
      map((response) => {
        // console.log('ApiService @ callApi -> RESPONSE:: ', {response, endPoint, requestBody});

        // удалим из стека наш запрос, тк запрос уже выполнен
        this.removeRequest(_request);

        return response;
      }),
      catchError(this.handleError.bind(this, {reason: 'catch from call API', request: _request}))
    );
  }

  private handleError(handleErrorData: any, error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('ApiService @ handle HTTP error -> An error occurred (client-side)', {error});
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`ApiService @ handle HTTP error -> Backend returned code ${error.status}`, {error});
    }
    // удалим из стека наш запрос, тк запрос уже выполнен
    if (handleErrorData && handleErrorData.request && handleErrorData.request.id) {
      this.removeRequest(handleErrorData.request);
    }

    // return an observable with a user-facing error message
    return throwError(error.error);
  };

  private removeRequest(_request: any) {
    // удалим из стека наш запрос, тк запрос уже выполнен
    let _idx = this.requestStack.findIndex(_req => _req.id == _request.id);
    this.requestStack.splice(_idx, 1);

    if (this.requestStack.length == 0 && this.loader != null) {
      // Hide loader
    }
  }

  showError(title = 'Ошибка', message = 'Неизвестная ошибка', code?: any): any {
    // Show error
    if (code || code === 0) {
      message = message + `(${code})`;
    }
    this.appService.showAlert({
      title,
      text: message,
      icon: 'error',
    });
  }

  loadData(): void {
    this.appService.showSpinner();
    this.callApiGET<User[]>('/users', {}).subscribe((response) => {
      // console.log('ApiService @ loadData() -> response:: ', {response, _this: this});
    }, (error: any) => {
      // console.log('ApiService @ loadData() -> error:: ', {error, _this: this});
      const message = error.message || error.msg || undefined;
      this.showError(undefined, message);
    }, () => {
      this.appService.stopSpinner();
    });
  }
}
