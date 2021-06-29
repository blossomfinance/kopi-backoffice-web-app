/** Angular Imports */
import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend, HttpParams } from '@angular/common/http';

/** rxjs Imports */
import { Observable } from 'rxjs';

/**
 * Search service.
 */
@Injectable({
  providedIn: 'root'
})
export class SearchService {

  /**
   * @param {HttpClient} http Http Client to send requests.
   */
  constructor(
    private http: HttpClient,
    private backend: HttpBackend
  ) {
    this.http = new HttpClient(backend);
  }


  /**
   * @param {string} search Search String
   * @param {string} resource Entity resource
   * @returns {Observable<any>} Search Results.
   */
  getSearchResults(search: string, resource: string): Observable<any> {
    const httpParams = new HttpParams()
      .set('search', search)
      .set('resource', resource)
      .set('exactMatch', 'false');
    console.debug('Search params', httpParams);
    return this.http.get('https://koppi-search.herokuapp.com/', { params: httpParams });
  }

}
