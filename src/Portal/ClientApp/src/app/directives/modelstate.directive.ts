import { Directive, Attribute, Host } from '@angular/core';
import { Validator, AbstractControl, ValidationErrors, ValidatorFn, FormGroup, NG_VALIDATORS } from '@angular/forms';
import { ctp } from '../models/ctp.interface';
import { Component } from '@angular/compiler/src/core';

//export const mserrorValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {

  
//  const name = control.get('name');
//  const alterEgo = control.get('alterEgo');

//  return name && alterEgo && name.value === alterEgo.value ? { 'identityRevealed': true } : null;
//};


@Directive({
  selector: '[includeModelState]',
  providers: [{
    provide: NG_VALIDATORS, useExisting: ModelStateDirective, multi: true
  }]
})
export class ModelStateDirective implements Validator {
  //constructor(@Attribute('includeModelState') public includeModelState: string) { }
  constructor() { }

  validate(control: AbstractControl): ValidationErrors {
    var ctp = null as ctp;



    return null;

    //var modelState = ctp.getErrors();

    //var id = control['id'] || control['name'];

    //var mine = modelState[id];

    //return mine.errors.map(x => x.errorMessage);
  }

}
