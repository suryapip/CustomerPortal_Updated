import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';


@Directive({
  selector: '[validateNotEqual][formControlName],[validateNotEqual][formControl],[validateNotEqual][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => NotEqualValidator), multi: true }
  ]
})
export class NotEqualValidator implements Validator {
  constructor(@Attribute('validateNotEqual') public validateNotEqual: string,
    @Attribute('reverse') public reverse: string) {
  }

  validate(c: AbstractControl): { [key: string]: any } {
    let other = c.root.get(this.validateNotEqual);

    if (!other)
      return null;

    return this.reverse === 'true' ? this.validateReverse(c, other) : this.validateNoReverse(c, other);
  }

  private validateNoReverse(c: AbstractControl, other: AbstractControl): { [key: string]: any } {
    return other.value !== c.value ? null : { validateNotEqual: true }
  }

  private validateReverse(c: AbstractControl, other: AbstractControl): { [key: string]: any } {
    if (c.value !== other.value) {
      if (other.errors) {
        delete other.errors['validateNotEqual'];

        if (Object.keys(other.errors).length == 0) {
          other.setErrors(null);
        };
      }
    } else {
      other.setErrors({ validateNotEqual: true });
    }

    return null;
  }
}
