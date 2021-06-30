/** Angular Imports */
import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthenticationService } from '../core/authentication/authentication.service';


/** rxjs Imports */
import { Observable } from 'rxjs';

/**
 * Search service.
 */
@Injectable({
  providedIn: 'root'
})
export class SearchService {
  authenticationKey: string;

  /**
   * @param {HttpClient} http Http Client to send requests.
   */
  constructor(
    private http: HttpClient,
    private backend: HttpBackend,
    private authenticationService: AuthenticationService
  ) {
    this.http = new HttpClient(backend);
    const savedCredentials = this.authenticationService.getCredentials();
    this.authenticationKey = savedCredentials.base64EncodedAuthenticationKey;
  }


  /**
   * @param {string} search Search String
   * @param {string} resource Entity resource
   * @returns {Observable<any>} Search Results.
   */
  getSearchResults(search: string, resource: string): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Basic ${this.authenticationKey}` });
    const params = new HttpParams()
      .set('search', search)
      .set('resource', resource)
      .set('exactMatch', 'false');
    console.debug('Search headers', headers);
    return this.http.get('https://koppi-search.herokuapp.com/', { headers, params });
  }

}
