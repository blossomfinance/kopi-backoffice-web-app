/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

/** Custom Services */
import { ClientsService } from '../../../clients.service';
import { SettingsService } from 'app/settings/settings.service';

/**
 * Add Family Member Component
 */
@Component({
  selector: 'mifosx-add-family-member',
  templateUrl: './add-family-member.component.html',
  styleUrls: ['./add-family-member.component.scss']
})
export class AddFamilyMemberComponent implements OnInit {

  /** Minimum Due Date allowed. */
  minDate = new Date(1940, 0, 1);
  /** Maximum Due Date allowed. */
  maxDate = new Date();
  /** Add family member form. */
  addFamilyMemberForm: FormGroup;
  /** Add family member template. */
  addFamilyMemberTemplate: any;
  /** Client ID */
  clientId: any;

  /**
   * @param {FormBuilder} formBuilder FormBuilder
   * @param {DatePipe} datePipe Date Pipe
   * @param {Router} router Router
   * @param {Route} route Route
   * @param {ClientsService} clientsService Clients Service
   * @param {SettingsService} settingsService Setting service
   */
  constructor(private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
    private clientsService: ClientsService,
    private settingsService: SettingsService) {
    this.route.data.subscribe((data: { clientTemplate: any }) => {
      this.addFamilyMemberTemplate = data.clientTemplate.familyMemberOptions;
    });
    this.clientId = this.route.parent.parent.snapshot.params['clientId'];

  }

  ngOnInit() {
    this.createAddFamilyMemberForm();
  }

  /**
   * Creates the add family member form
   */
  createAddFamilyMemberForm() {
    this.addFamilyMemberForm = this.formBuilder.group({
      'firstName': ['', Validators.required],
      'middleName': [''],
      'lastName': ['', Validators.required],
      'qualification': [''],
      'age': ['', Validators.required],
      'isDependent': [''],
      'relationshipId': ['', Validators.required],
      'genderId': ['', Validators.required],
      'professionId': [''],
      'maritalStatusId': [''],
      'dateOfBirth': ['', Validators.required]
    });
  }

  /**
   * Submits the form and adds the family member
   */
  submit() {
    const prevDateOfBirth: Date = this.addFamilyMemberForm.value.dateOfBirth;
    // TODO: Update once language and date settings are setup
    const dateFormat = this.settingsService.dateFormat;
    this.addFamilyMemberForm.patchValue({
      dateOfBirth: this.datePipe.transform(prevDateOfBirth, dateFormat)
    });
    const familyMemberData = this.addFamilyMemberForm.value;
    familyMemberData.locale = this.settingsService.language.code;
    familyMemberData.dateFormat = dateFormat;
    this.clientsService.addFamilyMember(this.clientId, familyMemberData).subscribe(res => {
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }

}
