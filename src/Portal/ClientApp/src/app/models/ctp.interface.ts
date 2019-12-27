const enum modelValidationState {
  unvalidated = 0,
  invalid = 1,
  valid = 2,
  skipped = 3,
}
export interface modelError {
  //exception: {
  //	data: any[];
  //	helpLink: string;
  //	hResult: number;
  //	innerException: any;
  //	message: string;
  //	source: string;
  //	stackTrace: string;
  //	targetSite: {
  //		attributes: any;
  //		callingConvention: any;
  //		containsGenericParameters: boolean;
  //		isAbstract: boolean;
  //		isAssembly: boolean;
  //		isConstructedGenericMethod: boolean;
  //		isConstructor: boolean;
  //		isFamily: boolean;
  //		isFamilyAndAssembly: boolean;
  //		isFamilyOrAssembly: boolean;
  //		isFinal: boolean;
  //		isGenericMethod: boolean;
  //		isGenericMethodDefinition: boolean;
  //		isHideBySig: boolean;
  //		isPrivate: boolean;
  //		isPublic: boolean;
  //		isSecurityCritical: boolean;
  //		isSecuritySafeCritical: boolean;
  //		isSecurityTransparent: boolean;
  //		isSpecialName: boolean;
  //		isStatic: boolean;
  //		isVirtual: boolean;
  //		methodHandle: any;
  //		methodImplementationFlags: any;
  //	};
  //};
  errorMessage: string;
}
export interface modelStateEntry {
  rawValue: any;
  attemptedValue: string;
  errors: modelError[];
  validationState: modelValidationState;
  children: modelStateEntry[];
}
export declare type modelState = { [key: string]: string[] };

export interface ctp {
  errors: modelState[];
}
