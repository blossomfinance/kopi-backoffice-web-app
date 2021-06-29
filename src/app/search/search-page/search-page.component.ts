/** Angular Imports */
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

/**
 * Search Page Component
 */
@Component({
  selector: 'mifosx-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent {

  /** Search Results */
  searchResults: any;
  /** Flags if number of search results is 0 or exceed 100 */
  notFound: boolean;
  overload: boolean;

  /**
   * @param {ActivatedRoute} route Activated Route
   * @param {Router} router Router
   */
  constructor(private route: ActivatedRoute,
    private router: Router) {
    this.route.data.subscribe((data: { searchResults: any }) => {
      this.searchResults = data.searchResults;
      console.debug(this.searchResults);
      this.notFound = this.searchResults.length < 1 ? true : false;
      this.overload = this.searchResults.length > 100 ? true : false;
      if (this.overload) {
        this.searchResults = this.searchResults.slice(0, 100);
      }
    });
  }

  /**
   * Returns link to entity view page.
   * @param {any} entity Entity
   */
  navigate(entity: any) {
    this.router.navigate(['clients', entity.id]);
  }

}
