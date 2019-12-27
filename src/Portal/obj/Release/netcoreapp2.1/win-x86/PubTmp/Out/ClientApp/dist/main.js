(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./GoogleCaptcha/ngx-captcha-lib/src/lib/components/base-recaptcha.component.ts":
/*!**************************************************************************************!*\
  !*** ./GoogleCaptcha/ngx-captcha-lib/src/lib/components/base-recaptcha.component.ts ***!
  \**************************************************************************************/
/*! exports provided: BaseReCaptchaComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BaseReCaptchaComponent", function() { return BaseReCaptchaComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var BaseReCaptchaComponent = /** @class */ (function () {
    function BaseReCaptchaComponent(renderer, zone, injector, scriptService) {
        this.renderer = renderer;
        this.zone = zone;
        this.injector = injector;
        this.scriptService = scriptService;
        /**
        * Prefix of the captcha element
        */
        this.captchaElemPrefix = 'ngx_captcha_id_';
        /**
         * Indicates if global domain 'recaptcha.net' should be used instead of default domain ('google.com')
         */
        this.useGlobalDomain = false;
        /**
        * Type
        */
        this.type = 'image';
        /**
        * Tab index
        */
        this.tabIndex = 0;
        /**
        * Called when captcha receives successful response.
        * Captcha response token is passed to event.
        */
        this.success = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        /**
        * Called when captcha is loaded. Event receives id of the captcha
        */
        this.load = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        /**
        * Called when captcha is reset.
        */
        this.reset = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        /**
        * Called when captcha is loaded & ready. I.e. when you need to execute captcha on component load.
        */
        this.ready = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        /**
        * Indicates if captcha should be set on load
        */
        this.setupAfterLoad = false;
        /**
        * If enabled, captcha will reset after receiving success response. This is useful
        * when invisible captcha need to be resolved multiple times on same page
        */
        this.resetCaptchaAfterSuccess = false;
        /**
        * Indicates if captcha is loaded
        */
        this.isLoaded = false;
    }
    BaseReCaptchaComponent.prototype.ngAfterViewInit = function () {
        this.control = this.injector.get(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControl"]).control;
    };
    BaseReCaptchaComponent.prototype.ngOnChanges = function (changes) {
        // cleanup scripts if language changed because they need to be reloaded
        if (changes && changes.hl) {
            // cleanup scripts when language changes
            if (!changes.hl.firstChange && (changes.hl.currentValue !== changes.hl.previousValue)) {
                this.scriptService.cleanup();
            }
        }
        if (changes && changes.useGlobalDomain) {
            // cleanup scripts when domain changes
            if (!changes.useGlobalDomain.firstChange && (changes.useGlobalDomain.currentValue !== changes.useGlobalDomain.previousValue)) {
                this.scriptService.cleanup();
            }
        }
        this.setupComponent();
    };
    /**
    * Gets captcha response as per reCaptcha docs
    */
    BaseReCaptchaComponent.prototype.getResponse = function () {
        return this.reCaptchaApi.getResponse(this.captchaId);
    };
    /**
    * Gets Id of captcha widget
    */
    BaseReCaptchaComponent.prototype.getCaptchaId = function () {
        return this.captchaId;
    };
    /**
    * Resets captcha
    */
    BaseReCaptchaComponent.prototype.resetCaptcha = function () {
        var _this = this;
        this.zone.run(function () {
            // reset captcha using Google js api
            _this.reCaptchaApi.reset();
            // required due to forms
            _this.onChange(undefined);
            _this.onTouched(undefined);
            // trigger reset event
            _this.reset.next();
        });
    };
    /**
    * Gets last submitted captcha response
    */
    BaseReCaptchaComponent.prototype.getCurrentResponse = function () {
        return this.currentResponse;
    };
    /**
    * Reload captcha. Useful when properties (i.e. theme) changed and captcha need to reflect them
    */
    BaseReCaptchaComponent.prototype.reloadCaptcha = function () {
        this.setupComponent();
    };
    BaseReCaptchaComponent.prototype.ensureCaptchaElem = function (captchaElemId) {
        var captchaElem = document.getElementById(captchaElemId);
        if (!captchaElem) {
            throw Error("Captcha element with id '" + captchaElemId + "' was not found");
        }
        // assign captcha alem
        this.captchaElem = captchaElem;
    };
    /**
    * Responsible for instantiating captcha element
    */
    BaseReCaptchaComponent.prototype.renderReCaptcha = function () {
        var _this = this;
        // run outside angular zone due to timeout issues when testing
        // details: https://github.com/Enngage/ngx-captcha/issues/26
        this.zone.runOutsideAngular(function () {
            _this.captchaId = _this.reCaptchaApi.render(_this.captchaElemId, _this.getCaptchaProperties());
            _this.ready.next();
        });
    };
    /**
    * Called when captcha receives response
    * @param callback Callback
    */
    BaseReCaptchaComponent.prototype.handleCallback = function (callback) {
        var _this = this;
        this.currentResponse = callback;
        this.success.next(callback);
        this.zone.run(function () {
            _this.onChange(callback);
            _this.onTouched(callback);
        });
        if (this.resetCaptchaAfterSuccess) {
            this.resetCaptcha();
        }
    };
    BaseReCaptchaComponent.prototype.getPseudoUniqueNumber = function () {
        return new Date().getUTCMilliseconds() + Math.floor(Math.random() * 9999);
    };
    BaseReCaptchaComponent.prototype.setupComponent = function () {
        var _this = this;
        // captcha specific setup
        this.captchaSpecificSetup();
        // create captcha wrapper
        this.createAndSetCaptchaElem();
        this.scriptService.registerCaptchaScript(this.useGlobalDomain, 'explicit', function (grecaptcha) {
            _this.onloadCallback(grecaptcha);
        }, this.hl);
    };
    /**
    * Called when google's recaptcha script is ready
    */
    BaseReCaptchaComponent.prototype.onloadCallback = function (grecapcha) {
        // assign reference to reCaptcha Api once its loaded
        this.reCaptchaApi = grecapcha;
        if (!this.reCaptchaApi) {
            throw Error("ReCaptcha Api was not initialized correctly");
        }
        // loaded flag
        this.isLoaded = true;
        // fire load event
        this.load.next();
        // render captcha
        this.renderReCaptcha();
        // setup component if it was flagged as such
        if (this.setupAfterLoad) {
            this.setupAfterLoad = false;
            this.setupComponent();
        }
    };
    BaseReCaptchaComponent.prototype.generateNewElemId = function () {
        return this.captchaElemPrefix + this.getPseudoUniqueNumber();
    };
    BaseReCaptchaComponent.prototype.createAndSetCaptchaElem = function () {
        // generate new captcha id
        this.captchaElemId = this.generateNewElemId();
        if (!this.captchaElemId) {
            throw Error("Captcha elem Id is not set");
        }
        // remove old html
        this.captchaWrapperElem.nativeElement.innerHTML = '';
        // create new wrapper for captcha
        var newElem = this.renderer.createElement('div');
        newElem.id = this.captchaElemId;
        this.renderer.appendChild(this.captchaWrapperElem.nativeElement, newElem);
        // update captcha elem
        this.ensureCaptchaElem(this.captchaElemId);
    };
    /**
     * To be aligned with the ControlValueAccessor interface we need to implement this method
     * However as we don't want to update the recaptcha, this doesn't need to be implemented
     */
    BaseReCaptchaComponent.prototype.writeValue = function (obj) { };
    /**
     * This method helps us tie together recaptcha and our formControl values
     */
    BaseReCaptchaComponent.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    /**
    * At some point we might be interested whether the user has touched our component
    */
    BaseReCaptchaComponent.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], BaseReCaptchaComponent.prototype, "siteKey", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], BaseReCaptchaComponent.prototype, "useGlobalDomain", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], BaseReCaptchaComponent.prototype, "type", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], BaseReCaptchaComponent.prototype, "hl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], BaseReCaptchaComponent.prototype, "tabIndex", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], BaseReCaptchaComponent.prototype, "success", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], BaseReCaptchaComponent.prototype, "load", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], BaseReCaptchaComponent.prototype, "reset", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], BaseReCaptchaComponent.prototype, "ready", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('captchaWrapperElem'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])
    ], BaseReCaptchaComponent.prototype, "captchaWrapperElem", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('captchaScriptElem'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])
    ], BaseReCaptchaComponent.prototype, "captchaScriptElem", void 0);
    return BaseReCaptchaComponent;
}());



/***/ }),

/***/ "./GoogleCaptcha/ngx-captcha-lib/src/lib/components/invisible-recaptcha.component.ts":
/*!*******************************************************************************************!*\
  !*** ./GoogleCaptcha/ngx-captcha-lib/src/lib/components/invisible-recaptcha.component.ts ***!
  \*******************************************************************************************/
/*! exports provided: InvisibleReCaptchaComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InvisibleReCaptchaComponent", function() { return InvisibleReCaptchaComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _models_recaptcha_type_enum__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models/recaptcha-type.enum */ "./GoogleCaptcha/ngx-captcha-lib/src/lib/models/recaptcha-type.enum.ts");
/* harmony import */ var _services_script_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/script.service */ "./GoogleCaptcha/ngx-captcha-lib/src/lib/services/script.service.ts");
/* harmony import */ var _base_recaptcha_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./base-recaptcha.component */ "./GoogleCaptcha/ngx-captcha-lib/src/lib/components/base-recaptcha.component.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var InvisibleReCaptchaComponent = /** @class */ (function (_super) {
    __extends(InvisibleReCaptchaComponent, _super);
    function InvisibleReCaptchaComponent(renderer, zone, injector, scriptService) {
        var _this = _super.call(this, renderer, zone, injector, scriptService) || this;
        _this.renderer = renderer;
        _this.zone = zone;
        _this.injector = injector;
        _this.scriptService = scriptService;
        /**
         * This size representing invisible captcha
         */
        _this.size = 'invisible';
        /**
         * Theme
         */
        _this.theme = 'light';
        /**
         * Badge
         */
        _this.badge = 'bottomright';
        _this.recaptchaType = _models_recaptcha_type_enum__WEBPACK_IMPORTED_MODULE_2__["ReCaptchaType"].InvisibleReCaptcha;
        return _this;
    }
    InvisibleReCaptchaComponent_1 = InvisibleReCaptchaComponent;
    InvisibleReCaptchaComponent.prototype.ngOnChanges = function (changes) {
        _super.prototype.ngOnChanges.call(this, changes);
    };
    /**
     * Programatically invoke the reCAPTCHA check. Used if the invisible reCAPTCHA is on a div instead of a button.
     */
    InvisibleReCaptchaComponent.prototype.execute = function () {
        var _this = this;
        // execute captcha
        this.zone.runOutsideAngular(function () { return _this.reCaptchaApi.execute(_this.captchaId); });
    };
    InvisibleReCaptchaComponent.prototype.captchaSpecificSetup = function () {
    };
    /**
    * Gets reCaptcha properties
    */
    InvisibleReCaptchaComponent.prototype.getCaptchaProperties = function () {
        var _this = this;
        return {
            'sitekey': this.siteKey,
            'callback': function (response) { return _this.zone.run(function () { return _this.handleCallback(response); }); },
            'badge': this.badge,
            'type': this.type,
            'tabindex': this.tabIndex,
            'size': this.size,
            'theme': this.theme
        };
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], InvisibleReCaptchaComponent.prototype, "theme", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], InvisibleReCaptchaComponent.prototype, "badge", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], InvisibleReCaptchaComponent.prototype, "hl", void 0);
    InvisibleReCaptchaComponent = InvisibleReCaptchaComponent_1 = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'ngx-invisible-recaptcha',
            template: "\n  <div #captchaWrapperElem></div>",
            providers: [
                {
                    provide: _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NG_VALUE_ACCESSOR"],
                    useExisting: Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["forwardRef"])(function () { return InvisibleReCaptchaComponent_1; }),
                    multi: true,
                }
            ]
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["Renderer2"],
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"],
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injector"],
            _services_script_service__WEBPACK_IMPORTED_MODULE_3__["ScriptService"]])
    ], InvisibleReCaptchaComponent);
    return InvisibleReCaptchaComponent;
    var InvisibleReCaptchaComponent_1;
}(_base_recaptcha_component__WEBPACK_IMPORTED_MODULE_4__["BaseReCaptchaComponent"]));



/***/ }),

/***/ "./GoogleCaptcha/ngx-captcha-lib/src/lib/components/recaptcha-2.component.ts":
/*!***********************************************************************************!*\
  !*** ./GoogleCaptcha/ngx-captcha-lib/src/lib/components/recaptcha-2.component.ts ***!
  \***********************************************************************************/
/*! exports provided: ReCaptcha2Component */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReCaptcha2Component", function() { return ReCaptcha2Component; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _models_recaptcha_type_enum__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models/recaptcha-type.enum */ "./GoogleCaptcha/ngx-captcha-lib/src/lib/models/recaptcha-type.enum.ts");
/* harmony import */ var _services_script_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/script.service */ "./GoogleCaptcha/ngx-captcha-lib/src/lib/services/script.service.ts");
/* harmony import */ var _base_recaptcha_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./base-recaptcha.component */ "./GoogleCaptcha/ngx-captcha-lib/src/lib/components/base-recaptcha.component.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var ReCaptcha2Component = /** @class */ (function (_super) {
    __extends(ReCaptcha2Component, _super);
    function ReCaptcha2Component(renderer, zone, injector, scriptService) {
        var _this = _super.call(this, renderer, zone, injector, scriptService) || this;
        _this.renderer = renderer;
        _this.zone = zone;
        _this.injector = injector;
        _this.scriptService = scriptService;
        /**
        * Name of the global expire callback
        */
        _this.windowOnErrorCallbackProperty = 'ngx_captcha_error_callback';
        /**
        * Name of the global error callback
        */
        _this.windowOnExpireCallbackProperty = 'ngx_captcha_expire_callback';
        /**
         * Theme
         */
        _this.theme = 'light';
        /**
        * Size
        */
        _this.size = 'normal';
        /**
        * Expired callback
        */
        _this.expire = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        /**
        * Error callback
        */
        _this.error = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        _this.recaptchaType = _models_recaptcha_type_enum__WEBPACK_IMPORTED_MODULE_2__["ReCaptchaType"].ReCaptcha2;
        return _this;
    }
    ReCaptcha2Component_1 = ReCaptcha2Component;
    ReCaptcha2Component.prototype.ngOnChanges = function (changes) {
        _super.prototype.ngOnChanges.call(this, changes);
    };
    ReCaptcha2Component.prototype.ngOnDestroy = function () {
        window[this.windowOnErrorCallbackProperty] = {};
        window[this.windowOnExpireCallbackProperty] = {};
    };
    ReCaptcha2Component.prototype.captchaSpecificSetup = function () {
        this.registerCallbacks();
    };
    /**
     * Gets reCaptcha properties
    */
    ReCaptcha2Component.prototype.getCaptchaProperties = function () {
        var _this = this;
        return {
            'sitekey': this.siteKey,
            'callback': function (response) { return _this.zone.run(function () { return _this.handleCallback(response); }); },
            'expired-callback': function () { return _this.zone.run(function () { return _this.handleExpireCallback(); }); },
            'error-callback': function () { return _this.zone.run(function () { return _this.handleErrorCallback(); }); },
            'theme': this.theme,
            'type': this.type,
            'size': this.size,
            'tabindex': this.tabIndex
        };
    };
    /**
     * Registers global callbacks
    */
    ReCaptcha2Component.prototype.registerCallbacks = function () {
        window[this.windowOnErrorCallbackProperty] = this.handleErrorCallback.bind(this);
        window[this.windowOnExpireCallbackProperty] = this.handleExpireCallback.bind(this);
    };
    /**
     * Handles error callback
    */
    ReCaptcha2Component.prototype.handleErrorCallback = function () {
        var _this = this;
        this.zone.run(function () {
            _this.onChange(undefined);
            _this.onTouched(undefined);
        });
        this.error.next();
    };
    /**
     * Handles expired callback
     */
    ReCaptcha2Component.prototype.handleExpireCallback = function () {
        this.expire.next();
        // reset captcha on expire callback
        this.resetCaptcha();
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], ReCaptcha2Component.prototype, "theme", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], ReCaptcha2Component.prototype, "size", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], ReCaptcha2Component.prototype, "hl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], ReCaptcha2Component.prototype, "expire", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], ReCaptcha2Component.prototype, "error", void 0);
    ReCaptcha2Component = ReCaptcha2Component_1 = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'ngx-recaptcha2',
            template: "\n  <div #captchaWrapperElem></div>",
            providers: [
                {
                    provide: _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NG_VALUE_ACCESSOR"],
                    useExisting: Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["forwardRef"])(function () { return ReCaptcha2Component_1; }),
                    multi: true,
                }
            ]
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["Renderer2"],
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"],
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injector"],
            _services_script_service__WEBPACK_IMPORTED_MODULE_3__["ScriptService"]])
    ], ReCaptcha2Component);
    return ReCaptcha2Component;
    var ReCaptcha2Component_1;
}(_base_recaptcha_component__WEBPACK_IMPORTED_MODULE_4__["BaseReCaptchaComponent"]));



/***/ }),

/***/ "./GoogleCaptcha/ngx-captcha-lib/src/lib/index.ts":
/*!********************************************************!*\
  !*** ./GoogleCaptcha/ngx-captcha-lib/src/lib/index.ts ***!
  \********************************************************/
/*! exports provided: BaseReCaptchaComponent, InvisibleReCaptchaComponent, ReCaptcha2Component, ReCaptchaType, ScriptService, ReCaptchaV3Service, NgxCaptchaModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_base_recaptcha_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/base-recaptcha.component */ "./GoogleCaptcha/ngx-captcha-lib/src/lib/components/base-recaptcha.component.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BaseReCaptchaComponent", function() { return _components_base_recaptcha_component__WEBPACK_IMPORTED_MODULE_0__["BaseReCaptchaComponent"]; });

/* harmony import */ var _components_invisible_recaptcha_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/invisible-recaptcha.component */ "./GoogleCaptcha/ngx-captcha-lib/src/lib/components/invisible-recaptcha.component.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "InvisibleReCaptchaComponent", function() { return _components_invisible_recaptcha_component__WEBPACK_IMPORTED_MODULE_1__["InvisibleReCaptchaComponent"]; });

/* harmony import */ var _components_recaptcha_2_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/recaptcha-2.component */ "./GoogleCaptcha/ngx-captcha-lib/src/lib/components/recaptcha-2.component.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ReCaptcha2Component", function() { return _components_recaptcha_2_component__WEBPACK_IMPORTED_MODULE_2__["ReCaptcha2Component"]; });

/* harmony import */ var _models_recaptcha_type_enum__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./models/recaptcha-type.enum */ "./GoogleCaptcha/ngx-captcha-lib/src/lib/models/recaptcha-type.enum.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ReCaptchaType", function() { return _models_recaptcha_type_enum__WEBPACK_IMPORTED_MODULE_3__["ReCaptchaType"]; });

/* harmony import */ var _services_script_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./services/script.service */ "./GoogleCaptcha/ngx-captcha-lib/src/lib/services/script.service.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ScriptService", function() { return _services_script_service__WEBPACK_IMPORTED_MODULE_4__["ScriptService"]; });

/* harmony import */ var _services_recaptcha_v3_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./services/recaptcha_v3.service */ "./GoogleCaptcha/ngx-captcha-lib/src/lib/services/recaptcha_v3.service.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ReCaptchaV3Service", function() { return _services_recaptcha_v3_service__WEBPACK_IMPORTED_MODULE_5__["ReCaptchaV3Service"]; });

/* harmony import */ var _ngx_captcha_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ngx-captcha.module */ "./GoogleCaptcha/ngx-captcha-lib/src/lib/ngx-captcha.module.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "NgxCaptchaModule", function() { return _ngx_captcha_module__WEBPACK_IMPORTED_MODULE_6__["NgxCaptchaModule"]; });










/***/ }),

/***/ "./GoogleCaptcha/ngx-captcha-lib/src/lib/models/recaptcha-type.enum.ts":
/*!*****************************************************************************!*\
  !*** ./GoogleCaptcha/ngx-captcha-lib/src/lib/models/recaptcha-type.enum.ts ***!
  \*****************************************************************************/
/*! exports provided: ReCaptchaType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReCaptchaType", function() { return ReCaptchaType; });
var ReCaptchaType;
(function (ReCaptchaType) {
    ReCaptchaType[ReCaptchaType["InvisibleReCaptcha"] = 0] = "InvisibleReCaptcha";
    ReCaptchaType[ReCaptchaType["ReCaptcha2"] = 1] = "ReCaptcha2";
})(ReCaptchaType || (ReCaptchaType = {}));


/***/ }),

/***/ "./GoogleCaptcha/ngx-captcha-lib/src/lib/ngx-captcha.module.ts":
/*!*********************************************************************!*\
  !*** ./GoogleCaptcha/ngx-captcha-lib/src/lib/ngx-captcha.module.ts ***!
  \*********************************************************************/
/*! exports provided: NgxCaptchaModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NgxCaptchaModule", function() { return NgxCaptchaModule; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _components_invisible_recaptcha_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/invisible-recaptcha.component */ "./GoogleCaptcha/ngx-captcha-lib/src/lib/components/invisible-recaptcha.component.ts");
/* harmony import */ var _components_recaptcha_2_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/recaptcha-2.component */ "./GoogleCaptcha/ngx-captcha-lib/src/lib/components/recaptcha-2.component.ts");
/* harmony import */ var _services_recaptcha_v3_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./services/recaptcha_v3.service */ "./GoogleCaptcha/ngx-captcha-lib/src/lib/services/recaptcha_v3.service.ts");
/* harmony import */ var _services_script_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./services/script.service */ "./GoogleCaptcha/ngx-captcha-lib/src/lib/services/script.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






var NgxCaptchaModule = /** @class */ (function () {
    function NgxCaptchaModule() {
    }
    NgxCaptchaModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"]
            ],
            declarations: [
                _components_recaptcha_2_component__WEBPACK_IMPORTED_MODULE_3__["ReCaptcha2Component"],
                _components_invisible_recaptcha_component__WEBPACK_IMPORTED_MODULE_2__["InvisibleReCaptchaComponent"]
            ],
            providers: [
                _services_script_service__WEBPACK_IMPORTED_MODULE_5__["ScriptService"],
                _services_recaptcha_v3_service__WEBPACK_IMPORTED_MODULE_4__["ReCaptchaV3Service"]
            ],
            exports: [
                _components_recaptcha_2_component__WEBPACK_IMPORTED_MODULE_3__["ReCaptcha2Component"],
                _components_invisible_recaptcha_component__WEBPACK_IMPORTED_MODULE_2__["InvisibleReCaptchaComponent"]
            ]
        })
    ], NgxCaptchaModule);
    return NgxCaptchaModule;
}());



/***/ }),

/***/ "./GoogleCaptcha/ngx-captcha-lib/src/lib/services/recaptcha_v3.service.ts":
/*!********************************************************************************!*\
  !*** ./GoogleCaptcha/ngx-captcha-lib/src/lib/services/recaptcha_v3.service.ts ***!
  \********************************************************************************/
/*! exports provided: ReCaptchaV3Service */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReCaptchaV3Service", function() { return ReCaptchaV3Service; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _script_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./script.service */ "./GoogleCaptcha/ngx-captcha-lib/src/lib/services/script.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ReCaptchaV3Service = /** @class */ (function () {
    function ReCaptchaV3Service(scriptService, zone) {
        this.scriptService = scriptService;
        this.zone = zone;
    }
    /**
     * Executes reCaptcha v3 with given action and passes token via callback. You need to verify
     * this callback in your backend to get meaningful results.
     *
     * For more information see https://developers.google.com/recaptcha/docs/v3
     *
     * @param siteKey Site key found in your google admin panel
     * @param action Action to log
     */
    ReCaptchaV3Service.prototype.execute = function (siteKey, action, callback, config) {
        var _this = this;
        var useGlobalDomain = config && config.useGlobalDomain ? true : false;
        this.scriptService.registerCaptchaScript(useGlobalDomain, siteKey, function (grecaptcha) {
            _this.zone.runOutsideAngular(function () {
                grecaptcha.execute(siteKey, {
                    action: action
                }).then(function (token) {
                    _this.zone.run(function () { return callback(token); });
                });
            });
        });
    };
    ReCaptchaV3Service = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_script_service__WEBPACK_IMPORTED_MODULE_1__["ScriptService"],
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]])
    ], ReCaptchaV3Service);
    return ReCaptchaV3Service;
}());



/***/ }),

/***/ "./GoogleCaptcha/ngx-captcha-lib/src/lib/services/script.service.ts":
/*!**************************************************************************!*\
  !*** ./GoogleCaptcha/ngx-captcha-lib/src/lib/services/script.service.ts ***!
  \**************************************************************************/
/*! exports provided: ScriptService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ScriptService", function() { return ScriptService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ScriptService = /** @class */ (function () {
    function ScriptService(zone) {
        this.zone = zone;
        /**
         * Name of the global google recaptcha script
         */
        this.windowGrecaptcha = 'grecaptcha';
        /**
        * Name of the global callback
        */
        this.windowOnLoadCallbackProperty = 'ngx_captcha_onload_callback';
        this.globalDomain = 'recaptcha.net';
        this.defaultDomain = 'google.com';
    }
    ScriptService.prototype.registerCaptchaScript = function (useGlobalDomain, render, onLoad, language) {
        var _this = this;
        if (this.grecaptchaScriptLoaded()) {
            // recaptcha script is already loaded
            // just call the callback
            this.zone.run(function () {
                onLoad(window[_this.windowGrecaptcha]);
            });
            return;
        }
        // we need to patch the callback through global variable, otherwise callback is not accessible
        // note: https://github.com/Enngage/ngx-captcha/issues/2
        window[this.windowOnLoadCallbackProperty] = (function () { return _this.zone.run(onLoad.bind(_this, window[_this.windowGrecaptcha])); });
        // prepare script elem
        var scriptElem = document.createElement('script');
        scriptElem.innerHTML = '';
        scriptElem.src = this.getCaptchaScriptUrl(useGlobalDomain, render, language);
        scriptElem.async = true;
        scriptElem.defer = true;
        // add script to header
        document.getElementsByTagName('head')[0].appendChild(scriptElem);
    };
    ScriptService.prototype.cleanup = function () {
        window[this.windowOnLoadCallbackProperty] = undefined;
        window[this.windowGrecaptcha] = undefined;
    };
    /**
     * Indicates if google recaptcha script is available and ready to be used
     */
    ScriptService.prototype.grecaptchaScriptLoaded = function () {
        if (window[this.windowOnLoadCallbackProperty] && window[this.windowGrecaptcha]) {
            return true;
        }
        return false;
    };
    /**
     * Gets language param used in script url
     */
    ScriptService.prototype.getLanguageParam = function (hl) {
        if (!hl) {
            return '';
        }
        return "&hl=" + hl;
    };
    /**
    * Url to google api script
    */
    ScriptService.prototype.getCaptchaScriptUrl = function (useGlobalDomain, render, language) {
        var domain = useGlobalDomain ? this.globalDomain : this.defaultDomain;
        // tslint:disable-next-line:max-line-length
        return "https://www." + domain + "/recaptcha/api.js?onload=" + this.windowOnLoadCallbackProperty + "&render=" + render + this.getLanguageParam(language);
    };
    ScriptService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]])
    ], ScriptService);
    return ScriptService;
}());



/***/ }),

/***/ "./node_modules/moment/locale sync recursive ^\\.\\/.*$":
/*!**************************************************!*\
  !*** ./node_modules/moment/locale sync ^\.\/.*$ ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": "./node_modules/moment/locale/af.js",
	"./af.js": "./node_modules/moment/locale/af.js",
	"./ar": "./node_modules/moment/locale/ar.js",
	"./ar-dz": "./node_modules/moment/locale/ar-dz.js",
	"./ar-dz.js": "./node_modules/moment/locale/ar-dz.js",
	"./ar-kw": "./node_modules/moment/locale/ar-kw.js",
	"./ar-kw.js": "./node_modules/moment/locale/ar-kw.js",
	"./ar-ly": "./node_modules/moment/locale/ar-ly.js",
	"./ar-ly.js": "./node_modules/moment/locale/ar-ly.js",
	"./ar-ma": "./node_modules/moment/locale/ar-ma.js",
	"./ar-ma.js": "./node_modules/moment/locale/ar-ma.js",
	"./ar-sa": "./node_modules/moment/locale/ar-sa.js",
	"./ar-sa.js": "./node_modules/moment/locale/ar-sa.js",
	"./ar-tn": "./node_modules/moment/locale/ar-tn.js",
	"./ar-tn.js": "./node_modules/moment/locale/ar-tn.js",
	"./ar.js": "./node_modules/moment/locale/ar.js",
	"./az": "./node_modules/moment/locale/az.js",
	"./az.js": "./node_modules/moment/locale/az.js",
	"./be": "./node_modules/moment/locale/be.js",
	"./be.js": "./node_modules/moment/locale/be.js",
	"./bg": "./node_modules/moment/locale/bg.js",
	"./bg.js": "./node_modules/moment/locale/bg.js",
	"./bm": "./node_modules/moment/locale/bm.js",
	"./bm.js": "./node_modules/moment/locale/bm.js",
	"./bn": "./node_modules/moment/locale/bn.js",
	"./bn.js": "./node_modules/moment/locale/bn.js",
	"./bo": "./node_modules/moment/locale/bo.js",
	"./bo.js": "./node_modules/moment/locale/bo.js",
	"./br": "./node_modules/moment/locale/br.js",
	"./br.js": "./node_modules/moment/locale/br.js",
	"./bs": "./node_modules/moment/locale/bs.js",
	"./bs.js": "./node_modules/moment/locale/bs.js",
	"./ca": "./node_modules/moment/locale/ca.js",
	"./ca.js": "./node_modules/moment/locale/ca.js",
	"./cs": "./node_modules/moment/locale/cs.js",
	"./cs.js": "./node_modules/moment/locale/cs.js",
	"./cv": "./node_modules/moment/locale/cv.js",
	"./cv.js": "./node_modules/moment/locale/cv.js",
	"./cy": "./node_modules/moment/locale/cy.js",
	"./cy.js": "./node_modules/moment/locale/cy.js",
	"./da": "./node_modules/moment/locale/da.js",
	"./da.js": "./node_modules/moment/locale/da.js",
	"./de": "./node_modules/moment/locale/de.js",
	"./de-at": "./node_modules/moment/locale/de-at.js",
	"./de-at.js": "./node_modules/moment/locale/de-at.js",
	"./de-ch": "./node_modules/moment/locale/de-ch.js",
	"./de-ch.js": "./node_modules/moment/locale/de-ch.js",
	"./de.js": "./node_modules/moment/locale/de.js",
	"./dv": "./node_modules/moment/locale/dv.js",
	"./dv.js": "./node_modules/moment/locale/dv.js",
	"./el": "./node_modules/moment/locale/el.js",
	"./el.js": "./node_modules/moment/locale/el.js",
	"./en-au": "./node_modules/moment/locale/en-au.js",
	"./en-au.js": "./node_modules/moment/locale/en-au.js",
	"./en-ca": "./node_modules/moment/locale/en-ca.js",
	"./en-ca.js": "./node_modules/moment/locale/en-ca.js",
	"./en-gb": "./node_modules/moment/locale/en-gb.js",
	"./en-gb.js": "./node_modules/moment/locale/en-gb.js",
	"./en-ie": "./node_modules/moment/locale/en-ie.js",
	"./en-ie.js": "./node_modules/moment/locale/en-ie.js",
	"./en-il": "./node_modules/moment/locale/en-il.js",
	"./en-il.js": "./node_modules/moment/locale/en-il.js",
	"./en-nz": "./node_modules/moment/locale/en-nz.js",
	"./en-nz.js": "./node_modules/moment/locale/en-nz.js",
	"./eo": "./node_modules/moment/locale/eo.js",
	"./eo.js": "./node_modules/moment/locale/eo.js",
	"./es": "./node_modules/moment/locale/es.js",
	"./es-do": "./node_modules/moment/locale/es-do.js",
	"./es-do.js": "./node_modules/moment/locale/es-do.js",
	"./es-us": "./node_modules/moment/locale/es-us.js",
	"./es-us.js": "./node_modules/moment/locale/es-us.js",
	"./es.js": "./node_modules/moment/locale/es.js",
	"./et": "./node_modules/moment/locale/et.js",
	"./et.js": "./node_modules/moment/locale/et.js",
	"./eu": "./node_modules/moment/locale/eu.js",
	"./eu.js": "./node_modules/moment/locale/eu.js",
	"./fa": "./node_modules/moment/locale/fa.js",
	"./fa.js": "./node_modules/moment/locale/fa.js",
	"./fi": "./node_modules/moment/locale/fi.js",
	"./fi.js": "./node_modules/moment/locale/fi.js",
	"./fo": "./node_modules/moment/locale/fo.js",
	"./fo.js": "./node_modules/moment/locale/fo.js",
	"./fr": "./node_modules/moment/locale/fr.js",
	"./fr-ca": "./node_modules/moment/locale/fr-ca.js",
	"./fr-ca.js": "./node_modules/moment/locale/fr-ca.js",
	"./fr-ch": "./node_modules/moment/locale/fr-ch.js",
	"./fr-ch.js": "./node_modules/moment/locale/fr-ch.js",
	"./fr.js": "./node_modules/moment/locale/fr.js",
	"./fy": "./node_modules/moment/locale/fy.js",
	"./fy.js": "./node_modules/moment/locale/fy.js",
	"./gd": "./node_modules/moment/locale/gd.js",
	"./gd.js": "./node_modules/moment/locale/gd.js",
	"./gl": "./node_modules/moment/locale/gl.js",
	"./gl.js": "./node_modules/moment/locale/gl.js",
	"./gom-latn": "./node_modules/moment/locale/gom-latn.js",
	"./gom-latn.js": "./node_modules/moment/locale/gom-latn.js",
	"./gu": "./node_modules/moment/locale/gu.js",
	"./gu.js": "./node_modules/moment/locale/gu.js",
	"./he": "./node_modules/moment/locale/he.js",
	"./he.js": "./node_modules/moment/locale/he.js",
	"./hi": "./node_modules/moment/locale/hi.js",
	"./hi.js": "./node_modules/moment/locale/hi.js",
	"./hr": "./node_modules/moment/locale/hr.js",
	"./hr.js": "./node_modules/moment/locale/hr.js",
	"./hu": "./node_modules/moment/locale/hu.js",
	"./hu.js": "./node_modules/moment/locale/hu.js",
	"./hy-am": "./node_modules/moment/locale/hy-am.js",
	"./hy-am.js": "./node_modules/moment/locale/hy-am.js",
	"./id": "./node_modules/moment/locale/id.js",
	"./id.js": "./node_modules/moment/locale/id.js",
	"./is": "./node_modules/moment/locale/is.js",
	"./is.js": "./node_modules/moment/locale/is.js",
	"./it": "./node_modules/moment/locale/it.js",
	"./it.js": "./node_modules/moment/locale/it.js",
	"./ja": "./node_modules/moment/locale/ja.js",
	"./ja.js": "./node_modules/moment/locale/ja.js",
	"./jv": "./node_modules/moment/locale/jv.js",
	"./jv.js": "./node_modules/moment/locale/jv.js",
	"./ka": "./node_modules/moment/locale/ka.js",
	"./ka.js": "./node_modules/moment/locale/ka.js",
	"./kk": "./node_modules/moment/locale/kk.js",
	"./kk.js": "./node_modules/moment/locale/kk.js",
	"./km": "./node_modules/moment/locale/km.js",
	"./km.js": "./node_modules/moment/locale/km.js",
	"./kn": "./node_modules/moment/locale/kn.js",
	"./kn.js": "./node_modules/moment/locale/kn.js",
	"./ko": "./node_modules/moment/locale/ko.js",
	"./ko.js": "./node_modules/moment/locale/ko.js",
	"./ky": "./node_modules/moment/locale/ky.js",
	"./ky.js": "./node_modules/moment/locale/ky.js",
	"./lb": "./node_modules/moment/locale/lb.js",
	"./lb.js": "./node_modules/moment/locale/lb.js",
	"./lo": "./node_modules/moment/locale/lo.js",
	"./lo.js": "./node_modules/moment/locale/lo.js",
	"./lt": "./node_modules/moment/locale/lt.js",
	"./lt.js": "./node_modules/moment/locale/lt.js",
	"./lv": "./node_modules/moment/locale/lv.js",
	"./lv.js": "./node_modules/moment/locale/lv.js",
	"./me": "./node_modules/moment/locale/me.js",
	"./me.js": "./node_modules/moment/locale/me.js",
	"./mi": "./node_modules/moment/locale/mi.js",
	"./mi.js": "./node_modules/moment/locale/mi.js",
	"./mk": "./node_modules/moment/locale/mk.js",
	"./mk.js": "./node_modules/moment/locale/mk.js",
	"./ml": "./node_modules/moment/locale/ml.js",
	"./ml.js": "./node_modules/moment/locale/ml.js",
	"./mr": "./node_modules/moment/locale/mr.js",
	"./mr.js": "./node_modules/moment/locale/mr.js",
	"./ms": "./node_modules/moment/locale/ms.js",
	"./ms-my": "./node_modules/moment/locale/ms-my.js",
	"./ms-my.js": "./node_modules/moment/locale/ms-my.js",
	"./ms.js": "./node_modules/moment/locale/ms.js",
	"./mt": "./node_modules/moment/locale/mt.js",
	"./mt.js": "./node_modules/moment/locale/mt.js",
	"./my": "./node_modules/moment/locale/my.js",
	"./my.js": "./node_modules/moment/locale/my.js",
	"./nb": "./node_modules/moment/locale/nb.js",
	"./nb.js": "./node_modules/moment/locale/nb.js",
	"./ne": "./node_modules/moment/locale/ne.js",
	"./ne.js": "./node_modules/moment/locale/ne.js",
	"./nl": "./node_modules/moment/locale/nl.js",
	"./nl-be": "./node_modules/moment/locale/nl-be.js",
	"./nl-be.js": "./node_modules/moment/locale/nl-be.js",
	"./nl.js": "./node_modules/moment/locale/nl.js",
	"./nn": "./node_modules/moment/locale/nn.js",
	"./nn.js": "./node_modules/moment/locale/nn.js",
	"./pa-in": "./node_modules/moment/locale/pa-in.js",
	"./pa-in.js": "./node_modules/moment/locale/pa-in.js",
	"./pl": "./node_modules/moment/locale/pl.js",
	"./pl.js": "./node_modules/moment/locale/pl.js",
	"./pt": "./node_modules/moment/locale/pt.js",
	"./pt-br": "./node_modules/moment/locale/pt-br.js",
	"./pt-br.js": "./node_modules/moment/locale/pt-br.js",
	"./pt.js": "./node_modules/moment/locale/pt.js",
	"./ro": "./node_modules/moment/locale/ro.js",
	"./ro.js": "./node_modules/moment/locale/ro.js",
	"./ru": "./node_modules/moment/locale/ru.js",
	"./ru.js": "./node_modules/moment/locale/ru.js",
	"./sd": "./node_modules/moment/locale/sd.js",
	"./sd.js": "./node_modules/moment/locale/sd.js",
	"./se": "./node_modules/moment/locale/se.js",
	"./se.js": "./node_modules/moment/locale/se.js",
	"./si": "./node_modules/moment/locale/si.js",
	"./si.js": "./node_modules/moment/locale/si.js",
	"./sk": "./node_modules/moment/locale/sk.js",
	"./sk.js": "./node_modules/moment/locale/sk.js",
	"./sl": "./node_modules/moment/locale/sl.js",
	"./sl.js": "./node_modules/moment/locale/sl.js",
	"./sq": "./node_modules/moment/locale/sq.js",
	"./sq.js": "./node_modules/moment/locale/sq.js",
	"./sr": "./node_modules/moment/locale/sr.js",
	"./sr-cyrl": "./node_modules/moment/locale/sr-cyrl.js",
	"./sr-cyrl.js": "./node_modules/moment/locale/sr-cyrl.js",
	"./sr.js": "./node_modules/moment/locale/sr.js",
	"./ss": "./node_modules/moment/locale/ss.js",
	"./ss.js": "./node_modules/moment/locale/ss.js",
	"./sv": "./node_modules/moment/locale/sv.js",
	"./sv.js": "./node_modules/moment/locale/sv.js",
	"./sw": "./node_modules/moment/locale/sw.js",
	"./sw.js": "./node_modules/moment/locale/sw.js",
	"./ta": "./node_modules/moment/locale/ta.js",
	"./ta.js": "./node_modules/moment/locale/ta.js",
	"./te": "./node_modules/moment/locale/te.js",
	"./te.js": "./node_modules/moment/locale/te.js",
	"./tet": "./node_modules/moment/locale/tet.js",
	"./tet.js": "./node_modules/moment/locale/tet.js",
	"./tg": "./node_modules/moment/locale/tg.js",
	"./tg.js": "./node_modules/moment/locale/tg.js",
	"./th": "./node_modules/moment/locale/th.js",
	"./th.js": "./node_modules/moment/locale/th.js",
	"./tl-ph": "./node_modules/moment/locale/tl-ph.js",
	"./tl-ph.js": "./node_modules/moment/locale/tl-ph.js",
	"./tlh": "./node_modules/moment/locale/tlh.js",
	"./tlh.js": "./node_modules/moment/locale/tlh.js",
	"./tr": "./node_modules/moment/locale/tr.js",
	"./tr.js": "./node_modules/moment/locale/tr.js",
	"./tzl": "./node_modules/moment/locale/tzl.js",
	"./tzl.js": "./node_modules/moment/locale/tzl.js",
	"./tzm": "./node_modules/moment/locale/tzm.js",
	"./tzm-latn": "./node_modules/moment/locale/tzm-latn.js",
	"./tzm-latn.js": "./node_modules/moment/locale/tzm-latn.js",
	"./tzm.js": "./node_modules/moment/locale/tzm.js",
	"./ug-cn": "./node_modules/moment/locale/ug-cn.js",
	"./ug-cn.js": "./node_modules/moment/locale/ug-cn.js",
	"./uk": "./node_modules/moment/locale/uk.js",
	"./uk.js": "./node_modules/moment/locale/uk.js",
	"./ur": "./node_modules/moment/locale/ur.js",
	"./ur.js": "./node_modules/moment/locale/ur.js",
	"./uz": "./node_modules/moment/locale/uz.js",
	"./uz-latn": "./node_modules/moment/locale/uz-latn.js",
	"./uz-latn.js": "./node_modules/moment/locale/uz-latn.js",
	"./uz.js": "./node_modules/moment/locale/uz.js",
	"./vi": "./node_modules/moment/locale/vi.js",
	"./vi.js": "./node_modules/moment/locale/vi.js",
	"./x-pseudo": "./node_modules/moment/locale/x-pseudo.js",
	"./x-pseudo.js": "./node_modules/moment/locale/x-pseudo.js",
	"./yo": "./node_modules/moment/locale/yo.js",
	"./yo.js": "./node_modules/moment/locale/yo.js",
	"./zh-cn": "./node_modules/moment/locale/zh-cn.js",
	"./zh-cn.js": "./node_modules/moment/locale/zh-cn.js",
	"./zh-hk": "./node_modules/moment/locale/zh-hk.js",
	"./zh-hk.js": "./node_modules/moment/locale/zh-hk.js",
	"./zh-tw": "./node_modules/moment/locale/zh-tw.js",
	"./zh-tw.js": "./node_modules/moment/locale/zh-tw.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) { // check for number or string
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return id;
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./node_modules/moment/locale sync recursive ^\\.\\/.*$";

/***/ }),

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app-error.handler.ts":
/*!**************************************!*\
  !*** ./src/app/app-error.handler.ts ***!
  \**************************************/
/*! exports provided: AppErrorHandler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppErrorHandler", function() { return AppErrorHandler; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var AppErrorHandler = /** @class */ (function (_super) {
    __extends(AppErrorHandler, _super);
    //private alertService: AlertService;
    function AppErrorHandler() {
        return _super.call(this) || this;
    }
    AppErrorHandler.prototype.handleError = function (error) {
        //if (this.alertService == null) {
        //    this.alertService = this.injector.get(AlertService);
        //}
        //this.alertService.showStickyMessage("Fatal Error!", "An unresolved error has occured. Please reload the page to correct this error", MessageSeverity.warn);
        //this.alertService.showStickyMessage("Unhandled Error", error.message || error, MessageSeverity.error, error);
        if (confirm("Fatal Error!\nAn unresolved error has occured. Do you want to reload the page to correct this?\n\nError: " + error.message))
            window.location.reload(true);
        _super.prototype.handleError.call(this, error);
    };
    AppErrorHandler = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [])
    ], AppErrorHandler);
    return AppErrorHandler;
}(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ErrorHandler"]));



/***/ }),

/***/ "./src/app/app-routing.module.ts":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./services/auth.service */ "./src/app/services/auth.service.ts");
/* harmony import */ var _services_auth_guard_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./services/auth-guard.service */ "./src/app/services/auth-guard.service.ts");
/* harmony import */ var _components_landing_landing_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/landing/landing.component */ "./src/app/components/landing/landing.component.ts");
/* harmony import */ var _components_not_found_not_found_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/not-found/not-found.component */ "./src/app/components/not-found/not-found.component.ts");
/* harmony import */ var _components_login_login_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/login/login.component */ "./src/app/components/login/login.component.ts");
/* harmony import */ var _components_register_register_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/register/register.component */ "./src/app/components/register/register.component.ts");
/* harmony import */ var _components_register_confirmation_register_confirmation_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/register-confirmation/register-confirmation.component */ "./src/app/components/register-confirmation/register-confirmation.component.ts");
/* harmony import */ var _components_register_confirmation_email_register_confirmation_email_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/register-confirmation-email/register-confirmation-email.component */ "./src/app/components/register-confirmation-email/register-confirmation-email.component.ts");
/* harmony import */ var _components_forgot_username_forgot_username_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/forgot-username/forgot-username.component */ "./src/app/components/forgot-username/forgot-username.component.ts");
/* harmony import */ var _components_forgot_username_confirmation_forgot_username_confirmation_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/forgot-username-confirmation/forgot-username-confirmation.component */ "./src/app/components/forgot-username-confirmation/forgot-username-confirmation.component.ts");
/* harmony import */ var _components_forgot_password_forgot_password_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/forgot-password/forgot-password.component */ "./src/app/components/forgot-password/forgot-password.component.ts");
/* harmony import */ var _components_forgot_password_confirmation_forgot_password_confirmation_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./components/forgot-password-confirmation/forgot-password-confirmation.component */ "./src/app/components/forgot-password-confirmation/forgot-password-confirmation.component.ts");
/* harmony import */ var _components_invoices_closed_invoices_closed_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components/invoices-closed/invoices-closed.component */ "./src/app/components/invoices-closed/invoices-closed.component.ts");
/* harmony import */ var _components_contact_us_contact_us_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./components/contact-us/contact-us.component */ "./src/app/components/contact-us/contact-us.component.ts");
/* harmony import */ var _components_contact_us_ext_contact_us_ext_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./components/contact-us-ext/contact-us-ext.component */ "./src/app/components/contact-us-ext/contact-us-ext.component.ts");
/* harmony import */ var _components_settings_settings_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./components/settings/settings.component */ "./src/app/components/settings/settings.component.ts");
/* harmony import */ var _components_paymentprofile_payment_profile_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./components/paymentprofile/payment-profile.component */ "./src/app/components/paymentprofile/payment-profile.component.ts");
/* harmony import */ var _components_paymentpaynow_payment_paynow_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./components/paymentpaynow/payment-paynow.component */ "./src/app/components/paymentpaynow/payment-paynow.component.ts");
/* harmony import */ var _components_paymentautopay_payment_autopay_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./components/paymentautopay/payment-autopay.component */ "./src/app/components/paymentautopay/payment-autopay.component.ts");
/* harmony import */ var _components_paymentedit_payment_edit_component__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./components/paymentedit/payment-edit.component */ "./src/app/components/paymentedit/payment-edit.component.ts");
/* harmony import */ var _components_privacy_privacy_component__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./components/privacy/privacy.component */ "./src/app/components/privacy/privacy.component.ts");
/* harmony import */ var _components_terms_terms_component__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./components/terms/terms.component */ "./src/app/components/terms/terms.component.ts");
/* harmony import */ var _components_reset_password_reset_password_component__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./components/reset-password/reset-password.component */ "./src/app/components/reset-password/reset-password.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

























var routes = [
    { path: "login", component: _components_login_login_component__WEBPACK_IMPORTED_MODULE_6__["LoginComponent"], data: { title: "Login" } },
    {
        path: 'secure',
        canActivate: [_services_auth_guard_service__WEBPACK_IMPORTED_MODULE_3__["AuthGuard"]],
        canActivateChild: [_services_auth_guard_service__WEBPACK_IMPORTED_MODULE_3__["AuthGuard"]],
        children: [
            {
                path: "payment",
                children: [
                    { path: "paynow", component: _components_paymentpaynow_payment_paynow_component__WEBPACK_IMPORTED_MODULE_19__["PaymentPaynowComponent"], data: { title: "Pay Now" } },
                    { path: "profile", component: _components_paymentprofile_payment_profile_component__WEBPACK_IMPORTED_MODULE_18__["PaymentProfileComponent"], data: { title: "Payment Profiles" } },
                    { path: "autopay", component: _components_paymentautopay_payment_autopay_component__WEBPACK_IMPORTED_MODULE_20__["PaymentAutopayComponent"], data: { title: "Auto Pay" } },
                    { path: ":id", component: _components_paymentedit_payment_edit_component__WEBPACK_IMPORTED_MODULE_21__["PaymentEditComponent"], data: { title: "Edit Payment Method" } },
                    { path: "", component: _components_paymentedit_payment_edit_component__WEBPACK_IMPORTED_MODULE_21__["PaymentEditComponent"], data: { title: "Add Payment Method" }, pathMatch: 'full' },
                ]
            },
            { path: "invoices", component: _components_invoices_closed_invoices_closed_component__WEBPACK_IMPORTED_MODULE_14__["InvoiceClosedComponent"], data: { title: "Invoice History" } },
            { path: "contactus", component: _components_contact_us_contact_us_component__WEBPACK_IMPORTED_MODULE_15__["ContactUsComponent"], data: { title: "Contact Us" } },
            { path: "settings", component: _components_settings_settings_component__WEBPACK_IMPORTED_MODULE_17__["SettingsComponent"], data: { title: "Settings" } },
            { path: "", component: _components_landing_landing_component__WEBPACK_IMPORTED_MODULE_4__["LandingComponent"], data: { title: "Invoices" } },
        ]
    },
    { path: "contactus", component: _components_contact_us_ext_contact_us_ext_component__WEBPACK_IMPORTED_MODULE_16__["ContactUsExtComponent"], data: { title: "Contact Us" } },
    { path: "privacy", component: _components_privacy_privacy_component__WEBPACK_IMPORTED_MODULE_22__["PrivacyComponent"], data: { title: "Privacy Policy" } },
    { path: "terms", component: _components_terms_terms_component__WEBPACK_IMPORTED_MODULE_23__["TermsComponent"], data: { title: "Terms & Conditions" } },
    {
        path: "register",
        children: [
            { path: ":id/:code", component: _components_register_confirmation_email_register_confirmation_email_component__WEBPACK_IMPORTED_MODULE_9__["RegisterConfirmationEmailComponent"], data: { title: "Email Confirmation" } },
            { path: ":id", component: _components_register_confirmation_register_confirmation_component__WEBPACK_IMPORTED_MODULE_8__["RegisterConfirmationComponent"], data: { title: "Confirmation" } },
            { path: '', component: _components_register_register_component__WEBPACK_IMPORTED_MODULE_7__["RegisterComponent"], data: { title: "Register" }, pathMatch: 'full' },
        ]
    },
    {
        path: "forgot",
        children: [
            { path: 'username/confirmation', component: _components_forgot_username_confirmation_forgot_username_confirmation_component__WEBPACK_IMPORTED_MODULE_11__["ForgotUserNameConfirmationComponent"], data: { title: "Confirmation" } },
            { path: 'username', component: _components_forgot_username_forgot_username_component__WEBPACK_IMPORTED_MODULE_10__["ForgotUserNameComponent"], data: { title: "Forgot Username" }, pathMatch: 'full' },
            { path: 'password/confirmation', component: _components_forgot_password_confirmation_forgot_password_confirmation_component__WEBPACK_IMPORTED_MODULE_13__["ForgotPasswordConfirmationComponent"], data: { title: "Confirmation" } },
            { path: "password/:id/:code", component: _components_reset_password_reset_password_component__WEBPACK_IMPORTED_MODULE_24__["ResetPasswordComponent"], data: { title: "Reset Password" } },
            { path: 'password', component: _components_forgot_password_forgot_password_component__WEBPACK_IMPORTED_MODULE_12__["ForgotPasswordComponent"], data: { title: "Forgot Password" }, pathMatch: 'full' },
        ]
    },
    { path: "landing", redirectTo: 'secure' },
    { path: "", redirectTo: 'secure', pathMatch: 'full' },
    { path: "**", component: _components_not_found_not_found_component__WEBPACK_IMPORTED_MODULE_5__["NotFoundComponent"], data: { title: "Page Not Found" } },
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes, { useHash: true })],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]],
            providers: [_services_auth_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"], _services_auth_guard_service__WEBPACK_IMPORTED_MODULE_3__["AuthGuard"]]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule, getBaseUrl */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getBaseUrl", function() { return getBaseUrl; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/fesm5/animations.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/fesm5/ngx-translate-core.js");
/* harmony import */ var _swimlane_ngx_datatable__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @swimlane/ngx-datatable */ "./node_modules/@swimlane/ngx-datatable/release/index.js");
/* harmony import */ var _swimlane_ngx_datatable__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_swimlane_ngx_datatable__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var ngx_toasta__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ngx-toasta */ "./node_modules/ngx-toasta/fesm5/ngx-toasta.js");
/* harmony import */ var ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ngx-bootstrap/modal */ "./node_modules/ngx-bootstrap/modal/index.js");
/* harmony import */ var ngx_bootstrap_tooltip__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ngx-bootstrap/tooltip */ "./node_modules/ngx-bootstrap/tooltip/index.js");
/* harmony import */ var ngx_bootstrap_popover__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ngx-bootstrap/popover */ "./node_modules/ngx-bootstrap/popover/index.js");
/* harmony import */ var ngx_bootstrap_dropdown__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ngx-bootstrap/dropdown */ "./node_modules/ngx-bootstrap/dropdown/index.js");
/* harmony import */ var ngx_bootstrap_carousel__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ngx-bootstrap/carousel */ "./node_modules/ngx-bootstrap/carousel/index.js");
/* harmony import */ var ng2_charts__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ng2-charts */ "./node_modules/ng2-charts/index.js");
/* harmony import */ var ng2_charts__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(ng2_charts__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var _GoogleCaptcha_ngx_captcha_lib_src_lib__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../GoogleCaptcha/ngx-captcha-lib/src/lib */ "./GoogleCaptcha/ngx-captcha-lib/src/lib/index.ts");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./app-routing.module */ "./src/app/app-routing.module.ts");
/* harmony import */ var _app_error_handler__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./app-error.handler */ "./src/app/app-error.handler.ts");
/* harmony import */ var _services_app_title_service__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./services/app-title.service */ "./src/app/services/app-title.service.ts");
/* harmony import */ var _services_app_translation_service__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./services/app-translation.service */ "./src/app/services/app-translation.service.ts");
/* harmony import */ var _services_configuration_service__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./services/configuration.service */ "./src/app/services/configuration.service.ts");
/* harmony import */ var _services_alert_service__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./services/alert.service */ "./src/app/services/alert.service.ts");
/* harmony import */ var _services_local_store_manager_service__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./services/local-store-manager.service */ "./src/app/services/local-store-manager.service.ts");
/* harmony import */ var _services_endpoint_factory_service__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./services/endpoint-factory.service */ "./src/app/services/endpoint-factory.service.ts");
/* harmony import */ var _services_notification_service__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./services/notification.service */ "./src/app/services/notification.service.ts");
/* harmony import */ var _services_notification_endpoint_service__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./services/notification-endpoint.service */ "./src/app/services/notification-endpoint.service.ts");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var _services_account_endpoint_service__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./services/account-endpoint.service */ "./src/app/services/account-endpoint.service.ts");
/* harmony import */ var _services_payment_service__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./services/payment.service */ "./src/app/services/payment.service.ts");
/* harmony import */ var _services_payment_service_endpoint_service__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./services/payment-service-endpoint.service */ "./src/app/services/payment-service-endpoint.service.ts");
/* harmony import */ var _services_invoice_service__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./services/invoice.service */ "./src/app/services/invoice.service.ts");
/* harmony import */ var _services_invoice_endpoint_service__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./services/invoice-endpoint.service */ "./src/app/services/invoice-endpoint.service.ts");
/* harmony import */ var _directives_equal_validator_directive__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./directives/equal-validator.directive */ "./src/app/directives/equal-validator.directive.ts");
/* harmony import */ var _directives_notequal_validator_directive__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./directives/notequal-validator.directive */ "./src/app/directives/notequal-validator.directive.ts");
/* harmony import */ var _directives_last_element_directive__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ./directives/last-element.directive */ "./src/app/directives/last-element.directive.ts");
/* harmony import */ var _directives_autofocus_directive__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ./directives/autofocus.directive */ "./src/app/directives/autofocus.directive.ts");
/* harmony import */ var _directives_bootstrap_tab_directive__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! ./directives/bootstrap-tab.directive */ "./src/app/directives/bootstrap-tab.directive.ts");
/* harmony import */ var _directives_bootstrap_toggle_directive__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! ./directives/bootstrap-toggle.directive */ "./src/app/directives/bootstrap-toggle.directive.ts");
/* harmony import */ var _directives_bootstrap_select_directive__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! ./directives/bootstrap-select.directive */ "./src/app/directives/bootstrap-select.directive.ts");
/* harmony import */ var _directives_bootstrap_datepicker_directive__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! ./directives/bootstrap-datepicker.directive */ "./src/app/directives/bootstrap-datepicker.directive.ts");
/* harmony import */ var _pipes_group_by_pipe__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(/*! ./pipes/group-by.pipe */ "./src/app/pipes/group-by.pipe.ts");
/* harmony import */ var _components_app_component__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(/*! ./components/app.component */ "./src/app/components/app.component.ts");
/* harmony import */ var _components_landing_landing_component__WEBPACK_IMPORTED_MODULE_41__ = __webpack_require__(/*! ./components/landing/landing.component */ "./src/app/components/landing/landing.component.ts");
/* harmony import */ var _components_login_login_component__WEBPACK_IMPORTED_MODULE_42__ = __webpack_require__(/*! ./components/login/login.component */ "./src/app/components/login/login.component.ts");
/* harmony import */ var _components_settings_settings_component__WEBPACK_IMPORTED_MODULE_43__ = __webpack_require__(/*! ./components/settings/settings.component */ "./src/app/components/settings/settings.component.ts");
/* harmony import */ var _components_not_found_not_found_component__WEBPACK_IMPORTED_MODULE_44__ = __webpack_require__(/*! ./components/not-found/not-found.component */ "./src/app/components/not-found/not-found.component.ts");
/* harmony import */ var _components_controls_todo_demo_component__WEBPACK_IMPORTED_MODULE_45__ = __webpack_require__(/*! ./components/controls/todo-demo.component */ "./src/app/components/controls/todo-demo.component.ts");
/* harmony import */ var _components_controls_statistics_demo_component__WEBPACK_IMPORTED_MODULE_46__ = __webpack_require__(/*! ./components/controls/statistics-demo.component */ "./src/app/components/controls/statistics-demo.component.ts");
/* harmony import */ var _components_controls_notifications_viewer_component__WEBPACK_IMPORTED_MODULE_47__ = __webpack_require__(/*! ./components/controls/notifications-viewer.component */ "./src/app/components/controls/notifications-viewer.component.ts");
/* harmony import */ var _components_controls_search_box_component__WEBPACK_IMPORTED_MODULE_48__ = __webpack_require__(/*! ./components/controls/search-box.component */ "./src/app/components/controls/search-box.component.ts");
/* harmony import */ var _components_controls_user_info_component__WEBPACK_IMPORTED_MODULE_49__ = __webpack_require__(/*! ./components/controls/user-info.component */ "./src/app/components/controls/user-info.component.ts");
/* harmony import */ var _components_controls_user_preferences_component__WEBPACK_IMPORTED_MODULE_50__ = __webpack_require__(/*! ./components/controls/user-preferences.component */ "./src/app/components/controls/user-preferences.component.ts");
/* harmony import */ var _components_controls_users_management_component__WEBPACK_IMPORTED_MODULE_51__ = __webpack_require__(/*! ./components/controls/users-management.component */ "./src/app/components/controls/users-management.component.ts");
/* harmony import */ var _components_controls_roles_management_component__WEBPACK_IMPORTED_MODULE_52__ = __webpack_require__(/*! ./components/controls/roles-management.component */ "./src/app/components/controls/roles-management.component.ts");
/* harmony import */ var _components_controls_role_editor_component__WEBPACK_IMPORTED_MODULE_53__ = __webpack_require__(/*! ./components/controls/role-editor.component */ "./src/app/components/controls/role-editor.component.ts");
/* harmony import */ var _components_register_register_component__WEBPACK_IMPORTED_MODULE_54__ = __webpack_require__(/*! ./components/register/register.component */ "./src/app/components/register/register.component.ts");
/* harmony import */ var _components_register_confirmation_register_confirmation_component__WEBPACK_IMPORTED_MODULE_55__ = __webpack_require__(/*! ./components/register-confirmation/register-confirmation.component */ "./src/app/components/register-confirmation/register-confirmation.component.ts");
/* harmony import */ var _components_register_confirmation_email_register_confirmation_email_component__WEBPACK_IMPORTED_MODULE_56__ = __webpack_require__(/*! ./components/register-confirmation-email/register-confirmation-email.component */ "./src/app/components/register-confirmation-email/register-confirmation-email.component.ts");
/* harmony import */ var _components_forgot_username_forgot_username_component__WEBPACK_IMPORTED_MODULE_57__ = __webpack_require__(/*! ./components/forgot-username/forgot-username.component */ "./src/app/components/forgot-username/forgot-username.component.ts");
/* harmony import */ var _components_forgot_username_confirmation_forgot_username_confirmation_component__WEBPACK_IMPORTED_MODULE_58__ = __webpack_require__(/*! ./components/forgot-username-confirmation/forgot-username-confirmation.component */ "./src/app/components/forgot-username-confirmation/forgot-username-confirmation.component.ts");
/* harmony import */ var _components_forgot_password_forgot_password_component__WEBPACK_IMPORTED_MODULE_59__ = __webpack_require__(/*! ./components/forgot-password/forgot-password.component */ "./src/app/components/forgot-password/forgot-password.component.ts");
/* harmony import */ var _components_forgot_password_confirmation_forgot_password_confirmation_component__WEBPACK_IMPORTED_MODULE_60__ = __webpack_require__(/*! ./components/forgot-password-confirmation/forgot-password-confirmation.component */ "./src/app/components/forgot-password-confirmation/forgot-password-confirmation.component.ts");
/* harmony import */ var _components_reset_password_reset_password_component__WEBPACK_IMPORTED_MODULE_61__ = __webpack_require__(/*! ./components/reset-password/reset-password.component */ "./src/app/components/reset-password/reset-password.component.ts");
/* harmony import */ var _components_paymentprofile_payment_profile_component__WEBPACK_IMPORTED_MODULE_62__ = __webpack_require__(/*! ./components/paymentprofile/payment-profile.component */ "./src/app/components/paymentprofile/payment-profile.component.ts");
/* harmony import */ var _components_paymentpaynow_payment_paynow_component__WEBPACK_IMPORTED_MODULE_63__ = __webpack_require__(/*! ./components/paymentpaynow/payment-paynow.component */ "./src/app/components/paymentpaynow/payment-paynow.component.ts");
/* harmony import */ var _components_paymentautopay_payment_autopay_component__WEBPACK_IMPORTED_MODULE_64__ = __webpack_require__(/*! ./components/paymentautopay/payment-autopay.component */ "./src/app/components/paymentautopay/payment-autopay.component.ts");
/* harmony import */ var _components_paymentedit_payment_edit_component__WEBPACK_IMPORTED_MODULE_65__ = __webpack_require__(/*! ./components/paymentedit/payment-edit.component */ "./src/app/components/paymentedit/payment-edit.component.ts");
/* harmony import */ var _components_privacy_privacy_component__WEBPACK_IMPORTED_MODULE_66__ = __webpack_require__(/*! ./components/privacy/privacy.component */ "./src/app/components/privacy/privacy.component.ts");
/* harmony import */ var _components_terms_terms_component__WEBPACK_IMPORTED_MODULE_67__ = __webpack_require__(/*! ./components/terms/terms.component */ "./src/app/components/terms/terms.component.ts");
/* harmony import */ var _components_contact_us_contact_us_component__WEBPACK_IMPORTED_MODULE_68__ = __webpack_require__(/*! ./components/contact-us/contact-us.component */ "./src/app/components/contact-us/contact-us.component.ts");
/* harmony import */ var _components_contact_us_ext_contact_us_ext_component__WEBPACK_IMPORTED_MODULE_69__ = __webpack_require__(/*! ./components/contact-us-ext/contact-us-ext.component */ "./src/app/components/contact-us-ext/contact-us-ext.component.ts");
/* harmony import */ var _components_invoices_closed_invoices_closed_component__WEBPACK_IMPORTED_MODULE_70__ = __webpack_require__(/*! ./components/invoices-closed/invoices-closed.component */ "./src/app/components/invoices-closed/invoices-closed.component.ts");
/* harmony import */ var _directives_modelstate_directive__WEBPACK_IMPORTED_MODULE_71__ = __webpack_require__(/*! ./directives/modelstate.directive */ "./src/app/directives/modelstate.directive.ts");
/* harmony import */ var _services_language_observable_service__WEBPACK_IMPORTED_MODULE_72__ = __webpack_require__(/*! ./services/language-observable.service */ "./src/app/services/language-observable.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









































































var AppModule = /** @class */ (function () {
    function AppModule(translate) {
        // this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang('en');
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["BrowserModule"],
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_3__["BrowserAnimationsModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClientModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_1__["ReactiveFormsModule"],
                _app_routing_module__WEBPACK_IMPORTED_MODULE_15__["AppRoutingModule"],
                _ngx_translate_core__WEBPACK_IMPORTED_MODULE_5__["TranslateModule"].forRoot({
                    loader: {
                        provide: _ngx_translate_core__WEBPACK_IMPORTED_MODULE_5__["TranslateLoader"],
                        useClass: _services_app_translation_service__WEBPACK_IMPORTED_MODULE_18__["TranslateLanguageLoader"]
                    }
                }),
                _swimlane_ngx_datatable__WEBPACK_IMPORTED_MODULE_6__["NgxDatatableModule"],
                ngx_toasta__WEBPACK_IMPORTED_MODULE_7__["ToastaModule"].forRoot(),
                ngx_bootstrap_tooltip__WEBPACK_IMPORTED_MODULE_9__["TooltipModule"].forRoot(),
                ngx_bootstrap_popover__WEBPACK_IMPORTED_MODULE_10__["PopoverModule"].forRoot(),
                ngx_bootstrap_dropdown__WEBPACK_IMPORTED_MODULE_11__["BsDropdownModule"].forRoot(),
                ngx_bootstrap_carousel__WEBPACK_IMPORTED_MODULE_12__["CarouselModule"].forRoot(),
                ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_8__["ModalModule"].forRoot(),
                ng2_charts__WEBPACK_IMPORTED_MODULE_13__["ChartsModule"],
                _GoogleCaptcha_ngx_captcha_lib_src_lib__WEBPACK_IMPORTED_MODULE_14__["NgxCaptchaModule"]
            ],
            declarations: [
                _components_app_component__WEBPACK_IMPORTED_MODULE_40__["AppComponent"],
                _components_login_login_component__WEBPACK_IMPORTED_MODULE_42__["LoginComponent"],
                _components_settings_settings_component__WEBPACK_IMPORTED_MODULE_43__["SettingsComponent"],
                _components_controls_users_management_component__WEBPACK_IMPORTED_MODULE_51__["UsersManagementComponent"], _components_controls_user_info_component__WEBPACK_IMPORTED_MODULE_49__["UserInfoComponent"], _components_controls_user_preferences_component__WEBPACK_IMPORTED_MODULE_50__["UserPreferencesComponent"],
                _components_controls_roles_management_component__WEBPACK_IMPORTED_MODULE_52__["RolesManagementComponent"], _components_controls_role_editor_component__WEBPACK_IMPORTED_MODULE_53__["RoleEditorComponent"],
                _components_not_found_not_found_component__WEBPACK_IMPORTED_MODULE_44__["NotFoundComponent"],
                _components_controls_notifications_viewer_component__WEBPACK_IMPORTED_MODULE_47__["NotificationsViewerComponent"],
                _components_controls_search_box_component__WEBPACK_IMPORTED_MODULE_48__["SearchBoxComponent"],
                _components_controls_statistics_demo_component__WEBPACK_IMPORTED_MODULE_46__["StatisticsDemoComponent"], _components_controls_todo_demo_component__WEBPACK_IMPORTED_MODULE_45__["TodoDemoComponent"],
                _directives_equal_validator_directive__WEBPACK_IMPORTED_MODULE_31__["EqualValidator"],
                _directives_notequal_validator_directive__WEBPACK_IMPORTED_MODULE_32__["NotEqualValidator"],
                _directives_modelstate_directive__WEBPACK_IMPORTED_MODULE_71__["ModelStateDirective"],
                _directives_last_element_directive__WEBPACK_IMPORTED_MODULE_33__["LastElementDirective"],
                _directives_autofocus_directive__WEBPACK_IMPORTED_MODULE_34__["AutofocusDirective"],
                _directives_bootstrap_tab_directive__WEBPACK_IMPORTED_MODULE_35__["BootstrapTabDirective"],
                _directives_bootstrap_toggle_directive__WEBPACK_IMPORTED_MODULE_36__["BootstrapToggleDirective"],
                _directives_bootstrap_select_directive__WEBPACK_IMPORTED_MODULE_37__["BootstrapSelectDirective"],
                _directives_bootstrap_datepicker_directive__WEBPACK_IMPORTED_MODULE_38__["BootstrapDatepickerDirective"],
                _pipes_group_by_pipe__WEBPACK_IMPORTED_MODULE_39__["GroupByPipe"],
                _components_landing_landing_component__WEBPACK_IMPORTED_MODULE_41__["LandingComponent"],
                _components_register_register_component__WEBPACK_IMPORTED_MODULE_54__["RegisterComponent"],
                _components_register_confirmation_register_confirmation_component__WEBPACK_IMPORTED_MODULE_55__["RegisterConfirmationComponent"],
                _components_register_confirmation_email_register_confirmation_email_component__WEBPACK_IMPORTED_MODULE_56__["RegisterConfirmationEmailComponent"],
                _components_reset_password_reset_password_component__WEBPACK_IMPORTED_MODULE_61__["ResetPasswordComponent"],
                _components_forgot_username_forgot_username_component__WEBPACK_IMPORTED_MODULE_57__["ForgotUserNameComponent"],
                _components_forgot_password_forgot_password_component__WEBPACK_IMPORTED_MODULE_59__["ForgotPasswordComponent"],
                _components_forgot_password_confirmation_forgot_password_confirmation_component__WEBPACK_IMPORTED_MODULE_60__["ForgotPasswordConfirmationComponent"],
                _components_forgot_username_confirmation_forgot_username_confirmation_component__WEBPACK_IMPORTED_MODULE_58__["ForgotUserNameConfirmationComponent"],
                _components_paymentprofile_payment_profile_component__WEBPACK_IMPORTED_MODULE_62__["PaymentProfileComponent"],
                _components_paymentpaynow_payment_paynow_component__WEBPACK_IMPORTED_MODULE_63__["PaymentPaynowComponent"],
                _components_paymentautopay_payment_autopay_component__WEBPACK_IMPORTED_MODULE_64__["PaymentAutopayComponent"],
                _components_paymentedit_payment_edit_component__WEBPACK_IMPORTED_MODULE_65__["PaymentEditComponent"],
                _components_privacy_privacy_component__WEBPACK_IMPORTED_MODULE_66__["PrivacyComponent"],
                _components_terms_terms_component__WEBPACK_IMPORTED_MODULE_67__["TermsComponent"],
                _components_invoices_closed_invoices_closed_component__WEBPACK_IMPORTED_MODULE_70__["InvoiceClosedComponent"],
                _components_contact_us_contact_us_component__WEBPACK_IMPORTED_MODULE_68__["ContactUsComponent"],
                _components_contact_us_ext_contact_us_ext_component__WEBPACK_IMPORTED_MODULE_69__["ContactUsExtComponent"]
            ],
            providers: [
                { provide: 'BASE_URL', useFactory: getBaseUrl },
                { provide: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ErrorHandler"], useClass: _app_error_handler__WEBPACK_IMPORTED_MODULE_16__["AppErrorHandler"] },
                _services_alert_service__WEBPACK_IMPORTED_MODULE_20__["AlertService"],
                _services_configuration_service__WEBPACK_IMPORTED_MODULE_19__["ConfigurationService"],
                _services_app_title_service__WEBPACK_IMPORTED_MODULE_17__["AppTitleService"],
                _services_app_translation_service__WEBPACK_IMPORTED_MODULE_18__["AppTranslationService"],
                _services_notification_service__WEBPACK_IMPORTED_MODULE_23__["NotificationService"],
                _services_notification_endpoint_service__WEBPACK_IMPORTED_MODULE_24__["NotificationEndpoint"],
                _services_account_service__WEBPACK_IMPORTED_MODULE_25__["AccountService"],
                _services_account_endpoint_service__WEBPACK_IMPORTED_MODULE_26__["AccountEndpoint"],
                _services_local_store_manager_service__WEBPACK_IMPORTED_MODULE_21__["LocalStoreManager"],
                _services_endpoint_factory_service__WEBPACK_IMPORTED_MODULE_22__["EndpointFactory"],
                _services_invoice_service__WEBPACK_IMPORTED_MODULE_29__["InvoiceService"],
                _services_invoice_endpoint_service__WEBPACK_IMPORTED_MODULE_30__["InvoiceEndpoint"],
                _services_payment_service__WEBPACK_IMPORTED_MODULE_27__["PaymentService"],
                _services_payment_service_endpoint_service__WEBPACK_IMPORTED_MODULE_28__["PaymentServiceEndpoint"],
                _services_language_observable_service__WEBPACK_IMPORTED_MODULE_72__["LanguageObservableService"]
            ],
            bootstrap: [_components_app_component__WEBPACK_IMPORTED_MODULE_40__["AppComponent"]]
        }),
        __metadata("design:paramtypes", [_ngx_translate_core__WEBPACK_IMPORTED_MODULE_5__["TranslateService"]])
    ], AppModule);
    return AppModule;
}());

function getBaseUrl() {
    return document.getElementsByTagName('base')[0].href;
}


/***/ }),

/***/ "./src/app/assets/locale/ar.json":
/*!***************************************!*\
  !*** ./src/app/assets/locale/ar.json ***!
  \***************************************/
/*! exports provided: app, mainMenu, pageHeader, home, notFound, settings, preferences, users, roles, notifications, todoDemo, default */
/***/ (function(module) {

module.exports = {"app":{"Welcome":"أهلا بك","Notifications":"إعلام","New":"جديد"},"mainMenu":{"Appointments":"المواعيد","Customers":"الزبائن","Products":"المنتجات","Orders":"الأوامر","About":"حول منجز التطبيق","Logout":"الخروج"},"pageHeader":{"Dashboard":"لوحة القيادة","Customers":"الزبائن","Products":"المنتجات","Orders":"الأوامر","NotFound":"لا يوجد","About":"حول منجز التطبيق","Settings":"إعدادات"},"home":{"NoWidgets1":"لم يتم عرض أية أدوات. اذهب إلى","NoWidgets2":"لتكوين الأدوات المتاحة","StatisticsTitle":"بعض الاشياء الهامة"},"notFound":{"404":"404","pageNotFound":"الصفحة التي تبحث عنها غير موجودة","backToHome":"العودة إلى لوحة الإستقبال"},"settings":{"tab":{"Profile":"الملف الشخصي","Preferences":"التفضيلات","Users":"المستخدمين","Roles":"الأدوار"},"header":{"UserProfile":"ملف تعريفي للمستخدم","UserPreferences":"خيارات المستخدم","UserDepartments":"أقسام المستخدم","UsersManagements":"إدارة المستخدمين","RolesManagement":"إدارة الأدوار"}},"preferences":{"ReloadPreferences":"إعادة تحميل التفضيلات:","ReloadPreferencesHint":"(تحميل التفضيلات الافتراضية (يتم تجاهل التغييرات المحلية","Language":"لغة:","English":"الإنجليزية","French":"الفرنسية","German":"الألمانية","Portuguese":"البرتغالية","Arabic":"العربية","Korean":"الكورية","LanguageHint":"اختيار اللغة المفضلة لحسابك","HomePage":"الصفحة الرئيسية:","Dashboard":"لوحة القيادة","Customers":"الزبائن","Products":"منتجات","Orders":"أوامر","About":"حول","Settings":"إعدادات","HomePageHint":"حدد الصفحة الافتراضية للانتقال إلى تسجيل الدخول","Theme":"فكرة رئيسية:","DefaultColor":"<span class='default-theme-option'>اللون المفضل</span>","RedColor":"<span class='red-theme-option'>الأحمر</span>","OrangeColor":"<span class='orange-theme-option'>البرتقالي</span>","GreenColor":"<span class='green-theme-option'>الأخضر</span>","GrayColor":"<span class='gray-theme-option'>الرمادي</span>","BlackColor":"<span class='black-theme-option'>الأسود</span>","ThemeHint":"حدد اللون الافتراضي لحسابك","DashboardStatistics":"إحصائيات لوحة التحكم:","DashboardStatisticsHint":"عرض الرسم البياني التجريبي على لوحة القيادة","DashboardNotifications":"إشعارات لوحة التحكم:","DashboardNotificationsHint":"عرض إشعارات التطبيق على لوحة التحكم","DashboardTodo":"لوحة التحكم للواجبات:","DashboardTodoHint":"يظهر الوحة التجريبية للواجبات على لوحة القيادة","DashboardBanner":"شعار لوحة التحكم:","DashboardBannerHint":"عرض معلومات الراية التجريبية على لوحة القيادة","ResetDefault":"اعادة تشغيل الأصل","SetDefault":"تعيين الأصل"},"users":{"management":{"Search":"البحث عن المستخدم...","NewUser":"مستخدم جديد","Edit":"تصحيح","Delete":"حذف","EditUser":"تحرير العضو \"{{name}}\"","Title":"عنوان","UserName":"اسم المستخدم","FullName":"الإسم الكامل","Email":"البريد الإلكتروني","Roles":"الأدوار","PhoneNumber":"رقم الهاتف"},"editor":{"JobTitle":"المسمى الوظيفي: ","UserName":"اسم المستخدم:","UserNameRequired":"(مطلوب اسم المستخدم (الحد الأدنى من 2 والحد الأقصى 200 حرفا","Password":"كلمة المرور:","PasswordHint":"كلمة المرور مطلوبة عند تغيير اسم المستخدم","CurrentPasswordRequired":"كلمة المرور الحالية مطلوبة","Email":"البريد الإلكتروني:","EmailRequired":"(عنوان البريد الإلكتروني مطلوب (بحد أقصى 200 حرف","InvalidEmail":"البريد الإلكتروني المحدد غير صالح","ChangePassword":"غير كلمة المرور","CurrentPassword":"كلمة المرور الحالية:","NewPassword":"كلمة مرور جديدة:","NewPasswordRequired":"الحد الأدنى من 6 أحرف) مطلوب كلمة مرور)","ConfirmPassword":"تأكيد كلمة المرور:","ConfirmationPasswordRequired":"مطلوب كلمة مرور التأكيد","PasswordMismatch":"لا تتطابق كلمة المرور الجديدة وكلمة مرور التأكيد","Roles":"الأدوار:","FullName":" الإسم الكامل:","RoleRequired":" مطلوب دور","PhoneNumber":"الهاتف #:","Enabled":"تمكين","Unblock":"رفع الحظر","Close":"إغلاق","Edit":"تصحيح","Cancel":"إلغاء","Save":"حفظ","Saving":"جار الحفظ..."}},"roles":{"management":{"Search":"البحث عن دور...","NewRole":"دور جديد","Edit":"تصحيح","Details":"تفاصيل","Delete":"حذف","RoleDetails":"تفاصيل الدور \"{{name}}\"","EditRole":"  تحرير الدور\"{{name}}\"","Name":"اسم","Description":"وصف","Users":"المستخدمين"},"editor":{"Name":"اسم:","Description":"وصف:","RoleNameRequired":"(اسم الدور مطلوب (بحد أدنى 2 و 200 حرف كحد أقصى","SelectAll":"اختر الكل","SelectNone":"لا تختر شيء","Close":"إغلاق","Cancel":"إلغاء","Save":"حفظ","Saving":"جار الحفظ..."}},"notifications":{"Delete":"حذف الإشعار","Pin":"رفع الأولوية","Date":"تاريخ","Notification":"إعلام"},"todoDemo":{"management":{"Search":"البحث عن مهمة...","HideCompleted":"إكتمال الإخفاء","AddTask":"إضافة مهمة","Delete":"حذف المهمة","Important":"وضع علامة كمهمة","Task":"مهمة","Description":"وصف"},"editor":{"NewTask":"مهمة جديدة","Name":"اسم","TaskNameRequired":"مطلوب اسم المهمة","Description":"وصف","Important":"وضع علامة لإظهار الأهمية","AddTask":"إضافة مهمة"}}};

/***/ }),

/***/ "./src/app/assets/locale/de.json":
/*!***************************************!*\
  !*** ./src/app/assets/locale/de.json ***!
  \***************************************/
/*! exports provided: app, Login, Register, ForgotUsername, ForgotPassword, AccountSummary, InvoiceHistory, PayNow, PaymentProfile, ContactUs, PaymentAutoPay, ForgotPasswordConfirmation, ForgotUserNameConfirmation, mainMenu, pageHeader, home, notFound, settings, preferences, users, roles, notifications, todoDemo, default */
/***/ (function(module) {

module.exports = {"app":{"Welcome":"Welkom in uw Account Centrum","Notifications":"Bedankt dat u voor ScentAir heeft gekozen","New":"Neu","SessionEnd":"Sessie beëindigd!"},"Login":{"CustomerLogin":"Inloggen","UserName":"Gebruikersnaam","Password":"Wachtwoord","UserNameRequired":"Gebruikersnaam is vereist","PasswordRequired":"Een wachtwoord is verplicht","ForgotUserName":"Gebruikersnaam vergeten","ForgotPassword":"Wachtwoord vergeten","SignIn":"INLOGGEN","RegisterNow":"REGISTREREN","QuickandEasyAccess":"Snel en Eenvoudig!","QuickandEasyAccessDescription":"Met uw ScentAir Account Centrum kunt u gemakkelijk bij al uw ScentAir facturen.","WhyRegister":"Waarom registreren?","RegisterDescription":"Als u zich registreert kunt u overal en altijd:","RegisterBulletPoint1":"Uw facturen bekijken en downloaden","RegisterBulletPoint2":"Automatische betaling instellen*","RegisterBulletPoint3":"Uw factuur direct online betalen*","RegisterBulletPoint4":"Uw complete factuurgeschiednis inkijken","RegisterNote":"*(Momenteel alleen in de VS en Canada beschikbaar)","Quetions":"Vragen?","ContactUs":"Neem contact op","Privacy":"Privacy (EN)","TermsofUse":"Gebruiksvoorwaarden (EN)","FAQ":"Veelgestelde vragen","CopyRight":"ScentAir. Alle rechten voorbehouden","Corporate":"Hoofdkantoor: 3810 Shutterfly Rd., Charlotte, NC 28217 | +1 (704) 504-2320","SigningIn":"Inloggen...","ContactUsOnFooter":"Contact"},"Register":{"Step1Registration":"Registratie Stap 1","CustomerIDNumber":"Klantnummer","CustomerIDNumberToolTip":"? - Uw klantnummer kunt u terugvinden in de rechterbovenhoek van uw facturen.","PINNumber":"Pincode","PINNumberToolTip":"? - De pincode kunt u terugvinden in de uitnodigings e-mail voor het ScentAir Account Centrum.","LookupAccount":"Vind Account","CANCEL":"CANCEL","Step2Registration":"Registratie Stap 2","FirstName":"Voornaam","LastName":"Achternaam","EmailAddress":"E-mail adres","PhoneNumber":"Telefoonnummer","UserName":"Gebruikersnaam","UserNameToolTip":"Moet uit minimaal 7 karakters bestaan","Password":"Wachtwoord","PasswordToolTip":"Moet uit minimaal 8 tekens bestaan, met minimaal 1 hoofdletter, 1 kleine letters, 1 cijfer en 1 speciaal teken (@, #, $,%, &, +,!,?)","ConfirmPassword":"Bevestig Wachtwoord","SecurityQuestion1":"Veiligheidsvraag 1","Answer":"Antwoord","SecurityQuestion2":"Veiligheidsvraag 2","PrivacyandTermsofUse":"Vink aan om aan te geven dat u onze","Privacy":"Privacyverklaring","And":"en","TermsofUse":"Gebruiksvoorwaarden","PrivacyandTermsofUseRemaining":"gelezen heeft en mee akkoord gaat.","MotherMaidenName":"Wat is de meisjesnaam van uw moeder?","BornCity":"In welke stad bent u geboren?","CarBrand":"Van welk merk was uw eerste auto?","Friend":"Wat is de naam van uw beste jeugdvriend(in)?","VacationSpot":"Wat is uw favoriete vakantie bestemming?","FirstEmployerName":"Wat is de naam van uw eerste werkgever?","SaveLoginButton":"Oplsaan en inloggen","CANCELButton":"ANNULEER","Lookingupaccount":"Account opzoeken ...","err":"dwalen","UserNameValidation":"Gebruikersnaam moet alleen bestaan uit de letters A-Z en / of de cijfers 0-9","PasswordValidation":"Een wachtwoord is verplicht","ConfirmPasswordMatchValidation":"Wachtwoord komt niet overeen met de bevestiging","ConfirmPasswordValidation":"Bevestiging van het wachtwoord is vereist","PINNumberValidation":"Ongeldige pin","FirstNameValidation":"voornaam is verplicht","LastNameValidation":"Achternaam is verplicht","EmailValidation":"E-mailadres is verplicht","InvalidAccountNumber":"Ongeldig account nummer","PhoneNumberValidation":"Telefoonnummer is verplicht","QuetionValidation":"Selecteer een beveiligingsvraag","AnswerValidation":"Antwoord is verplicht","CheckBoxValidation":"Controleer hier om aan te geven dat u onze voorwaarden hebt gelezen en hiermee akkoord gaat","UserNameRequired":"Gebruikersnaam is vereist","UserNameCharLength":"Gebruikersnaam moet uit minimaal 7 tekens bestaan","PasswordCharLength":"Moet uit minimaal 8 tekens bestaan, met minimaal 1 hoofdletter, 1 kleine letters, 1 cijfer en 1 speciaal teken (@, #, $,%, &, +,!,?)","PasswordContains":"Wachtwoord moet minimaal één hoofdletter, één kleine letter, één cijfer en één speciaal teken bevatten","ConfirmPasswordRequired":"Bevestiging van het wachtwoord is vereist","Login":"Log in","ErrorMessage1":"Dit account is al geregistreerd. Indien nodig kunt u uw gebruikersnaam of wachtwoord hier opnieuw instellen.","ErrorMessage2":"Ongeldig account of pincode","Here":"hier","Header":"registratie Bevestiging","RegistrationComplete":"Uw registratie is nu voltooid.","ToViewDetails":" om accountgegevens te bekijken, betalingen uit te voeren en extra gebruikers toe te voegen."},"ForgotUsername":{"ForgotUsername":"Gebruikersnaam vergeten","HeaderLabel":"Vul hieronder uw ScentAir klantnummer en uw e-mail adres in. Wij zullen u een e-mail sturen met uw gebruikersnaam.","CustomerIdNumber":"Klantnummer","AccountPopOver":"Uw klantnummer kunt u terugvinden in de rechterbovenhoek van uw facturen.","InvalidAccountNumber":"ongeldig account nummer","EmailAddress":"E-mail adres","EmailAddressPopOver":"Vul het e-mail adres in dat u heeft gebruikt bij de registratie","EmailAddressValidation":"E-mailadres is verplicht","SendEmailBtn":"VERZEND","CancelBtn":"ANNULEER"},"ForgotPassword":{"ForgotPassword":"Wachtwoord vergeten","HeaderLabel":"Vul hieronder uw gebruikersnaam in. Wij zullen u een e-mail sturen om uw wachtwoord te wijzigen:","UserName":"Gebruikersnaam","InvalidUserName":"Ongeldige gebruikersnaam","SendEmailBtn":"VERZEND","CancelBtn":"ANNULEER"},"AccountSummary":{"CustomerIDNumber":"Klantnummer","ACCOUNTSUMMARY":"ACCOUNTOVERZICHT","PAYMENTMETHODS":"BETALINGSMETHODEN ","SETTINGS":"INSTELLINGEN","CONTACTUS":"CONTACT","LOGOFF":"UITLOGGEN","ENROLLINAUTOPAY":"INSCHRIJVEN VOOR AUTOPAY ?","AvailableInUSnCANAccounts":"Momenteel alleen beschikbaar voor de VS en Canada","INVOICEHISTORY":"FACTUUR GESCHIEDENIS","AccountSummaryDescription":"Welkom in uw ScentAir Account Centrum. Vanaf hier kunt u gemakkelijk en snel uw facturen bekijken, downloaden en uitprinten.","AvailableInUSnCANNote":"*Momenteel alleen beschikbaar voor de VS en Canada","InvoicePayTitle":"Selecteer facturen om te betalen. Facturen met Betalingsvoorwaarden van 'Vervallen op 1e', 'Net 30 CC' en 'NET30AUTOPAY' worden automatisch in rekening gebracht op de betalingsmethode die is geregistreerd. Pop-ups toestaan.","Pay":"Betaal","Invoice#":"Factuur #","Status":"Status","PaymentTerms":"Betaalvoorwaarden","InvoiceDate":"Factuurdatum","InvoiceDue":"Uiterste betaaldatum","BalanceDue":"Factuurbedrag","TotalBalanceDue":"Totaal openstaand:","TotalPaymentAmount":"Totaal in betaling:","PAYNOW":"BETAAL","PaymentNote":"Het kan even duren tot uw betaling is bijgewerkt in het overzicht.","PASTDUE":"Achterstallig","DUENOW":"Verschuldigd"},"InvoiceHistory":{"INVOICEHISTORY":"FACTUUR GESCHIEDENIS","OPENINVOICES":"OPENSTAANDE FACTUREN","InvoiceNote":"Bekijk en print uw betaalde facturen","Invoice#":"Factuur #","Status":"Status","InvoiceDate":"Factuurdatum","InvoiceAmount":"Factuurbedrag","Cancelled":"Geannuleerd","Open":"Open","PartiallyPaid":"Gedeeltelijk betaald","PaidInFull":"Betaald"},"PayNow":{"PayNow":"Pague agora","PaymentInvoices":"Você está fazendo um pagamento nas seguintes faturas.","InvoiceNumber":"Fatura #","DueDate":"Data de Vencimento","InvoiceAmount":"Valor da fatura","PaymentAmount":"Quantidade de pagamento","TotalPaymentAmount":"Pagamento Amountunt total de pagamento:","SelectPaymentMethod":"Selecione o método de pagamento ou","SetupNewProfile":"Configurar novo perfil de pagamento","AutopayMethodCannotDeleted":"Por motivos de segurança, o método de pagamento inscrito no AUTOPAY não pode ser excluído imediatamente e pode levar até 72 horas para que a solicitação de exclusão ocorra.","EDIT":"EDITAR","CANCEL":"CANCELAR","SUBMIT":"ENVIAR","ACCEPT":"ACEITAR","selectedServiceCharge":"Método de pagamento selecionado para cobrar automaticamente sua taxa de serviço de perfume","ElectronicPaymentTermsAndCondition":"Termos e Condições de Pagamento Eletrônico da ScentAir","PaymentCompleteWarning":"Não clique em ENVIAR novamente ou pressione o botão de retorno até que a Transação de Pagamento esteja concluída","Privacy":"Privacidade.","ByCheckingBox":"VERIFICANDO A CAIXA,","AuthorizedAgent":"Agente Autorizado (“Agente”):","Certifies":"(a) certifica","AgentAuthority":"que o Agente (i) está autorizado a assinar e legalmente vincular o Assinante a contratos e a selecionar o Tipo de Pagamento recorrente do Assinante, e (ii) corrigiu quaisquer erros nos campos acima e fornecerá detalhes precisos sobre o Tipo de Pagamento do Assinante nas telas subsequentes fornecido por Chase Paymentech;","Signs":"(b) sinais","EnrollmentAndAuth1":"a seguir “Inscrição e Autorização de Pagamentos Recorrentes” (“","Authorization":"Autorização","EnrollmentAndAuth2":"”) Em nome do Assinante, cuja Autorização está incorporada neste documento;","Certifies2":"(c) certifica","description1":"que o Agente (i) fez uma cópia da Autorização para os registros do Assinante, e (ii) confirma a assinatura do Assinante e entrega a Autorização para aceitação do ScentAir (a seu critério); e ","Consents":"(d) consentimentos","description2":" ao processamento de qualquer saldo pendente na conta do Assinante e entende que o cartão de crédito inscrito será cobrado nesse valor sem qualquer autorização adicional.","description3":"Inscrição e Autorização de Pagamentos Recorrentes (“Autorização”)","GeneralTerms":"Termos gerais:","description4":"O Assinante indicado no “Contrato de Serviço de Perfumaria Ambiental” (“ESS”) entre o Assinante e a ScentAir, autoriza a ScentAir, pelo prazo da ESS, a obter fundos do “Tipo de Pagamento” selecionado acima para fins de pagamento de valores, incluindo tarifas atrasadas e outras taxas, agora ou mais tarde, devidas pelo Assinante, conforme especificado nas faturas da ScentAir (“","InvoiceAmounts":"Quantias de fatura","description5":"”). O Assinante concorda que todas as transações relacionadas ao ESS são e sempre serão principalmente para fins comerciais e que o Assinante é e continuará sendo o proprietário do banco, ou cartão de crédito, conta especificada durante a inscrição (“","EnrollmentScreens":"Telas de Inscrição","description6":"”). O Assinante concorda que esta Autorização permanecerá em vigor até que o assinante a cancele, fornecendo uma notificação através do “Mecanismo de Cancelamento” abaixo, pelo menos quinze (15) dias antes da próxima data de faturamento da fatura. O Assinante concorda que ainda deve o (s) Valor (es) da Fatura na medida em que a ScentAir não pode obter o pagamento através do Tipo de Pagamento do Assinante. ScentAir reserva todos os direitos. Como usado acima, “Mecanismo de Cancelamento” significa aviso para ScentAir tanto (a) em 3810 Shutterfly Road, Suite 900, Charlotte, NC 28217 por carta registrada, ou (b) via e-mail em","description7":", cuja notificação deverá indicar (i) a data da entrega da notificação e o Nº do Cliente do Assinante, (ii) a data efetiva para o cancelamento do método de pagamento recorrente e (iii) a forma de pagamento que o Assinante usará após o cancelamento.","SubscriberAgrees":"Assinante concorda ainda:","ACHAuthorization":"Autorização ACH.","description8":"Se o “Tipo de Pagamento” for “ACH CCD”, o Assinante concorda com os Termos Gerais e com as regras da National Automated Clearinghouse (“NACHA” ou “ACH”) agora ou mais tarde em vigor. Além disso, o Assinante autoriza a ScentAir a debitar os Montantes da Fatura (que podem variar em quantidade) em, ou um pouco antes ou depois, a data de vencimento da fatura da conta bancária indicada nas Telas de Inscrição (conforme atualizado). O Assinante concorda em: (a) notificar atempadamente a ScentAir sobre quaisquer alterações nas informações da conta do Assinante; e (b) reembolsar ScentAir por todas as penalidades e taxas incorridas como resultado de qualquer rejeição da solicitação de fundos da conta da ScentAir por qualquer motivo, incluindo fundos insuficientes ou indisponíveis ou como resultado de a conta não estar configurada adequadamente (como para transações ACH ). O Assinante concorda que, se um Valor da Fatura for devolvido sem pagamento: (a) a ScentAir poderá, a seu critério, tentar processá-lo conforme permitido pelas regras aplicáveis da NACHA e (b) a ScentAir também poderá efetuar um débito ACH por uma taxa de devolução de pelo menos US $ 4,50 ou qualquer quantia maior que a ScentAir esteja direta ou indiretamente obrigada pelas regras da NACHA a suportar em relação aos itens devolvidos.","CreditCardAuth":"Autorização de cartão de crédito.","description9":"Se o “Tipo de pagamento” for “Cartão de crédito”, o Assinante concorda com os Termos gerais. O Assinante também concorda com todos os termos da Autorização ACH, exceto que as regras NACHA não se aplicarão e essas diferenças serão aplicadas: (i) a conta será do cartão de crédito do Assinante em vez de sua conta bancária e se uma cobrança for recusada, ScentAir não reenvie a cobrança ou solicite uma taxa de item devolvido, exceto conforme permitido pelas regras de marca de cartão aplicáveis; e (ii) o Assinante reconhece as políticas de cancelamento e reembolso da ScentAir referentes aos produtos da ScentAir..","description10":"Esta Autorização complementa o ESS fornecendo o método e os termos para pagamento pelo Assinante dos montantes devidos nos termos do ESS.","description11":"O Assinante concorda com os termos contidos na Política de Privacidade da ScentAir https://www.scentair.com/legal/privacy, pois eles podem ser atualizados de tempos em tempos e concorda que se referirá a https://www.scentair.com/legal /privacy.html para todas as informações relacionadas à Política de Privacidade da ScentAir e quaisquer direitos adicionais que o Assinante possa ter relacionado a estes Termos e Condições e a esta Autorização, bem como quaisquer direitos relacionados aos dados do Assinante em geral."},"PaymentProfile":{"PAYMENTPROFILE":"BETALINGSPROFIEL","FriendlyName":"Bijnaam kaart","PaymentType":"Betalingstype","CardType":"Kaarttype","Credit":"Credit","ACHandECP":"ACH/ECP","Visa":"Visa","MC":"MC","Discover":"Discover","Amex":"Amex","JCB":"JCB","DinersClub":"DinersClub","CreditCardNumber":"Creditcard nummer","ExpirationDate":"Vervaldatum","CVV":"CCV","NameOnAccount":"Op naam van","Address":"Adres","Address2":"Adres 2","Address3":"Adres 3","City":"Stad","StateOrProvince":"Provincie","PostalCode":"Postcode","Country":"Land","SAVE":"OPSLAAN","DELETE":"VERWIJDER","CANCEL":"ANNULEREN","EDIT":"BEWERK","BusinessChecking":"Zakelijke controle","PersonalChecking":"Persoonlijke controle","Savings":"spaargeld","AccountNumber":"Rekeningnummer","AccountNumberTooltip":"Accountnummer (3 - 17 cijfers)","RoutingNumber":"Routingnummer","RoutingNumberTooltip":"Routingnummer (9 cijfers)","BankName":"Banknaam","PaymentMethods":"Betaalmethodes","PaymentMethodsDesc":"Hier kunt u extra betalingsmethoden aanmelden. We accepteren alle gangbare creditcards en ACH (Electronic Check)","USCCANOption":"* Optie momenteel beschikbaar voor US- en CAN-accounts","CurrentSavedMethod":"Huidig opgeslagen betaalmethoden:","EndingWith":"eindigend met","SelectedPaymentValidationMessage":"Geselecteerde betaalmethode om automatisch uw instandhoudingskosten in rekening te brengen","AddNewPaymentMethod":"NIEUWE BETAALMETHODE TOEVOEGEN","MANAGEAUTOPAYSETTINGS":"AUTOPAY-INSTELLINGEN BEHEREN","SecurityReasonDesc":"Om veiligheidsredenen kan de door AUTOPAY geregistreerde betaalmethode niet onmiddellijk worden verwijderd en kan het tot 72 uur duren voordat het verwijderingsverzoek plaatsvindt.","PaymentReceivedTimeDesc":"Betalingen die na 17:00 uur EST worden ontvangen, worden de volgende werkdag na 10:00 uur EST weergegeven.","CuurentAutoPayMethod":"Huidige betaalmethode voor automatisch betalen","InvalidProfilePaymentName":"Ongeldige profielbetalingsnaam","AutoPayDisabledDesc":"Auto Pay is uitgeschakeld vanwege openstaande facturen!","AutoPay":"Auto betalen","InvalidCountry":"Ongeldig land","InvalidPostalCode":"Ongeldige postcode","InvalidState":"Ongeldige status","InvalidCity":"Ongeldige stad","InvalidAddress":"Ongeldig adres","InvalidName":"Ongeldige naam","InvalidCVV":"Ongeldige CVV","InvalidCreditCardNumber":"Ongeldig creditcard nummer","InvalidBankName":"Ongeldige banknaam","InvalidRoutingNumber":"Ongeldig routingnummer","InvalidAccountNumber":"ongeldig account nummer","AccountType":"account type","InvalidPin":"Ongeldige pin"},"ContactUs":{"ContactUs":"Contact","AMERICAS":"AMERICAS: Tolvrij: +1866-723-6824 or +1704-504-2320","France":"Frankrijk: +33 (0) 5 62 57 63 20","Spain":"Spanje: +34 914 321 762","Switzerland":"Zwitserland: +41 22 501 75 59","Netherlands":"Nederland: +31 (0)10 223 6264","UK":"Verenigd Koninkrijk: +44 (0) 1628 601650","AllCountries":"Alle andere landen in Continentaal Europa en EMEA: +33 (0)5 62 57 63 20","APAC":"Aziatisch-Pacifisch: +(853) 626-25256 or (852) 356-35566"},"PaymentAutoPay":{"ManageAutoPay":"Beheer AUTOPAY","AccountOptionDesc":"*Momenteel alleen beschikbaar voor de VS en Canada","AutoPayDesc":"Om het u makkelijk te maken kunt u met AUOPAY* automatische afschrijvingen voor uw creditcard instellen.","PaymentTermsNote":"Het kan 30 dagen duren voordat we via AUTOPAY uw servicekosten afschrijven na het aanmaken van een AUTOPAY account.","AutoPay":"AUTOPAY","AddNewPayment":"VOEG NIEUWE BETAALMETHODE TOE","UnenrollInAutoPay":"Zet AUTOPAY uit","Save":"OPSLAAN","ChargesNoteDesc":"(Normaal schrijven we op de eerste dag van een nieuwe maand af.)","InvoiceNoteDesc":"Alle openstaande facturen dienen voldaan te zijn voor u AUTOPAY kunt instellen","EndingWith":"eindigend met","PaymentMethodChargesDesc":"De betaalmethode wordt gebruikt om automatisch de servicekosten van je geur in rekening te brengen","AUTOPAY":"AutoPay","ScentAirTermsConditionDesc":"ScentAir elektronische betalingsvoorwaarden","BYCHECKING":"DOOR DE DOOS TE CONTROLEREN,","AuthorizedAgent":"Geautoriseerde agent (agent):","certifies":"(a) verklaart","AuthorizedCertifiesDesc1":"dat Agent (i) geautoriseerd is om Abonnee te ondertekenen en juridisch te binden aan contracten en om het terugkerende Betaaltype van Abonnee te selecteren, en (ii) eventuele fouten in de bovenstaande velden heeft gecorrigeerd en nauwkeurige details over Abonnementsbetaaltype zal verstrekken in de volgende schermen die zijn geleverd door Chase Paymentech;","AuthorizedCertifiesDesc2":"(b) tekenen","AuthorizedCertifiesDesc3":"de onderstaande Inschrijving,en autorisatie,van terugkerende,betalingen (Authorization","AuthorizedCertifiesDesc4":") namens Abonnee, welke Autorisatie hierin is opgenomen;","AuthorizedCertifiesDesc5":"DOOR DE DOOS TE CONTROLEREN,","AuthorizedCertifiesDesc6":"dat Agent (i) een kopie heeft gemaakt van de Authorization for Subscriber-records en (ii) de handtekening van de Abonnee bevestigt en de Autorisatie voor de aanvaarding door ScentAir (naar eigen goeddunken) aflevert; en","AuthorizedCertifiesDesc7":"(d) toestemmingen","AuthorizedCertifiesDesc8":"voor de verwerking van openstaande bedragen in de account van de Abonnee en begrijpt dat de geregistreerde creditcard in dat bedrag in rekening zal worden gebracht zonder verdere toestemming.","AuthorizedCertifiesDesc9":"\"Inschrijving & autorisatie van terugkerende betalingen (\"Autorisatie\")\"","GeneralTerms":"Algemene voorwaarden:","AuthorizedCertifiesDesc10":"De abonnee vermeld in de Environmental Scent Service Agreement (ESS) tussen Abonnee en ScentAir, machtigt hierbij ScentAir, voor de duur van de ESS, om geld te verkrijgen van het hierboven geselecteerde Betaaltype voor het betalen van bedragen, inclusief late kosten en andere vergoedingen, nu of later verschuldigd door de Abonnee zoals gespecificeerd in ScentAir-facturen (","InvoiceAmounts":"Factuurbedragen","AuthorizedCertifiesDesc11":"). De Abonnee stemt ermee in dat alle ESS-gerelateerde transacties altijd voornamelijk voor zakelijke doeleinden zijn en altijd zullen zijn en dat de Abonnee de eigenaar van de bank- of creditcardrekening is en blijft die tijdens de inschrijving is opgegeven (","EnrollmentScreens":"Inschrijfschermen","AuthorizedCertifiesDesc12":"). De Abonnee gaat ermee akkoord dat deze Autorisatie van kracht blijft totdat de abonnee deze annuleert door middel van kennisgeving via het onderstaande Annuleringmechanisme ten minste vijftien (15) dagen voorafgaand aan de factuurdatum van de volgende factuur. De Abonnee gaat ermee akkoord dat hij het Factuurbedrag (en) nog verschuldigd is voor zover ScentAir geen betaling kan verkrijgen via het Betaaltype van de Abonnee. ScentAir behoudt zich alle rechten voor. Zoals hierboven gebruikt, betekent Annuleringsmechanisme kennisgeving aan ScentAir ofwel (a) via 3810 Shutterfly Road, Suite 900, Charlotte, NC 28217 per aangetekende post of (b) via e-mail op","CustomerCare":"customercare@scentair.com","AuthorizedCertifiesDesc13":", welke kennisgeving (i) de datum van kennisgeving en Abonnee Klant ID #, (ii) de ingangsdatum voor annulering van de herhaalde betalingsmethode, en (iii) de betaalwijze Abonnee zal post-annulering gebruiken.","SubscriberFurtherAgrees":"Abonnee gaat verder akkoord:","ACHAuthorization":"ACH-autorisatie.","ACHAuthorizationDesc1":"Als het Betaaltype ACH CCD is, stemt Abonnee in met de Algemene Voorwaarden en met de regels van het National Automated Clearinghouse (NACHA of ACH) die nu of later van kracht zijn. Bovendien machtigt de Abonnee ScentAir om de Factuurbedragen (die kunnen variëren in bedrag) te debiteren op, of kort voor of na de vervaldatum van de factuur vanaf de bankrekening aangegeven in de Enrollment Screens (zoals bijgewerkt). Abonnee gaat ermee akkoord om: (a) ScentAir tijdig op de hoogte te stellen van eventuele wijzigingen in de accountinformatie van de Abonnee; en (b) ScentAir te vergoeden voor alle boetes en kosten die zijn opgelopen als gevolg van een afwijzing van het verzoek van ScentAir om accountfondsen om welke reden dan ook, inclusief onvoldoende of niet-beschikbare gelden of als gevolg van het niet correct configureren van de account (zoals voor ACH-transacties ). Abonnee stemt ermee in dat als een Factuurbedrag onbetaald wordt geretourneerd: (a) ScentAir naar eigen goeddunken kan proberen het te verwerken zoals toegestaan door toepasselijke NACHA-regels, en (b) ScentAir kan ook een ACH-debet maken voor een geretourneerde artikelprijs van ten minste $ 4,50 of een groter bedrag dat ScentAir direct of indirect is verplicht door de NACHA-regels met betrekking tot geretourneerde artikelen.","CreditCardAuthorization":"Creditcard autorisatie.","PaymentTypeDesc":"Als het Betaaltype Creditcard is, stemt Abonnee in met de Algemene Voorwaarden. De Abonnee stemt ook in met alle voorwaarden van de ACH-autorisatie, behalve dat de NACHA-regels niet van toepassing zijn en deze verschillen van toepassing zijn: (i) de rekening zal de creditcardrekening van de Abonnee zijn in plaats van zijn bankrekening en als een vergoeding wordt afgewezen, zal ScentAir de lading niet opnieuw inzenden of een geretourneerde artikelbetaling aanvragen, behalve zoals toegestaan door de toepasselijke regels voor kaartmerken; en (ii) Abonnee erkent het annulerings- en terugbetalingsbeleid van ScentAir met betrekking tot ScentAir-producten.","PaymentTypeDesc1":"Deze machtiging vult het ESS aan door de methode en voorwaarden te voorzien voor de betaling door de inschrijver van bedragen verschuldigd krachtens de ESS.","Privacy":"Privacy.","PrivacySubscriberDesc":"Abonnee gaat akkoord met de voorwaarden in het Privacybeleid van ScentAir https://www.scentair.com/legal/privacy omdat ze van tijd tot tijd kunnen worden bijgewerkt en ermee instemmen dat ernaar wordt verwezen https://www.scentair.com/legal/privacy.html voor alle informatie met betrekking tot het privacybeleid van ScentAir en eventuele aanvullende rechten die de Abonnee mogelijk heeft gerelateerd aan deze Algemene Voorwaarden en deze Autorisatie, evenals alle rechten met betrekking tot de gegevens van de Abonnee in het algemeen.","PrintTermsConditions":"Algemene voorwaarden printen","ADDNEWPAYMENTMETHOD":"NIEUWE BETAALMETHODE TOEVOEGEN","UNENROLLINAUTOPAY":"ONTSPANNEN IN AUTOPAY","SAVE":"OPSLAAN","ACCEPT":"AANVAARDEN","SUBMIT":"SUBMIT","CANCEL":"ANNULEREN","ChargesDesc":"(Kosten worden doorgaans toegepast op de eerste werkdag van de maand.)","OpenInvoicesDesc":"Alle openstaande facturen moeten volledig worden betaald voordat ze zich inschrijven voor AUTOPAY","AUTOPAYUnenrollmentRequestDesc":"Opzegging van AUTOPAY ongedaan gemaakt - Het kan tot 72 uur duren voordat de afmelding voor AUTOPAY van kracht wordt."},"ForgotPasswordConfirmation":{"Header":"Wachtwoord bevestigen Bevestiging","EmailSent":"Er is een e-mail verzonden om uw wachtwoord opnieuw in te stellen. Als u de e-mail binnenkort niet ontvangt, neemt u contact op met uw klantenservicemedewerker:","AMERICAS":"AMERICAS","TollFree":"Tolvrij","Or":"or","EMEA":"EMEA","Verenigd Koninkrijk":"UK","APAC":"Aziatisch-Pacifisch","ReturnToLogin":"Terug naar aanmelden"},"ForgotUserNameConfirmation":{"Header":"Gebruikersnaam Bevestiging vergeten","EmailSent":"Er is een e-mail verzonden met uw gebruikersnaam. Als u de e-mail binnenkort niet ontvangt, neemt u contact op met uw klantenservicemedewerker:","AMERICAS":"AMERICAS","TollFree":"Tolvrij","Or":"or","EMEA":"EMEA","UK":"Verenigd Koninkrijk","APAC":"Aziatisch-Pacifisch","ReturnToLogin":"Terug naar aanmelden"},"mainMenu":{"Customers":"Kunden","Products":"Produkte","Orders":"Bestellungen","Appointments":"Termine","AccountSummary":"ACCOUNTOVERZICHT","PaymentMethods":"BETALINGSMETHODEN","About":"Über","Settings":"INSTELLINGEN","ContactUs":"CONTACT","CustomerIdNumber":"Klantnummer","EnrollInAutoPay":"INSCHRIJVEN VOOR AUTOPAY ?","Logout":"UITLOGGEN","EnrollToolTip":"Momenteel alleen beschikbaar voor de VS en Canada"},"pageHeader":{"Dashboard":"Übersicht","Customers":"Kunden","Products":"Produkte","Orders":"Bestellungen","NotFound":"Nicht gefunden","About":"Über","Settings":"Einstellungen"},"home":{"NoWidgets1":"Keine Elemente zur Anzeige vorhanden. Gehe zu","NoWidgets2":"um die Anzeige zu konfigurieren","StatisticsTitle":"Irgendwas ganz Wichtiges"},"notFound":{"404":"404","pageNotFound":"Die angeforderte Seite wurde nicht gefunden","backToHome":"Zurück zur Startseite"},"settings":{"tab":{"Profile":"Profiel","Preferences":"VOORKEUREN","Users":"Gebruikersnaam:","Roles":"Rol"},"header":{"UserProfile":"Profiel","UserPreferences":"Voorkeuren","UserDepartments":"Benutzerabteilungen","UsersManagements":"Benutzerverwaltung","RolesManagement":"Rollenverwaltung"}},"preferences":{"ReloadPreferences":"Einstellungen aktualisieren:","ReloadPreferencesHint":"Vorgabeeinstellungen laden (lokale Einstellungen überschreiben)","Language":"Taal:","English":"Engels (Standaard)","French":"Frans","Dutch":"Nederlands","Spanish":"Spaans","German":"Deutsch","Portuguese":"Portugiesisch","Arabic":"Arabisch","Korean":"Koreanisch","LanguageHint":"Die bevorzugte Anzeigesprache auswählen","HomePage":"Startseite:","Dashboard":"Dashboard","Customers":"Kunden","Products":"Produkte","Orders":"Bestellungen","About":"Über","Settings":"Einstellungen","HomePageHint":"Die Standardseite zur Anzeige nach der Anmeldung wählen","Theme":"Farbschema:","DefaultColor":"<span class='default-theme-option'>Standard</span>","RedColor":"<span class='red-theme-option'>Rot</span>","OrangeColor":"<span class='orange-theme-option'>Orange</span>","GreenColor":"<span class='green-theme-option'>Grün</span>","GrayColor":"<span class='gray-theme-option'>Grau</span>","BlackColor":"<span class='black-theme-option'>Schwarz</span>","ThemeHint":"Das bevorzugte Farbschema wählen","DashboardStatistics":"Dashboard Statistiken:","DashboardStatisticsHint":"Zeigt das Demo-Statistik Element auf dem Dashboard","DashboardNotifications":"Dashboard Benachrichtigungen:","DashboardNotificationsHint":"Zeige Anwendungsbenachrichtigungen auf dem Dashboard","DashboardTodo":"Dashboard Beispielaufgaben:","DashboardTodoHint":"Zeigt das Beispielaufgaben Element auf dem Dashboard","DashboardBanner":"Dashboard Banner:","DashboardBannerHint":"Zeigt das Info-Banner Element auf dem Dashboard","ResetDefault":"Vorgabeeinstellungen","SetDefault":"Als Standard setzen"},"users":{"management":{"Search":"Benutzer suchen...","NewUser":"Neuer Benutzer","Edit":"Bearb.","Delete":"Entf.","EditUser":"Benutzer \"{{name}}\" bearbeiten","Title":"Titel","UserName":"Gebruikersnaam","FullName":"Vor- und Nachname","Email":"E-mail adres","Roles":"Rol:","PhoneNumber":"Telefoonnummer"},"editor":{"JobTitle":"Beruf: ","UserName":"Gebruikersnaam:","UserNameRequired":"Ein Benutzername ist erforderlich (mindestens 2, maximal 200 Zeichen)","Password":"Wachtwoord:","PasswordHint":"Passworteingabe ist erforderlich, wenn der Benutzername geändert werden soll","CurrentPasswordRequired":"Aktuelles Passwort ist erforderlich","Email":"E-mail adres:","EmailRequired":"Email Adresse ist erforderlich (maximal 200 Zeichen)","InvalidEmail":"Angegebene Email-Adresse ist ungültig","ChangePassword":"Passwort ändern","CurrentPassword":"Aktuelles Passwort:","NewPassword":"Neues Passwort:","NewPasswordRequired":"Neues Passwort ist erforderlich (mindestens 6 Zeichen)","ConfirmPassword":"Passwort bestätigen:","ConfirmationPasswordRequired":"Passwort Bestätigung ist erforderlich","PasswordMismatch":"Die angegebenen Passwörter stimmen nicht überein","Roles":"Rollen:","FullName":"Vollständiger Name:","RoleRequired":" Rolle ist erforderlich","PhoneNumber":"Telefon #:","Enabled":"Aktiviert","Unblock":"Entsperren","Close":"Schliessen","Edit":"BEWERK","Cancel":"Abbrechen","Save":"Speichern","Saving":"Speichere...","Question01":"Veiligheidsvraag 1","Question02":"Veiligheidsvraag 2","Answer01":"Antwoord 1","Answer02":"Antwoord 2"}},"roles":{"management":{"Search":"Suche nach Rollen...","NewRole":"Neue Rolle","Edit":"Bearb.","Details":"Details","Delete":"Entf.","RoleDetails":"Rollen Details \"{{name}}\"","EditRole":"Rolle \"{{name}}\" bearbeiten","Name":"Name","Description":"Beschreibung","Users":"Benutzer"},"editor":{"Name":"Name:","Description":"Beschreibung:","RoleNameRequired":"Ein Rollenname ist erforderlich (mindestens 2, maximal 200 Zeichen)","SelectAll":"Alle auswählen","SelectNone":"Auswahl aufheben","Close":"Schliessen","Cancel":"Abbrechen","Save":"OPSLAAN","Saving":"Speichere..."}},"notifications":{"Delete":"Benachrichtigung löschen","Pin":"Benachrichtigung anheften","Date":"Datum","Notification":"Benachrichtigung"},"todoDemo":{"management":{"Search":"Suche nach Aufgaben...","HideCompleted":"Abgeschlossene ausblenden","AddTask":"Aufgabe hinzufügen","Delete":"Aufgabe löschen","Important":"Als wichtig markieren","Task":"Aufgabe","Description":"Beschreibung"},"editor":{"NewTask":"Neue Aufgabe","Name":"Name","TaskNameRequired":"Aufgabenname ist erforderlich","Description":"Beschreibung","Important":"Als wichtig markieren","AddTask":"Aufgabe hinzufügen"}}};

/***/ }),

/***/ "./src/app/assets/locale/en.json":
/*!***************************************!*\
  !*** ./src/app/assets/locale/en.json ***!
  \***************************************/
/*! exports provided: app, Login, Register, ForgotUsername, ForgotPassword, AccountSummary, InvoiceHistory, PayNow, PaymentProfile, ContactUs, PaymentAutoPay, ForgotPasswordConfirmation, ForgotUserNameConfirmation, mainMenu, pageHeader, home, notFound, settings, preferences, users, roles, notifications, todoDemo, default */
/***/ (function(module) {

module.exports = {"app":{"Welcome":"Welcome to your Account Center","Notifications":"Thank you for choosing ScentAir","New":"New","SessionEnd":"Session Ended!"},"Login":{"CustomerLogin":"Customer Login","UserName":"Username","Password":"Password","UserNameRequired":"Username is required","PasswordRequired":"Password is required","ForgotUserName":"Forgot Username","ForgotPassword":"Forgot Password","SignIn":"SIGN IN","RegisterNow":"REGISTER NOW","QuickandEasyAccess":"Quick and Easy Access","QuickandEasyAccessDescription":"With your ScentAir Account Center there's no need to call for your day to day account questions, saving you valuable time throughout your day. For added convenience we've made it easier to enroll in our hassle-free autopay. You can just set your payment schedule and get back to what matters most—your customers!","WhyRegister":"Why register?","RegisterDescription":"When you register you can manage your account from anywhere:","RegisterBulletPoint1":"View and download invoices","RegisterBulletPoint2":"Enroll in our hassle free autopay*","RegisterBulletPoint3":"Make an invoice payment*","RegisterBulletPoint4":"Access invoice history","RegisterNote":"*(Available for US & CAN Accounts)","Quetions":"Have questions?","ContactUs":"Contact Us","Privacy":"Privacy","TermsofUse":"Terms of Use","FAQ":"FAQ","CopyRight":"ScentAir. All rights reserved","Corporate":"Corporate:  3810 Shutterfly Rd., Charlotte, NC 28217 | +1 (704) 504-2320","SigningIn":"Signing In...","ContactUsOnFooter":"Contact Us"},"Register":{"Step1Registration":"Step 1 Registration","CustomerIDNumber":"Customer ID Number","CustomerIDNumberToolTip":"? - You can find this number on the top right corner of the original agreement or any invoice","PINNumber":"PIN Number","PINNumberToolTip":"? - Refer to the Welcome Email you received. Don't have this? Please contact us.","LookupAccount":"Lookup Account","CANCEL":"CANCEL","Step2Registration":"Step 2 Registration","FirstName":"First Name","LastName":"Last Name","EmailAddress":"Email Address","PhoneNumber":"Phone Number","UserName":"Username","UserNameToolTip":"Must be at least 7 characters long","Password":"Password","PasswordToolTip":"Password must be at least 8 characters long, contain one uppercase, one lowercase, one number, and one special character (@, #, %, &, +, !, ?)","ConfirmPassword":"Confirm Password","SecurityQuestion1":"Security Question 1","Answer":"Answer","SecurityQuestion2":"Security Question 2","PrivacyandTermsofUse":"Check here to indicate that you have read and agree to our","PrivacyandTermsofUseRemaining":"","Privacy":"Privacy","And":"and","TermsofUse":"Terms of use","MotherMaidenName":"What is your Mother's maiden name?","BornCity":"In what city where you born?","CarBrand":"What brand was your first car?","Friend":"Name of your childhood best friend?","VacationSpot":"Favorite vacation spot?","FirstEmployerName":"Name of your first employer?","SaveLoginButton":"Save & Login","CANCELButton":"CANCEL","Lookingupaccount":"Looking up account...","err":"err","UserNameValidation":"Username must consist of the letters A-Z and/or the numbers 0-9 only","PasswordValidation":"Password is required","ConfirmPasswordMatchValidation":"Password does not match confirmation","ConfirmPasswordValidation":"Confirmation of password is required","PINNumberValidation":"Invalid Pin","FirstNameValidation":"First name is required","LastNameValidation":"Last name is required","EmailValidation":"Email address is required","InvalidAccountNumber":"Invalid Account Number","PhoneNumberValidation":"Phone number is required","QuetionValidation":"Please select a security question","AnswerValidation":"Answer is required","CheckBoxValidation":"Check here to indicate that you have read and agree to our","UserNameRequired":"UserName is required","UserNameCharLength":"Username must be at least 7 characters","PasswordCharLength":"Password must be at least 8 characters long, contain one uppercase, one lowercase, one number, and one special character (@, #, %, &, +, !, ?)","PasswordContains":"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character","ConfirmPasswordRequired":"Confirmation of password is required","Login":"Login","ErrorMessage1":"This account has already been registered. If needed, you may reset your username or password","ErrorMessage2":"Invalid account or PIN number","Here":"here.","Header":"Registration Confirmation","RegistrationComplete":"Your registration is now complete.","ToViewDetails":" to view account details, make payments and add additional users."},"ForgotUsername":{"ForgotUsername":"Forgot Username","HeaderLabel":"Please enter your ScentAir Customer ID number and Email address. We will send you an email with your Username","CustomerIdNumber":"Customer ID Number","AccountPopOver":"You can find this number on the top right corner of the original agreement or any invoice","InvalidAccountNumber":"Invalid account number","EmailAddress":"Email Address","EmailAddressPopOver":"Enter the email address used during initial Registration","EmailAddressValidation":"Email address is required","SendEmailBtn":"SEND EMAIL","CancelBtn":"CANCEL"},"ForgotPassword":{"ForgotPassword":"Forgot Password","HeaderLabel":"Enter your Username and an email will be sent to reset your password:","UserName":"Username","InvalidUserName":"Invalid user name","SendEmailBtn":"SEND EMAIL","CancelBtn":"CANCEL"},"AccountSummary":{"CustomerIDNumber":"Customer ID Number","ACCOUNTSUMMARY":"ACCOUNT SUMMARY","PAYMENTMETHODS":"PAYMENT METHODS","SETTINGS":"SETTINGS","CONTACTUS":"CONTACT US","LOGOFF":"LOGOFF","ENROLLINAUTOPAY":"ENROLL IN AUTOPAY ?","AvailableInUSnCANAccounts":"?   Currently available in US & CAN accounts","INVOICEHISTORY":"INVOICE HISTORY","AccountSummaryDescription":"Welcome to your ScentAir Account Center. From here you can quickly access, view, download and print your account invoices. Plus pay your invoices via your preferred payment method from anywhere, at anytime. ","AvailableInUSnCANNote":"*Option currently available for US & CAN Accounts","InvoicePayTitle":"Select invoices to pay. Invoices with Payment Terms of 'Due on 1st', 'Net 30 CC' and 'NET30AUTOPAY' will automatically be charged against the payment method on file. Allow pop-ups. ","Pay":"Pay","Invoice#":"Invoice #","Status":"Status","PaymentTerms":"Payment Terms","InvoiceDate":"Invoice Date","InvoiceDue":"Invoice Due","BalanceDue":"Balance Due","TotalBalanceDue":"Total Balance Due:","TotalPaymentAmount":"Total Payment Amount:","PAYNOW":"PAY NOW","PaymentNote":"Payments received after 5:00 EST will reflect after 10:00 AM EST the next business day.","PASTDUE":"PAST DUE","DUENOW":"DUE NOW"},"InvoiceHistory":{"INVOICEHISTORY":"INVOICE HISTORY","OPENINVOICES":"OPEN INVOICES","InvoiceNote":"View & print your paid invoices","Invoice#":"Invoice #","Status":"Status","InvoiceDate":"Invoice Date","InvoiceAmount":"Invoice Amount","Cancelled":"Cancelled","Open":"Open","PartiallyPaid":"Partially Paid","PaidInFull":"Paid In Full"},"PayNow":{"PayNow":"Pay Now","PaymentInvoices":"You are making a payment on the following invoices.","InvoiceNumber":"Invoice #","DueDate":"Due Date","InvoiceAmount":"Invoice Amount","PaymentAmount":"Payment Amount","TotalPaymentAmount":"Total Payment Amount:","SelectPaymentMethod":"Select payment method or","SetupNewProfile":"Setup New Payment Profile","AutopayMethodCannotDeleted":"For security reasons the AUTOPAY enrolled payment method cannot be immediately deleted and it may take up to 72 hours for the deletion request to take place.","EDIT":"EDIT","CANCEL":"CANCEL","SUBMIT":"SUBMIT","ACCEPT":"ACCEPT","selectedServiceCharge":"Selected Payment Method to automatically charge your Scent Service Fee","ElectronicPaymentTermsAndCondition":"ScentAir Electronic Payment Terms and Conditions","PaymentCompleteWarning":"Do not click SUBMIT again or hit the back button until Payment Transaction is complete","Privacy":"Privacy.","ByCheckingBox":"BY CHECKING THE BOX,","AuthorizedAgent":"Authorized Agent (“Agent”): ","Certifies":"(a) certifies ","AgentAuthority":"that Agent (i) is authorized to sign and legally bind Subscriber to contracts and to select Subscriber’s recurring Payment Type, and (ii) has corrected any errors in the above fields and will supply accurate details about Subscriber’s Payment Type in the subsequent screens that are provided by Chase Paymentech;","Signs":"(b) signs ","EnrollmentAndAuth1":"the below “Enrollment & Authorization of Recurring Payments” (“","Authorization":"Authorization","EnrollmentAndAuth2":"”) on behalf of Subscriber, which Authorization is incorporated herein;","Certifies2":"(c) certifies ","description1":"that Agent (i) has made a copy of the Authorization for Subscriber's records, and (ii) confirms Subscriber's signature and delivers the Authorization for ScentAir's acceptance (in its discretion); and ","Consents":"(d) consents ","description2":" to the processing of any outstanding balance on Subscriber’s account and understands that the enrolled credit card will be charged in that amount without any further authorization.","description3":"Enrollment & Authorization of Recurring Payments (“Authorization”)","GeneralTerms":"General Terms:","description4":"The Subscriber named in the “Environmental Scent Service Agreement” (“ESS”) between Subscriber and ScentAir, hereby authorizes ScentAir, for the term of the ESS, to obtain funds from the “Payment Type” selected above for purposes of paying amounts, including late charges and other fees, now or later due from Subscriber as specified in ScentAir invoices (“","InvoiceAmounts":"Invoice Amounts","description5":"”). Subscriber agrees that all ESS-related transactions are and will always be primarily for business purposes and that Subscriber is and will remain the owner of the bank, or credit card, account specified during enrollment (“","EnrollmentScreens":"Enrollment Screens","description6":"”). Subscriber agrees that this Authorization will remain in effect until subscriber cancels it by providing notice via the below “Cancellation Mechanism” at least fifteen (15) days prior to the next invoice billing date. Subscriber agrees that it will still owe the Invoice Amount(s) to the extent ScentAir is not able to obtain payment via Subscriber’s Payment Type. ScentAir reserves all rights. As used above, “Cancellation Mechanism” means notice to ScentAir either (a) at 3810 Shutterfly Road, Suite 900, Charlotte, NC 28217 by certified mail, or (b) via email at ","description7":", which notice shall state (i) the date of notice delivery and Subscriber’s Customer ID #, (ii) the effective date for cancellation of the recurring payment method, and (iii) the payment method Subscriber will use post-cancellation.","SubscriberAgrees":"Subscriber further agrees:","ACHAuthorization":"ACH Authorization.","description8":"If the “Payment Type” is “ACH CCD,” Subscriber agrees to the General Terms and to the rules of the National Automated Clearinghouse (“NACHA” or “ACH”) now or later in effect. In addition, Subscriber authorizes ScentAir to debit the Invoice Amounts (which may vary in amount) on, or shortly before or after, the invoice due date from the bank account indicated in the Enrollment Screens (as updated). Subscriber agrees to: (a) timely notify ScentAir of any changes in Subscriber’s account information; and (b) reimburse ScentAir for all penalties and fees incurred as a result of any rejection of ScentAir’s request for account funds for any reason, including insufficient or unavailable funds or as a result of the account not being properly configured (such as for ACH transactions). Subscriber agrees that if an Invoice Amount is returned unpaid: (a) ScentAir may at its discretion attempt to process it as allowed by applicable NACHA rules, and (b) ScentAir may also make an ACH debit for a returned item fee of at least $4.50 or any greater amount that ScentAir is directly or indirectly obligated by NACHA rules to bear in relation to returned items.","CreditCardAuth":"Credit Card Authorization.","description9":" If the “Payment Type” is “Credit Card,” Subscriber agrees to the General Terms. Subscriber also agrees to all terms of the ACH Authorization, except that the NACHA rules will not apply and these differences will apply: (i) the account will be Subscriber’s credit card account instead of its bank account and if a charge is rejected, ScentAir will not resubmit the charge or seek a returned item fee except as allowed by applicable card brand rules; and (ii) Subscriber acknowledges ScentAir’s cancellation and refund policies regarding ScentAir products.","description10":"This Authorization supplements the ESS by providing the method and terms for payment by Subscriber of amounts due under the ESS.","description11":" Subscriber agrees to the terms contained in ScentAir’s Privacy Policy https://www.scentair.com/legal/privacy as they may be updated from time to time and agrees that it will refer to https://www.scentair.com/legal/privacy.html for all information related to ScentAir’s Privacy Policy and any additional rights Subscriber may have related to these Terms and Conditions and this Authorization, as well as any rights related to Subscriber’s data in general.","PaymentAlert":"Payments received after 5:00 EST will reflect after 10:00AM EST the next business day.","CurrentPaymentMethod":"Current AutoPay Payment Method"},"PaymentProfile":{"PAYMENTPROFILE":"PAYMENT PROFILE","FriendlyName":"Friendly Name","PaymentType":"Payment Type","CardType":"Card Type","Credit":"Credit","ACHandECP":"ACH/ECP","Visa":"Visa","MC":"MC","Discover":"Discover","Amex":"Amex","JCB":"JCB","DinersClub":"Diners Club","CreditCardNumber":"Credit Card Number","ExpirationDate":"Expiration Date","CVV":"CVV*","NameOnAccount":"Name on Account","Address":"Address","Address2":"Address 2","Address3":"Address 3","City":"City","StateOrProvince":"State Or Province*","PostalCode":"Postal Code","Country":"Country","SAVE":"SAVE","DELETE":"DELETE","CANCEL":"CANCEL","EDIT":"EDIT","BusinessChecking":"Business Checking","PersonalChecking":"Personal Checking","Savings":"Savings","AccountNumber":"Account Number","AccountNumberTooltip":"Account Number (3 - 17 digits)","Routing Number":"Routing Number","Routing NumberTooltip":"Routing Number (9 digits)","BankName":"Bank Name","PaymentMethods":"PAYMENT METHODS","PaymentMethodsDesc":"Here you can enroll additional payment methods. We accept all major credit cards and ACH (Electronic Check)*","USCCANOption":"*Option currently available for US & CAN Accounts","CurrentSavedMethod":"Current saved Payment Methods:","EndingWith":"ending with","SelectedPaymentValidationMessage":"Selected Payment Method to automatically charge your Scent Service Fee","AddNewPaymentMethod":"ADD NEW PAYMENT METHOD","MANAGEAUTOPAYSETTINGS":"MANAGE AUTOPAY SETTINGS","SecurityReasonDesc":"For security reasons the AUTOPAY enrolled payment method cannot be immediately deleted and it may take up to 72 hours for the deletion request to take place.","PaymentReceivedTimeDesc":"Payments received after 5:00 EST will reflect after 10:00AM EST the next business day.","CuurentAutoPayMethod":"Current AutoPay Payment Method","InvalidProfilePaymentName":"Invalid profile payment name","AutoPayDisabledDesc":"Auto Pay is disabled due to outstanding invoices!","AutoPay":"Auto Pay","InvalidCountry":"Invalid country","InvalidPostalCode":"Invalid Postal Code","InvalidState":"Invalid state","InvalidCity":"Invalid city","InvalidAddress":"Invalid address","InvalidName":"Invalid name","InvalidCVV":"Invalid CVV","InvalidCreditCardNumber":"Invalid credit card number","InvalidBankName":"Invalid Bank Name","InvalidRoutingNumber":"Invalid routing number","InvalidAccountNumber":"Invalid account number","AccountType":"Account Type","InvalidPin":"Invalid Pin"},"ContactUs":{"ContactUs":"Contact Us","AMERICAS":"AMERICAS: Toll free: +1866-723-6824 or +1704-504-2320","France":"France: +33 (0)5 62 57 63 20","Spain":"Spain: +34 914 321 762","Switzerland":"Switzerland: +41 22 501 75 59","Netherlands":"Netherlands: +31 10 223 62 64","UK":"UK: +44 (0) 1628 601650","AllCountries":"All other Countries in Continental Europe & EMEA: +33 (0)5 62 57 63 20","APAC":"APAC: +(853) 626-25256 or (852) 356-35566"},"PaymentAutoPay":{"ManageAutoPay":"Manage AutoPay","AccountOptionDesc":"*Option currently available for US & CAN Accounts","AutoPayDesc":"For added convenience and time savings, AUTOPAY* lets you set automatic payments for your account. Once enrolled we will simply charge your Scent Service Fee automatically via your preferred payment method.","PaymentTermsNote":"Note it can take up to 1 full billing cycle for your AutoPay to start once you enroll. Please continue to pay as usual until you see ‘Net30AUTOPAY’ on your PDF invoice in the Payment Terms section","AutoPay":"AUTOPAY","AddNewPayment":"ADD NEW PAYMENT METHOD","UnenrollInAutoPay":"UNENROLL IN AUTOPAY","Save":"SAVE","ChargesNoteDesc":"(Charges are typically applied on the first business day of the month.)","InvoiceNoteDesc":"All Open invoices must be paid in full before enrolling in AUTOPAY","EndingWith":" ending with","PaymentMethodChargesDesc":"Payment Method will be used to automatically charge your Scent Service Fee","AUTOPAY":"AUTOPAY","ScentAirTermsConditionDesc":"ScentAir Electronic Payment Terms and Conditions","BYCHECKING":"BY CHECKING THE BOX,","AuthorizedAgent":"Authorized Agent (“Agent”):","certifies":"(a) certifies","AuthorizedCertifiesDesc1":"that Agent (i) is authorized to sign and legally bind Subscriber to contracts and to select Subscriber’s recurring Payment Type, and (ii) has corrected any errors in the above fields and will supply accurate details about Subscriber’s Payment Type in the subsequent screens that are provided by Chase Paymentech; ","AuthorizedCertifiesDesc2":"(b) signs","AuthorizedCertifiesDesc3":"the below “Enrollment & Authorization of Recurring Payments” (“","Authorization":"Authorization","AuthorizedCertifiesDesc4":"”) on behalf of Subscriber, which Authorization is incorporated herein;","AuthorizedCertifiesDesc5":"BY CHECKING THE BOX,","AuthorizedCertifiesDesc6":"that Agent (i) has made a copy of the Authorization for Subscriber's records, and (ii) confirms Subscriber's signature and delivers the Authorization for ScentAir's acceptance (in its discretion); and ","AuthorizedCertifiesDesc7":"(d) consents","AuthorizedCertifiesDesc8":" to the processing of any outstanding balance on Subscriber’s account and understands that the enrolled credit card will be charged in that amount without any further authorization.","AuthorizedCertifiesDesc9":"Enrollment & Authorization of Recurring Payments (“Authorization”)","GeneralTerms":"General Terms:","AuthorizedCertifiesDesc10":"The Subscriber named in the “Environmental Scent Service Agreement” (“ESS”) between Subscriber and ScentAir, hereby authorizes ScentAir, for the term of the ESS, to obtain funds from the “Payment Type” selected above for purposes of paying amounts, including late charges and other fees, now or later due from Subscriber as specified in ScentAir invoices (“","InvoiceAmounts":"Invoice Amounts","AuthorizedCertifiesDesc11":"”). Subscriber agrees that all ESS-related transactions are and will always be primarily for business purposes and that Subscriber is and will remain the owner of the bank, or credit card, account specified during enrollment (“","EnrollmentScreens":"Enrollment Screens","AuthorizedCertifiesDesc12":"”). Subscriber agrees that this Authorization will remain in effect until subscriber cancels it by providing notice via the below “Cancellation Mechanism” at least fifteen (15) days prior to the next invoice billing date. Subscriber agrees that it will still owe the Invoice Amount(s) to the extent ScentAir is not able to obtain payment via Subscriber’s Payment Type. ScentAir reserves all rights. As used above, “Cancellation Mechanism” means notice to ScentAir either (a) at 3810 Shutterfly Road, Suite 900, Charlotte, NC 28217 by certified mail, or (b) via email at","CustomerCare":"customercare@scentair.com","AuthorizedCertifiesDesc13":", which notice shall state (i) the date of notice delivery and Subscriber’s Customer ID #, (ii) the effective date for cancellation of the recurring payment method, and (iii) the payment method Subscriber will use post-cancellation.","SubscriberFurtherAgrees":"Subscriber further agrees:","ACHAuthorization":"ACH Authorization.","ACHAuthorizationDesc1":"If the “Payment Type” is “ACH CCD,” Subscriber agrees to the General Terms and to the rules of the National Automated Clearinghouse (“NACHA” or “ACH”) now or later in effect. In addition, Subscriber authorizes ScentAir to debit the Invoice Amounts (which may vary in amount) on, or shortly before or after, the invoice due date from the bank account indicated in the Enrollment Screens (as updated). Subscriber agrees to: (a) timely notify ScentAir of any changes in Subscriber’s account information; and (b) reimburse ScentAir for all penalties and fees incurred as a result of any rejection of ScentAir’s request for account funds for any reason, including insufficient or unavailable funds or as a result of the account not being properly configured (such as for ACH transactions). Subscriber agrees that if an Invoice Amount is returned unpaid: (a) ScentAir may at its discretion attempt to process it as allowed by applicable NACHA rules, and (b) ScentAir may also make an ACH debit for a returned item fee of at least $4.50 or any greater amount that ScentAir is directly or indirectly obligated by NACHA rules to bear in relation to returned items.","CreditCardAuthorization":"Credit Card Authorization.","PaymentTypeDesc":"If the “Payment Type” is “Credit Card,” Subscriber agrees to the General Terms. Subscriber also agrees to all terms of the ACH Authorization, except that the NACHA rules will not apply and these differences will apply: (i) the account will be Subscriber’s credit card account instead of its bank account and if a charge is rejected, ScentAir will not resubmit the charge or seek a returned item fee except as allowed by applicable card brand rules; and (ii) Subscriber acknowledges ScentAir’s cancellation and refund policies regarding ScentAir products.","PaymentTypeDesc1":"This Authorization supplements the ESS by providing the method and terms for payment by Subscriber of amounts due under the ESS.","Privacy":"Privacy.","PrivacySubscriberDesc":"Subscriber agrees to the terms contained in ScentAir’s Privacy Policy https://www.scentair.com/legal/privacy as they may be updated from time to time and agrees that it will refer to https://www.scentair.com/legal/privacy.html for all information related to ScentAir’s Privacy Policy and any additional rights Subscriber may have related to these Terms and Conditions and this Authorization, as well as any rights related to Subscriber’s data in general.","PrintTermsConditions":"Print Terms and Conditions","ADDNEWPAYMENTMETHOD":"ADD NEW PAYMENT METHOD","UNENROLLINAUTOPAY":"UNENROLL IN AUTOPAY","SAVE":"SAVE","ACCEPT":"ACCEPT","SUBMIT":"SUBMIT","CANCEL":"CANCEL","ChargesDesc":"(Charges are typically applied on the first business day of the month.)","OpenInvoicesDesc":"All Open invoices must be paid in full before enrolling in AUTOPAY","AUTOPAYUnenrollmentRequestDesc":"AUTOPAY unenrollment requested - Please allow up to 72 hours to for AUTOPAY unenrollment to take affect."},"ForgotPasswordConfirmation":{"Header":"Forgot Password Confirmation","EmailSent":"An email has been sent to reset your password. If you do not receive the email shortly please contact your Customer Care Representative:","AMERICAS":"AMERICAS","TollFree":"Toll free","Or":"or","EMEA":"EMEA","UK":"UK","APAC":"APAC","ReturnToLogin":"RETURN TO LOGIN"},"ForgotUserNameConfirmation":{"Header":"Forgot Username Confirmation","EmailSent":"An email has been sent with your username. If you don’t receive the email shortly please contact your Customer Care Representative:","AMERICAS":"AMERICAS","TollFree":"Toll free","Or":"or","EMEA":"EMEA","UK":"UK","APAC":"APAC","ReturnToLogin":"RETURN TO LOGIN"},"mainMenu":{"Appointments":"Appointments","AccountSummary":"ACCOUNT SUMMARY","PaymentMethods":"PAYMENT METHODS","Customers":"Customers","Products":"Products","Orders":"Orders","About":"About","Settings":"SETTINGS","ContactUs":"CONTACT US","CustomerIdNumber":"Customer ID number","EnrollInAutoPay":"ENROLL IN AUTOPAY","Logout":"LOGOFF","EnrollToolTip":"Currently available in US & CAN accounts"},"pageHeader":{"Dashboard":"Dashboard","Customers":"Customers","Products":"Products","Orders":"Orders","NotFound":"Not-Found","About":"About","Settings":"Settings"},"home":{"NoWidgets1":"You have no widgets displayed. Goto","NoWidgets2":"to configure available widgets","StatisticsTitle":"Some Important Stuff"},"notFound":{"404":"404","pageNotFound":"The page you are looking for does not exist","backToHome":"Back to home"},"settings":{"tab":{"Profile":"Profile","Preferences":"Preferences","Users":"Users","Roles":"Roles"},"header":{"UserProfile":"Profile","UserPreferences":"User Preferences","UserDepartments":"User Departments","UsersManagements":"User Management","RolesManagement":"Role Management"}},"preferences":{"ReloadPreferences":"Reload Preferences:","ReloadPreferencesHint":"Load default preferences (local changes are discarded)","Language":"Language:","English":"English","French":"French","Spanish":"Spanish","Dutch":"Dutch","LanguageHint":"Select the preferred language for your account","HomePage":"Home Page:","Dashboard":"Dashboard","Customers":"Customers","Products":"Products","Orders":"Orders","About":"About","Settings":"Settings","HomePageHint":"Select the default page to navigate to on login","Theme":"Theme:","DefaultColor":"<span class='default-theme-option'>Default</span>","RedColor":"<span class='red-theme-option'>Red</span>","OrangeColor":"<span class='orange-theme-option'>Orange</span>","GreenColor":"<span class='green-theme-option'>Green</span>","GrayColor":"<span class='gray-theme-option'>Gray</span>","BlackColor":"<span class='black-theme-option'>Black</span>","ThemeHint":"Select the default color theme for your account","DashboardStatistics":"Dashboard Statistics:","DashboardStatisticsHint":"Show demo graph widget on the dashboard","DashboardNotifications":"Dashboard Notifications:","DashboardNotificationsHint":"Show application notifications on the dashboard","DashboardTodo":"Dashboard Todo:","DashboardTodoHint":"Shows demo todo widget on the dashboard","DashboardBanner":"Dashboard Banner:","DashboardBannerHint":"Show demo information banner widget on the dashboard","ResetDefault":"Reset default","SetDefault":"Set as default"},"users":{"management":{"Search":"Search...","NewUser":"New User","Edit":"Edit","Delete":"Delete","EditUser":"Edit User \"{{name}}\"","Title":"Title","UserName":"User Name","FullName":"Full Name","Email":"Email","Roles":"Roles","PhoneNumber":"Phone Number"},"editor":{"JobTitle":"Job Title: ","UserName":"User Name:","UserNameRequired":"User name is required (minimum of 2 and maximum of 200 characters)","Password":"Password:","PasswordHint":"Your password is required when changing user name","CurrentPasswordRequired":"Current password is required","Email":"Email:","EmailRequired":"Email address is required (maximum of 200 characters)","InvalidEmail":"Specified email is not valid","ChangePassword":"Change Password","CurrentPassword":"Current Password:","NewPassword":"New Password:","NewPasswordRequired":"New password is required (minimum of 6 characters)","ConfirmPassword":"Confirm Password:","ConfirmationPasswordRequired":"Confirmation password is required","PasswordMismatch":"New password and confirmation password do not match","Roles":"Roles:","FullName":" Full Name:","RoleRequired":" Role is required","PhoneNumber":"Phone #:","Enabled":"Enabled","Unblock":"Unblock","Close":"Close","Edit":"Edit","Cancel":"Cancel","Save":"Save","Saving":"Saving...","Question01":"Question 1","Question02":"Question 2","Answer01":"Answer 1","Answer02":"Answer 2"}},"roles":{"management":{"Search":"Search...","NewRole":"New Role","Edit":"Edit","Details":"Details","Delete":"Delete","RoleDetails":"Role Details \"{{name}}\"","EditRole":"Edit Role \"{{name}}\"","Name":"Name","Description":"Description","Users":"Users"},"editor":{"Name":"Name:","Description":"Description:","RoleNameRequired":"Role name is required (minimum of 2 and maximum of 200 characters)","SelectAll":"Select all","SelectNone":"Select none","Close":"Close","Cancel":"Cancel","Save":"Save","Saving":"Saving..."}},"notifications":{"Delete":"Delete notification","Pin":"Pin notification","Date":"Date","Notification":"Notification"},"todoDemo":{"management":{"Search":"Search for task...","HideCompleted":"Hide Completed","AddTask":"Add Task","Delete":"Delete task","Important":"Mark as important","Task":"Task","Description":"Description"},"editor":{"NewTask":"New Task","Name":"Name","TaskNameRequired":"Task name is required","Description":"Description","Important":"Mark as important","AddTask":"Add Task"}}};

/***/ }),

/***/ "./src/app/assets/locale/fr.json":
/*!***************************************!*\
  !*** ./src/app/assets/locale/fr.json ***!
  \***************************************/
/*! exports provided: app, Login, Register, ForgotUsername, ForgotPassword, AccountSummary, InvoiceHistory, PayNow, PaymentProfile, ContactUs, PaymentAutoPay, ForgotPasswordConfirmation, ForgotUserNameConfirmation, mainMenu, pageHeader, home, notFound, settings, preferences, users, roles, notifications, todoDemo, default */
/***/ (function(module) {

module.exports = {"app":{"Welcome":"Bienvenue sur votre portail client","Notifications":"Merci d'avoir choisi ScentAir","New":"Nouveau","SessionEnd":"Session terminée!"},"Login":{"CustomerLogin":"Connexion Client","UserName":"Nom d'utilisateur","Password":"Mot de passe","UserNameRequired":"Nom d'utilisateur requis","PasswordRequired":"Mot de passe requis","ForgotUserName":"Nom d'utilisateur oublié","ForgotPassword":"Mot de passe oublié","SignIn":"SE CONNECTER","RegisterNow":"S'INSCRIRE MAINTENANT ","QuickandEasyAccess":"Accès rapide et facile","QuickandEasyAccessDescription":"Avec votre portail client ScentAir, vous gagnez du temps en trouvant facilement les réponses à certaines questions que vous vous posez. Vous pouvez simplement planifier vos paiements et se consacrer à ce qui vous importe le plus - vos clients !","WhyRegister":"Pourquoi s'inscrire ?","RegisterDescription":"Lorsque vous êtes enregistré vous pouvez gérer votre compte de n'importe où :","RegisterBulletPoint1":"Visualiser et télécharger les factures","RegisterBulletPoint2":"Régler une facture*","RegisterBulletPoint3":"Accéder à l'historique des factures","RegisterBulletPoint4":"","RegisterNote":"*(Disponible pour les comptes USA & Canada)","Quetions":"Vous avez une question ?","ContactUs":"Nous contacter","Privacy":"Politique de Confidentialité","TermsofUse":"Conditions D'utilisation","FAQ":"Foire aux questions","CopyRight":"ScentAir. Tous droits réservés.","Corporate":"Siège social : 3810 Shutterfly Rd., Charlotte, NC 28217 | +1 (704) 504-2320","SigningIn":"Connectez-vous...","ContactUsOnFooter":"Nous contacter"},"Register":{"Step1Registration":"Étape 1 d'inscription","CustomerIDNumber":"Numéro Client","CustomerIDNumberToolTip":"Vous trouverez ce numéro en haut à droite de votre contrat et de vos factures.","PINNumber":"Numéro PIN","PINNumberToolTip":"Consultez l'email de bienvenue que vous avez reçu. Vous ne l'avez pas ? Contactez-nous.","LookupAccount":"Rechercher le compte","CANCEL":"ANNULER","Step2Registration":"Étape 2 d'inscription","FirstName":"Prénom","LastName":"Nom","EmailAddress":"Adresse Email","PhoneNumber":"Numéro de Téléphone","UserName":"Nom d'utilisateur","UserNameToolTip":"Doit contenir au moins 7 caractères","Password":"Mot de Passe","PasswordToolTip":"Doit contenir au moins 8 caractères, une majuscule, une minuscule, un numéro et un caractère spécial (@, #, %, &, +, !, ?)","ConfirmPassword":"Confirmer le Mot de Passe","SecurityQuestion1":"Question de Sécurité 1","Answer":"Réponse","SecurityQuestion2":"Question de Sécurité 2","PrivacyandTermsofUse":"Cochez cette case pour indiquer que vous avez lu et approuvé notre","Privacy":"Politique de Confidentialité","And":"et nos","TermsofUse":"Conditions D'utilisation","PrivacyandTermsofUseRemaining":"","MotherMaidenName":"Quel est le nom de jeune fille de votre mère ?","BornCity":"Dans quelle ville êtes vous né(e) ?","CarBrand":"Quelle était la marque de votre première voiture ?","Friend":"Quel est le nom de votre meilleur(e) ami(e) d'enfance ?","VacationSpot":"Quel est votre destination préférée pour les vacances ?","FirstEmployerName":"Quel est le nom de votre premier employeur ?","SaveLoginButton":"Enregistrer et se connecter","CANCELButton":"ANNULER","Lookingupaccount":"Recherche de compte ...","err":"se tromper","UserNameValidation":"Le nom d'utilisateur doit être composé des lettres A à Z et / ou des chiffres de 0 à 9 uniquement.","PasswordValidation":"Mot de passe requis","ConfirmPasswordMatchValidation":"Le mot de passe ne correspond pas à la confirmation","ConfirmPasswordValidation":"La confirmation du mot de passe est requise","PINNumberValidation":"Pin invalide","FirstNameValidation":"Le prénom est requis","LastNameValidation":"Le nom est requis","EmailValidation":"Adresse e-mail est nécessaire","InvalidAccountNumber":"Numéro de compte invalide","PhoneNumberValidation":"Le numéro de téléphone est obligatoire","QuetionValidation":"Veuillez sélectionner une question de sécurité","AnswerValidation":"La réponse est requise","CheckBoxValidation":"Cochez ici pour indiquer que vous avez lu et accepté notre","UserNameRequired":"Nom d'utilisateur est nécessaire","UserNameCharLength":"Le nom d'utilisateur doit comporter au moins 7 caractères.","PasswordCharLength":"Doit contenir au moins 8 caractères, une majuscule, une minuscule, un numéro et un caractère spécial (@, #, %, &, +, !, ?)","PasswordContains":"Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.","ConfirmPasswordRequired":"La confirmation du mot de passe est requise","Login":"S'identifier","ErrorMessage1":"Ce compte a déjà été enregistré. Si nécessaire, vous pouvez réinitialiser votre nom d'utilisateur ou votre mot de passe","ErrorMessage2":"Compte ou code PIN invalide","Here":"ici","Header":"confirmation d'enregistrement","RegistrationComplete":"Votre inscription est maintenant terminée.","ToViewDetails":" pour afficher les détails du compte, effectuer des paiements et ajouter des utilisateurs supplémentaires."},"ForgotUsername":{"ForgotUsername":"Nom d'utilisateur oublié","HeaderLabel":"Entrez votre numéro client ScentAir et votre adresse email. Nous vous enverrons un email avec votre nom d'utilisateur.","CustomerIdNumber":"Numéro Client","AccountPopOver":"Vous trouverez ce numéro en haut à droite de votre contrat et de vos factures.","InvalidAccountNumber":"numéro de compte invalide","EmailAddress":"Adresse Email","EmailAddressPopOver":"Entrez l'adresse email utilisée lors de votre première connexion","EmailAddressValidation":"Adresse e-mail est nécessaire","SendEmailBtn":"ENVOYER L'EMAIL","CancelBtn":"ANNULER"},"ForgotPassword":{"ForgotPassword":"Mot de Passe oublié","HeaderLabel":"Entrez votre nom d'utilisateur et un email vous sera envoyé pour réinitialiser votre mot de passe :","UserName":"Nom d'utilisateur","InvalidUserName":"Nom d'utilisateur invalide","SendEmailBtn":"ENVOYER L'EMAIL","CancelBtn":"ANNULER"},"AccountSummary":{"CustomerIDNumber":"Numéro client :","ACCOUNTSUMMARY":"RÉSUMÉ DU COMPTE","PAYMENTMETHODS":"Moyens de paiement","SETTINGS":"PARAMÈTRES","CONTACTUS":"NOUS CONTACTER","LOGOFF":"SE DÉCONNECTER","ENROLLINAUTOPAY":"S'INSCRIRE AU PAIEMENT AUTOMATIQUE ?","AvailableInUSnCANAccounts":"?   Actuellement disponible pour les comptes USA & Canada","INVOICEHISTORY":"HISTORIQUE DE FACTURATION","AccountSummaryDescription":"Bienvenue dans le centre de gestion de votre compte ScentAir. D'ici vous pouvez rapidement visualiser, télécharger et imprimer vos factures. De plus, vous pouvez régler vos factures avec le moyen de paiement de votre choix, n'importe où et n'importe quand.","AvailableInUSnCANNote":"*Option actuellement disponible pour les comptes USA & Canada","InvoicePayTitle":"Sélectionnez les factures à payer. Les factures avec les conditions de paiement «Dû le 1er», «Net 30 CC» et «NET30AUTOPAY» seront automatiquement imputées sur la méthode de paiement enregistrée. Autoriser les pop-ups.","Pay":"Payer","Invoice#":"Numéro de facture","Status":"Statut","PaymentTerms":"Méthode de paiement et échéance","InvoiceDate":"Date de la Facture","InvoiceDue":"Facture Dûe","BalanceDue":"Balance Dûe","TotalBalanceDue":"Total Balance Dûe","TotalPaymentAmount":"Montant Total","PAYNOW":"PAYER MAINTENANT","PaymentNote":"Les paiements reçus après 23h apparaitront à partir 16h le prochain jour ouvré.","PASTDUE":"En Retard","DUENOW":"Due Maintenant"},"InvoiceHistory":{"INVOICEHISTORY":"HISTORIQUE DE FACTURATION","OPENINVOICES":"FACTURES OUVERTES","InvoiceNote":"Voir & imprimer vos factures payées","Invoice#":"Numéro de Facture","Status":"Statut","InvoiceDate":"Date de la Facture","InvoiceAmount":"Montant de la Facture","Cancelled":"Annulé","Open":"Ouvrir","PartiallyPaid":"Partiellement payé","PaidInFull":"Payé"},"PayNow":{"PayNow":"Payez maintenant","PaymentInvoices":"Vous effectuez un paiement sur les factures suivantes.","InvoiceNumber":"Facture d'achat #","DueDate":"Date d'échéance","InvoiceAmount":"Montant de la facture","PaymentAmount":"Montant du paiement","TotalPaymentAmount":"Montant total du paiement:","SelectPaymentMethod":"Sélectionnez le mode de paiement ou","SetupNewProfile":"Configurer un nouveau profil de paiement","AutopayMethodCannotDeleted":"Pour des raisons de sécurité, le mode de paiement inscrit à AUTOPAY ne peut pas être supprimé immédiatement et la demande de suppression peut prendre jusqu'à 72 heures.","EDIT":"MODIFIER","CANCEL":"ANNULER","SUBMIT":"SOUMETTRE","ACCEPT":"ACCEPTEZ","selectedServiceCharge":"Méthode de paiement sélectionnée pour facturer automatiquement vos frais de service Scent","ElectronicPaymentTermsAndCondition":"Conditions de paiement électronique ScentAir","PaymentCompleteWarning":"Ne cliquez pas à nouveau sur ENVOYER ni sur le bouton Précédent jusqu'à ce que la transaction de paiement soit terminée","Privacy":"Intimité.","ByCheckingBox":"En vérifiant la boîte,","AuthorizedAgent":"Agent autorisé («agent»):","Certifies":"(a) certifie","AgentAuthority":"que l'agent (i) est autorisé à signer et à lier légalement l'abonné à des contrats et à sélectionner le type de paiement récurrent de l'abonné, et (ii) a corrigé les erreurs éventuelles dans les champs ci-dessus et fournira des informations précises sur le type de paiement de l'abonné dans les écrans suivants fourni par Chase Paymentech;","Signs":"b) des signes","EnrollmentAndAuth1":"ci-dessous «Inscription et autorisation des paiements récurrents» («","Authorization":"Autorisation","EnrollmentAndAuth2":"”) Au nom du souscripteur, laquelle autorisation est incorporée aux présentes;","Certifies2":"(c) certifie","description1":"que l'agent (i) ait fait une copie de l'autorisation pour les dossiers du souscripteur et (ii) confirme la signature du souscripteur et délivre l'autorisation pour l'acceptation de ScentAir (à sa discrétion); et","Consents":"(d) consentements","description2":"au traitement de tout solde impayé sur le compte du souscripteur et comprend que la carte de crédit enregistrée sera débitée du montant correspondant sans autre autorisation.","description3":"Inscription et autorisation de paiements récurrents («autorisation»)","GeneralTerms":"Conditions générales:","description4":"Le souscripteur désigné dans le «Contrat de service sur le parfum à l'environnement» («SSE») entre le souscripteur et ScentAir autorise ScentAir, pour la durée du SSE, à obtenir des fonds du «Type de paiement» sélectionné ci-dessus aux fins du paiement de montants, y compris: frais de retard et autres frais, dus maintenant ou ultérieurement par le souscripteur, comme spécifié dans les factures de ScentAir («","InvoiceAmounts":"Montants de la facture","description5":"”). L'abonné convient que toutes les transactions liées au SSE sont et seront toujours principalement à des fins commerciales et qu'il est et restera le propriétaire de la banque, ou du compte de carte de crédit, spécifié lors de l'inscription («","EnrollmentScreens":"Écrans d'inscription","description6":"”). L'abonné accepte que cette autorisation reste en vigueur jusqu'à son annulation par le souscripteur, au moyen d'un «mécanisme d'annulation», au moins quinze (15) jours avant la date de facturation suivante. L'abonné accepte de devoir toujours payer le (s) montant (s) de la facture dans la mesure où ScentAir n'est pas en mesure d'obtenir le paiement par le type de paiement de l'abonné. ScentAir se réserve tous les droits. Tel qu’il est utilisé ci-dessus, le terme «Mécanisme d’annulation» désigne un avis adressé à ScentAir:","description7":", la notification doit indiquer (i) la date de livraison de la notification et le numéro d’identité du client de l’abonné, (ii) la date effective de l’annulation du mode de paiement récurrent et","SubscriberAgrees":"L'abonné accepte en outre:","ACHAuthorization":"Autorisation ACH.","description8":"Si le «type de paiement» est «ACH CCD», l'abonné accepte les Conditions générales et les règles du Centre national automatisé de compensation («NACHA» ou «ACH») en vigueur ou ultérieurement. En outre, le souscripteur autorise ScentAir à débiter les montants de la facture (dont le montant peut varier) à la date d'échéance de la facture ou peu de temps avant ou après, du compte bancaire indiqué dans les écrans d'inscription (mis à jour). L’abonné s’engage à: (a) informer en temps voulu ScentAir de tout changement d’information concernant son compte; et (b) rembourser à ScentAir toutes les pénalités et tous les frais encourus du fait de tout rejet de la demande de fonds de ScentAir pour une raison quelconque, y compris des fonds insuffisants ou indisponibles, ou du fait que le compte n’a pas été correctement configuré (comme pour les transactions ACH). ). L'abonné accepte que si un montant de facture est retourné impayé: (a) ScentAir peut, à sa discrétion, tenter de le traiter conformément aux règles en vigueur de la NACHA, et (b) ScentAir peut également effectuer un débit d'ACH pour des frais de retour d'articles d'au moins 4,50 USD. ou tout montant supérieur que ScentAir est directement ou indirectement obligé par les règles de la NACHA à supporter en ce qui concerne les articles retournés.","CreditCardAuth":"Autorisation de carte de crédit.","description9":"Si le «type de paiement» est «carte de crédit», l'abonné accepte les conditions générales. L'abonné accepte également toutes les conditions de l'autorisation ACH, à l'exception du fait que les règles de la NACHA ne s'appliqueront pas et que ces différences s'appliqueront: (i) le compte sera le compte de carte de crédit de l'abonné au lieu de son compte bancaire et si un débit est rejeté, ScentAir ne pas soumettre à nouveau les frais ou demander des frais pour un article retourné, sauf dans les cas permis par les règles applicables à la marque de la carte; et (ii) l’Abonné reconnaît les politiques d’annulation et de remboursement de ScentAir concernant les produits ScentAir.","description10":"Cette autorisation complète le SSE en fournissant la méthode et les conditions de paiement par le souscripteur des montants dus en vertu du SSE.","description11":"L'abonné accepte les conditions contenues dans la politique de confidentialité de ScentAir https://www.scentair.com/legal/privacy car elles peuvent être mises à jour de temps à autre et accepte de se reporter à https://www.scentair.com/legal. /privacy.html pour toutes les informations liées à la politique de confidentialité de ScentAir et à tous les droits supplémentaires que l’abonné peut avoir relatifs aux présentes conditions générales et à la présente autorisation, ainsi qu’à tous les droits associés aux données de l’abonné en général."},"PaymentProfile":{"PAYMENTPROFILE":"PROFIL DE PAIEMENT","FriendlyName":"Nom d'utilisateur","PaymentType":"Type de paiement","CardType":"Type de carte","Credit":"Crédit","ACHandECP":"ACH/ECP","Visa":"Visa","MC":"Mastercard","Discover":"Discover","Amex":"Amex","JCB":"JCB","DinersClub":"DinersClub","CreditCardNumber":"Numéro de carte de crédit","ExpirationDate":"Date d'expiration","CVV":"CVV","NameOnAccount":"Titulaire du compte","Address":"Adresse","Address2":"Adresse 2","Address3":"Adresse 3","City":"Ville","StateOrProvince":"Département ou Région","PostalCode":"Code Postal","Country":"Pays","SAVE":"SAUVEGARDER","DELETE":"SUPPRIMER","CANCEL":"ANNULER","EDIT":"MODIFIER","BusinessChecking":"Vérification d'entreprise","PersonalChecking":"Vérification personnelle","Savings":"Des économies","AccountNumber":"Numéro de compte ","AccountNumberTooltip":"Numéro de compte (3 - 17 chiffres)","RoutingNumber":"Numéro de routage ","RoutingNumberTooltip":"numéro d'acheminement (9 chiffres)","BankName":"Nom de banque ","PaymentMethods":"Modes de Paiement","PaymentMethodsDesc":"Ici, vous pouvez ajouter des modes de paiement supplémentaires. Nous acceptons les paiements par carte de crédit et par ACH (chèque électronique) *","USCCANOption":"*Option actuellement disponible pour les comptes US et CAN","CurrentSavedMethod":"Modes de paiement actuellement enregistrés :","EndingWith":"se terminant par","SelectedPaymentValidationMessage":"Méthode de paiement sélectionnée pour facturer automatiquement vos frais de service Scent","AddNewPaymentMethod":"Ajouter un nouveau mode de paiement","MANAGEAUTOPAYSETTINGS":"GÉRER LES PARAMÈTRES AUTOPAY","SecurityReasonDesc":"Pour des raisons de sécurité, si vous êtes inscrit au mode de paiement AUTOPAY et que vous souhaitez le supprimer, sachez que la demande de suppression peut prendre jusqu'à 72h..","PaymentReceivedTimeDesc":"Les paiements reçus après 17h00 HNE seront répercutés après 10h00 HNE le jour ouvrable suivant","CuurentAutoPayMethod":"Méthode de paiement AutoPay actuelle","InvalidProfilePaymentName":"Nom de paiement de profil invalide","AutoPayDisabledDesc":"Auto Pay est désactivé en raison de factures impayées!","AutoPay":"Paiement automatique","InvalidCountry":"Pays invalide","InvalidPostalCode":"Code postal invalide","InvalidState":"Etat non valide","InvalidCity":"Ville invalide","InvalidAddress":"Adresse invalide","InvalidName":"Nom incorrect","InvalidCVV":"CVV invalide","InvalidCreditCardNumber":"Numéro de carte de crédit invalide","InvalidBankName":"Nom de banque invalide","InvalidRoutingNumber":"Numéro de routage invalide","InvalidAccountNumber":"numéro de compte invalide","AccountType":"Type de compte","InvalidPin":"Pin invalide"},"ContactUs":{"ContactUs":"Nous contacter","AMERICAS":"Amérique : Numéro Vert: +1866-723-6824 or +1704-504-2320","France":"France : +33 (0)5 62 57 63 20","Spain":"Espagne : +34 914 321 762","Switzerland":"Suisse : +41 22 501 75 59","Netherlands":"Hollande : +31 10 223 62 64","UK":"Royaume-Uni : +44 (0) 1628 601650","AllCountries":"Tous les autres pays d'Europe continentale et EMEA : +33 (0)5 62 57 63 20","APAC":"Asie-Pacifique : +(853) 626-25256 or (852) 356-35566"},"PaymentAutoPay":{"ManageAutoPay":"Gérer AutoPay","AccountOptionDesc":"*Option actuellement disponible pour les comptes USA & Canada","AutoPayDesc":"Pour plus de facilité et un gain de temps, AUTOPAY* vous permet de programmer un paiment automatique. Une fois inscrit, nous vous facturerons votre loyer automatiquement via le mode de paiement sélectionné.","PaymentTermsNote":"Notez que le démarrage d'AutoPay peut prendre jusqu'à un cycle de facturation complet  à compter de l'inscription. Continuez tout de même à régler vos factures comme d'habitude jusqu'à ce que 'Net30AUTOPAY' s'affiche sur votre facture PDF dans la section 'Modalités de Paiement'.","AutoPay":"AUTOPAY","AddNewPayment":"AJOUTER UN NOUVEAU MODE DE PAIEMENT","UnenrollInAutoPay":"SE DÉSINSCRIRE D'AUTOPAY","Save":"SAUVEGARDER","ChargesNoteDesc":"(Les frais sont généralement appliqués le premier jour ouvré du mois.)","InvoiceNoteDesc":"Toutes les factures ouvertes doivent être entièrement payées avant l'inscription à AutoPay","EndingWith":" se terminant par","PaymentMethodChargesDesc":"Mode de paiement sera utilisé pour facturer automatiquement vos frais de service Scent","AUTOPAY":"AUTOPAY","ScentAirTermsConditionDesc":"Conditions de paiement électronique ScentAir","BYCHECKING":"En vérifiant la boîte,","AuthorizedAgent":"Agent autorisé («Agent»):","certifies":"(a) certifie","AuthorizedCertifiesDesc1":"que l'agent (i) est autorisé à signer et à lier légalement l'abonné à des contrats et à sélectionner le type de paiement récurrent de l'abonné, et (ii) a corrigé les erreurs éventuelles dans les champs ci-dessus et fournira des informations précises sur le type de paiement de l'abonné dans les écrans suivants: fourni par Chase Paymentech;","AuthorizedCertifiesDesc2":"(b) des signes","AuthorizedCertifiesDesc3":"ci-dessous «Inscription et autorisation des paiements récurrents» («","Authorization":"Autorisation","AuthorizedCertifiesDesc4":"”) Au nom du souscripteur, laquelle autorisation est incorporée aux présentes;","AuthorizedCertifiesDesc5":"En vérifiant la boîte,","AuthorizedCertifiesDesc6":"que l'agent (i) ait fait une copie de l'autorisation pour les dossiers du souscripteur et (ii) confirme la signature du souscripteur et délivre l'autorisation pour l'acceptation de ScentAir (à sa discrétion); et","AuthorizedCertifiesDesc7":"(d) consentements","AuthorizedCertifiesDesc8":"au traitement de tout solde restant sur le compte du souscripteur et comprend que la carte de crédit enregistrée sera débitée de ce montant sans autre autorisation.","AuthorizedCertifiesDesc9":"Inscription et autorisation de paiements récurrents («autorisation»)","GeneralTerms":"Conditions générales:","AuthorizedCertifiesDesc10":"Le souscripteur désigné dans le «Contrat de service sur le parfum à l'environnement» («SSE») entre le souscripteur et ScentAir autorise ScentAir, pour la durée du SSE, à obtenir des fonds du «Type de paiement» sélectionné ci-dessus aux fins de paiement frais de retard et autres frais, dus maintenant ou ultérieurement par le souscripteur, comme spécifié dans les factures de ScentAir («","InvoiceAmounts":"Montants de la facture","AuthorizedCertifiesDesc11":"”). L'abonné convient que toutes les transactions liées au SSE sont et seront toujours principalement à des fins commerciales et qu'il est et restera le propriétaire de la banque ou du compte de carte de crédit spécifié lors de l'inscription","EnrollmentScreens":"Écrans d'inscription","AuthorizedCertifiesDesc12":"”). L'abonné accepte que cette autorisation reste en vigueur jusqu'à son annulation par le souscripteur, au moyen d'un «mécanisme d'annulation», au moins quinze (15) jours avant la date de facturation suivante. L'abonné accepte de devoir toujours payer le (s) montant (s) de la facture dans la mesure où ScentAir n'est pas en mesure d'obtenir le paiement par le biais du type de paiement de l'abonné. ScentAir se réserve tous les droits. Tel qu’il est utilisé ci-dessus, le terme «mécanisme d’annulation» désigne un avis adressé à ScentAir soit (a) au 3810 Shutterfly Road, Suite 900, Charlotte, NC 28217 par courrier certifié, ou (b) par courrier électronique à","CustomerCare":"customercare@scentair.com","AuthorizedCertifiesDesc13":", la notification doit indiquer (i) la date de livraison de la notification et le numéro d’identité du client de l’abonné, (ii) la date effective de l’annulation du mode de paiement récurrent, et (iii) le mode de paiement utilisé par l’abonné après sa résiliation.","SubscriberFurtherAgrees":"L'abonné accepte en outre:","ACHAuthorization":"Autorisation ACH.","ACHAuthorizationDesc1":"Si le «type de paiement» est «ACH CCD», l'abonné accepte les Conditions générales et les règles du Centre national automatisé de compensation («NACHA» ou «ACH») en vigueur ou ultérieurement. En outre, le souscripteur autorise ScentAir à débiter les montants de la facture (dont le montant peut varier) à la date d'échéance de la facture ou peu de temps avant ou après, du compte bancaire indiqué dans les écrans d'inscription (mis à jour). L’abonné s’engage à: (a) informer en temps voulu ScentAir de tout changement d’information concernant son compte; et (b) rembourser à ScentAir toutes les pénalités et tous les frais encourus du fait de tout rejet de la demande de fonds de ScentAir pour une raison quelconque, y compris des fonds insuffisants ou indisponibles, ou du fait que le compte n’a pas été correctement configuré (comme pour les transactions ACH). ). L'abonné accepte que si un montant de facture est retourné impayé: (a) ScentAir peut, à sa discrétion, tenter de le traiter conformément aux règles en vigueur de la NACHA, et (b) ScentAir peut également effectuer un débit d'ACH pour des frais de retour d'articles d'au moins 4,50 USD. ou tout montant supérieur que ScentAir est directement ou indirectement obligé par les règles de la NACHA à supporter en ce qui concerne les articles retournés.","CreditCardAuthorization":"Autorisation de carte de crédit.","PaymentTypeDesc":"Si le «type de paiement» est «carte de crédit», l'abonné accepte les conditions générales. L'abonné accepte également toutes les conditions de l'autorisation ACH, sauf que les règles de la NACHA ne s'appliqueront pas et que ces différences s'appliqueront: ne pas soumettre à nouveau les frais ou demander des frais pour un article retourné, sauf dans les cas permis par les règles applicables à la marque de la carte; et (ii) l’Abonné reconnaît les politiques d’annulation et de remboursement de ScentAir concernant les produits ScentAir.","PaymentTypeDesc1":"Cette autorisation complète le SSE en fournissant la méthode et les conditions de paiement par le souscripteur des montants dus en vertu du SSE.","Privacy":"Intimité.","PrivacySubscriberDesc":"L'abonné accepte les conditions contenues dans la politique de confidentialité de ScentAir. https://www.scentair.com/legal/privacy comme ils peuvent être mis à jour de temps en temps et accepte qu'il se réfère à https://www.scentair.com/legal/privacy.html pour toutes les informations liées à la politique de confidentialité de ScentAir et à tous les droits supplémentaires que l’abonné peut avoir concernant les présentes conditions générales et la présente autorisation, ainsi que tous les droits liés aux données de l’abonné en général.","PrintTermsConditions":"Imprimer les termes et conditions","ADDNEWPAYMENTMETHOD":"Ajouter un nouveau mode de paiement","UNENROLLINAUTOPAY":"SE DÉSINSCRIRE D'AUTOPAY","SAVE":"ENREGISTRER","ACCEPT":"ACCEPTEZ","SUBMIT":"SOUMETTRE","CANCEL":"ANNULER","ChargesDesc":"(Les frais sont généralement appliqués le premier jour ouvrable du mois.)","OpenInvoicesDesc":"Toutes les factures ouvertes doivent être payées en totalité avant de s’inscrire à AUTOPAY.","AUTOPAYUnenrollmentRequestDesc":"Désinscription AUTOPAY demandée - Veuillez prévoir 72 heures pour que la désinscription AUTOPAY prenne effet."},"ForgotPasswordConfirmation":{"Header":"Confirmation de mot de passe oublié","EmailSent":"Le hemos enviado un correo electrónico para restablecer su contraseña. Si en breve no recibe el correo electrónico, favor de comunicarse con su representante de atención al cliente:","AMERICAS":"Amérique","TollFree":"Numéro Vert","Or":"ou","EMEA":"EMEA","UK":"Royaume-Uni ","APAC":"Asie-Pacifique","ReturnToLogin":"Retour à la connexion"},"ForgotUserNameConfirmation":{"Header":"Confirmation du nom d'utilisateur oublié","EmailSent":"Un e-mail a été envoyé avec votre nom d'utilisateur. Si vous ne recevez pas l'e-mail prochainement, veuillez contacter votre représentant du service clientèle:","AMERICAS":"Amérique ","TollFree":"Numéro Vert","Or":"or","EMEA":"EMEA","UK":"Royaume-Uni","APAC":"Asie-Pacifique","ReturnToLogin":"Retour à la connexion"},"mainMenu":{"Appointments":"Rendez-vous","AccountSummary":"RÉSUMÉ DU COMPTE","PaymentMethods":"MOYENS DE PAIEMENT","Customers":"Les clients","Products":"Les produits","Orders":"Les ordres","About":"À Propos","Settings":"PARAMÈTRES","ContactUs":"NOUS CONTACTER","CustomerIdNumber":"Numéro client","EnrollInAutoPay":"S'inscrire à autopay?","Logout":"SE DÉCONNECTER","EnrollToolTip":"Actuellement disponible pour les comptes USA & Canada"},"pageHeader":{"Dashboard":"Tableau de bord","Customers":"Les clients","Products":"Les produits","Orders":"Les ordres","NotFound":"Pas trouvé","About":"À Propos","Settings":"Paramètres"},"home":{"NoWidgets1":"Vous n'avez pas de widgets affichés. Aller à","NoWidgets2":"Configurer les widgets disponibles","StatisticsTitle":"Quelques trucs importants"},"notFound":{"404":"404","pageNotFound":"La page que vous recherchez n'existe pas","backToHome":"De retour à la page d'accueil"},"settings":{"tab":{"Profile":"Profil","Preferences":"Préférences","Users":"Utilisateurs","Roles":"Rôles"},"header":{"UserProfile":"Profil","UserPreferences":"Préférences de l'utilisateur","UserDepartments":"Départements d'utilisateurs","UsersManagements":"Gestion des utilisateurs","RolesManagement":"Gestion des rôles"}},"preferences":{"ReloadPreferences":"Recharger les préférences:","ReloadPreferencesHint":"Charger les préférences par défaut (les modifications locales sont rejetées)","Language":"La langue:","English":"Anglais","French":"Français","Dutch":"Néerlandais","Spanish":"Espanol","German":"Allemand","Portuguese":"Portugais","Arabic":"Arabe","Korean":"Coréen","LanguageHint":"Sélectionnez la langue préférée pour votre compte","HomePage":"Page d'accueil:","Dashboard":"Tableau de bord","Customers":"Les clients","Products":"Les produits","Orders":"Les ordres","About":"À propos","Settings":"Paramètres","HomePageHint":"Sélectionnez la page par défaut pour naviguer jusqu'à la connexion","Theme":"Thème:","DefaultColor":"<span class='default-theme-option'>Défaut</span>","RedColor":"<span class='red-theme-option'>Rouge</span>","OrangeColor":"<span class='orange-theme-option'>Orange</span>","GreenColor":"<span class='green-theme-option'>Vert</span>","GrayColor":"<span class='gray-theme-option'>Gris</span>","BlackColor":"<span class='black-theme-option'>Noir</span>","ThemeHint":"Sélectionnez le thème de couleur par défaut pour votre compte","DashboardStatistics":"Statistiques du tableau de bord :","DashboardStatisticsHint":"Afficher le widget de graphique de démonstration sur le tableau de bord","DashboardNotifications":"Notifications du tableau de bord :","DashboardNotificationsHint":"Afficher les notifications d'application sur le tableau de bord","DashboardTodo":"Tableau de bord à faire:","DashboardTodoHint":"Afficher le widget de démon tout sur le tableau de bord","DashboardBanner":"Bannière de Tableau de Bord:","DashboardBannerHint":"Afficher le widget de bannière d'information de démonstration sur le tableau de bord","ResetDefault":"Réinitialiser par défaut","SetDefault":"Définir par défaut"},"users":{"management":{"Search":"Rechercher un utilisateur...","NewUser":"Nouvel utilisateur","Edit":"Modif.","Delete":"Supp.","EditUser":"Modifier Utilisateur \"{{name}}\"","Title":"Titre","UserName":"Nom d'utilisateur","FullName":"Nom Complet","Email":"Adresse électronique","Roles":"Position","PhoneNumber":"Numéro de téléphone"},"editor":{"JobTitle":"Profession : ","UserName":"Nom d'utilisateur :","UserNameRequired":"Le nom d'utilisateur est requis (minimum de 2 et maximum de 200 caractères)","Password":"Mot de passe :","PasswordHint":"Votre mot de passe est nécessaire lors de la modification du nom d'utilisateur","CurrentPasswordRequired":"Le mot de passe actuel est requis","Email":"Adresse Email :","EmailRequired":"L'adresse de courrier électronique est requise (maximum de 200 caractères)","InvalidEmail":"Le courrier électronique spécifié n'est pas valide","ChangePassword":"Changer le mot de passe","CurrentPassword":"Mot de passe actuel :","NewPassword":"Nouveau mot de passe :","NewPasswordRequired":"Un nouveau mot de passe est nécessaire (minimum de 6 caractères)","ConfirmPassword":"Confirmez le mot de passe :","ConfirmationPasswordRequired":"Le mot de passe de confirmation est requis","PasswordMismatch":"Le nouveau mot de passe et le mot de passe de confirmation ne correspondent pas","Roles":"Rôle :","FullName":" Nom complet :","RoleRequired":"Rôle requis ","PhoneNumber":"Numéro de Téléphone :","Enabled":"Activée","Unblock":"Débloquer","Close":"Fermer","Edit":"Modifier","Cancel":"Annuler","Save":"Enregistrer","Saving":"En cours d'enregistrement...","Question01":"Question 1","Question02":"Question 2","Answer01":"Réponse 1","Answer02":"Réponse 2"}},"roles":{"management":{"Search":"Recherche rôle...","NewRole":"Nouveau rôle","Edit":"Modifier","Details":"Détails","Delete":"Effacer","RoleDetails":"Détails des rôles \"{{name}}\"","EditRole":"Modifier Rôle \"{{name}}\"","Name":"Nom","Description":"La description","Users":"Utilisateurs"},"editor":{"Name":"Nom:","Description":"La description:","RoleNameRequired":"Le nom du rôle est requis (minimum de 2 et maximum de 200 caractères)","SelectAll":"Tout sélectionner","SelectNone":"Ne rien sélectionner","Close":"Fermer","Cancel":"Annuler","Save":"Enregistrer","Saving":"En cours d'enregistrement..."}},"notifications":{"Delete":"Supprimer notification","Pin":"Épingler notification","Date":"Date","Notification":"Notification"},"todoDemo":{"management":{"Search":"Rechercher une tâche...","HideCompleted":"Masquer complété","AddTask":"Ajouter une tâche","Delete":"Supprimer la tâche","Important":"Marquer comme important","Task":"Tâche","Description":"Description"},"editor":{"NewTask":"Nouvelle tâche","Name":"Nom","TaskNameRequired":"Le nom de la tâche est requis","Description":"Description","Important":"Marquer comme important","AddTask":"Ajouter une tâche"}}};

/***/ }),

/***/ "./src/app/assets/locale/ko.json":
/*!***************************************!*\
  !*** ./src/app/assets/locale/ko.json ***!
  \***************************************/
/*! exports provided: app, mainMenu, pageHeader, home, notFound, settings, preferences, users, roles, notifications, todoDemo, default */
/***/ (function(module) {

module.exports = {"app":{"Welcome":"환영","Notifications":"알림","New":"새로운"},"mainMenu":{"Appointments":"설비","Customers":"고객","Products":"제작품","Orders":"명령","About":"약","Logout":"로그 아웃"},"pageHeader":{"Dashboard":"계기반","Customers":"고객","Products":"제작품","Orders":"명령","NotFound":"발견되지 않음","About":"약","Settings":"설정"},"home":{"NoWidgets1":"위젯이 표시되지 않았습니다. 고토","NoWidgets2":"사용 가능한 위젯을 구성하는 방법","StatisticsTitle":"중요한 것들"},"notFound":{"404":"404","pageNotFound":"찾고있는 페이지가 존재하지 않습니다.","backToHome":"홈으로"},"settings":{"tab":{"Profile":"윤곽","Preferences":"환경 설정","Users":"사용자","Roles":"역할"},"header":{"UserProfile":"유저 프로필","UserPreferences":"사용자 환경 설정","UserDepartments":"사용자 부서","UsersManagements":"사용자 관리","RolesManagement":"역할 관리"}},"preferences":{"ReloadPreferences":"환경 설정 새로 고침 :","ReloadPreferencesHint":"기본 환경 설정로드 (로컬 변경 사항은 무시됩니다)","Language":"언어:","English":"영어","French":"프랑스 국민","German":"독일어","Portuguese":"포르투갈 인","Arabic":"아라비아 말","Korean":"한국어","LanguageHint":"계정의 기본 언어 선택","HomePage":"홈페이지 :","Dashboard":"계기반","Customers":"고객","Products":"제작품","Orders":"명령","About":"약","Settings":"설정","HomePageHint":"로그인시 이동할 기본 페이지를 선택하십시오.","Theme":"테마:","DefaultColor":"<span class='default-theme-option'>태만</span>","RedColor":"<span class='red-theme-option'>빨간</span>","OrangeColor":"\"<span class='orange-theme-option'>주황색</span>","GreenColor":"<span class='green-theme-option'>녹색</span>","GrayColor":"<span class='gray-theme-option'>회색</span>","BlackColor":"<span class='black-theme-option'>검은</span>","ThemeHint":"계정의 기본 색상 테마 선택","DashboardStatistics":"대시 보드 통계:","DashboardStatisticsHint":"데모 그래프 위젯을 대시 보드에 표시하십시오.","DashboardNotifications":"대시 보드 알림 :","DashboardNotificationsHint":"대시 보드에 애플리케이션 알림 표시","DashboardTodo":"대시 보드 할일:","DashboardTodoHint":"대시 보드에서 데모 할 일 위젯 표시","DashboardBanner":"대시 보드 배너 :","DashboardBannerHint":"데모 정보 배너 위젯을 대시 보드에 표시하십시오.","ResetDefault":"기본값 재설정","SetDefault":"기본값으로 설정"},"users":{"management":{"Search":"사용자 검색...","NewUser":"새로운 사용자","Edit":"편집하다","Delete":"지우다","EditUser":"사용자 편집 \"{{name}}\"","Title":"표제","UserName":"사용자 이름","FullName":"성명","Email":"이메일","Roles":"역할","PhoneNumber":"전화 번호"},"editor":{"JobTitle":"직위: ","UserName":"사용자 이름: ","UserNameRequired":"사용자 이름이 필요합니다 (최소 2 자, 최대 200 자).","Password":"암호:","PasswordHint":"사용자 이름을 변경할 때 암호가 필요합니다.","CurrentPasswordRequired":"현재 비밀번호가 필요합니다.","Email":"이메일:","EmailRequired":"이메일 주소는 필수 사항입니다 (최대 200 자).","InvalidEmail":"지정된 이메일이 유효하지 않습니다.","ChangePassword":"비밀번호 변경","CurrentPassword":"현재 비밀번호:","NewPassword":"새 비밀번호:","NewPasswordRequired":"새 암호가 필요합니다 (최소 6 자).","ConfirmPassword":"비밀번호 확인:","ConfirmationPasswordRequired":"확인 암호가 필요합니다.","PasswordMismatch":"새 비밀번호와 확인 비밀번호가 일치하지 않습니다.","Roles":"역할 :","FullName":"성명 :","RoleRequired":"역할이 필요합니다.","PhoneNumber":"전화 #:","Enabled":"사용","Unblock":"차단 해제","Close":"닫기","Edit":"편집하다","Cancel":"취소","Save":"구하다","Saving":"절약..."}},"roles":{"management":{"Search":"역할 검색...","NewRole":"새로운 역할","Edit":"편집하다","Details":"세부","Delete":"지우다","RoleDetails":"역할 세부 정보 \"{{name}}\"","EditRole":"역할 편집 \"{{name}}\"","Name":"이름","Description":"기술","Users":"사용자"},"editor":{"Name":"이름:","Description":"기술:","RoleNameRequired":"역할 이름은 필수 항목입니다 (최소 2 자, 최대 200 자).","SelectAll":"모두 선택","SelectNone":"없음 선택","Close":"닫기","Cancel":"취소","Save":"구하다","Saving":"절약..."}},"notifications":{"Delete":"알림 삭제","Pin":"핀 알림","Date":"날짜","Notification":"공고"},"todoDemo":{"management":{"Search":"할 일 검색...","HideCompleted":"완료 안함","AddTask":"할 일 추가","Delete":"작업 삭제","Important":"중요한 것으로 표시","Task":"태스크","Description":"기술"},"editor":{"NewTask":"새 작업","Name":"이름","TaskNameRequired":"작업 이름이 필요합니다.","Description":"기술","Important":"중요한 것으로 표시","AddTask":"할 일 추가"}}};

/***/ }),

/***/ "./src/app/assets/locale/pt.json":
/*!***************************************!*\
  !*** ./src/app/assets/locale/pt.json ***!
  \***************************************/
/*! exports provided: app, mainMenu, pageHeader, home, notFound, settings, preferences, users, roles, notifications, todoDemo, default */
/***/ (function(module) {

module.exports = {"app":{"Welcome":"Bem-vindo!","Notifications":"Notificações","New":"Novo"},"mainMenu":{"Appointments":"Compromissos","Customers":"Clientes","Products":"Produtos","Orders":"Pedidos","About":"Sobre","Logout":"Sair"},"pageHeader":{"Dashboard":"Painel de Controle","Customers":"Clientes","Products":"Produtos","Orders":"Pedidos","NotFound":"Não Encontrado","About":"Sobre","Settings":"Configurações"},"home":{"NoWidgets1":"Você não possui widgets a serem mostrados. Ir para","NoWidgets2":"configurar widgets disponíveis","StatisticsTitle":"Alguma coisa importante"},"notFound":{"404":"404","pageNotFound":"A página que você está procurando não foi encontrada","backToHome":"Voltar para a página principal"},"settings":{"tab":{"Profile":"Perfil","Preferences":"Preferências","Users":"Usuários","Roles":"Funções"},"header":{"UserProfile":"Perfil de Usuário","UserPreferences":"Preferências de Usuário","UserDepartments":"Departamentos de Usuários","UsersManagements":"Gerenciamento de Usuários","RolesManagement":"Gerenciamento de Funções"}},"preferences":{"ReloadPreferences":"Recarregar Preferências:","ReloadPreferencesHint":"Carregar as preferências padrão (as alterações atuais serão descartadas)","Language":"Idioma:","English":"English","French":"Français","Spanish":"Spanish","LanguageHint":"Selecione seu idioma","HomePage":"Principal:","Dashboard":"Painel de Controle","Customers":"Clientes","Products":"Produtos","Orders":"Pedidos","About":"Sobre","Settings":"Configurações","HomePageHint":"Selecione a página padrão para acessar após o login","Theme":"Tema:","DefaultColor":"<span class='default-theme-option'>Padrão</span>","RedColor":"<span class='red-theme-option'>Vermelho</span>","OrangeColor":"<span class='orange-theme-option'>Laranja</span>","GreenColor":"<span class='green-theme-option'>Verde</span>","GrayColor":"<span class='gray-theme-option'>Cinza</span>","BlackColor":"<span class='black-theme-option'>Preto</span>","ThemeHint":"Selecione o tema padrão","DashboardStatistics":"Estatísticas do Painel de Controle:","DashboardStatisticsHint":"Mostrar o widget gráfico demonstrativo no Painel de Controle","DashboardNotifications":"Notificações no Painel de Controle:","DashboardNotificationsHint":"Mostra as notificações no painel de controle","DashboardTodo":"Tarefas no Painel de Controle:","DashboardTodoHint":"Mostra o widget demonstrativo de Tarefas no painel de controle","DashboardBanner":"Banner no Painel de Controle:","DashboardBannerHint":"Mostra o widget demonstrativo de informações no painle de controle","ResetDefault":"Resetar","SetDefault":"Definir como Padrão"},"users":{"management":{"Search":"Procurar usuário...","NewUser":"Novo Usuário","Edit":"Editar","Delete":"Excluir","EditUser":"Editar usuário \"{{name}}\"","Title":"Título","UserName":"Nome de Usuário","FullName":"Nome Completo","Email":"E-mail","Roles":"Funções","PhoneNumber":"Telefone"},"editor":{"JobTitle":"Cargo: ","UserName":"Nome de Usuário:","UserNameRequired":"Nome de usuário é obrigatório (mínimo de 2 máximo de 200 caracteres)","Password":"Senha:","PasswordHint":"Sua senha é necessária ao alterar o nome do usuário","CurrentPasswordRequired":"A senha atual é necessária","Email":"Email:","EmailRequired":"Email é obrigatório (máximo de 200 caracteres)","InvalidEmail":"O email especificado não é válido","ChangePassword":"Trocar senha","CurrentPassword":"Senha Atual:","NewPassword":"Nova senha:","NewPasswordRequired":"Nova senha é obrigatória (mínimo de 6 caracteres)","ConfirmPassword":"Confirme a senha:","ConfirmationPasswordRequired":"Confirmação de senha é obrigatória","PasswordMismatch":"Nova senha e Confirmação de senha não são iguais","Roles":"Perfis:","FullName":" Nome Completo:","RoleRequired":" Perfil é Obrigatório","PhoneNumber":"Telefone:","Enabled":"Habilitado","Unblock":"Desbloquear","Close":"Fechar","Edit":"Editar","Cancel":"Cancela","Save":"Salvar","Saving":"Salvando...","Answer01":"Responder 01","Answer02":"Responder 02"}},"roles":{"management":{"Search":"rocurar por Função...","NewRole":"Nova Função","Edit":"Editar","Details":"Detalhes","Delete":"Excluir","RoleDetails":"Detalhes da Função \"{{name}}\"","EditRole":"Editar Função \"{{name}}\"","Name":"Nome","Description":"Descrição","Users":"Usuários"},"editor":{"Name":"Nome:","Description":"Descrição:","RoleNameRequired":"Nome da Função é Obrigatório (mínimo de 2 máximo de 200 caracteres)","SelectAll":"Selecionar Todos","SelectNone":"Nenhum","Close":"Fechar","Cancel":"Cancelar","Save":"Salvar","Saving":"Salvando..."}},"notifications":{"Delete":"Excluir Notificação","Pin":"Fixar notificação","Date":"Data","Notification":"Notificação"},"todoDemo":{"management":{"Search":"Procurar por Tarefa...","HideCompleted":"Esconder Completas","AddTask":"Adicionar tarefa","Delete":"Excluir tarefa","Important":"Marcar como importante","Task":"Tarefa","Description":"Descrição"},"editor":{"NewTask":"Nova Tarefa","Name":"Nome","TaskNameRequired":"Título da tarefa é obrigatório","Description":"Descrição","Important":"Marcar como importante","AddTask":"Adicionar Tarefa"}}};

/***/ }),

/***/ "./src/app/assets/locale/sp.json":
/*!***************************************!*\
  !*** ./src/app/assets/locale/sp.json ***!
  \***************************************/
/*! exports provided: app, Login, Register, ForgotUsername, ForgotPassword, AccountSummary, InvoiceHistory, PayNow, PaymentProfile, ContactUs, PaymentAutoPay, ForgotPasswordConfirmation, ForgotUserNameConfirmation, mainMenu, pageHeader, home, notFound, settings, preferences, users, roles, notifications, todoDemo, default */
/***/ (function(module) {

module.exports = {"app":{"Welcome":"Bienvenido a su Portal de Cliente","Notifications":"Gracias por elegir ScentAir","New":"Nuevo","SessionEnd":"¡Sesión finalizada!"},"Login":{"CustomerLogin":"Inicio de sesión","UserName":"Nombre de usuario","Password":"Contraseña","UserNameRequired":"Se requiere nombre de usuario","PasswordRequired":"Se requiere contraseña","ForgotUserName":"Olvidé mi nombre de usuario","ForgotPassword":"Olvidé mi contraseña","SignIn":"INICIAR SESIÓN","RegisterNow":"REGISTRARSE","QuickandEasyAccess":"Acceso Fácil y Rápido","QuickandEasyAccessDescription":"Con el Portal de Cliente ScentAir no es necesario realizar llamadas para obtener respuestas relacionadas con su cuenta; esto le premite optimizar más su tiempo. Para su comodidad también contamos con la opción para pagos automáticos lo que le permite planificar sus pagos y enfocarse en lo que más importa: ¡ sus clientes !","WhyRegister":"¿Por qué registrarse?","RegisterDescription":"Cuando se registre, podrá  administrar su cuenta desde cualquier lugar :","RegisterBulletPoint1":"Ver y descargar facturas.","RegisterBulletPoint2":"Opción rápida y sencilla para pagos automáticos *","RegisterBulletPoint3":"Realizar pago de facturas *","RegisterBulletPoint4":"Acceder su historial de facturas.","RegisterNote":"*(Disponible para cuentas de EE. UU. Y Canadá)","Quetions":"¿ Tiene alguna pregunta ?","ContactUs":"Por favor contáctenos","Privacy":"Términos de Privacidad","TermsofUse":"Términos de Uso","FAQ":"Preguntas más frecuentes","CopyRight":"ScentAir. Todos los derenchos reservados","Corporate":"Corporativo:  3810 Shutterfly Rd., Charlotte, NC 28217 | +1 (704) 504-2320","SigningIn":"Iniciando sesión...","ContactUsOnFooter":"Contáctenos"},"Register":{"Step1Registration":"Paso 1 Registro","CustomerIDNumber":"Número del Suscriptor","CustomerIDNumberToolTip":"Puede encontrar este número en la esquina superior derecha del contrato original o en cualquier factura","PINNumber":"Número de PIN","PINNumberToolTip":"Consulte el correo electrónico de bienvenida que recibió. ¿No tiene esto? Por favor contáctenos.","LookupAccount":"Buscar cuenta","CANCEL":"CANCELAR","Step2Registration":"Paso 2 Registro","FirstName":"Nombre","LastName":"Apellidos","EmailAddress":"Dirección de correo electrónico","PhoneNumber":"Número de teléfono","UserName":"Nombre de usuario","UserNameToolTip":"Debe contener al menos 7 caracteres","Password":"Contraseña","PasswordToolTip":"Debe contener al menos 8 caracteres, contener una mayúscula y un caracter especial (@, #, %, &, +, !, ?)","ConfirmPassword":"Confirmar Contraseña","SecurityQuestion1":"Pregunta de Seguridad 1","Answer":"Respuesta","SecurityQuestion2":"Pregunta de Seguridad 2","PrivacyandTermsofUse":"Haga clic aquí para indicar que ha leído y acepta nuestros términos de","Privacy":"Privacidad","And":"y","TermsofUse":"Términos de Uso.","PrivacyandTermsofUseRemaining":"","MotherMaidenName":"¿Cuál es el apellido de soltera de tu madre?","BornCity":"¿En qué ciudad naciste?","CarBrand":"¿Qué marca fue tu primer coche?","Friend":"¿Cuál es el nombre del mejor amigo de tu infancia?","VacationSpot":"¿Cuál es tu lugar de vacaciones favorito?","FirstEmployerName":"¿Cuál es el nombre de su primer empleador?","SaveLoginButton":"Guardar e iniciar sesión","CANCELButton":"CANCELAR","Lookingupaccount":"Buscando cuenta ...","err":"errar","UserNameValidation":"El nombre de usuario debe constar de las letras A-Z y / o los números 0-9 solamente","PasswordValidation":"Se requiere contraseña","ConfirmPasswordMatchValidation":"La contraseña no coincide","ConfirmPasswordValidation":"La confrmación no coincide con la contraseña","PINNumberValidation":"PIN inválido","FirstNameValidation":"Se requiere el primer nombre","LastNameValidation":"Se requiere apellido","EmailValidation":"Se requiere E-mail","InvalidAccountNumber":"Número de cuenta inválido","PhoneNumberValidation":"Se requiere número de teléfono","QuetionValidation":"Por favor seleccione una pregunta de seguridad","AnswerValidation":"Por favor seleccione una pregunta de seguridad","CheckBoxValidation":"Marque aquí para indicar que ha leído y está de acuerdo con nuestra","UserNameRequired":"Se requiere nombre de usuario","UserNameCharLength":"El nombre de usuario debe tener al menos 7 caracteres","PasswordCharLength":"La contraseña debe contener al menos 8 caracteres, contener una mayúscula, una minúscula, un número y un caracter especial (@, #, %, &, +, !, ?)","PasswordContains":"La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial","ConfirmPasswordRequired":"Se requiere confirmación de contraseña","Login":"Iniciar sesión","ErrorMessage1":"Esta cuenta ya ha sido previamente registrada. Si usted lo require, puede reestablecer su nombre de usuario o contraseña","ErrorMessage2":"Número de PIN inválido o número de cuenta incorrecto","Here":"aqui.","Header":"confirmación de registro","RegistrationComplete":"Su registro ya está completo.","ToViewDetails":" para ver detalles de la cuenta, hacer pagos y agregar usuarios adicionales."},"ForgotUsername":{"ForgotUsername":"Olvidé mi Nombre de Usuario","HeaderLabel":"Por favor introduzca su número del Suscriptor de cliente ScentAir y su dirección de correo electrónico. Le enviaremos un correo electrónico con su nombre de usuario","CustomerIdNumber":"Número del Suscriptor","AccountPopOver":"Puede encontrar este número en la esquina superior derecha del contrato original o en cualquier factura.","InvalidAccountNumber":"Número de cuenta inválido","EmailAddress":"Dirección de correo electrónico","EmailAddressPopOver":"Ingrese la dirección de correo electrónico que utilizó en el registro inicial.","EmailAddressValidation":"Se requiere E-mail","SendEmailBtn":"ENVIAR CORREO ELECTRÓNICO","CancelBtn":"CANCELAR"},"ForgotPassword":{"ForgotPassword":"Olvidé mi contraseña","HeaderLabel":"Introduzca  su nombre de Usuario y le enviaremos un correo electrónico para restablecer su contraseña:","UserName":"Nombre de Usuario","InvalidUserName":"Nombre de usuario no válido","SendEmailBtn":"ENVIAR CORREO ELECTRÓNICO","CancelBtn":"CANCELAR"},"AccountSummary":{"CustomerIDNumber":"Número del Suscriptor ","ACCOUNTSUMMARY":"RESUMEN DE CUENTA","PAYMENTMETHODS":"MÉTODOS DE PAGO","SETTINGS":"AJUSTES","CONTACTUS":"CONTÁCTENOS","LOGOFF":"DESCONECTARSE","ENROLLINAUTOPAY":"ACTIVAR PAGOS AUTOMÁTICOS ?","AvailableInUSnCANAccounts":" ?  Actualmente disponible para cuentas en EE.UU. Y Canadá","INVOICEHISTORY":"HISTORIAL DE FACTURACIÓN","AccountSummaryDescription":"Bienvenido a su Portal de Cliente ScentAir. Desde aquí puede acceder, ver, descargar e imprimir rápidamente las facturas de su cuenta. Además, podrá pagar sus facturas a través de su método de preferido pago desde cualquier lugar y en cualquier momento.","AvailableInUSnCANNote":"*Opción actualmente disponible para cuentas de EE.UU. y CAN","InvoicePayTitle":"Seleccione las facturas a pagar. Las facturas con términos de pago de 'Vence el 1er.', 'Net 30 CC' y 'NET30AUTOPAY' se cargarán automáticamente contra el método de pago archivado. Permitir ventanas emergentes.","Pay":"Pagar","Invoice#":"Factura #","Status":"Estado de la factura","PaymentTerms":"Condiciones y forma de pago","InvoiceDate":"Fecha de la factura","InvoiceDue":"Fecha de vencimiento","BalanceDue":"Saldo pendiente","TotalBalanceDue":"Saldo total a pagar","TotalPaymentAmount":"Importe total a pagar","PAYNOW":"PAGAR AHORA","PaymentNote":"Pagos recibidos después de las 5:00 EST se reflejarán después de las 10:00 AM EST del día hábil siguiente.","PASTDUE":"Vencida","DUENOW":"Pendiente"},"InvoiceHistory":{"INVOICEHISTORY":"HISTORIAL DE FACTURACIÓN","OPENINVOICES":"FACTURAS PENDIENTES DE PAGO","InvoiceNote":"Vea e imprima sus facturas ya pagadas","Invoice#":"Número de factura","Status":"Estado de la factura","InvoiceDate":"Fecha de la factura","InvoiceAmount":"Importe de la factura","Cancelled":"Cancelado","Open":"Abierto","PartiallyPaid":"Parcialmente pagado","PaidInFull":"Pagada"},"PayNow":{"PayNow":"Pague agora","PaymentInvoices":"Você está fazendo um pagamento nas seguintes faturas.","InvoiceNumber":"Fatura #","DueDate":"Data de Vencimento","InvoiceAmount":"Valor da fatura","PaymentAmount":"Quantidade de pagamento","TotalPaymentAmount":"Pagamento Amountunt total de pagamento:","SelectPaymentMethod":"Selecione o método de pagamento ou","SetupNewProfile":"Configurar novo perfil de pagamento","AutopayMethodCannotDeleted":"Por motivos de segurança, o método de pagamento inscrito no AUTOPAY não pode ser excluído imediatamente e pode levar até 72 horas para que a solicitação de exclusão ocorra.","EDIT":"EDITAR","CANCEL":"CANCELAR","SUBMIT":"ENVIAR","ACCEPT":"ACEITAR","selectedServiceCharge":"Método de pagamento selecionado para cobrar automaticamente sua taxa de serviço de perfume","ElectronicPaymentTermsAndCondition":"Termos e Condições de Pagamento Eletrônico da ScentAir","PaymentCompleteWarning":"Não clique em ENVIAR novamente ou pressione o botão de retorno até que a Transação de Pagamento esteja concluída","Privacy":"Privacidade.","ByCheckingBox":"VERIFICANDO A CAIXA,","AuthorizedAgent":"Agente Autorizado (“Agente”):","Certifies":"(a) certifica","AgentAuthority":"que o Agente (i) está autorizado a assinar e legalmente vincular o Assinante a contratos e a selecionar o Tipo de Pagamento recorrente do Assinante, e (ii) corrigiu quaisquer erros nos campos acima e fornecerá detalhes precisos sobre o Tipo de Pagamento do Assinante nas telas subsequentes fornecido por Chase Paymentech;","Signs":"(b) sinais","EnrollmentAndAuth1":"a seguir “Inscrição e Autorização de Pagamentos Recorrentes” (“","Authorization":"Autorização","EnrollmentAndAuth2":"”) Em nome do Assinante, cuja Autorização está incorporada neste documento;","Certifies2":"(c) certifica","description1":"que o Agente (i) fez uma cópia da Autorização para os registros do Assinante, e (ii) confirma a assinatura do Assinante e entrega a Autorização para aceitação do ScentAir (a seu critério); e ","Consents":"(d) consentimentos","description2":" ao processamento de qualquer saldo pendente na conta do Assinante e entende que o cartão de crédito inscrito será cobrado nesse valor sem qualquer autorização adicional.","description3":"Inscrição e Autorização de Pagamentos Recorrentes (“Autorização”)","GeneralTerms":"Termos gerais:","description4":"O Assinante indicado no “Contrato de Serviço de Perfumaria Ambiental” (“ESS”) entre o Assinante e a ScentAir, autoriza a ScentAir, pelo prazo da ESS, a obter fundos do “Tipo de Pagamento” selecionado acima para fins de pagamento de valores, incluindo tarifas atrasadas e outras taxas, agora ou mais tarde, devidas pelo Assinante, conforme especificado nas faturas da ScentAir (“","InvoiceAmounts":"Quantias de fatura","description5":"”). O Assinante concorda que todas as transações relacionadas ao ESS são e sempre serão principalmente para fins comerciais e que o Assinante é e continuará sendo o proprietário do banco, ou cartão de crédito, conta especificada durante a inscrição (“","EnrollmentScreens":"Telas de Inscrição","description6":"”). O Assinante concorda que esta Autorização permanecerá em vigor até que o assinante a cancele, fornecendo uma notificação através do “Mecanismo de Cancelamento” abaixo, pelo menos quinze (15) dias antes da próxima data de faturamento da fatura. O Assinante concorda que ainda deve o (s) Valor (es) da Fatura na medida em que a ScentAir não pode obter o pagamento através do Tipo de Pagamento do Assinante. ScentAir reserva todos os direitos. Como usado acima, “Mecanismo de Cancelamento” significa aviso para ScentAir tanto (a) em 3810 Shutterfly Road, Suite 900, Charlotte, NC 28217 por carta registrada, ou (b) via e-mail em","description7":", cuja notificação deverá indicar (i) a data da entrega da notificação e o Nº do Cliente do Assinante, (ii) a data efetiva para o cancelamento do método de pagamento recorrente e (iii) a forma de pagamento que o Assinante usará após o cancelamento.","SubscriberAgrees":"Assinante concorda ainda:","ACHAuthorization":"Autorização ACH.","description8":"Se o “Tipo de Pagamento” for “ACH CCD”, o Assinante concorda com os Termos Gerais e com as regras da National Automated Clearinghouse (“NACHA” ou “ACH”) agora ou mais tarde em vigor. Além disso, o Assinante autoriza a ScentAir a debitar os Montantes da Fatura (que podem variar em quantidade) em, ou um pouco antes ou depois, a data de vencimento da fatura da conta bancária indicada nas Telas de Inscrição (conforme atualizado). O Assinante concorda em: (a) notificar atempadamente a ScentAir sobre quaisquer alterações nas informações da conta do Assinante; e (b) reembolsar ScentAir por todas as penalidades e taxas incorridas como resultado de qualquer rejeição da solicitação de fundos da conta da ScentAir por qualquer motivo, incluindo fundos insuficientes ou indisponíveis ou como resultado de a conta não estar configurada adequadamente (como para transações ACH ). O Assinante concorda que, se um Valor da Fatura for devolvido sem pagamento: (a) a ScentAir poderá, a seu critério, tentar processá-lo conforme permitido pelas regras aplicáveis da NACHA e (b) a ScentAir também poderá efetuar um débito ACH por uma taxa de devolução de pelo menos US $ 4,50 ou qualquer quantia maior que a ScentAir esteja direta ou indiretamente obrigada pelas regras da NACHA a suportar em relação aos itens devolvidos.","CreditCardAuth":"Autorização de cartão de crédito.","description9":"Se o “Tipo de pagamento” for “Cartão de crédito”, o Assinante concorda com os Termos gerais. O Assinante também concorda com todos os termos da Autorização ACH, exceto que as regras NACHA não se aplicarão e essas diferenças serão aplicadas: (i) a conta será do cartão de crédito do Assinante em vez de sua conta bancária e se uma cobrança for recusada, ScentAir não reenvie a cobrança ou solicite uma taxa de item devolvido, exceto conforme permitido pelas regras de marca de cartão aplicáveis; e (ii) o Assinante reconhece as políticas de cancelamento e reembolso da ScentAir referentes aos produtos da ScentAir..","description10":"Esta Autorização complementa o ESS fornecendo o método e os termos para pagamento pelo Assinante dos montantes devidos nos termos do ESS.","description11":"O Assinante concorda com os termos contidos na Política de Privacidade da ScentAir https://www.scentair.com/legal/privacy, pois eles podem ser atualizados de tempos em tempos e concorda que se referirá a https://www.scentair.com/legal /privacy.html para todas as informações relacionadas à Política de Privacidade da ScentAir e quaisquer direitos adicionais que o Assinante possa ter relacionado a estes Termos e Condições e a esta Autorização, bem como quaisquer direitos relacionados aos dados do Assinante em geral."},"PaymentProfile":{"PAYMENTPROFILE":"PERFIL DE PAGO","FriendlyName":"Alias para el tipo de pago","PaymentType":"Tipo de Pago","CardType":"Tipo de Tarjeta","Credit":"Tarjeta de crédito","ACHandECP":"ACH/ECP","Visa":"Visa","MC":"Mastercard","Discover":"Discover","Amex":"American Express","JCB":"JCB","DinersClub":"DinersClub","CreditCardNumber":"Número de tarjeta de crédito","ExpirationDate":"Fecha de vencimiento","CVV":"CVV","NameOnAccount":"Nombre del Titular de la Cuenta","Address":"Dirección del Titular de la Cuenta","Address2":"Dirección 2","Address3":"Dirección 3","City":"Ciudad","StateOrProvince":"Estado o Provincia","PostalCode":"Código Postal","Country":"País","SAVE":"GUARDAR","DELETE":"BORRAR","CANCEL":"CANCELAR","EDIT":"Editar","BusinessChecking":"Cuenta de cheques de negocios","PersonalChecking":"Cuenta personal","Savings":"Ahorros","AccountNumber":"Número de cuenta","AccountNumberTooltip":"Número de cuenta (3 - 17 dígitos)","RoutingNumber":"Número de ruta","RoutingNumberTooltip":"Número de ruta (9 dígitos)","BankName":"Nombre del banco","PaymentMethods":"Métodos de pago","PaymentMethodsDesc":"Aquí puedes inscribir métodos de pago adicionales. Aceptamos todas las principales tarjetas de crédito y ACH (cheque electrónico)","USCCANOption":"*Opción actualmente disponible para cuentas de EE. UU. Y CAN","CurrentSavedMethod":"Métodos actuales de pago guardados:","EndingWith":"terminando con","SelectedPaymentValidationMessage":"Método de pago seleccionado para cargar automáticamente su tarifa de servicio de aroma","AddNewPaymentMethod":"AÑADIR NUEVO MÉTODO DE PAGO","MANAGEAUTOPAYSETTINGS":"GESTIONAR AJUSTES DE AUTOPAY","SecurityReasonDesc":"Por razones de seguridad, el método de pago inscrito en AUTOPAY no se puede eliminar inmediatamente y puede llevar hasta 72 horas para que se realice la solicitud de eliminación.","PaymentReceivedTimeDesc":"Los pagos recibidos después de las 5:00 EST se reflejarán después de las 10:00 AM EST del siguiente día hábil.","CuurentAutoPayMethod":"Método de pago actual de AutoPay","InvalidProfilePaymentName":"Nombre de pago de perfil no válido","AutoPayDisabledDesc":"¡El pago automático está deshabilitado debido a las facturas pendientes!","AutoPay":"Pago automático","InvalidCountry":"País inválido","InvalidPostalCode":"Código postal no válido","InvalidState":"Estado Inválido","InvalidCity":"Ciudad inválida","InvalidAddress":"Dirección inválida","InvalidName":"Nombre inválido","InvalidCVV":"CVV inválido","InvalidCreditCardNumber":"Número de tarjeta de crédito no válido","InvalidBankName":"Nombre del banco inválido","InvalidRoutingNumber":"Número de enrutamiento no válido","InvalidAccountNumber":"Número de cuenta inválido","AccountType":"Tipo de cuenta","InvalidPin":"PIN inválido"},"ContactUs":{"ContactUs":"Contáctenos","AMERICAS":"América (Norte, Centro, Sur): +1704-504-2320 Número gratuito desde EE.UU.: +1866-723-6824","France":"Francia: +33 (0) 5 62 57 63 20","Spain":"España: +34 914 321 762","Switzerland":"Suiza: +41 22 501 75 59","Netherlands":"Holanda: +31 (0)10 223 6264","UK":"Reino Unido: +44 (0) 1628 601650","AllCountries":"Otros paises en Europa Continental y EMEA: +33 (0)5 62 57 63 20","APAC":"Asia Pacífico: +(853) 626-25256 or (852) 356-35566"},"PaymentAutoPay":{"ManageAutoPay":"Administrar Pagos Automáticos","AccountOptionDesc":"*Opción actualmente disponible para cuentas de EE.UU. y CAN","AutoPayDesc":"Para su conveniencia, la opción Pagos Automáticos * le permite programar sus pagos de una manera rápida y sencilla. Una vez inscrito, su servicio ScentAir será cargado automáticamente  a su método de pago preferido.","PaymentTermsNote":"Considere que puede llevar  un ciclo de facturación completo para que la opción Pagos Automáticos se haga efectivo. Favor de continuar pagando como de costumbre hasta que compruebe que las Condiciones de Pago aparezcan como ‘Net30AUTOPAY’ en su factura PDF.","AutoPay":"PAGOS AUTOMÁTICOS","AddNewPayment":"AÑADIR NUEVO MÉTODO DE PAGO","UnenrollInAutoPay":"DESACTIVAR PAGOS AUTOMÁTICOS ","Save":"GUARDAR","ChargesNoteDesc":"(Los cargos son generalmente aplicados el primer día hábil del mes).","InvoiceNoteDesc":"Todas las facturas pendientes de pago deben ser liquidadas en su totalidad antes de inscribirse en PAGOS AUTOMÁTICOS","EndingWith":"terminando con","PaymentMethodChargesDesc":"El método de pago se utilizará para cargar automáticamente su Tarifa de Servicio de Olor","AUTOPAY":"AUTOPAY","ScentAirTermsConditionDesc":"Términos y condiciones de pago electrónico de ScentAir","BYCHECKING":"Al revisar la caja,","AuthorizedAgent":"Agente autorizado ('Agente'):","certifies":"(a) certifica","AuthorizedCertifiesDesc1":"ese Agente (i) está autorizado para firmar y vincular legalmente al Suscriptor a los contratos y seleccionar el Tipo de Pago recurrente del Suscriptor, y (ii) ha corregido cualquier error en los campos anteriores y proporcionará detalles precisos sobre el Tipo de Pago del Suscriptor en las siguientes pantallas proporcionado por Chase Paymentech;","AuthorizedCertifiesDesc2":"(b) signos","AuthorizedCertifiesDesc3":"el siguiente 'Inscripción y autorización de pagos periódicos' (“","Authorization":"Autorización","AuthorizedCertifiesDesc4":"”) En nombre del Suscriptor, cuya Autorización se incorpora al presente documento;","AuthorizedCertifiesDesc5":"Al revisar la caja,","AuthorizedCertifiesDesc6":"ese Agente (i) ha hecho una copia de la Autorización para los registros del Suscriptor, y (ii) confirma la firma del Suscriptor y entrega la Autorización para la aceptación de ScentAir (a su discreción); y","AuthorizedCertifiesDesc7":"(d) consentimientos","AuthorizedCertifiesDesc8":"para procesar cualquier saldo pendiente en la cuenta del Suscriptor y entiende que la tarjeta de crédito inscrita se cargará en esa cantidad sin ninguna otra autorización","AuthorizedCertifiesDesc9":"Inscripción y autorización de pagos periódicos ('autorización')","GeneralTerms":"Términos generales:","AuthorizedCertifiesDesc10":"El Suscriptor nombrado en el 'Acuerdo de Servicio de Aroma Ambiental' ('ESS') entre el Suscriptor y ScentAir, por la presente autoriza a ScentAir, por el término de la ESS, a obtener fondos del 'Tipo de Pago' seleccionado anteriormente para los pagos de montos, incluidos cargos por pago atrasado y otros cargos, ahora o más tarde adeudados por el Suscriptor como se especifica en las facturas de ScentAir ('","InvoiceAmounts":"Importes de la factura","AuthorizedCertifiesDesc11":"'). El Suscriptor acepta que todas las transacciones relacionadas con ESS son y siempre serán principalmente para fines comerciales y que el Suscriptor es y seguirá siendo el propietario del banco o tarjeta de crédito, cuenta especificada durante la inscripción (","EnrollmentScreens":"Pantallas de inscripción","AuthorizedCertifiesDesc12":"'). El Suscriptor acepta que esta Autorización permanecerá vigente hasta que el suscriptor la cancele mediante notificación a través del 'Mecanismo de cancelación' que se encuentra a continuación al menos quince (15) días antes de la próxima fecha de facturación. El Suscriptor acepta que seguirá debiendo el (los) Monto (s) de la factura en la medida en que ScentAir no pueda obtener el pago a través del Tipo de pago del Suscriptor. ScentAir se reserva todos los derechos. Tal como se utiliza anteriormente, \"Mecanismo de cancelación\" significa un aviso a ScentAir (a) en 3810 Shutterfly Road, Suite 900, Charlotte, NC 28217 por correo certificado, o (b) por correo electrónico a","CustomerCare":"customercare@scentair.com","AuthorizedCertifiesDesc13":", en cuyo aviso se indicará (i) la fecha de entrega del aviso y el número de ID del cliente del suscriptor, (ii) la fecha efectiva para la cancelación del método de pago recurrente y (iii) el método de pago que utilizará el suscriptor después de la cancelación.","SubscriberFurtherAgrees":"El suscriptor acuerda además:","ACHAuthorization":"Autorización ACH.","ACHAuthorizationDesc1":"Si el Tipo,de pago es ACH, CCD, el Suscriptor acepta los Términos generales y las reglas de la Cámara de compensación automatizada nacional (\"NACHA\" o \"ACH\") vigente ahora o más adelante. Además, el Suscriptor autoriza a ScentAir a cargar las cantidades de la factura (que pueden variar en la cantidad) en, o poco antes o después, la fecha de vencimiento de la factura de la cuenta bancaria indicada en las pantallas de inscripción (según se actualizó). El Suscriptor acepta: (a) notificar oportunamente a ScentAir de cualquier cambio en la información de la cuenta del Suscriptor; y (b) reembolsar a ScentAir todas las multas y tarifas incurridas como resultado de cualquier rechazo de la solicitud de ScentAir de fondos de la cuenta por cualquier motivo, incluidos los fondos insuficientes o no disponibles o como resultado de que la cuenta no se haya configurado correctamente (por ejemplo, para transacciones de ACH). ). El suscriptor acepta que si una cantidad de factura se devuelve sin pagar: (a) ScentAir puede a su discreción intentar procesarla según lo permiten las normas NACHA aplicables, y (b) ScentAir también puede hacer un débito ACH por un cargo por artículo devuelto de al menos $ 4.50 o cualquier cantidad mayor que ScentAir esté directa o indirectamente obligada por las reglas de NACHA a soportar en relación con los artículos devueltos.","CreditCardAuthorization":"Autorización de tarjeta de credito.","PaymentTypeDesc":"Si el Tipo,de pago es Tarjeta,de crédito, el Suscriptor acepta los Términos generales. El Suscriptor también acepta todos los términos de la Autorización de ACH, excepto que las reglas de NACHA no se aplicarán y se aplicarán estas diferencias: (i) la cuenta será la cuenta de tarjeta de crédito del Suscriptor en lugar de su cuenta bancaria y, si se rechaza un cargo, ScentAir no vuelva a enviar el cargo ni busque un cargo por artículo devuelto, excepto lo permitido por las normas de marca de la tarjeta; y (ii) el Suscriptor reconoce las políticas de cancelación y reembolso de ScentAir con respecto a los productos de ScentAir.","PaymentTypeDesc1":"Esta Autorización complementa el ESS al proporcionar el método y los términos para el pago por parte del Suscriptor de las cantidades adeudadas en virtud del ESS.","Privacy":"Intimidad.","PrivacySubscriberDesc":"El suscriptor acepta los términos contenidos en la Política de privacidad de ScentAir https://www.scentair.com/legal/privacy ya que pueden actualizarse periódicamente y acuerdan que se referirá a https://www.scentair.com/legal/privacy.html para toda la información relacionada con la Política de Privacidad de ScentAir y cualquier derecho adicional que el Suscriptor pueda tener relacionado con estos Términos y Condiciones y esta Autorización, así como cualquier derecho relacionado con los datos del Suscriptor en general.","PrintTermsConditions":"Imprimir Términos y Condiciones","ADDNEWPAYMENTMETHOD":"AÑADIR NUEVO MÉTODO DE PAGO","UNENROLLINAUTOPAY":"DESENROLLAR EN AUTOPAY","SAVE":"SALVAR","ACCEPT":"ACEPTAR","SUBMIT":"ENVIAR","CANCEL":"CANCELAR","ChargesDesc":"(Los cargos generalmente se aplican el primer día hábil del mes).","OpenInvoicesDesc":"Todas las facturas abiertas deben pagarse en su totalidad antes de inscribirse en AUTOPAY","AUTOPAYUnenrollmentRequestDesc":"Se solicita la cancelación de la inscripción de AUTOPAY: espere hasta 72 horas para que la inscripción de AUTOPAY se aplique."},"ForgotPasswordConfirmation":{"Header":"Confirmación: Olvidé mi contraseña","EmailSent":"Le hemos enviado un correo electrónico para restablecer su contraseña. Si en breve no recibe el correo electrónico, favor de comunicarse con su representante de atención al cliente:","AMERICAS":"América (Norte, Centro, Sur)","TollFree":"Llamada gratuita","Or":"o","EMEA":"EMEA","UK":"Reino Unido","APAC":"Asia Pacífico","ReturnToLogin":"Volver a iniciar sesión"},"ForgotUserNameConfirmation":{"Header":"Confirmación: Olvidé mi nombre de usuario.","EmailSent":"Le hemos enviado un correo electrónico con su nombre de usuario. Si en breve no recibe el correo electrónico, favor de comunicarse con su representante de atención al cliente:","AMERICAS":"América (Norte, Centro, Sur)","TollFree":"Toll free","Or":"or","EMEA":"EMEA","UK":"Reino Unido","APAC":"Asia Pacífico","ReturnToLogin":"Volver a iniciar sesión"},"mainMenu":{"Appointments":"COMPROMISOS","AccountSummary":"RESUMEN DE LA CUENTA","PaymentMethods":"MÉTODOS DE PAGO","Customers":"Clientes","Products":"Productos","Orders":"Pedidos","About":"Acerca de","Settings":"AJUSTES","CustomerIdNumber":"Número del Suscriptor","ContactUs":"CONTÁCTENOS","EnrollInAutoPay":"INSCRIBIRSE EN AUTOPAY","Logout":"SAIR","EnrollToolTip":"Actualmente disponible para cuentas en EE.UU. Y Canadá"},"pageHeader":{"Dashboard":"Panel de Control","Customers":"Clientes","Products":"Productos","Orders":"Pedidos","NotFound":"No ha sido encontrado","About":"Acerca de","Settings":"Configuraciones"},"home":{"NoWidgets1":"No tienes widgets que se muestran. Ir para","NoWidgets2":"Configurar widgets disponibles","StatisticsTitle":"Alguna cosa importante"},"notFound":{"404":"404","pageNotFound":"La  página no ha sido encontrada","backToHome":"Volver a la página principal"},"settings":{"tab":{"Profile":"Perfil","Preferences":"Preferencias","Users":"Usuarios","Roles":"Funciones"},"header":{"UserProfile":"Perfil de Usuario","UserPreferences":"Preferencias de Usuario","UserDepartments":"Departamentos de Usuarios","UsersManagements":"Gerentes de Usuarios","RolesManagement":"Gestión de roles"}},"preferences":{"ReloadPreferences":"Recargar Preferencias:","ReloadPreferencesHint":"Cargar las preferencias estándares","Language":"Idioma:","English":"Inglés","French":"Francés","Spanish":"Español","Dutch":"Holandés","LanguageHint":"Selecione su idioma","HomePage":"Principal:","Dashboard":"Panel de Control","Customers":"Clientes","Products":"Productos","Orders":"Pedidos","About":"Acerca de","Settings":"Configuraciones","HomePageHint":"Seleccione la página predeterminada para acceder al inicio de sesión","Theme":"Tema:","DefaultColor":"<span class='default-theme-option'>estándar</span>","RedColor":"<span class='red-theme-option'>Vermelho</span>","OrangeColor":"<span class='orange-theme-option'>Laranja</span>","GreenColor":"<span class='green-theme-option'>Verde</span>","GrayColor":"<span class='gray-theme-option'>Cinza</span>","BlackColor":"<span class='black-theme-option'>Preto</span>","ThemeHint":"Selecione o tema padrão","DashboardStatistics":"Estatísticas de Panel de Control:","DashboardStatisticsHint":"Mostrar o widget gráfico demonstrativo no Panel de Control","DashboardNotifications":"Notificaciones de Panel de Control:","DashboardNotificationsHint":"Muestra las notificaciones del panel de control","DashboardTodo":"Tarefas no Painel de Controle:","DashboardTodoHint":"Muestra el widget demonstrativo de tareas del panel de control","DashboardBanner":"Banner en el Panel de control:","DashboardBannerHint":"Mostrar o widget gráfico demonstrativo no Panel de Control","ResetDefault":"Reajustar","SetDefault":"Definir como Default"},"users":{"management":{"Search":"Buscar usuario...","NewUser":"Usuario Nuevo","Edit":"Editar","Delete":"Excluir","EditUser":"Editar usuario \"{{name}}\"","Title":"Título","UserName":"Nombre de Usuario","FullName":"Nombre Completo","Email":"E-mail","Roles":"Funciones","PhoneNumber":"Teléfono"},"editor":{"JobTitle":"Cargo: ","UserName":"Nombre de Usuario:","UserNameRequired":"Nombre de usuario es requerido (mínimo de 2 máximo de 200 caracteres)","Password":"Contraseña:","PasswordHint":"Su contraseña es necesaria para cambiar el nombre de usuario","CurrentPasswordRequired":"Su contraseña actual es requerida","Email":"Email:","EmailRequired":"Email es requerido (máximo de 200 caracteres)","InvalidEmail":"Email incorrecto o no válido","ChangePassword":"Cambiar contraseña","CurrentPassword":"Contraseña actual:","NewPassword":"Nueva Contraseña:","NewPasswordRequired":"La nueva contraseña es requerida (mínimo 6 caracteres)","ConfirmPassword":"Confirme a senha:","ConfirmationPasswordRequired":"Confirmación: Contraseña Requerida","PasswordMismatch":"La contraseña no coincide","Roles":"Perfil:","FullName":" Nombre Completo:","RoleRequired":" Perfil es requerido","PhoneNumber":"Teléfono:","Enabled":"Habilitado","Unblock":"Desbloquear","Close":"Cerrar","Edit":"Editar","Cancel":"Cancelar","Save":"Guardar","Saving":"Guardando cambios...","Question01":"Pregunta 1","Question02":"Pregunta 2","Answer01":"Respuesta 1","Answer02":"Respuesta 2"}},"roles":{"management":{"Search":"rocurar por Função...","NewRole":"Nova Função","Edit":"Editar","Details":"Detalhes","Delete":"Excluir","RoleDetails":"Detalhes da Função \"{{name}}\"","EditRole":"Editar Função \"{{name}}\"","Name":"Nome","Description":"Descrição","Users":"Usuários"},"editor":{"Name":"Nome:","Description":"Descrição:","RoleNameRequired":"Nome da Função é Obrigatório (mínimo de 2 máximo de 200 caracteres)","SelectAll":"Selecionar Todos","SelectNone":"Nenhum","Close":"Fechar","Cancel":"Cancelar","Save":"Salvar","Saving":"Salvando..."}},"notifications":{"Delete":"Excluir Notificação","Pin":"Fixar notificação","Date":"Data","Notification":"Notificação"},"todoDemo":{"management":{"Search":"Procurar por Tarefa...","HideCompleted":"Esconder Completas","AddTask":"Adicionar tarefa","Delete":"Excluir tarefa","Important":"Marcar como importante","Task":"Tarefa","Description":"Descrição"},"editor":{"NewTask":"Nova Tarefa","Name":"Nome","TaskNameRequired":"Título da tarefa é obrigatório","Description":"Descrição","Important":"Marcar como importante","AddTask":"Adicionar Tarefa"}}};

/***/ }),

/***/ "./src/app/assets/locale/zh.json":
/*!***************************************!*\
  !*** ./src/app/assets/locale/zh.json ***!
  \***************************************/
/*! exports provided: app, Login, Register, ForgotUsername, ForgotPassword, AccountSummary, InvoiceHistory, PaymentProfile, ContactUs, PaymentAutoPay, mainMenu, pageHeader, home, notFound, settings, preferences, users, roles, notifications, todoDemo, ForgotPasswordConfirmation, ForgotUserNameConfirmation, PayNow, default */
/***/ (function(module) {

module.exports = {"app":{"Welcome":"欢迎来到您的帐户中心","Notifications":"感谢您选择ScentAir","New":"新","SessionEnd":"会议结束！"},"Login":{"CustomerLogin":"客户登录","UserName":"用户名","Password":"密码","UserNameRequired":"用户名是必需的","PasswordRequired":"密码是必需的","ForgotUserName":"忘了用户名了吗","ForgotPassword":"忘记密码","SignIn":"登入","RegisterNow":"现在注册","QuickandEasyAccess":"快速轻松访问","QuickandEasyAccessDescription":"使用您的ScentAir账户中心，无需拨打您的日常账户问题，从而节省您一整天的宝贵时间。为了方便起见，我们更容易报名参加我们无障碍的自动转账。您可以设置付款时间表，并回到最重要的客户！","WhyRegister":"为何注册？","RegisterDescription":"注册后，您可以随时随地管理您的帐户：","RegisterBulletPoint1":"查看和下载发票","RegisterBulletPoint2":"参加我们无忧无虑的自动转账*","RegisterBulletPoint3":"支付发票*","RegisterBulletPoint4":"访问发票历史记录","RegisterNote":"*（适用于美国和加拿大帐户）","Quetions":"有问题吗？","ContactUs":"联系我们","Privacy":"隐私","TermsofUse":"使用条款","FAQ":"常问问题","CopyRight":"怡人香。版权所有","Corporate":"公司：3810 Shutterfly Rd。，Charlotte，NC 28217 | +1(704)504-2320","SigningIn":"登录中...","ContactUsOnFooter":"联系我们"},"Register":{"Step1Registration":"第1步注册","CustomerIDNumber":"客户ID号","CustomerIDNumberToolTip":"？ - 您可以在原始协议或任何发票的右上角找到此号码","PINNumber":"密码","PINNumberToolTip":"？ - 请参阅您收到的欢迎电子邮件。没有这个？请联系我们。","LookupAccount":"查询帐户","CANCEL":"取消","Step2Registration":"第2步注册","FirstName":"名字","LastName":"姓","EmailAddress":"电子邮件地址","PhoneNumber":"电话号码","UserName":"用户名","UserNameToolTip":"必须至少7个字符","Password":"密码","PasswordToolTip":"长度必须至少为8个字符，包含一个大写字母，一个特殊字符（@，＃，％，＆，+，！，？）","ConfirmPassword":"确认密码","SecurityQuestion1":"安全问题1","Answer":"回答s","SecurityQuestion2":"安全问题2","PrivacyandTermsofUse":"点击此处表示您已阅读并同意我们的","PrivacyandTermsofUseRemaining":"","Privacy":"隐私","And":"和","TermsofUse":"使用条款","MotherMaidenName":"你妈妈的娘家姓什么？","BornCity":"你出生在哪个城市？","CarBrand":"你的第一辆车是什么品牌的？","Friend":"你儿时最好的朋友的名字？","VacationSpot":"最喜欢的度假胜地","FirstEmployerName":"你的第一个雇主的名字？","SaveLoginButton":"保存并登录","CANCELButton":"取消","Lookingupaccount":"查找帐户...","err":"呃","UserNameValidation":"用户名必须仅包含字母A-Z和/或数字0-9","PasswordValidation":"密码是必需的","ConfirmPasswordMatchValidation":"密码与确认不符","ConfirmPasswordValidation":"需要确认密码","PINNumberValidation":"针脚无效","FirstNameValidation":"名字是必需的","LastNameValidation":"姓氏是必需的","EmailValidation":"电子邮件地址是必填项","InvalidAccountNumber":"帐号无效","PhoneNumberValidation":"电话号码是必需的","QuetionValidation":"请选择安全问题","AnswerValidation":"答案是必需的","CheckBoxValidation":"点击此处表示您已阅读并同意我们的","UserNameRequired":"用户名是必需的","UserNameCharLength":"用户名必须至少为7个字符","PasswordCharLength":"密码必须至少8个字符","PasswordContains":"密码必须至少包含一个大写字母，一个小写字母，一个数字和一个特殊字符","ConfirmPasswordRequired":"需要确认密码","Login":"登录","ErrorMessage1":"此帐户已注册。如果需要，您可以重置用户名或密码","ErrorMessage2":"帐号或PIN码无效","Here":"这里","Header":"注册确认","RegistrationComplete":"您的注册现已完成","ToViewDetails":"查看帐户详细信息，进行付款并添加其他用户"},"ForgotUsername":{"ForgotUsername":"忘了用户名了吗","HeaderLabel":"请输入您的ScentAir客户ID号码和电子邮件地址。我们会向您发送一封包含您的用户名的电子邮件","CustomerIdNumber":"客户ID号","AccountPopOver":"您可以在原始协议或任何发票的右上角找到此编号","InvalidAccountNumber":"帐号无效","EmailAddress":"电子邮件地址","EmailAddressPopOver":"输入初始注册期间使用的电子邮件地址","EmailAddressValidation":"电子邮件地址是必填项","SendEmailBtn":"发送电子邮件","CancelBtn":"取消"},"ForgotPassword":{"ForgotPassword":"忘记密码","HeaderLabel":"输入您的用户名，将发送一封电子邮件重置您的密码：","UserName":"用户名","InvalidUserName":"无效的用户名","SendEmailBtn":"发送电子邮件","CancelBtn":"取消"},"AccountSummary":{"CustomerIDNumber":"客户ID号","ACCOUNTSUMMARY":"帐户汇总","PAYMENTMETHODS":"支付方式","SETTINGS":"设置","CONTACTUS":"联系我们","LOGOFF":"注销","ENROLLINAUTOPAY":"在AUTOPAY注册？","AvailableInUSnCANAccounts":"？目前可在美国和CAN帐户中使用","INVOICEHISTORY":"发票历史","AccountSummaryDescription":"欢迎来到您的ScentAir帐户中心。您可以在此处快速访问，查看，下载和打印帐户发票。另外，您可以随时随地通过首选付款方式支付发票。","AvailableInUSnCANNote":"*目前可用于美国和CAN帐户的选项","InvoicePayTitle":"选择要付款的发票。付款条件为“1日到期”，“净30 CC”和“NET30AUTOPAY”的发票将自动按照付款方式收取。允许弹出窗口。","Pay":"工资","Invoice#":"发票＃","Status":"状态","PaymentTerms":"付款条件","InvoiceDate":"发票日期","InvoiceDue":"发票到期","BalanceDue":"余额到期","TotalBalanceDue":"到期总余额：","TotalPaymentAmount":"总付款金额：","PAYNOW":"现在付款","PaymentNote":"美国东部时间5:00后收到的付款将反映在美国东部时间下午10:00之后的工作日。","PASTDUE":"逾期","DUENOW":"现在"},"InvoiceHistory":{"INVOICEHISTORY":"发票历史","OPENINVOICES":"公开发票","InvoiceNote":"查看并打印您的付款发票","Invoice#":"发票＃","Status":"状态","InvoiceDate":"发票日期","InvoiceAmount":"发票金额","Cancelled":"取消","Open":"打开","PartiallyPaid":"部分付费","PaidInFull":"付全款"},"PaymentProfile":{"PAYMENTPROFILE":"付款资料","FriendlyName":"友好名称","PaymentType":"支付方式","CardType":"卡的种类","Credit":"信用","ACHandECP":"ACH/ECP","Visa":"签证","MC":"MC","Discover":"发现","Amex":"美国运通","JCB":"JCB","DinersClub":"大莱卡","CreditCardNumber":"信用卡号","ExpirationDate":"截止日期","CVV":"CVV*","NameOnAccount":"账户名","Address":"地址","Address2":"地址 2","Address3":"地址 3","City":"市","StateOrProvince":"州或省*","PostalCode":"邮政编码","Country":"国家","SAVE":"保存","DELETE":"删除","CANCEL":"取消","EDIT":"编辑","BusinessChecking":"业务检查","PersonalChecking":"个人检查","Savings":"储","AccountNumber":"帐号","AccountNumberTooltip":"帐号（3  -  17位）","Routing Number":"路由号码","Routing NumberTooltip":"路由号码（9位数）","BankName":"银行名","PaymentMethods":"支付方式","PaymentMethodsDesc":"您可以在此处注册其他付款方式。我们接受所有主要信用卡和ACH（电子支票）*","USCCANOption":"*目前可用于美国和CAN帐户的选项","CurrentSavedMethod":"目前保存的付款方式：","EndingWith":"结束于","SelectedPaymentValidationMessage":"选择付款方式自动收取您的气味服务费","AddNewPaymentMethod":"添加新的付款方式","MANAGEAUTOPAYSETTINGS":"管理自动设置","SecurityReasonDesc":"出于安全原因，无法立即删除AUTOPAY注册的付款方式，删除请求最多可能需要72小时。","PaymentReceivedTimeDesc":"美国东部时间5:00后收到的付款将反映在美国东部时间下午10:00之后的工作日。","CuurentAutoPayMethod":"目前的自动付款方式","InvalidProfilePaymentName":"配置文件付款名称无效","AutoPayDisabledDesc":"由于优秀的发票，自动付款被禁用！","AutoPay":"自动付款","InvalidCountry":"国家/地区无效","InvalidPostalCode":"邮政编码无效","InvalidState":"状态无效","InvalidCity":"城市无效","InvalidAddress":"无效地址","InvalidName":"名称无效","InvalidCVV":"CVV无效","InvalidCreditCardNumber":"无效的信用卡号码","InvalidBankName":"银行名称无效","InvalidRoutingNumber":"路由号码无效","InvalidAccountNumber":"帐号无效","AccountType":"帐户类型","InvalidPin":"针脚无效"},"ContactUs":{"ContactUs":"联系我们","AMERICAS":"美国：免费电话：+ 1866-723-6824或+ 1704-504-2320","France":"法国：+33（0）5 62 57 63 20","Spain":"西班牙：+34 914 321 762","Switzerland":"瑞士：+41 22 501 75 59","Netherlands":"荷兰：+31 10 223 62 64","UK":"英国：+44（0）1628 601650","AllCountries":"欧洲大陆和欧洲，中东和非洲的所有其他国家：+33（0）5 62 57 63 20","APAC":"亚太地区：+（853）626-25256或（852）356-35566"},"PaymentAutoPay":{"ManageAutoPay":"管理AutoPay","AccountOptionDesc":"*目前可用于美国和CAN帐户的选项","AutoPayDesc":"为了增加便利性和节省时间，AUTOPAY *允许您为帐户设置自动付款。注册后，我们将通过您的首选付款方式自动收取您的香味服务费。","PaymentTermsNote":"请注意，一旦您注册，您的AutoPay最多可能需要1个完整的结算周期才能启动。请继续照常付款，直到您在付款条款部分的PDF发票上看到“Net30AUTOPAY”","AutoPay":"自动转账","AddNewPayment":"添加新的付款方式","UnenrollInAutoPay":"UNENROLL在AUTOPAY","Save":"保存","ChargesNoteDesc":"（费用通常在当月的第一个工作日应用。）","InvoiceNoteDesc":"所有公开发票必须在注册AUTOPAY之前全额支付","EndingWith":" 结束于","PaymentMethodChargesDesc":"付款方式将用于自动收取您的香味服务费","AUTOPAY":"自动转账","ScentAirTermsConditionDesc":"ScentAir电子支付条款和条件","BYCHECKING":"通过检查箱子，","AuthorizedAgent":"授权代理人（“代理人”）：","certifies":"（a）证明","AuthorizedCertifiesDesc1":"代理（i）被授权签署并合法地将订户绑定到合同并选择订户的定期付款类型，以及（ii）更正了上述字段中的任何错误，并将在后续屏幕中提供有关订户付款类型的准确详细信息。由Chase Paymentech提供;","AuthorizedCertifiesDesc2":"（b）迹象","AuthorizedCertifiesDesc3":"以下“经常性付款的登记及授权”（“","Authorization":"授权","AuthorizedCertifiesDesc4":"“）代表订户，该授权在此合并;","AuthorizedCertifiesDesc5":"通过检查箱子，","AuthorizedCertifiesDesc6":"代理人（i）已制作了订户授权记录的副本，并且（ii）确认了订户的签名并提供了ScentAir接受授权（由其自行决定）;和","AuthorizedCertifiesDesc7":"（d）同意","AuthorizedCertifiesDesc8":" 处理订户帐户中的任何未结余额，并了解注册的信用卡将在未经任何进一步授权的情况下收取该金额。","AuthorizedCertifiesDesc9":"经常性付款的登记和授权（“授权”）","GeneralTerms":"一般条款：","AuthorizedCertifiesDesc10":"订户和ScentAir之间的“环境气味服务协议”（“ESS”）中指定的订户，特此授权ScentAir在ESS期限内从上面选择的“支付类型”中获取资金，用于支付金额，包括延迟收费和其他费用，现在或稍后由ScentAir发票中指定的订户支付（“","InvoiceAmounts":"发票金额","AuthorizedCertifiesDesc11":"“）。订户同意所有与ESS相关的交易过去并且将始终主要用于商业目的，并且订户是并且仍将是注册期间指定的银行或信用卡账户的所有者（“","EnrollmentScreens":"注册屏幕","AuthorizedCertifiesDesc12":"“）。订户同意此授权将在下一个发票开票日期之前至少十五（15）天通过以下“取消机制”提供通知，直到订户取消该授权为止。订户同意，如果ScentAir无法通过订户的付款类型获得付款，它仍将欠发票金额。 ScentAir保留所有权利。如上所述，“取消机制”是指通过认证邮件（a）在3810 Shutterfly Road，Suite 900，Charlotte，NC 28217通知ScentAir，或（b）通过电子邮件发送给ScentAir","CustomerCare":"customercare@scentair.com","AuthorizedCertifiesDesc13":"，该通知应说明（i）通知发送日期和订户的客户ID＃，（ii）取消定期付款方式的生效日期，以及（iii）付款方式订户将使用取消后。","SubscriberFurtherAgrees":"订户进一步同意：","ACHAuthorization":"ACH授权。","ACHAuthorizationDesc1":"如果“付款类型”是“ACH CCD”，则订户同意现在或稍后生效的一般条款和国家自动交换所（“NACHA”或“ACH”）的规则。此外，订购者授权ScentAir从发票截止日期中指定的银行账户（更新后）开始，或在发票到期日之前或之后不久支付发票金额（可能会有所不同）。订户同意：（a）及时通知ScentAir订户帐户信息的任何变更; （b）偿还ScentAir由于任何原因拒绝ScentAir的账户资金申请而产生的所有罚款和费用，包括资金不足或不可用或由于账户配置不当（例如ACH交易） ）。订户同意，如果未支付发票金额：（a）ScentAir可以自行决定在适用的NACHA规则允许的情况下尝试处理它，并且（b）ScentAir也可以为至少4.50美元的退回物品费用进行ACH借记或者任何更大数量的ScentAir由NACHA规则直接或间接承担与退回物品有关的承诺。","CreditCardAuthorization":"信用卡授权。","PaymentTypeDesc":"如果“付款类型”是“信用卡”，则订户同意一般条款。订户也同意ACH授权的所有条款，但NACHA规则不适用且这些差异适用：（i）该帐户将是订户的信用卡帐户而不是其银行帐户，如果收费被拒绝，ScentAir将除非适用的卡品牌规则允许，否则不要重新提交费用或寻求退回的项目费用; （ii）订户承认ScentAir有关ScentAir产品的取消和退款政策。","PaymentTypeDesc1":"本授权通过提供订户根据ESS支付应付金额的方法和条款来补充ESS。","Privacy":"隐私。","PrivacySubscriberDesc":"订阅者同意ScentAir隐私政策https://www.scentair.com/legal/privacy中包含的条款，因为它们可能会不时更新并同意它将参考https://www.scentair.com/legal /privacy.html获取与ScentAir隐私政策相关的所有信息以及订户可能与这些条款和条件以及本授权相关的任何其他权利，以及与订户数据相关的任何权利。","PrintTermsConditions":"打印条款和条件","ADDNEWPAYMENTMETHOD":"添加新的付款方式","UNENROLLINAUTOPAY":"UNENROLL在AUTOPAY","SAVE":"保存","ACCEPT":"接受","SUBMIT":"提交","CANCEL":"取消","ChargesDesc":"（费用通常在当月的第一个工作日应用。）","OpenInvoicesDesc":"所有公开发票必须在注册AUTOPAY之前全额支付","AUTOPAYUnenrollmentRequestDesc":"要求AUTOPAY取消注册 - 请允许最多72小时的时间让AUTOPAY取消注册生效。"},"mainMenu":{"Appointments":"约会","AccountSummary":"帐户汇总","PaymentMethods":"支付方式","Customers":"顾客","Products":"制品","Orders":"命令","About":"关于","Settings":"设置","ContactUs":"联系我们","CustomerIdNumber":"客户ID号","EnrollInAutoPay":"在AUTOPAY中注册","Logout":"注销","EnrollToolTip":"目前可在美国和CAN帐户中使用"},"pageHeader":{"Dashboard":"仪表板","Customers":"顾客","Products":"制品","Orders":"命令","NotFound":"未找到","About":"关于","Settings":"设置"},"home":{"NoWidgets1":"您没有显示小部件。去","NoWidgets2":"配置可用的小部件","StatisticsTitle":"一些重要的东西"},"notFound":{"404":"404","pageNotFound":"您要查找的页面不存在","backToHome":"回到家"},"settings":{"tab":{"Profile":"轮廓","Preferences":"喜好","Users":"用户","Roles":"角色"},"header":{"UserProfile":"轮廓","UserPreferences":"用户首选项","UserDepartments":"用户部门","UsersManagements":"用户管理","RolesManagement":"角色管理"}},"preferences":{"ReloadPreferences":"重新加载首选项：","ReloadPreferencesHint":"加载默认首选项（丢弃本地更改）","Language":"语言:","English":"英语","French":"法国","Spanish":"西班牙语","Dutch":"荷兰人","LanguageHint":"选择您帐户的首选语言","HomePage":"主页:","Dashboard":"仪表板","Customers":"顾客","Products":"制品","Orders":"命令","About":"关于","Settings":"设置","HomePageHint":"选择要在登录时导航到的默认页面","Theme":"主题:","DefaultColor":"<span class='default-theme-option'>默认</span>","RedColor":"<span class='red-theme-option'>红色</span>","OrangeColor":"<span class='orange-theme-option'>橙子</span>","GreenColor":"<span class='green-theme-option'>绿色</span>","GrayColor":"<span class='gray-theme-option'>灰色</span>","BlackColor":"<span class='black-theme-option'>黑色</span>","ThemeHint":"选择帐户的默认颜色主题","DashboardStatistics":"仪表板统计：","DashboardStatisticsHint":"在仪表板上显示演示图窗口小部件","DashboardNotifications":"仪表板通知:","DashboardNotificationsHint":"在仪表板上显示应用程序通知","DashboardTodo":"仪表板待办事项:","DashboardTodoHint":"在仪表板上显示演示todo小部件","DashboardBanner":"仪表板横幅:","DashboardBannerHint":"在仪表板上显示演示信息横幅小部件","ResetDefault":"重置默认值","SetDefault":"设为默认"},"users":{"management":{"Search":"搜索...","NewUser":"新用户","Edit":"编辑","Delete":"删除","EditUser":"编辑用户 \"{{name}}\"","Title":"标题","UserName":"用户名","FullName":"全名","Email":"电子邮件","Roles":"角色","PhoneNumber":"电话号码"},"editor":{"JobTitle":"职称: ","UserName":"用户名:","UserNameRequired":"用户名是必需的（最少2个，最多200个字符）","Password":"密码:","PasswordHint":"更改用户名时需要输入密码","CurrentPasswordRequired":"当前密码是必需的","Email":"电子邮件:","EmailRequired":"需要电子邮件地址（最多200个字符）","InvalidEmail":"指定的电子邮件无效","ChangePassword":"更改密码","CurrentPassword":"当前密码:","NewPassword":"新密码:","NewPasswordRequired":"需要新密码（最少6个字符）","ConfirmPassword":"确认密码：","ConfirmationPasswordRequired":"确认密码是必需的","PasswordMismatch":"新密码和确认密码不匹配","Roles":"角色:","FullName":" 全名:","RoleRequired":" 角色是必需的","PhoneNumber":"电话 #:","Enabled":"启用","Unblock":"解除封锁","Close":"关","Edit":"编辑","Cancel":"取消","Save":"保存","Saving":"保存...","Question01":"题 1","Question02":"题 2","Answer01":"回答 1","Answer02":"回答 2"}},"roles":{"management":{"Search":"搜索...","NewRole":"新角色","Edit":"编辑","Details":"细节","Delete":"删除","RoleDetails":"角色详情 \"{{name}}\"","EditRole":"编辑角色 \"{{name}}\"","Name":"名称","Description":"描述","Users":"用户"},"editor":{"Name":"名称:","Description":"描述:","RoleNameRequired":"角色名称是必需的（最少2个，最多200个字符）","SelectAll":"全选","SelectNone":"选择无","Close":"关","Cancel":"取消","Save":"保存","Saving":"保存..."}},"notifications":{"Delete":"删除通知","Pin":"引脚通知","Date":"日期","Notification":"通知"},"todoDemo":{"management":{"Search":"搜索任务......","HideCompleted":"隐藏已完成","AddTask":"添加任务","Delete":"删除任务","Important":"标记为重要","Task":"任务","Description":"描述"},"editor":{"NewTask":"新任务","Name":"名称","TaskNameRequired":"任务名称是必需的","Description":"描述","Important":"标记为重要","AddTask":"添加任务"}},"ForgotPasswordConfirmation":{"Header":"忘记密码确认","EmailSent":"已发送电子邮件以重置密码。如果您很快没有收到该电子邮件，请联系您的客户服务代表：","AMERICAS":"美洲","TollFree":"免费电话","Or":"要么","EMEA":"EMEA","UK":"联合王国","APAC":"亚太地区","ReturnToLogin":"返回登录"},"ForgotUserNameConfirmation":{"Header":"忘记用户名确认","EmailSent":"已使用您的用户名发送了一封电子邮件。如果您很快没有收到该电子邮件，请联系您的客户服务代表：","AMERICAS":"美洲","TollFree":"免费电话","Or":"要么","EMEA":"EMEA","UK":"联合王国","APAC":"亚太地区","ReturnToLogin":"返回登录"},"PayNow":{"PayNow":"现在付款","PaymentInvoices":"您正在以下发票上付款。","InvoiceNumber":"发票＃","DueDate":"截止日期","InvoiceAmount":"发票金额","PaymentAmount":"支付金额","TotalPaymentAmount":"总付款金额：","SelectPaymentMethod":"选择付款方式或","SetupNewProfile":"设置新的付款资料","AutopayMethodCannotDeleted":"出于安全原因，无法立即删除AUTOPAY注册的付款方式，删除请求最多可能需要72小时。","EDIT":"编辑","CANCEL":"取消","SUBMIT":"提交","ACCEPT":"接受","selectedServiceCharge":"选择付款方式自动收取您的气味服务费","ElectronicPaymentTermsAndCondition":"ScentAir电子支付条款和条件","PaymentCompleteWarning":"在付款交易完成之前，请勿再次单击“提交”或点击“后退”按钮","Privacy":"隐私.","ByCheckingBox":"通过检查箱子","AuthorizedAgent":"授权代理人（“代理人”）：","Certifies":"（a）证明","AgentAuthority":"代理（i）被授权签署并合法地将订户绑定到合同并选择订户的定期付款类型，以及（ii）更正了上述字段中的任何错误，并将在后续屏幕中提供有关订户付款类型的准确详细信息。由Chase Paymentech提供;","Signs":"（b）迹象","EnrollmentAndAuth1":"以下“经常性付款的登记及授权”（“","Authorization":"授权","EnrollmentAndAuth2":"“）代表订户，该授权在此合并;","Certifies2":"（c）证明","description1":"代理人（i）已制作了订户授权记录的副本，并且（ii）确认了订户的签名并提供了ScentAir接受授权（由其自行决定）;和","Consents":"v（d）同意","description2":"处理订户帐户中的任何未结余额，并了解注册的信用卡将在未经任何进一步授权的情况下收取该金额。","description3":"经常性付款的注册和授权（“授权”）","GeneralTerms":"一般条款：","description4":"订户和ScentAir之间的“环境气味服务协议”（“ESS”）中指定的订户，特此授权ScentAir在ESS期限内从上面选择的“支付类型”中获取资金，用于支付金额，包括延迟收费和其他费用，现在或稍后由ScentAir发票中指定的订户支付（“","InvoiceAmounts":"发票金额","description5":"“）。订户同意所有与ESS相关的交易过去并且将始终主要用于商业目的，并且订户是并且仍将是注册期间指定的银行或信用卡账户的所有者（“","EnrollmentScreens":"注册屏幕","description6":"“）。订户同意此授权将在下一个发票开票日期之前至少十五（15）天通过以下“取消机制”提供通知，直到订户取消该授权为止。订户同意，如果ScentAir无法通过订户的付款类型获得付款，它仍将欠发票金额。 ScentAir保留所有权利。如上所述，“取消机制”是指通过认证邮件（a）在3810 Shutterfly Road，Suite 900，Charlotte，NC 28217通知ScentAir，或（b）通过电子邮件发送给ScentAir","description7":"，该通知应说明（i）通知发送日期和订户的客户ID＃，（ii）取消定期付款方式的生效日期，以及（iii）付款方式订户将使用取消后。","SubscriberAgrees":"订户进一步同意：","ACHAuthorization":"ACH授权。","description8":"如果“付款类型”是“ACH CCD”，则订户同意现在或稍后生效的一般条款和国家自动交换所（“NACHA”或“ACH”）的规则。此外，订购者授权ScentAir从发票截止日期中指定的银行账户（更新后）开始，或在发票到期日之前或之后不久支付发票金额（可能会有所不同）。订户同意：（a）及时通知ScentAir订户帐户信息的任何变更; （b）偿还ScentAir由于任何原因拒绝ScentAir的账户资金申请而产生的所有罚款和费用，包括资金不足或不可用或由于账户配置不当（例如ACH交易） ）。订户同意，如果未支付发票金额：（a）ScentAir可以自行决定在适用的NACHA规则允许的情况下尝试处理它，并且（b）ScentAir也可以为至少4.50美元的退回物品费用进行ACH借记或者任何更大数量的ScentAir由NACHA规则直接或间接承担与退回物品有关的承诺。","CreditCardAuth":"信用卡授权。","description9":"如果“付款类型”是“信用卡”，则订户同意一般条款。订户也同意ACH授权的所有条款，但NACHA规则不适用且这些差异适用：（i）该帐户将是订户的信用卡帐户而不是其银行帐户，如果收费被拒绝，ScentAir将除非适用的卡品牌规则允许，否则不要重新提交费用或寻求退回的项目费用; （ii）订户承认ScentAir有关ScentAir产品的取消和退款政策。","description10":"本授权通过提供订户根据ESS支付应付金额的方法和条款来补充ESS。","description11":"订阅者同意ScentAir隐私政策https://www.scentair.com/legal/privacy中包含的条款，因为它们可能会不时更新并同意它将参考https://www.scentair.com/legal /privacy.html获取与ScentAir隐私政策相关的所有信息以及订户可能与这些条款和条件以及本授权相关的任何其他权利，以及与订户数据相关的任何权利","PaymentAlert":"美国东部时间5:00后收到的付款将反映在美国东部时间下午10:00之后的工作日。","CurrentPaymentMethod":"目前的自动付款方式"}};

/***/ }),

/***/ "./src/app/assets/scripts/alertify.js":
/*!********************************************!*\
  !*** ./src/app/assets/scripts/alertify.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * alertify
 * An unobtrusive customizable JavaScript notification system
 *
 * @author Fabien Doiron <fabien.doiron@gmail.com>
 * @copyright Fabien Doiron 2013
 * @license MIT <http://opensource.org/licenses/mit-license.php>
 * @link http://fabien-d.github.com/alertify.js/
 * @module alertify
 * @version 0.3.11
 */
(function (global, undefined) {
	"use strict";

	var document = global.document,
	    Alertify;

	Alertify = function () {

		var _alertify = {},
		    dialogs   = {},
		    isopen    = false,
		    keys      = { ENTER: 13, ESC: 27, SPACE: 32 },
		    queue     = [],
		    $, btnCancel, btnOK, btnReset, btnResetBack, btnFocus, elCallee, elCover, elDialog, elLog, form, input, getTransitionEvent;

		/**
		 * Markup pieces
		 * @type {Object}
		 */
		dialogs = {
			buttons : {
				holder : "<nav class=\"alertify-buttons\">{{buttons}}</nav>",
				submit : "<button type=\"submit\" class=\"alertify-button alertify-button-ok\" id=\"alertify-ok\">{{ok}}</button>",
				ok     : "<button class=\"alertify-button alertify-button-ok\" id=\"alertify-ok\">{{ok}}</button>",
				cancel : "<button class=\"alertify-button alertify-button-cancel\" id=\"alertify-cancel\">{{cancel}}</button>"
			},
			input   : "<div class=\"alertify-text-wrapper\"><input type=\"text\" class=\"alertify-text\" id=\"alertify-text\"></div>",
			message : "<p class=\"alertify-message\">{{message}}</p>",
			log     : "<article class=\"alertify-log{{class}}\">{{message}}</article>"
		};

		/**
		 * Return the proper transitionend event
		 * @return {String}    Transition type string
		 */
		getTransitionEvent = function () {
			var t,
			    type,
			    supported   = false,
			    el          = document.createElement("fakeelement"),
			    transitions = {
				    "WebkitTransition" : "webkitTransitionEnd",
				    "MozTransition"    : "transitionend",
				    "OTransition"      : "otransitionend",
				    "transition"       : "transitionend"
			    };

			for (t in transitions) {
				if (el.style[t] !== undefined) {
					type      = transitions[t];
					supported = true;
					break;
				}
			}

			return {
				type      : type,
				supported : supported
			};
		};

		/**
		 * Shorthand for document.getElementById()
		 *
		 * @param  {String} id    A specific element ID
		 * @return {Object}       HTML element
		 */
		$ = function (id) {
			return document.getElementById(id);
		};

		/**
		 * Alertify private object
		 * @type {Object}
		 */
		_alertify = {

			/**
			 * Labels object
			 * @type {Object}
			 */
			labels : {
				ok     : "OK",
				cancel : "Cancel"
			},

			/**
			 * Delay number
			 * @type {Number}
			 */
			delay : 5000,

			/**
			 * Whether buttons are reversed (default is secondary/primary)
			 * @type {Boolean}
			 */
			buttonReverse : false,

			/**
			 * Which button should be focused by default
			 * @type {String}	"ok" (default), "cancel", or "none"
			 */
			buttonFocus : "ok",

			/**
			 * Set the transition event on load
			 * @type {[type]}
			 */
			transition : undefined,

			/**
			 * Set the proper button click events
			 *
			 * @param {Function} fn    [Optional] Callback function
			 *
			 * @return {undefined}
			 */
			addListeners : function (fn) {
				var hasOK     = (typeof btnOK !== "undefined"),
				    hasCancel = (typeof btnCancel !== "undefined"),
				    hasInput  = (typeof input !== "undefined"),
				    val       = "",
				    self      = this,
				    ok, cancel, common, key, reset;

				// ok event handler
				ok = function (event) {
					if (typeof event.preventDefault !== "undefined") event.preventDefault();
					common(event);
					if (typeof input !== "undefined") val = input.value;
					if (typeof fn === "function") {
						if (typeof input !== "undefined") {
							fn(true, val);
						}
						else fn(true);
					}
					return false;
				};

				// cancel event handler
				cancel = function (event) {
					if (typeof event.preventDefault !== "undefined") event.preventDefault();
					common(event);
					if (typeof fn === "function") fn(false);
					return false;
				};

				// common event handler (keyup, ok and cancel)
				common = function (event) {
					self.hide();
					self.unbind(document.body, "keyup", key);
					self.unbind(btnReset, "focus", reset);
					if (hasOK) self.unbind(btnOK, "click", ok);
					if (hasCancel) self.unbind(btnCancel, "click", cancel);
				};

				// keyup handler
				key = function (event) {
					var keyCode = event.keyCode;
					if ((keyCode === keys.SPACE && !hasInput) || (hasInput && keyCode === keys.ENTER)) ok(event);
					if (keyCode === keys.ESC && hasCancel) cancel(event);
				};

				// reset focus to first item in the dialog
				reset = function (event) {
					if (hasInput) input.focus();
					else if (!hasCancel || self.buttonReverse) btnOK.focus();
					else btnCancel.focus();
				};

				// handle reset focus link
				// this ensures that the keyboard focus does not
				// ever leave the dialog box until an action has
				// been taken
				this.bind(btnReset, "focus", reset);
				this.bind(btnResetBack, "focus", reset);
				// handle OK click
				if (hasOK) this.bind(btnOK, "click", ok);
				// handle Cancel click
				if (hasCancel) this.bind(btnCancel, "click", cancel);
				// listen for keys, Cancel => ESC
				this.bind(document.body, "keyup", key);
				if (!this.transition.supported) {
					this.setFocus();
				}
			},

			/**
			 * Bind events to elements
			 *
			 * @param  {Object}   el       HTML Object
			 * @param  {Event}    event    Event to attach to element
			 * @param  {Function} fn       Callback function
			 *
			 * @return {undefined}
			 */
			bind : function (el, event, fn) {
				if (typeof el.addEventListener === "function") {
					el.addEventListener(event, fn, false);
				} else if (el.attachEvent) {
					el.attachEvent("on" + event, fn);
				}
			},

			/**
			 * Use alertify as the global error handler (using window.onerror)
			 *
			 * @return {boolean} success
			 */
			handleErrors : function () {
				if (typeof global.onerror !== "undefined") {
					var self = this;
					global.onerror = function (msg, url, line) {
						self.error("[" + msg + " on line " + line + " of " + url + "]", 0);
					};
					return true;
				} else {
					return false;
				}
			},

			/**
			 * Append button HTML strings
			 *
			 * @param {String} secondary    The secondary button HTML string
			 * @param {String} primary      The primary button HTML string
			 *
			 * @return {String}             The appended button HTML strings
			 */
			appendButtons : function (secondary, primary) {
				return this.buttonReverse ? primary + secondary : secondary + primary;
			},

			/**
			 * Build the proper message box
			 *
			 * @param  {Object} item    Current object in the queue
			 *
			 * @return {String}         An HTML string of the message box
			 */
			build : function (item) {
				var html    = "",
				    type    = item.type,
				    message = item.message,
				    css     = item.cssClass || "";

				html += "<div class=\"alertify-dialog\">";
				html += "<a id=\"alertify-resetFocusBack\" class=\"alertify-resetFocus\" href=\"#\">Reset Focus</a>";

				if (_alertify.buttonFocus === "none") html += "<a href=\"#\" id=\"alertify-noneFocus\" class=\"alertify-hidden\"></a>";

				// doens't require an actual form
				if (type === "prompt") html += "<div id=\"alertify-form\">";

				html += "<article class=\"alertify-inner\">";
				html += dialogs.message.replace("{{message}}", message);

				if (type === "prompt") html += dialogs.input;

				html += dialogs.buttons.holder;
				html += "</article>";

				if (type === "prompt") html += "</div>";

				html += "<a id=\"alertify-resetFocus\" class=\"alertify-resetFocus\" href=\"#\">Reset Focus</a>";
				html += "</div>";

				switch (type) {
				case "confirm":
					html = html.replace("{{buttons}}", this.appendButtons(dialogs.buttons.cancel, dialogs.buttons.ok));
					html = html.replace("{{ok}}", this.labels.ok).replace("{{cancel}}", this.labels.cancel);
					break;
				case "prompt":
					html = html.replace("{{buttons}}", this.appendButtons(dialogs.buttons.cancel, dialogs.buttons.submit));
					html = html.replace("{{ok}}", this.labels.ok).replace("{{cancel}}", this.labels.cancel);
					break;
				case "alert":
					html = html.replace("{{buttons}}", dialogs.buttons.ok);
					html = html.replace("{{ok}}", this.labels.ok);
					break;
				default:
					break;
				}

				elDialog.className = "alertify alertify-" + type + " " + css;
				elCover.className  = "alertify-cover";
				return html;
			},

			/**
			 * Close the log messages
			 *
			 * @param  {Object} elem    HTML Element of log message to close
			 * @param  {Number} wait    [optional] Time (in ms) to wait before automatically hiding the message, if 0 never hide
			 *
			 * @return {undefined}
			 */
			close : function (elem, wait) {
				// Unary Plus: +"2" === 2
				var timer = (wait && !isNaN(wait)) ? +wait : this.delay,
				    self  = this,
				    hideElement, transitionDone;

				// set click event on log messages
				this.bind(elem, "click", function () {
					hideElement(elem);
				});
				// Hide the dialog box after transition
				// This ensure it doens't block any element from being clicked
				transitionDone = function (event) {
					event.stopPropagation();
					// unbind event so function only gets called once
					self.unbind(this, self.transition.type, transitionDone);
					// remove log message
					elLog.removeChild(this);
					if (!elLog.hasChildNodes()) elLog.className += " alertify-logs-hidden";
				};
				// this sets the hide class to transition out
				// or removes the child if css transitions aren't supported
				hideElement = function (el) {
					// ensure element exists
					if (typeof el !== "undefined" && el.parentNode === elLog) {
						// whether CSS transition exists
						if (self.transition.supported) {
							self.bind(el, self.transition.type, transitionDone);
							el.className += " alertify-log-hide";
						} else {
							elLog.removeChild(el);
							if (!elLog.hasChildNodes()) elLog.className += " alertify-logs-hidden";
						}
					}
				};
				// never close (until click) if wait is set to 0
				if (wait === 0) return;
				// set timeout to auto close the log message
				setTimeout(function () { hideElement(elem); }, timer);
			},

			/**
			 * Create a dialog box
			 *
			 * @param  {String}   message        The message passed from the callee
			 * @param  {String}   type           Type of dialog to create
			 * @param  {Function} fn             [Optional] Callback function
			 * @param  {String}   placeholder    [Optional] Default value for prompt input field
			 * @param  {String}   cssClass       [Optional] Class(es) to append to dialog box
			 *
			 * @return {Object}
			 */
			dialog : function (message, type, fn, placeholder, cssClass) {
				// set the current active element
				// this allows the keyboard focus to be resetted
				// after the dialog box is closed
				elCallee = document.activeElement;
				// check to ensure the alertify dialog element
				// has been successfully created
				var check = function () {
					if ((elLog && elLog.scrollTop !== null) && (elCover && elCover.scrollTop !== null)) return;
					else check();
				};
				// error catching
				if (typeof message !== "string") throw new Error("message must be a string");
				if (typeof type !== "string") throw new Error("type must be a string");
				if (typeof fn !== "undefined" && typeof fn !== "function") throw new Error("fn must be a function");
				// initialize alertify if it hasn't already been done
				this.init();
				check();

				queue.push({ type: type, message: message, callback: fn, placeholder: placeholder, cssClass: cssClass });
				if (!isopen) this.setup();

				return this;
			},

			/**
			 * Extend the log method to create custom methods
			 *
			 * @param  {String} type    Custom method name
			 *
			 * @return {Function}
			 */
			extend : function (type) {
				if (typeof type !== "string") throw new Error("extend method must have exactly one paramter");
				return function (message, wait) {
					this.log(message, type, wait);
					return this;
				};
			},

			/**
			 * Hide the dialog and rest to defaults
			 *
			 * @return {undefined}
			 */
			hide : function () {
				var transitionDone,
				    self = this;
				// remove reference from queue
				queue.splice(0,1);
				// if items remaining in the queue
				if (queue.length > 0) this.setup(true);
				else {
					isopen = false;
					// Hide the dialog box after transition
					// This ensure it doens't block any element from being clicked
					transitionDone = function (event) {
						event.stopPropagation();
						// unbind event so function only gets called once
						self.unbind(elDialog, self.transition.type, transitionDone);
					};
					// whether CSS transition exists
					if (this.transition.supported) {
						this.bind(elDialog, this.transition.type, transitionDone);
						elDialog.className = "alertify alertify-hide alertify-hidden";
					} else {
						elDialog.className = "alertify alertify-hide alertify-hidden alertify-isHidden";
					}
					elCover.className  = "alertify-cover alertify-cover-hidden";
					// set focus to the last element or body
					// after the dialog is closed
					elCallee.focus();
				}
			},

			/**
			 * Initialize Alertify
			 * Create the 2 main elements
			 *
			 * @return {undefined}
			 */
			init : function () {
				// ensure legacy browsers support html5 tags
				document.createElement("nav");
				document.createElement("article");
				document.createElement("section");
				// cover
				if ($("alertify-cover") == null) {
					elCover = document.createElement("div");
					elCover.setAttribute("id", "alertify-cover");
					elCover.className = "alertify-cover alertify-cover-hidden";
					document.body.appendChild(elCover);
				}
				// main element
				if ($("alertify") == null) {
					isopen = false;
					queue = [];
					elDialog = document.createElement("section");
					elDialog.setAttribute("id", "alertify");
					elDialog.className = "alertify alertify-hidden";
					document.body.appendChild(elDialog);
				}
				// log element
				if ($("alertify-logs") == null) {
					elLog = document.createElement("section");
					elLog.setAttribute("id", "alertify-logs");
					elLog.className = "alertify-logs alertify-logs-hidden";
					document.body.appendChild(elLog);
				}
				// set tabindex attribute on body element
				// this allows script to give it focus
				// after the dialog is closed
				document.body.setAttribute("tabindex", "0");
				// set transition type
				this.transition = getTransitionEvent();
			},

			/**
			 * Show a new log message box
			 *
			 * @param  {String} message    The message passed from the callee
			 * @param  {String} type       [Optional] Optional type of log message
			 * @param  {Number} wait       [Optional] Time (in ms) to wait before auto-hiding the log
			 *
			 * @return {Object}
			 */
			log : function (message, type, wait) {
				// check to ensure the alertify dialog element
				// has been successfully created
				var check = function () {
					if (elLog && elLog.scrollTop !== null) return;
					else check();
				};
				// initialize alertify if it hasn't already been done
				this.init();
				check();

				elLog.className = "alertify-logs";
				this.notify(message, type, wait);
				return this;
			},

			/**
			 * Add new log message
			 * If a type is passed, a class name "alertify-log-{type}" will get added.
			 * This allows for custom look and feel for various types of notifications.
			 *
			 * @param  {String} message    The message passed from the callee
			 * @param  {String} type       [Optional] Type of log message
			 * @param  {Number} wait       [Optional] Time (in ms) to wait before auto-hiding
			 *
			 * @return {undefined}
			 */
			notify : function (message, type, wait) {
				var log = document.createElement("article");
				log.className = "alertify-log" + ((typeof type === "string" && type !== "") ? " alertify-log-" + type : "");
				log.innerHTML = message;
				// append child
				elLog.appendChild(log);
				// triggers the CSS animation
				setTimeout(function() { log.className = log.className + " alertify-log-show"; }, 50);
				this.close(log, wait);
			},

			/**
			 * Set properties
			 *
			 * @param {Object} args     Passing parameters
			 *
			 * @return {undefined}
			 */
			set : function (args) {
				var k;
				// error catching
				if (typeof args !== "object" && args instanceof Array) throw new Error("args must be an object");
				// set parameters
				for (k in args) {
					if (args.hasOwnProperty(k)) {
						this[k] = args[k];
					}
				}
			},

			/**
			 * Common place to set focus to proper element
			 *
			 * @return {undefined}
			 */
			setFocus : function () {
				if (input) {
					input.focus();
					input.select();
				}
				else btnFocus.focus();
			},

			/**
			 * Initiate all the required pieces for the dialog box
			 *
			 * @return {undefined}
			 */
			setup : function (fromQueue) {
				var item = queue[0],
				    self = this,
				    transitionDone;

				// dialog is open
				isopen = true;
				// Set button focus after transition
				transitionDone = function (event) {
					event.stopPropagation();
					self.setFocus();
					// unbind event so function only gets called once
					self.unbind(elDialog, self.transition.type, transitionDone);
				};
				// whether CSS transition exists
				if (this.transition.supported && !fromQueue) {
					this.bind(elDialog, this.transition.type, transitionDone);
				}
				// build the proper dialog HTML
				elDialog.innerHTML = this.build(item);
				// assign all the common elements
				btnReset  = $("alertify-resetFocus");
				btnResetBack  = $("alertify-resetFocusBack");
				btnOK     = $("alertify-ok")     || undefined;
				btnCancel = $("alertify-cancel") || undefined;
				btnFocus  = (_alertify.buttonFocus === "cancel") ? btnCancel : ((_alertify.buttonFocus === "none") ? $("alertify-noneFocus") : btnOK),
				input     = $("alertify-text")   || undefined;
				form      = $("alertify-form")   || undefined;
				// add placeholder value to the input field
				if (typeof item.placeholder === "string" && item.placeholder !== "") input.value = item.placeholder;
				if (fromQueue) this.setFocus();
				this.addListeners(item.callback);
			},

			/**
			 * Unbind events to elements
			 *
			 * @param  {Object}   el       HTML Object
			 * @param  {Event}    event    Event to detach to element
			 * @param  {Function} fn       Callback function
			 *
			 * @return {undefined}
			 */
			unbind : function (el, event, fn) {
				if (typeof el.removeEventListener === "function") {
					el.removeEventListener(event, fn, false);
				} else if (el.detachEvent) {
					el.detachEvent("on" + event, fn);
				}
			}
		};

		return {
			alert   : function (message, fn, cssClass) { _alertify.dialog(message, "alert", fn, "", cssClass); return this; },
			confirm : function (message, fn, cssClass) { _alertify.dialog(message, "confirm", fn, "", cssClass); return this; },
			extend  : _alertify.extend,
			init    : _alertify.init,
			log     : function (message, type, wait) { _alertify.log(message, type, wait); return this; },
			prompt  : function (message, fn, placeholder, cssClass) { _alertify.dialog(message, "prompt", fn, placeholder, cssClass); return this; },
			success : function (message, wait) { _alertify.log(message, "success", wait); return this; },
			error   : function (message, wait) { _alertify.log(message, "error", wait); return this; },
			set     : function (args) { _alertify.set(args); },
			labels  : _alertify.labels,
			debug   : _alertify.handleErrors
		};
	};

	// AMD and window support
	if (true) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () { return new Alertify(); }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}

}(window));


/***/ }),

/***/ "./src/app/components/app.component.css":
/*!**********************************************!*\
  !*** ./src/app/components/app.component.css ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n#mainContent.app-component {\r\n    padding-top: 150px;\r\n    padding-bottom: 50px;\r\n}\r\n\r\n\r\n.navbar-inner.app-component {\r\n  padding-left: 0px;\r\n  border-radius: 0px;\r\n  box-shadow: none;\r\n  background-color: #56B2CB;\r\n  background-image: none;\r\n  min-height: 150px;\r\n  height: auto;\r\n}\r\n\r\n\r\n.navbar.app-component .nav > .active > a,\r\n.navbar.app-component .nav > .active > a:hover,\r\n.navbar.app-component .nav > .active > a:focus {\r\n  border-bottom: 2px white solid;\r\n  box-shadow: none;\r\n  color: lightgray;\r\n}\r\n\r\n\r\n.navbar.app-component .nav > li {\r\n  cursor: pointer;\r\n  color: lightgray !important;\r\n  background-color: transparent !important;\r\n}\r\n\r\n\r\n.navbar.app-component .nav > li:hover {\r\n    color: lightgray !important;\r\n    background-color: transparent !important;\r\n  }\r\n\r\n\r\n.navbar-fixed-top.app-component .navbar-inner.app-component,\r\n.navbar-static-top.app-component .navbar-inner.app-component {\r\n  box-shadow: 0 1px 00px rgba(0, 0, 0, 0);\r\n}\r\n\r\n\r\np.navbar-text.app-component {\r\n  color: #fff;\r\n}\r\n\r\n\r\np.navbar-text.app-component a {\r\n    color: #fff;\r\n  }\r\n\r\n\r\n.vcenter_text.app-component {\r\n    line-height: 40px;\r\n    vertical-align: middle;\r\n}\r\n\r\n\r\n.prebootShow.app-component {\r\n    opacity: 1 !important;\r\n}\r\n\r\n\r\n.prebootStep.app-component {\r\n    opacity: 0;\r\n    transition: .5s ease-in-out all;\r\n}\r\n"

/***/ }),

/***/ "./src/app/components/app.component.html":
/*!***********************************************!*\
  !*** ./src/app/components/app.component.html ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"app_container\" class=\"{{configurations.theme | lowercase}}-theme\">\r\n  <ngx-toasta></ngx-toasta>\r\n  <style>\r\n    /**\r\n    select.form-control {\r\n      -moz-appearance: none;\r\n      -webkit-appearance: none;\r\n      appearance: none;\r\n    }\r\n      **/\r\n    select.form-control.input-sm {\r\n      height: 22px;\r\n      line-height: inherit;\r\n      text-align: center;\r\n    }\r\n\r\n    .bootstrap-select > .dropdown-toggle {\r\n      padding: 2px 12px;\r\n    }\r\n  </style>\r\n  <div class=\"container\">\r\n    <nav id=\"header\" class=\"app-component navbar navbar-inner navbar-fixed-top\">\r\n      <nav class=\"container\">\r\n\r\n        <div class=\"row\" style=\"max-width:100px;float:right;margin-top:4px;\">\r\n          <div class=\"row\">\r\n            <div class=\"row\">\r\n              <div class=\"col-xs-2 text-right\" style=\"padding:0px;margin-top:1px;\">\r\n                <img [src]=\"globeImage\" class=\"img-responsive\" alt=\"Globe ICON\" />\r\n              </div>\r\n              <div class=\"col-xs-10\" style=\"padding-left:5px;\">\r\n\r\n                <select id=\"language\" [(ngModel)]=\"configurations.language\" (change)=\"languageChange()\" #languageSelector=\"bootstrap-select\" bootstrapSelect class=\"selectpicker form-control input-sm\">\r\n\r\n                  <!--<option data-subtext=\"(Default)\" value=\"en\">{{'preferences.English' | translate}}</option>\r\n  <option value=\"fr\">{{'preferences.French' | translate}}</option>\r\n  <option value=\"es\">{{'preferences.Spanish' | translate}}</option>\r\n  <option value=\"de\">{{'preferences.Dutch' | translate}}</option>-->\r\n                  <option data-subtext=\"(Default)\" value=\"en\">English</option>\r\n                  <option value=\"fr\">French</option>\r\n                  <option value=\"es\">Spanish</option>\r\n                  <option value=\"de\">Dutch</option>\r\n                  <option value=\"zh\">Chinese</option>\r\n                </select>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n\r\n        <div class=\"row\" style=\"margin-top: 50px;\">\r\n          <div class=\"col-xs-6\">\r\n            <div class=\"navbar-header\">\r\n              <button type=\"button\" class=\"app-component navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\".menuItemsContainer.app-component\" aria-expanded=\"false\">\r\n                <span class=\"sr-only\">Toggle navigation</span>\r\n                <span class=\"icon-bar\">a</span>\r\n                <span class=\"icon-bar\">b</span>\r\n                <span class=\"icon-bar\">c</span>\r\n              </button>\r\n              <a ngPreserveWhitespaces class=\"app-component navbar-brand\" routerLink=\"/\">\r\n                <img [src]=\"appLogo\" alt=\"logo\">\r\n              </a>\r\n            </div>\r\n          </div>\r\n\r\n\r\n          <div *ngIf=\"!isUserLoggedIn\" class=\"col-xs-6 text-right\">\r\n            <div style=\"margin-top: 15px;\">\r\n              <div style=\"font-size: x-large; color: white; margin-top: 30px; font-weight: 500;\">\r\n                <span>\r\n                  {{'app.Welcome' | translate}}\r\n                </span>\r\n              </div>\r\n              <div style=\"font-size: large; color: white; font-weight: 300;\">\r\n                <span>\r\n                  {{'app.Notifications' | translate}}\r\n                </span>\r\n              </div>\r\n            </div>\r\n          </div>\r\n          <div *ngIf=\"isUserLoggedIn\" class=\"col-xs-6 text-right\">\r\n            <div class=\"row\">\r\n              <div class=\"row\">\r\n                <div style=\"font-size: x-large; color: white; margin-top: 5px; font-weight: 500;\">\r\n                  <div>\r\n                    {{this.pageAccount?.name}}\r\n                  </div>\r\n                </div>\r\n                <div style=\"font-size: small; color: white; font-weight: 500; \">\r\n                  <div>\r\n                    {{ 'mainMenu.CustomerIdNumber' | translate }}: {{this.pageAccount?.number}}\r\n                    <br />\r\n                    {{this.pageAccount?.address?.line1}}\r\n                    <br />\r\n                    {{this.pageAccount?.address?.municipality}}, {{this.pageAccount?.address?.stateOrProvince}} {{this.pageAccount?.address?.postalCode}}\r\n                  </div>\r\n                </div>\r\n                <div style=\"font-size: large; color: white; font-weight: 300;\">\r\n                  <span>\r\n\r\n                  </span>\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n\r\n\r\n        <div *ngIf=\"isUserLoggedIn\" style=\"background-color: #337ab7; top: 150px; right: 0px; position: fixed; width: 100%;\">\r\n          <div class=\"container\">\r\n            <div class=\"row\">\r\n              <div class=\"app-component collapse navbar-collapse menuItemsContainer\">\r\n                <ul class=\"app-component nav navbar-nav\">\r\n                  <li routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{ exact: true }\"><a class=\"sa-menu-link\" routerLink=\"/secure\" title=\"{{ 'mainMenu.AccountSummary' | translate }}\">{{ 'mainMenu.AccountSummary' | translate }}</a></li>\r\n                  <li routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{ exact: true }\"><a class=\"sa-menu-link\" routerLink=\"/secure/payment/profile\" title=\"{{ 'mainMenu.PaymentMethods' | translate }}\">{{ 'mainMenu.PaymentMethods' | translate }}</a></li>\r\n                  <li routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{ exact: true }\"><a class=\"sa-menu-link\" routerLink=\"/secure/settings\" title=\"{{ 'mainMenu.Settings' | translate }}\">{{ 'mainMenu.Settings' | translate }}</a></li>\r\n                  <li routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{ exact: true }\"><a class=\"sa-menu-link\" routerLink=\"/secure/contactUs\" title=\"{{ 'mainMenu.ContactUs' | translate }}\">{{ 'mainMenu.ContactUs' | translate }}</a></li>\r\n\r\n                  <li (click)=\"logout()\"><a class=\"sa-menu-link\" href=\"javascript:;\" title=\"{{'mainMenu.Logout' | translate}}\">{{'mainMenu.Logout' | translate}}</a></li>\r\n                </ul>\r\n\r\n                <div class=\"app-component navbar-text navbar-right sa-popup\" (mouseenter)=\"togglePopover($event)\" (mouseleave)=\"togglePopover($event)\">\r\n                  <div class=\"sa-enroll-auto-pay-button\" routerLink=\"/secure/payment/autopay\">\r\n                    {{ 'mainMenu.EnrollInAutoPay' | translate }}\r\n                    <span class=\"fa fa-question-circle sa-enroll-auto-pay-button-info-icon\"></span>\r\n                    <span class=\"sa-popuptext\" [class.sa-show]=\"isAutoEnrollPopoverVisible\" id=\"autpPayPopover\" style=\"margin-right: 20px;\">{{'mainMenu.EnrollToolTip' | translate}}</span>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </nav>\r\n    </nav>\r\n\r\n    <div id=\"pre-bootstrap\" *ngIf=\"!removePrebootScreen\" [class.prebootShow.app-component]=\"!isAppLoaded\" class=\"app-component prebootStep\">\r\n      <div class=\"messaging\">\r\n        <h1>\r\n          Loaded!\r\n        </h1>\r\n        <p>\r\n          <span class=\"appName\" style=\"font-style:italic\">Portal</span>\r\n        </p>\r\n\r\n      </div>\r\n    </div>\r\n\r\n    <div id=\"mainContent\" class=\"app-component sa-box-shadow\">\r\n      <router-outlet></router-outlet>\r\n    </div>\r\n\r\n    <div id=\"footer\" class=\" text-center\">\r\n      <div class=\"app-component\">\r\n        <div class=\"sa-footer\">\r\n          <footer>\r\n            <div style=\"color: darkgrey; font-weight: bold; font-size: 14px;padding-bottom: 8px;\">\r\n              <span>&copy; {{getYear()}} {{ 'Login.CopyRight' | translate }}</span><span style=\"margin-left: 8px; margin-right: 8px;\">|</span>\r\n              <span><a href=\"https://www.scentair.com/legal/privacy.html\" target=\"_blank\">{{ 'Login.Privacy' | translate }}</a></span><span style=\"margin-left: 8px; margin-right: 8px;\">|</span>\r\n              <span><a href=\"https://www.scentair.com/legal/termsofuse.html\" target=\"_blank\">{{ 'Login.TermsofUse' | translate }}</a></span><span style=\"margin-left: 8px; margin-right: 8px;\">|</span>\r\n\r\n\r\n              <span *ngIf=\"!isUserLoggedIn\"><a routerLink=\"/contactus\">{{ 'Login.ContactUsOnFooter' | translate }}</a><span style=\"margin-left: 8px; margin-right: 8px;\">|</span></span>\r\n              <span *ngIf=\"isUserLoggedIn\"><a routerLink=\"/secure/contactus\">{{ 'Login.ContactUsOnFooter' | translate }}</a><span style=\"margin-left: 8px; margin-right: 8px;\">|</span></span>\r\n              <span><a href=\"https://www.scentair.com/customercenter/AccountCenterFAQ.html\" target=\"_blank\">{{ 'Login.FAQ' | translate }}</a></span>\r\n            </div>\r\n            <div style=\"color: darkgrey; font-weight: bold; font-size: 12px;\">\r\n              <span>{{ 'Login.Corporate' | translate }}</span>\r\n            </div>\r\n          </footer>\r\n        </div>\r\n      </div>\r\n      <br />\r\n      <br />\r\n    </div>\r\n  </div>\r\n\r\n  <div *ngIf=\"shouldShowLoginModal\" class=\"modal fade\" bsModal #loginModal=\"bs-modal\" (onShown)=\"onLoginModalShown()\" (onHidden)=\"onLoginModalHidden()\" (onHide)=\"onLoginModalHide()\"\r\n       [config]=\"{backdrop: 'static'}\" tabindex=\"-1\">\r\n    <div class=\"modal-dialog modal-lg\">\r\n      <app-login #loginControl isModal=\"true\"></app-login>\r\n    </div>\r\n  </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/components/app.component.ts":
/*!*********************************************!*\
  !*** ./src/app/components/app.component.ts ***!
  \*********************************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var ngx_toasta__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ngx-toasta */ "./node_modules/ngx-toasta/fesm5/ngx-toasta.js");
/* harmony import */ var _services_alert_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/alert.service */ "./src/app/services/alert.service.ts");
/* harmony import */ var _services_notification_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/notification.service */ "./src/app/services/notification.service.ts");
/* harmony import */ var _services_app_translation_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../services/app-translation.service */ "./src/app/services/app-translation.service.ts");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var _services_local_store_manager_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../services/local-store-manager.service */ "./src/app/services/local-store-manager.service.ts");
/* harmony import */ var _services_app_title_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../services/app-title.service */ "./src/app/services/app-title.service.ts");
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../services/auth.service */ "./src/app/services/auth.service.ts");
/* harmony import */ var _services_configuration_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../services/configuration.service */ "./src/app/services/configuration.service.ts");
/* harmony import */ var _models_permission_model__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../models/permission.model */ "./src/app/models/permission.model.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _services_language_observable_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../services/language-observable.service */ "./src/app/services/language-observable.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};














var alertify = __webpack_require__(/*! ../assets/scripts/alertify.js */ "./src/app/assets/scripts/alertify.js");
var AppComponent = /** @class */ (function () {
    function AppComponent(storageManager, toastaService, toastaConfig, accountService, alertService, notificationService, appTitleService, authService, translationService, configurations, userInfoService, router) {
        this.toastaService = toastaService;
        this.toastaConfig = toastaConfig;
        this.accountService = accountService;
        this.alertService = alertService;
        this.notificationService = notificationService;
        this.appTitleService = appTitleService;
        this.authService = authService;
        this.translationService = translationService;
        this.configurations = configurations;
        this.userInfoService = userInfoService;
        this.router = router;
        this.newNotificationCount = 0;
        this.appTitle = "Portal";
        this.appLogo = '../assets/images/sa-logo.png';
        this.globeImage = '../assets/images/Globe Icon.png';
        this.stickyToasties = [];
        this.dataLoadingConsecutiveFailurs = 0;
        storageManager.initialiseStorageSyncListener();
        translationService.addLanguages(["en", "fr", "sp", "de", "es", "zh"]);
        translationService.setDefaultLanguage('en');
        this.toastaConfig.theme = 'bootstrap';
        this.toastaConfig.position = 'top-right';
        this.toastaConfig.limit = 100;
        this.toastaConfig.showClose = true;
        this.appTitleService.appName = this.appTitle;
        this.CurrentAccount = new rxjs__WEBPACK_IMPORTED_MODULE_12__["Subject"]();
        this.pageAccount = null;
    }
    Object.defineProperty(AppComponent.prototype, "notificationsTitle", {
        get: function () {
            var _this = this;
            var gT = function (key) { return _this.translationService.getTranslation(key); };
            if (this.newNotificationCount)
                return gT("app.Notifications") + " (" + this.newNotificationCount + " " + gT("app.New") + ")";
            else
                return gT("app.Notifications");
        },
        enumerable: true,
        configurable: true
    });
    AppComponent.prototype.ngAfterViewInit = function () {
    };
    AppComponent.prototype.onLoginModalShown = function () {
        this.alertService.showStickyMessage("Session Expired", "Your Session has expired. Please log in again", _services_alert_service__WEBPACK_IMPORTED_MODULE_3__["MessageSeverity"].info);
    };
    AppComponent.prototype.onLoginModalHidden = function () {
        this.alertService.resetStickyMessage();
        this.loginControl.reset();
        this.shouldShowLoginModal = false;
        if (this.authService.isSessionExpired)
            this.alertService.showStickyMessage("Session Expired", "Your Session has expired. Please log in again to renew your session", _services_alert_service__WEBPACK_IMPORTED_MODULE_3__["MessageSeverity"].warn);
    };
    AppComponent.prototype.onLoginModalHide = function () {
        this.alertService.resetStickyMessage();
    };
    AppComponent.prototype.languageChange = function () {
        this.userInfoService.setDefaultLanguage(this.configurations.language);
    };
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.isUserLoggedIn = this.authService.isLoggedIn;
        if (!this.isUserLoggedIn)
            this.configurations.import(null);
        this.userInfoService.setDefaultLanguage("en");
        // 1 sec to ensure all the effort to get the css animation working is appreciated :|, Preboot screen is removed .5 sec later
        setTimeout(function () { return _this.isAppLoaded = true; }, 1000);
        setTimeout(function () { return _this.removePrebootScreen = true; }, 1500);
        setTimeout(function () {
            if (_this.isUserLoggedIn) {
                _this.alertService.resetStickyMessage();
            }
        }, 2000);
        this.alertService.getDialogEvent().subscribe(function (alert) { return _this.showDialog(alert); });
        this.alertService.getMessageEvent().subscribe(function (message) { return _this.showToast(message, false); });
        this.alertService.getStickyMessageEvent().subscribe(function (message) { return _this.showToast(message, true); });
        this.authService.reLoginDelegate = function () { return _this.shouldShowLoginModal = true; };
        this.authService.getLoginStatusEvent().subscribe(function (isLoggedIn) {
            _this.isUserLoggedIn = isLoggedIn;
            setTimeout(function () {
                if (_this.isUserLoggedIn) {
                    _this.initNotificationsLoading();
                }
                else {
                    var message = "";
                    _this.translationService.getTranslationAsync("app.SessionEnd").subscribe(function (s) { return message = s; });
                    _this.alertService.showMessage(message, "", _services_alert_service__WEBPACK_IMPORTED_MODULE_3__["MessageSeverity"].default);
                    _this.unsubscribeNotifications();
                }
            }, 500);
        });
        this.router.events.subscribe(function (event) {
            if (event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_1__["NavigationStart"]) {
                var url = event.url;
                if (url !== url.toLowerCase()) {
                    _this.router.navigateByUrl(event.url.toLowerCase());
                }
            }
        });
    };
    AppComponent.prototype.ngOnDestroy = function () {
        this.unsubscribeNotifications();
    };
    AppComponent.prototype.unsubscribeNotifications = function () {
        if (this.notificationsLoadingSubscription)
            this.notificationsLoadingSubscription.unsubscribe();
        if (this.accountSubcription)
            this.accountSubcription.unsubscribe();
    };
    AppComponent.prototype.initNotificationsLoading = function () {
        var _this = this;
        this.notificationsLoadingSubscription = this.notificationService.getNewNotificationsPeriodically()
            .subscribe(function (notifications) {
            _this.dataLoadingConsecutiveFailurs = 0;
            _this.newNotificationCount = notifications.filter(function (n) { return !n.isRead; }).length;
        }, function (error) {
            _this.alertService.logError(error);
            if (_this.dataLoadingConsecutiveFailurs++ < 20)
                setTimeout(function () { return _this.initNotificationsLoading(); }, 5000);
            else
                _this.alertService.showStickyMessage("Load Error", "Loading new notifications from the server failed!", _services_alert_service__WEBPACK_IMPORTED_MODULE_3__["MessageSeverity"].error);
        });
        this.accountSubcription = this.accountService.getAccount().subscribe(function (account) {
            if (account) {
                _this.pageAccount = account;
            }
        });
        this.accountSubcription = this.accountService.getAccount().subscribe(function (account) {
            if (account) {
                _this.CurrentAccount.next(account);
                _this.router.navigateByUrl('/Landing');
            }
        });
    };
    AppComponent.prototype.markNotificationsAsRead = function () {
        var _this = this;
        var recentNotifications = this.notificationService.recentNotifications;
        if (recentNotifications.length) {
            this.notificationService.readUnreadNotification(recentNotifications.map(function (n) { return n.id; }), true)
                .subscribe(function (response) {
                for (var _i = 0, recentNotifications_1 = recentNotifications; _i < recentNotifications_1.length; _i++) {
                    var n = recentNotifications_1[_i];
                    n.isRead = true;
                }
                _this.newNotificationCount = recentNotifications.filter(function (n) { return !n.isRead; }).length;
            }, function (error) {
                _this.alertService.logError(error);
                _this.alertService.showMessage("Notification Error", "Marking read notifications failed", _services_alert_service__WEBPACK_IMPORTED_MODULE_3__["MessageSeverity"].error);
            });
        }
    };
    AppComponent.prototype.showDialog = function (dialog) {
        alertify.set({
            labels: {
                ok: dialog.okLabel || "OK",
                cancel: dialog.cancelLabel || "Cancel"
            }
        });
        switch (dialog.type) {
            case _services_alert_service__WEBPACK_IMPORTED_MODULE_3__["DialogType"].alert:
                alertify.alert(dialog.message);
                break;
            case _services_alert_service__WEBPACK_IMPORTED_MODULE_3__["DialogType"].confirm:
                alertify
                    .confirm(dialog.message, function (e) {
                    if (e) {
                        dialog.okCallback();
                    }
                    else {
                        if (dialog.cancelCallback)
                            dialog.cancelCallback();
                    }
                });
                break;
            case _services_alert_service__WEBPACK_IMPORTED_MODULE_3__["DialogType"].prompt:
                alertify
                    .prompt(dialog.message, function (e, val) {
                    if (e) {
                        dialog.okCallback(val);
                    }
                    else {
                        if (dialog.cancelCallback)
                            dialog.cancelCallback();
                    }
                }, dialog.defaultValue);
                break;
        }
    };
    AppComponent.prototype.showToast = function (message, isSticky) {
        var _this = this;
        if (message == null) {
            for (var _i = 0, _a = this.stickyToasties.slice(0); _i < _a.length; _i++) {
                var id = _a[_i];
                this.toastaService.clear(id);
            }
            return;
        }
        var toastOptions = {
            title: message.summary,
            msg: message.detail,
            timeout: isSticky ? 0 : 4000
        };
        if (isSticky) {
            toastOptions.onAdd = function (toast) { return _this.stickyToasties.push(toast.id); };
            toastOptions.onRemove = function (toast) {
                var index = _this.stickyToasties.indexOf(toast.id, 0);
                if (index > -1) {
                    _this.stickyToasties.splice(index, 1);
                }
                toast.onAdd = null;
                toast.onRemove = null;
            };
        }
        switch (message.severity) {
            case _services_alert_service__WEBPACK_IMPORTED_MODULE_3__["MessageSeverity"].default:
                this.toastaService.default(toastOptions);
                break;
            case _services_alert_service__WEBPACK_IMPORTED_MODULE_3__["MessageSeverity"].info:
                this.toastaService.info(toastOptions);
                break;
            case _services_alert_service__WEBPACK_IMPORTED_MODULE_3__["MessageSeverity"].success:
                this.toastaService.success(toastOptions);
                break;
            case _services_alert_service__WEBPACK_IMPORTED_MODULE_3__["MessageSeverity"].error:
                this.toastaService.error(toastOptions);
                break;
            case _services_alert_service__WEBPACK_IMPORTED_MODULE_3__["MessageSeverity"].warn:
                this.toastaService.warning(toastOptions);
                break;
            case _services_alert_service__WEBPACK_IMPORTED_MODULE_3__["MessageSeverity"].wait:
                this.toastaService.wait(toastOptions);
                break;
        }
    };
    AppComponent.prototype.logout = function () {
        this.authService.logout();
        this.authService.redirectLogoutUser();
    };
    AppComponent.prototype.getYear = function () {
        return new Date().getUTCFullYear();
    };
    Object.defineProperty(AppComponent.prototype, "userName", {
        get: function () {
            return this.authService.currentUser ? this.authService.currentUser.userName : "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppComponent.prototype, "fullName", {
        get: function () {
            return this.authService.currentUser ? this.authService.currentUser.lastName : "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppComponent.prototype, "canViewCustomers", {
        get: function () {
            return this.accountService.userHasPermission(_models_permission_model__WEBPACK_IMPORTED_MODULE_11__["Permission"].viewUsersPermission); //eg. viewCustomersPermission
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppComponent.prototype, "canViewProducts", {
        get: function () {
            return this.accountService.userHasPermission(_models_permission_model__WEBPACK_IMPORTED_MODULE_11__["Permission"].viewUsersPermission); //eg. viewProductsPermission
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppComponent.prototype, "canViewOrders", {
        get: function () {
            return true; //eg. viewOrdersPermission
        },
        enumerable: true,
        configurable: true
    });
    AppComponent.prototype.togglePopover = function (e) {
        this.isAutoEnrollPopoverVisible = !this.isAutoEnrollPopoverVisible;
        return this.isAutoEnrollPopoverVisible;
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChildren"])('loginModal,loginControl'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["QueryList"])
    ], AppComponent.prototype, "modalLoginControls", void 0);
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: "app-root",
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/components/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.css */ "./src/app/components/app.component.css")],
            encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewEncapsulation"].None
        }),
        __metadata("design:paramtypes", [_services_local_store_manager_service__WEBPACK_IMPORTED_MODULE_7__["LocalStoreManager"],
            ngx_toasta__WEBPACK_IMPORTED_MODULE_2__["ToastaService"],
            ngx_toasta__WEBPACK_IMPORTED_MODULE_2__["ToastaConfig"],
            _services_account_service__WEBPACK_IMPORTED_MODULE_6__["AccountService"],
            _services_alert_service__WEBPACK_IMPORTED_MODULE_3__["AlertService"],
            _services_notification_service__WEBPACK_IMPORTED_MODULE_4__["NotificationService"],
            _services_app_title_service__WEBPACK_IMPORTED_MODULE_8__["AppTitleService"],
            _services_auth_service__WEBPACK_IMPORTED_MODULE_9__["AuthService"],
            _services_app_translation_service__WEBPACK_IMPORTED_MODULE_5__["AppTranslationService"],
            _services_configuration_service__WEBPACK_IMPORTED_MODULE_10__["ConfigurationService"],
            _services_language_observable_service__WEBPACK_IMPORTED_MODULE_13__["LanguageObservableService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/components/contact-us-ext/contact-us-ext.component.css":
/*!************************************************************************!*\
  !*** ./src/app/components/contact-us-ext/contact-us-ext.component.css ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/components/contact-us-ext/contact-us-ext.component.html":
/*!*************************************************************************!*\
  !*** ./src/app/components/contact-us-ext/contact-us-ext.component.html ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container sa-container-minsize sa-header-margin\">\r\n\r\n  <header class=\"pageHeader\">\r\n    <div class=\"row\">\r\n      <div class=\"col-md-12\">\r\n        <div class=\"sa-heading-text\">\r\n          {{'ContactUs.ContactUs' | translate}}\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </header>\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      <div>\r\n        {{'ContactUs.AMERICAS' | translate}}\r\n      </div>\r\n      <br />\r\n      <div>\r\n        {{'ContactUs.France' | translate}}\r\n      </div>\r\n      <br />\r\n      <div>\r\n        {{'ContactUs.Spain' | translate}}\r\n      </div>\r\n      <br />\r\n      <div>\r\n        {{'ContactUs.Switzerland' | translate}}\r\n      </div>\r\n      <br />\r\n      <div>\r\n        {{'ContactUs.Netherlands' | translate}}\r\n      </div>\r\n      <br />\r\n      <div>\r\n        {{'ContactUs.UK' | translate}}\r\n      </div>\r\n      <br />\r\n      <div>\r\n        {{'ContactUs.AllCountries' | translate}}\r\n      </div>\r\n      <br />\r\n      <div>\r\n        {{'ContactUs.APAC' | translate}}\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n</div>\r\n\r\n"

/***/ }),

/***/ "./src/app/components/contact-us-ext/contact-us-ext.component.ts":
/*!***********************************************************************!*\
  !*** ./src/app/components/contact-us-ext/contact-us-ext.component.ts ***!
  \***********************************************************************/
/*! exports provided: ContactUsExtComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ContactUsExtComponent", function() { return ContactUsExtComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ContactUsExtComponent = /** @class */ (function () {
    function ContactUsExtComponent() {
    }
    ContactUsExtComponent.prototype.ngOnInit = function () {
    };
    ContactUsExtComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'contact-us-ext',
            template: __webpack_require__(/*! ./contact-us-ext.component.html */ "./src/app/components/contact-us-ext/contact-us-ext.component.html"),
            styles: [__webpack_require__(/*! ./contact-us-ext.component.css */ "./src/app/components/contact-us-ext/contact-us-ext.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], ContactUsExtComponent);
    return ContactUsExtComponent;
}());



/***/ }),

/***/ "./src/app/components/contact-us/contact-us.component.css":
/*!****************************************************************!*\
  !*** ./src/app/components/contact-us/contact-us.component.css ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/components/contact-us/contact-us.component.html":
/*!*****************************************************************!*\
  !*** ./src/app/components/contact-us/contact-us.component.html ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container sa-container-minsize sa-header-margin-loggedin\">\r\n  \r\n  <header class=\"pageHeader\">\r\n    <div class=\"row\">\r\n      <div class=\"col-md-12\">\r\n        <div class=\"sa-heading-text\">\r\n          {{'ContactUs.ContactUs' | translate}}\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </header>\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      <div>\r\n        {{'ContactUs.AMERICAS' | translate}}\r\n      </div>\r\n      <br />\r\n      <div>\r\n        {{'ContactUs.France' | translate}}\r\n      </div>\r\n      <br />\r\n      <div>\r\n        {{'ContactUs.Spain' | translate}}\r\n      </div>\r\n      <br />\r\n      <div>\r\n        {{'ContactUs.Switzerland' | translate}}\r\n      </div>\r\n      <br />\r\n      <div>\r\n        {{'ContactUs.Netherlands' | translate}}\r\n      </div>\r\n      <br />\r\n      <div>\r\n        {{'ContactUs.UK' | translate}}\r\n      </div>\r\n      <br />\r\n      <div>\r\n        {{'ContactUs.AllCountries' | translate}}\r\n      </div>\r\n      <br />\r\n      <div>\r\n        {{'ContactUs.APAC' | translate}}\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/components/contact-us/contact-us.component.ts":
/*!***************************************************************!*\
  !*** ./src/app/components/contact-us/contact-us.component.ts ***!
  \***************************************************************/
/*! exports provided: ContactUsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ContactUsComponent", function() { return ContactUsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ContactUsComponent = /** @class */ (function () {
    function ContactUsComponent() {
    }
    ContactUsComponent.prototype.ngOnInit = function () {
    };
    ContactUsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'contact-us',
            template: __webpack_require__(/*! ./contact-us.component.html */ "./src/app/components/contact-us/contact-us.component.html"),
            styles: [__webpack_require__(/*! ./contact-us.component.css */ "./src/app/components/contact-us/contact-us.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], ContactUsComponent);
    return ContactUsComponent;
}());



/***/ }),

/***/ "./src/app/components/controls/notifications-viewer.component.css":
/*!************************************************************************!*\
  !*** ./src/app/components/controls/notifications-viewer.component.css ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n.unread {\r\n    font-weight: bold;\r\n}\r\n"

/***/ }),

/***/ "./src/app/components/controls/notifications-viewer.component.html":
/*!*************************************************************************!*\
  !*** ./src/app/components/controls/notifications-viewer.component.html ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div>\r\n    <ngx-datatable class=\"material colored-header sm table-hover\"\r\n                   [loadingIndicator]=\"loadingIndicator\"\r\n                   [rows]=\"rows\"\r\n                   [rowHeight]=\"35\"\r\n                   [headerHeight]=\"isViewOnly ? 0 : 35\"\r\n                   [footerHeight]=\"35\"\r\n                   [limit]=\"10\"\r\n                   [columns]=\"columns\"\r\n                   [scrollbarV]=\"verticalScrollbar\"\r\n                   [columnMode]=\"'force'\">\r\n    </ngx-datatable>\r\n\r\n    <ng-template #statusHeaderTemplate>\r\n        <i class=\"fa fa-bullhorn\"></i>\r\n    </ng-template>\r\n\r\n    <ng-template #statusTemplate>\r\n        <span></span>\r\n    </ng-template>\r\n\r\n    <ng-template #dateTemplate let-row=\"row\" let-value=\"value\">\r\n        <span [class.unread]=\"!row.isRead\" attr.title=\"{{getPrintedDate(value)}}\">\r\n            {{getPrintedDate(value)}}\r\n        </span>\r\n    </ng-template>\r\n\r\n    <ng-template #contentHeaderTemplate let-row=\"row\" let-value=\"value\">\r\n        <span [class.unread]=\"!row.isRead\" attr.title=\"{{row.body}}\">\r\n            {{value}}\r\n        </span>\r\n    </ng-template>\r\n\r\n    <ng-template #contenBodytTemplate let-row=\"row\" let-value=\"value\">\r\n        <span [class.unread]=\"!row.isRead\" attr.title=\"{{row.header}}\">\r\n            {{value}}\r\n        </span>\r\n    </ng-template>\r\n\r\n\r\n    <ng-template #actionsTemplate let-row=\"row\">\r\n        <a class=\"btn btn-link btn-xs\" href=\"javascript:;\" tooltip=\"{{'notifications.Delete' | translate}}\" container=\"body\" (click)=\"deleteNotification(row)\"><i class=\"fa fa-times\"></i></a>\r\n        <a class=\"btn btn-link btn-xs\" href=\"javascript:;\" tooltip=\"{{'notifications.Pin' | translate}}\" co container=\"body\" (click)=\"togglePin(row)\">\r\n            <i *ngIf=\"row.isPinned\" class=\"fa fa-thumb-tack\"></i>\r\n            <i *ngIf=\"!row.isPinned\" class=\"fa fa-thumb-tack fa-rotate-90\"></i>\r\n        </a>\r\n    </ng-template>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/components/controls/notifications-viewer.component.ts":
/*!***********************************************************************!*\
  !*** ./src/app/components/controls/notifications-viewer.component.ts ***!
  \***********************************************************************/
/*! exports provided: NotificationsViewerComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NotificationsViewerComponent", function() { return NotificationsViewerComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_alert_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/alert.service */ "./src/app/services/alert.service.ts");
/* harmony import */ var _services_app_translation_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/app-translation.service */ "./src/app/services/app-translation.service.ts");
/* harmony import */ var _services_notification_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/notification.service */ "./src/app/services/notification.service.ts");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var _models_permission_model__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../models/permission.model */ "./src/app/models/permission.model.ts");
/* harmony import */ var _services_utilities__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../services/utilities */ "./src/app/services/utilities.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var NotificationsViewerComponent = /** @class */ (function () {
    function NotificationsViewerComponent(alertService, translationService, accountService, notificationService) {
        this.alertService = alertService;
        this.translationService = translationService;
        this.accountService = accountService;
        this.notificationService = notificationService;
        this.columns = [];
        this.rows = [];
        this.dataLoadingConsecutiveFailurs = 0;
        this.verticalScrollbar = false;
    }
    NotificationsViewerComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.isViewOnly) {
            this.columns = [
                { prop: 'date', cellTemplate: this.dateTemplate, width: 100, resizeable: false, canAutoResize: false, sortable: false, draggable: false },
                { prop: 'header', cellTemplate: this.contentHeaderTemplate, width: 200, resizeable: false, sortable: false, draggable: false },
            ];
        }
        else {
            var gT = function (key) { return _this.translationService.getTranslation(key); };
            this.columns = [
                { prop: "", name: '', width: 10, headerTemplate: this.statusHeaderTemplate, cellTemplate: this.statusTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false },
                { prop: 'date', name: gT('notifications.Date'), cellTemplate: this.dateTemplate, width: 30 },
                { prop: 'body', name: gT('notifications.Notification'), cellTemplate: this.contenBodytTemplate, width: 500 },
                { name: '', width: 80, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
            ];
        }
        this.initDataLoading();
    };
    NotificationsViewerComponent.prototype.ngOnDestroy = function () {
        if (this.dataLoadingSubscription)
            this.dataLoadingSubscription.unsubscribe();
    };
    NotificationsViewerComponent.prototype.initDataLoading = function () {
        var _this = this;
        if (this.isViewOnly && this.notificationService.recentNotifications) {
            this.rows = this.processResults(this.notificationService.recentNotifications);
            return;
        }
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        var dataLoadTask = this.isViewOnly ? this.notificationService.getNewNotifications() : this.notificationService.getNewNotificationsPeriodically();
        this.dataLoadingSubscription = dataLoadTask
            .subscribe(function (notifications) {
            _this.alertService.stopLoadingMessage();
            _this.loadingIndicator = false;
            _this.dataLoadingConsecutiveFailurs = 0;
            _this.rows = _this.processResults(notifications);
        }, function (error) {
            _this.alertService.stopLoadingMessage();
            _this.loadingIndicator = false;
            _this.alertService.showMessage("Load Error", "Loading new notifications from the server failed!", _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["MessageSeverity"].warn);
            _this.alertService.logError(error);
            if (_this.dataLoadingConsecutiveFailurs++ < 5)
                setTimeout(function () { return _this.initDataLoading(); }, 5000);
            else
                _this.alertService.showStickyMessage("Load Error", "Loading new notifications from the server failed!", _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["MessageSeverity"].error);
        });
        if (this.isViewOnly)
            this.dataLoadingSubscription = null;
    };
    NotificationsViewerComponent.prototype.processResults = function (notifications) {
        if (this.isViewOnly) {
            notifications.sort(function (a, b) {
                return b.date.valueOf() - a.date.valueOf();
            });
        }
        return notifications;
    };
    NotificationsViewerComponent.prototype.getPrintedDate = function (value) {
        if (value)
            return _services_utilities__WEBPACK_IMPORTED_MODULE_6__["Utilities"].printTimeOnly(value) + " on " + _services_utilities__WEBPACK_IMPORTED_MODULE_6__["Utilities"].printDateOnly(value);
    };
    NotificationsViewerComponent.prototype.deleteNotification = function (row) {
        var _this = this;
        this.alertService.showDialog('Are you sure you want to delete the notification \"' + row.header + '\"?', _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["DialogType"].confirm, function () { return _this.deleteNotificationHelper(row); });
    };
    NotificationsViewerComponent.prototype.deleteNotificationHelper = function (row) {
        var _this = this;
        this.alertService.startLoadingMessage("Deleting...");
        this.loadingIndicator = true;
        this.notificationService.deleteNotification(row)
            .subscribe(function (results) {
            _this.alertService.stopLoadingMessage();
            _this.loadingIndicator = false;
            _this.rows = _this.rows.filter(function (item) { return item.id != row.id; });
        }, function (error) {
            _this.alertService.stopLoadingMessage();
            _this.loadingIndicator = false;
            _this.alertService.showStickyMessage("Delete Error", "An error occured whilst deleting the notification.\r\nError: \"" + _services_utilities__WEBPACK_IMPORTED_MODULE_6__["Utilities"].getHttpResponseMessage(error) + "\"", _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["MessageSeverity"].error, error);
        });
    };
    NotificationsViewerComponent.prototype.togglePin = function (row) {
        var _this = this;
        var pin = !row.isPinned;
        var opText = pin ? "Pinning" : "Unpinning";
        this.alertService.startLoadingMessage(opText + "...");
        this.loadingIndicator = true;
        this.notificationService.pinUnpinNotification(row, pin)
            .subscribe(function (results) {
            _this.alertService.stopLoadingMessage();
            _this.loadingIndicator = false;
            row.isPinned = pin;
        }, function (error) {
            _this.alertService.stopLoadingMessage();
            _this.loadingIndicator = false;
            _this.alertService.showStickyMessage(opText + " Error", "An error occured whilst " + opText + " the notification.\r\nError: \"" + _services_utilities__WEBPACK_IMPORTED_MODULE_6__["Utilities"].getHttpResponseMessage(error) + "\"", _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["MessageSeverity"].error, error);
        });
    };
    Object.defineProperty(NotificationsViewerComponent.prototype, "canManageNotifications", {
        get: function () {
            return this.accountService.userHasPermission(_models_permission_model__WEBPACK_IMPORTED_MODULE_5__["Permission"].manageRolesPermission); //Todo: Consider creating separate permission for notifications
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], NotificationsViewerComponent.prototype, "isViewOnly", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], NotificationsViewerComponent.prototype, "verticalScrollbar", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('statusHeaderTemplate'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"])
    ], NotificationsViewerComponent.prototype, "statusHeaderTemplate", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('statusTemplate'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"])
    ], NotificationsViewerComponent.prototype, "statusTemplate", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('dateTemplate'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"])
    ], NotificationsViewerComponent.prototype, "dateTemplate", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('contentHeaderTemplate'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"])
    ], NotificationsViewerComponent.prototype, "contentHeaderTemplate", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('contenBodytTemplate'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"])
    ], NotificationsViewerComponent.prototype, "contenBodytTemplate", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('actionsTemplate'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"])
    ], NotificationsViewerComponent.prototype, "actionsTemplate", void 0);
    NotificationsViewerComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'notifications-viewer',
            template: __webpack_require__(/*! ./notifications-viewer.component.html */ "./src/app/components/controls/notifications-viewer.component.html"),
            styles: [__webpack_require__(/*! ./notifications-viewer.component.css */ "./src/app/components/controls/notifications-viewer.component.css")]
        }),
        __metadata("design:paramtypes", [_services_alert_service__WEBPACK_IMPORTED_MODULE_1__["AlertService"], _services_app_translation_service__WEBPACK_IMPORTED_MODULE_2__["AppTranslationService"], _services_account_service__WEBPACK_IMPORTED_MODULE_4__["AccountService"], _services_notification_service__WEBPACK_IMPORTED_MODULE_3__["NotificationService"]])
    ], NotificationsViewerComponent);
    return NotificationsViewerComponent;
}());



/***/ }),

/***/ "./src/app/components/controls/role-editor.component.css":
/*!***************************************************************!*\
  !*** ./src/app/components/controls/role-editor.component.css ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".row:not(:last-child) {\r\n    /*border-bottom: 1px solid #ccc;*/\r\n}\r\n\r\n.separator-hr {\r\n    margin: 0 5px;\r\n    border-top-style: dashed;\r\n}\r\n\r\n.edit-separator-hr {\r\n    margin: 10px 5px;\r\n    border-top-style: dashed;\r\n}\r\n\r\n.last-separator-hr {\r\n    margin-top: 5px;\r\n}\r\n\r\n.edit-last-separator-hr {\r\n    margin-top: 15px;\r\n}\r\n\r\n.form-group {\r\n    margin-top: 0;\r\n    margin-bottom: 0;\r\n}\r\n\r\ninput.form-control {\r\n    border-left-width: 5px;\r\n}\r\n\r\n.roleErrorMessage {\r\n    margin-left: 50px;\r\n}\r\n\r\n.permissionsColumn {\r\n    margin-bottom: 20px;\r\n}\r\n\r\n.permissionsRow {\r\n    margin: 0 15px;\r\n}\r\n\r\n.password-well {\r\n    margin-bottom: 0;\r\n}\r\n\r\n@media (min-width: 992px) {\r\n    .user-enabled {\r\n        margin-left: 40px;\r\n    }\r\n}\r\n"

/***/ }),

/***/ "./src/app/components/controls/role-editor.component.html":
/*!****************************************************************!*\
  !*** ./src/app/components/controls/role-editor.component.html ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div>\r\n  <form *ngIf=\"formResetToggle\" class=\"form-horizontal\" name=\"roleEditorForm\" #f=\"ngForm\" novalidate\r\n        (ngSubmit)=\"f.form.valid ? save() :\r\n          (!roleName.valid && showErrorAlert('Role name is required', 'Please enter a role name (minimum of 2 and maximum of 200 characters)'));\">\r\n\r\n    <div class=\"row\">\r\n      <div class=\"col-sm-4\">\r\n        <div class=\"form-group has-feedback\">\r\n          <label class=\"control-label col-md-2\" for=\"roleName\">{{'roles.editor.Name' | translate}}</label>\r\n          <div class=\"col-md-10\" [ngClass]=\"{'has-success': f.submitted && roleName.valid, 'has-error' : f.submitted && !roleName.valid}\">\r\n            <input [disabled]=\"!canManageRoles\" type=\"text\" id=\"roleName\" name=\"roleName\" placeholder=\"Enter role name\" class=\"form-control\" [(ngModel)]=\"roleEdit.name\" #roleName=\"ngModel\" required minlength=\"2\" maxlength=\"200\" />\r\n            <span *ngIf=\"showValidationErrors && f.submitted\" class=\"glyphicon form-control-feedback\" [ngClass]=\"{'glyphicon-ok ': roleName.valid, 'glyphicon-remove' : !roleName.valid}\"></span>\r\n          </div>\r\n        </div>\r\n      </div>\r\n\r\n      <div class=\"col-sm-8\">\r\n        <div class=\"form-group\">\r\n          <label class=\"control-label col-md-2\" for=\"roleDescription\">{{'roles.editor.Description' | translate}}</label>\r\n          <div class=\"col-md-10\">\r\n            <input [disabled]=\"!canManageRoles\" type=\"text\" id=\"roleDescription\" name=\"roleDescription\" placeholder=\"Enter role description\" class=\"form-control\" [(ngModel)]=\"roleEdit.description\" />\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"row\">\r\n      <div class=\"col-md-12\">\r\n        <span *ngIf=\"showValidationErrors && f.submitted && !roleName.valid\" class=\"errorMessage roleErrorMessage\">\r\n          {{'roles.editor.RoleNameRequired' | translate}}\r\n        </span>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"row\">\r\n      <div class=\"col-md-12\">\r\n        <hr class=\"edit-separator-hr\" />\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"row\">\r\n      <div class=\"row well well-sm permissionsRow\">\r\n\r\n        <ng-template ngFor let-permissionGroup [ngForOf]=\"allPermissions | groupBy: 'groupName'\" let-i=\"index\">\r\n          <div class=\"form-group col-sm-6 permissionsColumn\">\r\n            <label class=\"col-md-5 control-label\" for=\"checkboxes\" (click)=\"toggleGroup(permissionGroup.key)\">{{permissionGroup.key}}</label>\r\n            <div class=\"col-md-7\">\r\n              <div class=\"checkbox\" *ngFor=\"let permission of permissionGroup.value\">\r\n                <label tooltip=\"{{permission.description}}\" for=\"checkboxes-{{permission.value}}\">\r\n                  <input [disabled]=\"!canManageRoles\" name=\"checkboxes-{{permission.value}}\" id=\"checkboxes-{{permission.value}}\" type=\"checkbox\" [(ngModel)]=\"selectedValues[permission.value]\">\r\n                  {{permission.name}}\r\n                </label>\r\n              </div>\r\n            </div>\r\n          </div>\r\n          <div *ngIf=\"(i + 1) % 2 === 0\" class=\"clearfix\"></div>\r\n        </ng-template>\r\n\r\n      </div>\r\n\r\n    </div>\r\n\r\n\r\n    <div class=\"row\">\r\n      <div class=\"col-md-12\">\r\n        <hr class=\"edit-last-separator-hr\" />\r\n      </div>\r\n    </div>\r\n\r\n\r\n    <div class=\"form-group\">\r\n      <div class=\"col-sm-5\">\r\n        <div *ngIf=\"canManageRoles\" class=\"pull-left\">\r\n          <a (click)=\"selectAll()\" href=\"javascript:;\" class=\"btn btn-link\">{{'roles.editor.SelectAll' | translate}}</a>|<a (click)=\"selectNone()\" href=\"javascript:;\" class=\"btn btn-link\">{{'roles.editor.SelectNone' | translate}}</a>\r\n        </div>\r\n      </div>\r\n\r\n      <div class=\"col-sm-7\">\r\n        <div ngPreserveWhitespaces class=\"pull-right\">\r\n          <button *ngIf=\"!canManageRoles\" type=\"button\" (click)=\"cancel()\" class=\"btn btn-default\">{{'roles.editor.Close' | translate}}</button>\r\n          <button *ngIf=\"canManageRoles\" type=\"button\" (click)=\"cancel()\" class=\"btn btn-danger\" [disabled]=\"isSaving\"><i class='fa fa-times'></i> {{'roles.editor.Cancel' | translate}}</button>\r\n          <button *ngIf=\"canManageRoles\" type=\"submit\" class=\"btn btn-primary\" [disabled]=\"isSaving\">\r\n            <i *ngIf=\"!isSaving\" class='fa fa-save'></i><i *ngIf=\"isSaving\" class='fa fa-circle-o-notch fa-spin'></i> {{isSaving ? ('roles.editor.Saving' | translate) : ('roles.editor.Save' | translate)}}\r\n          </button>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"clearfix\"></div>\r\n  </form>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/components/controls/role-editor.component.ts":
/*!**************************************************************!*\
  !*** ./src/app/components/controls/role-editor.component.ts ***!
  \**************************************************************/
/*! exports provided: RoleEditorComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RoleEditorComponent", function() { return RoleEditorComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_alert_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/alert.service */ "./src/app/services/alert.service.ts");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var _models_role_model__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../models/role.model */ "./src/app/models/role.model.ts");
/* harmony import */ var _models_permission_model__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../models/permission.model */ "./src/app/models/permission.model.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var RoleEditorComponent = /** @class */ (function () {
    function RoleEditorComponent(alertService, accountService) {
        this.alertService = alertService;
        this.accountService = accountService;
        this.isNewRole = false;
        this.showValidationErrors = true;
        this.roleEdit = new _models_role_model__WEBPACK_IMPORTED_MODULE_3__["Role"]();
        this.allPermissions = [];
        this.selectedValues = {};
        this.formResetToggle = true;
    }
    RoleEditorComponent.prototype.showErrorAlert = function (caption, message) {
        this.alertService.showMessage(caption, message, _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["MessageSeverity"].error);
    };
    RoleEditorComponent.prototype.save = function () {
        var _this = this;
        this.isSaving = true;
        this.alertService.startLoadingMessage("Saving changes...");
        this.roleEdit.permissions = this.getSelectedPermissions();
        if (this.isNewRole) {
            this.accountService.newRole(this.roleEdit).subscribe(function (role) { return _this.saveSuccessHelper(role); }, function (error) { return _this.saveFailedHelper(error); });
        }
        else {
            this.accountService.updateRole(this.roleEdit).subscribe(function (response) { return _this.saveSuccessHelper(); }, function (error) { return _this.saveFailedHelper(error); });
        }
    };
    RoleEditorComponent.prototype.saveSuccessHelper = function (role) {
        var _this = this;
        if (role)
            Object.assign(this.roleEdit, role);
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.showValidationErrors = false;
        if (this.isNewRole)
            this.alertService.showMessage("Success", "Role \"" + this.roleEdit.name + "\" was created successfully", _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["MessageSeverity"].success);
        else
            this.alertService.showMessage("Success", "Changes to role \"" + this.roleEdit.name + "\" was saved successfully", _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["MessageSeverity"].success);
        this.roleEdit = new _models_role_model__WEBPACK_IMPORTED_MODULE_3__["Role"]();
        this.resetForm();
        if (!this.isNewRole && this.accountService.currentUser.roles.some(function (r) { return r == _this.editingRoleName; }))
            this.refreshLoggedInUser();
        if (this.changesSavedCallback)
            this.changesSavedCallback();
    };
    RoleEditorComponent.prototype.refreshLoggedInUser = function () {
        var _this = this;
        this.accountService.refreshLoggedInUser()
            .subscribe(function (user) { }, function (error) {
            _this.alertService.resetStickyMessage();
            _this.alertService.showStickyMessage("Refresh failed", "An error occured whilst refreshing logged in user information from the server", _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["MessageSeverity"].error, error);
        });
    };
    RoleEditorComponent.prototype.saveFailedHelper = function (error) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["MessageSeverity"].error, error);
        this.alertService.showStickyMessage(error, null, _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["MessageSeverity"].error);
        if (this.changesFailedCallback)
            this.changesFailedCallback();
    };
    RoleEditorComponent.prototype.cancel = function () {
        this.roleEdit = new _models_role_model__WEBPACK_IMPORTED_MODULE_3__["Role"]();
        this.showValidationErrors = false;
        this.resetForm();
        this.alertService.showMessage("Cancelled", "Operation cancelled by user", _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["MessageSeverity"].default);
        this.alertService.resetStickyMessage();
        if (this.changesCancelledCallback)
            this.changesCancelledCallback();
    };
    RoleEditorComponent.prototype.selectAll = function () {
        var _this = this;
        this.allPermissions.forEach(function (p) { return _this.selectedValues[p.value] = true; });
    };
    RoleEditorComponent.prototype.selectNone = function () {
        var _this = this;
        this.allPermissions.forEach(function (p) { return _this.selectedValues[p.value] = false; });
    };
    RoleEditorComponent.prototype.toggleGroup = function (groupName) {
        var _this = this;
        var firstMemberValue;
        this.allPermissions.forEach(function (p) {
            if (p.groupName != groupName)
                return;
            if (firstMemberValue == null)
                firstMemberValue = _this.selectedValues[p.value] == true;
            _this.selectedValues[p.value] = !firstMemberValue;
        });
    };
    RoleEditorComponent.prototype.getSelectedPermissions = function () {
        var _this = this;
        return this.allPermissions.filter(function (p) { return _this.selectedValues[p.value] == true; });
    };
    RoleEditorComponent.prototype.resetForm = function (replace) {
        var _this = this;
        if (replace === void 0) { replace = false; }
        if (!replace) {
            this.form.reset();
        }
        else {
            this.formResetToggle = false;
            setTimeout(function () {
                _this.formResetToggle = true;
            });
        }
    };
    RoleEditorComponent.prototype.newRole = function (allPermissions) {
        this.isNewRole = true;
        this.showValidationErrors = true;
        this.editingRoleName = null;
        this.allPermissions = allPermissions;
        this.selectedValues = {};
        this.roleEdit = new _models_role_model__WEBPACK_IMPORTED_MODULE_3__["Role"]();
        return this.roleEdit;
    };
    RoleEditorComponent.prototype.editRole = function (role, allPermissions) {
        var _this = this;
        if (role) {
            this.isNewRole = false;
            this.showValidationErrors = true;
            this.editingRoleName = role.name;
            this.allPermissions = allPermissions;
            this.selectedValues = {};
            role.permissions.forEach(function (p) { return _this.selectedValues[p.value] = true; });
            this.roleEdit = new _models_role_model__WEBPACK_IMPORTED_MODULE_3__["Role"]();
            Object.assign(this.roleEdit, role);
            return this.roleEdit;
        }
        else {
            return this.newRole(allPermissions);
        }
    };
    Object.defineProperty(RoleEditorComponent.prototype, "canManageRoles", {
        get: function () {
            return this.accountService.userHasPermission(_models_permission_model__WEBPACK_IMPORTED_MODULE_4__["Permission"].manageRolesPermission);
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('f'),
        __metadata("design:type", Object)
    ], RoleEditorComponent.prototype, "form", void 0);
    RoleEditorComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'role-editor',
            template: __webpack_require__(/*! ./role-editor.component.html */ "./src/app/components/controls/role-editor.component.html"),
            styles: [__webpack_require__(/*! ./role-editor.component.css */ "./src/app/components/controls/role-editor.component.css")]
        }),
        __metadata("design:paramtypes", [_services_alert_service__WEBPACK_IMPORTED_MODULE_1__["AlertService"], _services_account_service__WEBPACK_IMPORTED_MODULE_2__["AccountService"]])
    ], RoleEditorComponent);
    return RoleEditorComponent;
}());



/***/ }),

/***/ "./src/app/components/controls/roles-management.component.css":
/*!********************************************************************!*\
  !*** ./src/app/components/controls/roles-management.component.css ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n.control-box {\r\n    margin-bottom: 5px;\r\n}\r\n\r\n.search-box {\r\n    margin: 0;\r\n}\r\n\r\n.action-box {\r\n    margin: 0 50px 0 0;\r\n    min-height: 0;\r\n}\r\n\r\n.action-box .toolbaritem a {\r\n        padding-top: 5px;\r\n        padding-bottom: 5px;\r\n        min-width: 100px;\r\n    }\r\n\r\n@media (max-width: 768px) {\r\n    .action-box {\r\n        margin: 0 14px;\r\n    }\r\n}\r\n"

/***/ }),

/***/ "./src/app/components/controls/roles-management.component.html":
/*!*********************************************************************!*\
  !*** ./src/app/components/controls/roles-management.component.html ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div>\r\n    <div class=\"row control-box\">\r\n        <div class=\"col-sm-8\">\r\n            <div class=\"form-group search-box\">\r\n                <search-box (searchChange)=\"onSearchChanged($event)\" placeholder=\"{{'roles.management.Search' | translate}}\">></search-box>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-sm-4\">\r\n            <div class=\"navbar action-box\">\r\n                <ul class=\"nav navbar-nav navbar-right\">\r\n                    <li *ngIf=\"canManageRoles\" class=\"toolbaritem\">\r\n                        <a href=\"javascript:;\" (click)=\"newRole(row)\">\r\n                            <i class=\"fa fa-plus-circle\"></i> {{'roles.management.NewRole' | translate}}\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <ngx-datatable class=\"material colored-header sm table table-striped table-hover\"\r\n                   [loadingIndicator]=\"loadingIndicator\"\r\n                   [rows]=\"rows\"\r\n                   [rowHeight]=\"35\"\r\n                   [headerHeight]=\"35\"\r\n                   [footerHeight]=\"35\"\r\n                   [columns]=\"columns\"\r\n                   [scrollbarV]=\"true\"\r\n                   [columnMode]=\"'force'\">\r\n    </ngx-datatable>\r\n\r\n    <ng-template #indexTemplate let-value=\"value\">\r\n        <strong>{{value}}</strong>\r\n    </ng-template>\r\n\r\n\r\n    <ng-template #actionsTemplate let-row=\"row\" let-value=\"value\" let-i=\"index\">\r\n        <a *ngIf=\"canManageRoles\" class=\"btn btn-link btn-xs\" href=\"javascript:;\" (click)=\"editRole(row)\"><i class=\"fa fa-pencil-square-o\" aria-hidden=\"true\"></i> {{'roles.management.Edit' | translate}}</a>\r\n        <a *ngIf=\"!canManageRoles\" class=\"btn btn-link btn-xs\" href=\"javascript:;\" (click)=\"editRole(row)\"><i class=\"fa fa-eye\" aria-hidden=\"true\"></i> {{'roles.management.Details' | translate}}</a>\r\n        {{canManageRoles ? '|' : ''}}\r\n        <a *ngIf=\"canManageRoles\" class=\"btn btn-link btn-xs\" href=\"javascript:;\" (click)=\"deleteRole(row)\"><i class=\"fa fa-trash-o\" aria-hidden=\"true\"></i> {{'roles.management.Delete' | translate}}</a>\r\n    </ng-template>\r\n\r\n\r\n    <div class=\"modal fade\" bsModal #editorModal=\"bs-modal\" (onHidden)=\"onEditorModalHidden()\" [config]=\"{backdrop: 'static'}\" tabindex=\"-1\">\r\n        <div class=\"modal-dialog modal-lg\">\r\n            <div class=\"modal-content\">\r\n                <div class=\"modal-header\">\r\n                    <h4 *ngIf=\"!canManageRoles\" class=\"modal-title pull-left\"><i class=\"fa fa-shield\"></i> {{'roles.management.RoleDetails' | translate:editingRoleName}}</h4>\r\n                    <h4 *ngIf=\"canManageRoles\" class=\"modal-title pull-left\"><i class=\"fa fa-shield\"></i> {{editingRoleName ? ('roles.management.EditRole' | translate:editingRoleName) : ('roles.management.NewRole' | translate)}}</h4>\r\n                    <button type=\"button\" class=\"close pull-right\" title=\"Close\" (click)=\"editorModal.hide()\">\r\n                        <span aria-hidden=\"true\">&times;</span>\r\n                    </button>\r\n                </div>\r\n                <div class=\"modal-body\">\r\n                    <role-editor #roleEditor></role-editor>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/components/controls/roles-management.component.ts":
/*!*******************************************************************!*\
  !*** ./src/app/components/controls/roles-management.component.ts ***!
  \*******************************************************************/
/*! exports provided: RolesManagementComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RolesManagementComponent", function() { return RolesManagementComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ngx-bootstrap/modal */ "./node_modules/ngx-bootstrap/modal/index.js");
/* harmony import */ var _services_alert_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/alert.service */ "./src/app/services/alert.service.ts");
/* harmony import */ var _services_app_translation_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/app-translation.service */ "./src/app/services/app-translation.service.ts");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var _services_utilities__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../services/utilities */ "./src/app/services/utilities.ts");
/* harmony import */ var _models_role_model__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../models/role.model */ "./src/app/models/role.model.ts");
/* harmony import */ var _models_permission_model__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../models/permission.model */ "./src/app/models/permission.model.ts");
/* harmony import */ var _role_editor_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./role-editor.component */ "./src/app/components/controls/role-editor.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var RolesManagementComponent = /** @class */ (function () {
    function RolesManagementComponent(alertService, translationService, accountService) {
        this.alertService = alertService;
        this.translationService = translationService;
        this.accountService = accountService;
        this.columns = [];
        this.rows = [];
        this.rowsCache = [];
        this.allPermissions = [];
    }
    RolesManagementComponent.prototype.ngOnInit = function () {
        var _this = this;
        var gT = function (key) { return _this.translationService.getTranslation(key); };
        this.columns = [
            { prop: "index", name: '#', width: 50, cellTemplate: this.indexTemplate, canAutoResize: false },
            { prop: 'name', name: gT('roles.management.Name'), width: 200 },
            { prop: 'description', name: gT('roles.management.Description'), width: 350 },
            { prop: 'usersCount', name: gT('roles.management.Users'), width: 80 },
            { name: '', width: 130, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        ];
        this.loadData();
    };
    RolesManagementComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.roleEditor.changesSavedCallback = function () {
            _this.addNewRoleToList();
            _this.editorModal.hide();
        };
        this.roleEditor.changesCancelledCallback = function () {
            _this.editedRole = null;
            _this.sourceRole = null;
            _this.editorModal.hide();
        };
    };
    RolesManagementComponent.prototype.addNewRoleToList = function () {
        if (this.sourceRole) {
            Object.assign(this.sourceRole, this.editedRole);
            var sourceIndex = this.rowsCache.indexOf(this.sourceRole, 0);
            if (sourceIndex > -1)
                _services_utilities__WEBPACK_IMPORTED_MODULE_5__["Utilities"].moveArrayItem(this.rowsCache, sourceIndex, 0);
            sourceIndex = this.rows.indexOf(this.sourceRole, 0);
            if (sourceIndex > -1)
                _services_utilities__WEBPACK_IMPORTED_MODULE_5__["Utilities"].moveArrayItem(this.rows, sourceIndex, 0);
            this.editedRole = null;
            this.sourceRole = null;
        }
        else {
            var role = new _models_role_model__WEBPACK_IMPORTED_MODULE_6__["Role"]();
            Object.assign(role, this.editedRole);
            this.editedRole = null;
            var maxIndex = 0;
            for (var _i = 0, _a = this.rowsCache; _i < _a.length; _i++) {
                var r = _a[_i];
                if (r.index > maxIndex)
                    maxIndex = r.index;
            }
            role.index = maxIndex + 1;
            this.rowsCache.splice(0, 0, role);
            this.rows.splice(0, 0, role);
            this.rows = this.rows.slice();
        }
    };
    RolesManagementComponent.prototype.loadData = function () {
        var _this = this;
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.accountService.getRolesAndPermissions()
            .subscribe(function (results) {
            _this.alertService.stopLoadingMessage();
            _this.loadingIndicator = false;
            var roles = results[0];
            var permissions = results[1];
            roles.forEach(function (role, index, roles) {
                role.index = index + 1;
            });
            _this.rowsCache = roles.slice();
            _this.rows = roles;
            _this.allPermissions = permissions;
        }, function (error) {
            _this.alertService.stopLoadingMessage();
            _this.loadingIndicator = false;
            _this.alertService.showStickyMessage("Load Error", "Unable to retrieve roles from the server.\r\nErrors: \"" + _services_utilities__WEBPACK_IMPORTED_MODULE_5__["Utilities"].getHttpResponseMessage(error) + "\"", _services_alert_service__WEBPACK_IMPORTED_MODULE_2__["MessageSeverity"].error, error);
        });
    };
    RolesManagementComponent.prototype.onSearchChanged = function (value) {
        this.rows = this.rowsCache.filter(function (r) { return _services_utilities__WEBPACK_IMPORTED_MODULE_5__["Utilities"].searchArray(value, false, r.name, r.description); });
    };
    RolesManagementComponent.prototype.onEditorModalHidden = function () {
        this.editingRoleName = null;
        this.roleEditor.resetForm(true);
    };
    RolesManagementComponent.prototype.newRole = function () {
        this.editingRoleName = null;
        this.sourceRole = null;
        this.editedRole = this.roleEditor.newRole(this.allPermissions);
        this.editorModal.show();
    };
    RolesManagementComponent.prototype.editRole = function (row) {
        this.editingRoleName = { name: row.name };
        this.sourceRole = row;
        this.editedRole = this.roleEditor.editRole(row, this.allPermissions);
        this.editorModal.show();
    };
    RolesManagementComponent.prototype.deleteRole = function (row) {
        var _this = this;
        this.alertService.showDialog('Are you sure you want to delete the \"' + row.name + '\" role?', _services_alert_service__WEBPACK_IMPORTED_MODULE_2__["DialogType"].confirm, function () { return _this.deleteRoleHelper(row); });
    };
    RolesManagementComponent.prototype.deleteRoleHelper = function (row) {
        var _this = this;
        this.alertService.startLoadingMessage("Deleting...");
        this.loadingIndicator = true;
        this.accountService.deleteRole(row)
            .subscribe(function (results) {
            _this.alertService.stopLoadingMessage();
            _this.loadingIndicator = false;
            _this.rowsCache = _this.rowsCache.filter(function (item) { return item !== row; });
            _this.rows = _this.rows.filter(function (item) { return item !== row; });
        }, function (error) {
            _this.alertService.stopLoadingMessage();
            _this.loadingIndicator = false;
            _this.alertService.showStickyMessage("Delete Error", "An error occured whilst deleting the role.\r\nError: \"" + _services_utilities__WEBPACK_IMPORTED_MODULE_5__["Utilities"].getHttpResponseMessage(error) + "\"", _services_alert_service__WEBPACK_IMPORTED_MODULE_2__["MessageSeverity"].error, error);
        });
    };
    Object.defineProperty(RolesManagementComponent.prototype, "canManageRoles", {
        get: function () {
            return this.accountService.userHasPermission(_models_permission_model__WEBPACK_IMPORTED_MODULE_7__["Permission"].manageRolesPermission);
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('indexTemplate'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"])
    ], RolesManagementComponent.prototype, "indexTemplate", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('actionsTemplate'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"])
    ], RolesManagementComponent.prototype, "actionsTemplate", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('editorModal'),
        __metadata("design:type", ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_1__["ModalDirective"])
    ], RolesManagementComponent.prototype, "editorModal", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('roleEditor'),
        __metadata("design:type", _role_editor_component__WEBPACK_IMPORTED_MODULE_8__["RoleEditorComponent"])
    ], RolesManagementComponent.prototype, "roleEditor", void 0);
    RolesManagementComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'roles-management',
            template: __webpack_require__(/*! ./roles-management.component.html */ "./src/app/components/controls/roles-management.component.html"),
            styles: [__webpack_require__(/*! ./roles-management.component.css */ "./src/app/components/controls/roles-management.component.css")]
        }),
        __metadata("design:paramtypes", [_services_alert_service__WEBPACK_IMPORTED_MODULE_2__["AlertService"], _services_app_translation_service__WEBPACK_IMPORTED_MODULE_3__["AppTranslationService"], _services_account_service__WEBPACK_IMPORTED_MODULE_4__["AccountService"]])
    ], RolesManagementComponent);
    return RolesManagementComponent;
}());



/***/ }),

/***/ "./src/app/components/controls/search-box.component.css":
/*!**************************************************************!*\
  !*** ./src/app/components/controls/search-box.component.css ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n.search-icon {\r\n    pointer-events: none;\r\n}\r\n"

/***/ }),

/***/ "./src/app/components/controls/search-box.component.html":
/*!***************************************************************!*\
  !*** ./src/app/components/controls/search-box.component.html ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"icon-addon addon-sm\">\r\n    <label for=\"searchInput\" title=\"Search\"><i class=\"fa fa-search left-icon search-icon\"></i></label>\r\n    <input id=\"searchInput\" #searchInput type=\"search\" ngModel=\"\" (ngModelChange)=\"onValueChange($event)\" [attr.placeholder]=\"placeholder\" class=\"form-control left-icon right-icon\">\r\n    <a *ngIf=\"searchInput.value\" href=\"javascript:;\" title=\"Clear\" (click)=\"clear()\" class=\"fa fa-times-circle clear-input right-icon\"></a>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/components/controls/search-box.component.ts":
/*!*************************************************************!*\
  !*** ./src/app/components/controls/search-box.component.ts ***!
  \*************************************************************/
/*! exports provided: SearchBoxComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SearchBoxComponent", function() { return SearchBoxComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var SearchBoxComponent = /** @class */ (function () {
    function SearchBoxComponent() {
        this.placeholder = "Search...";
        this.searchChange = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
    }
    SearchBoxComponent.prototype.onValueChange = function (value) {
        var _this = this;
        setTimeout(function () { return _this.searchChange.emit(value); });
    };
    SearchBoxComponent.prototype.clear = function () {
        this.searchInput.nativeElement.value = '';
        this.onValueChange(this.searchInput.nativeElement.value);
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], SearchBoxComponent.prototype, "placeholder", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], SearchBoxComponent.prototype, "searchChange", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])("searchInput"),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])
    ], SearchBoxComponent.prototype, "searchInput", void 0);
    SearchBoxComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'search-box',
            template: __webpack_require__(/*! ./search-box.component.html */ "./src/app/components/controls/search-box.component.html"),
            styles: [__webpack_require__(/*! ./search-box.component.css */ "./src/app/components/controls/search-box.component.css")]
        })
    ], SearchBoxComponent);
    return SearchBoxComponent;
}());



/***/ }),

/***/ "./src/app/components/controls/statistics-demo.component.css":
/*!*******************************************************************!*\
  !*** ./src/app/components/controls/statistics-demo.component.css ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n.chart-container {\r\n    display: block;\r\n}\r\n\r\n\r\n.refresh-btn {\r\n    margin-right: 10px;\r\n}\r\n\r\n\r\n.chart-type-container {\r\n    display: inline-block;\r\n}\r\n\r\n\r\nli.active2 {\r\n    background-color: #e8e8e8;\r\n}\r\n"

/***/ }),

/***/ "./src/app/components/controls/statistics-demo.component.html":
/*!********************************************************************!*\
  !*** ./src/app/components/controls/statistics-demo.component.html ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"row\">\r\n    <div class=\"col-md-6\">\r\n        <div class=\"chart-container\">\r\n            <canvas baseChart width=\"600\" height=\"250\"\r\n                    [datasets]=\"chartData\"\r\n                    [labels]=\"chartLabels\"\r\n                    [options]=\"chartOptions\"\r\n                    [colors]=\"chartColors\"\r\n                    [legend]=\"chartLegend\"\r\n                    [chartType]=\"chartType\"\r\n                    (chartHover)=\"chartHovered($event)\"\r\n                    (chartClick)=\"chartClicked($event)\"></canvas>\r\n        </div>\r\n    </div>\r\n    <div class=\"col-md-6 table-container\">\r\n        <table class=\"table table-responsive table-condensed\">\r\n            <thead>\r\n                <tr>\r\n                    <th></th>\r\n                    <th *ngFor=\"let label of chartLabels\">{{label}}</th>\r\n                </tr>\r\n            </thead>\r\n            <tbody>\r\n                <tr *ngFor=\"let d of chartData\">\r\n                    <th>{{d && d.label.split(' ').pop()}}</th>\r\n                    <td *ngFor=\"let label of chartLabels; let j=index\">{{d && d.data[j]}}</td>\r\n                </tr>\r\n            </tbody>\r\n        </table>\r\n        <button class=\"refresh-btn\" (click)=\"randomize();showMessage('Manual refresh!');\">REFSH</button>\r\n        <div class=\"chart-type-container\" dropdown>\r\n            <button id=\"chartType\" type=\"button\" class=\"dropdown-toggle\" dropdownToggle>\r\n                <i class=\"fa fa-bar-chart\"></i> <span class=\"caret\"></span>\r\n            </button>\r\n            <ul *dropdownMenu role=\"menu\" aria-labelledby=\"chartType\" class=\"dropdown-menu\">\r\n                <li [class.active2]=\"chartType == 'bar'\" role=\"menuitem\"><a class=\"dropdown-item\" (click)=\"changeChartType('bar')\" href=\"javascript:;\">Bar Chart</a></li>\r\n                <li [class.active2]=\"chartType == 'pie'\" role=\"menuitem\"><a class=\"dropdown-item\" (click)=\"changeChartType('pie')\" href=\"javascript:;\">Pie Chart</a></li>\r\n                <li [class.active2]=\"chartType == 'doughnut'\" role=\"menuitem\"><a class=\"dropdown-item\" (click)=\"changeChartType('doughnut')\" href=\"javascript:;\">Doughnut Chart</a></li>\r\n                <li [class.active2]=\"chartType == 'polarArea'\" role=\"menuitem\"><a class=\"dropdown-item\" (click)=\"changeChartType('polarArea')\" href=\"javascript:;\">Polar Area Chart</a></li>\r\n                <li [class.active2]=\"chartType == 'radar'\" role=\"menuitem\"><a class=\"dropdown-item\" (click)=\"changeChartType('radar')\" href=\"javascript:;\">Radar Chart</a></li>\r\n                <li class=\"divider dropdown-divider\"></li>\r\n                <li [class.active2]=\"chartType == 'line'\" role=\"menuitem\"><a class=\"dropdown-item\" (click)=\"changeChartType('line')\" href=\"javascript:;\">Line Chart</a></li>\r\n            </ul>\r\n        </div>\r\n        <button class=\"p1ull-right\" (click)=\"showMessage('You\\'ve clicked on the menu')\"><i class=\"fa fa-bars\"></i></button>\r\n        <button class=\"p1ull-right\" (click)=\"showDialog('Enter some value to do serious configuration...')\"><i class=\"fa fa-cogs\"></i></button>\r\n    </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/components/controls/statistics-demo.component.ts":
/*!******************************************************************!*\
  !*** ./src/app/components/controls/statistics-demo.component.ts ***!
  \******************************************************************/
/*! exports provided: StatisticsDemoComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StatisticsDemoComponent", function() { return StatisticsDemoComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_alert_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/alert.service */ "./src/app/services/alert.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


__webpack_require__(/*! chart.js */ "./node_modules/chart.js/src/chart.js");
var StatisticsDemoComponent = /** @class */ (function () {
    function StatisticsDemoComponent(alertService) {
        this.alertService = alertService;
        this.chartData = [
            { data: [65, 59, 80, 81, 56, 55], label: 'Series A' },
            { data: [28, 48, 40, 19, 86, 27], label: 'Series B' },
            { data: [18, 48, 77, 9, 100, 27], label: 'Series C' }
        ];
        this.chartLabels = ['January', 'February', 'March', 'April', 'May', 'June'];
        this.chartOptions = {
            responsive: true,
            title: {
                display: false,
                fontSize: 16,
                text: 'Important Stuff'
            }
        };
        this.chartColors = [
            {
                backgroundColor: 'rgba(148,159,177,0.2)',
                borderColor: 'rgba(148,159,177,1)',
                pointBackgroundColor: 'rgba(148,159,177,1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(148,159,177,0.8)'
            },
            {
                backgroundColor: 'rgba(77,83,96,0.2)',
                borderColor: 'rgba(77,83,96,1)',
                pointBackgroundColor: 'rgba(77,83,96,1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(77,83,96,1)'
            },
            {
                backgroundColor: 'rgba(128,128,128,0.2)',
                borderColor: 'rgba(128,128,128,1)',
                pointBackgroundColor: 'rgba(128,128,128,1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(128,128,128,0.8)'
            }
        ];
        this.chartLegend = true;
        this.chartType = 'line';
    }
    StatisticsDemoComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.timerReference = setInterval(function () { return _this.randomize(); }, 5000);
    };
    StatisticsDemoComponent.prototype.ngOnDestroy = function () {
        clearInterval(this.timerReference);
    };
    StatisticsDemoComponent.prototype.randomize = function () {
        var _chartData = new Array(this.chartData.length);
        for (var i = 0; i < this.chartData.length; i++) {
            _chartData[i] = { data: new Array(this.chartData[i].data.length), label: this.chartData[i].label };
            for (var j = 0; j < this.chartData[i].data.length; j++) {
                _chartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
            }
        }
        this.chartData = _chartData;
    };
    StatisticsDemoComponent.prototype.changeChartType = function (type) {
        this.chartType = type;
    };
    StatisticsDemoComponent.prototype.showMessage = function (msg) {
        this.alertService.showMessage("Demo", msg, _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["MessageSeverity"].info);
    };
    StatisticsDemoComponent.prototype.showDialog = function (msg) {
        var _this = this;
        this.alertService.showDialog(msg, _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["DialogType"].prompt, function (val) { return _this.configure(true, val); }, function () { return _this.configure(false); });
    };
    StatisticsDemoComponent.prototype.configure = function (response, value) {
        var _this = this;
        if (response) {
            this.alertService.showStickyMessage("Simulating...", "", _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["MessageSeverity"].wait);
            setTimeout(function () {
                _this.alertService.resetStickyMessage();
                _this.alertService.showMessage("Demo", "Your settings was successfully configured to \"" + value + "\"", _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["MessageSeverity"].success);
            }, 2000);
        }
        else {
            this.alertService.showMessage("Demo", "Operation cancelled by user", _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["MessageSeverity"].default);
        }
    };
    // events
    StatisticsDemoComponent.prototype.chartClicked = function (e) {
        console.log(e);
    };
    StatisticsDemoComponent.prototype.chartHovered = function (e) {
        console.log(e);
    };
    StatisticsDemoComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'statistics-demo',
            template: __webpack_require__(/*! ./statistics-demo.component.html */ "./src/app/components/controls/statistics-demo.component.html"),
            styles: [__webpack_require__(/*! ./statistics-demo.component.css */ "./src/app/components/controls/statistics-demo.component.css")]
        }),
        __metadata("design:paramtypes", [_services_alert_service__WEBPACK_IMPORTED_MODULE_1__["AlertService"]])
    ], StatisticsDemoComponent);
    return StatisticsDemoComponent;
}());



/***/ }),

/***/ "./src/app/components/controls/todo-demo.component.css":
/*!*************************************************************!*\
  !*** ./src/app/components/controls/todo-demo.component.css ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n.navbar .nav > li.toolbaritem > a {\r\n    font-weight: bold;\r\n}\r\n\r\ninput.form-control {\r\n    border-left-width: 5px;\r\n}\r\n\r\n.control-box {\r\n    margin-bottom: 5px;\r\n}\r\n\r\n.search-box {\r\n    margin: 0;\r\n}\r\n\r\n.action-box {\r\n    margin: 0 15px 0 0;\r\n    min-height: 0;\r\n}\r\n\r\n.action-box .toolbaritem a {\r\n        padding-top: 5px;\r\n        padding-bottom: 5px;\r\n        min-width: 100px;\r\n    }\r\n\r\n.completed {\r\n    text-decoration: line-through;\r\n}\r\n\r\n.checkbox {\r\n    margin: 0;\r\n}\r\n\r\n.inline-label {\r\n    width: 100%;\r\n    min-height: 1rem;\r\n    display: inline-block;\r\n}\r\n\r\n.inline-editor {\r\n    width: 100%;\r\n}\r\n\r\n.description-form-group {\r\n    margin-bottom: 5px;\r\n}\r\n\r\n.actionBtn-form-group {\r\n    margin: 0;\r\n}\r\n\r\n.edit-last-separator-hr {\r\n    margin: 10px 0;\r\n}\r\n\r\n@media (max-width: 768px) {\r\n    .action-box {\r\n        margin: 0 14px;\r\n    }\r\n}\r\n"

/***/ }),

/***/ "./src/app/components/controls/todo-demo.component.html":
/*!**************************************************************!*\
  !*** ./src/app/components/controls/todo-demo.component.html ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div>\r\n    <div class=\"row control-box\">\r\n        <div class=\"col-sm-8\">\r\n            <div class=\"form-group search-box\">\r\n                <search-box (searchChange)=\"onSearchChanged($event)\" placeholder=\"{{'todoDemo.management.Search' | translate}}\"></search-box>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-sm-4\">\r\n            <div class=\"navbar action-box\">\r\n                <ul class=\"nav navbar-nav\">\r\n                    <li [class.active]=\"hideCompletedTasks\" class=\"toolbaritem\"><a href=\"javascript:;\" (click)=\"hideCompletedTasks = !hideCompletedTasks\"><i class=\"fa fa-eye-slash\"></i> {{'todoDemo.management.HideCompleted' | translate}}</a></li>\r\n                    <li class=\"toolbaritem\"><a href=\"javascript:;\" (click)=\"addTask()\"><i class=\"fa fa-plus\"></i> {{'todoDemo.management.AddTask' | translate}}</a></li>\r\n                </ul>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <ngx-datatable class=\"material colored-header sm table-hover\"\r\n                   [loadingIndicator]=\"loadingIndicator\"\r\n                   [rows]=\"rows\"\r\n                   [rowHeight]=\"35\"\r\n                   [headerHeight]=\"35\"\r\n                   [footerHeight]=\"35\"\r\n                   [columns]=\"columns\"\r\n                   [scrollbarV]=\"verticalScrollbar\"\r\n                   [columnMode]=\"'force'\">\r\n    </ngx-datatable>\r\n\r\n    <ng-template #statusHeaderTemplate>\r\n        <i class=\"fa fa-check-square-o\"></i>\r\n    </ng-template>\r\n\r\n    <ng-template #statusTemplate let-row=\"row\" let-value=\"value\">\r\n        <div class=\"checkbox\">\r\n            <label>\r\n                <input attr.name=\"checkboxes-{{value}}\" type=\"checkbox\" [(ngModel)]=\"row.completed\">\r\n            </label>\r\n        </div>\r\n    </ng-template>\r\n\r\n    <ng-template #nameTemplate let-row=\"row\" let-value=\"value\">\r\n        <span *ngIf=\"!editing[row.$$index + '-name']\" class=\"inline-label\" [class.completed]=\"row.completed\" attr.title=\"Double click to edit - {{value}}\" (dblclick)=\"editing[row.$$index + '-name'] = true\">\r\n            {{value}}\r\n        </span>\r\n        <input *ngIf=\"editing[row.$$index + '-name']\" class=\"inline-editor\" autofocus (blur)=\"updateValue($event, 'name', value, row)\" type=\"text\" [value]=\"value\" />\r\n    </ng-template>\r\n\r\n    <ng-template #descriptionTemplate let-row=\"row\" let-value=\"value\">\r\n        <span *ngIf=\"!editing[row.$$index + '-description']\" class=\"inline-label\" [class.completed]=\"row.completed\" attr.title=\"Double click to edit - {{value}}\" (dblclick)=\"editing[row.$$index + '-description'] = true\">\r\n            {{value}}\r\n        </span>\r\n        <input *ngIf=\"editing[row.$$index + '-description']\" class=\"inline-editor\" autofocus (blur)=\"updateValue($event, 'description', value, row)\" type=\"text\" [value]=\"value\" />\r\n    </ng-template>\r\n\r\n\r\n    <ng-template #actionsTemplate let-row=\"row\">\r\n        <a class=\"btn btn-link btn-xs\" href=\"javascript:;\" tooltip=\"{{'todoDemo.management.Delete' | translate}}\" container=\"body\" (click)=\"delete(row)\"><i class=\"fa fa-times\"></i></a>\r\n        <a class=\"btn btn-link btn-xs\" href=\"javascript:;\" tooltip=\"{{'todoDemo.management.Important' | translate}}\" container=\"body\" (click)=\"row.important = !row.important\" (mouseover)=\"row.isMouseOver=true\" (mouseout)=\"row.isMouseOver=false\">\r\n            <i *ngIf=\"row.important || row.isMouseOver\" class=\"fa fa-bookmark\"></i>\r\n            <i *ngIf=\"!row.important && !row.isMouseOver\" class=\"fa fa-bookmark-o\"></i>\r\n        </a>\r\n    </ng-template>\r\n\r\n\r\n\r\n\r\n\r\n    <div class=\"modal fade\" bsModal #editorModal=\"bs-modal\" tabindex=\"-1\">\r\n        <div class=\"modal-dialog\">\r\n            <div class=\"modal-content\">\r\n                <div class=\"modal-header\">\r\n                    <h4 class=\"modal-title pull-left\"><i class=\"fa fa-tasks\"></i> {{'todoDemo.editor.NewTask' | translate}}</h4>\r\n                    <button type=\"button\" class=\"close pull-right\" title=\"Close\" (click)=\"editorModal.hide()\">\r\n                        <span aria-hidden=\"true\">&times;</span>\r\n                    </button>\r\n                </div>\r\n                <div class=\"modal-body\">\r\n                    <form *ngIf=\"formResetToggle\" class=\"form-horizontal\" name=\"taskEditorForm\" #f=\"ngForm\" novalidate\r\n                          (ngSubmit)=\"f.form.valid ? save() :\r\n                      (!taskName.valid && showErrorAlert('Task name is required', 'Please enter a name for the task'));\">\r\n\r\n\r\n                        <div class=\"form-group has-feedback\">\r\n                            <label class=\"control-label col-md-2\" for=\"taskName\">{{'todoDemo.editor.Name' | translate}}:</label>\r\n                            <div class=\"col-md-10\" [ngClass]=\"{'has-success': f.submitted && taskName.valid, 'has-error' : f.submitted && !taskName.valid}\">\r\n                                <input autofocus type=\"text\" id=\"taskName\" name=\"taskName\" placeholder=\"Enter task name\" class=\"form-control\" [(ngModel)]=\"taskEdit.name\" #taskName=\"ngModel\" required />\r\n                                <span *ngIf=\"f.submitted\" class=\"glyphicon form-control-feedback\" [ngClass]=\"{'glyphicon-ok ':taskName.valid, 'glyphicon-remove' : !taskName.valid}\"></span>\r\n                                <span *ngIf=\"f.submitted && !taskName.valid\" class=\"errorMessage\">\r\n                                    {{'todoDemo.editor.TaskNameRequired' | translate}}\r\n                                </span>\r\n                            </div>\r\n                        </div>\r\n\r\n                        <div class=\"form-group description-form-group\">\r\n                            <label class=\"control-label col-md-2\" for=\"taskDescription\">{{'todoDemo.editor.Description' | translate}}:</label>\r\n                            <div class=\"col-md-10\">\r\n                                <input type=\"text\" id=\"taskDescription\" name=\"taskDescription\" placeholder=\"Enter task description\" class=\"form-control\" [(ngModel)]=\"taskEdit.description\" />\r\n                            </div>\r\n                        </div>\r\n                        <label class=\"control-label col-md-2\"> </label>\r\n                        <div class=\"col-md-7\">\r\n                            <div class=\"checkbox\">\r\n                                <label>\r\n                                    <input name=\"isImportant\" type=\"checkbox\" [(ngModel)]=\"taskEdit.important\">\r\n                                    {{'todoDemo.editor.Important' | translate}}\r\n                                </label>\r\n                            </div>\r\n                        </div>\r\n\r\n                        <div class=\"col-md-12\">\r\n                            <hr class=\"edit-last-separator-hr\" />\r\n                        </div>\r\n\r\n\r\n                        <div class=\"form-group actionBtn-form-group\">\r\n                            <div class=\"pull-right\">\r\n                                <button type=\"submit\" class=\"btn btn-primary\">{{'todoDemo.editor.AddTask' | translate}}</button>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"clearfix\"></div>\r\n                    </form>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/components/controls/todo-demo.component.ts":
/*!************************************************************!*\
  !*** ./src/app/components/controls/todo-demo.component.ts ***!
  \************************************************************/
/*! exports provided: TodoDemoComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TodoDemoComponent", function() { return TodoDemoComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ngx-bootstrap/modal */ "./node_modules/ngx-bootstrap/modal/index.js");
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/auth.service */ "./src/app/services/auth.service.ts");
/* harmony import */ var _services_alert_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/alert.service */ "./src/app/services/alert.service.ts");
/* harmony import */ var _services_app_translation_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/app-translation.service */ "./src/app/services/app-translation.service.ts");
/* harmony import */ var _services_local_store_manager_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../services/local-store-manager.service */ "./src/app/services/local-store-manager.service.ts");
/* harmony import */ var _services_utilities__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../services/utilities */ "./src/app/services/utilities.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var TodoDemoComponent = /** @class */ (function () {
    function TodoDemoComponent(alertService, translationService, localStorage, authService) {
        this.alertService = alertService;
        this.translationService = translationService;
        this.localStorage = localStorage;
        this.authService = authService;
        this.rows = [];
        this.rowsCache = [];
        this.columns = [];
        this.editing = {};
        this.taskEdit = {};
        this.isDataLoaded = false;
        this.loadingIndicator = true;
        this.formResetToggle = true;
        this._hideCompletedTasks = false;
        this.verticalScrollbar = false;
    }
    TodoDemoComponent_1 = TodoDemoComponent;
    Object.defineProperty(TodoDemoComponent.prototype, "currentUserId", {
        get: function () {
            if (this.authService.currentUser)
                this._currentUserId = this.authService.currentUser.id;
            return this._currentUserId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TodoDemoComponent.prototype, "hideCompletedTasks", {
        get: function () {
            return this._hideCompletedTasks;
        },
        set: function (value) {
            if (value) {
                this.rows = this.rowsCache.filter(function (r) { return !r.completed; });
            }
            else {
                this.rows = this.rowsCache.slice();
            }
            this._hideCompletedTasks = value;
        },
        enumerable: true,
        configurable: true
    });
    TodoDemoComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.loadingIndicator = true;
        this.fetch(function (data) {
            _this.refreshDataIndexes(data);
            _this.rows = data;
            _this.rowsCache = data.slice();
            _this.isDataLoaded = true;
            setTimeout(function () { _this.loadingIndicator = false; }, 1500);
        });
        var gT = function (key) { return _this.translationService.getTranslation(key); };
        this.columns = [
            { prop: "completed", name: '', width: 30, headerTemplate: this.statusHeaderTemplate, cellTemplate: this.statusTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false },
            { prop: 'name', name: gT('todoDemo.management.Task'), cellTemplate: this.nameTemplate, width: 200 },
            { prop: 'description', name: gT('todoDemo.management.Description'), cellTemplate: this.descriptionTemplate, width: 500 },
            { name: '', width: 80, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        ];
    };
    TodoDemoComponent.prototype.ngOnDestroy = function () {
        this.saveToDisk();
    };
    TodoDemoComponent.prototype.fetch = function (cb) {
        var _this = this;
        var data = this.getFromDisk();
        if (data == null) {
            setTimeout(function () {
                data = _this.getFromDisk();
                if (data == null) {
                    data = [
                        {
                            "completed": true,
                            "important": true,
                            "name": "Smile",
                            "description": "Always be pleasant"
                        },
                        {
                            "completed": false,
                            "important": true,
                            "name": "Say Hello",
                            "description": "Always be friendly"
                        },
                        {
                            "completed": false,
                            "important": false,
                            "name": "Work Hard",
                            "description": ""
                        },
                    ];
                }
                cb(data);
            }, 1000);
        }
        else {
            cb(data);
        }
    };
    TodoDemoComponent.prototype.refreshDataIndexes = function (data) {
        var index = 0;
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var i = data_1[_i];
            i.$$index = index++;
        }
    };
    TodoDemoComponent.prototype.onSearchChanged = function (value) {
        this.rows = this.rowsCache.filter(function (r) { return _services_utilities__WEBPACK_IMPORTED_MODULE_6__["Utilities"].searchArray(value, false, r.name, r.description) || value == 'important' && r.important || value == 'not important' && !r.important; });
    };
    TodoDemoComponent.prototype.showErrorAlert = function (caption, message) {
        this.alertService.showMessage(caption, message, _services_alert_service__WEBPACK_IMPORTED_MODULE_3__["MessageSeverity"].error);
    };
    TodoDemoComponent.prototype.addTask = function () {
        var _this = this;
        this.formResetToggle = false;
        setTimeout(function () {
            _this.formResetToggle = true;
            _this.taskEdit = {};
            _this.editorModal.show();
        });
    };
    TodoDemoComponent.prototype.save = function () {
        this.rowsCache.splice(0, 0, this.taskEdit);
        this.rows.splice(0, 0, this.taskEdit);
        this.refreshDataIndexes(this.rowsCache);
        this.rows = this.rows.slice();
        this.saveToDisk();
        this.editorModal.hide();
    };
    TodoDemoComponent.prototype.updateValue = function (event, cell, cellValue, row) {
        this.editing[row.$$index + '-' + cell] = false;
        this.rows[row.$$index][cell] = event.target.value;
        this.rows = this.rows.slice();
        this.saveToDisk();
    };
    TodoDemoComponent.prototype.delete = function (row) {
        var _this = this;
        this.alertService.showDialog('Are you sure you want to delete the task?', _services_alert_service__WEBPACK_IMPORTED_MODULE_3__["DialogType"].confirm, function () { return _this.deleteHelper(row); });
    };
    TodoDemoComponent.prototype.deleteHelper = function (row) {
        this.rowsCache = this.rowsCache.filter(function (item) { return item !== row; });
        this.rows = this.rows.filter(function (item) { return item !== row; });
        this.saveToDisk();
    };
    TodoDemoComponent.prototype.getFromDisk = function () {
        return this.localStorage.getDataObject(TodoDemoComponent_1.DBKeyTodoDemo + ":" + this.currentUserId);
    };
    TodoDemoComponent.prototype.saveToDisk = function () {
        if (this.isDataLoaded)
            this.localStorage.saveSyncedSessionData(this.rowsCache, TodoDemoComponent_1.DBKeyTodoDemo + ":" + this.currentUserId);
    };
    TodoDemoComponent.DBKeyTodoDemo = "todo-demo.todo_list";
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], TodoDemoComponent.prototype, "verticalScrollbar", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('statusHeaderTemplate'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"])
    ], TodoDemoComponent.prototype, "statusHeaderTemplate", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('statusTemplate'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"])
    ], TodoDemoComponent.prototype, "statusTemplate", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('nameTemplate'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"])
    ], TodoDemoComponent.prototype, "nameTemplate", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('descriptionTemplate'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"])
    ], TodoDemoComponent.prototype, "descriptionTemplate", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('actionsTemplate'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"])
    ], TodoDemoComponent.prototype, "actionsTemplate", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('editorModal'),
        __metadata("design:type", ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_1__["ModalDirective"])
    ], TodoDemoComponent.prototype, "editorModal", void 0);
    TodoDemoComponent = TodoDemoComponent_1 = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'todo-demo',
            template: __webpack_require__(/*! ./todo-demo.component.html */ "./src/app/components/controls/todo-demo.component.html"),
            styles: [__webpack_require__(/*! ./todo-demo.component.css */ "./src/app/components/controls/todo-demo.component.css")]
        }),
        __metadata("design:paramtypes", [_services_alert_service__WEBPACK_IMPORTED_MODULE_3__["AlertService"], _services_app_translation_service__WEBPACK_IMPORTED_MODULE_4__["AppTranslationService"], _services_local_store_manager_service__WEBPACK_IMPORTED_MODULE_5__["LocalStoreManager"], _services_auth_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"]])
    ], TodoDemoComponent);
    return TodoDemoComponent;
    var TodoDemoComponent_1;
}());



/***/ }),

/***/ "./src/app/components/controls/user-info.component.css":
/*!*************************************************************!*\
  !*** ./src/app/components/controls/user-info.component.css ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".row:not(:last-child) {\r\n    /*border-bottom: 1px solid #ccc;*/\r\n}\r\n\r\n.separator-hr {\r\n    margin: 0 5px;\r\n    border-top-style: dashed;\r\n}\r\n\r\n.edit-separator-hr {\r\n    margin: 10px 5px;\r\n    border-top-style: dashed;\r\n}\r\n\r\n.last-separator-hr {\r\n    margin-top: 5px;\r\n}\r\n\r\n.edit-last-separator-hr {\r\n    margin-top: 15px;\r\n}\r\n\r\n.password-separator-hr {\r\n    margin: 5px;\r\n    border-style: none;\r\n}\r\n\r\n.form-group {\r\n    margin-top: 0;\r\n    margin-bottom: 0;\r\n}\r\n\r\ninput.form-control {\r\n    border-left-width: 5px;\r\n}\r\n\r\n.password-well {\r\n    margin-bottom: 0;\r\n}\r\n\r\n.hint-sm {\r\n    display: block;\r\n}\r\n\r\n.checkbox.user-enabled {\r\n    display: inline-block;\r\n}\r\n\r\n.unblock-user {\r\n    margin-left: 34px;\r\n}\r\n\r\n@media (min-width: 992px) {\r\n    .user-enabled {\r\n        margin-left: 40px;\r\n    }\r\n}\r\n"

/***/ }),

/***/ "./src/app/components/controls/user-info.component.html":
/*!**************************************************************!*\
  !*** ./src/app/components/controls/user-info.component.html ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div>\r\n  <form *ngIf=\"formResetToggle\" [attr.autocomplete]=\"isGeneralEditor ? NaN : null\" class=\"form-horizontal\" name=\"userInfoForm\" #f=\"ngForm\" novalidate\r\n        (ngSubmit)=\"f.form.valid ? save() :\r\n\r\n          (!userName.valid && showErrorAlert('User name is required', 'Please enter a user name (minimum of 2 and maximum of 200 characters)'));\r\n\r\n          (userPassword && !userPassword.valid && showErrorAlert('Password is required', 'Please enter the current password'));\r\n\r\n          (email.errors?.required && showErrorAlert('Email is required', 'Please enter an email address (maximum of 200 characters)'));\r\n          (email.errors?.pattern && showErrorAlert('Invalid Email', 'Please enter a valid email address'));\r\n\r\n          (isChangePassword && isEditingSelf && !currentPassword.valid && showErrorAlert('Current password is required', 'Please enter the current password'));\r\n\r\n          ((isChangePassword || isNewUser) && !newPassword.valid && showErrorAlert('New password is required', 'Please enter the new password (minimum of 6 characters)'));\r\n\r\n          ((isChangePassword || isNewUser) && newPassword.valid && confirmPassword.errors?.required && showErrorAlert('Confirmation password is required', 'Please enter the confirmation password'));\r\n          ((isChangePassword || isNewUser) && newPassword.valid && confirmPassword.errors?.validateEqual && showErrorAlert('Password mismatch', 'New password and confirmation password do not match'));\r\n\r\n          (canAssignRoles && !roles.valid && showErrorAlert('Roles is required', 'Please select a minimum of 1 role'));\">\r\n    <div class=\"form-group has-feedback\">\r\n      <label [class.col-md-3]=\"isViewOnly\" [class.col-md-2]=\"!isViewOnly\" class=\"control-label\" for=\"userName-{{uniqueId}}\">{{'users.editor.UserName' | translate}}</label>\r\n      <div *ngIf=\"!isEditMode\" [class.col-md-9]=\"isViewOnly\" [class.col-md-10]=\"!isViewOnly\">\r\n        <p class=\"form-control-static\">{{user.userName}}</p>\r\n      </div>\r\n      <div *ngIf=\"isEditMode\" [class.col-md-9]=\"isViewOnly\" [class.col-md-10]=\"!isViewOnly\" [ngClass]=\"{'has-success': f.submitted && userName.valid, 'has-error' : f.submitted && !userName.valid}\">\r\n        <input type=\"text\" attr.id=\"userName-{{uniqueId}}\" name=\"userName\" [attr.autocomplete]=\"isGeneralEditor ? new-password : null\" placeholder=\"Enter user name\"\r\n               class=\"form-control\" [(ngModel)]=\"userEdit.userName\" #userName=\"ngModel\" required minlength=\"2\" maxlength=\"200\" />\r\n        <span *ngIf=\"showValidationErrors && f.submitted\" class=\"glyphicon form-control-feedback\" [ngClass]=\"{'glyphicon-ok ': userName.valid, 'glyphicon-remove' : !userName.valid}\"></span>\r\n        <span *ngIf=\"showValidationErrors && f.submitted && !userName.valid\" class=\"errorMessage\">\r\n          {{'users.editor.UserNameRequired' | translate}}\r\n        </span>\r\n      </div>\r\n    </div>\r\n    <div *ngIf=\"isEditMode && isEditingSelf && !isChangePassword && user.userName != userEdit.userName\" class=\"row\">\r\n      <div class=\"col-md-12\">\r\n        <hr class=\"password-separator-hr\" />\r\n      </div>\r\n    </div>\r\n    <div *ngIf=\"isEditMode && isEditingSelf && !isChangePassword && user.userName != userEdit.userName\" class=\"form-group has-feedback\">\r\n      <label class=\"control-label col-md-2\" for=\"userPassword-{{uniqueId}}\">{{'users.editor.Password' | translate}}</label>\r\n      <div class=\"col-md-10\" [ngClass]=\"{'has-success': f.submitted && userPassword.valid, 'has-error' : f.submitted && !userPassword.valid}\">\r\n        <input type=\"password\"\r\n               attr.id=\"userPassword-{{uniqueId}}\"\r\n               name=\"userPassword\"\r\n               [attr.autocomplete]=\"isGeneralEditor ? new-password : null\"\r\n               placeholder=\"Enter password\"\r\n               class=\"form-control\"\r\n               #userPassword=\"ngModel\"\r\n               [(ngModel)]=\"userEdit.currentPassword\"\r\n               required />\r\n        <small class=\"hint-sm\">{{'users.editor.PasswordHint' | translate}}</small>\r\n        <span *ngIf=\"showValidationErrors && f.submitted\" class=\"glyphicon form-control-feedback\" [ngClass]=\"{'glyphicon-ok ': userPassword.valid, 'glyphicon-remove' : !userPassword.valid}\"></span>\r\n        <span class=\"errorMessage\" *ngIf=\"showValidationErrors && f.submitted && !userPassword.valid\">\r\n          {{'users.editor.CurrentPasswordRequired' | translate}}\r\n        </span>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"row\">\r\n      <div class=\"col-md-12\">\r\n        <hr [class.separator-hr]=\"!isEditMode\" [class.edit-separator-hr]=\"isEditMode\" />\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group has-feedback\">\r\n      <label [class.col-md-3]=\"isViewOnly\" [class.col-md-2]=\"!isViewOnly\" class=\"control-label\" for=\"email-{{uniqueId}}\">{{'users.editor.Email' | translate}}</label>\r\n      <div *ngIf=\"!isEditMode\" [class.col-md-9]=\"isViewOnly\" [class.col-md-10]=\"!isViewOnly\">\r\n        <p class=\"form-control-static\">{{user.email}}</p>\r\n      </div>\r\n      <div *ngIf=\"isEditMode\" [class.col-md-9]=\"isViewOnly\" [class.col-md-10]=\"!isViewOnly\" [ngClass]=\"{'has-success': f.submitted && email.valid, 'has-error' : f.submitted && !email.valid}\">\r\n        <input type=\"text\" attr.id=\"email-{{uniqueId}}\" name=\"email\" placeholder=\"Enter email address\" class=\"form-control\" [(ngModel)]=\"userEdit.email\" #email=\"ngModel\"\r\n               required\r\n               minlength=\"8\"\r\n               maxlength=\"200\"\r\n               pattern=\"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$\" />\r\n        <span *ngIf=\"showValidationErrors && f.submitted\" class=\"glyphicon form-control-feedback\" [ngClass]=\"{'glyphicon-ok ': email.valid, 'glyphicon-remove' : !email.valid}\"></span>\r\n        <span *ngIf=\"showValidationErrors && f.submitted && email.errors?.required\" class=\"errorMessage\">\r\n          {{'users.editor.EmailRequired' | translate}}\r\n        </span>\r\n        <span *ngIf=\"showValidationErrors && f.submitted && email.errors?.pattern\" class=\"errorMessage\">\r\n          {{'users.editor.InvalidEmail' | translate}}\r\n        </span>\r\n      </div>\r\n    </div>\r\n    <div *ngIf=\"isEditMode\" class=\"row\">\r\n      <div class=\"col-md-12\">\r\n        <hr [class.separator-hr]=\"!isEditMode\" [class.edit-separator-hr]=\"isEditMode\" />\r\n      </div>\r\n    </div>\r\n    <div *ngIf=\"isEditMode\" class=\"form-group\">\r\n      <label for=\"newPassword-{{uniqueId}}\" class=\"control-label col-md-2\">{{'users.editor.Password' | translate}}</label>\r\n      <div *ngIf=\"!isChangePassword && !isNewUser\" class=\"col-md-10\">\r\n        <button type=\"button\" (click)=\"changePassword()\" class=\"btn btn-link\">{{'users.editor.ChangePassword' | translate}}</button>\r\n      </div>\r\n      <div *ngIf=\"isChangePassword || isNewUser\" class=\"col-md-10\">\r\n        <div class=\"password-well well well-sm\">\r\n          <div *ngIf=\"isEditingSelf\" class=\"form-group has-feedback\">\r\n            <label class=\"control-label col-md-3\" for=\"currentPassword-{{uniqueId}}\">{{'users.editor.CurrentPassword' | translate}}</label>\r\n            <div class=\"col-md-9\" [ngClass]=\"{'has-success': f.submitted && currentPassword.valid, 'has-error' : f.submitted && !currentPassword.valid}\">\r\n              <input type=\"password\"\r\n                     attr.id=\"currentPassword-{{uniqueId}}\"\r\n                     name=\"currentPassword\"\r\n                     [attr.autocomplete]=\"isGeneralEditor ? new-password : null\"\r\n                     placeholder=\"Enter current password\"\r\n                     class=\"form-control\"\r\n                     [(ngModel)]=\"userEdit.currentPassword\"\r\n                     #currentPassword=\"ngModel\"\r\n                     required\r\n                     minlength=\"8\"\r\n                     pattern=\"^(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=\\D*\\d)(?=[a-zA-Z0-9]*[^a-zA-Z0-9]).+\"\r\n                     />\r\n              <span *ngIf=\"showValidationErrors && f.submitted\" class=\"glyphicon form-control-feedback\" [ngClass]=\"{'glyphicon-ok ': currentPassword.valid, 'glyphicon-remove' : !currentPassword.valid}\"></span>\r\n              <span class=\"errorMessage\" [hidden]=\"!(currentPassword.dirty && currentPassword.errors?.required)\">\r\n                {{'users.editor.CurrentPasswordRequired' | translate}}\r\n                <br />\r\n              </span>\r\n              <span class=\"errorMessage\" [hidden]=\"!(currentPassword.dirty && currentPassword.errors?.minlength)\">\r\n                {{ 'Password must be at least 8 characters' | translate }}\r\n                <br />\r\n              </span>\r\n              <span class=\"errorMessage\" [hidden]=\"!(currentPassword.dirty && !currentPassword.errors?.minlength && currentPassword.errors?.pattern)\">\r\n                {{ 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special charater' | translate }}\r\n                <br />\r\n              </span>\r\n            </div>\r\n          </div>\r\n          <div *ngIf=\"!isNewUser\" class=\"row\">\r\n            <div class=\"col-md-12\">\r\n              <hr class=\"password-separator-hr\" />\r\n            </div>\r\n          </div>\r\n          <div class=\"form-group has-feedback\">\r\n            <label class=\"control-label col-md-3\" for=\"newPassword-{{uniqueId}}\">{{'users.editor.NewPassword' | translate}}</label>\r\n            <div class=\"col-md-9\" [ngClass]=\"{'has-success': f.submitted && newPassword.valid, 'has-error' : f.submitted && !newPassword.valid}\">\r\n              <input type=\"password\"\r\n                     attr.id=\"newPassword-{{uniqueId}}\"\r\n                     name=\"newPassword\"\r\n                     [attr.autocomplete]=\"isGeneralEditor ? new-password : null\"\r\n                     placeholder=\"Enter new password\"\r\n                     class=\"form-control\"\r\n                     [(ngModel)]=\"userEdit.newPassword\"\r\n                     #newPassword=\"ngModel\"\r\n                     required\r\n                     minlength=\"8\"\r\n                     pattern=\"^(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=\\D*\\d)(?=[a-zA-Z0-9]*[^a-zA-Z0-9]).+\"\r\n                     validateEqual=\"confirmPassword\" reverse=\"true\"\r\n                     />\r\n              <span *ngIf=\"showValidationErrors && f.submitted\" class=\"glyphicon form-control-feedback\" [ngClass]=\"{'glyphicon-ok ': newPassword.valid, 'glyphicon-remove' : !newPassword.valid}\"></span>\r\n              <span class=\"errorMessage\" [hidden]=\"!(newPassword.dirty && newPassword.errors?.required)\">\r\n                {{'users.editor.NewPasswordRequired' | translate}}\r\n                <br />\r\n              </span>\r\n              <span class=\"errorMessage\" [hidden]=\"!(newPassword.dirty && newPassword.errors?.minlength)\">\r\n                {{ 'Password must be at least 8 characters' | translate }}\r\n                <br />\r\n              </span>\r\n              <span class=\"errorMessage\" [hidden]=\"!(newPassword.dirty && !newPassword.errors?.minlength && newPassword.errors?.pattern)\">\r\n                {{ 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special charater' | translate }}\r\n                <br />\r\n              </span>\r\n              <span class=\"errorMessage\" [hidden]=\"!(newPassword.dirty && confirmPassword.dirty) || !(newPassword.dirty && newPassword.errors?.validateEqual)\">\r\n                {{ 'Password does not match confirmation' | translate }}\r\n              </span>\r\n            </div>\r\n          </div>\r\n          <div class=\"row\">\r\n            <div class=\"col-md-12\">\r\n              <hr class=\"password-separator-hr\" />\r\n            </div>\r\n          </div>\r\n          <div class=\"form-group has-feedback\">\r\n            <label class=\"control-label col-md-3\" for=\"confirmPassword-{{uniqueId}}\">{{'users.editor.ConfirmPassword' | translate}}</label>\r\n            <div class=\"col-md-9\" [ngClass]=\"{ 'has-error' : (newPassword.dirty || confirmPassword.dirty) && (newPassword.valid && !confirmPassword.valid) }\">\r\n              <input type=\"password\"\r\n                     attr.id=\"confirmPassword-{{uniqueId}}\"\r\n                     name=\"confirmPassword\"\r\n                     [attr.autocomplete]=\"isGeneralEditor ? new-password : null\"\r\n                     placeholder=\"Confirm new password\"\r\n                     class=\"form-control\"\r\n                     [(ngModel)]=\"userEdit.confirmPassword\"\r\n                     #confirmPassword=\"ngModel\"\r\n                     required\r\n                     validateEqual=\"newPassword\" />\r\n              <span *ngIf=\"showValidationErrors && f.submitted\" class=\"glyphicon form-control-feedback\" [ngClass]=\"{'glyphicon-ok ': confirmPassword.valid, 'glyphicon-remove' : !confirmPassword.valid}\"></span>\r\n              <span class=\"errorMessage\" [hidden]=\"!(newPassword.dirty && confirmPassword.dirty) || !(confirmPassword.dirty && confirmPassword.errors?.validateEqual)\">\r\n                {{ 'users.editor.ConfirmationPasswordRequired' | translate }}\r\n              </span>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <!--******************************************************************************************************-->\r\n    <div *ngIf=\"!isEditMode || canAssignRoles\" class=\"row\">\r\n      <div class=\"col-md-12\">\r\n        <hr [class.separator-hr]=\"!isEditMode\" [class.edit-separator-hr]=\"isEditMode\" />\r\n      </div>\r\n    </div>\r\n    <div *ngIf=\"!isEditMode || canAssignRoles\" class=\"form-group has-feedback\">\r\n      <label [class.col-md-3]=\"isViewOnly\" [class.col-md-2]=\"!isViewOnly\" class=\"control-label\" for=\"roles-user-info\">{{'users.editor.Roles' | translate}}</label>\r\n      <div *ngIf=\"!isEditMode\" [class.col-md-9]=\"isViewOnly\" [class.col-md-10]=\"!isViewOnly\">\r\n        <p ngPreserveWhitespaces class=\"form-control-static\">\r\n          <span *ngFor=\"let role of user.roles\">\r\n            <span title='{{getRoleByName(role)?.description}}' class=\"badge\">{{role}}</span>\r\n          </span>\r\n        </p>\r\n      </div>\r\n      <div *ngIf=\"isEditMode && canAssignRoles\" [class.col-md-9]=\"isViewOnly\" [class.col-md-10]=\"!isViewOnly\" [ngClass]=\"{'has-success': f.submitted && roles.valid, 'has-error' : f.submitted && !roles.valid}\">\r\n        <select id=\"roles-user-info\" name=\"roles\" [(ngModel)]=\"userEdit.roles\" #roles=\"ngModel\" #rolesSelector=\"bootstrap-select\" class=\"selectpicker form-control\" bootstrapSelect required multiple\r\n                data-live-search=\"true\" data-actions-box=\"false\" data-live-search-placeholder=\"Search...\" title=\"Select Roles\">\r\n          <option *ngFor=\"let role of allRoles\" attr.data-content=\"<span title='{{role.description}}' class='badge'>{{role.name}}</span>\" attr.value=\"{{role.name}}\">\r\n            {{role.name}}\r\n          </option>\r\n        </select>\r\n        <span *ngIf=\"showValidationErrors && f.submitted\" class=\"glyphicon form-control-feedback\" [ngClass]=\"{'glyphicon-ok ': roles.valid, 'glyphicon-remove' : !roles.valid}\"></span>\r\n        <span *ngIf=\"showValidationErrors && f.submitted && !roles.valid\" class=\"errorMessage\">\r\n          {{'users.editor.RoleRequired' | translate}}\r\n        </span>\r\n      </div>\r\n    </div>\r\n    <!--******************************************************************************************************-->\r\n    <div class=\"row\">\r\n      <div class=\"col-md-12\">\r\n        <hr [class.separator-hr]=\"!isEditMode\" [class.edit-separator-hr]=\"isEditMode\" />\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group\">\r\n      <label [class.col-md-3]=\"isViewOnly\" [class.col-md-2]=\"!isViewOnly\" class=\"control-label\" for=\"phoneNumber-{{uniqueId}}\">{{'users.editor.PhoneNumber' | translate}}</label>\r\n      <div *ngIf=\"!isEditMode\" [class.col-md-9]=\"isViewOnly\" [class.col-md-10]=\"!isViewOnly\">\r\n        <p class=\"form-control-static\">{{user.phoneNumber}}</p>\r\n      </div>\r\n      <div *ngIf=\"isEditMode\" [class.col-md-9]=\"isViewOnly\" [class.col-md-10]=\"!isViewOnly\">\r\n        <input type=\"text\" attr.id=\"phoneNumber-{{uniqueId}}\" name=\"phoneNumber\" placeholder=\"Enter phone number\" class=\"form-control\" [(ngModel)]=\"userEdit.phoneNumber\" />\r\n      </div>\r\n    </div>\r\n    <!--******************************************************************************************************-->\r\n    <div class=\"row\">\r\n      <div class=\"col-md-12\">\r\n        <hr [class.separator-hr]=\"!isEditMode\" [class.edit-separator-hr]=\"isEditMode\" />\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group has-feedback\">\r\n      <label [class.col-md-3]=\"isViewOnly\" [class.col-md-2]=\"!isViewOnly\" class=\"control-label\" for=\"question01\">{{'users.editor.Question01' | translate}}:</label>\r\n      <div *ngIf=\"!isEditMode\" [class.col-md-9]=\"isViewOnly\" [class.col-md-10]=\"!isViewOnly\">\r\n        <p class=\"form-control-static\">{{getQuestionText(user.question01)}}</p>\r\n      </div>\r\n      <div *ngIf=\"isEditMode\" [class.col-md-9]=\"isViewOnly\" [class.col-md-10]=\"!isViewOnly\" [ngClass]=\"{'has-success': !(question01.dirty && (!question01.valid || question01.errors || question01.selectedIndex == 0)), 'has-error' : (question01.dirty && (!question01.valid || question01.errors || question01.selectedIndex == 0))}\">\r\n        <select id=\"question01\" name=\"question01\" #question01=\"ngModel\" [(ngModel)]=\"userEdit.question01\" class=\"form-control\" required>\r\n          <option *ngFor=\"let s of securityQuestions01\" [ngValue]=\"s.referenceEnglishId\" [selected]=\"question01 == s.referenceEnglishId\">{{ s.question | translate }}</option>\r\n        </select>\r\n        <span *ngIf=\"showValidationErrors && f.submitted\" class=\"glyphicon form-control-feedback\" [ngClass]=\"{'glyphicon-ok ': !(question01.dirty && (!question01.valid || question01.errors || question01.selectedIndex == 0)), 'glyphicon-remove' : (question01.dirty && (!question01.valid || question01.errors || question01.selectedIndex == 0))}\"></span>\r\n        <span *ngIf=\"showValidationErrors && (question01.dirty && (!question01.valid || question01.errors || question01.selectedIndex == 0))\" class=\"errorMessage\">\r\n          {{'Question is required' | translate}}\r\n        </span>\r\n      </div>\r\n    </div>\r\n    <!--******************************************************************************************************-->\r\n    <div class=\"row\">\r\n      <div class=\"col-md-12\">\r\n        <hr [class.separator-hr]=\"!isEditMode\" [class.edit-separator-hr]=\"isEditMode\" />\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group has-feedback\">\r\n      <label [class.col-md-3]=\"isViewOnly\" [class.col-md-2]=\"!isViewOnly\" class=\"control-label\" for=\"answer01\">{{'users.editor.Answer01' | translate}}:</label>\r\n      <div *ngIf=\"!isEditMode\" [class.col-md-9]=\"isViewOnly\" [class.col-md-10]=\"!isViewOnly\">\r\n        <p class=\"form-control-static\">{{user.answer01}}</p>\r\n      </div>\r\n      <div *ngIf=\"isEditMode\" [class.col-md-9]=\"isViewOnly\" [class.col-md-10]=\"!isViewOnly\">\r\n        <input type=\"text\" id=\"answer01\" name=\"answer01\" placeholder=\"Enter Answer to Q1\" class=\"form-control\" #answer01=\"ngModel\" [(ngModel)]=\"userEdit.answer01\" />\r\n        <span *ngIf=\"showValidationErrors && ((answer01.dirty || false) && (!answer01.valid || answer01.errors))\" class=\"errorMessage\">\r\n          {{'Answer is required' | translate}}\r\n        </span>\r\n      </div>\r\n    </div>\r\n    <div *ngIf=\"!isViewOnly\" class=\"row\">\r\n      <div class=\"col-md-12\">\r\n        <hr [class.last-separator-hr]=\"!isEditMode\" [class.edit-last-separator-hr]=\"isEditMode\" />\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group has-feedback\">\r\n      <label [class.col-md-3]=\"isViewOnly\" [class.col-md-2]=\"!isViewOnly\" class=\"control-label\" for=\"question02\">{{'users.editor.Question02' | translate}}:</label>\r\n      <div *ngIf=\"!isEditMode\" [class.col-md-9]=\"isViewOnly\" [class.col-md-10]=\"!isViewOnly\">\r\n        <p class=\"form-control-static\">{{getQuestionText(user.question02)}}</p>\r\n      </div>\r\n      <div *ngIf=\"isEditMode\" [class.col-md-9]=\"isViewOnly\" [class.col-md-10]=\"!isViewOnly\" [ngClass]=\"{'has-success': !(question02.dirty && (!question02.valid || question02.errors || question02.selectedIndex == 0)), 'has-error' : (question02.dirty && (!question02.valid || question02.errors || question02.selectedIndex == 0))}\">\r\n        <select id=\"question02\" name=\"question02\" #question02=\"ngModel\" [(ngModel)]=\"userEdit.question02\" class=\"form-control\" required>\r\n          <option *ngFor=\"let s of securityQuestions02\" [ngValue]=\"s.referenceEnglishId\" [selected]=\"question02 == s.referenceEnglishId\">{{ s.question | translate }}</option>\r\n        </select>\r\n        <span *ngIf=\"showValidationErrors && f.submitted\" class=\"glyphicon form-control-feedback\" [ngClass]=\"{'glyphicon-ok ': !(question02.dirty && (!question02.valid || question02.errors || question02.selectedIndex == 0)), 'glyphicon-remove' : (question02.dirty && (!question02.valid || question02.errors || question02.selectedIndex == 0))}\"></span>\r\n        <span *ngIf=\"showValidationErrors && (question02.dirty && (!question02.valid || question02.errors || question02.selectedIndex == 0))\" class=\"errorMessage\">\r\n          {{'Question is required' | translate}}\r\n        </span>\r\n      </div>\r\n    </div>\r\n    <!--******************************************************************************************************-->\r\n    <div class=\"row\">\r\n      <div class=\"col-md-12\">\r\n        <hr [class.separator-hr]=\"!isEditMode\" [class.edit-separator-hr]=\"isEditMode\" />\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group has-feedback\">\r\n      <label [class.col-md-3]=\"isViewOnly\" [class.col-md-2]=\"!isViewOnly\" class=\"control-label\" for=\"answer02\">{{'users.editor.Answer02' | translate}}:</label>\r\n      <div *ngIf=\"!isEditMode\" [class.col-md-9]=\"isViewOnly\" [class.col-md-10]=\"!isViewOnly\">\r\n        <p class=\"form-control-static\">{{user.answer02}}</p>\r\n      </div>\r\n      <div *ngIf=\"isEditMode\" [class.col-md-9]=\"isViewOnly\" [class.col-md-10]=\"!isViewOnly\">\r\n        <input type=\"text\" id=\"answer02\" name=\"answer02\" placeholder=\"Enter Answer to Q2\" class=\"form-control\" #answer02=\"ngModel\" [(ngModel)]=\"userEdit.answer02\" />\r\n        <span *ngIf=\"showValidationErrors && ((answer02.dirty || false) && (!answer02.valid || answer02.errors))\" class=\"errorMessage\">\r\n          {{'Answer is required' | translate}}\r\n        </span>\r\n      </div>\r\n    </div>\r\n    <!--******************************************************************************************************-->\r\n    <div class=\"row\">\r\n      <div class=\"col-md-12\">\r\n        <hr [class.separator-hr]=\"!isEditMode\" [class.edit-separator-hr]=\"isEditMode\" />\r\n      </div>\r\n    </div>\r\n    <div *ngIf=\"!isViewOnly\" class=\"form-group\">\r\n      <div class=\"col-sm-5\">\r\n        <div *ngIf=\"isGeneralEditor && isEditMode\" class=\"pull-left\">\r\n          <div class=\"checkbox user-enabled\">\r\n            <label>\r\n              <input type=\"checkbox\" name=\"isEnabled\" [(ngModel)]=\"userEdit.isEnabled\">\r\n              {{'users.editor.Enabled' | translate}}\r\n            </label>\r\n          </div>\r\n          <button *ngIf=\"userEdit.isLockedOut\" type=\"button\" (click)=\"unlockUser()\" class=\"btn btn-warning unblock-user\" [disabled]=\"isSaving\"><i class='fa fa-unlock-alt'></i> {{'users.editor.Unblock' | translate}}</button>\r\n        </div>\r\n      </div>\r\n      <div class=\"col-sm-7\">\r\n        <div ngPreserveWhitespaces class=\"pull-right\">\r\n          <button *ngIf=\"!isEditMode && isGeneralEditor\" type=\"button\" (click)=\"close()\" class=\"btn btn-default\"><i class='fa fa-close'></i> {{'users.editor.Close' | translate}}</button>\r\n          <button *ngIf=\"!isEditMode && !isGeneralEditor\" type=\"button\" (click)=\"edit()\" class=\"btn btn-default\"><i class='fa fa-edit'></i> {{'users.editor.Edit' | translate}}</button>\r\n          <button *ngIf=\"isEditMode\" type=\"button\" (click)=\"cancel()\" class=\"btn btn-danger\" [disabled]=\"isSaving\"><i class='fa fa-times'></i> {{'users.editor.Cancel' | translate}}</button>\r\n          <button *ngIf=\"isEditMode\" type=\"submit\" class=\"btn btn-primary\" [disabled]=\"isSaving\">\r\n            <i *ngIf=\"!isSaving\" class='fa fa-save'></i>\r\n            <i *ngIf=\"isSaving\" class='fa fa-circle-o-notch fa-spin'></i> {{isSaving ? ('users.editor.Saving' | translate) : ('users.editor.Save' | translate)}}\r\n          </button>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"clearfix\"></div>\r\n  </form>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/components/controls/user-info.component.ts":
/*!************************************************************!*\
  !*** ./src/app/components/controls/user-info.component.ts ***!
  \************************************************************/
/*! exports provided: UserInfoComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserInfoComponent", function() { return UserInfoComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_alert_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/alert.service */ "./src/app/services/alert.service.ts");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var _services_utilities__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/utilities */ "./src/app/services/utilities.ts");
/* harmony import */ var _models_user_model__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../models/user.model */ "./src/app/models/user.model.ts");
/* harmony import */ var _models_user_edit_model__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../models/user-edit.model */ "./src/app/models/user-edit.model.ts");
/* harmony import */ var _models_role_model__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../models/role.model */ "./src/app/models/role.model.ts");
/* harmony import */ var _models_permission_model__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../models/permission.model */ "./src/app/models/permission.model.ts");
/* harmony import */ var _services_local_store_manager_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../services/local-store-manager.service */ "./src/app/services/local-store-manager.service.ts");
/* harmony import */ var _services_db_Keys__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../services/db-Keys */ "./src/app/services/db-Keys.ts");
/* harmony import */ var _services_language_observable_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../services/language-observable.service */ "./src/app/services/language-observable.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











var UserInfoComponent = /** @class */ (function () {
    function UserInfoComponent(alertService, accountService, localStorage, userInfoService) {
        this.alertService = alertService;
        this.accountService = accountService;
        this.localStorage = localStorage;
        this.userInfoService = userInfoService;
        this.isEditMode = false;
        this.isNewUser = false;
        this.isSaving = false;
        this.isChangePassword = false;
        this.isEditingSelf = false;
        this.showValidationErrors = false;
        this.uniqueId = _services_utilities__WEBPACK_IMPORTED_MODULE_3__["Utilities"].uniqueId();
        this.user = new _models_user_model__WEBPACK_IMPORTED_MODULE_4__["User"]();
        this.userEdit = new _models_user_edit_model__WEBPACK_IMPORTED_MODULE_5__["UserEdit"]();
        this.allRoles = [];
        this.isEditingEmailAddress = false;
        this.formResetToggle = true;
        this.isGeneralEditor = false;
    }
    UserInfoComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.questions = [];
        this.securityQuestions01 = [];
        this.securityQuestions02 = [];
        if (this.localStorage.exists(_services_db_Keys__WEBPACK_IMPORTED_MODULE_9__["DBkeys"].LANGUAGE)) {
            this.selectedLanguage = this.localStorage.getDataObject(_services_db_Keys__WEBPACK_IMPORTED_MODULE_9__["DBkeys"].LANGUAGE);
        }
        else {
            this.selectedLanguage = "en";
        }
        this.accountService.getQuestions(this.selectedLanguage).subscribe(function (a) { return a.forEach(function (x) {
            _this.questions.push(x);
            _this.securityQuestions01.push(x);
            _this.securityQuestions02.push(x);
        }); });
        if (!this.isGeneralEditor) {
            this.loadCurrentUserData();
        }
        this.userInfoService.languageStream$.subscribe(function (lang) {
            if (_this.selectedLanguage != lang) {
                _this.selectedLanguage = lang;
                _this.getQuestions(lang);
            }
        });
    };
    UserInfoComponent.prototype.getQuestions = function (language) {
        var _this = this;
        this.questions = [];
        this.securityQuestions01 = [];
        this.securityQuestions02 = [];
        this.accountService.getQuestions(language).subscribe(function (a) {
            if (a && a.length > 0) {
                _this.questions = a;
                _this.securityQuestions01 = a;
                _this.securityQuestions02 = a;
            }
        });
    };
    UserInfoComponent.prototype.loadCurrentUserData = function () {
        var _this = this;
        this.alertService.startLoadingMessage();
        if (this.canViewAllRoles) {
            this.accountService.getUserAndRoles().subscribe(function (results) { return _this.onCurrentUserDataLoadSuccessful(results[0], results[1]); }, function (error) { return _this.onCurrentUserDataLoadFailed(error); });
        }
        else {
            this.accountService.getUser().subscribe(function (user) { return _this.onCurrentUserDataLoadSuccessful(user, user.roles.map(function (x) { return new _models_role_model__WEBPACK_IMPORTED_MODULE_6__["Role"](x); })); }, function (error) { return _this.onCurrentUserDataLoadFailed(error); });
        }
    };
    UserInfoComponent.prototype.onCurrentUserDataLoadSuccessful = function (user, roles) {
        this.alertService.stopLoadingMessage();
        this.user = user;
        this.allRoles = roles;
    };
    UserInfoComponent.prototype.onCurrentUserDataLoadFailed = function (error) {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Load Error", "Unable to retrieve user data from the server.\r\nErrors: \"" + _services_utilities__WEBPACK_IMPORTED_MODULE_3__["Utilities"].getHttpResponseMessage(error) + "\"", _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["MessageSeverity"].error, error);
        this.user = new _models_user_model__WEBPACK_IMPORTED_MODULE_4__["User"]();
    };
    UserInfoComponent.prototype.getQuestionText = function (id) {
        var question = this.questions.find(function (q) { return q.referenceEnglishId == id; });
        return (question) ? question.question : '';
    };
    UserInfoComponent.prototype.getRoleByName = function (name) {
        return this.allRoles.find(function (r) { return r.name == name; });
    };
    UserInfoComponent.prototype.showErrorAlert = function (caption, message) {
        this.alertService.showMessage(caption, message, _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["MessageSeverity"].error);
    };
    UserInfoComponent.prototype.deletePasswordFromUser = function (user) {
        var userEdit = user;
        delete userEdit.currentPassword;
        delete userEdit.newPassword;
        delete userEdit.confirmPassword;
    };
    UserInfoComponent.prototype.edit = function () {
        Object.assign(this.userEdit, this.user);
        this.isEditingSelf = this.accountService.currentUser ? this.user.id == this.accountService.currentUser.id : false;
        this.isEditMode = true;
        this.showValidationErrors = true;
        this.isChangePassword = false;
    };
    UserInfoComponent.prototype.save = function () {
        var _this = this;
        this.isSaving = true;
        this.alertService.startLoadingMessage("Saving changes...");
        if (this.user.email != this.userEdit.email) {
            this.isEditingEmailAddress = true;
        }
        if (this.isNewUser) {
            this.accountService.newUser(this.userEdit)
                .subscribe(function (response) { return _this.saveSuccessHelper(response); }, function (error) { return _this.saveFailedHelper(error); });
        }
        else {
            this.accountService.updateUser(this.userEdit, this.isEditingSelf)
                .subscribe(function (response) { return _this.saveSuccessHelper(response); }, function (error) { return _this.saveFailedHelper(error); });
        }
    };
    UserInfoComponent.prototype.saveSuccessHelper = function (user) {
        this.testIsRoleUserCountChanged(this.user, this.userEdit);
        if (user)
            Object.assign(this.userEdit, user);
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.isChangePassword = false;
        this.showValidationErrors = false;
        this.deletePasswordFromUser(this.userEdit);
        Object.assign(this.user, this.userEdit);
        this.userEdit = new _models_user_edit_model__WEBPACK_IMPORTED_MODULE_5__["UserEdit"]();
        this.resetForm();
        if (this.isGeneralEditor) {
            if (this.isNewUser)
                this.alertService.showMessage("Success", "User \"" + this.user.userName + "\" was created successfully", _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["MessageSeverity"].success);
            else if (!this.isEditingSelf)
                this.alertService.showMessage("Success", "Changes to user \"" + this.user.userName + "\" was saved successfully", _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["MessageSeverity"].success);
        }
        if (this.isEditingSelf) {
            this.alertService.showMessage("Success", "Changes to your User Profile was saved successfully", _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["MessageSeverity"].success);
            if (this.isEditingEmailAddress) {
                this.alertService.showMessage("Username", "The email address to access your account has been updated", _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["MessageSeverity"].success);
            }
            this.refreshLoggedInUser();
        }
        this.isEditMode = false;
        this.isEditingEmailAddress = false;
        if (this.changesSavedCallback)
            this.changesSavedCallback();
    };
    UserInfoComponent.prototype.saveFailedHelper = function (error) {
        this.isSaving = false;
        this.isChangePassword = false;
        this.isEditingEmailAddress = false;
        this.showValidationErrors = true;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occurred whilst saving your changes:", _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["MessageSeverity"].error, error);
        this.alertService.showStickyMessage(error, null, _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["MessageSeverity"].error);
        this.resetForm();
        if (this.changesFailedCallback)
            this.changesFailedCallback();
    };
    UserInfoComponent.prototype.testIsRoleUserCountChanged = function (currentUser, editedUser) {
        var _this = this;
        var rolesAdded = this.isNewUser ? editedUser.roles : editedUser.roles.filter(function (role) { return currentUser.roles.indexOf(role) == -1; });
        var rolesRemoved = this.isNewUser ? [] : currentUser.roles.filter(function (role) { return editedUser.roles.indexOf(role) == -1; });
        var modifiedRoles = rolesAdded.concat(rolesRemoved);
        if (modifiedRoles.length)
            setTimeout(function () { return _this.accountService.onRolesUserCountChanged(modifiedRoles); });
    };
    UserInfoComponent.prototype.cancel = function () {
        if (this.isGeneralEditor)
            this.userEdit = this.user = new _models_user_edit_model__WEBPACK_IMPORTED_MODULE_5__["UserEdit"]();
        else
            this.userEdit = new _models_user_edit_model__WEBPACK_IMPORTED_MODULE_5__["UserEdit"]();
        this.showValidationErrors = false;
        this.resetForm();
        this.alertService.showMessage("Cancelled", "Operation cancelled by user", _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["MessageSeverity"].default);
        this.alertService.resetStickyMessage();
        if (!this.isGeneralEditor)
            this.isEditMode = false;
        if (this.changesCancelledCallback)
            this.changesCancelledCallback();
    };
    UserInfoComponent.prototype.close = function () {
        this.userEdit = this.user = new _models_user_edit_model__WEBPACK_IMPORTED_MODULE_5__["UserEdit"]();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;
        if (this.changesSavedCallback)
            this.changesSavedCallback();
    };
    UserInfoComponent.prototype.refreshLoggedInUser = function () {
        var _this = this;
        this.accountService.refreshLoggedInUser()
            .subscribe(function (user) {
            _this.loadCurrentUserData();
        }, function (error) {
            _this.alertService.resetStickyMessage();
            _this.alertService.showStickyMessage("Refresh failed", "An error occurred whilst refreshing logged in user information from the server", _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["MessageSeverity"].error, error);
        });
    };
    UserInfoComponent.prototype.changePassword = function () {
        this.isChangePassword = true;
    };
    UserInfoComponent.prototype.unlockUser = function () {
        var _this = this;
        this.isSaving = true;
        this.alertService.startLoadingMessage("Enabling User...");
        this.accountService.unblockUser(this.userEdit.id)
            .subscribe(function (response) {
            _this.isSaving = false;
            _this.userEdit.isLockedOut = false;
            _this.alertService.stopLoadingMessage();
            _this.alertService.showMessage("Success", "User has been successfully enabled", _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["MessageSeverity"].success);
        }, function (error) {
            _this.isSaving = false;
            _this.alertService.stopLoadingMessage();
            _this.alertService.showStickyMessage("Enable User Error", "The below errors occurred while enabling the user:", _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["MessageSeverity"].error, error);
            _this.alertService.showStickyMessage(error, null, _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["MessageSeverity"].error);
        });
    };
    UserInfoComponent.prototype.resetForm = function (replace) {
        var _this = this;
        if (replace === void 0) { replace = false; }
        this.isChangePassword = false;
        if (!replace) {
            this.form.reset();
        }
        else {
            this.formResetToggle = false;
            setTimeout(function () {
                _this.formResetToggle = true;
            });
        }
    };
    UserInfoComponent.prototype.newUser = function (allRoles) {
        this.isGeneralEditor = true;
        this.isNewUser = true;
        this.allRoles = allRoles.slice();
        this.editingUserName = null;
        this.user = this.userEdit = new _models_user_edit_model__WEBPACK_IMPORTED_MODULE_5__["UserEdit"]();
        this.userEdit.isEnabled = true;
        this.edit();
        return this.userEdit;
    };
    UserInfoComponent.prototype.editUser = function (user, allRoles) {
        if (user) {
            this.isGeneralEditor = true;
            this.isNewUser = false;
            this.setRoles(user, allRoles);
            this.editingUserName = user.userName;
            this.user = new _models_user_model__WEBPACK_IMPORTED_MODULE_4__["User"]();
            this.userEdit = new _models_user_edit_model__WEBPACK_IMPORTED_MODULE_5__["UserEdit"]();
            Object.assign(this.user, user);
            Object.assign(this.userEdit, user);
            this.edit();
            return this.userEdit;
        }
        else {
            return this.newUser(allRoles);
        }
    };
    UserInfoComponent.prototype.displayUser = function (user, allRoles) {
        this.user = new _models_user_model__WEBPACK_IMPORTED_MODULE_4__["User"]();
        Object.assign(this.user, user);
        this.deletePasswordFromUser(this.user);
        this.setRoles(user, allRoles);
        this.isEditMode = false;
    };
    UserInfoComponent.prototype.setRoles = function (user, allRoles) {
        var _this = this;
        this.allRoles = allRoles ? allRoles.slice() : [];
        if (user.roles) {
            var _loop_1 = function (ur) {
                if (!this_1.allRoles.some(function (r) { return r.name == ur; }))
                    this_1.allRoles.unshift(new _models_role_model__WEBPACK_IMPORTED_MODULE_6__["Role"](ur));
            };
            var this_1 = this;
            for (var _i = 0, _a = user.roles; _i < _a.length; _i++) {
                var ur = _a[_i];
                _loop_1(ur);
            }
        }
        if (allRoles == null || this.allRoles.length != allRoles.length)
            setTimeout(function () { return _this.rolesSelector.refresh(); });
    };
    Object.defineProperty(UserInfoComponent.prototype, "canViewAllRoles", {
        get: function () {
            return this.accountService.userHasPermission(_models_permission_model__WEBPACK_IMPORTED_MODULE_7__["Permission"].viewRolesPermission);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserInfoComponent.prototype, "canAssignRoles", {
        get: function () {
            return this.accountService.userHasPermission(_models_permission_model__WEBPACK_IMPORTED_MODULE_7__["Permission"].assignRolesPermission);
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], UserInfoComponent.prototype, "isViewOnly", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], UserInfoComponent.prototype, "isGeneralEditor", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('f'),
        __metadata("design:type", Object)
    ], UserInfoComponent.prototype, "form", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('userName'),
        __metadata("design:type", Object)
    ], UserInfoComponent.prototype, "userName", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('userPassword'),
        __metadata("design:type", Object)
    ], UserInfoComponent.prototype, "userPassword", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('email'),
        __metadata("design:type", Object)
    ], UserInfoComponent.prototype, "email", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('currentPassword'),
        __metadata("design:type", Object)
    ], UserInfoComponent.prototype, "currentPassword", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('newPassword'),
        __metadata("design:type", Object)
    ], UserInfoComponent.prototype, "newPassword", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('confirmPassword'),
        __metadata("design:type", Object)
    ], UserInfoComponent.prototype, "confirmPassword", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('roles'),
        __metadata("design:type", Object)
    ], UserInfoComponent.prototype, "roles", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('rolesSelector'),
        __metadata("design:type", Object)
    ], UserInfoComponent.prototype, "rolesSelector", void 0);
    UserInfoComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'user-info',
            template: __webpack_require__(/*! ./user-info.component.html */ "./src/app/components/controls/user-info.component.html"),
            styles: [__webpack_require__(/*! ./user-info.component.css */ "./src/app/components/controls/user-info.component.css")],
        }),
        __metadata("design:paramtypes", [_services_alert_service__WEBPACK_IMPORTED_MODULE_1__["AlertService"], _services_account_service__WEBPACK_IMPORTED_MODULE_2__["AccountService"], _services_local_store_manager_service__WEBPACK_IMPORTED_MODULE_8__["LocalStoreManager"], _services_language_observable_service__WEBPACK_IMPORTED_MODULE_10__["LanguageObservableService"]])
    ], UserInfoComponent);
    return UserInfoComponent;
}());



/***/ }),

/***/ "./src/app/components/controls/user-preferences.component.css":
/*!********************************************************************!*\
  !*** ./src/app/components/controls/user-preferences.component.css ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n.separator-hr {\r\n    margin: 7px 5px;\r\n    border-top-style: dashed;\r\n}\r\n\r\n.subseparator-hr {\r\n    margin: 7px 5px;\r\n    border-top-style: none;\r\n}\r\n\r\n.last-separator-hr {\r\n    margin-top: 7px;\r\n}\r\n\r\n.form-group {\r\n    margin-top: 0;\r\n    margin-bottom: 0;\r\n}\r\n\r\n.form-control-static {\r\n    min-height: 0;\r\n}\r\n\r\n.form-horizontal .checkbox {\r\n    padding-top: 0;\r\n}\r\n\r\n.col-reset-default {\r\n    padding-right: 0;\r\n}\r\n\r\n.col-set-default {\r\n    padding-left: 5px;\r\n}\r\n\r\n@media (min-width: 768px) {\r\n    .form-horizontal .control-label {\r\n        padding-top: 5px;\r\n    }\r\n}\r\n"

/***/ }),

/***/ "./src/app/components/controls/user-preferences.component.html":
/*!*********************************************************************!*\
  !*** ./src/app/components/controls/user-preferences.component.html ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"form-horizontal\">\r\n  \r\n\r\n\r\n\r\n  <div class=\"form-group\">\r\n    <label for=\"language\" class=\"col-sm-3 control-label\">{{'preferences.Language' | translate}} </label>\r\n    <div class=\"col-sm-4\">\r\n      <!--<select id=\"language\" [(ngModel)]=\"configurations.language\" #languageSelector=\"bootstrap-select\" bootstrapSelect class=\"selectpicker form-control\">\r\n        <option data-subtext=\"(Default)\" value=\"en\">{{'preferences.English' | translate}}</option>\r\n        <option value=\"fr\">{{'preferences.French' | translate}}</option>\r\n        <option value=\"sp\">{{'preferences.Spanish' | translate}}</option>\r\n        <option value=\"de\">{{'preferences.Dutch' | translate}}</option>\r\n      </select>-->\r\n    </div>\r\n    <div class=\"col-sm-5\">\r\n      <p class=\"form-control-static text-muted small\">{{'preferences.LanguageHint' | translate}}</p>\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      <hr class=\"separator-hr\" />\r\n    </div>\r\n  </div>\r\n\r\n  \r\n\r\n\r\n\r\n\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      <hr class=\"last-separator-hr\" />\r\n    </div>\r\n  </div>\r\n  <div class=\"form-group\">\r\n    <div class=\"col-sm-3\">\r\n\r\n    </div>\r\n    <div class=\"col-sm-9\">\r\n      <div class=\"row pull-left\">\r\n        <div class=\"col-sm-6 col-reset-default\">\r\n          <button type=\"button\" (click)=\"resetDefault()\" class=\"btn btn-success\">\r\n            <i class='fa fa-circle-o-notch'></i> {{'preferences.ResetDefault' | translate}}\r\n          </button>\r\n        </div>\r\n        <div class=\"col-sm-6 col-set-default\">\r\n          <button type=\"button\" (click)=\"setAsDefault()\" class=\"btn btn-primary\">\r\n            <i class='fa fa-hdd-o'></i> {{'preferences.SetDefault' | translate}}\r\n          </button>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/components/controls/user-preferences.component.ts":
/*!*******************************************************************!*\
  !*** ./src/app/components/controls/user-preferences.component.ts ***!
  \*******************************************************************/
/*! exports provided: UserPreferencesComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserPreferencesComponent", function() { return UserPreferencesComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_alert_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/alert.service */ "./src/app/services/alert.service.ts");
/* harmony import */ var _services_configuration_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/configuration.service */ "./src/app/services/configuration.service.ts");
/* harmony import */ var _services_app_translation_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/app-translation.service */ "./src/app/services/app-translation.service.ts");
/* harmony import */ var _directives_bootstrap_select_directive__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../directives/bootstrap-select.directive */ "./src/app/directives/bootstrap-select.directive.ts");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var _services_utilities__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../services/utilities */ "./src/app/services/utilities.ts");
/* harmony import */ var _models_permission_model__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../models/permission.model */ "./src/app/models/permission.model.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var UserPreferencesComponent = /** @class */ (function () {
    function UserPreferencesComponent(alertService, translationService, accountService, configurations) {
        this.alertService = alertService;
        this.translationService = translationService;
        this.accountService = accountService;
        this.configurations = configurations;
        this.themeSelectorToggle = true;
    }
    UserPreferencesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.languageChangedSubscription = this.translationService.languageChanged$.subscribe(function (data) {
            _this.themeSelectorToggle = false;
            setTimeout(function () {
                _this.languageSelector.refresh();
            });
        });
    };
    UserPreferencesComponent.prototype.ngOnDestroy = function () {
        this.languageChangedSubscription.unsubscribe();
    };
    UserPreferencesComponent.prototype.reloadFromServer = function () {
        var _this = this;
        this.alertService.startLoadingMessage();
        this.accountService.getUserPreferences()
            .subscribe(function (results) {
            _this.alertService.stopLoadingMessage();
            _this.configurations.import(results);
            _this.alertService.showMessage("Defaults loaded!", "", _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["MessageSeverity"].info);
        }, function (error) {
            _this.alertService.stopLoadingMessage();
            _this.alertService.showStickyMessage("Load Error", "Unable to retrieve user preferences from the server.\r\nErrors: \"" + _services_utilities__WEBPACK_IMPORTED_MODULE_6__["Utilities"].getHttpResponseMessage(error) + "\"", _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["MessageSeverity"].error, error);
        });
    };
    UserPreferencesComponent.prototype.setAsDefault = function () {
        var _this = this;
        this.alertService.showDialog("Are you sure you want to set the current configuration as your new defaults?", _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["DialogType"].confirm, function () { return _this.setAsDefaultHelper(); }, function () { return _this.alertService.showMessage("Operation Cancelled!", "", _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["MessageSeverity"].default); });
    };
    UserPreferencesComponent.prototype.setAsDefaultHelper = function () {
        var _this = this;
        this.alertService.startLoadingMessage("", "Saving new defaults");
        this.accountService.updateUserPreferences(this.configurations.export())
            .subscribe(function (response) {
            _this.alertService.stopLoadingMessage();
            _this.alertService.showMessage("New Defaults", "Account defaults updated successfully", _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["MessageSeverity"].success);
        }, function (error) {
            _this.alertService.stopLoadingMessage();
            _this.alertService.showStickyMessage("Save Error", "An error occured whilst saving configuration defaults.\r\nErrors: \"" + _services_utilities__WEBPACK_IMPORTED_MODULE_6__["Utilities"].getHttpResponseMessage(error) + "\"", _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["MessageSeverity"].error, error);
        });
    };
    UserPreferencesComponent.prototype.resetDefault = function () {
        var _this = this;
        this.alertService.showDialog("Are you sure you want to reset your defaults?", _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["DialogType"].confirm, function () { return _this.resetDefaultHelper(); }, function () { return _this.alertService.showMessage("Operation Cancelled!", "", _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["MessageSeverity"].default); });
    };
    UserPreferencesComponent.prototype.resetDefaultHelper = function () {
        var _this = this;
        this.alertService.startLoadingMessage("", "Resetting defaults");
        this.accountService.updateUserPreferences(null)
            .subscribe(function (response) {
            _this.alertService.stopLoadingMessage();
            _this.configurations.import(null);
            _this.alertService.showMessage("Defaults Reset", "Account defaults reset completed successfully", _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["MessageSeverity"].success);
        }, function (error) {
            _this.alertService.stopLoadingMessage();
            _this.alertService.showStickyMessage("Save Error", "An error occured whilst resetting configuration defaults.\r\nErrors: \"" + _services_utilities__WEBPACK_IMPORTED_MODULE_6__["Utilities"].getHttpResponseMessage(error) + "\"", _services_alert_service__WEBPACK_IMPORTED_MODULE_1__["MessageSeverity"].error, error);
        });
    };
    Object.defineProperty(UserPreferencesComponent.prototype, "canViewCustomers", {
        get: function () {
            return this.accountService.userHasPermission(_models_permission_model__WEBPACK_IMPORTED_MODULE_7__["Permission"].viewUsersPermission); //eg. viewCustomersPermission
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserPreferencesComponent.prototype, "canViewProducts", {
        get: function () {
            return this.accountService.userHasPermission(_models_permission_model__WEBPACK_IMPORTED_MODULE_7__["Permission"].viewUsersPermission); //eg. viewProductsPermission
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserPreferencesComponent.prototype, "canViewOrders", {
        get: function () {
            return true; //eg. viewOrdersPermission
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])("languageSelector"),
        __metadata("design:type", _directives_bootstrap_select_directive__WEBPACK_IMPORTED_MODULE_4__["BootstrapSelectDirective"])
    ], UserPreferencesComponent.prototype, "languageSelector", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])("homePageSelector"),
        __metadata("design:type", _directives_bootstrap_select_directive__WEBPACK_IMPORTED_MODULE_4__["BootstrapSelectDirective"])
    ], UserPreferencesComponent.prototype, "homePageSelector", void 0);
    UserPreferencesComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'user-preferences',
            template: __webpack_require__(/*! ./user-preferences.component.html */ "./src/app/components/controls/user-preferences.component.html"),
            styles: [__webpack_require__(/*! ./user-preferences.component.css */ "./src/app/components/controls/user-preferences.component.css")]
        }),
        __metadata("design:paramtypes", [_services_alert_service__WEBPACK_IMPORTED_MODULE_1__["AlertService"], _services_app_translation_service__WEBPACK_IMPORTED_MODULE_3__["AppTranslationService"], _services_account_service__WEBPACK_IMPORTED_MODULE_5__["AccountService"], _services_configuration_service__WEBPACK_IMPORTED_MODULE_2__["ConfigurationService"]])
    ], UserPreferencesComponent);
    return UserPreferencesComponent;
}());



/***/ }),

/***/ "./src/app/components/controls/users-management.component.css":
/*!********************************************************************!*\
  !*** ./src/app/components/controls/users-management.component.css ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n.user-role {\r\n    font-size: 0.8em !important;\r\n    margin-right: 1px;\r\n}\r\n\r\n.control-box {\r\n    margin-bottom: 5px;\r\n}\r\n\r\n.search-box {\r\n    margin: 0;\r\n}\r\n\r\n.action-box {\r\n    margin: 0 50px 0 0;\r\n    min-height: 0;\r\n}\r\n\r\n.action-box .toolbaritem a {\r\n        padding-top: 5px;\r\n        padding-bottom: 5px;\r\n        min-width: 100px;\r\n    }\r\n\r\n.user-disabled {\r\n    color: #777;\r\n    font-style: italic;\r\n}\r\n\r\n.locked-out {\r\n    background-color: orangered;\r\n    color: whitesmoke;\r\n    width: 100%;\r\n    display: inline-block;\r\n    padding-left: 5px;\r\n}\r\n\r\n@media (max-width: 768px) {\r\n    .action-box {\r\n        margin: 0 14px;\r\n    }\r\n}\r\n"

/***/ }),

/***/ "./src/app/components/controls/users-management.component.html":
/*!*********************************************************************!*\
  !*** ./src/app/components/controls/users-management.component.html ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div>\r\n    <div class=\"row control-box\">\r\n        <div class=\"col-sm-8\">\r\n            <div class=\"form-group search-box\">\r\n                <search-box (searchChange)=\"onSearchChanged($event)\" placeholder=\"{{'users.management.Search' | translate}}\">></search-box>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-sm-4\">\r\n            <div class=\"navbar action-box\">\r\n                <ul class=\"nav navbar-nav navbar-right\">\r\n                    <li *ngIf=\"canManageUsers && canAssignRoles\" class=\"toolbaritem\">\r\n                        <a href=\"javascript:;\" (click)=\"newUser(row)\">\r\n                            <i class=\"fa fa-plus-circle\"></i> {{'users.management.NewUser' | translate}}\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <ngx-datatable class=\"material colored-header sm table table-striped table-hover\"\r\n                   [loadingIndicator]=\"loadingIndicator\"\r\n                   [rows]=\"rows\"\r\n                   [rowHeight]=\"35\"\r\n                   [headerHeight]=\"35\"\r\n                   [footerHeight]=\"35\"\r\n                   [columns]=\"columns\"\r\n                   [scrollbarV]=\"true\"\r\n                   [columnMode]=\"'force'\">\r\n    </ngx-datatable>\r\n\r\n    <ng-template #indexTemplate let-value=\"value\">\r\n        <strong>{{value}}</strong>\r\n    </ng-template>\r\n\r\n    <ng-template #userNameTemplate let-row=\"row\" let-value=\"value\">\r\n        <span [class.locked-out]=\"row.isLockedOut\" [class.user-disabled]=\"!row.isEnabled\">\r\n            <i *ngIf=\"row.isLockedOut\" class=\"fa fa-exclamation-triangle\"> </i>\r\n            <i *ngIf=\"!row.isEnabled\" class=\"fa fa-exclamation\"> </i>\r\n            {{value}}\r\n        </span>\r\n    </ng-template>\r\n\r\n    <ng-template #rolesTemplate let-row=\"row\" let-value=\"value\" let-i=\"index\">\r\n        <span class=\"user-role badge\" *ngFor=\"let role of value\">{{role}}</span>\r\n    </ng-template>\r\n\r\n    <ng-template #actionsTemplate let-row=\"row\" let-value=\"value\" let-i=\"index\">\r\n        <div *ngIf=\"canManageUsers\">\r\n            <a class=\"btn btn-link btn-xs\" href=\"javascript:;\" (click)=\"editUser(row)\"><i class=\"fa fa-pencil-square-o\" aria-hidden=\"true\"></i> {{'users.management.Edit' | translate}}</a>\r\n            |\r\n            <a class=\"btn btn-link btn-xs\" href=\"javascript:;\" (click)=\"deleteUser(row)\"><i class=\"fa fa-trash-o\" aria-hidden=\"true\"></i> {{'users.management.Delete' | translate}}</a>\r\n        </div>\r\n    </ng-template>\r\n\r\n\r\n    <div class=\"modal fade\" bsModal #editorModal=\"bs-modal\" (onHidden)=\"onEditorModalHidden()\" [config]=\"{backdrop: 'static'}\" tabindex=\"-1\">\r\n        <div class=\"modal-dialog modal-lg\">\r\n            <div class=\"modal-content\">\r\n                <div class=\"modal-header\">\r\n                    <h4 class=\"modal-title pull-left\"><i class=\"fa fa-user-circle-o\"></i> {{editingUserName ? ('users.management.EditUser' | translate:editingUserName) : ('users.management.NewUser' | translate)}}</h4>\r\n                    <button type=\"button\" class=\"close pull-right\" title=\"Close\" (click)=\"editorModal.hide()\">\r\n                        <span aria-hidden=\"true\">&times;</span>\r\n                    </button>\r\n                </div>\r\n                <div class=\"modal-body\">\r\n                    <user-info #userEditor [isGeneralEditor]=\"true\"></user-info>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/components/controls/users-management.component.ts":
/*!*******************************************************************!*\
  !*** ./src/app/components/controls/users-management.component.ts ***!
  \*******************************************************************/
/*! exports provided: UsersManagementComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UsersManagementComponent", function() { return UsersManagementComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ngx-bootstrap/modal */ "./node_modules/ngx-bootstrap/modal/index.js");
/* harmony import */ var _services_alert_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/alert.service */ "./src/app/services/alert.service.ts");
/* harmony import */ var _services_app_translation_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/app-translation.service */ "./src/app/services/app-translation.service.ts");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var _services_utilities__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../services/utilities */ "./src/app/services/utilities.ts");
/* harmony import */ var _models_user_model__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../models/user.model */ "./src/app/models/user.model.ts");
/* harmony import */ var _models_role_model__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../models/role.model */ "./src/app/models/role.model.ts");
/* harmony import */ var _models_permission_model__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../models/permission.model */ "./src/app/models/permission.model.ts");
/* harmony import */ var _user_info_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./user-info.component */ "./src/app/components/controls/user-info.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










var UsersManagementComponent = /** @class */ (function () {
    function UsersManagementComponent(alertService, translationService, accountService) {
        this.alertService = alertService;
        this.translationService = translationService;
        this.accountService = accountService;
        this.columns = [];
        this.rows = [];
        this.rowsCache = [];
        this.allRoles = [];
    }
    UsersManagementComponent.prototype.ngOnInit = function () {
        var _this = this;
        var gT = function (key) { return _this.translationService.getTranslation(key); };
        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },
            { prop: 'jobTitle', name: gT('users.management.Title'), width: 50 },
            { prop: 'userName', name: gT('users.management.UserName'), width: 90, cellTemplate: this.userNameTemplate },
            { prop: 'fullName', name: gT('users.management.FullName'), width: 120 },
            { prop: 'email', name: gT('users.management.Email'), width: 140 },
            { prop: 'roles', name: gT('users.management.Roles'), width: 120, cellTemplate: this.rolesTemplate },
            { prop: 'phoneNumber', name: gT('users.management.PhoneNumber'), width: 100 },
            { prop: 'Answer 01', name: gT('users.management.Answer01'), width: 100 },
            { prop: 'Answer 02', name: gT('users.management.Answer02'), width: 100 }
        ];
        if (this.canManageUsers)
            this.columns.push({ name: '', width: 130, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false });
        this.loadData();
    };
    UsersManagementComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.userEditor.changesSavedCallback = function () {
            _this.addNewUserToList();
            _this.editorModal.hide();
        };
        this.userEditor.changesCancelledCallback = function () {
            _this.editedUser = null;
            _this.sourceUser = null;
            _this.editorModal.hide();
        };
    };
    UsersManagementComponent.prototype.addNewUserToList = function () {
        if (this.sourceUser) {
            Object.assign(this.sourceUser, this.editedUser);
            var sourceIndex = this.rowsCache.indexOf(this.sourceUser, 0);
            if (sourceIndex > -1)
                _services_utilities__WEBPACK_IMPORTED_MODULE_5__["Utilities"].moveArrayItem(this.rowsCache, sourceIndex, 0);
            sourceIndex = this.rows.indexOf(this.sourceUser, 0);
            if (sourceIndex > -1)
                _services_utilities__WEBPACK_IMPORTED_MODULE_5__["Utilities"].moveArrayItem(this.rows, sourceIndex, 0);
            this.editedUser = null;
            this.sourceUser = null;
        }
        else {
            var user = new _models_user_model__WEBPACK_IMPORTED_MODULE_6__["User"]();
            Object.assign(user, this.editedUser);
            this.editedUser = null;
            var maxIndex = 0;
            for (var _i = 0, _a = this.rowsCache; _i < _a.length; _i++) {
                var u = _a[_i];
                if (u.index > maxIndex)
                    maxIndex = u.index;
            }
            user.index = maxIndex + 1;
            this.rowsCache.splice(0, 0, user);
            this.rows.splice(0, 0, user);
            this.rows = this.rows.slice();
        }
    };
    UsersManagementComponent.prototype.loadData = function () {
        var _this = this;
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        if (this.canViewRoles) {
            this.accountService.getUsersAndRoles().subscribe(function (results) { return _this.onDataLoadSuccessful(results[0], results[1]); }, function (error) { return _this.onDataLoadFailed(error); });
        }
        else {
            this.accountService.getUsers().subscribe(function (users) { return _this.onDataLoadSuccessful(users, _this.accountService.currentUser.roles.map(function (x) { return new _models_role_model__WEBPACK_IMPORTED_MODULE_7__["Role"](x); })); }, function (error) { return _this.onDataLoadFailed(error); });
        }
    };
    UsersManagementComponent.prototype.onDataLoadSuccessful = function (users, roles) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        users.forEach(function (user, index, users) {
            user.index = index + 1;
        });
        this.rowsCache = users.slice();
        this.rows = users;
        this.allRoles = roles;
    };
    UsersManagementComponent.prototype.onDataLoadFailed = function (error) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.alertService.showStickyMessage("Load Error", "Unable to retrieve users from the server.\r\nErrors: \"" + _services_utilities__WEBPACK_IMPORTED_MODULE_5__["Utilities"].getHttpResponseMessage(error) + "\"", _services_alert_service__WEBPACK_IMPORTED_MODULE_2__["MessageSeverity"].error, error);
    };
    UsersManagementComponent.prototype.onSearchChanged = function (value) {
        this.rows = this.rowsCache.filter(function (r) { return _services_utilities__WEBPACK_IMPORTED_MODULE_5__["Utilities"].searchArray(value, false, r.userName, r.lastName, r.email, r.phoneNumber, r.roles); });
    };
    UsersManagementComponent.prototype.onEditorModalHidden = function () {
        this.editingUserName = null;
        this.userEditor.resetForm(true);
    };
    UsersManagementComponent.prototype.newUser = function () {
        this.editingUserName = null;
        this.sourceUser = null;
        this.editedUser = this.userEditor.newUser(this.allRoles);
        this.editorModal.show();
    };
    UsersManagementComponent.prototype.editUser = function (row) {
        this.editingUserName = { name: row.userName };
        this.sourceUser = row;
        this.editedUser = this.userEditor.editUser(row, this.allRoles);
        this.editorModal.show();
    };
    UsersManagementComponent.prototype.deleteUser = function (row) {
        var _this = this;
        this.alertService.showDialog('Are you sure you want to delete \"' + row.userName + '\"?', _services_alert_service__WEBPACK_IMPORTED_MODULE_2__["DialogType"].confirm, function () { return _this.deleteUserHelper(row); });
    };
    UsersManagementComponent.prototype.deleteUserHelper = function (row) {
        var _this = this;
        this.alertService.startLoadingMessage("Deleting...");
        this.loadingIndicator = true;
        this.accountService.deleteUser(row)
            .subscribe(function (results) {
            _this.alertService.stopLoadingMessage();
            _this.loadingIndicator = false;
            _this.rowsCache = _this.rowsCache.filter(function (item) { return item !== row; });
            _this.rows = _this.rows.filter(function (item) { return item !== row; });
        }, function (error) {
            _this.alertService.stopLoadingMessage();
            _this.loadingIndicator = false;
            _this.alertService.showStickyMessage("Delete Error", "An error occured whilst deleting the user.\r\nError: \"" + _services_utilities__WEBPACK_IMPORTED_MODULE_5__["Utilities"].getHttpResponseMessage(error) + "\"", _services_alert_service__WEBPACK_IMPORTED_MODULE_2__["MessageSeverity"].error, error);
        });
    };
    Object.defineProperty(UsersManagementComponent.prototype, "canAssignRoles", {
        get: function () {
            return this.accountService.userHasPermission(_models_permission_model__WEBPACK_IMPORTED_MODULE_8__["Permission"].assignRolesPermission);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UsersManagementComponent.prototype, "canViewRoles", {
        get: function () {
            return this.accountService.userHasPermission(_models_permission_model__WEBPACK_IMPORTED_MODULE_8__["Permission"].viewRolesPermission);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UsersManagementComponent.prototype, "canManageUsers", {
        get: function () {
            return this.accountService.userHasPermission(_models_permission_model__WEBPACK_IMPORTED_MODULE_8__["Permission"].manageUsersPermission);
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('indexTemplate'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"])
    ], UsersManagementComponent.prototype, "indexTemplate", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('userNameTemplate'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"])
    ], UsersManagementComponent.prototype, "userNameTemplate", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('rolesTemplate'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"])
    ], UsersManagementComponent.prototype, "rolesTemplate", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('actionsTemplate'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"])
    ], UsersManagementComponent.prototype, "actionsTemplate", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('editorModal'),
        __metadata("design:type", ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_1__["ModalDirective"])
    ], UsersManagementComponent.prototype, "editorModal", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('userEditor'),
        __metadata("design:type", _user_info_component__WEBPACK_IMPORTED_MODULE_9__["UserInfoComponent"])
    ], UsersManagementComponent.prototype, "userEditor", void 0);
    UsersManagementComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'users-management',
            template: __webpack_require__(/*! ./users-management.component.html */ "./src/app/components/controls/users-management.component.html"),
            styles: [__webpack_require__(/*! ./users-management.component.css */ "./src/app/components/controls/users-management.component.css")]
        }),
        __metadata("design:paramtypes", [_services_alert_service__WEBPACK_IMPORTED_MODULE_2__["AlertService"], _services_app_translation_service__WEBPACK_IMPORTED_MODULE_3__["AppTranslationService"], _services_account_service__WEBPACK_IMPORTED_MODULE_4__["AccountService"]])
    ], UsersManagementComponent);
    return UsersManagementComponent;
}());



/***/ }),

/***/ "./src/app/components/forgot-password-confirmation/forgot-password-confirmation.component.css":
/*!****************************************************************************************************!*\
  !*** ./src/app/components/forgot-password-confirmation/forgot-password-confirmation.component.css ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/components/forgot-password-confirmation/forgot-password-confirmation.component.html":
/*!*****************************************************************************************************!*\
  !*** ./src/app/components/forgot-password-confirmation/forgot-password-confirmation.component.html ***!
  \*****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container sa-container-minsize sa-header-margin\">\r\n\r\n  <header class=\"pageHeader\">\r\n    <div class=\"row\">\r\n      <div class=\"col-md-12\">\r\n        <div class=\"sa-heading-text\">\r\n          {{'ForgotPasswordConfirmation.Header' | translate }}\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </header>\r\n\r\n  <br />\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      <div>\r\n        {{'ContactUs.AMERICAS' | translate}}\r\n      </div>\r\n      <br />\r\n      <div>\r\n        {{'ContactUs.France' | translate}}\r\n      </div>\r\n      <br />\r\n      <div>\r\n        {{'ContactUs.Spain' | translate}}\r\n      </div>\r\n      <br />\r\n      <div>\r\n        {{'ContactUs.Switzerland' | translate}}\r\n      </div>\r\n      <br />\r\n      <div>\r\n        {{'ContactUs.Netherlands' | translate}}\r\n      </div>\r\n      <br />\r\n      <div>\r\n        {{'ContactUs.UK' | translate}}\r\n      </div>\r\n      <br />\r\n      <div>\r\n        {{'ContactUs.AllCountries' | translate}}\r\n      </div>\r\n      <br />\r\n      <div>\r\n        {{'ContactUs.APAC' | translate}}\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  <br />\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      <a routerLink=\"/login\" class=\"btn btn-lg btn-primary sa-btn-header-color\">{{ 'ForgotPasswordConfirmation.ReturnToLogin' | translate }}</a>\r\n    </div>\r\n  </div>\r\n\r\n</div>\r\n\r\n"

/***/ }),

/***/ "./src/app/components/forgot-password-confirmation/forgot-password-confirmation.component.ts":
/*!***************************************************************************************************!*\
  !*** ./src/app/components/forgot-password-confirmation/forgot-password-confirmation.component.ts ***!
  \***************************************************************************************************/
/*! exports provided: ForgotPasswordConfirmationComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ForgotPasswordConfirmationComponent", function() { return ForgotPasswordConfirmationComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/account.service */ "./src/app/services/account.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ForgotPasswordConfirmationComponent = /** @class */ (function () {
    function ForgotPasswordConfirmationComponent(accountService, route, router) {
        this.accountService = accountService;
        this.route = route;
        this.router = router;
    }
    ForgotPasswordConfirmationComponent.prototype.ngOnInit = function () {
        var id = this.route.snapshot.paramMap.get('id');
        this.id = id;
        //this.accountService.confirmForgotPassword(id)
        //change password
    };
    ForgotPasswordConfirmationComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'forgot-password-confirmation',
            template: __webpack_require__(/*! ./forgot-password-confirmation.component.html */ "./src/app/components/forgot-password-confirmation/forgot-password-confirmation.component.html"),
            styles: [__webpack_require__(/*! ./forgot-password-confirmation.component.css */ "./src/app/components/forgot-password-confirmation/forgot-password-confirmation.component.css")]
        }),
        __metadata("design:paramtypes", [_services_account_service__WEBPACK_IMPORTED_MODULE_2__["AccountService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]])
    ], ForgotPasswordConfirmationComponent);
    return ForgotPasswordConfirmationComponent;
}());



/***/ }),

/***/ "./src/app/components/forgot-password/forgot-password.component.css":
/*!**************************************************************************!*\
  !*** ./src/app/components/forgot-password/forgot-password.component.css ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/components/forgot-password/forgot-password.component.html":
/*!***************************************************************************!*\
  !*** ./src/app/components/forgot-password/forgot-password.component.html ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container sa-container-minsize sa-header-margin\">\r\n\r\n  <header class=\"pageHeader\">\r\n    <div class=\"row\">\r\n      <div class=\"col-md-12\">\r\n        <div class=\"sa-heading-text\">\r\n          {{'ForgotPassword.ForgotPassword' | translate}}\r\n        </div>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"row\">\r\n      <div class=\"col-md-12 has-feedback has-error\">\r\n        <div *ngFor=\"let err of errors\" class=\"errorMessage\">{{ err | translate }}</div>\r\n      </div>\r\n    </div>\r\n  </header>\r\n\r\n\r\n\r\n  <br />\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      {{'ForgotPassword.HeaderLabel' | translate}}\r\n\r\n    </div>\r\n  </div>\r\n\r\n  <form class=\"form\"\r\n        name=\"forgotPasswordForm\"\r\n        #f=\"ngForm\"\r\n        novalidate\r\n        (ngSubmit)=\"formSubmit();\">\r\n\r\n    <br />\r\n    <div class=\"row\">\r\n      <div class=\"col-md-4\">\r\n        <label class=\"control-label\" for=\"user-name\"> {{'ForgotPassword.UserName' | translate}}<span class=\"sa-required-text\">*</span></label>\r\n        <div [ngClass]=\"{'has-error' : userName.dirty && !userName.valid}\">\r\n          <input type=\"text\"\r\n                 class=\"form-control\"\r\n                 id=\"user-name\"\r\n                 name=\"userName\"\r\n                 #userName=\"ngModel\"\r\n                 required\r\n                 [(ngModel)]=\"formModel.userName\" />\r\n        </div>\r\n        <span class=\"errorMessage\" *ngIf=\"userName.dirty && !userName.valid\"> {{'ForgotPassword.InvalidUserName' | translate}}</span>\r\n      </div>\r\n    </div>\r\n    <br />\r\n    <br />\r\n    <div class=\"row\">\r\n      <div class=\"col-md-6\">\r\n        <button type=\"submit\" [disabled]=\"isLoading || !f.valid\" class=\"btn btn-lg btn-primary sa-btn-header-color\">{{'ForgotPassword.SendEmailBtn' | translate}}</button>\r\n        <button class=\"btn-primary btn btn-lg sa-btn-header-color\" style=\"margin-left: 15px;\" (click)=\"cancel()\">{{'ForgotPassword.CancelBtn' | translate}}</button>\r\n      </div>\r\n    </div>\r\n\r\n  </form>\r\n</div>\r\n\r\n"

/***/ }),

/***/ "./src/app/components/forgot-password/forgot-password.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/components/forgot-password/forgot-password.component.ts ***!
  \*************************************************************************/
/*! exports provided: ForgotPasswordComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ForgotPasswordComponent", function() { return ForgotPasswordComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _models_user_forgot_password_model__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../models/user-forgot-password.model */ "./src/app/models/user-forgot-password.model.ts");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_utilities__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../services/utilities */ "./src/app/services/utilities.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var ForgotPasswordComponent = /** @class */ (function () {
    function ForgotPasswordComponent(router, location, accountService) {
        this.router = router;
        this.location = location;
        this.accountService = accountService;
        this.isLoading = false;
        this.formResetToggle = true;
    }
    ForgotPasswordComponent.prototype.ngOnInit = function () {
        this.formModel = new _models_user_forgot_password_model__WEBPACK_IMPORTED_MODULE_2__["UserForgotPassword"]();
        this.formModel.userName = '';
        this.errors = [];
    };
    ForgotPasswordComponent.prototype.formSubmit = function () {
        var _this = this;
        this.isLoading = true;
        this.accountService.forgotPassword(this.formModel.userName)
            .subscribe(function (data) { return _this.handleSubmitSuccess(); }, function (err) { return _this.handleSubmitError(err); });
    };
    ForgotPasswordComponent.prototype.cancel = function () {
        this.router.navigate(['/']);
    };
    ForgotPasswordComponent.prototype.handleSubmitSuccess = function () {
        this.isLoading = false;
        this.router.navigate(['/forgot/password/confirmation']);
    };
    ForgotPasswordComponent.prototype.handleSubmitError = function (err) {
        this.isLoading = false;
        var serverError = _services_utilities__WEBPACK_IMPORTED_MODULE_5__["Utilities"].getHttpErrors(err);
        this.errors = serverError;
    };
    ForgotPasswordComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-forgot-password',
            template: __webpack_require__(/*! ./forgot-password.component.html */ "./src/app/components/forgot-password/forgot-password.component.html"),
            styles: [__webpack_require__(/*! ./forgot-password.component.css */ "./src/app/components/forgot-password/forgot-password.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"],
            _angular_common__WEBPACK_IMPORTED_MODULE_1__["Location"],
            _services_account_service__WEBPACK_IMPORTED_MODULE_3__["AccountService"]])
    ], ForgotPasswordComponent);
    return ForgotPasswordComponent;
}());



/***/ }),

/***/ "./src/app/components/forgot-username-confirmation/forgot-username-confirmation.component.css":
/*!****************************************************************************************************!*\
  !*** ./src/app/components/forgot-username-confirmation/forgot-username-confirmation.component.css ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/components/forgot-username-confirmation/forgot-username-confirmation.component.html":
/*!*****************************************************************************************************!*\
  !*** ./src/app/components/forgot-username-confirmation/forgot-username-confirmation.component.html ***!
  \*****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container sa-container-minsize sa-header-margin\">\r\n\r\n  <header class=\"pageHeader\">\r\n    <div class=\"row\">\r\n      <div class=\"col-md-12\">\r\n        <div class=\"sa-heading-text\">\r\n          {{'ForgotUserNameConfirmation.Header' | translate }}\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </header>\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      <div>\r\n        {{'ContactUs.AMERICAS' | translate}}\r\n      </div>\r\n      <br />\r\n      <div>\r\n        {{'ContactUs.France' | translate}}\r\n      </div>\r\n      <br />\r\n      <div>\r\n        {{'ContactUs.Spain' | translate}}\r\n      </div>\r\n      <br />\r\n      <div>\r\n        {{'ContactUs.Switzerland' | translate}}\r\n      </div>\r\n      <br />\r\n      <div>\r\n        {{'ContactUs.Netherlands' | translate}}\r\n      </div>\r\n      <br />\r\n      <div>\r\n        {{'ContactUs.UK' | translate}}\r\n      </div>\r\n      <br />\r\n      <div>\r\n        {{'ContactUs.AllCountries' | translate}}\r\n      </div>\r\n      <br />\r\n      <div>\r\n        {{'ContactUs.APAC' | translate}}\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <br />\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      <a routerLink=\"/login\" class=\"btn btn-lg btn-primary sa-btn-header-color\">{{ 'ForgotUserNameConfirmation.ReturnToLogin' | translate }}</a>\r\n    </div>\r\n  </div>\r\n\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/components/forgot-username-confirmation/forgot-username-confirmation.component.ts":
/*!***************************************************************************************************!*\
  !*** ./src/app/components/forgot-username-confirmation/forgot-username-confirmation.component.ts ***!
  \***************************************************************************************************/
/*! exports provided: ForgotUserNameConfirmationComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ForgotUserNameConfirmationComponent", function() { return ForgotUserNameConfirmationComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/account.service */ "./src/app/services/account.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ForgotUserNameConfirmationComponent = /** @class */ (function () {
    function ForgotUserNameConfirmationComponent(accountService, route, router) {
        this.accountService = accountService;
        this.route = route;
        this.router = router;
    }
    ForgotUserNameConfirmationComponent.prototype.ngOnInit = function () {
        var id = this.route.snapshot.paramMap.get('id');
        this.id = id;
        //this.accountService.confirmForgotUsername(id)
        //show username
    };
    ForgotUserNameConfirmationComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'forgot-username-confirmation',
            template: __webpack_require__(/*! ./forgot-username-confirmation.component.html */ "./src/app/components/forgot-username-confirmation/forgot-username-confirmation.component.html"),
            styles: [__webpack_require__(/*! ./forgot-username-confirmation.component.css */ "./src/app/components/forgot-username-confirmation/forgot-username-confirmation.component.css")]
        }),
        __metadata("design:paramtypes", [_services_account_service__WEBPACK_IMPORTED_MODULE_2__["AccountService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]])
    ], ForgotUserNameConfirmationComponent);
    return ForgotUserNameConfirmationComponent;
}());



/***/ }),

/***/ "./src/app/components/forgot-username/forgot-username.component.css":
/*!**************************************************************************!*\
  !*** ./src/app/components/forgot-username/forgot-username.component.css ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/components/forgot-username/forgot-username.component.html":
/*!***************************************************************************!*\
  !*** ./src/app/components/forgot-username/forgot-username.component.html ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container sa-container-minsize sa-header-margin\">\r\n\r\n  <header class=\"pageHeader\">\r\n    <div class=\"row\">\r\n      <div class=\"col-md-12\">\r\n        <div class=\"sa-heading-text\">\r\n          {{'ForgotUsername.ForgotUsername' | translate}}\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </header>\r\n\r\n  <br />\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      {{'ForgotUsername.HeaderLabel' | translate}}\r\n    </div>\r\n  </div>\r\n\r\n  <form class=\"form\"\r\n        name=\"f\"\r\n        #f=\"ngForm\"\r\n        novalidate\r\n        (ngSubmit)=\"formSubmit();\">\r\n\r\n    <br />\r\n    <div class=\"row\">\r\n      <div class=\"col-md-4\">\r\n        <label class=\"control-label\" for=\"account-number\"> {{'ForgotUsername.CustomerIdNumber' | translate}}<span class=\"sa-required-text\">*</span></label>\r\n        <span class=\"fa fa-question-circle sa-enroll-auto-pay-button-info-icon sa-popup\" (mouseenter)=\"toggleAcctNoPopover($event)\" (mouseleave)=\"toggleAcctNoPopover($event)\">\r\n          <span class=\"sa-popuptext-b\" [class.sa-show]=\"isAcctNoPopoverVisible\" id=\"AcctNoPopover\">{{'ForgotUsername.AccountPopOver' | translate}}</span>\r\n        </span>\r\n\r\n        <div [ngClass]=\"{'has-error' :f.submitted && !accountNumber?.valid}\">\r\n          <input type=\"text\"\r\n                 class=\"form-control\"\r\n                 id=\"account-number\"\r\n                 name=\"accountNumber\"\r\n                 #accountNumber=\"ngModel\"\r\n                 required\r\n                 [(ngModel)]=\"formModel.accountNumber\" />\r\n        </div>\r\n        <span class=\"errorMessage\" *ngIf=\"f.submitted && !accountNumber?.valid\"> >{{'ForgotUsername.InvalidAccountNumber' | translate}}</span>\r\n      </div>\r\n    </div>\r\n\r\n    <br />\r\n    <div class=\"row\">\r\n      <div class=\"col-md-4\">\r\n        <label class=\"control-label\" for=\"email-address\">{{'ForgotUsername.EmailAddress' | translate}}<span class=\"sa-required-text\">*</span></label>\r\n        <span class=\"fa fa-question-circle sa-enroll-auto-pay-button-info-icon sa-popup\" (mouseenter)=\"toggleEmailPopover($event)\" (mouseleave)=\"toggleEmailPopover($event)\">\r\n          <span class=\"sa-popuptext-b\" [class.sa-show]=\"isEmailPopoverVisible\" id=\"EmailPopover\">{{'ForgotUsername.EmailAddressPopOver' | translate}}</span>\r\n        </span>\r\n\r\n        <div [ngClass]=\"{'has-error' :f.submitted && !emailAddress?.valid}\">\r\n          <input type=\"email\"\r\n                 class=\"form-control\"\r\n                 id=\"emailAddress\"\r\n                 name=\"emailAddress\"\r\n                 #emailAddress=\"ngModel\"\r\n                 [(ngModel)]=\"formModel.emailAddress\"\r\n                 required email minlength=\"5\" />\r\n\r\n        </div>\r\n        <span class=\"errorMessage\" [hidden]=\"!(emailAddress.dirty && (!emailAddress.valid || emailAddress.errors))\">{{ 'ForgotUsername.EmailAddressValidation' | translate }}</span>\r\n      </div>\r\n    </div>\r\n    <br />\r\n    <br />\r\n    <div class=\"row\">\r\n      <div class=\"col-md-6\">\r\n        <button type=\"submit\" [disabled]=\"isLoading || !f.valid\" class=\"btn btn-lg btn-primary sa-btn-header-color\">{{ 'ForgotUsername.SendEmailBtn' | translate }}</button>\r\n        <button class=\"btn-primary btn btn-lg sa-btn-header-color\" style=\"margin-left: 15px;\" (click)=\"cancel()\">{{ 'ForgotUsername.CancelBtn' | translate }}</button>\r\n      </div>\r\n    </div>\r\n\r\n  </form>\r\n\r\n</div>\r\n\r\n"

/***/ }),

/***/ "./src/app/components/forgot-username/forgot-username.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/components/forgot-username/forgot-username.component.ts ***!
  \*************************************************************************/
/*! exports provided: ForgotUserNameComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ForgotUserNameComponent", function() { return ForgotUserNameComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _models_user_forgot_username_model__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../models/user-forgot-username.model */ "./src/app/models/user-forgot-username.model.ts");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var ForgotUserNameComponent = /** @class */ (function () {
    function ForgotUserNameComponent(routerService, location, accountService) {
        this.routerService = routerService;
        this.location = location;
        this.accountService = accountService;
        this.isLoading = false;
        this.formModel = new _models_user_forgot_username_model__WEBPACK_IMPORTED_MODULE_2__["UserForgotUserName"]();
        this.formModel.accountNumber = '';
        this.formModel.emailAddress = '';
    }
    ForgotUserNameComponent.prototype.ngOnInit = function () {
    };
    ForgotUserNameComponent.prototype.formSubmit = function () {
        var _this = this;
        this.isLoading = true;
        console.log(this.formModel);
        this.accountService.forgotUserName(this.formModel).subscribe(function (data) { return _this.handleSubmitSuccess(); }, function (err) { return _this.handleSubmitError(); });
    };
    ForgotUserNameComponent.prototype.cancel = function () {
        this.routerService.navigate(['/']);
    };
    ForgotUserNameComponent.prototype.handleSubmitSuccess = function () {
        this.isLoading = false;
        this.routerService.navigate(['/forgot/username/confirmation']);
    };
    ForgotUserNameComponent.prototype.handleSubmitError = function () {
        this.isLoading = false;
        this.routerService.navigate(['/forgot/username/confirmation']);
    };
    ForgotUserNameComponent.prototype.toggleAcctNoPopover = function (e) {
        this.isAcctNoPopoverVisible = !this.isAcctNoPopoverVisible;
        return this.isAcctNoPopoverVisible;
    };
    ForgotUserNameComponent.prototype.toggleEmailPopover = function (e) {
        this.isEmailPopoverVisible = !this.isEmailPopoverVisible;
        return this.isEmailPopoverVisible;
    };
    ForgotUserNameComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-forgot-username',
            template: __webpack_require__(/*! ./forgot-username.component.html */ "./src/app/components/forgot-username/forgot-username.component.html"),
            styles: [__webpack_require__(/*! ./forgot-username.component.css */ "./src/app/components/forgot-username/forgot-username.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"],
            _angular_common__WEBPACK_IMPORTED_MODULE_1__["Location"],
            _services_account_service__WEBPACK_IMPORTED_MODULE_3__["AccountService"]])
    ], ForgotUserNameComponent);
    return ForgotUserNameComponent;
}());



/***/ }),

/***/ "./src/app/components/invoices-closed/invoices-closed.component.css":
/*!**************************************************************************!*\
  !*** ./src/app/components/invoices-closed/invoices-closed.component.css ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/components/invoices-closed/invoices-closed.component.html":
/*!***************************************************************************!*\
  !*** ./src/app/components/invoices-closed/invoices-closed.component.html ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container\" style=\"min-height: 500px; margin-top: 35px;\">\r\n  <header class=\"pageHeader\"></header>\r\n  <br />\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      <span class=\"sa-heading-text\">\r\n        {{ 'InvoiceHistory.INVOICEHISTORY' | translate }}\r\n      </span>\r\n      <span style=\"font-size: x-large; margin-left: 20px;\">\r\n        <button class=\"btn-primary btn sa-btn-header-color\" routerLink=\"/secure\">{{ 'InvoiceHistory.OPENINVOICES' | translate }}</button>\r\n      </span>\r\n    </div>\r\n  </div>\r\n  <br />\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      <p>\r\n        {{ 'InvoiceHistory.InvoiceNote' | translate }}\r\n      </p>\r\n    </div>\r\n  </div>\r\n\r\n  <br />\r\n  <br />\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      <table class=\"table table-bordered table-striped\">\r\n        <thead>\r\n          <tr style=\"background-color: #D3D3D3;\">\r\n            <th style=\"text-align: center;\">\r\n              {{ 'InvoiceHistory.Invoice#' | translate }}\r\n            </th>\r\n            <th style=\"text-align: center;\">\r\n              {{ 'InvoiceHistory.Status' | translate }}\r\n            </th>\r\n            <th style=\"text-align: center;\">\r\n              {{ 'InvoiceHistory.InvoiceDate' | translate }}\r\n            </th>\r\n            <!--<th style=\"text-align: center;\">\r\n              Date Paid\r\n            </th>-->\r\n            <th style=\"text-align: center;\">\r\n              {{ 'InvoiceHistory.InvoiceAmount' | translate }}\r\n            </th>\r\n          </tr>\r\n        </thead>\r\n        <tbody>\r\n          <ng-container *ngFor=\"let invoice of invoices, index as i\">\r\n            <tr>\r\n              <td align=\"center\">\r\n                <div style=\"margin-top: 5px;\" (click)=\"getInvoicePdf(invoice.invoiceNumber)\" class=\"sa-hover-text\">\r\n                  {{invoice.invoiceNumber}}\r\n                </div>\r\n              </td>\r\n              <td align=\"center\">\r\n                <div style=\"margin-top: 5px;\">\r\n                  {{getInvoiceStatus(invoice) | translate}}\r\n                </div>\r\n              </td>\r\n              <td align=\"center\">\r\n                {{getFormatedDate(invoice.date)}}\r\n              </td>\r\n              <!--<td align=\"center\">\r\n                  {{getFormatedDate(invoice.dateDue)}}\r\n              </td>-->\r\n              <td align=\"right\">\r\n                <div style=\"margin-top: 5px;\">\r\n                  {{getInvoiceAmountF(invoice)}} {{invoice.currency}}\r\n                </div>\r\n              </td>\r\n            </tr>\r\n\r\n          </ng-container>\r\n\r\n        </tbody>\r\n      </table>\r\n\r\n    </div>\r\n  </div>\r\n\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/components/invoices-closed/invoices-closed.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/components/invoices-closed/invoices-closed.component.ts ***!
  \*************************************************************************/
/*! exports provided: InvoiceClosedComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InvoiceClosedComponent", function() { return InvoiceClosedComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_animations__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/animations */ "./src/app/services/animations.ts");
/* harmony import */ var _services_configuration_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/configuration.service */ "./src/app/services/configuration.service.ts");
/* harmony import */ var _services_invoice_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/invoice.service */ "./src/app/services/invoice.service.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var InvoiceClosedComponent = /** @class */ (function () {
    function InvoiceClosedComponent(configurations, invoiceService) {
        this.configurations = configurations;
        this.invoiceService = invoiceService;
        this.invoiceCurrency = 'USD';
        this.getClosedInvoices();
    }
    InvoiceClosedComponent.prototype.ngOnInit = function () {
    };
    InvoiceClosedComponent.prototype.getClosedInvoices = function () {
        var _this = this;
        this.isLoading = true;
        this.invoiceService.getClosedInvoices()
            .subscribe(function (request) {
            setTimeout(function () {
                _this.isLoading = false;
                _this.invoices = request;
            }, 500);
        }, function (error) {
            setTimeout(function () {
                _this.isLoading = false;
            }, 500);
        });
    };
    InvoiceClosedComponent.prototype.getInvoiceStatus = function (invoice) {
        if (invoice.status == "") {
            return 'InvoiceHistory..Cancelled';
        }
        if (invoice.status == "Due") {
            return 'InvoiceHistory.Open';
        }
        if (invoice.status == "PaidInPart") {
            return 'InvoiceHistory.PartiallyPaid';
        }
        if (invoice.status == "PaidInFull") {
            return 'InvoiceHistory.PaidInFull';
        }
        //return invoice.status;
        return 'Processing';
    };
    InvoiceClosedComponent.prototype.getInvoiceAmountF = function (invoice) {
        if (isNaN(invoice.totalAmountPaid)) {
            return (0).toFixed(2);
        }
        return invoice.totalAmountPaid.toFixed(2);
    };
    InvoiceClosedComponent.prototype.getFormatedDate = function (d) {
        if (d == null) {
            return null;
        }
        var dt = new Date(d);
        var formattedDate = Object(_angular_common__WEBPACK_IMPORTED_MODULE_4__["formatDate"])(dt, "dd-MMM-yyyy", "en-US");
        // return (dt.getMonth() + 1) + '/' + dt.getDate() + '/' + dt.getFullYear()
        return formattedDate;
    };
    InvoiceClosedComponent.prototype.getInvoicePdf = function (invoiceNumber) {
        this.invoiceService.getInvoicePDF(invoiceNumber).subscribe(function (response) {
            setTimeout(function () {
                window.open('/api/invoice/download?id=' + response.id, 'target="_blank"');
            }, 500);
        });
    };
    InvoiceClosedComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'invoices-closed',
            template: __webpack_require__(/*! ./invoices-closed.component.html */ "./src/app/components/invoices-closed/invoices-closed.component.html"),
            styles: [__webpack_require__(/*! ./invoices-closed.component.css */ "./src/app/components/invoices-closed/invoices-closed.component.css")],
            animations: [_services_animations__WEBPACK_IMPORTED_MODULE_1__["fadeInOut"]]
        }),
        __metadata("design:paramtypes", [_services_configuration_service__WEBPACK_IMPORTED_MODULE_2__["ConfigurationService"],
            _services_invoice_service__WEBPACK_IMPORTED_MODULE_3__["InvoiceService"]])
    ], InvoiceClosedComponent);
    return InvoiceClosedComponent;
}());



/***/ }),

/***/ "./src/app/components/landing/landing.component.css":
/*!**********************************************************!*\
  !*** ./src/app/components/landing/landing.component.css ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/components/landing/landing.component.html":
/*!***********************************************************!*\
  !*** ./src/app/components/landing/landing.component.html ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container\" style=\"min-height: 500px; margin-top: 35px;\">\r\n  <header class=\"pageHeader\"></header>\r\n  <br />\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      <div class=\"sa-heading-text\">\r\n        {{ 'AccountSummary.ACCOUNTSUMMARY' | translate }}\r\n        <span style=\"font-size: x-large; margin-left: 20px;\">\r\n          <button class=\"btn-primary btn sa-btn-header-color\" routerLink=\"/secure/invoices\"> {{ 'AccountSummary.INVOICEHISTORY' | translate }}</button>\r\n        </span>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <br />\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      {{ 'AccountSummary.AccountSummaryDescription' | translate }}\r\n      <br /><br />\r\n    </div>\r\n    <div class=\"col-md-12 text-left\" style=\"color: red; font-style: italic;\">\r\n      {{ 'AccountSummary.AvailableInUSnCANNote' | translate }}\r\n    </div>\r\n  </div>\r\n\r\n  <br />\r\n  <br />\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      <div *ngIf=\"isBalanceDue\" style=\"font-style: italic; font-weight: bold; margin-bottom: 4px;\">\r\n        {{ 'AccountSummary.InvoicePayTitle' | translate }}\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      <table class=\"table table-bordered table-striped\">\r\n        <thead>\r\n          <tr style=\"background-color: #D3D3D3;\">\r\n            <th style=\"text-align: center;\">\r\n              {{ 'AccountSummary.Pay' | translate }}\r\n            </th>\r\n            <th style=\"text-align: center;\">\r\n              {{ 'AccountSummary.Invoice#' | translate }}\r\n            </th>\r\n            <th style=\"text-align: center;\">\r\n              {{ 'AccountSummary.Status' | translate }}\r\n            </th>\r\n            <th style=\"text-align: center;\">\r\n              {{ 'AccountSummary.PaymentTerms' | translate }}\r\n            </th>\r\n            <th style=\"text-align: center;\">\r\n              {{ 'AccountSummary.InvoiceDate' | translate }}\r\n            </th>\r\n            <th style=\"text-align: center;\">\r\n              {{ 'AccountSummary.InvoiceDue' | translate }}\r\n            </th>\r\n\r\n            <th style=\"text-align: center;\">\r\n              {{ 'AccountSummary.BalanceDue' | translate }}\r\n            </th>\r\n          </tr>\r\n        </thead>\r\n        <tbody>\r\n          <ng-container *ngFor=\"let invoice of getInvoices(), index as i\">\r\n            <tr>\r\n              <td align=\"center\" valign=\"middle\">\r\n                <input type=\"radio\" *ngIf=\"canPayOnSite && !restrictPaymentTerms(invoice)\" style=\"width: 20px; height: 20px\" value=\"row_{{i}}\" name=\"paymentRow_{{i}}\" [checked]=\"getSelectedValue(i)\" (click)=\"setSelectedvalue(i, invoice.balance)\" />\r\n              </td>\r\n              <td align=\"center\">\r\n                <div style=\"margin-top: 5px;\" (click)=\"getInvoicePdf(invoice.invoiceNumber)\" class=\"sa-hover-text\">\r\n                  {{invoice.invoiceNumber}}\r\n                </div>\r\n              </td>\r\n              <td align=\"center\">\r\n                <div style=\"margin-top: 5px;\" *ngIf=\"!getInvoiceStatus(invoice)\">\r\n                  {{ 'AccountSummary.PASTDUE' | translate }}\r\n                </div>\r\n                <div style=\"margin-top: 5px;\" *ngIf=\"getInvoiceStatus(invoice)\">\r\n                  {{ 'AccountSummary.DUENOW' | translate }}\r\n                </div>\r\n              </td>\r\n              <td align=\"center\">\r\n                {{ invoice.paymentTerms}}\r\n              </td>\r\n              <td align=\"center\">\r\n                {{getFormatedDate(invoice.date)}}\r\n              </td>\r\n              <td align=\"center\">\r\n                <div style=\"margin-top: 5px;\">\r\n                  {{getFormatedDate(invoice.dateDue)}}\r\n                </div>\r\n              </td>\r\n              <td align=\"right\">\r\n                <div style=\"margin-top: 5px;\">\r\n                  {{getBalanceDueF(invoice)}} {{invoice.currency}}\r\n                </div>\r\n              </td>\r\n            </tr>\r\n\r\n          </ng-container>\r\n\r\n        </tbody>\r\n      </table>\r\n\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12 text-right\">\r\n      <span style=\"font-size: x-large;\">\r\n        {{ 'AccountSummary.TotalBalanceDue' | translate }} {{ getTotalDueF() }} {{ getCustomerCurrency() }}\r\n      </span>\r\n    </div>\r\n  </div>\r\n  <br />\r\n\r\n  <div class=\"row\" *ngIf=\"isBalanceDue\">\r\n    <div class=\"col-md-12 text-right\">\r\n      <span style=\"font-size: x-large;\">\r\n        {{ 'AccountSummary.TotalPaymentAmount' | translate }} {{ getSelectedPaymentAmountF() }} {{ getCustomerCurrency() }}\r\n      </span>\r\n    </div>\r\n  </div>\r\n\r\n  <br />\r\n  <div *ngIf=\"isBalanceDue\">\r\n    <div class=\"row\">\r\n      <div class=\"col-md-12 text-right\">\r\n        <!--<a routerLink=\"/secure/payment/paynow\" id=\"buttonPayNow\" title=\"{{ 'Register' | translate }}\" class=\"btn btn-lg btn-primary sa-btn-green-color sa-btn-x-large\">{{ 'PAY NOW' | translate }}</a>-->\r\n        <button *ngIf=\"canPayOnSite\" (click)=\"paynow();\"\r\n                class=\"btn-primary btn btn-lg sa-btn-header-color\">\r\n          {{ 'AccountSummary.PAYNOW' | translate }}\r\n        </button>\r\n      </div>\r\n    </div>\r\n    <br />\r\n    <div class=\"row\">\r\n      <div class=\"col-md-12 text-right\" style=\"color: red; font-style: italic;\">\r\n        {{ 'AccountSummary.PaymentNote' | translate }}\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/components/landing/landing.component.ts":
/*!*********************************************************!*\
  !*** ./src/app/components/landing/landing.component.ts ***!
  \*********************************************************/
/*! exports provided: LandingComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LandingComponent", function() { return LandingComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_animations__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/animations */ "./src/app/services/animations.ts");
/* harmony import */ var _services_configuration_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/configuration.service */ "./src/app/services/configuration.service.ts");
/* harmony import */ var _services_invoice_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/invoice.service */ "./src/app/services/invoice.service.ts");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! util */ "./node_modules/util/util.js");
/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(util__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_app_translation_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../services/app-translation.service */ "./src/app/services/app-translation.service.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var LandingComponent = /** @class */ (function () {
    function LandingComponent(translationService, configurations, invoiceService, accountService, routerService) {
        this.translationService = translationService;
        this.configurations = configurations;
        this.invoiceService = invoiceService;
        this.accountService = accountService;
        this.routerService = routerService;
        this.invoiceCurrency = 'USD';
        this.totalBalanceDue = 0;
        this.isBalanceDue = false;
        this.canPayOnSite = true;
        this.radioButtonSelected = 0;
        this.radioButtonNotSelected = 1;
        this.selectedRows = new Array();
    }
    LandingComponent.prototype.ngOnInit = function () {
        this.getOpenInvoices();
        this.getSiteAccount();
    };
    LandingComponent.prototype.getSiteAccount = function () {
        var _this = this;
        this.accountService.getAccount().subscribe(function (account) { return _this.saveSuccessHelper(account); }, function (error) { return _this.saveFailedHelper(error); });
    };
    LandingComponent.prototype.saveSuccessHelper = function (res) {
        if (res.currency != 'USD' && res.currency != 'CAD')
            this.canPayOnSite = false;
    };
    LandingComponent.prototype.saveFailedHelper = function (res) {
        this.canPayOnSite = true;
    };
    LandingComponent.prototype.setSelectedvalue = function (index, balance) {
        if (this.selectedRows != null && this.selectedRows.length >= index) {
            if (this.selectedRows[index] == this.radioButtonNotSelected) {
                this.selectedRows[index] = this.radioButtonSelected;
                this.selectedPaymentAmount += balance;
                this.invoiceService.getUserInvoices()[index].userPaymentAmount = balance;
                return;
            }
            this.selectedRows[index] = this.radioButtonNotSelected;
            if (this.selectedPaymentAmount > 0) {
                this.selectedPaymentAmount -= balance;
            }
            this.invoiceService.getUserInvoices()[index].userPaymentAmount = 0;
        }
    };
    LandingComponent.prototype.paynow = function () {
        this.routerService.navigate(['secure/payment/paynow']);
    };
    LandingComponent.prototype.getSelectedValue = function (index) {
        if (this.selectedRows != null && this.selectedRows.length >= index) {
            if (this.selectedRows[index] == this.radioButtonSelected) {
                return true;
            }
        }
        return false;
    };
    LandingComponent.prototype.getOpenInvoices = function () {
        var _this = this;
        this.selectedPaymentAmount = 0;
        // keep invoice list until user logs off. Caching in the service
        if (this.invoiceService.getUserInvoices() != null && this.invoiceService.getUserInvoices().length > 0) {
            this.invoiceCurrency = this.invoiceService.getUserInvoices()[0].currency;
            for (var i = 0; i < this.invoiceService.getUserInvoices().length; i++) {
                if (Object(util__WEBPACK_IMPORTED_MODULE_5__["isNumber"])(this.invoiceService.getUserInvoices()[i].totalAmountPaid) && Object(util__WEBPACK_IMPORTED_MODULE_5__["isNumber"])(this.invoiceService.getUserInvoices()[i].totalAmount)) {
                    this.totalBalanceDue += (this.invoiceService.getUserInvoices()[i].balance);
                }
                if (this.invoiceService.getUserInvoices()[i].userPaymentAmount > 0) {
                    this.selectedPaymentAmount += this.invoiceService.getUserInvoices()[i].userPaymentAmount;
                    if (!this.restrictPaymentTerms(this.invoiceService.getUserInvoices()[i])) {
                        this.selectedRows.push(this.radioButtonSelected);
                    }
                    else {
                        this.selectedRows.push(this.radioButtonNotSelected);
                    }
                }
                else {
                    this.selectedRows.push(this.radioButtonNotSelected);
                }
                this.isBalanceDue = (this.totalBalanceDue > 0);
            }
            return;
        }
        this.isLoading = true;
        this.invoiceService.getOpenInvoices()
            .subscribe(function (request) {
            setTimeout(function () {
                _this.isLoading = false;
                _this.invoiceService.setUserInvoices(request);
                var tempSelectedPaymentAmount = 0.0;
                if (_this.invoiceService.getUserInvoices() != null && _this.invoiceService.getUserInvoices().length > 0) {
                    _this.invoiceCurrency = _this.invoiceService.getUserInvoices()[0].currency;
                    for (var i = 0; i < _this.invoiceService.getUserInvoices().length; i++) {
                        if (Object(util__WEBPACK_IMPORTED_MODULE_5__["isNumber"])(_this.invoiceService.getUserInvoices()[i].totalAmountPaid) && Object(util__WEBPACK_IMPORTED_MODULE_5__["isNumber"])(_this.invoiceService.getUserInvoices()[i].totalAmount)) {
                            _this.totalBalanceDue += (_this.invoiceService.getUserInvoices()[i].balance);
                            if (!_this.restrictPaymentTerms(_this.invoiceService.getUserInvoices()[i])) {
                                tempSelectedPaymentAmount += (_this.invoiceService.getUserInvoices()[i].balance);
                                _this.invoiceService.getUserInvoices()[i].userPaymentAmount = _this.invoiceService.getUserInvoices()[i].balance;
                            }
                            else {
                                _this.invoiceService.getUserInvoices()[i].userPaymentAmount = 0;
                            }
                        }
                        //this.selectedRows.push(this.radioButtonSelected);
                        if (!_this.restrictPaymentTerms(_this.invoiceService.getUserInvoices()[i])) {
                            _this.selectedRows.push(_this.radioButtonSelected);
                        }
                        else {
                            _this.selectedRows.push(_this.radioButtonNotSelected);
                        }
                    }
                    _this.isBalanceDue = (_this.totalBalanceDue > 0);
                    _this.selectedPaymentAmount = tempSelectedPaymentAmount;
                }
            }, 500);
        }, function (error) {
            setTimeout(function () {
                _this.isLoading = false;
            }, 500);
        });
    };
    LandingComponent.prototype.getInvoices = function () {
        return this.invoiceService.getUserInvoices();
    };
    LandingComponent.prototype.getCustomerCurrency = function () {
        return this.invoiceCurrency;
    };
    LandingComponent.prototype.getTotalDueF = function () {
        return this.totalBalanceDue.toFixed(2);
    };
    LandingComponent.prototype.getInvoicePdf = function (invoiceNumber) {
        this.invoiceService.getInvoicePDF(invoiceNumber).subscribe(function (response) {
            setTimeout(function () {
                window.open('/api/invoice/download?id=' + response.id, 'target="_blank"', '', false);
            }, 500);
        });
    };
    LandingComponent.prototype.restrictPaymentTerms = function (invoice) {
        // Do not allow Customers with a Payment Term of: DUE1st  or NET30CC to pay invoices in Account Center
        var paymentTerm = invoice.paymentTerms;
        //Due on 1st ,Net 30 CC
        if (paymentTerm === "Due on 1st" || paymentTerm === "Net 30 CC") {
            return true;
        }
        return false;
    };
    LandingComponent.prototype.getInvoiceStatus = function (invoice) {
        var dueDate = new Date(invoice.dateDue);
        var currentDate = new Date(Date.now());
        if (dueDate < currentDate) {
            return false; //"PAST DUE"
        }
        return true; //"DUE NOW"
        //if (invoice.status.indexOf('Overd') > 0) { return 'OVERDUE'; }
        //if (invoice.status.indexOf('Due') >0) { return 'DUENOW'; }
        //if (invoice.status == "PaidInPart") { return 'Partially Paid'; }
        //if (invoice.status == "PaidInFull") { return 'Paid In Full'; }
        //return invoice.status;
    };
    LandingComponent.prototype.getInvoiceAmountF = function (invoice) {
        if (isNaN(invoice.totalAmount)) {
            return (0).toFixed(2);
        }
        return invoice.totalAmount.toFixed(2);
    };
    LandingComponent.prototype.getBalanceDueF = function (invoice) {
        if (isNaN(invoice.balance)) {
            return (0).toFixed(2);
        }
        return (invoice.balance).toFixed(2);
    };
    LandingComponent.prototype.getSelectedPaymentAmountF = function () {
        if (isNaN(this.selectedPaymentAmount)) {
            return (0).toFixed(2);
        }
        return (this.selectedPaymentAmount).toFixed(2);
    };
    LandingComponent.prototype.getFormatedDate = function (d) {
        if (d == null) {
            return null;
        }
        var dt = new Date(d);
        var formattedDate = Object(_angular_common__WEBPACK_IMPORTED_MODULE_8__["formatDate"])(dt, "dd-MMM-yyyy", "en-US");
        // return (dt.getMonth() + 1) + '/' + dt.getDate() + '/' + dt.getFullYear()
        return formattedDate;
    };
    LandingComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'landing',
            template: __webpack_require__(/*! ./landing.component.html */ "./src/app/components/landing/landing.component.html"),
            styles: [__webpack_require__(/*! ./landing.component.css */ "./src/app/components/landing/landing.component.css")],
            animations: [_services_animations__WEBPACK_IMPORTED_MODULE_1__["fadeInOut"]]
        }),
        __metadata("design:paramtypes", [_services_app_translation_service__WEBPACK_IMPORTED_MODULE_7__["AppTranslationService"], _services_configuration_service__WEBPACK_IMPORTED_MODULE_2__["ConfigurationService"], _services_invoice_service__WEBPACK_IMPORTED_MODULE_3__["InvoiceService"], _services_account_service__WEBPACK_IMPORTED_MODULE_4__["AccountService"], _angular_router__WEBPACK_IMPORTED_MODULE_6__["Router"]])
    ], LandingComponent);
    return LandingComponent;
}());



/***/ }),

/***/ "./src/app/components/login/login.component.css":
/*!******************************************************!*\
  !*** ./src/app/components/login/login.component.css ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".boxshadow {\r\n    position: relative;\r\n    box-shadow: 1px 2px 4px rgba(0, 0, 0, .5);\r\n    padding: 10px;\r\n    background: white;\r\n}\r\n\r\n\r\n    .boxshadow::after {\r\n        content: '';\r\n        position: absolute;\r\n        z-index: -1; /* hide shadow behind image */\r\n        box-shadow: 0 15px 20px rgba(0, 0, 0, 0.3);\r\n        width: 70%;\r\n        left: 15%; /* one half of the remaining 30% */\r\n        height: 100px;\r\n        bottom: 0;\r\n    }\r\n\r\n\r\n    .cardshadow {\r\n    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);\r\n}\r\n\r\n\r\n    .separator-hr {\r\n    margin: 0;\r\n}\r\n\r\n\r\n    .last-control-group {\r\n    margin-bottom: -25px;\r\n}\r\n"

/***/ }),

/***/ "./src/app/components/login/login.component.html":
/*!*******************************************************!*\
  !*** ./src/app/components/login/login.component.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n<div>\r\n  <header class=\"pageHeader\"></header>\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-md-6\">\r\n      <div class=\"row\">\r\n        <div class=\"col-md-12\">\r\n          <span class=\"sa-heading-text\">{{ 'Login.CustomerLogin' | translate }}</span>\r\n        </div>\r\n      </div>\r\n      <div class=\"row\">\r\n        <div class=\"col-md-12 has-feedback has-error\">\r\n          <div *ngFor=\"let err of errors\" class=\"errorMessage\">{{ err | translate }}</div>\r\n        </div>\r\n      </div>\r\n\r\n      <div class=\"row\">\r\n        <div class=\"col-md-12\">\r\n          <div style=\"margin: 0px 20px 20px 20px;\">\r\n            <form *ngIf=\"formResetToggle\" class=\"form-horizontal login\" #f=\"ngForm\" name=\"f\" id=\"f\" (ngSubmit)=\"login()\">\r\n\r\n              <div class=\"form-group\">\r\n                <div>\r\n                  <label class=\"control-label\" for=\"userName\">{{ 'Login.UserName' | translate }}<span class=\"sa-required-text\">*</span></label>\r\n                </div>\r\n                <div class=\"has-feedback\" [ngClass]=\"{ 'has-error' : isError || userName.dirty && (!userName.valid || userName.errors) }\">\r\n                  <input type=\"text\" id=\"userName\" name=\"userName\" class=\"form-control\" [(ngModel)]=\"model.userName\" #userName=\"ngModel\" required minlength=\"3\" />\r\n                  <span class=\"errorMessage\" *ngIf=\"userName.dirty && (!userName.valid || userName.errors)\">{{ 'Login.UserNameRequired' | translate }}</span>\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"form-group \">\r\n                <div>\r\n                  <label class=\"control-label\" for=\"password\">{{ 'Login.Password' | translate }}<span class=\"sa-required-text\">*</span></label>\r\n                </div>\r\n                <div class=\"has-feedback\" [ngClass]=\"{ 'has-error' : isError ||userName.dirty && (!password.valid || password.errors) }\">\r\n                  <input type=\"password\" id=\"password\" name=\"password\" class=\"form-control\" [(ngModel)]=\"model.password\" #password=\"ngModel\" required minlength=\"8\" />\r\n                  <span class=\"errorMessage\" *ngIf=\"password.dirty && (!password.valid || password.errors)\">{{ 'Login.PasswordRequired' | translate }}</span>\r\n                </div>\r\n                <div class=\"text-right\">\r\n                  <a routerLink=\"/forgot/username\" title=\"{{ 'Login.ForgotUserName' | translate }}\" class=\"btn btn-link sa-link\">{{ 'Login.ForgotUserName' | translate }}</a>\r\n                  <span class=\"sa-pipe-divider\">|</span>\r\n                  <a routerLink=\"/forgot/password\" title=\"{{ 'Login.ForgotPassword' | translate }}\" class=\"btn btn-link sa-link\">{{ 'Login.ForgotPassword' | translate }}</a>\r\n                </div>\r\n              </div>\r\n\r\n\r\n              <!--<div class=\"form-group\">\r\n                <div style=\"color:#FC4242;font-style:italic;font-size:12px;font-weight:600;\">\r\n                  <p>\"By failing to prepare, you are preparing to fail.\" - Benjamin Franklin</p>\r\n                  <p>We want to make sure we’re prepared to serve you, so the ScentAir Account Center will be down for scheduled maintenance beginning Wednesday, February 20 at 8 PM EST.  Maintenance will be completed by Thursday, February 21 at 3 AM EST or sooner.</p>\r\n                </div>\r\n              </div>-->\r\n\r\n\r\n              <div class=\"form-group\">\r\n                <div>\r\n                  <button type=\"submit\" class=\"btn btn-lg btn-block btn-primary sa-btn-header-color\" [disabled]=\"(!f.valid && !isError) || isLoading\">\r\n                    <i *ngIf=\"isLoading\" class='fa fa-circle-o-notch fa-spin'></i> {{ isLoading ? ('Login.SigningIn'  | translate) : ('Login.SignIn' | translate) }}\r\n                  </button>\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"form-group\">\r\n                <div>\r\n                  <a routerLink=\"/register\" title=\"{{ 'Login.RegisterNow'  | translate }}\" class=\"btn btn-lg btn-block btn-primary\">{{ 'Login.RegisterNow'  | translate }}</a>\r\n                </div>\r\n              </div>\r\n            </form>\r\n          </div>\r\n        </div>\r\n\r\n      </div>\r\n    </div>\r\n    <div class=\"col-md-6\">\r\n      <div class=\"row\">\r\n        <div class=\"col-md-12\">\r\n          <h2 class=\"sa-blue-text sa-no-margin\">\r\n            {{ 'Login.QuickandEasyAccess'  | translate }}\r\n          </h2>\r\n        </div>\r\n      </div>\r\n      <div class=\"row\">\r\n        <div class=\"col-md-12\">\r\n          <h3></h3>\r\n          <p>\r\n            {{ 'Login.QuickandEasyAccessDescription'  | translate }}\r\n          </p>\r\n          <p>\r\n            <b>{{ 'Login.WhyRegister'  | translate }}</b> {{ 'Login.RegisterDescription'  | translate }}\r\n          </p>\r\n\r\n          <ul>\r\n            <li>\r\n              {{ 'Login.RegisterBulletPoint1'  | translate }}\r\n            </li>\r\n            <li>\r\n              {{ 'Login.RegisterBulletPoint2'  | translate }}\r\n            </li>\r\n            <li>\r\n              {{ 'Login.RegisterBulletPoint3'  | translate }}\r\n            </li>\r\n            <li *ngIf=\"!IsSelectedLanguageFrench()\">\r\n              {{ 'Login.RegisterBulletPoint4'  | translate }}\r\n            </li>\r\n\r\n          </ul>\r\n          <p style=\"font-size:small;color:red\">\r\n            {{ 'Login.RegisterNote'  | translate }}\r\n          </p>\r\n\r\n          <p>\r\n            {{ 'Login.Quetions'  | translate }}&nbsp; <a style=\"font-size:large;\" routerLink=\"/contactus\" title=\"{{ 'Login.ContactUs'  | translate }}\" class=\"btn btn-link sa-link\">{{ 'Login.ContactUs'  | translate }}</a>\r\n          </p>\r\n\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n\r\n  <br />\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      <div>\r\n        <img src=\"/assets/images/credit-card.png\" style=\"width: 100%; border-radius: 8px;\" />\r\n      </div>\r\n\r\n    </div>\r\n  </div>\r\n\r\n</div>\r\n\r\n"

/***/ }),

/***/ "./src/app/components/login/login.component.ts":
/*!*****************************************************!*\
  !*** ./src/app/components/login/login.component.ts ***!
  \*****************************************************/
/*! exports provided: LoginComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginComponent", function() { return LoginComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/auth.service */ "./src/app/services/auth.service.ts");
/* harmony import */ var _services_configuration_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/configuration.service */ "./src/app/services/configuration.service.ts");
/* harmony import */ var _models_user_login_model__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../models/user-login.model */ "./src/app/models/user-login.model.ts");
/* harmony import */ var _services_invoice_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../services/invoice.service */ "./src/app/services/invoice.service.ts");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var _services_utilities__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../services/utilities */ "./src/app/services/utilities.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var LoginComponent = /** @class */ (function () {
    function LoginComponent(authService, router, configurationService, invoiceService, accountService) {
        this.authService = authService;
        this.router = router;
        this.configurationService = configurationService;
        this.invoiceService = invoiceService;
        this.accountService = accountService;
        this.submit = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.isLoading = false;
        this.isEdit = false;
        this.isError = false;
        this.isModal = false;
        this.formResetToggle = true;
        this.invoiceService.setUserInvoices(null);
        this.errors = [];
    }
    LoginComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.isEdit = false;
        this.setForm();
        if (this.getShouldRedirect()) {
            this.authService.redirectLoginUser();
        }
        else {
            this.loginStatusSubscription = this.authService.getLoginStatusEvent().subscribe(function (isLoggedIn) {
                if (_this.getShouldRedirect()) {
                    _this.authService.redirectLoginUser();
                }
            });
        }
    };
    LoginComponent.prototype.ngOnDestroy = function () {
        if (this.loginSubscription) {
            this.loginSubscription.unsubscribe();
        }
        if (this.loginStatusSubscription) {
            this.loginStatusSubscription.unsubscribe();
        }
    };
    LoginComponent.prototype.setForm = function () {
        if (!this.isEdit) {
            this.model = new _models_user_login_model__WEBPACK_IMPORTED_MODULE_4__["UserLogin"]('', '', this.authService.rememberMe);
        }
        else {
            this.model = new _models_user_login_model__WEBPACK_IMPORTED_MODULE_4__["UserLogin"](this.data.userName, this.data.password, this.data.rememberMe || this.authService.rememberMe);
        }
    };
    LoginComponent.prototype.reset = function () {
        var _this = this;
        this.formResetToggle = false;
        this.errors = [];
        setTimeout(function () {
            _this.formResetToggle = true;
        });
    };
    LoginComponent.prototype.getShouldRedirect = function () {
        return !this.isModal && this.authService.isLoggedIn && !this.authService.isSessionExpired;
    };
    LoginComponent.prototype.closeModal = function () {
        if (this.modalClosedCallback) {
            this.modalClosedCallback();
        }
    };
    LoginComponent.prototype.handleSubmitSuccess = function (res) {
        var eventObj = {
            isEdit: this.isEdit,
            data: res
        };
        this.errors = [];
        this.isError = false;
        this.isLoading = false;
        this.submit.emit(eventObj);
        //setTimeout(() => {
        //  this.accountService.getAccount().subscribe(
        //    account => {
        //      this.accountService.setCurrentAccount(account);
        //      this.routerService.navigateByUrl('/Landing');
        //    });
        //}, 500);
    };
    LoginComponent.prototype.handleSubmitError = function (err) {
        var serverError = _services_utilities__WEBPACK_IMPORTED_MODULE_7__["Utilities"].getHttpErrors(err);
        this.errors = serverError;
        var eventObj = {
            isEdit: this.isEdit,
            error: this.errors
        };
        this.isLoading = false;
        this.isError = true;
        this.submit.emit(eventObj);
    };
    LoginComponent.prototype.login = function () {
        var _this = this;
        this.isLoading = true;
        this.errors = [];
        //if (!this.isEdit) {
        this.loginSubscription = this.authService.login(this.model.userName, this.model.password, this.model.rememberMe)
            .subscribe(function (data) { return _this.handleSubmitSuccess(data); }, function (err) { return _this.handleSubmitError(err); });
    };
    LoginComponent.prototype.IsSelectedLanguageFrench = function () {
        if (this.configurationService.language == "fr") {
            return true;
        }
        return false;
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", _models_user_login_model__WEBPACK_IMPORTED_MODULE_4__["UserLogin"])
    ], LoginComponent.prototype, "data", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], LoginComponent.prototype, "submit", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], LoginComponent.prototype, "isModal", void 0);
    LoginComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-login',
            template: __webpack_require__(/*! ./login.component.html */ "./src/app/components/login/login.component.html"),
            styles: [__webpack_require__(/*! ./login.component.css */ "./src/app/components/login/login.component.css")]
        }),
        __metadata("design:paramtypes", [_services_auth_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"],
            _services_configuration_service__WEBPACK_IMPORTED_MODULE_3__["ConfigurationService"],
            _services_invoice_service__WEBPACK_IMPORTED_MODULE_5__["InvoiceService"],
            _services_account_service__WEBPACK_IMPORTED_MODULE_6__["AccountService"]])
    ], LoginComponent);
    return LoginComponent;
}());



/***/ }),

/***/ "./src/app/components/not-found/not-found.component.css":
/*!**************************************************************!*\
  !*** ./src/app/components/not-found/not-found.component.css ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".vertical-center-flex {\r\n    min-height: 60vh;\r\n}\r\n\r\n.icon-container {\r\n    font-size: 5em;\r\n}\r\n\r\n.error-description {\r\n    font-size: 1.5em;\r\n    padding-bottom: 10px;\r\n}\r\n"

/***/ }),

/***/ "./src/app/components/not-found/not-found.component.html":
/*!***************************************************************!*\
  !*** ./src/app/components/not-found/not-found.component.html ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container\">\r\n    <header class=\"pageHeader\">\r\n        <h3><i class=\"fa fa-exclamation-circle fa-lg page-caption\" aria-hidden=\"true\"></i> {{'pageHeader.NotFound' | translate}}</h3>\r\n    </header>\r\n\r\n    <div [@fadeInOut] class=\"vertical-center-flex\">\r\n        <div class=\"center-block\">\r\n            <div class=\"icon-container\"><i class='fa fa-exclamation-circle'></i> {{'notFound.404' | translate}}</div>\r\n            <div class=\"text-muted error-description\">{{'notFound.pageNotFound' | translate}}</div>\r\n            <div><a class=\"btn btn-primary\" routerLink=\"/\"><i class='fa fa-home'></i> {{'notFound.backToHome' | translate}}</a></div>\r\n        </div>\r\n    </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/components/not-found/not-found.component.ts":
/*!*************************************************************!*\
  !*** ./src/app/components/not-found/not-found.component.ts ***!
  \*************************************************************/
/*! exports provided: NotFoundComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NotFoundComponent", function() { return NotFoundComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_animations__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/animations */ "./src/app/services/animations.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var NotFoundComponent = /** @class */ (function () {
    function NotFoundComponent() {
    }
    NotFoundComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'not-found',
            template: __webpack_require__(/*! ./not-found.component.html */ "./src/app/components/not-found/not-found.component.html"),
            styles: [__webpack_require__(/*! ./not-found.component.css */ "./src/app/components/not-found/not-found.component.css")],
            animations: [_services_animations__WEBPACK_IMPORTED_MODULE_1__["fadeInOut"]]
        })
    ], NotFoundComponent);
    return NotFoundComponent;
}());



/***/ }),

/***/ "./src/app/components/paymentautopay/payment-autopay.component.css":
/*!*************************************************************************!*\
  !*** ./src/app/components/paymentautopay/payment-autopay.component.css ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/components/paymentautopay/payment-autopay.component.html":
/*!**************************************************************************!*\
  !*** ./src/app/components/paymentautopay/payment-autopay.component.html ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container sa-container-minsize sa-header-margin-loggedin\">\r\n\r\n  <header class=\"pageHeader\">\r\n    <div class=\"row\">\r\n      <div class=\"col-md-12\">\r\n        <div class=\"sa-heading-text\">\r\n          {{'PaymentAutoPay.ManageAutoPay' | translate}}\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div style=\"color: red; font-style: italic;\">\r\n      {{'PaymentAutoPay.AccountOptionDesc' | translate}}\r\n    </div>\r\n    <br />\r\n    <div class=\"row\">\r\n      <div class=\"col-md-12\">\r\n        <h4>\r\n          {{'PaymentAutoPay.AutoPayDesc' | translate}}\r\n        </h4>\r\n        <br />\r\n        <h4>\r\n          {{'PaymentAutoPay.PaymentTermsNote' | translate}}\r\n        </h4>\r\n      </div>\r\n    </div>\r\n  </header>\r\n  <br />\r\n\r\n  <ng-container *ngFor=\"let paymentMethod of paymentMethods, index as i\">\r\n    <div *ngIf=\"i > 0\" class=\"row\">\r\n      <div class=\"col-md-12\">\r\n        <hr class=\"sa-blue-hr\" />\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"row\">\r\n      <div class=\"col-md-9\" style=\"font-size: large;\">\r\n        <a routerLink=\"/secure/payment/{{paymentMethod.id}}\" class=\"sa-pipe-divider\">\r\n          {{ paymentMethod.name }} <span style=\"font-style: italic\">({{paymentMethod.paymentType}} {{'PaymentAutoPay.EndingWith' | translate}} {{paymentMethod.accountNumber.substring(paymentMethod.accountNumber.length - 4, paymentMethod.accountNumber.length)}})</span>\r\n        </a>\r\n        <span *ngIf=\"paymentMethod.currentAutoPayMethod && !isEnrolling\" class=\"sa-auto-pay-text\">\r\n          {{ \"Current AutoPay Payment Method\" | translate }}\r\n          <span class=\"fa fa-question-circle sa-enroll-auto-pay-button-info-icon sa-popup\" (mouseenter)=\"togglePopover($event)\" (mouseleave)=\"togglePopover($event)\">\r\n            <span class=\"sa-popuptext-b\" [class.sa-show]=\"isAutoEnrollPopoverVisible\" id=\"autpPayPopover\">{{'PaymentAutoPay.PaymentMethodChargesDesc' | translate}}</span>\r\n          </span>\r\n        </span>\r\n      </div>\r\n      <div class=\"col-md-3 text-right\">\r\n        <div class=\"sa-inline-field\"\r\n             [ngClass]=\"{'has-error' : !isAutoPayEnabled }\"\r\n             *ngIf=\"!paymentMethod.currentAutoPayMethod || isEnrolling\">\r\n          <label style=\"margin-left: 8px; font-weight: normal;\" class=\"sa-pipe-divider\">{{'PaymentAutoPay.AUTOPAY' | translate}}</label>\r\n          <input type=\"radio\" class=\"form-control sa-radio-button\" style=\"width: 20px; height: 20px\"\r\n                 (click)=\"changeAutoPay(i);\" name=\"paymentRowRadio\"\r\n                 [disabled]=\"(!isAutoPayEnabled || isUnenrolling)\" />\r\n          <span class=\"glyphicon form-control-feedback glyphicon-remove\"\r\n                aria-hidden=\"true\"\r\n                *ngIf=\"!isAutoPayEnabled\"></span>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </ng-container>\r\n\r\n  <br />\r\n  <br />\r\n\r\n\r\n  <div class=\"row\" *ngIf=\"isTermsVisible\">\r\n    <div class=\"row\" style=\"text-align:center;\"><span style=\"font-size:large;font-weight:bold;\">{{'PaymentAutoPay.ScentAirTermsConditionDesc' | translate}}</span></div>\r\n    <br />\r\n    <span style=\"font-weight:bold;\">{{'PaymentAutoPay.BYCHECKING' | translate}}</span>{{'PaymentAutoPay.AuthorizedAgent' | translate}}<span style=\"font-weight:bold;\">{{'PaymentAutoPay.certifies' | translate}}</span>{{'PaymentAutoPay.AuthorizedCertifiesDesc1' | translate}} <span style=\"font-weight:bold;\">{{'PaymentAutoPay.AuthorizedCertifiesDesc2' | translate}}</span>{{'PaymentAutoPay.AuthorizedCertifiesDesc3' | translate}} <span style=\"font-weight:bold;\">{{'PaymentAutoPay.Authorization' | translate}}</span>{{'PaymentAutoPay.AuthorizedCertifiesDesc4' | translate}}\r\n    <br />\r\n    <span style=\"font-weight:bold;\">{{'PaymentAutoPay.certifies' | translate}}</span>{{'PaymentAutoPay.AuthorizedCertifiesDesc6' | translate}}  <span style=\"font-weight:bold;\">{{'PaymentAutoPay.AuthorizedCertifiesDesc7' | translate}}</span> {{'PaymentAutoPay.AuthorizedCertifiesDesc8' | translate}}\r\n    <br /><br /> <div class=\"row\" style=\"text-align:center;\"> <span style=\"text-align:center;font-size:large;font-style:italic;\">{{'PaymentAutoPay.AuthorizedCertifiesDesc9' | translate}}</span><br /><br /></div>\r\n    <span style=\"font-weight:bold;color:red;\">{{'PaymentAutoPay.GeneralTerms' | translate}}</span> {{'PaymentAutoPay.AuthorizedCertifiesDesc10' | translate}}<span style=\"font-weight:bold;\">{{'PaymentAutoPay.InvoiceAmounts' | translate}}</span>{{'PaymentAutoPay.AuthorizedCertifiesDesc11' | translate}}<span style=\"font-weight:bold;\">{{'PaymentAutoPay.EnrollmentScreens' | translate}}</span>{{'PaymentAutoPay.AuthorizedCertifiesDesc12' | translate}}<a href=\"mailto:customercare@scentair.com\">{{'PaymentAutoPay.CustomerCare' | translate}}</a>{{'PaymentAutoPay.AuthorizedCertifiesDesc13' | translate}}\r\n    <br /><br />\r\n    {{'PaymentAutoPay.SubscriberFurtherAgrees' | translate}}\r\n    <br /><br />\r\n    <span style=\"font-weight:bold;color:red;\">{{'PaymentAutoPay.ACHAuthorization' | translate}} </span>{{'PaymentAutoPay.ACHAuthorizationDesc1' | translate}}\r\n    <br /><br /><span style=\"font-weight:bold;color:red;\">{{'PaymentAutoPay.CreditCardAuthorization' | translate}} </span> {{'PaymentAutoPay.PaymentTypeDesc' | translate}}\r\n    {{'PaymentAutoPay.PaymentTypeDesc1' | translate}}\r\n\r\n    <br /><br /><span style=\"font-weight:bold;color:red;\"> {{'PaymentAutoPay.Privacy' | translate}}</span>{{'PaymentAutoPay.PrivacySubscriberDesc' | translate}}\r\n    <br />\r\n\r\n    <a href=\"../../../assets/images/TermsandConditions.png\" target=\"_blank\">{{'PaymentAutoPay.PrintTermsConditions' | translate}}</a>\r\n\r\n  </div>\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\" *ngIf=\"canPayOnSite\">\r\n      <a routerLink=\"/secure/payment\" *ngIf=\"!isTermsVisible\" fragment=\"auto\" class=\"btn-primary btn btn-lg sa-btn-header-color\">{{'PaymentAutoPay.ADDNEWPAYMENTMETHOD' | translate}}</a>\r\n      <button (click)=\"unenrollAutoPay();\" *ngIf=\"!isTermsVisible\" [disabled]=\"(!isAutoPayEnabled || isUnenrolling || !isAutoPayActive)\" class=\"btn-primary btn btn-lg sa-btn-header-color\" style=\"margin-left: 10px\">{{'PaymentAutoPay.UNENROLLINAUTOPAY' | translate}}</button>\r\n      <button (click)=\"saveAutoPay();\" *ngIf=\"!isTermsVisible\" [disabled]=\"(!isAutoPayEnabled || isUnenrolling || !isAutoPayActive || !isEnrolling)\" class=\"btn-primary btn btn-lg sa-btn-header-color\" style=\"float: right;\">{{'PaymentAutoPay.SAVE' | translate}}</button>\r\n\r\n      <button (click)=\"saveAutoPay();\" *ngIf=\"isTermsVisible\" [disabled]=\"(isLoading)\" class=\"btn-primary btn btn-lg sa-btn-header-color\" style=\"float: right;\"> {{'PaymentAutoPay.ACCEPT' | translate}} &amp; {{'PaymentAutoPay.SUBMIT' | translate}}</button>&nbsp;&nbsp;\r\n      <button (click)=\"cancel()\" *ngIf=\"isTermsVisible\" class=\"btn-primary btn btn-lg sa-btn-header-color\" style=\"float: right;\">{{'PaymentAutoPay.CANCEL' | translate}}</button>&nbsp;&nbsp;&nbsp;\r\n    </div>\r\n  </div>\r\n  <br />\r\n  <div>\r\n    {{'PaymentAutoPay.ChargesDesc' | translate}}\r\n  </div>\r\n\r\n  <br />\r\n  <div class=\"row\" *ngIf=\"!isAutoPayEnabled\">\r\n    <div class=\"col-md-12 errorMessage\">\r\n      {{'PaymentAutoPay.OpenInvoicesDesc' | translate}}\r\n    </div>\r\n  </div>\r\n  <div class=\"row\" *ngIf=\"(isUnenrolling)\">\r\n    <div style=\"color: red;font-size:large;\" class=\"col-md-12 errorMessage\">\r\n      {{'PaymentAutoPay.AUTOPAYUnenrollmentRequestDesc' | translate}}\r\n    </div>\r\n  </div>\r\n  <br />\r\n\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/components/paymentautopay/payment-autopay.component.ts":
/*!************************************************************************!*\
  !*** ./src/app/components/paymentautopay/payment-autopay.component.ts ***!
  \************************************************************************/
/*! exports provided: PaymentAutopayComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PaymentAutopayComponent", function() { return PaymentAutopayComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_animations__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/animations */ "./src/app/services/animations.ts");
/* harmony import */ var _services_configuration_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/configuration.service */ "./src/app/services/configuration.service.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var _services_payment_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../services/payment.service */ "./src/app/services/payment.service.ts");
/* harmony import */ var _services_utilities__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../services/utilities */ "./src/app/services/utilities.ts");
/* harmony import */ var _services_invoice_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../services/invoice.service */ "./src/app/services/invoice.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var PaymentAutopayComponent = /** @class */ (function () {
    function PaymentAutopayComponent(configurations, location, paymentService, invoiceService, accountService) {
        this.configurations = configurations;
        this.location = location;
        this.paymentService = paymentService;
        this.invoiceService = invoiceService;
        this.accountService = accountService;
        this.errors = [];
        this.isTermsReviewed = false;
        this.isTermsVisible = false;
        this.isUnenrolling = false;
        this.canPayOnSite = true;
        this.isAutoPayActive = false;
        this.isEnrolling = false;
    }
    PaymentAutopayComponent.prototype.ngOnInit = function () {
        this.getPaymentMethods();
        this.invoiceService.getInvoicesToPay();
        this.isAutoPayEnabled = this.invoiceService.getOpenInvoicesTotal() <= 0;
        this.getSiteAccount();
    };
    PaymentAutopayComponent.prototype.getSiteAccount = function () {
        var _this = this;
        this.accountService.getAccount().subscribe(function (account) { return _this.saveSuccessHelper(account); }, function (error) { return _this.saveFailedHelper(error); });
    };
    PaymentAutopayComponent.prototype.saveSuccessHelper = function (res) {
        if (res.currency != 'USD' && res.currency != 'CAD')
            this.canPayOnSite = false;
    };
    PaymentAutopayComponent.prototype.saveFailedHelper = function (res) {
        this.canPayOnSite = true;
    };
    PaymentAutopayComponent.prototype.getPaymentMethods = function () {
        var _this = this;
        this.isLoading = true;
        this.paymentService.getPaymentMethods()
            .subscribe(function (data) { return _this.handleGetMethodsSuccess(data); }, function (err) { return _this.handleSubmitError(err); });
    };
    PaymentAutopayComponent.prototype.changeAutoPay = function (index) {
        if (!this.isAutoPayEnabled)
            return;
        this.paymentMethods.forEach(function (pm, i) {
            pm.currentAutoPayMethod = i == index;
        });
        this.isAutoPayActive = true;
        this.isEnrolling = true;
    };
    PaymentAutopayComponent.prototype.handleSubmitSuccess = function (res) {
        this.errors = [];
        this.isLoading = false;
        this.isTermsReviewed = false;
        this.isTermsVisible = false;
        this.getPaymentMethods();
        alert("You have successfully enrolled in Autopay");
        //this.location.back();
    };
    PaymentAutopayComponent.prototype.handleAutopaySubmitSuccess = function (res) {
        this.errors = [];
        this.isLoading = false;
        this.isTermsReviewed = false;
        this.isTermsVisible = false;
        this.getPaymentMethods();
        alert("AUTOPAY unenrollment requested - Please allow up to 72 hours to for AUTOPAY unenrollment to take affect. ");
    };
    PaymentAutopayComponent.prototype.handleGetMethodsSuccess = function (res) {
        this.errors = [];
        this.isLoading = false;
        this.paymentMethods = res;
        this.currentAutoPaymentMethod = res.find(function (pm) { return pm.currentAutoPayMethod; });
        this.isTermsReviewed = false;
        this.isTermsVisible = false;
        if (this.currentAutoPaymentMethod != null) {
            if (this.currentAutoPaymentMethod.isDefault) {
                this.isUnenrolling = true;
            }
            this.isAutoPayActive = true;
            this.isEnrolling = false;
        }
    };
    PaymentAutopayComponent.prototype.handleSubmitError = function (err) {
        var serverError = _services_utilities__WEBPACK_IMPORTED_MODULE_6__["Utilities"].getHttpErrors(err);
        this.errors = serverError;
        this.isLoading = false;
        this.isTermsReviewed = false;
        this.isTermsVisible = false;
    };
    PaymentAutopayComponent.prototype.saveAutoPay = function () {
        var _this = this;
        if (!this.isAutoPayEnabled)
            return;
        if (!this.isTermsReviewed) {
            this.isTermsReviewed = true;
            this.isTermsVisible = true;
            return;
        }
        this.isLoading = true;
        var method = this.paymentMethods.find(function (pm) { return pm.currentAutoPayMethod; });
        if (method == null) {
            method = this.currentAutoPaymentMethod;
            method.currentAutoPayMethod = false;
        }
        this.paymentService.savePaymentMethod(method).subscribe(function (data) { return _this.handleSubmitSuccess(data); }, function (error) { return _this.handleSubmitError(error); });
    };
    PaymentAutopayComponent.prototype.togglePopover = function (e) {
        this.isAutoEnrollPopoverVisible = !this.isAutoEnrollPopoverVisible;
        return this.isAutoEnrollPopoverVisible;
    };
    PaymentAutopayComponent.prototype.unenrollAutoPay = function () {
        //if (!this.isAutoPayEnabled)
        //  return;
        var _this = this;
        //this.paymentMethods.forEach(pm => pm.currentAutoPayMethod = false);
        this.currentAutoPaymentMethod.isDefault = true;
        this.paymentService.savePaymentMethod(this.currentAutoPaymentMethod).subscribe(function (data) { return _this.handleAutopaySubmitSuccess(data); }, function (error) { return _this.handleSubmitError(error); });
    };
    PaymentAutopayComponent.prototype.cancel = function () {
        this.isTermsReviewed = false;
        this.isTermsVisible = false;
        this.getPaymentMethods();
        this.invoiceService.getInvoicesToPay();
        this.isAutoPayEnabled = this.invoiceService.getOpenInvoicesTotal() <= 0;
        this.getSiteAccount();
    };
    PaymentAutopayComponent.prototype.refresh = function () {
        this.getPaymentMethods();
    };
    PaymentAutopayComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'payment-autopay',
            template: __webpack_require__(/*! ./payment-autopay.component.html */ "./src/app/components/paymentautopay/payment-autopay.component.html"),
            styles: [__webpack_require__(/*! ./payment-autopay.component.css */ "./src/app/components/paymentautopay/payment-autopay.component.css")],
            animations: [_services_animations__WEBPACK_IMPORTED_MODULE_1__["fadeInOut"]]
        }),
        __metadata("design:paramtypes", [_services_configuration_service__WEBPACK_IMPORTED_MODULE_2__["ConfigurationService"],
            _angular_common__WEBPACK_IMPORTED_MODULE_3__["Location"],
            _services_payment_service__WEBPACK_IMPORTED_MODULE_5__["PaymentService"],
            _services_invoice_service__WEBPACK_IMPORTED_MODULE_7__["InvoiceService"],
            _services_account_service__WEBPACK_IMPORTED_MODULE_4__["AccountService"]])
    ], PaymentAutopayComponent);
    return PaymentAutopayComponent;
}());



/***/ }),

/***/ "./src/app/components/paymentedit/payment-edit.component.css":
/*!*******************************************************************!*\
  !*** ./src/app/components/paymentedit/payment-edit.component.css ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/components/paymentedit/payment-edit.component.html":
/*!********************************************************************!*\
  !*** ./src/app/components/paymentedit/payment-edit.component.html ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container sa-container-minsize sa-header-margin-loggedin\">\r\n  <header class=\"pageHeader\"></header>\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-md-6\">\r\n      <div class=\"sa-heading-text\">\r\n        {{'PaymentProfile.PAYMENTPROFILE' | translate}}\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12 has-feedback has-error\">\r\n      <div *ngFor=\"let err of errors\" class=\"errorMessage\">{{ err | translate }}</div>\r\n    </div>\r\n  </div>\r\n\r\n\r\n  <form class=\"form-horizontal\"\r\n        name=\"editpaymenform\"\r\n        #f=\"ngForm\"\r\n        novalidate>\r\n\r\n\r\n\r\n    <div class=\"form-group\">\r\n      <div class=\"col-md-3 text-right\">\r\n        <label class=\"control-label\" for=\"paymentName\">  {{'PaymentProfile.FriendlyName' | translate}}<span class=\"sa-required-text\">*</span></label>\r\n      </div>\r\n      <div class=\"col-md-4\">\r\n        <div class=\"has-feedback\"\r\n             [ngClass]=\"{'has-success': paymentName.dirty && paymentName.valid, 'has-error' : paymentName.dirty && !paymentName.valid}\">\r\n          <input class=\"form-control\"\r\n                 id=\"paymentName\"\r\n                 name=\"paymentName\"\r\n                 type=\"text\"\r\n                 #paymentName=\"ngModel\"\r\n                 [(ngModel)]=\"paymentProfile.name\"\r\n                 required />\r\n          <span class=\"glyphicon form-control-feedback\"\r\n                [ngClass]=\"{'glyphicon-ok ': paymentName.valid, 'glyphicon-remove' : !paymentName.valid}\"\r\n                aria-hidden=\"true\"\r\n                *ngIf=\"f.submitted\"></span>\r\n          <span class=\"errorMessage\" *ngIf=\"paymentName.dirty && !paymentName.valid\">{{'PaymentProfile.InvalidProfilePaymentName' | translate}} {{paymentName?.messages}}</span>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group\">\r\n      <div class=\"col-md-3 text-right\">\r\n        <label class=\"control-label\" for=\"paymentType\">{{'PaymentProfile.PaymentType' | translate}}<span class=\"sa-required-text\">*</span></label>\r\n        <div class=\"has-feedback\"\r\n             [ngClass]=\"{'has-success': paymentType.dirty && paymentType.valid, 'has-error' : paymentType.dirty && !paymentType.valid}\">\r\n        </div>\r\n      </div>\r\n      <div class=\"col-md-6\">\r\n        <div style=\"margin-top: 6px;\">\r\n          <div class=\"sa-inline-field\" style=\"width: 100px; float: left;\">\r\n            <input class=\"form-control\"\r\n                   id=\"paymentType\"\r\n                   name=\"paymentType\"\r\n                   type=\"radio\"\r\n                   value=\"Credit\"\r\n                   style=\"width: 20px; height: 20px;\"\r\n                   #paymentType=\"ngModel\"\r\n                   [(ngModel)]=\"paymentProfile.paymentType\"\r\n                   (click)=\"changePaymentType('Credit')\"\r\n                   [disabled]=\"isEdit\"\r\n                   required />\r\n            <label style=\"margin-left: 8px; font-weight: normal;\" class=\"sa-gray-text\">{{'PaymentProfile.Credit' | translate}}</label>\r\n          </div>\r\n\r\n          <div class=\"sa-inline-field\" style=\"width: 100px; float: left;\">\r\n            <input class=\"form-control\"\r\n                   id=\"paymentType\"\r\n                   name=\"paymentType\"\r\n                   type=\"radio\"\r\n                   value=\"ECP\"\r\n                   style=\"width: 20px; height: 20px;\"\r\n                   #paymentType=\"ngModel\"\r\n                   [(ngModel)]=\"paymentProfile.paymentType\"\r\n                   (click)=\"changePaymentType('ECP')\"\r\n                   [disabled]=\"isEdit\"\r\n                   required />\r\n            <label style=\"margin-left: 8px; font-weight: normal;\" class=\"sa-gray-text\">{{'PaymentProfile.ACHandECP' | translate}}</label>\r\n          </div>\r\n        </div>\r\n\r\n        <span class=\"glyphicon form-control-feedback\"\r\n              [ngClass]=\"{'glyphicon-ok ': paymentType.valid, 'glyphicon-remove' : !paymentType.valid}\"\r\n              *ngIf=\"f.submitted\"\r\n              aria-hidden=\"true\"></span>\r\n        <span class=\"errorMessage\" *ngIf=\"paymentType.dirty && !paymentType.valid\">{{'PaymentProfile.InvalidPin' | translate}}</span>\r\n      </div>\r\n    </div>\r\n\r\n\r\n    <div class=\"form-group\" *ngIf=\"isAccount\">\r\n      <div class=\"col-md-3 text-right\">\r\n        <label class=\"control-label\" for=\"achAccountType\">{{'PaymentProfile.AccountType' | translate}}<span class=\"sa-required-text\">*</span></label>\r\n        <div class=\"has-feedback\"\r\n             [ngClass]=\"{'has-success': achAccountType.dirty && achAccountType.valid, 'has-error' : achAccountType.dirty && !achAccountType.valid}\">\r\n        </div>\r\n      </div>\r\n\r\n      <div class=\"col-md-6\">\r\n        <div style=\"margin-top: 6px; width: 100px; float: left;\">\r\n          <div class=\"sa-inline-field\">\r\n            <input class=\"form-control\"\r\n                   id=\"achAccountType\"\r\n                   name=\"achAccountType\"\r\n                   type=\"radio\"\r\n                   value=\"BusinessChecking\"\r\n                   style=\"width: 20px; height: 20px;\"\r\n                   #achAccountType=\"ngModel\"\r\n                   [(ngModel)]=\"paymentProfile.achAccountType\"\r\n                   [disabled]=\"isEdit\"\r\n                   required />\r\n            <label style=\"margin-left: 8px; font-weight: normal;\" class=\"sa-gray-text\">{{'PaymentProfile.BusinessChecking' | translate}}</label>\r\n          </div>\r\n        </div>\r\n\r\n        <div style=\"margin-top: 6px; width: 100px; float: left;\">\r\n          <div class=\"sa-inline-field\">\r\n            <input class=\"form-control\"\r\n                   id=\"achAccountType\"\r\n                   name=\"achAccountType\"\r\n                   type=\"radio\"\r\n                   value=\"Checking\"\r\n                   style=\"width: 20px; height: 20px;\"\r\n                   #achAccountType=\"ngModel\"\r\n                   [(ngModel)]=\"paymentProfile.achAccountType\"\r\n                   [disabled]=\"isEdit\"\r\n                   required />\r\n            <label style=\"margin-left: 8px; font-weight: normal;\" class=\"sa-gray-text\">{{'PaymentProfile.PersonalChecking' | translate}}</label>\r\n          </div>\r\n        </div>\r\n\r\n        <div style=\"margin-top: 6px; width: 150px; float: left;\">\r\n          <div class=\"sa-inline-field\">\r\n            <input class=\"form-control\"\r\n                   id=\"achAccountType\"\r\n                   name=\"achAccountType\"\r\n                   type=\"radio\"\r\n                   value=\"Savings\"\r\n                   style=\"width: 20px; height: 20px;\"\r\n                   #achAccountType=\"ngModel\"\r\n                   [(ngModel)]=\"paymentProfile.achAccountType\"\r\n                   [disabled]=\"isEdit\"\r\n                   required />\r\n            <label style=\"margin-left: 8px; font-weight: normal;\" class=\"sa-gray-text\">{{'PaymentProfile.Savings' | translate}}</label>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"form-group\" *ngIf=\"isAccount\">\r\n      <div class=\"col-md-3 text-right\">\r\n        <label class=\"control-label\" for=\"achAccountNumber\">{{'PaymentProfile.AccountNumber' | translate}}<span class=\"sa-required-text\">*</span></label>\r\n        <span class=\"fa fa-question-circle sa-enroll-auto-pay-button-info-icon sa-popup\" (mouseenter)=\"toggleAchAcctNoPopover($event)\" (mouseleave)=\"toggleAchAcctNoPopover($event)\">\r\n          <span class=\"sa-popuptext-b\" [class.sa-show]=\"isAchAcctNoPopoverVisible\" id=\"AchAcctNoPopover\"><img src=\"../../../assets/images/AcctNoImg.png\" /></span>\r\n        </span>\r\n      </div>\r\n\r\n\r\n      <div class=\"col-md-4\">\r\n        <div class=\"has-feedback\"\r\n             [ngClass]=\"{'has-success': achAccountNumber.dirty && achAccountNumber.valid, 'has-error' : achAccountNumber.dirty && !achAccountNumber.valid}\">\r\n          <input class=\"form-control\"\r\n                 id=\"achAccountNumber\"\r\n                 name=\"achAccountNumber\"\r\n                 type=\"text\"\r\n                 #achAccountNumber=\"ngModel\"\r\n                 [(ngModel)]=\"paymentProfile.achAccountNumber\"\r\n                 [disabled]=\"isEdit\"\r\n                 required />\r\n          <span class=\"glyphicon form-control-feedback\"\r\n                [ngClass]=\"{'glyphicon-ok ': achAccountNumber.valid, 'glyphicon-remove' : !achAccountNumber.valid}\"\r\n                aria-hidden=\"true\"\r\n                *ngIf=\"f.submitted\"></span>\r\n          <span class=\"errorMessage\" *ngIf=\"achAccountNumber.dirty && !achAccountNumber.valid\">{{'PaymentProfile.InvalidAccountNumber' | translate}} {{achAccountNumber?.messages}}</span>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group\" *ngIf=\"isAccount\">\r\n      <div class=\"col-md-3 text-right\">\r\n        <label class=\"control-label\" for=\"achRoutingNumber\">{{'PaymentProfile.RoutingNumber' | translate}}<span class=\"sa-required-text\">*</span></label>\r\n        <span class=\"fa fa-question-circle sa-enroll-auto-pay-button-info-icon sa-popup\" (mouseenter)=\"toggleRoutingNoPopover($event)\" (mouseleave)=\"toggleRoutingNoPopover($event)\">\r\n          <span class=\"sa-popuptext-b\" [class.sa-show]=\"isRoutingNoPopoverVisible\" id=\"RoutingNoPopover\"><img src=\"../../../assets/images/RoutingImg.png\" /></span>\r\n        </span>\r\n      </div>\r\n\r\n      <div class=\"col-md-4\">\r\n        <div class=\"has-feedback\"\r\n             [ngClass]=\"{'has-success': achRoutingNumber.dirty && achRoutingNumber.valid, 'has-error' : achRoutingNumber.dirty && !achRoutingNumber.valid}\">\r\n          <input class=\"form-control\"\r\n                 id=\"achRoutingNumber\"\r\n                 name=\"achRoutingNumber\"\r\n                 type=\"text\"\r\n                 #achRoutingNumber=\"ngModel\"\r\n                 [(ngModel)]=\"paymentProfile.achRoutingNumber\"\r\n                 [disabled]=\"isEdit\"\r\n                 required />\r\n          <span class=\"glyphicon form-control-feedback\"\r\n                [ngClass]=\"{'glyphicon-ok ': achRoutingNumber.valid, 'glyphicon-remove' : !achRoutingNumber.valid}\"\r\n                aria-hidden=\"true\"\r\n                *ngIf=\"f.submitted\"></span>\r\n          <span class=\"errorMessage\" *ngIf=\"achRoutingNumber.dirty && !achRoutingNumber.valid\">{{'PaymentProfile.InvalidRoutingNumber' | translate}} {{achRoutingNumber?.messages}}</span>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group\" *ngIf=\"isAccount\">\r\n      <div class=\"col-md-3 text-right\">\r\n        <label class=\"control-label\" for=\"bank\">{{'PaymentProfile.BankName' | translate}}<span class=\"sa-required-text\">*</span></label>\r\n      </div>\r\n\r\n      <div class=\"col-md-4\">\r\n        <div class=\"has-feedback\"\r\n             [ngClass]=\"{'has-success': bank.dirty && bank.valid, 'has-error' : bank.dirty && !bank.valid}\">\r\n          <input class=\"form-control\"\r\n                 id=\"bank\"\r\n                 name=\"bank\"\r\n                 type=\"text\"\r\n                 #bank=\"ngModel\"\r\n                 [(ngModel)]=\"paymentProfile.bank\"\r\n                 [disabled]=\"isEdit\"\r\n                 required />\r\n          <span class=\"glyphicon form-control-feedback\"\r\n                [ngClass]=\"{'glyphicon-ok ': bank.valid, 'glyphicon-remove' : !bank.valid}\"\r\n                aria-hidden=\"true\"\r\n                *ngIf=\"f.submitted\"></span>\r\n          <span class=\"errorMessage\" *ngIf=\"bank.dirty && !bank.valid\">{{'PaymentProfile.InvalidBankName' | translate}} {{bank?.messages}}</span>\r\n        </div>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"form-group\" *ngIf=\"!isAccount\">\r\n      <div class=\"col-md-3 text-right\">\r\n        <label class=\"control-label\" for=\"cardType\">{{'PaymentProfile.CardType' | translate}}<span class=\"sa-required-text\">*</span></label>\r\n        <div class=\"has-feedback\"\r\n             [ngClass]=\"{'has-success': cardType.valid, 'has-error' : !cardType.valid}\">\r\n        </div>\r\n      </div>\r\n\r\n      <div class=\"col-md-9\">\r\n        <div style=\"margin-top: 6px; width: 100px; float: left;\">\r\n          <div class=\"sa-inline-field\">\r\n            <input class=\"form-control\"\r\n                   id=\"cardType\"\r\n                   name=\"cardType\"\r\n                   type=\"radio\"\r\n                   value=\"Visa\"\r\n                   style=\"width: 20px; height: 20px;\"\r\n                   #cardType=\"ngModel\"\r\n                   [(ngModel)]=\"paymentProfile.cardType\"\r\n                   [disabled]=\"isEdit\"\r\n                   required />\r\n            <label style=\"margin-left: 8px; font-weight: normal;\" class=\"sa-gray-text\">{{'PaymentProfile.Visa' | translate}}</label>\r\n          </div>\r\n        </div>\r\n\r\n        <div style=\"margin-top: 6px; width: 150px; float: left;\">\r\n          <div class=\"sa-inline-field\">\r\n            <input class=\"form-control\"\r\n                   id=\"cardType\"\r\n                   name=\"cardType\"\r\n                   type=\"radio\"\r\n                   value=\"MasterCard\"\r\n                   style=\"width: 20px; height: 20px;\"\r\n                   #cardType=\"ngModel\"\r\n                   [(ngModel)]=\"paymentProfile.cardType\"\r\n                   [disabled]=\"isEdit\"\r\n                   required />\r\n            <label style=\"margin-left: 8px; font-weight: normal;\" class=\"sa-gray-text\">{{'PaymentProfile.MC' | translate}}</label>\r\n          </div>\r\n        </div>\r\n\r\n        <div style=\"margin-top: 6px; width: 150px; float: left;\">\r\n          <div class=\"sa-inline-field\">\r\n            <input class=\"form-control\"\r\n                   id=\"cardType\"\r\n                   name=\"cardType\"\r\n                   type=\"radio\"\r\n                   value=\"Discover\"\r\n                   style=\"width: 20px; height: 20px;\"\r\n                   #cardType=\"ngModel\"\r\n                   [(ngModel)]=\"paymentProfile.cardType\"\r\n                   [disabled]=\"isEdit\"\r\n                   required />\r\n            <label style=\"margin-left: 8px; font-weight: normal;\" class=\"sa-gray-text\">{{'PaymentProfile.Discover' | translate}}</label>\r\n          </div>\r\n        </div>\r\n\r\n        <div style=\"margin-top: 6px; width: 150px; float: left;\">\r\n          <div class=\"sa-inline-field\">\r\n            <input class=\"form-control\"\r\n                   id=\"cardType\"\r\n                   name=\"cardType\"\r\n                   type=\"radio\"\r\n                   value=\"AmericanExpress\"\r\n                   style=\"width: 20px; height: 20px;\"\r\n                   #cardType=\"ngModel\"\r\n                   [(ngModel)]=\"paymentProfile.cardType\"\r\n                   [disabled]=\"isEdit\"\r\n                   required />\r\n            <label style=\"margin-left: 8px; font-weight: normal;\" class=\"sa-gray-text\">{{'PaymentProfile.AMEX' | translate}}</label>\r\n          </div>\r\n        </div>\r\n\r\n        <div style=\"margin-top: 6px; width: 150px; float: left;\">\r\n          <div class=\"sa-inline-field\">\r\n            <input class=\"form-control\"\r\n                   id=\"cardType\"\r\n                   name=\"cardType\"\r\n                   type=\"radio\"\r\n                   value=\"JCB\"\r\n                   style=\"width: 20px; height: 20px;\"\r\n                   #cardType=\"ngModel\"\r\n                   [(ngModel)]=\"paymentProfile.cardType\"\r\n                   [disabled]=\"isEdit\"\r\n                   required />\r\n            <label style=\"margin-left: 8px; font-weight: normal;\" class=\"sa-gray-text\">{{'PaymentProfile.JCB' | translate}}</label>\r\n          </div>\r\n        </div>\r\n\r\n        <div style=\"margin-top: 6px; width: 150px; float: left;\">\r\n          <div class=\"sa-inline-field\">\r\n            <input class=\"form-control\"\r\n                   id=\"cardType\"\r\n                   name=\"cardType\"\r\n                   type=\"radio\"\r\n                   value=\"Diners\"\r\n                   style=\"width: 20px; height: 20px;\"\r\n                   #cardType=\"ngModel\"\r\n                   [(ngModel)]=\"paymentProfile.cardType\"\r\n                   [disabled]=\"isEdit\"\r\n                   required />\r\n            <label style=\"margin-left: 8px; font-weight: normal;\" class=\"sa-gray-text\">{{'PaymentProfile.DinersClub' | translate}}</label>\r\n          </div>\r\n        </div>\r\n\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group\" *ngIf=\"!isAccount\">\r\n      <div class=\"col-md-3 text-right\">\r\n        <label class=\"control-label\" for=\"cardNumber\">{{'PaymentProfile.CreditCardNumber' | translate}}<span class=\"sa-required-text\">*</span></label>\r\n      </div>\r\n\r\n      <div class=\"col-md-4\">\r\n        <div class=\"has-feedback\"\r\n             [ngClass]=\"{'has-success': cardNumber.dirty && cardNumber.valid, 'has-error' : cardNumber.dirty && !cardNumber.valid}\">\r\n          <input class=\"form-control\"\r\n                 id=\"cardNumber\"\r\n                 name=\"cardNumber\"\r\n                 type=\"text\"\r\n                 #cardNumber=\"ngModel\"\r\n                 [(ngModel)]=\"paymentProfile.cardNumber\"\r\n                 [disabled]=\"isEdit\"\r\n                 required\r\n                 pattern=\"((\\d{4}[\\s\\-]?){3}\\d{4})|(\\d{4}[\\s\\-]?\\d{6}[\\s\\-]?\\d{5})\" />\r\n          <span class=\"glyphicon form-control-feedback\"\r\n                [ngClass]=\"{'glyphicon-ok ': cardNumber.valid, 'glyphicon-remove' : !cardNumber.valid}\"\r\n                aria-hidden=\"true\"\r\n                *ngIf=\"f.submitted\"></span>\r\n          <span class=\"errorMessage\" *ngIf=\"cardNumber.dirty && !cardNumber.valid\">{{'PaymentProfile.InvalidCreditCardNumber' | translate}} {{cardNumber?.messages}}</span>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group\" *ngIf=\"!isAccount\">\r\n      <div class=\"col-md-3 text-right\">\r\n        <label class=\"control-label\" for=\"cardExpirationMonth\">{{'PaymentProfile.ExpirationDate' | translate}}<span class=\"sa-required-text\">*</span></label>\r\n      </div>\r\n\r\n      <div class=\"col-md-4\">\r\n        <div class=\"has-feedback\"\r\n             [ngClass]=\"{'has-success': (cardExpirationMonth.dirty && cardExpirationYear.dirty && (cardExpirationYear.value > thisYear || (cardExpirationYear.value == thisYear && cardExpirationMonth.value >= thisMonth))), 'has-error' : (cardExpirationMonth.dirty && cardExpirationMonth.value == 0) ||  (cardExpirationYear.dirty && cardExpirationYear.value == 0) || (cardExpirationMonth.dirty && cardExpirationYear.dirty && !(cardExpirationYear.value > thisYear || (cardExpirationYear.value == thisYear && cardExpirationMonth.value >= thisMonth)))}\">\r\n\r\n          <select class=\"form-control bootstrap-select\"\r\n                  style=\"width: 50px; float: left; margin-top: 3px; margin-bottom: 3px; padding-top:10px; padding-bottom:10px\"\r\n                  id=\"cardExpirationMonth\"\r\n                  name=\"cardExpirationMonth\"\r\n                  required\r\n                  #cardExpirationMonth=\"ngModel\"\r\n                  [(ngModel)]=\"paymentProfile.cardExpirationMonth\">\r\n            <option value=\"0\"></option>\r\n            <option value=\"1\">Jan</option>\r\n            <option value=\"2\">Feb</option>\r\n            <option value=\"3\">Mar</option>\r\n            <option value=\"4\">Apr</option>\r\n            <option value=\"5\">May</option>\r\n            <option value=\"6\">Jun</option>\r\n            <option value=\"7\">Jul</option>\r\n            <option value=\"8\">Aug</option>\r\n            <option value=\"9\">Sep</option>\r\n            <option value=\"10\">Oct</option>\r\n            <option value=\"11\">Nov</option>\r\n            <option value=\"12\">Dec</option>\r\n          </select>\r\n\r\n          <span style=\"width: 10px;\">&nbsp;</span>\r\n\r\n          <select class=\"form-control bootstrap-select\"\r\n                  style=\"width: 75px; margin-top: 3px; margin-bottom: 3px; padding-top:10px; padding-bottom:10px\"\r\n                  id=\"cardExpirationYear\"\r\n                  name=\"cardExpirationYear\"\r\n                  required\r\n                  #cardExpirationYear=\"ngModel\"\r\n                  [(ngModel)]=\"paymentProfile.cardExpirationYear\">\r\n            <option value=\"0\"></option>\r\n            <option value=\"2018\">2018</option>\r\n            <option value=\"2019\">2019</option>\r\n            <option value=\"2020\">2020</option>\r\n            <option value=\"2021\">2021</option>\r\n            <option value=\"2022\">2022</option>\r\n            <option value=\"2023\">2023</option>\r\n            <option value=\"2024\">2024</option>\r\n            <option value=\"2025\">2025</option>\r\n            <option value=\"2026\">2026</option>\r\n            <option value=\"2027\">2027</option>\r\n            <option value=\"2028\">2028</option>\r\n          </select>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group\" *ngIf=\"!isAccount\">\r\n      <div class=\"col-md-3 text-right\">\r\n        <label class=\"control-label\" for=\"cardCCV\">{{'PaymentProfile.CVV' | translate}}<span class=\"sa-required-text\">*</span></label>\r\n      </div>\r\n\r\n      <div class=\"col-md-4\">\r\n        <div class=\"has-feedback\"\r\n             [ngClass]=\"{'has-success': cardCCV.dirty && cardCCV.valid, 'has-error' : cardCCV.dirty && !cardCCV.valid}\">\r\n          <input class=\"form-control\"\r\n                 id=\"cardCCV\"\r\n                 name=\"cardCCV\"\r\n                 type=\"text\"\r\n                 #cardCCV=\"ngModel\"\r\n                 [(ngModel)]=\"paymentProfile.cardCCV\"\r\n                 [disabled]=\"isEdit\"\r\n                 required\r\n                 pattern=\"\\d{3,5}\" />\r\n          <span class=\"glyphicon form-control-feedback\"\r\n                [ngClass]=\"{'glyphicon-ok ': cardCCV.valid, 'glyphicon-remove' : !cardCCV.valid}\"\r\n                aria-hidden=\"true\"\r\n                *ngIf=\"f.submitted\"></span>\r\n          <span class=\"errorMessage\" *ngIf=\"cardCCV.dirty && !cardCCV.valid\">{{'PaymentProfile.InvalidCVV' | translate}} {{cardCCV?.messages}}</span>\r\n        </div>\r\n      </div>\r\n\r\n    </div>\r\n\r\n\r\n    <div class=\"form-group\">\r\n      <div class=\"col-md-3 text-right\">\r\n        <label class=\"control-label\" for=\"billToName\">{{'PaymentProfile.NameOnAccount' | translate}}<span class=\"sa-required-text\">*</span></label>\r\n      </div>\r\n\r\n      <div class=\"col-md-4\">\r\n        <div class=\"has-feedback\"\r\n             [ngClass]=\"{'has-success': billToName.dirty && billToName.valid, 'has-error' : billToName.dirty && !billToName.valid}\">\r\n          <input class=\"form-control\"\r\n                 id=\"billToName\"\r\n                 name=\"billToName\"\r\n                 type=\"text\"\r\n                 #billToName=\"ngModel\"\r\n                 [(ngModel)]=\"paymentProfile.paymentBillToName\"\r\n                 [disabled]=\"isEdit\"\r\n                 required />\r\n          <span class=\"glyphicon form-control-feedback\"\r\n                [ngClass]=\"{'glyphicon-ok ': billToName.valid, 'glyphicon-remove' : !billToName.valid}\"\r\n                aria-hidden=\"true\"\r\n                *ngIf=\"f.submitted\"></span>\r\n          <span class=\"errorMessage\" *ngIf=\"billToName.dirty && !billToName.valid\">{{'PaymentProfile.InvalidName' | translate}} {{name?.messages}}</span>\r\n        </div>\r\n      </div>\r\n\r\n    </div>\r\n    <div class=\"form-group\">\r\n      <div class=\"col-md-3 text-right\">\r\n        <label class=\"control-label\" for=\"address_line1\">{{'PaymentProfile.Address' | translate}}<span class=\"sa-required-text\">*</span></label>\r\n      </div>\r\n      <div class=\"col-md-4\">\r\n        <div class=\"has-feedback\"\r\n             [ngClass]=\"{'has-success': address_line1.dirty && address_line1.valid, 'has-error' : address_line1.dirty && !address_line1.valid}\">\r\n          <input class=\"form-control\"\r\n                 id=\"address_line1\"\r\n                 name=\"address_line1\"\r\n                 type=\"text\"\r\n                 #address_line1=\"ngModel\"\r\n                 [(ngModel)]=\"paymentProfile.address.line1\"\r\n                 required />\r\n          <span class=\"glyphicon form-control-feedback\"\r\n                [ngClass]=\"{'glyphicon-ok ': address_line1.valid, 'glyphicon-remove' : !address_line1.valid}\"\r\n                aria-hidden=\"true\"\r\n                *ngIf=\"f.submitted\"></span>\r\n          <span class=\"errorMessage\" *ngIf=\"address_line1.dirty && !address_line1.valid\">{{'PaymentProfile.InvalidAddress' | translate}} {{address_line1?.messages}}</span>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group\">\r\n      <div class=\"col-md-3 text-right\">\r\n        <label class=\"control-label\" for=\"address_line2\">{{'PaymentProfile.Address2' | translate}}<span class=\"sa-required-text\"></span></label>\r\n      </div>\r\n      <div class=\"col-md-4\">\r\n        <div class=\"has-feedback\">\r\n          <input class=\"form-control\"\r\n                 id=\"address_line2\"\r\n                 name=\"address_line2\"\r\n                 type=\"text\"\r\n                 #address_line2=\"ngModel\"\r\n                 [(ngModel)]=\"paymentProfile.address.line2\" />\r\n          <span class=\"glyphicon form-control-feedback\"\r\n                [ngClass]=\"{'glyphicon-ok ': address_line2.valid, 'glyphicon-remove' : !address_line2.valid}\"\r\n                aria-hidden=\"true\"\r\n                *ngIf=\"f.submitted\"></span>\r\n          <span class=\"errorMessage\" *ngIf=\"address_line2.dirty && !address_line2.valid\">{{'PaymentProfile.InvalidAddress' | translate}} {{address_line2?.messages}}</span>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group\">\r\n      <div class=\"col-md-3 text-right\">\r\n        <label class=\"control-label\" for=\"address_line3\">{{'PaymentProfile.Address3' | translate}}<span class=\"sa-required-text\"></span></label>\r\n      </div>\r\n      <div class=\"col-md-4\">\r\n        <div class=\"has-feedback\">\r\n          <input class=\"form-control\"\r\n                 id=\"address_line3\"\r\n                 name=\"address_line3\"\r\n                 type=\"text\"\r\n                 #address_line3=\"ngModel\"\r\n                 [(ngModel)]=\"paymentProfile.address.line3\" />\r\n          <span class=\"glyphicon form-control-feedback\"\r\n                [ngClass]=\"{'glyphicon-ok ': address_line3.valid, 'glyphicon-remove' : !address_line3.valid}\"\r\n                aria-hidden=\"true\"\r\n                *ngIf=\"f.submitted\"></span>\r\n          <span class=\"errorMessage\" *ngIf=\"address_line3.dirty && !address_line3.valid\">{{'PaymentProfile.InvalidAddress' | translate}} {{address_line3?.messages}}</span>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group\">\r\n      <div class=\"col-md-3 text-right\">\r\n        <label class=\"control-label\" for=\"address_city\">{{'PaymentProfile.City' | translate}}<span class=\"sa-required-text\">*</span></label>\r\n      </div>\r\n      <div class=\"col-md-4\">\r\n        <div class=\"has-feedback\"\r\n             [ngClass]=\"{'has-success': address_city.dirty && address_city.valid, 'has-error' : address_city.dirty && !address_city.valid}\">\r\n          <input class=\"form-control\"\r\n                 id=\"address_city\"\r\n                 name=\"address_city\"\r\n                 type=\"text\"\r\n                 #address_city=\"ngModel\"\r\n                 [(ngModel)]=\"paymentProfile.address.municipality\"\r\n                 required />\r\n          <span class=\"glyphicon form-control-feedback\"\r\n                [ngClass]=\"{'glyphicon-ok ': address_city.valid, 'glyphicon-remove' : !address_city.valid}\"\r\n                aria-hidden=\"true\"\r\n                *ngIf=\"f.submitted\"></span>\r\n          <span class=\"errorMessage\" *ngIf=\"address_city.dirty && !address_city.valid\">{{'PaymentProfile.InvalidCity' | translate}} {{address_city?.messages}}</span>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group\" *ngIf=\"isUS\">\r\n      <div class=\"col-md-3 text-right\">\r\n        <label class=\"control-label\" for=\"address_state\">{{'PaymentProfile.StateOrProvince' | translate}}<span class=\"sa-required-text\">*</span></label>\r\n      </div>\r\n      <div class=\"col-md-4\">\r\n        <div class=\"has-feedback\"\r\n             [ngClass]=\"{'has-success': address_state.dirty && address_state.valid, 'has-error' : address_state.dirty && !address_state.valid}\">\r\n          <select class=\"form-control bootstrap-select\"\r\n                  style=\"width: 150px; float: left; margin-top: 3px; margin-bottom: 3px; padding-top:10px; padding-bottom:10px\"\r\n                  id=\"address_state\"\r\n                  name=\"address_state\"\r\n                  required\r\n                  #address_state=\"ngModel\"\r\n                  [(ngModel)]=\"paymentProfile.address.stateOrProvince\">\r\n            <option value=\"AL\">Alabama</option>\r\n            <option value=\"AK\">Alaska</option>\r\n            <option value=\"AZ\">Arizona</option>\r\n            <option value=\"AR\">Arkansas</option>\r\n            <option value=\"CA\">California</option>\r\n            <option value=\"CO\">Colorado</option>\r\n            <option value=\"CT\">Connecticut</option>\r\n            <option value=\"DE\">Delaware</option>\r\n            <option value=\"DC\">District Of Columbia</option>\r\n            <option value=\"FL\">Florida</option>\r\n            <option value=\"GA\">Georgia</option>\r\n            <option value=\"HI\">Hawaii</option>\r\n            <option value=\"ID\">Idaho</option>\r\n            <option value=\"IL\">Illinois</option>\r\n            <option value=\"IN\">Indiana</option>\r\n            <option value=\"IA\">Iowa</option>\r\n            <option value=\"KS\">Kansas</option>\r\n            <option value=\"KY\">Kentucky</option>\r\n            <option value=\"LA\">Louisiana</option>\r\n            <option value=\"ME\">Maine</option>\r\n            <option value=\"MD\">Maryland</option>\r\n            <option value=\"MA\">Massachusetts</option>\r\n            <option value=\"MI\">Michigan</option>\r\n            <option value=\"MN\">Minnesota</option>\r\n            <option value=\"MS\">Mississippi</option>\r\n            <option value=\"MO\">Missouri</option>\r\n            <option value=\"MT\">Montana</option>\r\n            <option value=\"NE\">Nebraska</option>\r\n            <option value=\"NV\">Nevada</option>\r\n            <option value=\"NH\">New Hampshire</option>\r\n            <option value=\"NJ\">New Jersey</option>\r\n            <option value=\"NM\">New Mexico</option>\r\n            <option value=\"NY\">New York</option>\r\n            <option value=\"NC\">North Carolina</option>\r\n            <option value=\"ND\">North Dakota</option>\r\n            <option value=\"OH\">Ohio</option>\r\n            <option value=\"OK\">Oklahoma</option>\r\n            <option value=\"OR\">Oregon</option>\r\n            <option value=\"PA\">Pennsylvania</option>\r\n            <option value=\"RI\">Rhode Island</option>\r\n            <option value=\"SC\">South Carolina</option>\r\n            <option value=\"SD\">South Dakota</option>\r\n            <option value=\"TN\">Tennessee</option>\r\n            <option value=\"TX\">Texas</option>\r\n            <option value=\"UT\">Utah</option>\r\n            <option value=\"VT\">Vermont</option>\r\n            <option value=\"VA\">Virginia</option>\r\n            <option value=\"WA\">Washington</option>\r\n            <option value=\"WV\">West Virginia</option>\r\n            <option value=\"WI\">Wisconsin</option>\r\n            <option value=\"WY\">Wyoming</option>\r\n\r\n          </select>\r\n\r\n          <span class=\"glyphicon form-control-feedback\"\r\n                [ngClass]=\"{'glyphicon-ok ': address_state.valid, 'glyphicon-remove' : !address_state.valid}\"\r\n                aria-hidden=\"true\"\r\n                *ngIf=\"f.submitted\"></span>\r\n          <span class=\"errorMessage\" *ngIf=\"address_state.dirty && !address_state.valid\">{{'PaymentProfile.InvalidState' | translate}} {{address_state?.messages}}</span>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group\" *ngIf=\"!isUS\">\r\n      <div class=\"col-md-3 text-right\">\r\n        <label class=\"control-label\" for=\"address_state\">{{'PaymentProfile.StateOrProvince' | translate}}<span class=\"sa-required-text\">*</span></label>\r\n      </div>\r\n      <div class=\"col-md-4\">\r\n        <div class=\"has-feedback\"\r\n             [ngClass]=\"{'has-success': address_state.dirty && address_state.valid, 'has-error' : address_state.dirty && !address_state.valid}\">\r\n          <select class=\"form-control bootstrap-select\"\r\n                  style=\"width: 150px; float: left; margin-top: 3px; margin-bottom: 3px; padding-top:10px; padding-bottom:10px\"\r\n                  id=\"address_state\"\r\n                  name=\"address_state\"\r\n                  required\r\n                  #address_state=\"ngModel\"\r\n                  [(ngModel)]=\"paymentProfile.address.stateOrProvince\">\r\n            <option value=\"AB\">Alberta</option>\r\n            <option value=\"BC\">British Columbia</option>\r\n            <option value=\"MB\">Manitoba</option>\r\n            <option value=\"NB\">New Brunswick</option>\r\n            <option value=\"NL\">Newfoundland and Labrador</option>\r\n            <option value=\"NS\">Nova Scotia</option>\r\n            <option value=\"ON\">Ontario</option>\r\n            <option value=\"PE\">Prince Edward Island</option>\r\n            <option value=\"QC\">Quebec</option>\r\n            <option value=\"SK\">Saskatchewan</option>\r\n            <option value=\"NT\">Northwest Territories</option>\r\n            <option value=\"NU\">Nunavut</option>\r\n\r\n          </select>\r\n\r\n          <span class=\"glyphicon form-control-feedback\"\r\n                [ngClass]=\"{'glyphicon-ok ': address_state.valid, 'glyphicon-remove' : !address_state.valid}\"\r\n                aria-hidden=\"true\"\r\n                *ngIf=\"f.submitted\"></span>\r\n          <span class=\"errorMessage\" *ngIf=\"address_state.dirty && !address_state.valid\">{{'PaymentProfile.InvalidState' | translate}} {{address_state?.messages}}</span>\r\n        </div>\r\n      </div>\r\n    </div>\r\n\r\n\r\n    <div class=\"form-group\">\r\n      <div class=\"col-md-3 text-right\">\r\n        <label class=\"control-label\" for=\"address_zip\">{{'PaymentProfile.PostalCode' | translate}}<span class=\"sa-required-text\">*</span></label>\r\n      </div>\r\n      <div class=\"col-md-4\">\r\n        <div class=\"has-feedback\"\r\n             [ngClass]=\"{'has-success': address_zip.dirty && address_zip.valid, 'has-error' : address_zip.dirty && !address_zip.valid}\">\r\n          <input class=\"form-control\"\r\n                 id=\"address_zip\"\r\n                 name=\"address_zip\"\r\n                 type=\"text\"\r\n                 #address_zip=\"ngModel\"\r\n                 [(ngModel)]=\"paymentProfile.address.postalCode\"\r\n                 required\r\n                 minlength=\"5\" />\r\n          <span class=\"glyphicon form-control-feedback\"\r\n                [ngClass]=\"{'glyphicon-ok ': address_zip.valid, 'glyphicon-remove' : !address_zip.valid}\"\r\n                aria-hidden=\"true\"\r\n                *ngIf=\"f.submitted\"></span>\r\n          <span class=\"errorMessage\" *ngIf=\"address_zip.dirty && !address_zip.valid\">{{'PaymentProfile.InvalidPostalCode' | translate}} {{address_zip?.messages}}</span>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group\">\r\n      <div class=\"col-md-3 text-right\">\r\n        <label class=\"control-label\" for=\"address_country\">{{'PaymentProfile.Country' | translate}}<span class=\"sa-required-text\">*</span></label>\r\n      </div>\r\n      <div class=\"col-md-4\">\r\n        <div class=\"has-feedback\"\r\n             [ngClass]=\"{'has-success': address_country.dirty && address_country.valid, 'has-error' : address_country.dirty && !address_country.valid}\">\r\n          <select class=\"form-control bootstrap-select\"\r\n                  style=\"width: 150px; float: left; margin-top: 3px; margin-bottom: 3px; padding-top:10px; padding-bottom:10px\"\r\n                  id=\"address_country\"\r\n                  name=\"address_country\"\r\n                  required\r\n                  (change)=\"changeCountry($event.target.value)\"\r\n                  #address_country=\"ngModel\"\r\n                  [(ngModel)]=\"paymentProfile.address.country\">\r\n            <option value=\"CA\">Canada</option>\r\n            <option value=\"US\" selected>United States</option>\r\n          </select>\r\n          <span class=\"glyphicon form-control-feedback\"\r\n                [ngClass]=\"{'glyphicon-ok ': address_country.valid, 'glyphicon-remove' : !address_country.valid}\"\r\n                aria-hidden=\"true\"\r\n                *ngIf=\"f.submitted\"></span>\r\n          <span class=\"errorMessage\" *ngIf=\"address_country.dirty && !address_country.valid\">{{'PaymentProfile.InvalidCountry' | translate}} {{address_country?.messages}}</span>\r\n        </div>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"form-group\" *ngIf=\"isAutoEnabled\">\r\n      <div class=\"col-md-3 text-right\">\r\n        <label class=\"control-label\" for=\"currentAutoPayMethod\">{{'PaymentProfile.AutoPay' | translate}}</label>\r\n      </div>\r\n      <div class=\"col-md-4\">\r\n        <div class=\"has-feedback\"\r\n             [ngClass]=\"{'has-success': isAutoEnabled, 'has-error' : !isAutoEnabled}\">\r\n          <input class=\"form-control\"\r\n                 id=\"currentAutoPayMethod\"\r\n                 name=\"currentAutoPayMethod\"\r\n                 type=\"checkbox\"\r\n                 value=\"true\"\r\n                 [disabled]=\"!isAutoEnabled\"\r\n                 #currentAutoPayMethod=\"ngModel\"\r\n                 [(ngModel)]=\"paymentProfile.currentAutoPayMethod\" />\r\n          <span class=\"glyphicon form-control-feedback\"\r\n                [ngClass]=\"{'glyphicon-ok ': isAutoEnabled, 'glyphicon-remove' : (!isAutoEnabled && currentAutoPayMethod) }\"\r\n                aria-hidden=\"true\"\r\n                *ngIf=\"f.dirty\"></span>\r\n          <span class=\"errorMessage\" *ngIf=\"!isAutoEnabled\">{{'PaymentProfile.AutoPayDisabledDesc' | translate}}</span>\r\n        </div>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"form-group\" *ngIf=\"!isEdit\">\r\n      <div class=\"col-md-3 text-right\">\r\n      </div>\r\n      <div class=\"col-md-4 text-right\">\r\n        <ngx-recaptcha2 #captchaElem\r\n                        [siteKey]=\"siteKey\"\r\n                        (reset)=\"captchaHandleReset()\"\r\n                        (expire)=\"captchaHandleExpire()\"\r\n                        (load)=\"captchaHandleLoad()\"\r\n                        (success)=\"CaptchaHandleSuccess($event)\"\r\n                        [useGlobalDomain]=\"useGlobalDomain\"\r\n                        [size]=\"size\"\r\n                        [hl]=\"selectedLanguage\"\r\n                        [theme]=\"theme\"\r\n                        [type]=\"type\" [(ngModel)]=\"paymentProfile.captcha\" [ngModelOptions]=\"{standalone: true}\">\r\n        </ngx-recaptcha2>\r\n\r\n      </div>\r\n    </div>\r\n\r\n    <br />\r\n    <div class=\"row\">\r\n      <div class=\"col-md-12\">\r\n        <button class=\"btn-primary btn btn-lg sa-btn-header-color\" *ngIf=\"!isEdit\"\r\n                [disabled]=\"(isLoading || !f.dirty || (f.dirty && !f.valid) || !captchaSuccess)\"\r\n                (click)=\"savePayment();\">\r\n          {{'PaymentProfile.SAVE' | translate}}\r\n        </button>&nbsp;\r\n\r\n        <button class=\"btn-primary btn btn-lg sa-btn-header-color\" *ngIf=\"isEdit\"\r\n                [disabled]=\"(isLoading || !f.dirty || (f.dirty && !f.valid))\"\r\n                (click)=\"savePayment();\">\r\n          {{'PaymentProfile.SAVE' | translate}}\r\n        </button>&nbsp;\r\n\r\n        <button class=\"btn-primary btn btn-lg sa-btn-header-color\"\r\n                [disabled]=\"(isLoading || !isEdit || paymentProfile.currentAutoPayMethod)\"\r\n                (click)=\"deletePayment();\">\r\n          {{'PaymentProfile.DELETE' | translate}}\r\n        </button>&nbsp;\r\n        <button (click)=\"cancel()\" class=\"btn-primary btn btn-lg sa-btn-header-color\">{{'PaymentProfile.CANCEL' | translate}}</button>\r\n      </div>\r\n    </div>\r\n  </form>\r\n\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/components/paymentedit/payment-edit.component.ts":
/*!******************************************************************!*\
  !*** ./src/app/components/paymentedit/payment-edit.component.ts ***!
  \******************************************************************/
/*! exports provided: PaymentEditComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PaymentEditComponent", function() { return PaymentEditComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_animations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/animations */ "./src/app/services/animations.ts");
/* harmony import */ var _services_configuration_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/configuration.service */ "./src/app/services/configuration.service.ts");
/* harmony import */ var _services_payment_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/payment.service */ "./src/app/services/payment.service.ts");
/* harmony import */ var _models_payment_profile_model__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../models/payment-profile.model */ "./src/app/models/payment-profile.model.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var _services_utilities__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../services/utilities */ "./src/app/services/utilities.ts");
/* harmony import */ var _services_invoice_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../services/invoice.service */ "./src/app/services/invoice.service.ts");
/* harmony import */ var _GoogleCaptcha_ngx_captcha_lib_src_lib__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../GoogleCaptcha/ngx-captcha-lib/src/lib */ "./GoogleCaptcha/ngx-captcha-lib/src/lib/index.ts");
/* harmony import */ var _services_language_observable_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../services/language-observable.service */ "./src/app/services/language-observable.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









//import { element } from "@angular/core/src/render3/instructions";



var PaymentEditComponent = /** @class */ (function () {
    function PaymentEditComponent(location, paymentService, invoiceService, configurations, accountService, route, router, userInfoService) {
        this.location = location;
        this.paymentService = paymentService;
        this.invoiceService = invoiceService;
        this.configurations = configurations;
        this.accountService = accountService;
        this.route = route;
        this.router = router;
        this.userInfoService = userInfoService;
        this.errors = [];
        this.isUS = true;
        this.currency = "USD";
        this.selectedLanguage = "en";
        this.captchaIsLoaded = false;
        this.captchaSuccess = false;
        this.captchaIsExpired = false;
        this.siteKey = '';
        this.useGlobalDomain = false;
    }
    PaymentEditComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Prod
        this.siteKey = '6LforZoUAAAAAJPt4NAqNpmu5rvY_zsfzNigCAsn';
        //Stage
        // this.siteKey = '6LdSmZgUAAAAAA-RJe4UxWSoYMx9_lrHsah1P8xT';
        //Local
        //  this.siteKey = '6LdNz5cUAAAAAIO1jk77YhsJdZspLzqxC4U8kLSH';
        this.isAccount = false;
        this.isLoading = false;
        this.isEdit = false;
        this.invoiceService.getInvoicesToPay();
        this.isAutoEnabled = false;
        this.getSiteAccount();
        var autoPay = this.route.snapshot.fragment != null && this.route.snapshot.fragment.toLowerCase() == 'auto';
        this.isAutoPayChecked = autoPay;
        var id = this.route.snapshot.paramMap.get('id');
        this.id = id;
        this.paymentProfile = new _models_payment_profile_model__WEBPACK_IMPORTED_MODULE_5__["PaymentProfile"]();
        this.paymentProfile.paymentType = "Credit";
        //this.paymentProfile.currentAutoPayMethod = this.isAutoEnabled && this.isAutoPayChecked;
        this.now = new Date(Date.now());
        this.thisMonth = this.now.getMonth();
        this.thisYear = this.now.getFullYear();
        if (id) {
            this.paymentService.getPaymentMethod(id)
                .subscribe(function (data) { return _this.handleGetSuccess(data); }, function (err) { return _this.handleSubmitError(err); });
        }
        else {
            //this.accountService.getAccount().subscribe(x => {
            //  this.paymentProfile.name = x.name;
            //  this.paymentProfile.address = x.address;
            //});
        }
        this.userInfoService.languageStream$.subscribe(function (lang) {
            if (_this.selectedLanguage != lang) {
                _this.selectedLanguage = lang;
            }
        });
    };
    PaymentEditComponent.prototype.getSiteAccount = function () {
        var _this = this;
        this.accountService.getAccount().subscribe(function (account) { return _this.saveSuccessHelper(account); }, function (error) { return _this.saveFailedHelper(error); });
    };
    PaymentEditComponent.prototype.saveSuccessHelper = function (res) {
        if (res.currency != 'USD' && res.currency != 'CAD')
            this.router.navigate(['secure/landing']);
        else
            this.currency = res.currency;
    };
    PaymentEditComponent.prototype.saveFailedHelper = function (res) {
        this.router.navigate(['secure/landing']);
    };
    PaymentEditComponent.prototype.changeCountry = function (currCode) {
        if (currCode == 'US')
            this.isUS = true;
        else
            this.isUS = false;
    };
    PaymentEditComponent.prototype.changePaymentType = function (paymentType) {
        if (paymentType == 'ECP') {
            this.isAccount = true;
            this.paymentProfile.cardCCV = '';
            this.paymentProfile.cardExpirationMonth = '';
            this.paymentProfile.cardExpirationYear = '';
            this.paymentProfile.cardNumber = '';
            this.paymentProfile.cardType == '';
        }
        else {
            this.isAccount = false;
            this.paymentProfile.achAccountType = '';
            this.paymentProfile.achAccountNumber = '';
            this.paymentProfile.achRoutingNumber = '';
            this.paymentProfile.bank = '';
        }
    };
    PaymentEditComponent.prototype.handleGetSuccess = function (res) {
        this.errors = [];
        this.isLoading = false;
        this.isEdit = true;
        this.paymentProfile = res;
        this.changePaymentType(res.paymentType);
        this.changeCountry(res.address.country);
    };
    PaymentEditComponent.prototype.handleSubmitSuccess = function (res) {
        this.errors = [];
        this.isLoading = false;
        this.location.back();
    };
    PaymentEditComponent.prototype.handleDeleteSuccess = function (res) {
        this.errors = [];
        this.isLoading = false;
        this.location.back();
    };
    PaymentEditComponent.prototype.handleSubmitError = function (err) {
        var serverError = _services_utilities__WEBPACK_IMPORTED_MODULE_8__["Utilities"].getHttpErrors(err);
        this.errors = serverError;
        this.isLoading = false;
        this.captchaReset();
    };
    PaymentEditComponent.prototype.cancel = function () {
        this.location.back();
    };
    PaymentEditComponent.prototype.savePayment = function () {
        var _this = this;
        this.isLoading = true;
        this.paymentProfile.currency = this.currency;
        this.paymentService.savePaymentProfile(this.paymentProfile)
            .subscribe(function (data) { return _this.handleSubmitSuccess(data); }, function (err) { return _this.handleSubmitError(err); });
    };
    PaymentEditComponent.prototype.deletePayment = function () {
        var _this = this;
        this.isLoading = true;
        this.paymentService.deletePaymentProfile(this.paymentProfile.id)
            .subscribe(function (data) { return _this.handleDeleteSuccess(data); }, function (err) { return _this.handleSubmitError(err); });
    };
    PaymentEditComponent.prototype.toggleAchAcctNoPopover = function (e) {
        this.isAchAcctNoPopoverVisible = !this.isAchAcctNoPopoverVisible;
        return this.isAchAcctNoPopoverVisible;
    };
    PaymentEditComponent.prototype.toggleRoutingNoPopover = function (e) {
        this.isRoutingNoPopoverVisible = !this.isRoutingNoPopoverVisible;
        return this.isRoutingNoPopoverVisible;
    };
    PaymentEditComponent.prototype.captchaReset = function () {
        this.captchaElem.resetCaptcha();
    };
    PaymentEditComponent.prototype.CaptchaHandleSuccess = function (captchaResponse) {
        this.captchaSuccess = true;
        this.captchaResponse = captchaResponse;
        this.captchaIsExpired = false;
    };
    PaymentEditComponent.prototype.captchaHandleLoad = function () {
        this.captchaIsLoaded = true;
        this.captchaIsExpired = false;
    };
    PaymentEditComponent.prototype.captchaHandleExpire = function () {
        this.captchaSuccess = false;
        this.captchaIsExpired = true;
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('captchaElem'),
        __metadata("design:type", _GoogleCaptcha_ngx_captcha_lib_src_lib__WEBPACK_IMPORTED_MODULE_10__["ReCaptcha2Component"])
    ], PaymentEditComponent.prototype, "captchaElem", void 0);
    PaymentEditComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'payment-edit',
            template: __webpack_require__(/*! ./payment-edit.component.html */ "./src/app/components/paymentedit/payment-edit.component.html"),
            styles: [__webpack_require__(/*! ./payment-edit.component.css */ "./src/app/components/paymentedit/payment-edit.component.css")],
            animations: [_services_animations__WEBPACK_IMPORTED_MODULE_2__["fadeInOut"]]
        }),
        __metadata("design:paramtypes", [_angular_common__WEBPACK_IMPORTED_MODULE_6__["Location"],
            _services_payment_service__WEBPACK_IMPORTED_MODULE_4__["PaymentService"],
            _services_invoice_service__WEBPACK_IMPORTED_MODULE_9__["InvoiceService"],
            _services_configuration_service__WEBPACK_IMPORTED_MODULE_3__["ConfigurationService"],
            _services_account_service__WEBPACK_IMPORTED_MODULE_7__["AccountService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"],
            _services_language_observable_service__WEBPACK_IMPORTED_MODULE_11__["LanguageObservableService"]])
    ], PaymentEditComponent);
    return PaymentEditComponent;
}());



/***/ }),

/***/ "./src/app/components/paymentpaynow/payment-paynow.component.css":
/*!***********************************************************************!*\
  !*** ./src/app/components/paymentpaynow/payment-paynow.component.css ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/components/paymentpaynow/payment-paynow.component.html":
/*!************************************************************************!*\
  !*** ./src/app/components/paymentpaynow/payment-paynow.component.html ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container sa-container-minsize sa-header-margin-loggedin\">\r\n  <header class=\"pageHeader\"></header>\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      <div class=\"sa-heading-text\">\r\n        Pay Now\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12 has-feedback has-error\">\r\n      <div *ngFor=\"let err of errors\" class=\"errorMessage\">{{ err | translate }}</div>\r\n    </div>\r\n  </div>\r\n\r\n\r\n  <br />\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      <div style=\"font-style: italic; font-weight: bold; margin-bottom: 4px;\">\r\n        {{ 'PayNow.PaymentInvoices' | translate }}\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      <table class=\"table table-bordered table-striped\">\r\n        <thead>\r\n          <tr style=\"background-color: #D3D3D3;\">\r\n            <th style=\"text-align: center;\">\r\n              {{ 'PayNow.InvoiceNumber' | translate }}\r\n            </th>\r\n            <th style=\"text-align: center;\">\r\n              {{ 'PayNow.DueDate' | translate }}\r\n            </th>\r\n            <th style=\"text-align: center;\">\r\n              {{ 'PayNow.InvoiceAmount' | translate }}\r\n            </th>\r\n            <th style=\"text-align: center;\">\r\n              {{ 'PayNow.PaymentAmount' | translate }}\r\n            </th>\r\n          </tr>\r\n        </thead>\r\n        <tbody>\r\n          <ng-container *ngFor=\"let invoice of this.invoicesToPay\">\r\n            <tr>\r\n              <td>\r\n                {{invoice.invoiceNumber}}\r\n              </td>\r\n              <td align=\"center\">\r\n                {{formatDate(invoice.dateDue)}}\r\n              </td>\r\n              <td align=\"right\">\r\n                {{formatAmount(invoice.totalAmount)}} {{invoice.currency}}\r\n              </td>\r\n              <td align=\"right\">\r\n                {{formatAmount(invoice.userPaymentAmount)}} {{invoice.currency}}\r\n              </td>\r\n            </tr>\r\n\r\n          </ng-container>\r\n\r\n        </tbody>\r\n      </table>\r\n\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12 text-right\">\r\n      <span style=\"font-size: x-large;\">\r\n        {{ 'PayNow.TotalPaymentAmount' | translate }} {{ formatAmount(selectedPaymentAmount) }} {{ invoiceCurrency }}\r\n      </span>\r\n    </div>\r\n  </div>\r\n  <br />\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      <div style=\"font-style: italic; font-weight: bold;\">\r\n        {{ 'PayNow.SelectPaymentMethod' | translate }} <a routerLink=\"/secure/payment\">{{ 'PayNow.SetupNewProfile' | translate }}</a>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <br />\r\n\r\n  <br />\r\n  <ng-container *ngFor=\"let paymentMethod of paymentMethods, index as i\">\r\n\r\n    <div *ngIf=\"i > 0\" class=\"row\">\r\n      <div class=\"col-md-12\">\r\n        <hr class=\"sa-blue-hr\" />\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"row\" *ngIf=\"formResetToggle\">\r\n      <div class=\"col-md-8\" style=\"font-size: large;\">\r\n        <div class=\"sa-inline-field\">\r\n          <input type=\"radio\" id=\"paymentRowRadio\" style=\"width: 20px; height: 20px;\" name=\"paymentRowRadio\" value=\"paymentMethod.id\" (change)=\"setPaymentMethod(paymentMethod.id)\" />\r\n          <label for=\"paymentRowRadio\" style=\"margin-left: 8px; margin-top: 8px; font-weight: normal;\">\r\n            {{paymentMethod.name}} <span style=\"font-style: italic\">({{paymentMethod.paymentType}} ending with {{paymentMethod.accountNumber.substring(paymentMethod.accountNumber.length - 4, paymentMethod.accountNumber.length)}})</span>\r\n\r\n            <span *ngIf=\"paymentMethod.currentAutoPayMethod\" class=\"sa-auto-pay-text\">\r\n              {{ 'paymentMethod.CurrentPaymentMethod' | translate }}\r\n              <span class=\"fa fa-question-circle sa-enroll-auto-pay-button-info-icon sa-popup\" (mouseenter)=\"togglePopover($event)\" (mouseleave)=\"togglePopover($event)\">\r\n                <span class=\"sa-popuptext-b\" [class.sa-show]=\"isAutoEnrollPopoverVisible\" id=\"autpPayPopover\">{{ 'PayNow.selectedServiceCharge' | translate }}</span>\r\n              </span>\r\n            </span>\r\n          </label>\r\n\r\n\r\n\r\n\r\n\r\n        </div>\r\n\r\n      </div>\r\n      <div class=\"col-md-4 text-right\" style=\"font-size: large;\">\r\n        <a routerLink=\"/secure/payment/{{paymentMethod.id}}\" class=\"sa-pipe-divider\">{{'PayNow.EDIT' | translate }}</a>\r\n      </div>\r\n\r\n    </div>\r\n\r\n  </ng-container>\r\n\r\n  <br /><br />\r\n        <div class=\"row\" *ngIf=\"isTermsVisible\">\r\n          <div class=\"row\" style=\"text-align:center;\"><span style=\"font-size:large;font-weight:bold;\">{{ 'PayNow.ElectronicPaymentTermsAndCondition' | translate }}</span></div>\r\n          <br />\r\n          <span style=\"font-weight:bold;\">{{ 'PayNow.ByCheckingBox' | translate }}</span> {{ 'PayNow.AuthorizedAgent' | translate }} <span style=\"font-weight:bold;\">{{ 'PayNow.Certifies' | translate }}</span> {{ 'PayNow.AgentAuthority' | translate }} <span style=\"font-weight:bold;\">{{ 'PayNow.Signs' | translate }}</span> {{ 'PayNow.EnrollmentAndAuth1' | translate }}<span style=\"font-weight:bold;\">{{ 'PayNow.Authorization' | translate }}</span>{{ 'PayNow.EnrollmentAndAuth2' | translate }}\r\n          <br />\r\n          <span style=\"font-weight:bold;\">{{ 'PayNow.Certifies2' | translate }}</span> {{ 'PayNow.description1' | translate }} <span style=\"font-weight:bold;\">{{ 'PayNow.Consents' | translate }}</span>{{ 'PayNow.description2' | translate }}\r\n          <br /><br /> <div class=\"row\" style=\"text-align:center;\"> <span style=\"text-align:center;font-size:large;font-style:italic;\">{{ 'PayNow.description3' | translate }}</span><br /><br /></div>\r\n          <span style=\"font-weight:bold;color:red;\">{{ 'PayNow.GeneralTerms' | translate }}</span> {{ 'PayNow.description4' | translate }} <span style=\"font-weight:bold;\"> {{ 'PayNow.InvoiceAmounts' | translate }} </span>{{ 'PayNow.description5' | translate }}<span style=\"font-weight:bold;\">{{ 'PayNow.EnrollmentScreens' | translate }}</span>{{ 'PayNow.description6' | translate }}<a href=\"mailto:customercare@scentair.com\">customercare@scentair.com</a>{{ 'PayNow.description7' | translate }}\r\n          <br /><br />\r\n          {{ 'PayNow.SubscriberAgrees' | translate }}\r\n          <br /><br />\r\n          <span style=\"font-weight:bold;color:red;\">{{ 'PayNow.ACHAuthorization' | translate }}</span> {{ 'PayNow.description8' | translate }}\r\n          <br /><br /><span style=\"font-weight:bold;color:red;\">{{ 'PayNow.CreditCardAuth' | translate }} </span>{{ 'PayNow.description9' | translate }}\r\n          {{ 'PayNow.description10' | translate }}\r\n\r\n          <br /><br /><span style=\"font-weight:bold;color:red;\">{{ 'PayNow.Privacy' | translate }}</span>{{ 'PayNow.description11' | translate }}\r\n\r\n\r\n        </div>\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-md-6\">\r\n      <span style=\"margin-right: 8px; width: 50px;\"><img src=\"../../../assets/images/visa.png\" /></span>\r\n      <span style=\"margin-right: 8px; width: 50px;\"><img src=\"../../../assets/images/mastercard.png\" /></span>\r\n      <span style=\"margin-right: 8px; width: 50px;\"><img src=\"../../../assets/images/discover.png\" /></span>\r\n      <span style=\"margin-right: 8px; width: 50px;\"><img src=\"../../../assets/images/amex.png\" /></span>\r\n    </div>\r\n    <div class=\"col-md-6 text-right\" *ngIf=\"formResetToggle\">\r\n      <button (click)=\"cancel()\" class=\"btn-primary btn btn-lg sa-btn-header-color\">{{ 'PayNow.CANCEL' | translate }}</button>&nbsp;\r\n      <span *ngIf=\"!isTermsVisible\">\r\n        <button (click)=\"paynow();\"\r\n                [disabled]=\"(isLoading)\"\r\n                class=\"btn-primary btn btn-lg sa-btn-header-color\">\r\n          {{ 'PayNow.SUBMIT' | translate }}\r\n        </button>\r\n      </span>\r\n      <span *ngIf=\"isTermsVisible\">\r\n        <button (click)=\"paynow();\"\r\n                [disabled]=\"(isLoading)\"\r\n                class=\"btn-primary btn btn-lg sa-btn-header-color\">\r\n          {{ 'PayNow.ACCEPT' | translate }} &amp; {{ 'PayNow.SUBMIT' | translate }}\r\n        </button>\r\n      </span>\r\n    </div>\r\n\r\n  </div><div class=\"row\" style=\"text-align:right;\" *ngIf=\"isLoading\">{{ 'PayNow.PaymentCompleteWarning' | translate }}</div>\r\n  <br />\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\" style=\"font-style: italic;\">\r\n      {{ 'PayNow.AutopayMethodCannotDeleted' | translate }}\r\n    </div>\r\n  </div>\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\" style=\"font-style: italic;\">\r\n      {{ 'PayNow.PaymentAlert' | translate }}\r\n    </div>\r\n  </div>\r\n\r\n\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/components/paymentpaynow/payment-paynow.component.ts":
/*!**********************************************************************!*\
  !*** ./src/app/components/paymentpaynow/payment-paynow.component.ts ***!
  \**********************************************************************/
/*! exports provided: PaymentPaynowComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PaymentPaynowComponent", function() { return PaymentPaynowComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_animations__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/animations */ "./src/app/services/animations.ts");
/* harmony import */ var _services_configuration_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/configuration.service */ "./src/app/services/configuration.service.ts");
/* harmony import */ var _services_invoice_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/invoice.service */ "./src/app/services/invoice.service.ts");
/* harmony import */ var _services_payment_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/payment.service */ "./src/app/services/payment.service.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _services_utilities__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../services/utilities */ "./src/app/services/utilities.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var PaymentPaynowComponent = /** @class */ (function () {
    function PaymentPaynowComponent(location, configurations, routerService, invoiceService, paymentService) {
        this.location = location;
        this.configurations = configurations;
        this.routerService = routerService;
        this.invoiceService = invoiceService;
        this.paymentService = paymentService;
        this.formResetToggle = true;
        this.invoices = [];
        this.invoicesToPay = [];
        this.paymentMethods = [];
        this.errors = [];
        this.selectedRows = new Array();
        this.totalBalanceDue = 0;
        this.isBalanceDue = false;
        this.isTermsReviewed = false;
        this.isTermsVisible = false;
        this.radioButtonSelected = 0;
        this.radioButtonNotSelected = 1;
        this.test = "testing";
    }
    PaymentPaynowComponent.prototype.ngOnInit = function () {
        this.getInvoicesToPay();
        this.getPaymentMethods();
        this.selectedPaymentAmount = this.invoiceService.getInvoicesPaymentTotal();
        //this.getUserInvoices();
    };
    PaymentPaynowComponent.prototype.getUserInvoices = function () {
        var _this = this;
        this.selectedPaymentAmount = 0;
        this.invoiceService
            .getOpenInvoices()
            .subscribe(function (request) {
            setTimeout(function () {
                _this.isLoading = false;
                var invoices = request;
                if (invoices !== null)
                    invoices.forEach(function (invoice) {
                        if (invoice !== null) {
                            _this.invoiceCurrency = (invoice.currency) ? invoice.currency : (invoice.balanceCurrency) ? invoice.balanceCurrency : 'USD';
                            _this.selectedPaymentAmount += invoice.balance;
                            if (invoice.balance > 0)
                                _this.invoices.push(invoice);
                        }
                    });
            }, 500);
        }, function (error) {
            setTimeout(function () {
                _this.isLoading = false;
            }, 500);
        });
    };
    PaymentPaynowComponent.prototype.getPaymentMethods = function () {
        var _this = this;
        this.isLoading = true;
        this.paymentService.getPaymentMethods()
            .subscribe(function (request) {
            setTimeout(function () {
                _this.isLoading = false;
                _this.paymentMethods = request;
                var method = _this.paymentMethods.find(function (x) { return x.currentAutoPayMethod; });
                if (method)
                    _this.selectedPaymentMethod = method.id;
            }, 500);
        }, function (error) {
            setTimeout(function () {
                _this.isLoading = false;
            }, 500);
        });
    };
    PaymentPaynowComponent.prototype.setPaymentMethod = function (id) {
        this.selectedPaymentMethod = id;
    };
    PaymentPaynowComponent.prototype.handleSubmitSuccess = function (res) {
        this.errors = [];
        this.isLoading = false;
        this.paymentResponse = res;
        this.isTermsReviewed = false;
        this.isTermsVisible = false;
        if (this.invoiceService.getOpenInvoicesTotal() - this.selectedPaymentAmount <= 0) {
            alert("Payment Successful. A payment confirmation email has been sent to you. Your account is now eligible for AutoPay");
            this.routerService.navigate(['/secure/payment/autopay']);
        }
        else {
            alert("Payment Successful. A payment confirmation email has been sent to you.");
            this.routerService.navigate(['/landing']);
        }
        this.invoiceService.userInvoices = [];
        this.invoiceService.invoicesToPay = [];
    };
    PaymentPaynowComponent.prototype.handleSubmitError = function (err) {
        var serverError = _services_utilities__WEBPACK_IMPORTED_MODULE_6__["Utilities"].getHttpErrors(err);
        alert("Declined. Please contact us. We will gladly assist you with your payment.");
        this.errors = serverError;
        this.isLoading = false;
        this.isTermsReviewed = false;
        this.isTermsVisible = false;
        this.routerService.navigate(['/landing']);
    };
    Object.defineProperty(PaymentPaynowComponent.prototype, "canPayNow", {
        get: function () {
            if (this.selectedPaymentMethod && this.selectedPaymentMethod.length > 0)
                return true;
            return false;
        },
        enumerable: true,
        configurable: true
    });
    PaymentPaynowComponent.prototype.paynow = function () {
        var _this = this;
        if (!this.canPayNow) {
            alert("Select a Payment Method");
            return false;
        }
        if (!this.isTermsReviewed) {
            this.isTermsReviewed = true;
            this.isTermsVisible = true;
            return;
        }
        this.isLoading = true;
        var invoices = this.invoicesToPay.map(function (x) { return x.invoiceNumber; });
        var amount = this.invoiceService.getInvoicesPaymentTotal();
        this.paymentService.submitPayment(this.selectedPaymentMethod, invoices, amount)
            .subscribe(function (data) { return _this.handleSubmitSuccess(data); }, function (err) { return _this.handleSubmitError(err); });
    };
    PaymentPaynowComponent.prototype.getInvoices = function () {
        //return this.invoices;
        return this.invoiceService.getUserInvoices();
    };
    PaymentPaynowComponent.prototype.getInvoicesToPay = function () {
        //alert(caller);
        this.invoicesToPay = this.invoiceService.getInvoicesToPay();
    };
    PaymentPaynowComponent.prototype.togglePopover = function (e) {
        this.isAutoEnrollPopoverVisible = !this.isAutoEnrollPopoverVisible;
        return this.isAutoEnrollPopoverVisible;
    };
    PaymentPaynowComponent.prototype.formatAmount = function (amount) {
        if (isNaN(amount)) {
            return (0).toFixed(2);
        }
        return (amount).toFixed(2);
    };
    PaymentPaynowComponent.prototype.formatDate = function (d) {
        if (d == null) {
            return null;
        }
        var dt = new Date(d);
        return (dt.getMonth() + 1) + '/' + dt.getDate() + '/' + dt.getFullYear();
    };
    PaymentPaynowComponent.prototype.cancel = function () {
        this.invoiceService.userInvoices = [];
        this.invoiceService.invoicesToPay = [];
        this.location.back();
    };
    PaymentPaynowComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'payment-paynow',
            template: __webpack_require__(/*! ./payment-paynow.component.html */ "./src/app/components/paymentpaynow/payment-paynow.component.html"),
            styles: [__webpack_require__(/*! ./payment-paynow.component.css */ "./src/app/components/paymentpaynow/payment-paynow.component.css")],
            animations: [_services_animations__WEBPACK_IMPORTED_MODULE_1__["fadeInOut"]]
        }),
        __metadata("design:paramtypes", [_angular_common__WEBPACK_IMPORTED_MODULE_5__["Location"], _services_configuration_service__WEBPACK_IMPORTED_MODULE_2__["ConfigurationService"], _angular_router__WEBPACK_IMPORTED_MODULE_7__["Router"], _services_invoice_service__WEBPACK_IMPORTED_MODULE_3__["InvoiceService"], _services_payment_service__WEBPACK_IMPORTED_MODULE_4__["PaymentService"]])
    ], PaymentPaynowComponent);
    return PaymentPaynowComponent;
}());



/***/ }),

/***/ "./src/app/components/paymentprofile/payment-profile.component.css":
/*!*************************************************************************!*\
  !*** ./src/app/components/paymentprofile/payment-profile.component.css ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/components/paymentprofile/payment-profile.component.html":
/*!**************************************************************************!*\
  !*** ./src/app/components/paymentprofile/payment-profile.component.html ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container sa-container-minsize sa-header-margin-loggedin\">\r\n\r\n  <header class=\"pageHeader\"></header>\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      <div class=\"sa-heading-text\">\r\n        {{'PaymentProfile.PaymentMethods' | translate}}\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  <br />\r\n\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      <div style=\"color:slategray;font-size:large;\">\r\n        {{'PaymentProfile.PaymentMethodsDesc' | translate}}\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  <div style=\"color: red; font-style: italic;\">\r\n    {{'PaymentProfile.USCCANOption' | translate}}\r\n  </div>\r\n\r\n\r\n\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12 has-feedback has-error\">\r\n      <div *ngFor=\"let err of errors\" class=\"errorMessage\">{{ err | translate }}</div>\r\n    </div>\r\n  </div>\r\n\r\n  <br />\r\n  <br />\r\n  <span style=\"color: blue;font-size:large;border-bottom: 1px solid #56B2CB;margin-top: 3px;margin-bottom: 3px; \">\r\n    {{'PaymentProfile.CurrentSavedMethod' | translate}}\r\n  </span>\r\n  <br /><br />\r\n\r\n  <ng-container *ngFor=\"let paymentMethod of paymentMethods, index as i\">\r\n\r\n    <div *ngIf=\"i > 0\" class=\"row\">\r\n      <div class=\"col-md-12\">\r\n        <hr class=\"sa-blue-hr\" />\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"row\">\r\n      <div class=\"col-md-8\" style=\"font-size: large;\">\r\n        <div>\r\n\r\n          {{ paymentMethod.name }} <span style=\"font-style: italic\">({{paymentMethod.paymentType}}{{'PaymentProfile.EndingWith' | translate}}  {{paymentMethod.accountNumber.substring(paymentMethod.accountNumber.length - 4, paymentMethod.accountNumber.length)}})</span>\r\n\r\n                                   <span *ngIf=\"paymentMethod.currentAutoPayMethod\" class=\"sa-auto-pay-text\">\r\n                                     {{ 'PaymentProfile.CuurentAutoPayMethod' | translate }}\r\n                                     <span class=\"fa fa-question-circle sa-enroll-auto-pay-button-info-icon sa-popup\" (mouseenter)=\"togglePopover($event)\" (mouseleave)=\"togglePopover($event)\">\r\n                                       <span class=\"sa-popuptext-b\" [class.sa-show]=\"isAutoEnrollPopoverVisible\" id=\"autpPayPopover\">{{'PaymentProfile.SelectedPaymentValidationMessage' | translate}}</span>\r\n                                     </span>\r\n                                   </span>\r\n        </div>\r\n      </div>\r\n      <div class=\"col-md-4 text-right\" style=\"font-size: large;\">\r\n        <a routerLink=\"/secure/payment/{{paymentMethod.id}}\" class=\"sa-pipe-divider\">{{'PaymentProfile.EDIT' | translate}}</a>\r\n      </div>\r\n    </div>\r\n\r\n  </ng-container>\r\n  <br />\r\n  <br />\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\" *ngIf=\"canPayOnSite\">\r\n      <a routerLink=\"/secure/payment\" class=\"btn-primary btn btn-lg sa-btn-header-color\">{{'PaymentProfile.AddNewPaymentMethod' | translate}}</a>\r\n      <a routerLink=\"/secure/payment/autopay\" class=\"btn-primary btn btn-lg sa-btn-header-color\" style=\"float: right;\">{{'PaymentProfile.MANAGEAUTOPAYSETTINGS' | translate}}</a>\r\n    </div>\r\n  </div>\r\n  <br /><br />\r\n  <div class=\"row\">\r\n    <div class=\"col-md-6\">\r\n      <span style=\"margin-right: 8px; width: 50px;\"><img src=\"../../../assets/images/visa.png\" /></span>\r\n      <span style=\"margin-right: 8px; width: 50px;\"><img src=\"../../../assets/images/mastercard.png\" /></span>\r\n      <span style=\"margin-right: 8px; width: 50px;\"><img src=\"../../../assets/images/discover.png\" /></span>\r\n      <span style=\"margin-right: 8px; width: 50px;\"><img src=\"../../../assets/images/amex.png\" /></span>\r\n    </div>\r\n\r\n  </div>\r\n  <br />\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\" style=\"font-style: italic;\">\r\n      {{'PaymentProfile.SecurityReasonDesc' | translate}}\r\n    </div>\r\n  </div>\r\n  <br />\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      {{'PaymentProfile.PaymentReceivedTimeDesc' | translate}}\r\n    </div>\r\n  </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/components/paymentprofile/payment-profile.component.ts":
/*!************************************************************************!*\
  !*** ./src/app/components/paymentprofile/payment-profile.component.ts ***!
  \************************************************************************/
/*! exports provided: PaymentProfileComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PaymentProfileComponent", function() { return PaymentProfileComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var _services_animations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/animations */ "./src/app/services/animations.ts");
/* harmony import */ var _services_configuration_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/configuration.service */ "./src/app/services/configuration.service.ts");
/* harmony import */ var _services_payment_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/payment.service */ "./src/app/services/payment.service.ts");
/* harmony import */ var _services_utilities__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../services/utilities */ "./src/app/services/utilities.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var PaymentProfileComponent = /** @class */ (function () {
    function PaymentProfileComponent(configurations, paymentService, accountService) {
        this.configurations = configurations;
        this.paymentService = paymentService;
        this.accountService = accountService;
        this.canPayOnSite = true;
        this.errors = [];
    }
    PaymentProfileComponent.prototype.ngOnInit = function () {
        this.getPaymentMethods();
        this.getSiteAccount();
    };
    PaymentProfileComponent.prototype.getSiteAccount = function () {
        var _this = this;
        this.accountService.getAccount().subscribe(function (account) { return _this.saveSuccessHelper(account); }, function (error) { return _this.saveFailedHelper(error); });
    };
    PaymentProfileComponent.prototype.saveSuccessHelper = function (res) {
        if (res.currency != 'USD' && res.currency != 'CAD')
            this.canPayOnSite = false;
    };
    PaymentProfileComponent.prototype.saveFailedHelper = function (res) {
        this.canPayOnSite = true;
    };
    PaymentProfileComponent.prototype.handleSubmitSuccess = function (res) {
        this.errors = [];
        this.isLoading = false;
        this.paymentMethods = res;
    };
    PaymentProfileComponent.prototype.handleSubmitError = function (err) {
        var serverError = _services_utilities__WEBPACK_IMPORTED_MODULE_5__["Utilities"].getHttpErrors(err);
        this.errors = serverError;
        this.isLoading = false;
    };
    PaymentProfileComponent.prototype.getPaymentMethods = function () {
        var _this = this;
        this.isLoading = true;
        this.paymentService.getPaymentMethods()
            .subscribe(function (data) { return _this.handleSubmitSuccess(data); }, function (err) { return _this.handleSubmitError(err); });
    };
    PaymentProfileComponent.prototype.togglePopover = function (e) {
        this.isAutoEnrollPopoverVisible = !this.isAutoEnrollPopoverVisible;
        return this.isAutoEnrollPopoverVisible;
    };
    PaymentProfileComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'payment-profile',
            template: __webpack_require__(/*! ./payment-profile.component.html */ "./src/app/components/paymentprofile/payment-profile.component.html"),
            styles: [__webpack_require__(/*! ./payment-profile.component.css */ "./src/app/components/paymentprofile/payment-profile.component.css")],
            animations: [_services_animations__WEBPACK_IMPORTED_MODULE_2__["fadeInOut"]]
        }),
        __metadata("design:paramtypes", [_services_configuration_service__WEBPACK_IMPORTED_MODULE_3__["ConfigurationService"], _services_payment_service__WEBPACK_IMPORTED_MODULE_4__["PaymentService"], _services_account_service__WEBPACK_IMPORTED_MODULE_1__["AccountService"]])
    ], PaymentProfileComponent);
    return PaymentProfileComponent;
}());



/***/ }),

/***/ "./src/app/components/privacy/privacy.component.css":
/*!**********************************************************!*\
  !*** ./src/app/components/privacy/privacy.component.css ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/components/privacy/privacy.component.html":
/*!***********************************************************!*\
  !*** ./src/app/components/privacy/privacy.component.html ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container\" style=\"min-height: 500px;\">\r\n  <div *ngIf=\"isLoggedIn\" style=\"margin-top: 35px;\">\r\n    &nbsp;\r\n  </div>\r\n  <header class=\"pageHeader\"></header>\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      <div class=\"sa-heading-text\">\r\n        Privacy Policy\r\n      </div>\r\n    </div>\r\n  </div>\r\n  \r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      <h3>\r\n        Effective date: August 21, 2018\r\n      </h3>\r\n      <p>\r\n        ScentAir (“us”, “we”, or “our”) operates the portal.scentair.com website (hereinafter referred to as the “Service”).\r\n      </p>\r\n      <p>\r\n        This page informs you of our policies regarding the collection, use and disclosure of personal data when you use our Service and the choices you have associated with that data.\r\n      </p>\r\n      <p>\r\n        We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, the terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, accessible from portal.scentair.com\r\n      </p>\r\n    \r\n        Definitions\r\n        <ul>\r\n          <li>\r\n            Service is the portal.scentair.com website operated by ScentAir\r\n          </li>\r\n          <li>\r\n            Personal DataPersonal Data means data about a living individual who can be identified from those data (or from those and other information either in our possession or likely to come into our possession).\r\n          </li>\r\n          <li>\r\n            Usage DataUsage Data is data collected automatically either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).\r\n          </li>\r\n          <li>\r\n            CookiesCookies are small files stored on your device (computer or mobile device).\r\n          </li>\r\n          <li>\r\n            Data ControllerData Controller means the natural or legal person who (either alone or jointly or in common with other persons) determines the purposes for which and the manner in which any personal information are, or are to be, processed.For the purpose of this Privacy Policy, we are a Data Controller of your Personal Data.\r\n          </li>\r\n          <li>\r\n            Data Processors (or Service Providers)Data Processor (or Service Provider) means any natural or legal person who processes the data on behalf of the Data Controller.We may use the services of various Service Providers in order to process your data more effectively.\r\n          </li>\r\n          <li>\r\n            Data Subject (or User)Data Subject is any living individual who is using our Service and is the subject of Personal Data.\r\n          </li>\r\n          \r\n        </ul>\r\n    \r\n    </div>\r\n  </div>\r\n\r\n</div>\r\n\r\n"

/***/ }),

/***/ "./src/app/components/privacy/privacy.component.ts":
/*!*********************************************************!*\
  !*** ./src/app/components/privacy/privacy.component.ts ***!
  \*********************************************************/
/*! exports provided: PrivacyComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PrivacyComponent", function() { return PrivacyComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_animations__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/animations */ "./src/app/services/animations.ts");
/* harmony import */ var _services_configuration_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/configuration.service */ "./src/app/services/configuration.service.ts");
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/auth.service */ "./src/app/services/auth.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var PrivacyComponent = /** @class */ (function () {
    function PrivacyComponent(configurations, authService) {
        this.configurations = configurations;
        this.authService = authService;
        this.isLoggedIn = authService.isLoggedIn;
    }
    PrivacyComponent.prototype.ngOnInit = function () {
    };
    PrivacyComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'privacy',
            template: __webpack_require__(/*! ./privacy.component.html */ "./src/app/components/privacy/privacy.component.html"),
            styles: [__webpack_require__(/*! ./privacy.component.css */ "./src/app/components/privacy/privacy.component.css")],
            animations: [_services_animations__WEBPACK_IMPORTED_MODULE_1__["fadeInOut"]]
        }),
        __metadata("design:paramtypes", [_services_configuration_service__WEBPACK_IMPORTED_MODULE_2__["ConfigurationService"], _services_auth_service__WEBPACK_IMPORTED_MODULE_3__["AuthService"]])
    ], PrivacyComponent);
    return PrivacyComponent;
}());



/***/ }),

/***/ "./src/app/components/register-confirmation-email/register-confirmation-email.component.css":
/*!**************************************************************************************************!*\
  !*** ./src/app/components/register-confirmation-email/register-confirmation-email.component.css ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/components/register-confirmation-email/register-confirmation-email.component.html":
/*!***************************************************************************************************!*\
  !*** ./src/app/components/register-confirmation-email/register-confirmation-email.component.html ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container sa-container-minsize sa-header-margin\">\r\n\r\n  <header class=\"pageHeader\">\r\n\r\n    <div class=\"row\">\r\n      <div class=\"col-md=12\">\r\n        <div class=\"sa-heading-text\">{{ 'Email Confirmation' | translate }}</div>\r\n      </div>\r\n    </div>\r\n    <div class=\"row\">\r\n      <div class=\"col-md-12 has-feedback has-error\">\r\n        <div *ngFor=\"let err of errors\" class=\"errorMessage\">{{ err | translate }}</div>\r\n      </div>\r\n    </div>\r\n\r\n  </header>\r\n\r\n  <br />\r\n  <div class=\"row\" *ngIf=\"isLoading\">\r\n    <div class=\"col-md-12\">\r\n      <div>\r\n        Confirming your email... <br /><br />\r\n      </div>\r\n    </div>\r\n    <br />\r\n    <br />\r\n  </div>\r\n\r\n  <div class=\"row\" *ngIf=\"confirmed\">\r\n    <div class=\"col-md-12\">\r\n      <div>\r\n        Your email is confirmed. <br /><br />\r\n      </div>\r\n      <div>\r\n        <p>\r\n          <a routerLink=\"/login\">{{ 'Login' | translate }}</a> to view account details, make payments and add additional users.\r\n        </p>\r\n      </div>\r\n    </div>\r\n    <br />\r\n    <br />\r\n  </div>\r\n\r\n  <div class=\"row\" *ngIf=\"confirmed\">\r\n    <div class=\"col-md-12\">\r\n      <div>\r\n        <a routerLink=\"/login\" title=\"{{ 'Login' | translate }}\" class=\"btn btn-lg btn-primary sa-btn-header-color\">{{ 'Login' | translate }}</a>\r\n      </div>\r\n    </div>\r\n    <br />\r\n    <br />\r\n  </div>\r\n  <div class=\"row\" *ngIf=\"!confirmed\">\r\n    <div class=\"col-md-12\">\r\n      <div>\r\n        Your email is not confirmed.  Please delete the email.  A new email will be sent to you.  If you did not register, please contact support.\r\n      </div>\r\n    </div>\r\n    <br />\r\n    <br />\r\n  </div>\r\n\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      <div>\r\n        AMERICAS: Toll free: <a href=\"tel:+8667236824\">+866-723-6824</a> or <a href=\"tel:+17045042320\">+1 704-504-2320</a>\r\n      </div>\r\n      <br />\r\n      <div>\r\n        EMEA: <a href=\"tel:+330562576320\">+33 (0)5 62 57 63 20</a>\r\n      </div>\r\n      <br />\r\n      <div>\r\n        UK: <a href=\"tel:+4401628601650\">+44 (0) 1628-601650</a>\r\n      </div>\r\n      <br />\r\n      <div>\r\n        APAC: <a href=\"tel:+85362625256\">+(853) 626-25256</a> or <a href=\"tel:+(852) 356-35566\">(852) 356-35566</a>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  <br />\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      <a routerLink=\"/login\" class=\"btn btn-lg btn-primary sa-btn-header-color\">{{ 'RETURN TO LOGIN' | translate }}</a>\r\n    </div>\r\n  </div>\r\n\r\n</div>\r\n\r\n"

/***/ }),

/***/ "./src/app/components/register-confirmation-email/register-confirmation-email.component.ts":
/*!*************************************************************************************************!*\
  !*** ./src/app/components/register-confirmation-email/register-confirmation-email.component.ts ***!
  \*************************************************************************************************/
/*! exports provided: RegisterConfirmationEmailComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RegisterConfirmationEmailComponent", function() { return RegisterConfirmationEmailComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var _services_utilities__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/utilities */ "./src/app/services/utilities.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var RegisterConfirmationEmailComponent = /** @class */ (function () {
    function RegisterConfirmationEmailComponent(accountService, route, router) {
        this.accountService = accountService;
        this.route = route;
        this.router = router;
    }
    RegisterConfirmationEmailComponent.prototype.ngOnInit = function () {
        var _this = this;
        var userId = this.route.snapshot.paramMap.get('id');
        var code = this.route.snapshot.paramMap.get('code');
        this.errors = [];
        this.confirmed = false;
        this.isLoading = false;
        this.userId = userId;
        this.code = code;
        this.accountService.confirmEmail(userId, code)
            .subscribe(function (data) { return _this.handleSubmitSuccess(data); }, function (error) { return _this.handleSubmitError(error); });
    };
    RegisterConfirmationEmailComponent.prototype.handleSubmitSuccess = function (res) {
        this.errors = [];
        this.isLoading = false;
        this.confirmed = res;
    };
    RegisterConfirmationEmailComponent.prototype.handleSubmitError = function (err) {
        var serverError = _services_utilities__WEBPACK_IMPORTED_MODULE_3__["Utilities"].getHttpErrors(err);
        this.errors = serverError;
        this.isLoading = false;
    };
    RegisterConfirmationEmailComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'register-confirm-email',
            template: __webpack_require__(/*! ./register-confirmation-email.component.html */ "./src/app/components/register-confirmation-email/register-confirmation-email.component.html"),
            styles: [__webpack_require__(/*! ./register-confirmation-email.component.css */ "./src/app/components/register-confirmation-email/register-confirmation-email.component.css")]
        }),
        __metadata("design:paramtypes", [_services_account_service__WEBPACK_IMPORTED_MODULE_2__["AccountService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]])
    ], RegisterConfirmationEmailComponent);
    return RegisterConfirmationEmailComponent;
}());



/***/ }),

/***/ "./src/app/components/register-confirmation/register-confirmation.component.css":
/*!**************************************************************************************!*\
  !*** ./src/app/components/register-confirmation/register-confirmation.component.css ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/components/register-confirmation/register-confirmation.component.html":
/*!***************************************************************************************!*\
  !*** ./src/app/components/register-confirmation/register-confirmation.component.html ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container sa-container-minsize sa-header-margin\">\r\n\r\n  <header class=\"pageHeader\">\r\n    <div class=\"row\">\r\n      <div class=\"col-md-12\">\r\n        <div class=\"sa-heading-text\">\r\n          {{ 'Register.Header' | translate }}\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </header>\r\n\r\n  <br />\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      <div>\r\n        {{ 'Register.RegistrationComplete' | translate }} <br /><br />\r\n      </div>\r\n      <div>\r\n        <p>\r\n          <a routerLink=\"/login\">{{ 'Register.Login' | translate }}</a> {{ 'Register.ToViewDetails' | translate }}\r\n        </p>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  <br />\r\n  <br />\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      <div>\r\n        <a routerLink=\"/login\" title=\"{{ 'Register.Login' | translate }}\" class=\"btn btn-lg btn-primary sa-btn-header-color\">{{ 'Register.Login' | translate }}</a>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n\r\n\r\n</div>\r\n\r\n"

/***/ }),

/***/ "./src/app/components/register-confirmation/register-confirmation.component.ts":
/*!*************************************************************************************!*\
  !*** ./src/app/components/register-confirmation/register-confirmation.component.ts ***!
  \*************************************************************************************/
/*! exports provided: RegisterConfirmationComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RegisterConfirmationComponent", function() { return RegisterConfirmationComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/account.service */ "./src/app/services/account.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var RegisterConfirmationComponent = /** @class */ (function () {
    function RegisterConfirmationComponent(accountService, route, router) {
        this.accountService = accountService;
        this.route = route;
        this.router = router;
    }
    RegisterConfirmationComponent.prototype.ngOnInit = function () {
        var id = this.route.snapshot.paramMap.get('id');
        this.id = id;
        //confirmation of email
    };
    RegisterConfirmationComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'register-confirmation',
            template: __webpack_require__(/*! ./register-confirmation.component.html */ "./src/app/components/register-confirmation/register-confirmation.component.html"),
            styles: [__webpack_require__(/*! ./register-confirmation.component.css */ "./src/app/components/register-confirmation/register-confirmation.component.css")]
        }),
        __metadata("design:paramtypes", [_services_account_service__WEBPACK_IMPORTED_MODULE_2__["AccountService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]])
    ], RegisterConfirmationComponent);
    return RegisterConfirmationComponent;
}());



/***/ }),

/***/ "./src/app/components/register/register.component.css":
/*!************************************************************!*\
  !*** ./src/app/components/register/register.component.css ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/components/register/register.component.html":
/*!*************************************************************!*\
  !*** ./src/app/components/register/register.component.html ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container sa-header-margin sa-container-minsize\">\r\n\r\n  <header class=\"pageHeader\">\r\n\r\n    <div class=\"row\">\r\n      <div class=\"col-md=12\">\r\n        <div class=\"sa-heading-text\" *ngIf=\"!isAccount\">{{ 'Register.Step1Registration' | translate }}</div>\r\n        <div class=\"sa-heading-text\" *ngIf=\"isAccount\">{{ 'Register.Step2Registration' | translate }}</div>\r\n      </div>\r\n    </div>\r\n    <div class=\"row\">\r\n      <div class=\"col-md-12 has-feedback has-error\">\r\n        <div class=\"errorMessage\" style=\"float:left\">{{ errorMessage | translate }} <a href=\"../#/login/\" *ngIf=\"here\">{{ 'Register.Here' | translate}}</a> </div>\r\n      </div>\r\n    </div>\r\n\r\n  </header>\r\n\r\n  <form class=\"form\" name=\"f\" id=\"f\" #f=\"ngForm\" *ngIf=\"formResetToggle\" (ngSubmit)=\"register()\">\r\n\r\n\r\n    <div class=\"row\" *ngIf=\"!isAccount\">\r\n      <div class=\"col-md-4\">\r\n        <label class=\"control-label\" for=\"account_number\">{{ 'Register.CustomerIDNumber'  | translate }}<span class=\"sa-required-text\">*</span></label>\r\n        <span class=\"fa fa-question-circle sa-enroll-auto-pay-button-info-icon sa-popup\" (mouseenter)=\"toggleAcctNoPopover($event)\" (mouseleave)=\"toggleAcctNoPopover($event)\">\r\n          <span class=\"sa-popuptext-b\" [class.sa-show]=\"isAcctNoPopoverVisible\" id=\"acctNoPopover\">{{ 'Register.CustomerIDNumberToolTip'  | translate }}</span>\r\n        </span>\r\n\r\n        <div class=\"has-feedback\" [ngClass]=\"{ 'has-error' : account_number.dirty && (!account_number.valid || account_number.errors) }\">\r\n          <input class=\"form-control\" id=\"account_number\" name=\"account_number\" type=\"text\" #account_number=\"ngModel\" [(ngModel)]=\"model.account.number\" required minlength=\"3\" />\r\n          <span class=\"errorMessage\" [hidden]=\"!(account_number.dirty && (!account_number.valid || account_number.errors))\">{{ 'Register.InvalidAccountNumber' | translate }}{{ model.account.number?.messages | translate }}</span>\r\n        </div>\r\n      </div>\r\n      <div class=\"col-md-4\">\r\n        <label class=\"control-label\" for=\"account_pin\">{{ 'Register.PINNumber' | translate }}<span class=\"sa-required-text\">*</span></label>\r\n        <span class=\"fa fa-question-circle sa-enroll-auto-pay-button-info-icon sa-popup\" (mouseenter)=\"togglePinNoPopover($event)\" (mouseleave)=\"togglePinNoPopover($event)\">\r\n          <span class=\"sa-popuptext-b\" [class.sa-show]=\"isPinNoPopoverVisible\" id=\"PinNoPopover\">{{ 'Register.PINNumberToolTip' | translate }}</span>\r\n        </span>\r\n\r\n        <div class=\"has-feedback\" [ngClass]=\"{ 'has-error' : account_pin.dirty && (!account_pin.valid || account_pin.errors) }\">\r\n          <input class=\"form-control\" id=\"account_pin\" name=\"account_pin\" type=\"password\" #account_pin=\"ngModel\" [(ngModel)]=\"model.account.pin\" required minlength=\"3\" />\r\n          <span class=\"errorMessage\" [hidden]=\"!(account_pin.dirty && (!account_pin.valid || account_pin.errors))\">{{ 'Register.PINNumberValidation' | translate }}</span>\r\n        </div>\r\n      </div>\r\n      <br />\r\n    </div>\r\n\r\n    <div class=\"row\" *ngIf=\"!isAccount\">\r\n      <div class=\"col-md-4\" style=\"margin-top: 10px !important;\">\r\n        <ngx-recaptcha2 #captchaElem\r\n                        [siteKey]=\"siteKey\"\r\n                        (reset)=\"captchaHandleReset()\"\r\n                        (expire)=\"captchaHandleExpire()\"\r\n                        (load)=\"captchaHandleLoad()\"\r\n                        (success)=\"CaptchaHandleSuccess($event)\"\r\n                        [useGlobalDomain]=\"useGlobalDomain\"\r\n                        [size]=\"size\"\r\n                        [hl]=\"selectedLanguage\"\r\n                        [theme]=\"theme\"\r\n                        [type]=\"type\" [(ngModel)]=\"model.captcha\" [ngModelOptions]=\"{standalone: true}\" >\r\n        </ngx-recaptcha2>\r\n        <br />\r\n      </div>\r\n      </div>\r\n\r\n\r\n      <div *ngIf=\"isAccount\">\r\n        <div class=\"row\">\r\n          <div class=\"col-md-4\">\r\n            <div class=\"sa-gray-text\" style=\"font-size: large;\">\r\n              <div>\r\n                <div style=\"font-size: x-large;\">\r\n                  {{ model.account.name }} ({{model.account.number}})\r\n                </div>\r\n                <div>\r\n                  {{ model.account.address.line1 }}<br />\r\n                  {{ model.account.address.municipality }},&nbsp;\r\n                  {{ model.account.address.stateOrProvince }}&nbsp; {{ model.account.address.postalCode }}<br />\r\n                  {{ model.account.address.country }}\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n\r\n        <br />\r\n\r\n        <div class=\"row\">\r\n          <div class=\"col-md-4\">\r\n            <label class=\"control-label\" for=\"user_firstName\">{{ 'Register.FirstName' | translate }}<span class=\"sa-required-text\">*</span></label>\r\n            <div class=\"has-feedback\" [ngClass]=\"{ 'has-error' : user_firstName.dirty && (!user_firstName.valid || user_firstName.errors) }\">\r\n              <input class=\"form-control\" id=\"user_firstName\" name=\"user_firstName\" type=\"text\" #user_firstName=\"ngModel\" [(ngModel)]=\"model.user.firstName\" required minlength=\"2\" />\r\n              <span class=\"errorMessage\" [hidden]=\"!(user_firstName.dirty && (!user_firstName.valid || user_firstName.errors))\">{{ 'Register.FirstNameValidation' | translate }}</span>\r\n            </div>\r\n          </div>\r\n          <div class=\"col-md-4\">\r\n            <label class=\"control-label\" for=\"user_lastName\">{{ 'Register.LastName' | translate }}<span class=\"sa-required-text\">*</span></label>\r\n            <div class=\"has-feedback\" [ngClass]=\"{ 'has-error' : user_lastName.dirty && (!user_lastName.valid || user_lastName.errors) }\">\r\n              <input class=\"form-control\" id=\"user_lastName\" name=\"user_lastName\" type=\"text\" #user_lastName=\"ngModel\" [(ngModel)]=\"model.user.lastName\" required minlength=\"2\" />\r\n              <span class=\"errorMessage\" [hidden]=\"!(user_lastName.dirty && (!user_lastName.valid || user_lastName.errors))\">{{ 'Register.LastNameValidation' | translate }}</span>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <br />\r\n\r\n        <div class=\"row\">\r\n          <div class=\"col-md-4\">\r\n            <label class=\"control-label\" for=\"user_email\">{{ 'Register.EmailAddress' | translate }}<span class=\"sa-required-text\">*</span></label>\r\n            <div class=\"has-feedback\" [ngClass]=\"{ 'has-error' : user_email.dirty && (!user_email.valid || user_email.errors) }\">\r\n              <input class=\"form-control\" id=\"user_email\" name=\"user_email\" type=\"text\" #user_email=\"ngModel\" [(ngModel)]=\"model.user.email\" required email minlength=\"5\" />\r\n              <span class=\"errorMessage\" [hidden]=\"!(user_email.dirty && (!user_email.valid || user_email.errors))\">{{ 'Register.EmailValidation'| translate }}{{ model.user.email?.messages}}</span>\r\n            </div>\r\n          </div>\r\n          <div class=\"col-md-4\">\r\n            <label class=\"control-label\" for=\"user_phoneNumber\">{{ 'Register.PhoneNumber' | translate }}<span class=\"sa-required-text\">*</span></label>\r\n            <div class=\"has-feedback\"\r\n                 [ngClass]=\"{ 'has-error' : user_phoneNumber.dirty && (!user_phoneNumber.valid || user_phoneNumber.errors) }\">\r\n              <input class=\"form-control\"\r\n                     id=\"user_phoneNumber\"\r\n                     name=\"user_phoneNumber\"\r\n                     type=\"text\"\r\n                     #user_phoneNumber=\"ngModel\"\r\n                     [(ngModel)]=\"model.user.phoneNumber\"\r\n                     required\r\n                     minlength=\"6\"\r\n                     pattern=\"\\+?\\s*(\\(?\\d{1,3}\\)?)*\\s*[\\-\\.\\,]?\\s*(\\(?\\d+\\)?)*\\s*[\\-\\.\\,]?\\s*(\\(?\\d+\\)?)*\\s*[\\-\\.\\,]?\\s*(\\(?\\d+\\)?)*\\s*\" />\r\n              <span class=\"errorMessage\" [hidden]=\"!(user_phoneNumber.dirty && (!user_phoneNumber.valid || user_phoneNumber.errors))\">{{ 'Register.PhoneNumberValidation' | translate }}</span>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <br />\r\n\r\n        <div class=\"row\">\r\n          <div class=\"col-md-4\">\r\n            <label class=\"control-label\" for=\"user_userName\">{{ 'Register.UserName' | translate }}<span class=\"sa-required-text\">*</span></label>\r\n            <span class=\"fa fa-question-circle sa-enroll-auto-pay-button-info-icon sa-popup\" (mouseenter)=\"toggleUsernamePopover($event)\" (mouseleave)=\"toggleUsernamePopover($event)\">\r\n              <span class=\"sa-popuptext-b\" [class.sa-show]=\"isUsernamePopoverVisible\" id=\"UsernamePopover\">{{ 'Register.UserNameToolTip' | translate }}</span>\r\n            </span>\r\n\r\n            <div class=\"has-feedback\" [ngClass]=\"{ 'has-error' : (user_userName.dirty && !user_userName.valid) }\">\r\n              <input class=\"form-control\"\r\n                     id=\"user_userName\"\r\n                     name=\"user_userName\"\r\n                     type=\"text\"\r\n                     #user_userName=\"ngModel\"\r\n                     [(ngModel)]=\"model.user.userName\"\r\n                     required\r\n                     minlength=\"7\"\r\n                     pattern=\"[a-zA-Z0-9]+\" />\r\n              <span class=\"errorMessage\" [hidden]=\"!(user_userName.dirty && user_userName.errors?.required)\">\r\n                {{ 'Register.UserNameRequired' | translate }}\r\n              </span>\r\n              <span class=\"errorMessage\" [hidden]=\"!(user_userName.dirty && user_userName.errors?.minlength)\">\r\n                {{ 'Register.UserNameCharLength' | translate }}\r\n              </span>\r\n              <span class=\"errorMessage\" [hidden]=\"!(user_userName.dirty && user_userName.errors?.pattern)\">\r\n                {{ 'Register.UserNameValidation' | translate }}\r\n              </span>\r\n            </div>\r\n          </div>\r\n\r\n          <div class=\"col-md-4\">\r\n            <label class=\"control-label\" for=\"user_newPassword\">{{ 'Register.Password' | translate }}<span class=\"sa-required-text\">*</span></label>\r\n            <span class=\"fa fa-question-circle sa-enroll-auto-pay-button-info-icon sa-popup\" (mouseenter)=\"togglePasswordPopover($event)\" (mouseleave)=\"togglePasswordPopover($event)\">\r\n              <span class=\"sa-popuptext-b\" [class.sa-show]=\"isPasswordPopoverVisible\" id=\"PasswordPopover\">{{ 'Register.PasswordToolTip' | translate }}</span>\r\n            </span>\r\n\r\n            <div class=\"has-feedback\" [ngClass]=\"{ 'has-error' : (user_newPassword.dirty && !user_newPassword.valid) }\">\r\n              <input class=\"form-control\"\r\n                     id=\"user_newPassword\"\r\n                     name=\"user_newPassword\"\r\n                     type=\"password\"\r\n                     #user_newPassword=\"ngModel\"\r\n                     [(ngModel)]=\"model.user.newPassword\"\r\n                     required\r\n                     minlength=\"8\"\r\n                     pattern=\"^(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=\\D*\\d)(?=[a-zA-Z0-9]*[^a-zA-Z0-9]).+\"\r\n                     validateEqual=\"user_confirmPassword\" reverse=\"true\" />\r\n              <span class=\"errorMessage\" [hidden]=\"!(user_newPassword.dirty && user_newPassword.errors?.required)\">\r\n                {{ 'Register.PasswordValidation' | translate }}\r\n                <br />\r\n              </span>\r\n              <span class=\"errorMessage\" [hidden]=\"!(user_newPassword.dirty && user_newPassword.errors?.minlength)\">\r\n                {{ 'Register.PasswordCharLength' | translate }}\r\n                <br />\r\n              </span>\r\n              <span class=\"errorMessage\" [hidden]=\"!(user_newPassword.dirty && !user_newPassword.errors?.minlength && user_newPassword.errors?.pattern)\">\r\n                {{ 'Register.PasswordCharLength' | translate }}\r\n                <br />\r\n              </span>\r\n              <span class=\"errorMessage\" [hidden]=\"!(user_newPassword.dirty && user_confirmPassword.dirty) || !(user_newPassword.dirty && user_newPassword.errors?.validateEqual)\">\r\n                {{ 'Register.PasswordMatchValidation' | translate }}\r\n              </span>\r\n            </div>\r\n          </div>\r\n          <div class=\"col-md-4\">\r\n            <label class=\"control-label\" for=\"user_confirmPassword\">{{ 'Register.ConfirmPassword' | translate }}<span class=\"sa-required-text\">*</span></label>\r\n            <div class=\"has-feedback\" [ngClass]=\"{ 'has-error' : (user_newPassword.dirty || user_confirmPassword.dirty) && (user_newPassword.valid && !user_confirmPassword.valid) }\">\r\n              <input class=\"form-control\"\r\n                     id=\"user_confirmPassword\"\r\n                     name=\"user_confirmPassword\"\r\n                     type=\"password\"\r\n                     #user_confirmPassword=\"ngModel\"\r\n                     [(ngModel)]=\"model.user.confirmPassword\"\r\n                     validateEqual=\"user_newPassword\" />\r\n              <span class=\"errorMessage\" [hidden]=\"!(user_newPassword.dirty && user_confirmPassword.dirty) || !(user_confirmPassword.dirty && user_confirmPassword.errors?.validateEqual)\">\r\n                {{ 'Register.ConfirmPasswordRequired' | translate }}\r\n              </span>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <br />\r\n\r\n        <div class=\"row\">\r\n          <div class=\"col-md-4\">\r\n            <label class=\"control-label\" for=\"user_question01\">{{ 'Register.SecurityQuestion1' | translate }}<span class=\"sa-required-text\">*</span></label>\r\n            <div class=\"has-feedback\" [ngClass]=\"{ 'has-error' : !isUser && (user_question01.dirty && (!user_question01.valid || user_question01.errors || user_question01.selectedIndex == 0)) }\">\r\n              <select id=\"user_question01\" name=\"user_question01\" #user_question01=\"ngModel\" [(ngModel)]=\"model.user.question01\" class=\"form-control\" required validateNotEqual=\"user_question02\" reverse=\"true\">\r\n                <option *ngFor=\"let s of securityQuestions01\" [ngValue]=\"s.referenceEnglishId\" [selected]=\"user_question01 == s.referenceEnglishId\">{{ s.question | translate }}</option>\r\n              </select>\r\n              <span class=\"errorMessage\" [hidden]=\"isUser || !((user_question01.dirty || user_answer01.dirty) && (!user_question01.valid || user_question01.errors || user_question01.selectedIndex == 0))\">{{ 'Register.QuetionValidation' | translate }}</span>\r\n            </div>\r\n          </div>\r\n\r\n          <div class=\"col-md-4\">\r\n            <label class=\"control-label\" for=\"user_answer01\">{{ 'Register.Answer' | translate }}<span class=\"sa-required-text\">*</span></label>\r\n            <div class=\"has-feedback\" [ngClass]=\"{ 'has-error' : !isUser && ((user_answer01.dirty || user_question01.dirty) && (!user_answer01.valid || user_answer01.errors)) }\">\r\n              <input class=\"form-control\" id=\"user_answer01\" name=\"user_answer01\" type=\"text\" #user_answer01=\"ngModel\" [(ngModel)]=\"model.user.answer01\" required minlength=\"3\" />\r\n              <span class=\"errorMessage\" [hidden]=\"isUser || !((user_answer01.dirty || user_question01.dirty) && (!user_answer01.valid || user_answer01.errors))\">{{ 'Register.AnswerValidation' | translate }}</span>\r\n            </div>\r\n          </div>\r\n\r\n        </div>\r\n        <br />\r\n\r\n        <div class=\"row\">\r\n          <div class=\"col-md-4\">\r\n            <label class=\"control-label\" for=\"user_question02\">{{  'Register.SecurityQuestion2' | translate }}<span class=\"sa-required-text\">*</span></label>\r\n            <div class=\"has-feedback\" [ngClass]=\"{ 'has-error' : !isUser && ((user_question02.dirty || user_answer02.dirty) && (!user_question02.valid || user_question02.errors || user_question02.selectedIndex == 0)) }\">\r\n              <select id=\"user_question02\" name=\"user_question02\" #user_question02=\"ngModel\" [(ngModel)]=\"model.user.question02\" class=\"form-control\" required validateNotEqual=\"user_question01\">\r\n                <option *ngFor=\"let s of securityQuestions02\" [ngValue]=\"s.referenceEnglishId\" [selected]=\"user_question02 == s.referenceEnglishId\">{{ s.question | translate }}</option>\r\n              </select>\r\n              <span class=\"errorMessage\" [hidden]=\"isUser || !((user_question02.dirty || user_answer02.dirty) && (!user_question02.valid || user_question02.errors || user_question02.selectedIndex == 0))\">{{ 'Register.QuetionValidation' | translate }}</span>\r\n            </div>\r\n          </div>\r\n\r\n          <div class=\"col-md-4\">\r\n            <label class=\"control-label\" for=\"user_answer02\">{{ 'Register.Answer'  | translate }}<span class=\"sa-required-text\">*</span></label>\r\n            <div class=\"has-feedback\" [ngClass]=\"{ 'has-error' : !isUser && ((user_answer02.dirty || user_question02.dirty) && (!user_answer02.valid || user_answer02.errors)) }\">\r\n              <input class=\"form-control\" id=\"user_answer02\" name=\"user_answer02\" type=\"text\" #user_answer02=\"ngModel\" [(ngModel)]=\"model.user.answer02\" required minlength=\"3\" />\r\n              <span class=\"errorMessage\" [hidden]=\"isUser || !((user_answer02.dirty || user_question02.dirty) && (!user_answer02.valid || user_answer02.errors))\">{{ 'Register.AnswerValidation' | translate }}</span>\r\n            </div>\r\n          </div>\r\n\r\n        </div>\r\n        <br />\r\n\r\n        <div class=\"row\">\r\n          <div class=\"col-md-12\">\r\n            <div class=\"sa-inline-field\">\r\n              <input type=\"checkbox\" id=\"user_termsAccepted\" name=\"user_termsAccepted\" #user_termsAccepted=\"ngModel\" class=\"sa-radio-button\" [(ngModel)]=\"model.user.termsAccepted\" required />\r\n              <label class=\"sa-radio-button-text-spacer\" style=\"padding-top: 5px;\" for=\"user_termsAccepted\">\r\n                {{ 'Register.PrivacyandTermsofUse' | translate }} <span>\r\n\r\n                  <a href=\"https://www.scentair.com/legal/privacy.html\" target=\"_blank\">{{ 'Register.Privacy' | translate }}</a>\r\n                </span>&nbsp;{{ 'Register.And' | translate }}&nbsp;<span>\r\n                  <a href=\"https://www.scentair.com/legal/termsofuse.html\" target=\"_blank\">{{ 'Register.TermsofUse'  | translate }} </a> {{ 'Register.PrivacyandTermsofUseRemaining'  | translate }}\r\n                </span>.<span class=\"sa-required-text\">*</span>\r\n              </label>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <br />\r\n\r\n\r\n        <div class=\"row\">\r\n          <div class=\"col-md-12\">\r\n            <div class=\"sa-button-form-spacer\">\r\n              <button type=\"submit\" class=\"btn btn-lg btn-primary sa-btn-header-color\" [disabled]=\"isLoading || !f.valid\"><i *ngIf=\"isLoading\" class='fa fa-circle-o-notch fa-spin'></i> {{isLoading ? 'Registering...'  : 'Register.SaveLoginButton'  | translate}}</button>\r\n              <button class=\"btn-primary btn btn-lg sa-btn-header-color\" type=\"reset\" style=\"margin-left: 15px;\" (click)=\"cancel()\">{{ 'Register.CANCELButton' | translate }}</button>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n\r\n      <div class=\"row\" *ngIf=\"!isAccount\">\r\n        <div class=\"col-md-12\">\r\n          <div class=\"sa-button-form-spacer\">\r\n            <button type=\"submit\" class=\"btn btn-lg btn-primary sa-btn-header-color\" [disabled]=\"(isLoading  || !f.valid) || !captchaSuccess\">\r\n              <i *ngIf=\"isLoading\" class='fa fa-circle-o-notch fa-spin'></i> {{isLoading ? 'Looking up account...' : 'Register.LookupAccount' | translate}}\r\n            </button>\r\n            <button class=\"btn-primary btn btn-lg sa-btn-header-color\" style=\"margin-left: 15px;\" (click)=\"cancel()\">{{ 'Register.CANCEL' | translate }}</button>\r\n             \r\n          </div>\r\n        </div>\r\n      </div>\r\n\r\n</form>\r\n\r\n</div>\r\n\r\n\r\n"

/***/ }),

/***/ "./src/app/components/register/register.component.ts":
/*!***********************************************************!*\
  !*** ./src/app/components/register/register.component.ts ***!
  \***********************************************************/
/*! exports provided: RegisterComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RegisterComponent", function() { return RegisterComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var _services_configuration_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/configuration.service */ "./src/app/services/configuration.service.ts");
/* harmony import */ var _services_utilities__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../services/utilities */ "./src/app/services/utilities.ts");
/* harmony import */ var _models_register_model__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../models/register.model */ "./src/app/models/register.model.ts");
/* harmony import */ var _services_local_store_manager_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../services/local-store-manager.service */ "./src/app/services/local-store-manager.service.ts");
/* harmony import */ var _services_db_Keys__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../services/db-Keys */ "./src/app/services/db-Keys.ts");
/* harmony import */ var _services_app_translation_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../services/app-translation.service */ "./src/app/services/app-translation.service.ts");
/* harmony import */ var _services_language_observable_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../services/language-observable.service */ "./src/app/services/language-observable.service.ts");
/* harmony import */ var _GoogleCaptcha_ngx_captcha_lib_src_lib__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../GoogleCaptcha/ngx-captcha-lib/src/lib */ "./GoogleCaptcha/ngx-captcha-lib/src/lib/index.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};












var RegisterComponent = /** @class */ (function () {
    function RegisterComponent(accountService, configurations, router, location, localStorage, translationService, userInfoService) {
        this.accountService = accountService;
        this.configurations = configurations;
        this.router = router;
        this.location = location;
        this.localStorage = localStorage;
        this.translationService = translationService;
        this.userInfoService = userInfoService;
        this.submit = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.here = false;
        this.errorMessage = "";
        this.isLoading = false;
        this.isEdit = false;
        this.isError = false;
        this.isAccount = false;
        this.isUser = false;
        this.isModal = false;
        this.formResetToggle = true;
        this.captchaIsLoaded = false;
        this.captchaSuccess = false;
        this.captchaIsExpired = false;
        this.siteKey = '';
        this.useGlobalDomain = false;
    }
    RegisterComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Prod
        this.siteKey = '6LforZoUAAAAAJPt4NAqNpmu5rvY_zsfzNigCAsn';
        //Stage
        // this.siteKey = '6LdSmZgUAAAAAA-RJe4UxWSoYMx9_lrHsah1P8xT';
        //Local
        //this.siteKey = '6LdNz5cUAAAAAIO1jk77YhsJdZspLzqxC4U8kLSH';
        this.securityQuestions01 = [];
        this.securityQuestions02 = [];
        this.errors = [];
        this.isEdit = false;
        this.setForm();
        //if (this.getShouldRedirect()) {
        //  this.authService.redirectLoginUser();
        //}
        //else {
        //  this.loginStatusSubscription = this.authService.getLoginStatusEvent().subscribe(isLoggedIn => {
        //    if (this.getShouldRedirect()) {
        //      this.authService.redirectLoginUser();
        //    }
        //  });
        //}
        if (this.localStorage.exists(_services_db_Keys__WEBPACK_IMPORTED_MODULE_8__["DBkeys"].LANGUAGE)) {
            this.selectedLanguage = this.localStorage.getDataObject(_services_db_Keys__WEBPACK_IMPORTED_MODULE_8__["DBkeys"].LANGUAGE);
        }
        else {
            this.selectedLanguage = 'en';
        }
        this.accountService.getQuestions(this.selectedLanguage).subscribe(function (a) { return a.forEach(function (x) {
            _this.securityQuestions01.push(x);
            _this.securityQuestions02.push(x);
        }); });
        this.userInfoService.languageStream$.subscribe(function (lang) {
            if (_this.selectedLanguage != lang) {
                _this.selectedLanguage = lang;
                _this.getQuestions(lang);
            }
        });
    };
    RegisterComponent.prototype.ngOnDestroy = function () {
        if (this.registerSubscription) {
            this.registerSubscription.unsubscribe();
        }
    };
    RegisterComponent.prototype.getQuestions = function (language) {
        var _this = this;
        this.securityQuestions01 = [];
        this.securityQuestions02 = [];
        this.accountService.getQuestions(language).subscribe(function (a) {
            if (a && a.length > 0) {
                _this.securityQuestions01 = a;
                _this.securityQuestions02 = a;
            }
        });
    };
    RegisterComponent.prototype.setForm = function () {
        var _this = this;
        if (!this.isEdit) {
            this.model = new _models_register_model__WEBPACK_IMPORTED_MODULE_6__["register"]();
        }
        else {
            this.model = new _models_register_model__WEBPACK_IMPORTED_MODULE_6__["register"](this.data.user, this.data.account);
            this.isAccount = this.model.account &&
                this.model.account.name &&
                this.model.account.number &&
                this.model.account.name.length > 0 &&
                this.model.account.number.length > 0;
            this.isUser = this.model.user &&
                this.model.user.id &&
                this.model.user.id.length > 0;
            this.isError = this.errors !== null && this.errors.length > 0;
            this.isLoading = false;
            setTimeout(function () {
                var eventObj = {
                    isEdit: _this.isEdit,
                    data: _this.model,
                    errors: _this.errors,
                    isAccount: _this.isAccount,
                };
                _this.submit.emit(eventObj);
                if (_this.isAccount && _this.isUser)
                    _this.router.navigate(['/register/confirmation']);
            }, 500);
        }
    };
    RegisterComponent.prototype.closeModal = function () {
        if (this.modalClosedCallback) {
            this.modalClosedCallback();
        }
    };
    RegisterComponent.prototype.offerAlternateHost = function () {
    };
    RegisterComponent.prototype.reset = function () {
        var _this = this;
        this.formResetToggle = false;
        this.errors = [];
        this.isLoading = false;
        setTimeout(function () {
            _this.formResetToggle = true;
        });
    };
    RegisterComponent.prototype.handleSubmitSuccess = function (res) {
        this.isLoading = false;
        this.data = res;
        this.isEdit = true;
        this.errors = [];
        this.setForm();
    };
    RegisterComponent.prototype.handleSubmitError = function (err) {
        var serverError = _services_utilities__WEBPACK_IMPORTED_MODULE_5__["Utilities"].getHttpErrors(err);
        var error = serverError.length > 0 ? serverError[0].includes("already") : false;
        if (error) {
            this.errorMessage = "Register.ErrorMessage1";
            this.here = true;
        }
        else {
            this.errorMessage = "Register.ErrorMessage2";
            this.here = false;
        }
        this.isLoading = false;
        this.setForm();
        this.captchaReset();
    };
    RegisterComponent.prototype.register = function () {
        var _this = this;
        this.isLoading = true;
        this.registerSubscription = this.accountService.register(this.model)
            .subscribe(function (data) { return _this.handleSubmitSuccess(data); }, function (err) { return _this.handleSubmitError(err); });
    };
    RegisterComponent.prototype.cancel = function () {
        this.location.back();
    };
    RegisterComponent.prototype.toggleAcctNoPopover = function (e) {
        this.isAcctNoPopoverVisible = !this.isAcctNoPopoverVisible;
        return this.isAcctNoPopoverVisible;
    };
    RegisterComponent.prototype.togglePinNoPopover = function (e) {
        this.isPinNoPopoverVisible = !this.isPinNoPopoverVisible;
        return this.isPinNoPopoverVisible;
    };
    RegisterComponent.prototype.toggleUsernamePopover = function (e) {
        this.isUsernamePopoverVisible = !this.isUsernamePopoverVisible;
        return this.isUsernamePopoverVisible;
    };
    RegisterComponent.prototype.togglePasswordPopover = function (e) {
        this.isPasswordPopoverVisible = !this.isPasswordPopoverVisible;
        return this.isPasswordPopoverVisible;
    };
    RegisterComponent.prototype.captchaHandleReset = function () {
        this.captchaSuccess = false;
        this.captchaResponse = undefined;
        this.captchaIsExpired = false;
    };
    RegisterComponent.prototype.captchaReset = function () {
        this.captchaElem.resetCaptcha();
    };
    RegisterComponent.prototype.CaptchaHandleSuccess = function (captchaResponse) {
        this.captchaSuccess = true;
        this.captchaResponse = captchaResponse;
        this.captchaIsExpired = false;
    };
    RegisterComponent.prototype.captchaHandleLoad = function () {
        this.captchaIsLoaded = true;
        this.captchaIsExpired = false;
    };
    RegisterComponent.prototype.captchaHandleExpire = function () {
        this.captchaSuccess = false;
        this.captchaIsExpired = true;
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", _models_register_model__WEBPACK_IMPORTED_MODULE_6__["register"])
    ], RegisterComponent.prototype, "data", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], RegisterComponent.prototype, "submit", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], RegisterComponent.prototype, "isModal", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('captchaElem'),
        __metadata("design:type", _GoogleCaptcha_ngx_captcha_lib_src_lib__WEBPACK_IMPORTED_MODULE_11__["ReCaptcha2Component"])
    ], RegisterComponent.prototype, "captchaElem", void 0);
    RegisterComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-register',
            template: __webpack_require__(/*! ./register.component.html */ "./src/app/components/register/register.component.html"),
            styles: [__webpack_require__(/*! ./register.component.css */ "./src/app/components/register/register.component.css")]
        }),
        __metadata("design:paramtypes", [_services_account_service__WEBPACK_IMPORTED_MODULE_3__["AccountService"],
            _services_configuration_service__WEBPACK_IMPORTED_MODULE_4__["ConfigurationService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"],
            _angular_common__WEBPACK_IMPORTED_MODULE_2__["Location"], _services_local_store_manager_service__WEBPACK_IMPORTED_MODULE_7__["LocalStoreManager"], _services_app_translation_service__WEBPACK_IMPORTED_MODULE_9__["AppTranslationService"], _services_language_observable_service__WEBPACK_IMPORTED_MODULE_10__["LanguageObservableService"]])
    ], RegisterComponent);
    return RegisterComponent;
}());



/***/ }),

/***/ "./src/app/components/reset-password/reset-password.component.css":
/*!************************************************************************!*\
  !*** ./src/app/components/reset-password/reset-password.component.css ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/components/reset-password/reset-password.component.html":
/*!*************************************************************************!*\
  !*** ./src/app/components/reset-password/reset-password.component.html ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container sa-container-minsize sa-header-margin\">\r\n\r\n  <header class=\"pageHeader\">\r\n\r\n    <div class=\"row\">\r\n      <div class=\"col-md=12\">\r\n        <div class=\"sa-heading-text\">{{ 'Password Reset' | translate }}</div>\r\n      </div>\r\n    </div>\r\n    <div class=\"row\">\r\n      <div class=\"col-md-12 has-feedback has-error\">\r\n        <div *ngFor=\"let err of errors\" class=\"errorMessage\">{{ err | translate }}</div>\r\n      </div>\r\n    </div>\r\n\r\n  </header>\r\n  <div class=\"row\" *ngIf=\"!isConfirmed\">\r\n  <form class=\"form\" name=\"f\" id=\"f\" #f=\"ngForm\" (ngSubmit)=\"resetPassword()\">\r\n    <div class=\"row\">\r\n      <div class=\"col-md-12\">\r\n        <label class=\"control-label\" for=\"userName\">{{ 'Username' | translate }}<span class=\"sa-required-text\">*</span></label>\r\n        <div class=\"has-feedback\" [ngClass]=\"{ 'has-error' : (userName.dirty && (!userName.valid || userName.errors)) }\">\r\n          <input class=\"form-control\" id=\"userName\" name=\"userName\" type=\"text\" #userName=\"ngModel\" [(ngModel)]=\"model.userName\" required minlength=\"6\" />\r\n          <span class=\"errorMessage\" [hidden]=\"!(userName.dirty && (!userName.valid || userName.errors))\">{{ 'Username is required' | translate }}{{ model.userName?.messages}}</span>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"row\">\r\n      <div class=\"col-md-12\">\r\n        <label class=\"control-label\" for=\"newPassword\">{{ 'New Password' | translate }}<span class=\"sa-required-text\">*</span></label>\r\n        <div class=\"has-feedback\" [ngClass]=\"{ 'has-error' : (newPassword.dirty && newPassword.valid) }\">\r\n          <input class=\"form-control\"\r\n                 id=\"newPassword\"\r\n                 name=\"newPassword\"\r\n                 type=\"password\"\r\n                 #newPassword=\"ngModel\"\r\n                 [(ngModel)]=\"model.newPassword\"\r\n                 required\r\n                 minlength=\"8\"\r\n                 pattern=\"^(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=\\D*\\d)(?=[a-zA-Z0-9]*[^a-zA-Z0-9]).+\"\r\n                 validateEqual=\"confirmPassword\" reverse=\"true\" />\r\n          <span class=\"errorMessage\" [hidden]=\"!(newPassword.dirty && newPassword.errors?.required)\">\r\n            {{ 'Password is required' | translate }}\r\n            <br />\r\n          </span>\r\n          <span class=\"errorMessage\" [hidden]=\"!(newPassword.dirty && newPassword.errors?.minlength)\">\r\n            {{ 'Password must be at least 8 characters' | translate }}\r\n            <br />\r\n          </span>\r\n          <span class=\"errorMessage\" [hidden]=\"!(newPassword.dirty && !newPassword.errors?.minlength && newPassword.errors?.pattern)\">\r\n            {{ 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special charater' | translate }}\r\n            <br />\r\n          </span>\r\n          <span class=\"errorMessage\" [hidden]=\"!(newPassword.dirty && confirmPassword.dirty) || !(newPassword.dirty && newPassword.errors?.validateEqual)\">\r\n            {{ 'Password does not match confirmation' | translate }}\r\n          </span>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"row\">\r\n      <div class=\"col-md-12\">\r\n        <label class=\"control-label\" for=\"confirmPassword\">{{ 'Confirm Password' | translate }}<span class=\"sa-required-text\">*</span></label>\r\n        <div class=\"has-feedback\" [ngClass]=\"{ 'has-error' : (newPassword.dirty || confirmPassword.dirty) && (newPassword.valid && !confirmPassword.valid) }\">\r\n          <input class=\"form-control\"\r\n                 id=\"confirmPassword\"\r\n                 name=\"confirmPassword\"\r\n                 type=\"password\"\r\n                 #confirmPassword=\"ngModel\"\r\n                 [(ngModel)]=\"model.confirmPassword\"\r\n                 required\r\n                 validateEqual=\"newPassword\" />\r\n          <span class=\"errorMessage\" [hidden]=\"!(newPassword.dirty && confirmPassword.dirty) || !(confirmPassword.dirty && confirmPassword.errors?.validateEqual)\">\r\n            {{ 'Confirmation of password is required' | translate }}\r\n          </span>\r\n        </div>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"row\">\r\n      <div class=\"col-md-12\">\r\n        <div class=\"sa-button-form-spacer\">\r\n          <button type=\"submit\" class=\"btn btn-lg btn-primary sa-btn-header-color\" [disabled]=\"isLoading || !f.valid\">\r\n            <i *ngIf=\"isLoading\" class='fa fa-circle-o-notch fa-spin'></i> {{isLoading ? 'Changing Password...' : 'Change Password'}}\r\n          </button>\r\n          <button class=\"btn-primary btn btn-lg sa-btn-header-color\" style=\"margin-left: 15px;\" (click)=\"cancel()\">{{ 'CANCEL' | translate }}</button>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </form>\r\n  </div>\r\n  <div class=\"row\" *ngIf=\"isConfirmed\">\r\n    <div class=\"col-md-12\">\r\n      <div>\r\n        Your password has been reset.<br /><br />\r\n      </div>\r\n      <div>\r\n        <p>\r\n          <a routerLink=\"/login\">{{ 'Login' | translate }}</a> to view account details, make payments and add additional users.\r\n        </p>\r\n      </div>\r\n    </div>\r\n    <br />\r\n    <br />\r\n  </div>\r\n\r\n  <div class=\"row\" *ngIf=\"isConfirmed\">\r\n    <div class=\"col-md-12\">\r\n      <div>\r\n        <a routerLink=\"/login\" title=\"{{ 'Login' | translate }}\" class=\"btn btn-lg btn-primary sa-btn-header-color\">{{ 'Login' | translate }}</a>\r\n      </div>\r\n    </div>\r\n    <br />\r\n    <br />\r\n  </div>\r\n\r\n  <br /><br /><br />\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      <div>\r\n        AMERICAS: Toll free: <a href=\"tel:+8667236824\">+866-723-6824</a> or <a href=\"tel:+17045042320\">+1 704-504-2320</a>\r\n      </div>\r\n      <br />\r\n      <div>\r\n        EMEA: <a href=\"tel:+330562576320\">+33 (0)5 62 57 63 20</a>\r\n      </div>\r\n      <br />\r\n      <div>\r\n        UK: <a href=\"tel:+4401628601650\">+44 (0) 1628-601650</a>\r\n      </div>\r\n      <br />\r\n      <div>\r\n        APAC: <a href=\"tel:+85362625256\">+(853) 626-25256</a> or <a href=\"tel:+(852) 356-35566\">(852) 356-35566</a>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/components/reset-password/reset-password.component.ts":
/*!***********************************************************************!*\
  !*** ./src/app/components/reset-password/reset-password.component.ts ***!
  \***********************************************************************/
/*! exports provided: ResetPasswordComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ResetPasswordComponent", function() { return ResetPasswordComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _services_utilities__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/utilities */ "./src/app/services/utilities.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var ResetPasswordComponent = /** @class */ (function () {
    function ResetPasswordComponent(accountService, route, router, location) {
        this.accountService = accountService;
        this.route = route;
        this.router = router;
        this.location = location;
        this.errors = [];
        this.isLoading = false;
        this.isConfirmed = false;
    }
    ResetPasswordComponent.prototype.ngOnInit = function () {
        var userId = this.route.snapshot.paramMap.get('id');
        var code = this.route.snapshot.paramMap.get('code');
        this.model = {
            userName: '',
            newPassword: '',
            confirmPassword: ''
        };
        this.userId = userId;
        this.code = code;
    };
    ResetPasswordComponent.prototype.cancel = function () {
        this.router.navigate(["/"]);
    };
    ResetPasswordComponent.prototype.resetPassword = function () {
        var _this = this;
        this.isLoading = true;
        this.accountService.confirmForgotPassword(this.code, this.model.userName, this.model.newPassword)
            .subscribe(function (data) { return _this.handleSubmitSuccess(data); }, function (error) { return _this.handleSubmitError(error); });
    };
    ResetPasswordComponent.prototype.handleSubmitSuccess = function (res) {
        this.errors = [];
        this.isLoading = false;
        this.isConfirmed = true;
    };
    ResetPasswordComponent.prototype.handleSubmitError = function (err) {
        var serverError = _services_utilities__WEBPACK_IMPORTED_MODULE_4__["Utilities"].getHttpErrors(err);
        this.errors = serverError;
        this.isConfirmed = false;
        this.isLoading = false;
    };
    ResetPasswordComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-reset-password',
            template: __webpack_require__(/*! ./reset-password.component.html */ "./src/app/components/reset-password/reset-password.component.html"),
            styles: [__webpack_require__(/*! ./reset-password.component.css */ "./src/app/components/reset-password/reset-password.component.css")]
        }),
        __metadata("design:paramtypes", [_services_account_service__WEBPACK_IMPORTED_MODULE_2__["AccountService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"],
            _angular_common__WEBPACK_IMPORTED_MODULE_3__["Location"]])
    ], ResetPasswordComponent);
    return ResetPasswordComponent;
}());



/***/ }),

/***/ "./src/app/components/settings/settings.component.css":
/*!************************************************************!*\
  !*** ./src/app/components/settings/settings.component.css ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".side-menu {\r\n  min-width: 120px;\r\n}\r\n\r\n.separator-hr {\r\n  margin-top: 0;\r\n  margin-bottom: 10px;\r\n}\r\n\r\n[hidden] {\r\n  display: none;\r\n}\r\n"

/***/ }),

/***/ "./src/app/components/settings/settings.component.html":
/*!*************************************************************!*\
  !*** ./src/app/components/settings/settings.component.html ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container\">\r\n  <header class=\"pageHeader\">\r\n    <h3><i class=\"fa fa-cog fa-lg page-caption\" aria-hidden=\"true\"></i> {{'pageHeader.Settings' | translate}}</h3>\r\n  </header>\r\n\r\n  <div [@fadeInOut] class=\"row\">\r\n    <div class=\"col-sm-2 side-menu\">\r\n      <ul bootstrapTab #tab=\"bootstrap-tab\" class=\"nav nav-tabs tabs-left\" (showBSTab)=\"onShowTab($event)\">\r\n        <li class=\"active\">\r\n          <a id=\"profileTab\" [routerLink]=\"[]\" fragment=\"profile\" href=\"#profile\" data-toggle=\"tab\"><i class=\"fa fa-user-circle-o fa-fw\" aria-hidden=\"true\"></i> {{'settings.tab.Profile' | translate}}</a>\r\n        </li>\r\n        <!--<li>\r\n          <a id=\"preferencesTab\" [routerLink]=\"[]\" fragment=\"preferences\" href=\"#preferences\" data-toggle=\"tab\"><i class=\"fa fa-sliders fa-fw\" aria-hidden=\"true\"></i> {{'settings.tab.Preferences' | translate}}</a>\r\n        </li>-->\r\n        <li [hidden]=\"!canViewUsers\">\r\n          <a id=\"usersTab\" [routerLink]=\"[]\" fragment=\"users\" href=\"#users\" data-toggle=\"tab\"><i class=\"fa fa-users fa-fw\" aria-hidden=\"true\"></i> {{'settings.tab.Users' | translate}}</a>\r\n        </li>\r\n        <li [hidden]=\"!canViewRoles\">\r\n          <a id=\"rolesTab\" [routerLink]=\"[]\" fragment=\"roles\" href=\"#roles\" data-toggle=\"tab\"><i class=\"fa fa-shield fa-fw\" aria-hidden=\"true\"></i> {{'settings.tab.Roles' | translate}}</a>\r\n        </li>\r\n      </ul>\r\n    </div>\r\n    <div class=\"col-sm-10\">\r\n      <div class=\"tab-content\">\r\n        <div class=\"tab-pane active\" id=\"profile\">\r\n          <h4>{{'settings.header.UserProfile' | translate}}</h4>\r\n          <hr class=\"separator-hr\" />\r\n          <div [@fadeInOut] *ngIf=\"isProfileActivated\" class=\"content-container\">\r\n            <user-info></user-info>\r\n          </div>\r\n        </div>\r\n\r\n        <!--<div class=\"tab-pane\" id=\"preferences\">\r\n          <h4>{{'settings.header.UserPreferences' | translate}}</h4>\r\n          <hr class=\"separator-hr\" />\r\n          <div [@fadeInOut] *ngIf=\"isPreferencesActivated\" class=\"content-container\">\r\n            <user-preferences></user-preferences>\r\n          </div>\r\n        </div>-->\r\n\r\n        <div class=\"tab-pane\" id=\"users\">\r\n          <h4>{{'settings.header.UsersManagements' | translate}}</h4>\r\n          <hr class=\"separator-hr\" />\r\n          <div [@fadeInOut] *ngIf=\"canViewUsers && isUsersActivated\" class=\"content-container\">\r\n            <users-management></users-management>\r\n          </div>\r\n        </div>\r\n\r\n        <div class=\"tab-pane\" id=\"roles\">\r\n          <h4>{{'settings.header.RolesManagement' | translate}}</h4>\r\n          <hr class=\"separator-hr\" />\r\n          <div [@fadeInOut] *ngIf=\"canViewRoles && isRolesActivated\" class=\"content-container\">\r\n            <roles-management></roles-management>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/components/settings/settings.component.ts":
/*!***********************************************************!*\
  !*** ./src/app/components/settings/settings.component.ts ***!
  \***********************************************************/
/*! exports provided: SettingsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SettingsComponent", function() { return SettingsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_animations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/animations */ "./src/app/services/animations.ts");
/* harmony import */ var _directives_bootstrap_tab_directive__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../directives/bootstrap-tab.directive */ "./src/app/directives/bootstrap-tab.directive.ts");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var _models_permission_model__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../models/permission.model */ "./src/app/models/permission.model.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var SettingsComponent = /** @class */ (function () {
    function SettingsComponent(route, accountService) {
        this.route = route;
        this.accountService = accountService;
        this.isProfileActivated = true;
        this.isPreferencesActivated = false;
        this.isUsersActivated = false;
        this.isRolesActivated = false;
        this.profileTab = "profile";
        this.preferencesTab = "preferences";
        this.usersTab = "users";
        this.rolesTab = "roles";
    }
    SettingsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.fragmentSubscription = this.route.fragment.subscribe(function (anchor) { return _this.showContent(anchor); });
    };
    SettingsComponent.prototype.ngOnDestroy = function () {
        this.fragmentSubscription.unsubscribe();
    };
    SettingsComponent.prototype.showContent = function (anchor) {
        if ((this.isFragmentEquals(anchor, this.usersTab) && !this.canViewUsers) ||
            (this.isFragmentEquals(anchor, this.rolesTab) && !this.canViewRoles))
            return;
        this.tab.show("#" + (anchor || this.profileTab) + "Tab");
    };
    SettingsComponent.prototype.isFragmentEquals = function (fragment1, fragment2) {
        if (fragment1 == null)
            fragment1 = "";
        if (fragment2 == null)
            fragment2 = "";
        return fragment1.toLowerCase() == fragment2.toLowerCase();
    };
    SettingsComponent.prototype.onShowTab = function (event) {
        var activeTab = event.target.attributes["fragment"].value;
        this.isProfileActivated = activeTab == this.profileTab;
        // this.isPreferencesActivated = activeTab == this.preferencesTab;
        this.isUsersActivated = activeTab == this.usersTab;
        this.isRolesActivated = activeTab == this.rolesTab;
    };
    Object.defineProperty(SettingsComponent.prototype, "canViewUsers", {
        get: function () {
            return this.accountService.userHasPermission(_models_permission_model__WEBPACK_IMPORTED_MODULE_5__["Permission"].viewUsersPermission);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SettingsComponent.prototype, "canViewRoles", {
        get: function () {
            return this.accountService.userHasPermission(_models_permission_model__WEBPACK_IMPORTED_MODULE_5__["Permission"].viewRolesPermission);
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])("tab"),
        __metadata("design:type", _directives_bootstrap_tab_directive__WEBPACK_IMPORTED_MODULE_3__["BootstrapTabDirective"])
    ], SettingsComponent.prototype, "tab", void 0);
    SettingsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'settings',
            template: __webpack_require__(/*! ./settings.component.html */ "./src/app/components/settings/settings.component.html"),
            styles: [__webpack_require__(/*! ./settings.component.css */ "./src/app/components/settings/settings.component.css")],
            animations: [_services_animations__WEBPACK_IMPORTED_MODULE_2__["fadeInOut"]]
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"],
            _services_account_service__WEBPACK_IMPORTED_MODULE_4__["AccountService"]])
    ], SettingsComponent);
    return SettingsComponent;
}());



/***/ }),

/***/ "./src/app/components/terms/terms.component.css":
/*!******************************************************!*\
  !*** ./src/app/components/terms/terms.component.css ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/components/terms/terms.component.html":
/*!*******************************************************!*\
  !*** ./src/app/components/terms/terms.component.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container\" style=\"min-height: 500px;\">\r\n  <div *ngIf=\"isLoggedIn\" style=\" margin-top: 35px;\">\r\n    &nbsp;\r\n  </div>\r\n  <header class=\"pageHeader\"></header>\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      <div class=\"sa-heading-text\">\r\n        Terms &amp; Conditions\r\n      </div>\r\n    </div>\r\n  </div>\r\n  \r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      <!--<h3>\r\n      Effective date: August 21, 2018\r\n    </h3>\r\n    <p>\r\n      ScentAir (“us”, “we”, or “our”) operates the portal.scentair.com website (hereinafter referred to as the “Service”).\r\n    </p>\r\n    <p>\r\n      This page informs you of our policies regarding the collection, use and disclosure of personal data when you use our Service and the choices you have associated with that data.\r\n    </p>\r\n    <p>\r\n      We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, the terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, accessible from portal.scentair.com\r\n    </p>\r\n\r\n      Definitions\r\n      <ul>\r\n        <li>\r\n          Service is the portal.scentair.com website operated by ScentAir\r\n        </li>\r\n        <li>\r\n          Personal DataPersonal Data means data about a living individual who can be identified from those data (or from those and other information either in our possession or likely to come into our possession).\r\n        </li>\r\n        <li>\r\n          Usage DataUsage Data is data collected automatically either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).\r\n        </li>\r\n        <li>\r\n          CookiesCookies are small files stored on your device (computer or mobile device).\r\n        </li>\r\n        <li>\r\n          Data ControllerData Controller means the natural or legal person who (either alone or jointly or in common with other persons) determines the purposes for which and the manner in which any personal information are, or are to be, processed.For the purpose of this Privacy Policy, we are a Data Controller of your Personal Data.\r\n        </li>\r\n        <li>\r\n          Data Processors (or Service Providers)Data Processor (or Service Provider) means any natural or legal person who processes the data on behalf of the Data Controller.We may use the services of various Service Providers in order to process your data more effectively.\r\n        </li>\r\n        <li>\r\n          Data Subject (or User)Data Subject is any living individual who is using our Service and is the subject of Personal Data.\r\n        </li>\r\n\r\n      </ul>\r\n  -->\r\n        <div class=\"row\" style=\"text-align:center;\"><span style=\"font-size:large;font-weight:bold;\">ScentAir Electronic Payment Terms and Conditions</span></div>\r\n        <br />\r\n        <span style=\"font-weight:bold;\">BY CHECKING THE BOX,</span> Authorized Agent (“Agent”): <span style=\"font-weight:bold;\">(a) certifies</span> that Agent (i) is authorized to sign and legally bind Subscriber to contracts and to select Subscriber’s recurring Payment Type, and (ii) has corrected any errors in the above fields and will supply accurate details about Subscriber’s Payment Type in the subsequent screens that are provided by Chase Paymentech; <span style=\"font-weight:bold;\">(b) signs</span> the below “Enrollment & Authorization of Recurring Payments” (“<span style=\"font-weight:bold;\">Authorization</span>”) on behalf of Subscriber, which Authorization is incorporated herein;\r\n        <br />\r\n        <span style=\"font-weight:bold;\">(c) certifies</span> that Agent (i) has made a copy of the Authorization for Subscriber's records, and (ii) confirms Subscriber's signature and delivers the Authorization for ScentAir's acceptance (in its discretion); and <span style=\"font-weight:bold;\">(d) consents</span> to the processing of any outstanding balance on Subscriber’s account and understands that the enrolled credit card will be charged in that amount without any further authorization.\r\n        <br /><br /> <div class=\"row\" style=\"text-align:center;\"> <span style=\"text-align:center;font-size:large;font-style:italic;\">Enrollment & Authorization of Recurring Payments (“Authorization”)</span><br /><br /></div>\r\n        <span style=\"font-weight:bold;color:red;\">General Terms:</span> The Subscriber named in the “Environmental Scent Service Agreement” (“ESS”) between Subscriber and ScentAir, hereby authorizes ScentAir, for the term of the ESS, to obtain funds from the “Payment Type” selected above for purposes of paying amounts, including late charges and other fees, now or later due from Subscriber as specified in ScentAir invoices (“<span style=\"font-weight:bold;\">Invoice Amounts</span>”). Subscriber agrees that all ESS-related transactions are and will always be primarily for business purposes and that Subscriber is and will remain the owner of the bank, or credit card, account specified during enrollment (“<span style=\"font-weight:bold;\">Enrollment Screens</span>”). Subscriber agrees that this Authorization will remain in effect until subscriber cancels it by providing notice via the below “Cancellation Mechanism” at least fifteen (15) days prior to the next invoice billing date. Subscriber agrees that it will still owe the Invoice Amount(s) to the extent ScentAir is not able to obtain payment via Subscriber’s Payment Type. ScentAir reserves all rights. As used above, “Cancellation Mechanism” means notice to ScentAir either (a) at 3810 Shutterfly Road, Suite 900, Charlotte, NC 28217 by certified mail, or (b) via email at <a href=\"mailto:customercare@scentair.com\">customercare@scentair.com</a>, which notice shall state (i) the date of notice delivery and Subscriber’s Customer ID #, (ii) the effective date for cancellation of the recurring payment method, and (iii) the payment method Subscriber will use post-cancellation.\r\n        <br /><br />\r\n        Subscriber further agrees:\r\n        <br /><br />\r\n        <span style=\"font-weight:bold;color:red;\">ACH Authorization.</span> If the “Payment Type” is “ACH CCD,” Subscriber agrees to the General Terms and to the rules of the National Automated Clearinghouse (“NACHA” or “ACH”) now or later in effect. In addition, Subscriber authorizes ScentAir to debit the Invoice Amounts (which may vary in amount) on, or shortly before or after, the invoice due date from the bank account indicated in the Enrollment Screens (as updated). Subscriber agrees to: (a) timely notify ScentAir of any changes in Subscriber’s account information; and (b) reimburse ScentAir for all penalties and fees incurred as a result of any rejection of ScentAir’s request for account funds for any reason, including insufficient or unavailable funds or as a result of the account not being properly configured (such as for ACH transactions). Subscriber agrees that if an Invoice Amount is returned unpaid: (a) ScentAir may at its discretion attempt to process it as allowed by applicable NACHA rules, and (b) ScentAir may also make an ACH debit for a returned item fee of at least $4.50 or any greater amount that ScentAir is directly or indirectly obligated by NACHA rules to bear in relation to returned items.\r\n        <br /><br /><span style=\"font-weight:bold;color:red;\">Credit Card Authorization. </span> If the “Payment Type” is “Credit Card,” Subscriber agrees to the General Terms. Subscriber also agrees to all terms of the ACH Authorization, except that the NACHA rules will not apply and these differences will apply: (i) the account will be Subscriber’s credit card account instead of its bank account and if a charge is rejected, ScentAir will not resubmit the charge or seek a returned item fee except as allowed by applicable card brand rules; and (ii) Subscriber acknowledges ScentAir’s cancellation and refund policies regarding ScentAir products.\r\n        This Authorization supplements the ESS by providing the method and terms for payment by Subscriber of amounts due under the ESS.\r\n\r\n        <br /><br /><span style=\"font-weight:bold;color:red;\">Privacy.</span> Subscriber agrees to the terms contained in ScentAir’s Privacy Policy https://www.scentair.com/legal/privacy as they may be updated from time to time and agrees that it will refer to https://www.scentair.com/legal/privacy.html for all information related to ScentAir’s Privacy Policy and any additional rights Subscriber may have related to these Terms and Conditions and this Authorization, as well as any rights related to Subscriber’s data in general.\r\n\r\n\r\n    </div>\r\n  </div>\r\n\r\n</div>\r\n\r\n"

/***/ }),

/***/ "./src/app/components/terms/terms.component.ts":
/*!*****************************************************!*\
  !*** ./src/app/components/terms/terms.component.ts ***!
  \*****************************************************/
/*! exports provided: TermsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TermsComponent", function() { return TermsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_animations__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/animations */ "./src/app/services/animations.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var TermsComponent = /** @class */ (function () {
    function TermsComponent() {
    }
    TermsComponent.prototype.ngOnInit = function () {
    };
    TermsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'terms',
            template: __webpack_require__(/*! ./terms.component.html */ "./src/app/components/terms/terms.component.html"),
            styles: [__webpack_require__(/*! ./terms.component.css */ "./src/app/components/terms/terms.component.css")],
            animations: [_services_animations__WEBPACK_IMPORTED_MODULE_1__["fadeInOut"]]
        }),
        __metadata("design:paramtypes", [])
    ], TermsComponent);
    return TermsComponent;
}());



/***/ }),

/***/ "./src/app/directives/autofocus.directive.ts":
/*!***************************************************!*\
  !*** ./src/app/directives/autofocus.directive.ts ***!
  \***************************************************/
/*! exports provided: AutofocusDirective */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AutofocusDirective", function() { return AutofocusDirective; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var AutofocusDirective = /** @class */ (function () {
    function AutofocusDirective(elementRef) {
        this.elementRef = elementRef;
    }
    AutofocusDirective.prototype.ngOnInit = function () {
        var _this = this;
        setTimeout(function () { return _this.elementRef.nativeElement['focus'](); }, 500);
    };
    AutofocusDirective = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Directive"])({
            selector: '[autofocus]'
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]])
    ], AutofocusDirective);
    return AutofocusDirective;
}());



/***/ }),

/***/ "./src/app/directives/bootstrap-datepicker.directive.ts":
/*!**************************************************************!*\
  !*** ./src/app/directives/bootstrap-datepicker.directive.ts ***!
  \**************************************************************/
/*! exports provided: BootstrapDatepickerDirective */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BootstrapDatepickerDirective", function() { return BootstrapDatepickerDirective; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var BootstrapDatepickerDirective = /** @class */ (function () {
    function BootstrapDatepickerDirective(el) {
        var _this = this;
        this.el = el;
        this._isShown = false;
        this.options = {};
        this.ngModelChange = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.changedSubscription = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["fromEvent"])($(this.el.nativeElement), 'change').subscribe(function (e) { return setTimeout(function () { return _this.ngModelChange.emit(e.target.value); }); });
        this.shownSubscription = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["fromEvent"])($(this.el.nativeElement), 'show').subscribe(function (e) { return _this._isShown = true; });
        this.hiddenSubscription = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["fromEvent"])($(this.el.nativeElement), 'hide').subscribe(function (e) { return _this._isShown = false; });
    }
    Object.defineProperty(BootstrapDatepickerDirective.prototype, "isShown", {
        get: function () {
            return this._isShown;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BootstrapDatepickerDirective.prototype, "ngModel", {
        set: function (value) {
            this.tryUpdate(value);
        },
        enumerable: true,
        configurable: true
    });
    BootstrapDatepickerDirective.prototype.ngOnInit = function () {
        this.initialize(this.options);
    };
    BootstrapDatepickerDirective.prototype.ngOnDestroy = function () {
        this.destroy();
    };
    BootstrapDatepickerDirective.prototype.initialize = function (options) {
        $(this.el.nativeElement).datepicker(options);
    };
    BootstrapDatepickerDirective.prototype.destroy = function () {
        if (this.changedSubscription) {
            this.changedSubscription.unsubscribe();
            this.shownSubscription.unsubscribe();
            this.hiddenSubscription.unsubscribe();
        }
        $(this.el.nativeElement).datepicker('destroy');
    };
    BootstrapDatepickerDirective.prototype.show = function () {
        $(this.el.nativeElement).datepicker('show');
    };
    BootstrapDatepickerDirective.prototype.hide = function () {
        $(this.el.nativeElement).datepicker('hide');
    };
    BootstrapDatepickerDirective.prototype.toggle = function () {
        this.isShown ? this.hide() : this.show();
    };
    BootstrapDatepickerDirective.prototype.tryUpdate = function (value) {
        var _this = this;
        clearTimeout(this.updateTimeout);
        if (!$(this.el.nativeElement).is(":focus")) {
            this.update(value);
        }
        else {
            this.updateTimeout = setTimeout(function () {
                _this.updateTimeout = null;
                _this.tryUpdate(value);
            }, 100);
        }
    };
    BootstrapDatepickerDirective.prototype.update = function (value) {
        var _this = this;
        setTimeout(function () { return $(_this.el.nativeElement).datepicker('update', value); });
    };
    BootstrapDatepickerDirective.prototype.setDate = function (value) {
        var _this = this;
        setTimeout(function () { return $(_this.el.nativeElement).datepicker('setDate', value); });
    };
    BootstrapDatepickerDirective.prototype.setUTCDate = function (value) {
        var _this = this;
        setTimeout(function () { return $(_this.el.nativeElement).datepicker('setUTCDate', value); });
    };
    BootstrapDatepickerDirective.prototype.clearDates = function () {
        var _this = this;
        setTimeout(function () { return $(_this.el.nativeElement).datepicker('clearDates'); });
    };
    BootstrapDatepickerDirective.prototype.getDate = function () {
        $(this.el.nativeElement).datepicker('getDate');
    };
    BootstrapDatepickerDirective.prototype.getUTCDate = function () {
        $(this.el.nativeElement).datepicker('getUTCDate');
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], BootstrapDatepickerDirective.prototype, "options", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], BootstrapDatepickerDirective.prototype, "ngModel", null);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], BootstrapDatepickerDirective.prototype, "ngModelChange", void 0);
    BootstrapDatepickerDirective = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Directive"])({
            selector: '[bootstrapDatepicker]',
            exportAs: 'bootstrap-datepicker'
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]])
    ], BootstrapDatepickerDirective);
    return BootstrapDatepickerDirective;
}());



/***/ }),

/***/ "./src/app/directives/bootstrap-select.directive.ts":
/*!**********************************************************!*\
  !*** ./src/app/directives/bootstrap-select.directive.ts ***!
  \**********************************************************/
/*! exports provided: BootstrapSelectDirective */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BootstrapSelectDirective", function() { return BootstrapSelectDirective; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var BootstrapSelectDirective = /** @class */ (function () {
    function BootstrapSelectDirective(el) {
        var _this = this;
        this.el = el;
        this.oldValues = "";
        this.ngModelChange = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.shown = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.hidden = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.changedSubscription = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["fromEvent"])($(this.el.nativeElement), 'changed.bs.select').subscribe(function (e) { return setTimeout(function () {
            if (_this.checkIsValuesChanged(_this.selected))
                _this.ngModelChange.emit(_this.selected);
        }); });
        this.shownSubscription = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["fromEvent"])($(this.el.nativeElement), 'shown.bs.select').subscribe(function (e) { return setTimeout(function () { return _this.shown.emit(); }); });
        this.hiddenSubscription = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["fromEvent"])($(this.el.nativeElement), 'hidden.bs.select').subscribe(function (e) { return setTimeout(function () { return _this.hidden.emit(); }); });
    }
    Object.defineProperty(BootstrapSelectDirective.prototype, "ngModel", {
        set: function (values) {
            var _this = this;
            setTimeout(function () { return _this.selected = values; });
        },
        enumerable: true,
        configurable: true
    });
    BootstrapSelectDirective.prototype.ngOnInit = function () {
        var _this = this;
        $(this.el.nativeElement).selectpicker();
        if (this.requiredAttribute)
            $(this.el.nativeElement).selectpicker('setStyle', 'required', 'add');
        setTimeout(function () {
            _this.refresh();
            _this.doValidation();
        });
    };
    BootstrapSelectDirective.prototype.ngOnDestroy = function () {
        if (this.changedSubscription)
            this.changedSubscription.unsubscribe();
        if (this.shownSubscription)
            this.shownSubscription.unsubscribe();
        if (this.hiddenSubscription)
            this.hiddenSubscription.unsubscribe();
        $(this.el.nativeElement).selectpicker('destroy');
    };
    BootstrapSelectDirective.prototype.checkIsValuesChanged = function (newValue) {
        var _this = this;
        return !(newValue == this.oldValues ||
            (newValue instanceof Array && newValue.length === this.oldValues.length && newValue.every(function (v, i) { return v === _this.oldValues[i]; })));
    };
    BootstrapSelectDirective.prototype.doValidation = function () {
        if (this.requiredAttribute) {
            $(this.el.nativeElement).selectpicker('setStyle', !this.valid ? 'ng-valid' : 'ng-invalid', 'remove');
            $(this.el.nativeElement).selectpicker('setStyle', this.valid ? 'ng-valid' : 'ng-invalid', 'add');
        }
    };
    Object.defineProperty(BootstrapSelectDirective.prototype, "requiredAttribute", {
        get: function () {
            return this.required === "" || this.required == "true";
        },
        enumerable: true,
        configurable: true
    });
    BootstrapSelectDirective.prototype.refresh = function () {
        var _this = this;
        setTimeout(function () {
            $(_this.el.nativeElement).selectpicker('refresh');
        });
    };
    BootstrapSelectDirective.prototype.render = function () {
        var _this = this;
        setTimeout(function () {
            $(_this.el.nativeElement).selectpicker('render');
        });
    };
    Object.defineProperty(BootstrapSelectDirective.prototype, "valid", {
        get: function () {
            return this.requiredAttribute ? this.selected && this.selected.length > 0 : true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BootstrapSelectDirective.prototype, "selected", {
        get: function () {
            return $(this.el.nativeElement).selectpicker('val');
        },
        set: function (values) {
            if (!this.checkIsValuesChanged(values))
                return;
            this.oldValues = this.selected;
            $(this.el.nativeElement).selectpicker('val', values);
            this.doValidation();
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], BootstrapSelectDirective.prototype, "required", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], BootstrapSelectDirective.prototype, "ngModel", null);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], BootstrapSelectDirective.prototype, "ngModelChange", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], BootstrapSelectDirective.prototype, "shown", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], BootstrapSelectDirective.prototype, "hidden", void 0);
    BootstrapSelectDirective = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Directive"])({
            selector: '[bootstrapSelect]',
            exportAs: 'bootstrap-select'
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]])
    ], BootstrapSelectDirective);
    return BootstrapSelectDirective;
}());



/***/ }),

/***/ "./src/app/directives/bootstrap-tab.directive.ts":
/*!*******************************************************!*\
  !*** ./src/app/directives/bootstrap-tab.directive.ts ***!
  \*******************************************************/
/*! exports provided: BootstrapTabDirective */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BootstrapTabDirective", function() { return BootstrapTabDirective; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var BootstrapTabDirective = /** @class */ (function () {
    function BootstrapTabDirective(el, zone) {
        var _this = this;
        this.el = el;
        this.zone = zone;
        this.showBSTab = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.hideBSTab = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.tabShownSubscription = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["fromEvent"])($(this.el.nativeElement), 'show.bs.tab')
            .subscribe(function (e) {
            _this.runInZone(function () { return _this.showBSTab.emit({ type: e.type, target: e.target, relatedTarget: e.relatedTarget }); });
        });
        this.tabHiddenSubscription = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["fromEvent"])($(this.el.nativeElement), 'hidden.bs.tab')
            .subscribe(function (e) {
            _this.runInZone(function () { return _this.hideBSTab.emit({ type: e.type, target: e.target, relatedTarget: e.relatedTarget }); });
        });
    }
    BootstrapTabDirective.prototype.ngOnDestroy = function () {
        this.tabShownSubscription.unsubscribe();
        this.tabHiddenSubscription.unsubscribe();
    };
    BootstrapTabDirective.prototype.runInZone = function (delegate) {
        this.zone.run(function () {
            delegate();
        });
    };
    BootstrapTabDirective.prototype.show = function (selector) {
        $(selector).tab('show');
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], BootstrapTabDirective.prototype, "showBSTab", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], BootstrapTabDirective.prototype, "hideBSTab", void 0);
    BootstrapTabDirective = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Directive"])({
            selector: '[bootstrapTab]',
            exportAs: 'bootstrap-tab'
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]])
    ], BootstrapTabDirective);
    return BootstrapTabDirective;
}());



/***/ }),

/***/ "./src/app/directives/bootstrap-toggle.directive.ts":
/*!**********************************************************!*\
  !*** ./src/app/directives/bootstrap-toggle.directive.ts ***!
  \**********************************************************/
/*! exports provided: BootstrapToggleDirective */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BootstrapToggleDirective", function() { return BootstrapToggleDirective; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var BootstrapToggleDirective = /** @class */ (function () {
    function BootstrapToggleDirective(el) {
        var _this = this;
        this.el = el;
        this.ngModelChange = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.checkedSubscription = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["fromEvent"])($(this.el.nativeElement), 'change')
            .subscribe(function (e) { return _this.ngModelChange.emit(e.target.checked); });
    }
    Object.defineProperty(BootstrapToggleDirective.prototype, "ngModel", {
        set: function (value) {
            this.toggle(value);
        },
        enumerable: true,
        configurable: true
    });
    BootstrapToggleDirective.prototype.ngOnInit = function () {
        this.initialize();
    };
    BootstrapToggleDirective.prototype.ngOnDestroy = function () {
        this.destroy();
    };
    BootstrapToggleDirective.prototype.initialize = function (options) {
        $(this.el.nativeElement).bootstrapToggle(options);
    };
    BootstrapToggleDirective.prototype.destroy = function () {
        if (this.checkedSubscription)
            this.checkedSubscription.unsubscribe();
        $(this.el.nativeElement).bootstrapToggle('destroy');
    };
    BootstrapToggleDirective.prototype.toggleOn = function () {
        $(this.el.nativeElement).bootstrapToggle('on');
    };
    BootstrapToggleDirective.prototype.toggleOff = function () {
        $(this.el.nativeElement).bootstrapToggle('off');
    };
    BootstrapToggleDirective.prototype.toggle = function (value) {
        if (value == null)
            $(this.el.nativeElement).bootstrapToggle('toggle');
        else
            $(this.el.nativeElement).prop('checked', value).change();
    };
    BootstrapToggleDirective.prototype.enable = function () {
        $(this.el.nativeElement).bootstrapToggle('enable');
    };
    BootstrapToggleDirective.prototype.disable = function () {
        $(this.el.nativeElement).bootstrapToggle('disable');
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], BootstrapToggleDirective.prototype, "ngModel", null);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], BootstrapToggleDirective.prototype, "ngModelChange", void 0);
    BootstrapToggleDirective = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Directive"])({
            selector: '[bootstrapToggle]',
            exportAs: 'bootstrap-toggle'
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]])
    ], BootstrapToggleDirective);
    return BootstrapToggleDirective;
}());



/***/ }),

/***/ "./src/app/directives/equal-validator.directive.ts":
/*!*********************************************************!*\
  !*** ./src/app/directives/equal-validator.directive.ts ***!
  \*********************************************************/
/*! exports provided: EqualValidator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EqualValidator", function() { return EqualValidator; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};


var EqualValidator = /** @class */ (function () {
    function EqualValidator(validateEqual, reverse) {
        this.validateEqual = validateEqual;
        this.reverse = reverse;
    }
    EqualValidator_1 = EqualValidator;
    EqualValidator.prototype.validate = function (c) {
        var other = c.root.get(this.validateEqual);
        if (!other)
            return null;
        return this.reverse === 'true' ? this.validateReverse(c, other) : this.validateNoReverse(c, other);
    };
    EqualValidator.prototype.validateNoReverse = function (c, other) {
        return other.value === c.value ? null : { validateEqual: true };
    };
    EqualValidator.prototype.validateReverse = function (c, other) {
        if (c.value === other.value) {
            if (other.errors) {
                delete other.errors['validateEqual'];
                if (Object.keys(other.errors).length == 0) {
                    other.setErrors(null);
                }
                ;
            }
        }
        else {
            other.setErrors({ validateEqual: true });
        }
        return null;
    };
    EqualValidator = EqualValidator_1 = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Directive"])({
            selector: '[validateEqual][formControlName],[validateEqual][formControl],[validateEqual][ngModel]',
            providers: [
                { provide: _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NG_VALIDATORS"], useExisting: Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["forwardRef"])(function () { return EqualValidator_1; }), multi: true }
            ]
        }),
        __param(0, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Attribute"])('validateEqual')),
        __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Attribute"])('reverse')),
        __metadata("design:paramtypes", [String, String])
    ], EqualValidator);
    return EqualValidator;
    var EqualValidator_1;
}());



/***/ }),

/***/ "./src/app/directives/last-element.directive.ts":
/*!******************************************************!*\
  !*** ./src/app/directives/last-element.directive.ts ***!
  \******************************************************/
/*! exports provided: LastElementDirective */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LastElementDirective", function() { return LastElementDirective; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var LastElementDirective = /** @class */ (function () {
    function LastElementDirective() {
        this.lastFunction = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
    }
    Object.defineProperty(LastElementDirective.prototype, "lastElement", {
        set: function (isLastElement) {
            var _this = this;
            if (isLastElement) {
                setTimeout(function () {
                    _this.lastFunction.emit();
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], LastElementDirective.prototype, "lastElement", null);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], LastElementDirective.prototype, "lastFunction", void 0);
    LastElementDirective = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Directive"])({
            selector: '[lastElement]'
        })
    ], LastElementDirective);
    return LastElementDirective;
}());



/***/ }),

/***/ "./src/app/directives/modelstate.directive.ts":
/*!****************************************************!*\
  !*** ./src/app/directives/modelstate.directive.ts ***!
  \****************************************************/
/*! exports provided: ModelStateDirective */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ModelStateDirective", function() { return ModelStateDirective; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


//export const mserrorValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
//  const name = control.get('name');
//  const alterEgo = control.get('alterEgo');
//  return name && alterEgo && name.value === alterEgo.value ? { 'identityRevealed': true } : null;
//};
var ModelStateDirective = /** @class */ (function () {
    //constructor(@Attribute('includeModelState') public includeModelState: string) { }
    function ModelStateDirective() {
    }
    ModelStateDirective_1 = ModelStateDirective;
    ModelStateDirective.prototype.validate = function (control) {
        var ctp = null;
        return null;
        //var modelState = ctp.getErrors();
        //var id = control['id'] || control['name'];
        //var mine = modelState[id];
        //return mine.errors.map(x => x.errorMessage);
    };
    ModelStateDirective = ModelStateDirective_1 = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Directive"])({
            selector: '[includeModelState]',
            providers: [{
                    provide: _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NG_VALIDATORS"], useExisting: ModelStateDirective_1, multi: true
                }]
        }),
        __metadata("design:paramtypes", [])
    ], ModelStateDirective);
    return ModelStateDirective;
    var ModelStateDirective_1;
}());



/***/ }),

/***/ "./src/app/directives/notequal-validator.directive.ts":
/*!************************************************************!*\
  !*** ./src/app/directives/notequal-validator.directive.ts ***!
  \************************************************************/
/*! exports provided: NotEqualValidator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NotEqualValidator", function() { return NotEqualValidator; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};


var NotEqualValidator = /** @class */ (function () {
    function NotEqualValidator(validateNotEqual, reverse) {
        this.validateNotEqual = validateNotEqual;
        this.reverse = reverse;
    }
    NotEqualValidator_1 = NotEqualValidator;
    NotEqualValidator.prototype.validate = function (c) {
        var other = c.root.get(this.validateNotEqual);
        if (!other)
            return null;
        return this.reverse === 'true' ? this.validateReverse(c, other) : this.validateNoReverse(c, other);
    };
    NotEqualValidator.prototype.validateNoReverse = function (c, other) {
        return other.value !== c.value ? null : { validateNotEqual: true };
    };
    NotEqualValidator.prototype.validateReverse = function (c, other) {
        if (c.value !== other.value) {
            if (other.errors) {
                delete other.errors['validateNotEqual'];
                if (Object.keys(other.errors).length == 0) {
                    other.setErrors(null);
                }
                ;
            }
        }
        else {
            other.setErrors({ validateNotEqual: true });
        }
        return null;
    };
    NotEqualValidator = NotEqualValidator_1 = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Directive"])({
            selector: '[validateNotEqual][formControlName],[validateNotEqual][formControl],[validateNotEqual][ngModel]',
            providers: [
                { provide: _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NG_VALIDATORS"], useExisting: Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["forwardRef"])(function () { return NotEqualValidator_1; }), multi: true }
            ]
        }),
        __param(0, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Attribute"])('validateNotEqual')),
        __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Attribute"])('reverse')),
        __metadata("design:paramtypes", [String, String])
    ], NotEqualValidator);
    return NotEqualValidator;
    var NotEqualValidator_1;
}());



/***/ }),

/***/ "./src/app/models/account.model.ts":
/*!*****************************************!*\
  !*** ./src/app/models/account.model.ts ***!
  \*****************************************/
/*! exports provided: Account */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Account", function() { return Account; });
/* harmony import */ var _address_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./address.model */ "./src/app/models/address.model.ts");

var Account = /** @class */ (function () {
    function Account() {
        //displayName: string;
        //id: string;
        //rpDisplayName: string;
        this.address = new _address_model__WEBPACK_IMPORTED_MODULE_0__["Address"]();
    }
    return Account;
}());



/***/ }),

/***/ "./src/app/models/address.model.ts":
/*!*****************************************!*\
  !*** ./src/app/models/address.model.ts ***!
  \*****************************************/
/*! exports provided: Address */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Address", function() { return Address; });
var Address = /** @class */ (function () {
    function Address(line1, line2, line3, municipality, stateOrProvince, postalCode, country) {
        this.line1 = line1 || '';
        this.line2 = line2 || '';
        this.line3 = line3 || '';
        this.municipality = municipality || '';
        this.stateOrProvince = stateOrProvince || '';
        this.postalCode = postalCode || '';
        this.country = country || '';
    }
    return Address;
}());



/***/ }),

/***/ "./src/app/models/notification.model.ts":
/*!**********************************************!*\
  !*** ./src/app/models/notification.model.ts ***!
  \**********************************************/
/*! exports provided: Notification */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Notification", function() { return Notification; });
/* harmony import */ var _services_utilities__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/utilities */ "./src/app/services/utilities.ts");

var Notification = /** @class */ (function () {
    function Notification() {
    }
    Notification.Create = function (data) {
        var n = new Notification();
        Object.assign(n, data);
        if (n.date)
            n.date = _services_utilities__WEBPACK_IMPORTED_MODULE_0__["Utilities"].parseDate(n.date);
        return n;
    };
    return Notification;
}());



/***/ }),

/***/ "./src/app/models/payment-profile.model.ts":
/*!*************************************************!*\
  !*** ./src/app/models/payment-profile.model.ts ***!
  \*************************************************/
/*! exports provided: PaymentProfile */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PaymentProfile", function() { return PaymentProfile; });
/* harmony import */ var _address_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./address.model */ "./src/app/models/address.model.ts");

var PaymentProfile = /** @class */ (function () {
    function PaymentProfile(id, paymentType, paymentBillToName, name, address, cardCardType, cardNumber, cardExpirationMonth, cardExpirationYear, cardCCV, achAccountType, achAccountNumber, achRoutingNumber, currentAutoPayMethod, bank, currency) {
        this.id = id;
        this.paymentType = paymentType || '';
        this.paymentBillToName = paymentBillToName || '';
        this.bank = bank || '';
        this.currency = currency || '';
        this.name = name || '';
        this.address = address || new _address_model__WEBPACK_IMPORTED_MODULE_0__["Address"]();
        this.cardType = cardCardType || '';
        this.cardNumber = cardNumber || '';
        this.cardExpirationMonth = cardExpirationMonth || '';
        this.cardExpirationYear = cardExpirationYear || '';
        this.cardCCV = cardCCV || '';
        this.achAccountType = achAccountType || '';
        this.achAccountNumber = achAccountNumber || '';
        this.achRoutingNumber = achRoutingNumber || '';
        this.currentAutoPayMethod = currentAutoPayMethod || false;
        this.captcha = false;
    }
    return PaymentProfile;
}());



/***/ }),

/***/ "./src/app/models/permission.model.ts":
/*!********************************************!*\
  !*** ./src/app/models/permission.model.ts ***!
  \********************************************/
/*! exports provided: Permission */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Permission", function() { return Permission; });
var Permission = /** @class */ (function () {
    function Permission(name, value, groupName, description) {
        this.name = name;
        this.value = value;
        this.groupName = groupName;
        this.description = description;
    }
    Permission.viewUsersPermission = "users.view";
    Permission.manageUsersPermission = "users.manage";
    Permission.viewRolesPermission = "roles.view";
    Permission.manageRolesPermission = "roles.manage";
    Permission.assignRolesPermission = "roles.assign";
    return Permission;
}());



/***/ }),

/***/ "./src/app/models/register.model.ts":
/*!******************************************!*\
  !*** ./src/app/models/register.model.ts ***!
  \******************************************/
/*! exports provided: register */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "register", function() { return register; });
/* harmony import */ var _user_new_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./user-new.model */ "./src/app/models/user-new.model.ts");
/* harmony import */ var _account_model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./account.model */ "./src/app/models/account.model.ts");


var register = /** @class */ (function () {
    function register(user, account) {
        this.user = user || new _user_new_model__WEBPACK_IMPORTED_MODULE_0__["UserNew"]();
        this.account = account || new _account_model__WEBPACK_IMPORTED_MODULE_1__["Account"]();
    }
    return register;
}());



/***/ }),

/***/ "./src/app/models/role.model.ts":
/*!**************************************!*\
  !*** ./src/app/models/role.model.ts ***!
  \**************************************/
/*! exports provided: Role */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Role", function() { return Role; });
var Role = /** @class */ (function () {
    function Role(name, description, permissions) {
        this.name = name;
        this.description = description;
        this.permissions = permissions;
    }
    return Role;
}());



/***/ }),

/***/ "./src/app/models/user-edit.model.ts":
/*!*******************************************!*\
  !*** ./src/app/models/user-edit.model.ts ***!
  \*******************************************/
/*! exports provided: UserEdit */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserEdit", function() { return UserEdit; });
/* harmony import */ var _user_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./user.model */ "./src/app/models/user.model.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var UserEdit = /** @class */ (function (_super) {
    __extends(UserEdit, _super);
    function UserEdit(currentPassword, newPassword, confirmPassword) {
        var _this = _super.call(this) || this;
        _this.currentPassword = currentPassword;
        _this.newPassword = newPassword;
        _this.confirmPassword = confirmPassword;
        return _this;
    }
    return UserEdit;
}(_user_model__WEBPACK_IMPORTED_MODULE_0__["User"]));



/***/ }),

/***/ "./src/app/models/user-forgot-password.model.ts":
/*!******************************************************!*\
  !*** ./src/app/models/user-forgot-password.model.ts ***!
  \******************************************************/
/*! exports provided: UserForgotPassword */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserForgotPassword", function() { return UserForgotPassword; });
var UserForgotPassword = /** @class */ (function () {
    function UserForgotPassword() {
    }
    return UserForgotPassword;
}());



/***/ }),

/***/ "./src/app/models/user-forgot-username.model.ts":
/*!******************************************************!*\
  !*** ./src/app/models/user-forgot-username.model.ts ***!
  \******************************************************/
/*! exports provided: UserForgotUserName */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserForgotUserName", function() { return UserForgotUserName; });
var UserForgotUserName = /** @class */ (function () {
    function UserForgotUserName() {
    }
    return UserForgotUserName;
}());



/***/ }),

/***/ "./src/app/models/user-login.model.ts":
/*!********************************************!*\
  !*** ./src/app/models/user-login.model.ts ***!
  \********************************************/
/*! exports provided: UserLogin */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserLogin", function() { return UserLogin; });
var UserLogin = /** @class */ (function () {
    function UserLogin(userName, password, rememberMe) {
        this.userName = userName;
        this.password = password;
        this.rememberMe = rememberMe;
    }
    return UserLogin;
}());



/***/ }),

/***/ "./src/app/models/user-new.model.ts":
/*!******************************************!*\
  !*** ./src/app/models/user-new.model.ts ***!
  \******************************************/
/*! exports provided: UserNew */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserNew", function() { return UserNew; });
/* harmony import */ var _user_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./user.model */ "./src/app/models/user.model.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var UserNew = /** @class */ (function (_super) {
    __extends(UserNew, _super);
    function UserNew(newPassword, confirmPassword) {
        var _this = _super.call(this) || this;
        _this.newPassword = newPassword || '';
        _this.confirmPassword = confirmPassword || '';
        return _this;
    }
    return UserNew;
}(_user_model__WEBPACK_IMPORTED_MODULE_0__["User"]));



/***/ }),

/***/ "./src/app/models/user.model.ts":
/*!**************************************!*\
  !*** ./src/app/models/user.model.ts ***!
  \**************************************/
/*! exports provided: User */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "User", function() { return User; });
var User = /** @class */ (function () {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    function User(id, userName, firstName, lastName, email, phoneNumber, roles, termsAccepted, question01, answer01, question02, answer02) {
        this.id = '';
        this.userName = '';
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.phoneNumber = '';
        this.accountNumber = '';
        this.question01 = 0;
        this.answer01 = '';
        this.question02 = 0;
        this.answer02 = '';
        this.id = id;
        this.userName = userName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.roles = roles;
        this.termsAccepted = termsAccepted;
        this.question01 = question01;
        this.answer01 = answer01;
        this.question02 = question02;
        this.answer02 = answer02;
    }
    Object.defineProperty(User.prototype, "friendlyName", {
        get: function () {
            var name = this.lastName || this.userName;
            return name;
        },
        enumerable: true,
        configurable: true
    });
    return User;
}());



/***/ }),

/***/ "./src/app/pipes/group-by.pipe.ts":
/*!****************************************!*\
  !*** ./src/app/pipes/group-by.pipe.ts ***!
  \****************************************/
/*! exports provided: GroupByPipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GroupByPipe", function() { return GroupByPipe; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var GroupByPipe = /** @class */ (function () {
    function GroupByPipe() {
    }
    GroupByPipe.prototype.transform = function (value, field) {
        if (!value)
            return value;
        var groupedObj = value.reduce(function (prev, cur) {
            if (!prev[cur[field]]) {
                prev[cur[field]] = [cur];
            }
            else {
                prev[cur[field]].push(cur);
            }
            return prev;
        }, {});
        return Object.keys(groupedObj).map(function (key) { return ({ key: key, value: groupedObj[key] }); });
    };
    GroupByPipe = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Pipe"])({ name: 'groupBy' })
    ], GroupByPipe);
    return GroupByPipe;
}());



/***/ }),

/***/ "./src/app/services/account-endpoint.service.ts":
/*!******************************************************!*\
  !*** ./src/app/services/account-endpoint.service.ts ***!
  \******************************************************/
/*! exports provided: AccountEndpoint */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AccountEndpoint", function() { return AccountEndpoint; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _endpoint_factory_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./endpoint-factory.service */ "./src/app/services/endpoint-factory.service.ts");
/* harmony import */ var _configuration_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./configuration.service */ "./src/app/services/configuration.service.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var AccountEndpoint = /** @class */ (function (_super) {
    __extends(AccountEndpoint, _super);
    function AccountEndpoint(http, configurations, injector) {
        var _this = _super.call(this, http, configurations, injector) || this;
        _this._userAccountLookupUrl = "/api/customer/getuseraccount";
        _this._questionsUrl = "/api/account/questions";
        _this._registerUrl = "/api/account/register";
        _this._forgotUserNameUrl = "/api/account/forgot/username";
        _this._forgotPasswordUrl = "/api/account/forgot/password";
        _this._updatePasswordUrl = "/api/account/reset/updatepassword";
        _this._resetPasswordUrl = "/api/account/reset/password";
        _this._usersUrl = "/api/account/users";
        _this._userByUserNameUrl = "/api/account/users/username";
        _this._unblockUserUrl = "/api/account/users/unblock";
        _this._rolesUrl = "/api/account/roles";
        _this._roleByRoleNameUrl = "/api/account/roles/name";
        _this._permissionsUrl = "/api/account/permissions";
        _this._currentUserUrl = "/api/account/users/me";
        _this._currentUserPreferencesUrl = "/api/account/users/me/preferences";
        return _this;
    }
    Object.defineProperty(AccountEndpoint.prototype, "accountLookupUrl", {
        get: function () { return this.configurations.baseUrl + this._userAccountLookupUrl; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccountEndpoint.prototype, "questionsUrl", {
        get: function () { return this.configurations.baseUrl + this._questionsUrl; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccountEndpoint.prototype, "registerUrl", {
        get: function () { return this.configurations.baseUrl + this._registerUrl; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccountEndpoint.prototype, "forgotUserNameUrl", {
        get: function () { return this.configurations.baseUrl + this._forgotUserNameUrl; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccountEndpoint.prototype, "forgotPasswordUrl", {
        get: function () { return this.configurations.baseUrl + this._forgotPasswordUrl; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccountEndpoint.prototype, "updatePasswordUrl", {
        get: function () { return this.configurations.baseUrl + this._updatePasswordUrl; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccountEndpoint.prototype, "resetPasswordUrl", {
        get: function () { return this.configurations.baseUrl + this._resetPasswordUrl; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccountEndpoint.prototype, "usersUrl", {
        get: function () { return this.configurations.baseUrl + this._usersUrl; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccountEndpoint.prototype, "userByUserNameUrl", {
        get: function () { return this.configurations.baseUrl + this._userByUserNameUrl; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccountEndpoint.prototype, "unblockUserUrl", {
        get: function () { return this.configurations.baseUrl + this._unblockUserUrl; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccountEndpoint.prototype, "rolesUrl", {
        get: function () { return this.configurations.baseUrl + this._rolesUrl; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccountEndpoint.prototype, "roleByRoleNameUrl", {
        get: function () { return this.configurations.baseUrl + this._roleByRoleNameUrl; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccountEndpoint.prototype, "permissionsUrl", {
        get: function () { return this.configurations.baseUrl + this._permissionsUrl; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccountEndpoint.prototype, "currentUserUrl", {
        get: function () { return this.configurations.baseUrl + this._currentUserUrl; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccountEndpoint.prototype, "currentUserPreferencesUrl", {
        get: function () { return this.configurations.baseUrl + this._currentUserPreferencesUrl; },
        enumerable: true,
        configurable: true
    });
    AccountEndpoint.prototype.getAccount = function () {
        var _this = this;
        return this.http
            .post(this.accountLookupUrl, null, this.getRequestHeaders())
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    AccountEndpoint.prototype.getRegisterConfirmEndpoint = function (userId, code) {
        var _this = this;
        var endpointUrl = this.registerUrl + "/confirm";
        var parms = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpParams"]()
            .append("userId", userId)
            .append("code", code);
        return this.http
            .post(endpointUrl, parms, this.getRequestHeadersText())
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    AccountEndpoint.prototype.getUpdatePasswordEndPoint = function (username, currentPassword, password) {
        var _this = this;
        var parms = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpParams"]()
            .append("username", username)
            .append("currentPassword", currentPassword)
            .append("password", password);
        return this.http
            .post(this.updatePasswordUrl, parms, this.getRequestHeadersText())
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    AccountEndpoint.prototype.getForgotPasswordConfirmEndPoint = function (code, userName, password) {
        var _this = this;
        var parms = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpParams"]()
            .append("code", code)
            .append("username", userName)
            .append("password", password);
        return this.http
            .post(this.resetPasswordUrl, parms, this.getRequestHeadersText())
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    AccountEndpoint.prototype.getRegisterEndpoint = function (data) {
        var _this = this;
        return this.http
            .post(this.registerUrl, data, this.getRequestHeaders())
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    AccountEndpoint.prototype.getForgotPasswordEndpoint = function (username) {
        var _this = this;
        return this.http
            .post(this.forgotPasswordUrl, JSON.stringify(username), this.getRequestHeaders())
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    AccountEndpoint.prototype.getForgotUserNameEndpoint = function (data) {
        var _this = this;
        return this.http
            .post(this.forgotUserNameUrl, data, this.getRequestHeaders())
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    AccountEndpoint.prototype.getQuestionsEndpoint = function (language) {
        var _this = this;
        var endPointUrl = this.questionsUrl + "/" + language;
        return this.http
            .get(endPointUrl, this.getRequestHeaders())
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    AccountEndpoint.prototype.getUserEndpoint = function (userId) {
        var _this = this;
        var endpointUrl = userId ? this.usersUrl + "/" + userId : this.currentUserUrl;
        return this.http
            .get(endpointUrl, this.getRequestHeaders())
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    AccountEndpoint.prototype.getUserByUserNameEndpoint = function (userName) {
        var _this = this;
        var endpointUrl = this.userByUserNameUrl + "/" + userName;
        return this.http
            .get(endpointUrl, this.getRequestHeaders())
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    AccountEndpoint.prototype.getUsersEndpoint = function (page, pageSize) {
        var _this = this;
        var endpointUrl = page && pageSize ? this.usersUrl + "/" + page + "/" + pageSize : this.usersUrl;
        return this.http
            .get(endpointUrl, this.getRequestHeaders())
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    AccountEndpoint.prototype.getNewUserEndpoint = function (userObject) {
        var _this = this;
        return this.http
            .post(this.usersUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    AccountEndpoint.prototype.getUpdateUserEndpoint = function (userObject, userId) {
        var _this = this;
        var endpointUrl = userId ? this.usersUrl + "/" + userId : this.currentUserUrl;
        return this.http
            .put(endpointUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    AccountEndpoint.prototype.getUserPreferencesEndpoint = function () {
        var _this = this;
        return this.http
            .get(this.currentUserPreferencesUrl, this.getRequestHeaders())
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    AccountEndpoint.prototype.getUpdateUserPreferencesEndpoint = function (configuration) {
        var _this = this;
        return this.http
            .put(this.currentUserPreferencesUrl, JSON.stringify(configuration), this.getRequestHeaders())
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    AccountEndpoint.prototype.getUnblockUserEndpoint = function (userId) {
        var _this = this;
        var endpointUrl = this.unblockUserUrl + "/" + userId;
        return this.http
            .put(endpointUrl, null, this.getRequestHeaders())
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    AccountEndpoint.prototype.getDeleteUserEndpoint = function (userId) {
        var _this = this;
        var endpointUrl = this.usersUrl + "/" + userId;
        return this.http
            .delete(endpointUrl, this.getRequestHeaders())
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    AccountEndpoint.prototype.getRoleEndpoint = function (roleId) {
        var _this = this;
        var endpointUrl = this.rolesUrl + "/" + roleId;
        return this.http
            .get(endpointUrl, this.getRequestHeaders())
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    AccountEndpoint.prototype.getRoleByRoleNameEndpoint = function (roleName) {
        var _this = this;
        var endpointUrl = this.roleByRoleNameUrl + "/" + roleName;
        return this.http
            .get(endpointUrl, this.getRequestHeaders())
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    AccountEndpoint.prototype.getRolesEndpoint = function (page, pageSize) {
        var _this = this;
        var endpointUrl = page && pageSize ? this.rolesUrl + "/" + page + "/" + pageSize : this.rolesUrl;
        return this.http
            .get(endpointUrl, this.getRequestHeaders())
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    AccountEndpoint.prototype.getNewRoleEndpoint = function (roleObject) {
        var _this = this;
        return this.http
            .post(this.rolesUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    AccountEndpoint.prototype.getUpdateRoleEndpoint = function (roleObject, roleId) {
        var _this = this;
        var endpointUrl = this.rolesUrl + "/" + roleId;
        return this.http
            .put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    AccountEndpoint.prototype.getDeleteRoleEndpoint = function (roleId) {
        var _this = this;
        var endpointUrl = this.rolesUrl + "/" + roleId;
        return this.http
            .delete(endpointUrl, this.getRequestHeaders())
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    AccountEndpoint.prototype.getPermissionsEndpoint = function () {
        var _this = this;
        return this.http
            .get(this.permissionsUrl, this.getRequestHeaders())
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    AccountEndpoint = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"], _configuration_service__WEBPACK_IMPORTED_MODULE_4__["ConfigurationService"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injector"]])
    ], AccountEndpoint);
    return AccountEndpoint;
}(_endpoint_factory_service__WEBPACK_IMPORTED_MODULE_3__["EndpointFactory"]));



/***/ }),

/***/ "./src/app/services/account.service.ts":
/*!*********************************************!*\
  !*** ./src/app/services/account.service.ts ***!
  \*********************************************/
/*! exports provided: AccountService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AccountService", function() { return AccountService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _account_endpoint_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./account-endpoint.service */ "./src/app/services/account-endpoint.service.ts");
/* harmony import */ var _auth_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./auth.service */ "./src/app/services/auth.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var AccountService = /** @class */ (function () {
    function AccountService(router, http, authService, accountEndpoint) {
        this.router = router;
        this.http = http;
        this.authService = authService;
        this.accountEndpoint = accountEndpoint;
        this._rolesChanged = new rxjs__WEBPACK_IMPORTED_MODULE_3__["Subject"]();
    }
    AccountService_1 = AccountService;
    AccountService.prototype.register = function (request) {
        var _this = this;
        return this
            .accountEndpoint
            .getRegisterEndpoint(request)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (response) { return _this.processRegisterResponse(response); }));
    };
    AccountService.prototype.processRegisterResponse = function (response) {
        var account = response.account;
        if (account == null) {
            throw new Error('Account was empty');
        }
        return response;
    };
    AccountService.prototype.forgotUserName = function (data) {
        return this.accountEndpoint.getForgotUserNameEndpoint(data);
    };
    AccountService.prototype.forgotPassword = function (username) {
        return this.accountEndpoint.getForgotPasswordEndpoint(username);
    };
    AccountService.prototype.confirmEmail = function (userId, code) {
        return this.accountEndpoint.getRegisterConfirmEndpoint(userId, code);
    };
    AccountService.prototype.confirmForgotPassword = function (code, userName, password) {
        return this.accountEndpoint.getForgotPasswordConfirmEndPoint(code, userName, password);
    };
    AccountService.prototype.confirmUpdatePassword = function (userName, currentPassword, password) {
        return this.accountEndpoint.getUpdatePasswordEndPoint(userName, currentPassword, password);
    };
    AccountService.prototype.getQuestions = function (language) {
        return this.accountEndpoint.getQuestionsEndpoint(language);
    };
    AccountService.prototype.getUser = function (userId) {
        return this.accountEndpoint.getUserEndpoint(userId);
    };
    AccountService.prototype.getAccount = function () {
        return this.accountEndpoint.getAccount();
    };
    AccountService.prototype.getUserAndRoles = function (userId) {
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["forkJoin"])(this.accountEndpoint.getUserEndpoint(userId), this.accountEndpoint.getRolesEndpoint());
    };
    AccountService.prototype.getUsers = function (page, pageSize) {
        return this.accountEndpoint.getUsersEndpoint(page, pageSize);
    };
    AccountService.prototype.getUsersAndRoles = function (page, pageSize) {
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["forkJoin"])(this.accountEndpoint.getUsersEndpoint(page, pageSize), this.accountEndpoint.getRolesEndpoint());
    };
    AccountService.prototype.updateUser = function (user, isSelf) {
        var _this = this;
        if (isSelf)
            return this.accountEndpoint.getUpdateUserEndpoint(user);
        if (user.id) {
            //return this.accountEndpoint.getUpdateUserEndpoint<User>(user, user.id);
            return this.accountEndpoint.getUpdateUserEndpoint(user);
        }
        else {
            alert("here1");
            return this.accountEndpoint.getUserByUserNameEndpoint(user.userName).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["mergeMap"])(function (foundUser) {
                user.id = foundUser.id;
                return _this.accountEndpoint.getUpdateUserEndpoint(user, user.id);
            }));
        }
    };
    AccountService.prototype.newUser = function (user) {
        return this.accountEndpoint.getNewUserEndpoint(user);
    };
    AccountService.prototype.getUserPreferences = function () {
        return this.accountEndpoint.getUserPreferencesEndpoint();
    };
    AccountService.prototype.updateUserPreferences = function (configuration) {
        return this.accountEndpoint.getUpdateUserPreferencesEndpoint(configuration);
    };
    AccountService.prototype.deleteUser = function (userOrUserId) {
        var _this = this;
        if (typeof userOrUserId === 'string' || userOrUserId instanceof String) {
            return this.accountEndpoint.getDeleteUserEndpoint(userOrUserId).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["tap"])(function (data) { return _this.onRolesUserCountChanged(data.roles); }));
        }
        else {
            if (userOrUserId.id) {
                return this.deleteUser(userOrUserId.id);
            }
            else {
                return this.accountEndpoint.getUserByUserNameEndpoint(userOrUserId.userName).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["mergeMap"])(function (user) { return _this.deleteUser(user.id); }));
            }
        }
    };
    AccountService.prototype.unblockUser = function (userId) {
        return this.accountEndpoint.getUnblockUserEndpoint(userId);
    };
    AccountService.prototype.userHasPermission = function (permissionValue) {
        return this.permissions.some(function (p) { return p == permissionValue; });
    };
    AccountService.prototype.refreshLoggedInUser = function () {
        return this.authService.refreshLogin();
    };
    AccountService.prototype.getRoles = function (page, pageSize) {
        return this.accountEndpoint.getRolesEndpoint(page, pageSize);
    };
    AccountService.prototype.getRolesAndPermissions = function (page, pageSize) {
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["forkJoin"])(this.accountEndpoint.getRolesEndpoint(page, pageSize), this.accountEndpoint.getPermissionsEndpoint());
    };
    AccountService.prototype.updateRole = function (role) {
        var _this = this;
        if (role.id) {
            return this.accountEndpoint.getUpdateRoleEndpoint(role, role.id).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["tap"])(function (data) { return _this.onRolesChanged([role], AccountService_1.roleModifiedOperation); }));
        }
        else {
            return this.accountEndpoint.getRoleByRoleNameEndpoint(role.name).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["mergeMap"])(function (foundRole, i) {
                role.id = foundRole.id;
                return _this.accountEndpoint.getUpdateRoleEndpoint(role, role.id);
            }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["tap"])(function (data) { return _this.onRolesChanged([role], AccountService_1.roleModifiedOperation); }));
        }
    };
    AccountService.prototype.newRole = function (role) {
        var _this = this;
        return this.accountEndpoint.getNewRoleEndpoint(role).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["tap"])(function (data) { return _this.onRolesChanged([role], AccountService_1.roleAddedOperation); }));
    };
    AccountService.prototype.deleteRole = function (roleOrRoleId) {
        var _this = this;
        if (typeof roleOrRoleId === 'string' || roleOrRoleId instanceof String) {
            return this.accountEndpoint.getDeleteRoleEndpoint(roleOrRoleId).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["tap"])(function (data) { return _this.onRolesChanged([data], AccountService_1.roleDeletedOperation); }));
        }
        else {
            if (roleOrRoleId.id) {
                return this.deleteRole(roleOrRoleId.id);
            }
            else {
                return this.accountEndpoint.getRoleByRoleNameEndpoint(roleOrRoleId.name).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["mergeMap"])(function (role) { return _this.deleteRole(role.id); }));
            }
        }
    };
    AccountService.prototype.getPermissions = function () {
        return this.accountEndpoint.getPermissionsEndpoint();
    };
    AccountService.prototype.onRolesChanged = function (roles, op) {
        this._rolesChanged.next({ roles: roles, operation: op });
    };
    AccountService.prototype.onRolesUserCountChanged = function (roles) {
        return this.onRolesChanged(roles, AccountService_1.roleModifiedOperation);
    };
    AccountService.prototype.getRolesChangedEvent = function () {
        return this._rolesChanged.asObservable();
    };
    Object.defineProperty(AccountService.prototype, "permissions", {
        get: function () {
            return this.authService.userPermissions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccountService.prototype, "currentUser", {
        get: function () {
            return this.authService.currentUser;
        },
        enumerable: true,
        configurable: true
    });
    AccountService.roleAddedOperation = 'add';
    AccountService.roleDeletedOperation = 'delete';
    AccountService.roleModifiedOperation = 'modify';
    AccountService = AccountService_1 = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"], _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"], _auth_service__WEBPACK_IMPORTED_MODULE_6__["AuthService"],
            _account_endpoint_service__WEBPACK_IMPORTED_MODULE_5__["AccountEndpoint"]])
    ], AccountService);
    return AccountService;
    var AccountService_1;
}());



/***/ }),

/***/ "./src/app/services/alert.service.ts":
/*!*******************************************!*\
  !*** ./src/app/services/alert.service.ts ***!
  \*******************************************/
/*! exports provided: AlertService, AlertDialog, DialogType, AlertMessage, MessageSeverity */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AlertService", function() { return AlertService; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AlertDialog", function() { return AlertDialog; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DialogType", function() { return DialogType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AlertMessage", function() { return AlertMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MessageSeverity", function() { return MessageSeverity; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _services_utilities__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/utilities */ "./src/app/services/utilities.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




var AlertService = /** @class */ (function () {
    function AlertService() {
        this.messages = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.stickyMessages = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.dialogs = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this._isLoading = false;
    }
    AlertService.prototype.showDialog = function (message, type, okCallback, cancelCallback, okLabel, cancelLabel, defaultValue) {
        if (!type)
            type = DialogType.alert;
        this.dialogs.next({ message: message, type: type, okCallback: okCallback, cancelCallback: cancelCallback, okLabel: okLabel, cancelLabel: cancelLabel, defaultValue: defaultValue });
    };
    AlertService.prototype.showMessage = function (data, separatorOrDetail, severity) {
        if (!severity)
            severity = MessageSeverity.default;
        if (data instanceof _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpResponseBase"]) {
            data = _services_utilities__WEBPACK_IMPORTED_MODULE_3__["Utilities"].getHttpResponseMessage(data);
            separatorOrDetail = _services_utilities__WEBPACK_IMPORTED_MODULE_3__["Utilities"].captionAndMessageSeparator;
        }
        if (data instanceof Array) {
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var message = data_1[_i];
                var msgObject = _services_utilities__WEBPACK_IMPORTED_MODULE_3__["Utilities"].splitInTwo(message, separatorOrDetail);
                this.showMessageHelper(msgObject.firstPart, msgObject.secondPart, severity, false);
            }
        }
        else {
            this.showMessageHelper(data, separatorOrDetail, severity, false);
        }
    };
    AlertService.prototype.showStickyMessage = function (data, separatorOrDetail, severity, error) {
        if (!severity)
            severity = MessageSeverity.default;
        if (data instanceof _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpResponseBase"]) {
            data = _services_utilities__WEBPACK_IMPORTED_MODULE_3__["Utilities"].getHttpResponseMessage(data);
            separatorOrDetail = _services_utilities__WEBPACK_IMPORTED_MODULE_3__["Utilities"].captionAndMessageSeparator;
        }
        if (data instanceof Array) {
            for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
                var message = data_2[_i];
                var msgObject = _services_utilities__WEBPACK_IMPORTED_MODULE_3__["Utilities"].splitInTwo(message, separatorOrDetail);
                this.showMessageHelper(msgObject.firstPart, msgObject.secondPart, severity, true);
            }
        }
        else {
            if (error) {
                var msg = "Severity: \"" + MessageSeverity[severity] + "\", Summary: \"" + data + "\", Detail: \"" + separatorOrDetail + "\", Error: \"" + _services_utilities__WEBPACK_IMPORTED_MODULE_3__["Utilities"].safeStringify(error) + "\"";
                switch (severity) {
                    case MessageSeverity.default:
                        this.logInfo(msg);
                        break;
                    case MessageSeverity.info:
                        this.logInfo(msg);
                        break;
                    case MessageSeverity.success:
                        this.logMessage(msg);
                        break;
                    case MessageSeverity.error:
                        this.logError(msg);
                        break;
                    case MessageSeverity.warn:
                        this.logWarning(msg);
                        break;
                    case MessageSeverity.wait:
                        this.logTrace(msg);
                        break;
                }
            }
            this.showMessageHelper(data, separatorOrDetail, severity, true);
        }
    };
    AlertService.prototype.showMessageHelper = function (summary, detail, severity, isSticky) {
        if (isSticky)
            this.stickyMessages.next({ severity: severity, summary: summary, detail: detail });
        else
            this.messages.next({ severity: severity, summary: summary, detail: detail });
    };
    AlertService.prototype.startLoadingMessage = function (message, caption) {
        var _this = this;
        if (message === void 0) { message = "Loading..."; }
        if (caption === void 0) { caption = ""; }
        this._isLoading = true;
        clearTimeout(this.loadingMessageId);
        this.loadingMessageId = setTimeout(function () {
            _this.showStickyMessage(caption, message, MessageSeverity.wait);
        }, 1000);
    };
    AlertService.prototype.stopLoadingMessage = function () {
        this._isLoading = false;
        clearTimeout(this.loadingMessageId);
        this.resetStickyMessage();
    };
    AlertService.prototype.logDebug = function (msg) {
        console.debug(msg);
    };
    AlertService.prototype.logError = function (msg) {
        console.error(msg);
    };
    AlertService.prototype.logInfo = function (msg) {
        console.info(msg);
    };
    AlertService.prototype.logMessage = function (msg) {
        console.log(msg);
    };
    AlertService.prototype.logTrace = function (msg) {
        console.trace(msg);
    };
    AlertService.prototype.logWarning = function (msg) {
        console.warn(msg);
    };
    AlertService.prototype.resetStickyMessage = function () {
        this.stickyMessages.next();
    };
    AlertService.prototype.getDialogEvent = function () {
        return this.dialogs.asObservable();
    };
    AlertService.prototype.getMessageEvent = function () {
        return this.messages.asObservable();
    };
    AlertService.prototype.getStickyMessageEvent = function () {
        return this.stickyMessages.asObservable();
    };
    Object.defineProperty(AlertService.prototype, "isLoadingInProgress", {
        get: function () {
            return this._isLoading;
        },
        enumerable: true,
        configurable: true
    });
    AlertService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])()
    ], AlertService);
    return AlertService;
}());

//******************** Dialog ********************//
var AlertDialog = /** @class */ (function () {
    function AlertDialog(message, type, okCallback, cancelCallback, defaultValue, okLabel, cancelLabel) {
        this.message = message;
        this.type = type;
        this.okCallback = okCallback;
        this.cancelCallback = cancelCallback;
        this.defaultValue = defaultValue;
        this.okLabel = okLabel;
        this.cancelLabel = cancelLabel;
    }
    return AlertDialog;
}());

var DialogType;
(function (DialogType) {
    DialogType[DialogType["alert"] = 0] = "alert";
    DialogType[DialogType["confirm"] = 1] = "confirm";
    DialogType[DialogType["prompt"] = 2] = "prompt";
})(DialogType || (DialogType = {}));
//******************** End ********************//
//******************** Growls ********************//
var AlertMessage = /** @class */ (function () {
    function AlertMessage(severity, summary, detail) {
        this.severity = severity;
        this.summary = summary;
        this.detail = detail;
    }
    return AlertMessage;
}());

var MessageSeverity;
(function (MessageSeverity) {
    MessageSeverity[MessageSeverity["default"] = 0] = "default";
    MessageSeverity[MessageSeverity["info"] = 1] = "info";
    MessageSeverity[MessageSeverity["success"] = 2] = "success";
    MessageSeverity[MessageSeverity["error"] = 3] = "error";
    MessageSeverity[MessageSeverity["warn"] = 4] = "warn";
    MessageSeverity[MessageSeverity["wait"] = 5] = "wait";
})(MessageSeverity || (MessageSeverity = {}));
//******************** End ********************//


/***/ }),

/***/ "./src/app/services/animations.ts":
/*!****************************************!*\
  !*** ./src/app/services/animations.ts ***!
  \****************************************/
/*! exports provided: fadeInOut, flyInOut */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fadeInOut", function() { return fadeInOut; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "flyInOut", function() { return flyInOut; });
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/animations */ "./node_modules/@angular/animations/fesm5/animations.js");

var fadeInOut = Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["trigger"])('fadeInOut', [
    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["transition"])(':enter', [Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["style"])({ opacity: 0 }), Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["animate"])('0.4s ease-in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["style"])({ opacity: 1 }))]),
    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["transition"])(':leave', [Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["animate"])('0.4s 10ms ease-out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["style"])({ opacity: 0 }))])
]);
function flyInOut(duration) {
    if (duration === void 0) { duration = 0.2; }
    return Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["trigger"])('flyInOut', [
        Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["state"])('in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["style"])({ opacity: 1, transform: 'translateX(0)' })),
        Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["transition"])('void => *', [Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["style"])({ opacity: 0, transform: 'translateX(-100%)' }), Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["animate"])(duration + "s ease-in")]),
        Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["transition"])('* => void', [Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["animate"])(duration + "s 10ms ease-out", Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["style"])({ opacity: 0, transform: 'translateX(100%)' }))])
    ]);
}


/***/ }),

/***/ "./src/app/services/app-title.service.ts":
/*!***********************************************!*\
  !*** ./src/app/services/app-title.service.ts ***!
  \***********************************************/
/*! exports provided: AppTitleService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppTitleService", function() { return AppTitleService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utilities */ "./src/app/services/utilities.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var AppTitleService = /** @class */ (function () {
    function AppTitleService(titleService, router) {
        var _this = this;
        this.titleService = titleService;
        this.router = router;
        this.sub = this.router.events.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["filter"])(function (event) { return event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_1__["NavigationEnd"]; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (_) { return _this.router.routerState.root; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (route) {
            while (route.firstChild)
                route = route.firstChild;
            return route;
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["flatMap"])(function (route) { return route.data; }))
            .subscribe(function (data) {
            var title = data['title'];
            if (title) {
                var fragment = _this.router.url.split('#')[1];
                if (fragment)
                    title += " | " + _utilities__WEBPACK_IMPORTED_MODULE_4__["Utilities"].toTitleCase(fragment);
            }
            if (title && _this.appName)
                title += ' - ' + _this.appName;
            else if (_this.appName)
                title = _this.appName;
            if (title)
                _this.titleService.setTitle(title);
        });
    }
    AppTitleService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["Title"], _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]])
    ], AppTitleService);
    return AppTitleService;
}());



/***/ }),

/***/ "./src/app/services/app-translation.service.ts":
/*!*****************************************************!*\
  !*** ./src/app/services/app-translation.service.ts ***!
  \*****************************************************/
/*! exports provided: AppTranslationService, TranslateLanguageLoader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppTranslationService", function() { return AppTranslationService; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TranslateLanguageLoader", function() { return TranslateLanguageLoader; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/fesm5/ngx-translate-core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AppTranslationService = /** @class */ (function () {
    function AppTranslationService(translate) {
        this.translate = translate;
        this.defaultLanguage = 'en';
        this.onLanguageChanged = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.languageChanged$ = this.onLanguageChanged.asObservable();
        this.setDefaultLanguage(this.defaultLanguage);
    }
    AppTranslationService.prototype.addLanguages = function (lang) {
        this.translate.addLangs(lang);
    };
    AppTranslationService.prototype.setDefaultLanguage = function (lang) {
        this.translate.setDefaultLang(lang);
    };
    AppTranslationService.prototype.getDefaultLanguage = function () {
        return this.translate.defaultLang;
    };
    AppTranslationService.prototype.getBrowserLanguage = function () {
        return this.translate.getBrowserLang();
    };
    AppTranslationService.prototype.useBrowserLanguage = function () {
        var browserLang = this.getBrowserLanguage();
        if (browserLang.match(/en|fr|de|ar|ko|pt|sp|es|zh/)) {
            this.changeLanguage(browserLang);
            return browserLang;
        }
    };
    AppTranslationService.prototype.changeLanguage = function (language) {
        var _this = this;
        if (language === void 0) { language = 'en'; }
        if (!language) {
            language = this.translate.defaultLang;
        }
        if (language != this.translate.currentLang) {
            setTimeout(function () {
                _this.translate.use(language);
                _this.onLanguageChanged.next(language);
            });
        }
        return language;
    };
    AppTranslationService.prototype.getTranslation = function (key, interpolateParams) {
        return this.translate.instant(key, interpolateParams);
    };
    AppTranslationService.prototype.getTranslationAsync = function (key, interpolateParams) {
        return this.translate.get(key, interpolateParams);
    };
    AppTranslationService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_ngx_translate_core__WEBPACK_IMPORTED_MODULE_1__["TranslateService"]])
    ], AppTranslationService);
    return AppTranslationService;
}());

var TranslateLanguageLoader = /** @class */ (function () {
    function TranslateLanguageLoader() {
    }
    TranslateLanguageLoader.prototype.getTranslation = function (lang) {
        //Note Dynamic require(variable) will not work. Require is always at compile time
        switch (lang) {
            case 'en':
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(__webpack_require__(/*! ../assets/locale/en.json */ "./src/app/assets/locale/en.json"));
            case 'fr':
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(__webpack_require__(/*! ../assets/locale/fr.json */ "./src/app/assets/locale/fr.json"));
            case 'es':
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(__webpack_require__(/*! ../assets/locale/sp.json */ "./src/app/assets/locale/sp.json"));
            case 'sp':
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(__webpack_require__(/*! ../assets/locale/sp.json */ "./src/app/assets/locale/sp.json"));
            case 'de':
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(__webpack_require__(/*! ../assets/locale/de.json */ "./src/app/assets/locale/de.json"));
            case 'pt':
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(__webpack_require__(/*! ../assets/locale/pt.json */ "./src/app/assets/locale/pt.json"));
            case 'ar':
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(__webpack_require__(/*! ../assets/locale/ar.json */ "./src/app/assets/locale/ar.json"));
            case 'ko':
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(__webpack_require__(/*! ../assets/locale/ko.json */ "./src/app/assets/locale/ko.json"));
            case 'zh':
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(__webpack_require__(/*! ../assets/locale/zh.json */ "./src/app/assets/locale/zh.json"));
            default:
        }
    };
    return TranslateLanguageLoader;
}());



/***/ }),

/***/ "./src/app/services/auth-guard.service.ts":
/*!************************************************!*\
  !*** ./src/app/services/auth-guard.service.ts ***!
  \************************************************/
/*! exports provided: AuthGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthGuard", function() { return AuthGuard; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./auth.service */ "./src/app/services/auth.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AuthGuard = /** @class */ (function () {
    function AuthGuard(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    AuthGuard.prototype.canActivate = function (route, state) {
        var url = state.url;
        return this.checkLogin(url);
    };
    AuthGuard.prototype.canActivateChild = function (route, state) {
        return this.canActivate(route, state);
    };
    AuthGuard.prototype.canLoad = function (route) {
        //let url = `/${route.path}`;
        var url = route.path;
        return this.checkLogin(url);
    };
    AuthGuard.prototype.checkLogin = function (url) {
        if (this.authService.isLoggedIn) {
            return true;
        }
        this.authService.loginRedirectUrl = url;
        this.router.navigate(['login'], { preserveQueryParams: true, queryParamsHandling: "merge", preserveFragment: true });
        return false;
    };
    AuthGuard = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_auth_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"], _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]])
    ], AuthGuard);
    return AuthGuard;
}());



/***/ }),

/***/ "./src/app/services/auth.service.ts":
/*!******************************************!*\
  !*** ./src/app/services/auth.service.ts ***!
  \******************************************/
/*! exports provided: AuthService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthService", function() { return AuthService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _local_store_manager_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./local-store-manager.service */ "./src/app/services/local-store-manager.service.ts");
/* harmony import */ var _endpoint_factory_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./endpoint-factory.service */ "./src/app/services/endpoint-factory.service.ts");
/* harmony import */ var _configuration_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./configuration.service */ "./src/app/services/configuration.service.ts");
/* harmony import */ var _db_Keys__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./db-Keys */ "./src/app/services/db-Keys.ts");
/* harmony import */ var _jwt_helper__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./jwt-helper */ "./src/app/services/jwt-helper.ts");
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./utilities */ "./src/app/services/utilities.ts");
/* harmony import */ var _models_user_model__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../models/user.model */ "./src/app/models/user.model.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











var AuthService = /** @class */ (function () {
    function AuthService(router, configurations, endpointFactory, localStorage) {
        this.router = router;
        this.configurations = configurations;
        this.endpointFactory = endpointFactory;
        this.localStorage = localStorage;
        this.previousIsLoggedInCheck = false;
        this._loginStatus = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.initializeLoginStatus();
    }
    Object.defineProperty(AuthService.prototype, "loginUrl", {
        get: function () { return this.configurations.loginUrl; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "homeUrl", {
        get: function () { return this.configurations.homeUrl; },
        enumerable: true,
        configurable: true
    });
    AuthService.prototype.initializeLoginStatus = function () {
        var _this = this;
        this.localStorage.getInitEvent().subscribe(function () {
            _this.reevaluateLoginStatus();
        });
    };
    AuthService.prototype.gotoPage = function (page, preserveParams) {
        if (preserveParams === void 0) { preserveParams = true; }
        var navigationExtras = {
            queryParamsHandling: preserveParams ? "merge" : "", preserveFragment: preserveParams
        };
        this.router.navigate([page], navigationExtras);
    };
    AuthService.prototype.redirectLoginUser = function () {
        var redirect = this.loginRedirectUrl && this.loginRedirectUrl != '/' && this.loginRedirectUrl != _configuration_service__WEBPACK_IMPORTED_MODULE_6__["ConfigurationService"].defaultHomeUrl ? this.loginRedirectUrl : this.homeUrl;
        this.loginRedirectUrl = null;
        var urlParamsAndFragment = _utilities__WEBPACK_IMPORTED_MODULE_9__["Utilities"].splitInTwo(redirect, '#');
        var urlAndParams = _utilities__WEBPACK_IMPORTED_MODULE_9__["Utilities"].splitInTwo(urlParamsAndFragment.firstPart, '?');
        var navigationExtras = {
            fragment: urlParamsAndFragment.secondPart,
            queryParams: _utilities__WEBPACK_IMPORTED_MODULE_9__["Utilities"].getQueryParamsFromString(urlAndParams.secondPart),
            queryParamsHandling: "merge"
        };
        this.router.navigate([urlAndParams.firstPart], navigationExtras);
    };
    AuthService.prototype.redirectLogoutUser = function () {
        var redirect = this.logoutRedirectUrl ? this.logoutRedirectUrl : this.loginUrl;
        this.logoutRedirectUrl = null;
        this.router.navigate([redirect]);
    };
    AuthService.prototype.redirectForLogin = function () {
        this.loginRedirectUrl = this.router.url;
        this.router.navigate([this.loginUrl]);
    };
    AuthService.prototype.reLogin = function () {
        this.localStorage.deleteData(_db_Keys__WEBPACK_IMPORTED_MODULE_7__["DBkeys"].TOKEN_EXPIRES_IN);
        if (this.reLoginDelegate) {
            this.reLoginDelegate();
        }
        else {
            this.redirectForLogin();
        }
    };
    AuthService.prototype.refreshLogin = function () {
        var _this = this;
        return this.endpointFactory.getRefreshLoginEndpoint().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(function (response) { return _this.processLoginResponse(response, _this.rememberMe); }));
    };
    AuthService.prototype.login = function (userName, password, rememberMe) {
        var _this = this;
        if (this.isLoggedIn)
            this.logout();
        return this.endpointFactory.getLoginEndpoint(userName, password).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(function (response) { return _this.processLoginResponse(response, rememberMe); }));
    };
    AuthService.prototype.processLoginResponse = function (response, rememberMe) {
        var accessToken = response.access_token;
        if (accessToken == null)
            throw new Error("Received accessToken was empty");
        var idToken = response.id_token;
        var refreshToken = response.refresh_token || this.refreshToken;
        var expiresIn = response.expires_in;
        var tokenExpiryDate = new Date();
        tokenExpiryDate.setSeconds(tokenExpiryDate.getSeconds() + expiresIn);
        var accessTokenExpiry = tokenExpiryDate;
        var jwtHelper = new _jwt_helper__WEBPACK_IMPORTED_MODULE_8__["JwtHelper"]();
        var decodedIdToken = jwtHelper.decodeToken(response.id_token);
        var permissions = Array.isArray(decodedIdToken.permission) ? decodedIdToken.permission : [decodedIdToken.permission];
        //if (!this.isLoggedIn)
        // this.configurations.import(decodedIdToken.configuration);
        var user = new _models_user_model__WEBPACK_IMPORTED_MODULE_10__["User"](decodedIdToken.sub, decodedIdToken.name, decodedIdToken.fullname, decodedIdToken.email, decodedIdToken.jobtitle, decodedIdToken.phone, Array.isArray(decodedIdToken.role) ? decodedIdToken.role : [decodedIdToken.role]);
        user.isEnabled = true;
        this.saveUserDetails(user, permissions, accessToken, idToken, refreshToken, accessTokenExpiry, rememberMe);
        this.reevaluateLoginStatus(user);
        return user;
    };
    AuthService.prototype.saveUserDetails = function (user, permissions, accessToken, idToken, refreshToken, expiresIn, rememberMe) {
        if (rememberMe) {
            this.localStorage.savePermanentData(accessToken, _db_Keys__WEBPACK_IMPORTED_MODULE_7__["DBkeys"].ACCESS_TOKEN);
            this.localStorage.savePermanentData(idToken, _db_Keys__WEBPACK_IMPORTED_MODULE_7__["DBkeys"].ID_TOKEN);
            this.localStorage.savePermanentData(refreshToken, _db_Keys__WEBPACK_IMPORTED_MODULE_7__["DBkeys"].REFRESH_TOKEN);
            this.localStorage.savePermanentData(expiresIn, _db_Keys__WEBPACK_IMPORTED_MODULE_7__["DBkeys"].TOKEN_EXPIRES_IN);
            this.localStorage.savePermanentData(permissions, _db_Keys__WEBPACK_IMPORTED_MODULE_7__["DBkeys"].USER_PERMISSIONS);
            this.localStorage.savePermanentData(user, _db_Keys__WEBPACK_IMPORTED_MODULE_7__["DBkeys"].CURRENT_USER);
        }
        else {
            this.localStorage.saveSyncedSessionData(accessToken, _db_Keys__WEBPACK_IMPORTED_MODULE_7__["DBkeys"].ACCESS_TOKEN);
            this.localStorage.saveSyncedSessionData(idToken, _db_Keys__WEBPACK_IMPORTED_MODULE_7__["DBkeys"].ID_TOKEN);
            this.localStorage.saveSyncedSessionData(refreshToken, _db_Keys__WEBPACK_IMPORTED_MODULE_7__["DBkeys"].REFRESH_TOKEN);
            this.localStorage.saveSyncedSessionData(expiresIn, _db_Keys__WEBPACK_IMPORTED_MODULE_7__["DBkeys"].TOKEN_EXPIRES_IN);
            this.localStorage.saveSyncedSessionData(permissions, _db_Keys__WEBPACK_IMPORTED_MODULE_7__["DBkeys"].USER_PERMISSIONS);
            this.localStorage.saveSyncedSessionData(user, _db_Keys__WEBPACK_IMPORTED_MODULE_7__["DBkeys"].CURRENT_USER);
        }
        this.localStorage.savePermanentData(rememberMe, _db_Keys__WEBPACK_IMPORTED_MODULE_7__["DBkeys"].REMEMBER_ME);
    };
    AuthService.prototype.logout = function () {
        this.localStorage.deleteData(_db_Keys__WEBPACK_IMPORTED_MODULE_7__["DBkeys"].ACCESS_TOKEN);
        this.localStorage.deleteData(_db_Keys__WEBPACK_IMPORTED_MODULE_7__["DBkeys"].ID_TOKEN);
        this.localStorage.deleteData(_db_Keys__WEBPACK_IMPORTED_MODULE_7__["DBkeys"].REFRESH_TOKEN);
        this.localStorage.deleteData(_db_Keys__WEBPACK_IMPORTED_MODULE_7__["DBkeys"].TOKEN_EXPIRES_IN);
        this.localStorage.deleteData(_db_Keys__WEBPACK_IMPORTED_MODULE_7__["DBkeys"].USER_PERMISSIONS);
        this.localStorage.deleteData(_db_Keys__WEBPACK_IMPORTED_MODULE_7__["DBkeys"].CURRENT_USER);
        this.configurations.clearLogOutChanges();
        this.reevaluateLoginStatus();
    };
    AuthService.prototype.reevaluateLoginStatus = function (currentUser) {
        var _this = this;
        var user = currentUser || this.localStorage.getDataObject(_db_Keys__WEBPACK_IMPORTED_MODULE_7__["DBkeys"].CURRENT_USER);
        var isLoggedIn = user != null;
        if (this.previousIsLoggedInCheck != isLoggedIn) {
            setTimeout(function () {
                _this._loginStatus.next(isLoggedIn);
            });
        }
        this.previousIsLoggedInCheck = isLoggedIn;
    };
    AuthService.prototype.getLoginStatusEvent = function () {
        return this._loginStatus.asObservable();
    };
    Object.defineProperty(AuthService.prototype, "currentUser", {
        get: function () {
            var user = this.localStorage.getDataObject(_db_Keys__WEBPACK_IMPORTED_MODULE_7__["DBkeys"].CURRENT_USER);
            this.reevaluateLoginStatus(user);
            return user;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "userPermissions", {
        get: function () {
            return this.localStorage.getDataObject(_db_Keys__WEBPACK_IMPORTED_MODULE_7__["DBkeys"].USER_PERMISSIONS) || [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "accessToken", {
        get: function () {
            this.reevaluateLoginStatus();
            return this.localStorage.getData(_db_Keys__WEBPACK_IMPORTED_MODULE_7__["DBkeys"].ACCESS_TOKEN);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "accessTokenExpiryDate", {
        get: function () {
            this.reevaluateLoginStatus();
            return this.localStorage.getDataObject(_db_Keys__WEBPACK_IMPORTED_MODULE_7__["DBkeys"].TOKEN_EXPIRES_IN, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "isSessionExpired", {
        get: function () {
            if (this.accessTokenExpiryDate == null) {
                return true;
            }
            return !(this.accessTokenExpiryDate.valueOf() > new Date().valueOf());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "idToken", {
        get: function () {
            this.reevaluateLoginStatus();
            return this.localStorage.getData(_db_Keys__WEBPACK_IMPORTED_MODULE_7__["DBkeys"].ID_TOKEN);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "refreshToken", {
        get: function () {
            this.reevaluateLoginStatus();
            return this.localStorage.getData(_db_Keys__WEBPACK_IMPORTED_MODULE_7__["DBkeys"].REFRESH_TOKEN);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "isLoggedIn", {
        get: function () {
            return this.currentUser != null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "rememberMe", {
        get: function () {
            return this.localStorage.getDataObject(_db_Keys__WEBPACK_IMPORTED_MODULE_7__["DBkeys"].REMEMBER_ME) == true;
        },
        enumerable: true,
        configurable: true
    });
    AuthService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"], _configuration_service__WEBPACK_IMPORTED_MODULE_6__["ConfigurationService"], _endpoint_factory_service__WEBPACK_IMPORTED_MODULE_5__["EndpointFactory"], _local_store_manager_service__WEBPACK_IMPORTED_MODULE_4__["LocalStoreManager"]])
    ], AuthService);
    return AuthService;
}());



/***/ }),

/***/ "./src/app/services/configuration.service.ts":
/*!***************************************************!*\
  !*** ./src/app/services/configuration.service.ts ***!
  \***************************************************/
/*! exports provided: ConfigurationService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConfigurationService", function() { return ConfigurationService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _app_translation_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app-translation.service */ "./src/app/services/app-translation.service.ts");
/* harmony import */ var _local_store_manager_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./local-store-manager.service */ "./src/app/services/local-store-manager.service.ts");
/* harmony import */ var _db_Keys__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./db-Keys */ "./src/app/services/db-Keys.ts");
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utilities */ "./src/app/services/utilities.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../environments/environment */ "./src/environments/environment.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var ConfigurationService = /** @class */ (function () {
    function ConfigurationService(localStorage, translationService) {
        this.localStorage = localStorage;
        this.translationService = translationService;
        this.baseUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].baseUrl || _utilities__WEBPACK_IMPORTED_MODULE_4__["Utilities"].baseUrl();
        this.loginUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].loginUrl;
        this.fallbackBaseUrl = "http://localhost";
        //***End of defaults***  
        this._language = null;
        this._homeUrl = null;
        this._theme = null;
        this._showDashboardStatistics = null;
        this._showDashboardNotifications = null;
        this._showDashboardTodo = null;
        this.loadLocalChanges();
    }
    ConfigurationService_1 = ConfigurationService;
    ConfigurationService.prototype.loadLocalChanges = function () {
        if (this.localStorage.exists(_db_Keys__WEBPACK_IMPORTED_MODULE_3__["DBkeys"].LANGUAGE)) {
            this._language = this.localStorage.getDataObject(_db_Keys__WEBPACK_IMPORTED_MODULE_3__["DBkeys"].LANGUAGE);
            this.translationService.changeLanguage(this._language);
        }
        else {
            this.resetLanguage();
        }
        if (this.localStorage.exists(_db_Keys__WEBPACK_IMPORTED_MODULE_3__["DBkeys"].HOME_URL))
            this._homeUrl = this.localStorage.getDataObject(_db_Keys__WEBPACK_IMPORTED_MODULE_3__["DBkeys"].HOME_URL);
        if (this.localStorage.exists(_db_Keys__WEBPACK_IMPORTED_MODULE_3__["DBkeys"].THEME))
            this._theme = this.localStorage.getDataObject(_db_Keys__WEBPACK_IMPORTED_MODULE_3__["DBkeys"].THEME);
        if (this.localStorage.exists(_db_Keys__WEBPACK_IMPORTED_MODULE_3__["DBkeys"].SHOW_DASHBOARD_STATISTICS))
            this._showDashboardStatistics = this.localStorage.getDataObject(_db_Keys__WEBPACK_IMPORTED_MODULE_3__["DBkeys"].SHOW_DASHBOARD_STATISTICS);
        if (this.localStorage.exists(_db_Keys__WEBPACK_IMPORTED_MODULE_3__["DBkeys"].SHOW_DASHBOARD_NOTIFICATIONS))
            this._showDashboardNotifications = this.localStorage.getDataObject(_db_Keys__WEBPACK_IMPORTED_MODULE_3__["DBkeys"].SHOW_DASHBOARD_NOTIFICATIONS);
        if (this.localStorage.exists(_db_Keys__WEBPACK_IMPORTED_MODULE_3__["DBkeys"].SHOW_DASHBOARD_TODO))
            this._showDashboardTodo = this.localStorage.getDataObject(_db_Keys__WEBPACK_IMPORTED_MODULE_3__["DBkeys"].SHOW_DASHBOARD_TODO);
    };
    ConfigurationService.prototype.saveToLocalStore = function (data, key) {
        var _this = this;
        setTimeout(function () { return _this.localStorage.savePermanentData(data, key); });
    };
    ConfigurationService.prototype.import = function (value) {
        this.clearLocalChanges();
        if (!value)
            return;
        var config = _utilities__WEBPACK_IMPORTED_MODULE_4__["Utilities"].JSonTryParse(value);
        if (config.language != null)
            this.language = config.language;
        if (config.homeUrl != null)
            this.homeUrl = config.homeUrl;
        if (config.theme != null)
            this.theme = config.theme;
        if (config.showDashboardStatistics != null)
            this.showDashboardStatistics = config.showDashboardStatistics;
        if (config.showDashboardNotifications != null)
            this.showDashboardNotifications = config.showDashboardNotifications;
        if (config.showDashboardTodo != null)
            this.showDashboardTodo = config.showDashboardTodo;
    };
    ConfigurationService.prototype.export = function (changesOnly) {
        if (changesOnly === void 0) { changesOnly = true; }
        var exportValue = {
            language: changesOnly ? this._language : this.language,
            homeUrl: changesOnly ? this._homeUrl : this.homeUrl,
            theme: changesOnly ? this._theme : this.theme,
            showDashboardStatistics: changesOnly ? this._showDashboardStatistics : this.showDashboardStatistics,
            showDashboardNotifications: changesOnly ? this._showDashboardNotifications : this.showDashboardNotifications,
            showDashboardTodo: changesOnly ? this._showDashboardTodo : this.showDashboardTodo,
        };
        return JSON.stringify(exportValue);
    };
    ConfigurationService.prototype.clearLocalChanges = function () {
        this._language = null;
        this._homeUrl = null;
        this._theme = null;
        this._showDashboardStatistics = null;
        this._showDashboardNotifications = null;
        this._showDashboardTodo = null;
        this.localStorage.deleteData(_db_Keys__WEBPACK_IMPORTED_MODULE_3__["DBkeys"].LANGUAGE);
        this.localStorage.deleteData(_db_Keys__WEBPACK_IMPORTED_MODULE_3__["DBkeys"].HOME_URL);
        this.localStorage.deleteData(_db_Keys__WEBPACK_IMPORTED_MODULE_3__["DBkeys"].THEME);
        this.localStorage.deleteData(_db_Keys__WEBPACK_IMPORTED_MODULE_3__["DBkeys"].SHOW_DASHBOARD_STATISTICS);
        this.localStorage.deleteData(_db_Keys__WEBPACK_IMPORTED_MODULE_3__["DBkeys"].SHOW_DASHBOARD_NOTIFICATIONS);
        this.localStorage.deleteData(_db_Keys__WEBPACK_IMPORTED_MODULE_3__["DBkeys"].SHOW_DASHBOARD_TODO);
        this.resetLanguage();
    };
    ConfigurationService.prototype.clearLogOutChanges = function () {
        this._homeUrl = null;
        this._theme = null;
        this._showDashboardStatistics = null;
        this._showDashboardNotifications = null;
        this._showDashboardTodo = null;
        this.localStorage.deleteData(_db_Keys__WEBPACK_IMPORTED_MODULE_3__["DBkeys"].HOME_URL);
        this.localStorage.deleteData(_db_Keys__WEBPACK_IMPORTED_MODULE_3__["DBkeys"].THEME);
        this.localStorage.deleteData(_db_Keys__WEBPACK_IMPORTED_MODULE_3__["DBkeys"].SHOW_DASHBOARD_STATISTICS);
        this.localStorage.deleteData(_db_Keys__WEBPACK_IMPORTED_MODULE_3__["DBkeys"].SHOW_DASHBOARD_NOTIFICATIONS);
        this.localStorage.deleteData(_db_Keys__WEBPACK_IMPORTED_MODULE_3__["DBkeys"].SHOW_DASHBOARD_TODO);
    };
    ConfigurationService.prototype.resetLanguage = function () {
        var language = this.translationService.useBrowserLanguage();
        if (language) {
            this._language = language;
        }
        else {
            this._language = this.translationService.changeLanguage();
        }
    };
    Object.defineProperty(ConfigurationService.prototype, "language", {
        get: function () {
            if (this._language != null)
                return this._language;
            return ConfigurationService_1.defaultLanguage;
        },
        set: function (value) {
            this._language = value;
            this.saveToLocalStore(value, _db_Keys__WEBPACK_IMPORTED_MODULE_3__["DBkeys"].LANGUAGE);
            this.translationService.changeLanguage(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConfigurationService.prototype, "homeUrl", {
        get: function () {
            if (this._homeUrl != null)
                return this._homeUrl;
            return ConfigurationService_1.defaultHomeUrl;
        },
        set: function (value) {
            this._homeUrl = value;
            this.saveToLocalStore(value, _db_Keys__WEBPACK_IMPORTED_MODULE_3__["DBkeys"].HOME_URL);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConfigurationService.prototype, "theme", {
        get: function () {
            if (this._theme != null)
                return this._theme;
            return ConfigurationService_1.defaultTheme;
        },
        set: function (value) {
            this._theme = value;
            this.saveToLocalStore(value, _db_Keys__WEBPACK_IMPORTED_MODULE_3__["DBkeys"].THEME);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConfigurationService.prototype, "showDashboardStatistics", {
        get: function () {
            if (this._showDashboardStatistics != null)
                return this._showDashboardStatistics;
            return ConfigurationService_1.defaultShowDashboardStatistics;
        },
        set: function (value) {
            this._showDashboardStatistics = value;
            this.saveToLocalStore(value, _db_Keys__WEBPACK_IMPORTED_MODULE_3__["DBkeys"].SHOW_DASHBOARD_STATISTICS);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConfigurationService.prototype, "showDashboardNotifications", {
        get: function () {
            if (this._showDashboardNotifications != null)
                return this._showDashboardNotifications;
            return ConfigurationService_1.defaultShowDashboardNotifications;
        },
        set: function (value) {
            this._showDashboardNotifications = value;
            this.saveToLocalStore(value, _db_Keys__WEBPACK_IMPORTED_MODULE_3__["DBkeys"].SHOW_DASHBOARD_NOTIFICATIONS);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConfigurationService.prototype, "showDashboardTodo", {
        get: function () {
            if (this._showDashboardTodo != null)
                return this._showDashboardTodo;
            return ConfigurationService_1.defaultShowDashboardTodo;
        },
        set: function (value) {
            this._showDashboardTodo = value;
            this.saveToLocalStore(value, _db_Keys__WEBPACK_IMPORTED_MODULE_3__["DBkeys"].SHOW_DASHBOARD_TODO);
        },
        enumerable: true,
        configurable: true
    });
    ConfigurationService.appVersion = "0.1.0";
    //***Specify default configurations here***
    ConfigurationService.defaultLanguage = "en";
    ConfigurationService.defaultHomeUrl = "/";
    ConfigurationService.defaultTheme = "Default";
    ConfigurationService.defaultShowDashboardStatistics = true;
    ConfigurationService.defaultShowDashboardNotifications = true;
    ConfigurationService.defaultShowDashboardTodo = false;
    ConfigurationService = ConfigurationService_1 = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_local_store_manager_service__WEBPACK_IMPORTED_MODULE_2__["LocalStoreManager"], _app_translation_service__WEBPACK_IMPORTED_MODULE_1__["AppTranslationService"]])
    ], ConfigurationService);
    return ConfigurationService;
    var ConfigurationService_1;
}());



/***/ }),

/***/ "./src/app/services/db-Keys.ts":
/*!*************************************!*\
  !*** ./src/app/services/db-Keys.ts ***!
  \*************************************/
/*! exports provided: DBkeys */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DBkeys", function() { return DBkeys; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var DBkeys = /** @class */ (function () {
    function DBkeys() {
    }
    DBkeys.CURRENT_USER = 'current_user';
    DBkeys.USER_PERMISSIONS = 'user_permissions';
    DBkeys.ACCESS_TOKEN = 'access_token';
    DBkeys.ID_TOKEN = 'id_token';
    DBkeys.REFRESH_TOKEN = 'refresh_token';
    DBkeys.TOKEN_EXPIRES_IN = 'expires_in';
    DBkeys.REMEMBER_ME = 'remember_me';
    DBkeys.LANGUAGE = 'language';
    DBkeys.HOME_URL = 'home_url';
    DBkeys.THEME = 'theme';
    DBkeys.SHOW_DASHBOARD_STATISTICS = 'show_dashboard_statistics';
    DBkeys.SHOW_DASHBOARD_NOTIFICATIONS = 'show_dashboard_notifications';
    DBkeys.SHOW_DASHBOARD_TODO = 'show_dashboard_todo';
    DBkeys = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])()
    ], DBkeys);
    return DBkeys;
}());



/***/ }),

/***/ "./src/app/services/endpoint-factory.service.ts":
/*!******************************************************!*\
  !*** ./src/app/services/endpoint-factory.service.ts ***!
  \******************************************************/
/*! exports provided: EndpointFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EndpointFactory", function() { return EndpointFactory; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _auth_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./auth.service */ "./src/app/services/auth.service.ts");
/* harmony import */ var _configuration_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./configuration.service */ "./src/app/services/configuration.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var EndpointFactory = /** @class */ (function () {
    function EndpointFactory(http, configurations, injector) {
        this.http = http;
        this.configurations = configurations;
        this.injector = injector;
        this._loginUrl = "/connect/token";
    }
    EndpointFactory_1 = EndpointFactory;
    Object.defineProperty(EndpointFactory.prototype, "loginUrl", {
        get: function () { return this.configurations.baseUrl + this._loginUrl; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EndpointFactory.prototype, "authService", {
        get: function () {
            if (!this._authService)
                this._authService = this.injector.get(_auth_service__WEBPACK_IMPORTED_MODULE_4__["AuthService"]);
            return this._authService;
        },
        enumerable: true,
        configurable: true
    });
    EndpointFactory.prototype.getLoginEndpoint = function (userName, password) {
        var header = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]({ 'Content-Type': 'application/x-www-form-urlencoded' });
        var params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpParams"]()
            .append('username', userName)
            .append('password', password)
            .append('grant_type', 'password')
            .append('scope', 'openid email phone profile offline_access roles');
        var requestBody = params.toString();
        return this.http.post(this.loginUrl, requestBody, { headers: header });
    };
    EndpointFactory.prototype.getRefreshLoginEndpoint = function () {
        var _this = this;
        var header = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]({ 'Content-Type': 'application/x-www-form-urlencoded' });
        var params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpParams"]()
            .append('refresh_token', this.authService.refreshToken)
            .append('grant_type', 'refresh_token')
            .append('scope', 'openid email phone profile offline_access roles');
        var requestBody = params.toString();
        return this.http.post(this.loginUrl, requestBody, { headers: header }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(function (error) {
            return _this.handleError(error, function () { return _this.getRefreshLoginEndpoint(); });
        }));
    };
    EndpointFactory.prototype.getRequestHeaders = function () {
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]({
            'Authorization': 'Bearer ' + this.authService.accessToken,
            'Content-Type': 'application/json',
            'Accept': "application/vnd.iman.v" + EndpointFactory_1.apiVersion + "+json, application/json, text/plain, */*",
            'App-Version': _configuration_service__WEBPACK_IMPORTED_MODULE_5__["ConfigurationService"].appVersion
        });
        return { headers: headers };
    };
    EndpointFactory.prototype.getRequestHeadersText = function () {
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]({
            'Authorization': 'Bearer ' + this.authService.accessToken,
            'Content-Type': 'text/plain',
            'Accept': "application/vnd.iman.v" + EndpointFactory_1.apiVersion + "+json, application/json, text/plain, */*",
            'App-Version': _configuration_service__WEBPACK_IMPORTED_MODULE_5__["ConfigurationService"].appVersion
        });
        return { headers: headers };
    };
    EndpointFactory.prototype.handleError = function (error, continuation) {
        var _this = this;
        if (error.status == 401) {
            if (this.isRefreshingLogin) {
                return this.pauseTask(continuation);
            }
            this.isRefreshingLogin = true;
            return this.authService.refreshLogin().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["mergeMap"])(function (data) {
                _this.isRefreshingLogin = false;
                _this.resumeTasks(true);
                return continuation ? continuation() : null;
            }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(function (refreshLoginError) {
                _this.isRefreshingLogin = false;
                _this.resumeTasks(false);
                if (refreshLoginError.status == 401 || (refreshLoginError.url && refreshLoginError.url.toLowerCase().includes(_this.loginUrl.toLowerCase()))) {
                    _this.authService.reLogin();
                    return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["throwError"])('session expired');
                }
                else {
                    return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["throwError"])(refreshLoginError || 'server error');
                }
            }));
        }
        if (error.url && error.url.toLowerCase().includes(this.loginUrl.toLowerCase())) {
            this.authService.reLogin();
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["throwError"])((error.error && error.error.error_description) ? "session expired (" + error.error.error_description + ")" : 'session expired');
        }
        else {
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["throwError"])(error);
        }
    };
    EndpointFactory.prototype.pauseTask = function (continuation) {
        if (!this.taskPauser)
            this.taskPauser = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        return this.taskPauser.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])(function (continueOp) {
            if (continueOp)
                if (continuation)
                    return continuation();
                else
                    return null;
            Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["throwError"])('session expired');
        }));
    };
    EndpointFactory.prototype.resumeTasks = function (continueOp) {
        var _this = this;
        setTimeout(function () {
            if (_this.taskPauser) {
                _this.taskPauser.next(continueOp);
                _this.taskPauser.complete();
                _this.taskPauser = null;
            }
        });
    };
    EndpointFactory.apiVersion = "1";
    EndpointFactory = EndpointFactory_1 = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"], _configuration_service__WEBPACK_IMPORTED_MODULE_5__["ConfigurationService"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injector"]])
    ], EndpointFactory);
    return EndpointFactory;
    var EndpointFactory_1;
}());



/***/ }),

/***/ "./src/app/services/invoice-endpoint.service.ts":
/*!******************************************************!*\
  !*** ./src/app/services/invoice-endpoint.service.ts ***!
  \******************************************************/
/*! exports provided: InvoiceEndpoint */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InvoiceEndpoint", function() { return InvoiceEndpoint; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _endpoint_factory_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./endpoint-factory.service */ "./src/app/services/endpoint-factory.service.ts");
/* harmony import */ var _configuration_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./configuration.service */ "./src/app/services/configuration.service.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var InvoiceEndpoint = /** @class */ (function (_super) {
    __extends(InvoiceEndpoint, _super);
    function InvoiceEndpoint(http, configurations, injector) {
        var _this = _super.call(this, http, configurations, injector) || this;
        _this._openInvoicesUrl = "/api/invoice/open";
        _this._closedInvoicesUrl = "/api/invoice/closed";
        _this._invoicePdfUrl = "/api/invoice/pdf";
        return _this;
    }
    Object.defineProperty(InvoiceEndpoint.prototype, "openInvoicesUrl", {
        get: function () { return this.configurations.baseUrl + this._openInvoicesUrl; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InvoiceEndpoint.prototype, "closedInvoicesUrl", {
        get: function () { return this.configurations.baseUrl + this._closedInvoicesUrl; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InvoiceEndpoint.prototype, "pdfUrl", {
        get: function () { return this.configurations.baseUrl + this._invoicePdfUrl; },
        enumerable: true,
        configurable: true
    });
    // get open invoices
    InvoiceEndpoint.prototype.getOpenInvoicesEndpoint = function () {
        var _this = this;
        return this.http.post(this.openInvoicesUrl, null, this.getRequestHeaders()).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (error) {
            return _this.handleError(error, function () { return _this.getOpenInvoicesEndpoint(); });
        }));
    };
    // get closed invoices
    InvoiceEndpoint.prototype.getClosedInvoicesEndpoint = function () {
        var _this = this;
        return this.http.post(this.closedInvoicesUrl, null, this.getRequestHeaders()).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (error) {
            return _this.handleError(error, function () { return _this.getClosedInvoicesEndpoint(); });
        }));
    };
    InvoiceEndpoint.prototype.getInvoicePDF = function (invoiceNumber) {
        var pdflink = this.pdfUrl + "?InvoiceNumber=" + invoiceNumber;
        return this.http.get(pdflink, this.getRequestHeaders()).pipe();
    };
    InvoiceEndpoint = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"], _configuration_service__WEBPACK_IMPORTED_MODULE_4__["ConfigurationService"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injector"]])
    ], InvoiceEndpoint);
    return InvoiceEndpoint;
}(_endpoint_factory_service__WEBPACK_IMPORTED_MODULE_3__["EndpointFactory"]));



/***/ }),

/***/ "./src/app/services/invoice.service.ts":
/*!*********************************************!*\
  !*** ./src/app/services/invoice.service.ts ***!
  \*********************************************/
/*! exports provided: InvoiceService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InvoiceService", function() { return InvoiceService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _invoice_endpoint_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./invoice-endpoint.service */ "./src/app/services/invoice-endpoint.service.ts");
/* harmony import */ var _auth_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./auth.service */ "./src/app/services/auth.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var InvoiceService = /** @class */ (function () {
    function InvoiceService(router, http, authService, invoiceEndpoint) {
        this.router = router;
        this.http = http;
        this.authService = authService;
        this.invoiceEndpoint = invoiceEndpoint;
        this.invoicesToPay = [];
        this.userInvoices = [];
    }
    InvoiceService.prototype.getOpenInvoices = function () {
        return this.invoiceEndpoint.getOpenInvoicesEndpoint();
    };
    InvoiceService.prototype.getClosedInvoices = function () {
        return this.invoiceEndpoint.getClosedInvoicesEndpoint();
    };
    InvoiceService.prototype.setUserInvoices = function (invoices) {
        this.userInvoices = invoices;
    };
    InvoiceService.prototype.getInvoicesToPay = function () {
        this.invoicesToPay = [];
        for (var i = 0; i < this.userInvoices.length; i++) {
            if (this.userInvoices[i].userPaymentAmount > 0) {
                this.invoicesToPay.push(this.userInvoices[i]);
            }
        }
        return this.invoicesToPay;
    };
    InvoiceService.prototype.getOpenInvoicesTotal = function () {
        if (!this.userInvoices)
            return 0;
        this.openInvoicesTotal = 0;
        for (var i = 0; i < this.userInvoices.length; i++) {
            if (this.userInvoices[i].balance > 0) {
                this.openInvoicesTotal += this.userInvoices[i].balance;
            }
        }
        return this.openInvoicesTotal;
    };
    InvoiceService.prototype.getInvoicesPaymentTotal = function () {
        if (!this.invoicesToPay)
            return 0;
        this.invoicesTotalToPay = 0;
        for (var i = 0; i < this.invoicesToPay.length; i++) {
            if (this.invoicesToPay[i].userPaymentAmount > 0) {
                this.invoicesTotalToPay += this.invoicesToPay[i].userPaymentAmount;
            }
        }
        return this.invoicesTotalToPay;
    };
    InvoiceService.prototype.getUserInvoices = function () {
        return this.userInvoices;
    };
    InvoiceService.prototype.getInvoicePDF = function (invoiceNumber) {
        return this.invoiceEndpoint.getInvoicePDF(invoiceNumber);
    };
    InvoiceService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"], _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"], _auth_service__WEBPACK_IMPORTED_MODULE_4__["AuthService"],
            _invoice_endpoint_service__WEBPACK_IMPORTED_MODULE_3__["InvoiceEndpoint"]])
    ], InvoiceService);
    return InvoiceService;
}());



/***/ }),

/***/ "./src/app/services/jwt-helper.ts":
/*!****************************************!*\
  !*** ./src/app/services/jwt-helper.ts ***!
  \****************************************/
/*! exports provided: JwtHelper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JwtHelper", function() { return JwtHelper; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Helper class to decode and find JWT expiration.
 */

var JwtHelper = /** @class */ (function () {
    function JwtHelper() {
    }
    JwtHelper.prototype.urlBase64Decode = function (str) {
        var output = str.replace(/-/g, '+').replace(/_/g, '/');
        switch (output.length % 4) {
            case 0: {
                break;
            }
            case 2: {
                output += '==';
                break;
            }
            case 3: {
                output += '=';
                break;
            }
            default: {
                throw new Error('Illegal base64url string!');
            }
        }
        return this.b64DecodeUnicode(output);
    };
    // https://developer.mozilla.org/en/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
    JwtHelper.prototype.b64DecodeUnicode = function (str) {
        return decodeURIComponent(Array.prototype.map.call(atob(str), function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    };
    JwtHelper.prototype.decodeToken = function (token) {
        var parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('JWT must have 3 parts');
        }
        var decoded = this.urlBase64Decode(parts[1]);
        if (!decoded) {
            throw new Error('Cannot decode the token');
        }
        return JSON.parse(decoded);
    };
    JwtHelper.prototype.getTokenExpirationDate = function (token) {
        var decoded;
        decoded = this.decodeToken(token);
        if (!decoded.hasOwnProperty('exp')) {
            return null;
        }
        var date = new Date(0); // The 0 here is the key, which sets the date to the epoch
        date.setUTCSeconds(decoded.exp);
        return date;
    };
    JwtHelper.prototype.isTokenExpired = function (token, offsetSeconds) {
        var date = this.getTokenExpirationDate(token);
        offsetSeconds = offsetSeconds || 0;
        if (date == null) {
            return false;
        }
        // Token expired?
        return !(date.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
    };
    JwtHelper = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])()
    ], JwtHelper);
    return JwtHelper;
}());



/***/ }),

/***/ "./src/app/services/language-observable.service.ts":
/*!*********************************************************!*\
  !*** ./src/app/services/language-observable.service.ts ***!
  \*********************************************************/
/*! exports provided: LanguageObservableService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LanguageObservableService", function() { return LanguageObservableService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var LanguageObservableService = /** @class */ (function () {
    function LanguageObservableService() {
        this.language = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
        this.languageStream$ = this.language.asObservable();
    }
    LanguageObservableService.prototype.setDefaultLanguage = function (language) {
        this.language.next(language);
    };
    LanguageObservableService.prototype.getDefaultLanguage = function () {
        return this.language;
    };
    LanguageObservableService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [])
    ], LanguageObservableService);
    return LanguageObservableService;
}());



/***/ }),

/***/ "./src/app/services/local-store-manager.service.ts":
/*!*********************************************************!*\
  !*** ./src/app/services/local-store-manager.service.ts ***!
  \*********************************************************/
/*! exports provided: LocalStoreManager */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LocalStoreManager", function() { return LocalStoreManager; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utilities */ "./src/app/services/utilities.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var LocalStoreManager = /** @class */ (function () {
    function LocalStoreManager() {
        var _this = this;
        this.syncKeys = [];
        this.initEvent = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
        this.reservedKeys = [
            'sync_keys',
            'addToSyncKeys',
            'removeFromSyncKeys',
            'getSessionStorage',
            'setSessionStorage',
            'addToSessionStorage',
            'removeFromSessionStorage',
            'clearAllSessionsStorage'
        ];
        this.sessionStorageTransferHandler = function (event) {
            if (!event.newValue)
                return;
            if (event.key == 'getSessionStorage') {
                if (sessionStorage.length) {
                    _this.localStorageSetItem('setSessionStorage', sessionStorage);
                    localStorage.removeItem('setSessionStorage');
                }
            }
            else if (event.key == 'setSessionStorage') {
                if (!_this.syncKeys.length)
                    _this.loadSyncKeys();
                var data = JSON.parse(event.newValue);
                //console.info("Set => Key: Transfer setSessionStorage" + ",  data: " + JSON.stringify(data));
                for (var key in data) {
                    if (_this.syncKeysContains(key))
                        _this.sessionStorageSetItem(key, JSON.parse(data[key]));
                }
                _this.onInit();
            }
            else if (event.key == 'addToSessionStorage') {
                var data = JSON.parse(event.newValue);
                //console.warn("Set => Key: Transfer addToSessionStorage" + ",  data: " + JSON.stringify(data));
                _this.addToSessionStorageHelper(data["data"], data["key"]);
            }
            else if (event.key == 'removeFromSessionStorage') {
                _this.removeFromSessionStorageHelper(event.newValue);
            }
            else if (event.key == 'clearAllSessionsStorage' && sessionStorage.length) {
                _this.clearInstanceSessionStorage();
            }
            else if (event.key == 'addToSyncKeys') {
                _this.addToSyncKeysHelper(event.newValue);
            }
            else if (event.key == 'removeFromSyncKeys') {
                _this.removeFromSyncKeysHelper(event.newValue);
            }
        };
    }
    LocalStoreManager_1 = LocalStoreManager;
    LocalStoreManager.prototype.initialiseStorageSyncListener = function () {
        if (LocalStoreManager_1.syncListenerInitialised == true)
            return;
        LocalStoreManager_1.syncListenerInitialised = true;
        window.addEventListener("storage", this.sessionStorageTransferHandler, false);
        this.syncSessionStorage();
    };
    LocalStoreManager.prototype.deinitialiseStorageSyncListener = function () {
        window.removeEventListener("storage", this.sessionStorageTransferHandler, false);
        LocalStoreManager_1.syncListenerInitialised = false;
    };
    LocalStoreManager.prototype.syncSessionStorage = function () {
        localStorage.setItem('getSessionStorage', '_dummy');
        localStorage.removeItem('getSessionStorage');
    };
    LocalStoreManager.prototype.clearAllStorage = function () {
        this.clearAllSessionsStorage();
        this.clearLocalStorage();
    };
    LocalStoreManager.prototype.clearAllSessionsStorage = function () {
        this.clearInstanceSessionStorage();
        localStorage.removeItem(LocalStoreManager_1.DBKEY_SYNC_KEYS);
        localStorage.setItem('clearAllSessionsStorage', '_dummy');
        localStorage.removeItem('clearAllSessionsStorage');
    };
    LocalStoreManager.prototype.clearInstanceSessionStorage = function () {
        sessionStorage.clear();
        this.syncKeys = [];
    };
    LocalStoreManager.prototype.clearLocalStorage = function () {
        localStorage.clear();
    };
    LocalStoreManager.prototype.addToSessionStorage = function (data, key) {
        this.addToSessionStorageHelper(data, key);
        this.addToSyncKeysBackup(key);
        this.localStorageSetItem('addToSessionStorage', { key: key, data: data });
        localStorage.removeItem('addToSessionStorage');
    };
    LocalStoreManager.prototype.addToSessionStorageHelper = function (data, key) {
        this.addToSyncKeysHelper(key);
        this.sessionStorageSetItem(key, data);
    };
    LocalStoreManager.prototype.removeFromSessionStorage = function (keyToRemove) {
        this.removeFromSessionStorageHelper(keyToRemove);
        this.removeFromSyncKeysBackup(keyToRemove);
        localStorage.setItem('removeFromSessionStorage', keyToRemove);
        localStorage.removeItem('removeFromSessionStorage');
    };
    LocalStoreManager.prototype.removeFromSessionStorageHelper = function (keyToRemove) {
        sessionStorage.removeItem(keyToRemove);
        this.removeFromSyncKeysHelper(keyToRemove);
    };
    LocalStoreManager.prototype.testForInvalidKeys = function (key) {
        if (!key)
            throw new Error("key cannot be empty");
        if (this.reservedKeys.some(function (x) { return x == key; }))
            throw new Error("The storage key \"" + key + "\" is reserved and cannot be used. Please use a different key");
    };
    LocalStoreManager.prototype.syncKeysContains = function (key) {
        return this.syncKeys.some(function (x) { return x == key; });
    };
    LocalStoreManager.prototype.loadSyncKeys = function () {
        if (this.syncKeys.length)
            return;
        this.syncKeys = this.getSyncKeysFromStorage();
    };
    LocalStoreManager.prototype.getSyncKeysFromStorage = function (defaultValue) {
        if (defaultValue === void 0) { defaultValue = []; }
        var data = this.localStorageGetItem(LocalStoreManager_1.DBKEY_SYNC_KEYS);
        if (data == null)
            return defaultValue;
        else
            return data;
    };
    LocalStoreManager.prototype.addToSyncKeys = function (key) {
        this.addToSyncKeysHelper(key);
        this.addToSyncKeysBackup(key);
        localStorage.setItem('addToSyncKeys', key);
        localStorage.removeItem('addToSyncKeys');
    };
    LocalStoreManager.prototype.addToSyncKeysBackup = function (key) {
        var storedSyncKeys = this.getSyncKeysFromStorage();
        if (!storedSyncKeys.some(function (x) { return x == key; })) {
            storedSyncKeys.push(key);
            this.localStorageSetItem(LocalStoreManager_1.DBKEY_SYNC_KEYS, storedSyncKeys);
        }
    };
    LocalStoreManager.prototype.removeFromSyncKeysBackup = function (key) {
        var storedSyncKeys = this.getSyncKeysFromStorage();
        var index = storedSyncKeys.indexOf(key);
        if (index > -1) {
            storedSyncKeys.splice(index, 1);
            this.localStorageSetItem(LocalStoreManager_1.DBKEY_SYNC_KEYS, storedSyncKeys);
        }
    };
    LocalStoreManager.prototype.addToSyncKeysHelper = function (key) {
        if (!this.syncKeysContains(key))
            this.syncKeys.push(key);
    };
    LocalStoreManager.prototype.removeFromSyncKeys = function (key) {
        this.removeFromSyncKeysHelper(key);
        this.removeFromSyncKeysBackup(key);
        localStorage.setItem('removeFromSyncKeys', key);
        localStorage.removeItem('removeFromSyncKeys');
    };
    LocalStoreManager.prototype.removeFromSyncKeysHelper = function (key) {
        var index = this.syncKeys.indexOf(key);
        if (index > -1) {
            this.syncKeys.splice(index, 1);
        }
    };
    LocalStoreManager.prototype.saveSessionData = function (data, key) {
        if (key === void 0) { key = LocalStoreManager_1.DBKEY_USER_DATA; }
        this.testForInvalidKeys(key);
        this.removeFromSyncKeys(key);
        localStorage.removeItem(key);
        this.sessionStorageSetItem(key, data);
    };
    LocalStoreManager.prototype.saveSyncedSessionData = function (data, key) {
        if (key === void 0) { key = LocalStoreManager_1.DBKEY_USER_DATA; }
        this.testForInvalidKeys(key);
        localStorage.removeItem(key);
        this.addToSessionStorage(data, key);
    };
    LocalStoreManager.prototype.savePermanentData = function (data, key) {
        if (key === void 0) { key = LocalStoreManager_1.DBKEY_USER_DATA; }
        this.testForInvalidKeys(key);
        this.removeFromSessionStorage(key);
        this.localStorageSetItem(key, data);
    };
    LocalStoreManager.prototype.moveDataToSessionStorage = function (key) {
        if (key === void 0) { key = LocalStoreManager_1.DBKEY_USER_DATA; }
        this.testForInvalidKeys(key);
        var data = this.getData(key);
        if (data == null)
            return;
        this.saveSessionData(data, key);
    };
    LocalStoreManager.prototype.moveDataToSyncedSessionStorage = function (key) {
        if (key === void 0) { key = LocalStoreManager_1.DBKEY_USER_DATA; }
        this.testForInvalidKeys(key);
        var data = this.getData(key);
        if (data == null)
            return;
        this.saveSyncedSessionData(data, key);
    };
    LocalStoreManager.prototype.moveDataToPermanentStorage = function (key) {
        if (key === void 0) { key = LocalStoreManager_1.DBKEY_USER_DATA; }
        this.testForInvalidKeys(key);
        var data = this.getData(key);
        if (data == null)
            return;
        this.savePermanentData(data, key);
    };
    LocalStoreManager.prototype.exists = function (key) {
        if (key === void 0) { key = LocalStoreManager_1.DBKEY_USER_DATA; }
        var data = sessionStorage.getItem(key);
        if (data == null)
            data = localStorage.getItem(key);
        return data != null;
    };
    LocalStoreManager.prototype.getData = function (key) {
        if (key === void 0) { key = LocalStoreManager_1.DBKEY_USER_DATA; }
        this.testForInvalidKeys(key);
        var data = this.sessionStorageGetItem(key);
        if (data == null)
            data = this.localStorageGetItem(key);
        return data;
    };
    LocalStoreManager.prototype.getDataObject = function (key, isDateType) {
        if (key === void 0) { key = LocalStoreManager_1.DBKEY_USER_DATA; }
        if (isDateType === void 0) { isDateType = false; }
        var data = this.getData(key);
        if (data != null) {
            if (isDateType)
                data = new Date(data);
            return data;
        }
        else {
            return null;
        }
    };
    LocalStoreManager.prototype.deleteData = function (key) {
        if (key === void 0) { key = LocalStoreManager_1.DBKEY_USER_DATA; }
        this.testForInvalidKeys(key);
        this.removeFromSessionStorage(key);
        localStorage.removeItem(key);
    };
    LocalStoreManager.prototype.localStorageSetItem = function (key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    };
    LocalStoreManager.prototype.sessionStorageSetItem = function (key, data) {
        sessionStorage.setItem(key, JSON.stringify(data));
    };
    LocalStoreManager.prototype.localStorageGetItem = function (key) {
        return _utilities__WEBPACK_IMPORTED_MODULE_2__["Utilities"].JSonTryParse(localStorage.getItem(key));
    };
    LocalStoreManager.prototype.sessionStorageGetItem = function (key) {
        return _utilities__WEBPACK_IMPORTED_MODULE_2__["Utilities"].JSonTryParse(sessionStorage.getItem(key));
    };
    LocalStoreManager.prototype.onInit = function () {
        var _this = this;
        setTimeout(function () {
            _this.initEvent.next();
            _this.initEvent.complete();
        });
    };
    LocalStoreManager.prototype.getInitEvent = function () {
        return this.initEvent.asObservable();
    };
    LocalStoreManager.syncListenerInitialised = false;
    LocalStoreManager.DBKEY_USER_DATA = "user_data";
    LocalStoreManager.DBKEY_SYNC_KEYS = "sync_keys";
    LocalStoreManager = LocalStoreManager_1 = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])()
        /**
        * Provides a wrapper for accessing the web storage API and synchronizing session storage across tabs/windows.
        */
    ], LocalStoreManager);
    return LocalStoreManager;
    var LocalStoreManager_1;
}());



/***/ }),

/***/ "./src/app/services/notification-endpoint.service.ts":
/*!***********************************************************!*\
  !*** ./src/app/services/notification-endpoint.service.ts ***!
  \***********************************************************/
/*! exports provided: NotificationEndpoint */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NotificationEndpoint", function() { return NotificationEndpoint; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var NotificationEndpoint = /** @class */ (function () {
    function NotificationEndpoint() {
        this.demoNotifications = [
            {
                "id": 1,
                "header": "20 New Products were added to your inventory by \"administrator\"",
                "body": "20 new \"BMW M6\" were added to your stock by \"administrator\" on 5/28/2017 4:54:13 PM",
                "isRead": true,
                "isPinned": true,
                "date": "2017-05-28T16:29:13.5877958"
            },
            {
                "id": 2,
                "header": "1 Product running low",
                "body": "You are running low on \"Nissan Patrol\". 2 Items remaining",
                "isRead": false,
                "isPinned": false,
                "date": "2017-05-28T19:54:42.4144502"
            },
            {
                "id": 3,
                "header": "Tomorrow is half day",
                "body": "Guys, tomorrow we close by midday. Please check in your sales before noon. Thanx. Alex.",
                "isRead": false,
                "isPinned": false,
                "date": "2017-05-30T11:13:42.4144502"
            }
        ];
    }
    NotificationEndpoint.prototype.getNotificationEndpoint = function (notificationId) {
        var notification = this.demoNotifications.find(function (val) { return val.id == notificationId; });
        var response;
        if (notification) {
            response = this.createResponse(notification, 200);
        }
        else {
            response = this.createResponse(null, 404);
        }
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(response.body);
    };
    NotificationEndpoint.prototype.getNotificationsEndpoint = function (page, pageSize) {
        var notifications = this.demoNotifications;
        var response = this.createResponse(this.demoNotifications, 200);
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(response.body);
    };
    NotificationEndpoint.prototype.getUnreadNotificationsEndpoint = function (userId) {
        var unreadNotifications = this.demoNotifications.filter(function (val) { return !val.isRead; });
        var response = this.createResponse(unreadNotifications, 200);
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(response.body);
    };
    NotificationEndpoint.prototype.getNewNotificationsEndpoint = function (lastNotificationDate) {
        var unreadNotifications = this.demoNotifications;
        var response = this.createResponse(unreadNotifications, 200);
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(response.body);
    };
    NotificationEndpoint.prototype.getPinUnpinNotificationEndpoint = function (notificationId, isPinned) {
        var notification = this.demoNotifications.find(function (val) { return val.id == notificationId; });
        var response;
        if (notification) {
            response = this.createResponse(null, 204);
            if (isPinned == null)
                isPinned = !notification.isPinned;
            notification.isPinned = isPinned;
            notification.isRead = true;
        }
        else {
            response = this.createResponse(null, 404);
        }
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(response.body);
    };
    NotificationEndpoint.prototype.getReadUnreadNotificationEndpoint = function (notificationIds, isRead) {
        var _loop_1 = function (notificationId) {
            var notification = this_1.demoNotifications.find(function (val) { return val.id == notificationId; });
            if (notification) {
                notification.isRead = isRead;
            }
        };
        var this_1 = this;
        for (var _i = 0, notificationIds_1 = notificationIds; _i < notificationIds_1.length; _i++) {
            var notificationId = notificationIds_1[_i];
            _loop_1(notificationId);
        }
        var response = this.createResponse(null, 204);
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(response.body);
    };
    NotificationEndpoint.prototype.getDeleteNotificationEndpoint = function (notificationId) {
        var notification = this.demoNotifications.find(function (val) { return val.id == notificationId; });
        var response;
        if (notification) {
            this.demoNotifications = this.demoNotifications.filter(function (val) { return val.id != notificationId; });
            response = this.createResponse(notification, 200);
        }
        else {
            response = this.createResponse(null, 404);
        }
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(response.body);
    };
    NotificationEndpoint.prototype.createResponse = function (body, status) {
        return new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpResponse"]({ body: body, status: status });
    };
    NotificationEndpoint = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])()
    ], NotificationEndpoint);
    return NotificationEndpoint;
}());



/***/ }),

/***/ "./src/app/services/notification.service.ts":
/*!**************************************************!*\
  !*** ./src/app/services/notification.service.ts ***!
  \**************************************************/
/*! exports provided: NotificationService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NotificationService", function() { return NotificationService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./auth.service */ "./src/app/services/auth.service.ts");
/* harmony import */ var _notification_endpoint_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./notification-endpoint.service */ "./src/app/services/notification-endpoint.service.ts");
/* harmony import */ var _models_notification_model__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../models/notification.model */ "./src/app/models/notification.model.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var NotificationService = /** @class */ (function () {
    function NotificationService(notificationEndpoint, authService) {
        this.notificationEndpoint = notificationEndpoint;
        this.authService = authService;
    }
    Object.defineProperty(NotificationService.prototype, "recentNotifications", {
        get: function () {
            return this._recentNotifications;
        },
        set: function (notifications) {
            this._recentNotifications = notifications;
        },
        enumerable: true,
        configurable: true
    });
    NotificationService.prototype.getNotification = function (notificationId) {
        return this.notificationEndpoint.getNotificationEndpoint(notificationId).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (response) { return _models_notification_model__WEBPACK_IMPORTED_MODULE_5__["Notification"].Create(response); }));
    };
    NotificationService.prototype.getNotifications = function (page, pageSize) {
        var _this = this;
        return this.notificationEndpoint.getNotificationsEndpoint(page, pageSize).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (response) {
            return _this.getNotificationsFromResponse(response);
        }));
    };
    NotificationService.prototype.getUnreadNotifications = function (userId) {
        var _this = this;
        return this.notificationEndpoint.getUnreadNotificationsEndpoint(userId).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (response) { return _this.getNotificationsFromResponse(response); }));
    };
    NotificationService.prototype.getNewNotifications = function () {
        var _this = this;
        return this.notificationEndpoint.getNewNotificationsEndpoint(this.lastNotificationDate).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (response) { return _this.processNewNotificationsFromResponse(response); }));
    };
    NotificationService.prototype.getNewNotificationsPeriodically = function () {
        var _this = this;
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["interval"])(10000).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["startWith"])(0), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["flatMap"])(function () {
            return _this.notificationEndpoint.getNewNotificationsEndpoint(_this.lastNotificationDate).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (response) { return _this.processNewNotificationsFromResponse(response); }));
        }));
    };
    NotificationService.prototype.pinUnpinNotification = function (notificationOrNotificationId, isPinned) {
        if (typeof notificationOrNotificationId === 'number' || notificationOrNotificationId instanceof Number) {
            return this.notificationEndpoint.getPinUnpinNotificationEndpoint(notificationOrNotificationId, isPinned);
        }
        else {
            return this.pinUnpinNotification(notificationOrNotificationId.id);
        }
    };
    NotificationService.prototype.readUnreadNotification = function (notificationIds, isRead) {
        return this.notificationEndpoint.getReadUnreadNotificationEndpoint(notificationIds, isRead);
    };
    NotificationService.prototype.deleteNotification = function (notificationOrNotificationId) {
        var _this = this;
        if (typeof notificationOrNotificationId === 'number' || notificationOrNotificationId instanceof Number) {
            return this.notificationEndpoint.getDeleteNotificationEndpoint(notificationOrNotificationId).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (response) {
                _this.recentNotifications = _this.recentNotifications.filter(function (n) { return n.id != notificationOrNotificationId; });
                return _models_notification_model__WEBPACK_IMPORTED_MODULE_5__["Notification"].Create(response);
            }));
        }
        else {
            return this.deleteNotification(notificationOrNotificationId.id);
        }
    };
    NotificationService.prototype.processNewNotificationsFromResponse = function (response) {
        var notifications = this.getNotificationsFromResponse(response);
        for (var _i = 0, notifications_1 = notifications; _i < notifications_1.length; _i++) {
            var n = notifications_1[_i];
            if (n.date > this.lastNotificationDate)
                this.lastNotificationDate = n.date;
        }
        return notifications;
    };
    NotificationService.prototype.getNotificationsFromResponse = function (response) {
        var notifications = [];
        for (var i in response) {
            notifications[i] = _models_notification_model__WEBPACK_IMPORTED_MODULE_5__["Notification"].Create(response[i]);
        }
        notifications.sort(function (a, b) { return b.date.valueOf() - a.date.valueOf(); });
        notifications.sort(function (a, b) { return (a.isPinned === b.isPinned) ? 0 : a.isPinned ? -1 : 1; });
        this.recentNotifications = notifications;
        return notifications;
    };
    Object.defineProperty(NotificationService.prototype, "currentUser", {
        get: function () {
            return this.authService.currentUser;
        },
        enumerable: true,
        configurable: true
    });
    NotificationService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_notification_endpoint_service__WEBPACK_IMPORTED_MODULE_4__["NotificationEndpoint"], _auth_service__WEBPACK_IMPORTED_MODULE_3__["AuthService"]])
    ], NotificationService);
    return NotificationService;
}());



/***/ }),

/***/ "./src/app/services/payment-service-endpoint.service.ts":
/*!**************************************************************!*\
  !*** ./src/app/services/payment-service-endpoint.service.ts ***!
  \**************************************************************/
/*! exports provided: PaymentServiceEndpoint */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PaymentServiceEndpoint", function() { return PaymentServiceEndpoint; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _endpoint_factory_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./endpoint-factory.service */ "./src/app/services/endpoint-factory.service.ts");
/* harmony import */ var _configuration_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./configuration.service */ "./src/app/services/configuration.service.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var PaymentServiceEndpoint = /** @class */ (function (_super) {
    __extends(PaymentServiceEndpoint, _super);
    function PaymentServiceEndpoint(http, configurations, injector) {
        var _this = _super.call(this, http, configurations, injector) || this;
        _this.baseUrlPayment = "/api/payment";
        _this._autopayUrl = "/api/payment/auto";
        return _this;
    }
    Object.defineProperty(PaymentServiceEndpoint.prototype, "getPaymentUrl", {
        get: function () { return this.configurations.baseUrl + this.baseUrlPayment; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaymentServiceEndpoint.prototype, "autopayUrl", {
        get: function () { return this.configurations.baseUrl + this._autopayUrl; },
        enumerable: true,
        configurable: true
    });
    PaymentServiceEndpoint.prototype.getPaymentEndpoint = function (paymentMethodId) {
        var _this = this;
        var endpointUrl = this.getPaymentUrl + "/" + paymentMethodId;
        return this.http
            .get(endpointUrl, this.getRequestHeaders())
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    PaymentServiceEndpoint.prototype.getPaymentsEndpoint = function () {
        var _this = this;
        var endpointUrl = this.getPaymentUrl + "/list";
        return this.http
            .get(endpointUrl, this.getRequestHeaders())
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    PaymentServiceEndpoint.prototype.savePaymentMethod = function (paymentMethod) {
        var _this = this;
        return this.http
            .put(this.autopayUrl, JSON.stringify(paymentMethod), this.getRequestHeaders())
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    PaymentServiceEndpoint.prototype.savePaymentProfile = function (paymentProfile) {
        var _this = this;
        return this.http
            .put(this.getPaymentUrl, JSON.stringify(paymentProfile), this.getRequestHeaders())
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    PaymentServiceEndpoint.prototype.deletePaymentProfile = function (paymentMethodId) {
        var _this = this;
        var endpointUrl = this.getPaymentUrl + "/" + paymentMethodId;
        return this.http
            .delete(endpointUrl, this.getRequestHeaders())
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    PaymentServiceEndpoint.prototype.submitPayment = function (paymentMethodId, invoiceNumbers, PaymentAmount) {
        var _this = this;
        var endpointUrl = this.getPaymentUrl + "/pay/" + paymentMethodId;
        return this.http
            .post(endpointUrl, JSON.stringify({ invoices: invoiceNumbers, PaymentAmount: PaymentAmount }), this.getRequestHeaders())
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    PaymentServiceEndpoint = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"], _configuration_service__WEBPACK_IMPORTED_MODULE_4__["ConfigurationService"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injector"]])
    ], PaymentServiceEndpoint);
    return PaymentServiceEndpoint;
}(_endpoint_factory_service__WEBPACK_IMPORTED_MODULE_3__["EndpointFactory"]));



/***/ }),

/***/ "./src/app/services/payment.service.ts":
/*!*********************************************!*\
  !*** ./src/app/services/payment.service.ts ***!
  \*********************************************/
/*! exports provided: PaymentService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PaymentService", function() { return PaymentService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _payment_service_endpoint_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./payment-service-endpoint.service */ "./src/app/services/payment-service-endpoint.service.ts");
/* harmony import */ var _auth_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./auth.service */ "./src/app/services/auth.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var PaymentService = /** @class */ (function () {
    function PaymentService(router, http, authService, paymentServiceEndpoint) {
        this.router = router;
        this.http = http;
        this.authService = authService;
        this.paymentServiceEndpoint = paymentServiceEndpoint;
    }
    PaymentService.prototype.getPaymentMethod = function (id) {
        return this.paymentServiceEndpoint.getPaymentEndpoint(id);
    };
    PaymentService.prototype.getPaymentMethods = function () {
        return this.paymentServiceEndpoint.getPaymentsEndpoint();
    };
    PaymentService.prototype.savePaymentMethod = function (paymentMethod) {
        return this.paymentServiceEndpoint.savePaymentMethod(paymentMethod);
    };
    PaymentService.prototype.savePaymentProfile = function (paymentProfile) {
        return this.paymentServiceEndpoint.savePaymentProfile(paymentProfile);
    };
    PaymentService.prototype.deletePaymentProfile = function (id) {
        return this.paymentServiceEndpoint.deletePaymentProfile(id);
    };
    PaymentService.prototype.submitPayment = function (paymentMethodId, invoiceNumbers, paymentAmount) {
        return this.paymentServiceEndpoint.submitPayment(paymentMethodId, invoiceNumbers, paymentAmount);
    };
    PaymentService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"], _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"], _auth_service__WEBPACK_IMPORTED_MODULE_4__["AuthService"],
            _payment_service_endpoint_service__WEBPACK_IMPORTED_MODULE_3__["PaymentServiceEndpoint"]])
    ], PaymentService);
    return PaymentService;
}());



/***/ }),

/***/ "./src/app/services/utilities.ts":
/*!***************************************!*\
  !*** ./src/app/services/utilities.ts ***!
  \***************************************/
/*! exports provided: Utilities */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Utilities", function() { return Utilities; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var Utilities = /** @class */ (function () {
    function Utilities() {
    }
    Utilities_1 = Utilities;
    Utilities.getHttpErrors = function (response) {
        var result = [];
        if (this.checkNoNetwork(response)) {
            result.push("" + this.noNetworkMessageCaption + this.captionAndMessageSeparator + " " + this.noNetworkMessageDetail);
        }
        else if (this.checkAccessDenied(response)) {
            result.push("" + this.accessDeniedMessageCaption + this.captionAndMessageSeparator + " " + this.accessDeniedMessageDetail);
        }
        var body = this.getResponseBody(response);
        if (body) {
            if ((typeof body === 'object' || body instanceof Object)) {
                for (var key in body) {
                    if (key) {
                        if (body[key] && (body[key] instanceof Array))
                            result.push(body[key]);
                        else
                            result.push("" + body[key]);
                    }
                }
            }
            else if ((typeof body === 'string' || body instanceof String)) {
                result.push("" + body);
            }
        }
        if (result.length == 0) {
            result.push("" + response.status + this.captionAndMessageSeparator + " " + response.statusText);
        }
        return result;
    };
    Utilities.getHttpError = function (response) {
        var result = [];
        if (this.checkNoNetwork(response)) {
            result.push({ 'connection': ["" + this.noNetworkMessageCaption, "" + this.noNetworkMessageDetail] });
        }
        else if (this.checkAccessDenied(response)) {
            result.push({ 'connection': ["" + this.accessDeniedMessageCaption, "" + this.accessDeniedMessageDetail] });
        }
        var body = this.getResponseBody(response);
        if (body && (typeof body === 'object' || body instanceof Object)) {
            for (var key in body) {
                if (key) {
                    if (body[key] && (body[key] instanceof Array))
                        result.push((_a = {}, _a["" + key] = body[key], _a));
                    else
                        result.push((_b = {}, _b["" + key] = ["" + body[key]], _b));
                }
            }
        }
        if (result.length == 0) {
            result.push({ 'responseCode': ["" + response.status, "" + response.statusText] });
        }
        return result;
        var _a, _b;
    };
    Utilities.getHttpResponseMessage = function (data) {
        var responses = [];
        if (data instanceof _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpResponseBase"]) {
            if (this.checkNoNetwork(data)) {
                responses.push("" + this.noNetworkMessageCaption + this.captionAndMessageSeparator + " " + this.noNetworkMessageDetail);
            }
            else {
                var responseObject = this.getResponseBody(data);
                if (responseObject && (typeof responseObject === 'object' || responseObject instanceof Object)) {
                    for (var key in responseObject) {
                        if (key) {
                            responses.push("" + key + this.captionAndMessageSeparator + " " + responseObject[key]);
                        }
                        else if (responseObject[key]) {
                            responses.push(responseObject[key].toString());
                        }
                    }
                }
            }
            if (!responses.length && this.getResponseBody(data)) {
                responses.push(data.statusText + ": " + this.getResponseBody(data).toString());
            }
        }
        if (!responses.length) {
            responses.push(data.toString());
        }
        if (this.checkAccessDenied(data)) {
            responses.splice(0, 0, "" + this.accessDeniedMessageCaption + this.captionAndMessageSeparator + " " + this.accessDeniedMessageDetail);
        }
        return responses;
    };
    Utilities.findHttpResponseMessage = function (messageToFind, data, seachInCaptionOnly, includeCaptionInResult) {
        if (seachInCaptionOnly === void 0) { seachInCaptionOnly = true; }
        if (includeCaptionInResult === void 0) { includeCaptionInResult = false; }
        var searchString = messageToFind.toLowerCase();
        var httpMessages = this.getHttpResponseMessage(data);
        for (var _i = 0, httpMessages_1 = httpMessages; _i < httpMessages_1.length; _i++) {
            var message = httpMessages_1[_i];
            var fullMessage = Utilities_1.splitInTwo(message, this.captionAndMessageSeparator);
            if (fullMessage.firstPart && fullMessage.firstPart.toLowerCase().indexOf(searchString) != -1) {
                return includeCaptionInResult ? message : fullMessage.secondPart || fullMessage.firstPart;
            }
        }
        if (!seachInCaptionOnly) {
            for (var _a = 0, httpMessages_2 = httpMessages; _a < httpMessages_2.length; _a++) {
                var message = httpMessages_2[_a];
                if (message.toLowerCase().indexOf(searchString) != -1) {
                    if (includeCaptionInResult) {
                        return message;
                    }
                    else {
                        var fullMessage = Utilities_1.splitInTwo(message, this.captionAndMessageSeparator);
                        return fullMessage.secondPart || fullMessage.firstPart;
                    }
                }
            }
        }
        return null;
    };
    Utilities.getResponseBody = function (response) {
        if (response instanceof _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpResponse"]) {
            return response.body;
        }
        if (response instanceof _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpErrorResponse"]) {
            return response.error || response.message || response.statusText;
        }
    };
    Utilities.checkNoNetwork = function (response) {
        if (response instanceof _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpResponseBase"]) {
            return response.status == 0;
        }
        return false;
    };
    Utilities.checkAccessDenied = function (response) {
        if (response instanceof _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpResponseBase"]) {
            return response.status == 403;
        }
        return false;
    };
    Utilities.checkNotFound = function (response) {
        if (response instanceof _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpResponseBase"]) {
            return response.status == 404;
        }
        return false;
    };
    Utilities.checkIsLocalHost = function (url, base) {
        if (url) {
            var location_1 = new URL(url, base);
            return location_1.hostname === 'localhost' || location_1.hostname === '127.0.0.1';
        }
        return false;
    };
    Utilities.getQueryParamsFromString = function (paramString) {
        if (!paramString) {
            return null;
        }
        var params = {};
        for (var _i = 0, _a = paramString.split('&'); _i < _a.length; _i++) {
            var param = _a[_i];
            var keyValue = Utilities_1.splitInTwo(param, '=');
            params[keyValue.firstPart] = keyValue.secondPart;
        }
        return params;
    };
    Utilities.splitInTwo = function (text, separator) {
        var separatorIndex = text.indexOf(separator);
        if (separatorIndex == -1) {
            return { firstPart: text, secondPart: null };
        }
        var part1 = text.substr(0, separatorIndex).trim();
        var part2 = text.substr(separatorIndex + 1).trim();
        return { firstPart: part1, secondPart: part2 };
    };
    Utilities.safeStringify = function (object) {
        var result;
        try {
            result = JSON.stringify(object);
            return result;
        }
        catch (error) {
        }
        var simpleObject = {};
        for (var prop in object) {
            if (!object.hasOwnProperty(prop)) {
                continue;
            }
            if (typeof (object[prop]) == 'object') {
                continue;
            }
            if (typeof (object[prop]) == 'function') {
                continue;
            }
            simpleObject[prop] = object[prop];
        }
        result = '[***Sanitized Object***]: ' + JSON.stringify(simpleObject);
        return result;
    };
    Utilities.JSonTryParse = function (value) {
        try {
            return JSON.parse(value);
        }
        catch (e) {
            if (value === 'undefined') {
                return void 0;
            }
            return value;
        }
    };
    Utilities.TestIsObjectEmpty = function (obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                return false;
            }
        }
        return true;
    };
    Utilities.TestIsUndefined = function (value) {
        return typeof value === 'undefined';
        //return value === undefined;
    };
    Utilities.TestIsString = function (value) {
        return typeof value === 'string' || value instanceof String;
    };
    Utilities.capitalizeFirstLetter = function (text) {
        if (text) {
            return text.charAt(0).toUpperCase() + text.slice(1);
        }
        else {
            return text;
        }
    };
    Utilities.toTitleCase = function (text) {
        return text.replace(/\w\S*/g, function (subString) {
            return subString.charAt(0).toUpperCase() + subString.substr(1).toLowerCase();
        });
    };
    Utilities.toLowerCase = function (items) {
        if (items instanceof Array) {
            var loweredRoles = [];
            for (var i = 0; i < items.length; i++) {
                loweredRoles[i] = items[i].toLowerCase();
            }
            return loweredRoles;
        }
        else if (typeof items === 'string' || items instanceof String) {
            return items.toLowerCase();
        }
    };
    Utilities.uniqueId = function () {
        return this.randomNumber(1000000, 9000000).toString();
    };
    Utilities.randomNumber = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    Utilities.baseUrl = function () {
        var base = '';
        if (window.location.origin) {
            base = window.location.origin;
        }
        else {
            base = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
        }
        return base.replace(/\/$/, '');
    };
    Utilities.printDateOnly = function (date) {
        date = new Date(date);
        var dayNames = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
        var monthNames = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
        var dayOfWeek = date.getDay();
        var dayOfMonth = date.getDate();
        var sup = '';
        var month = date.getMonth();
        var year = date.getFullYear();
        if (dayOfMonth == 1 || dayOfMonth == 21 || dayOfMonth == 31) {
            sup = 'st';
        }
        else if (dayOfMonth == 2 || dayOfMonth == 22) {
            sup = 'nd';
        }
        else if (dayOfMonth == 3 || dayOfMonth == 23) {
            sup = 'rd';
        }
        else {
            sup = 'th';
        }
        var dateString = dayNames[dayOfWeek] + ', ' + dayOfMonth + sup + ' ' + monthNames[month] + ' ' + year;
        return dateString;
    };
    Utilities.printTimeOnly = function (date) {
        date = new Date(date);
        var period = '';
        var minute = date.getMinutes().toString();
        var hour = date.getHours();
        period = hour < 12 ? 'AM' : 'PM';
        if (hour == 0) {
            hour = 12;
        }
        if (hour > 12) {
            hour = hour - 12;
        }
        if (minute.length == 1) {
            minute = '0' + minute;
        }
        var timeString = hour + ':' + minute + ' ' + period;
        return timeString;
    };
    Utilities.printDate = function (date, separator) {
        if (separator === void 0) { separator = 'at'; }
        return Utilities_1.printDateOnly(date) + " " + separator + " " + Utilities_1.printTimeOnly(date);
    };
    Utilities.printFriendlyDate = function (date, separator) {
        if (separator === void 0) { separator = '-'; }
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        var yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        var test = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        if (test.toDateString() == today.toDateString()) {
            return "Today " + separator + " " + Utilities_1.printTimeOnly(date);
        }
        if (test.toDateString() == yesterday.toDateString()) {
            return "Yesterday " + separator + " " + Utilities_1.printTimeOnly(date);
        }
        else {
            return Utilities_1.printDate(date, separator);
        }
    };
    Utilities.printShortDate = function (date, separator, dateTimeSeparator) {
        if (separator === void 0) { separator = '/'; }
        if (dateTimeSeparator === void 0) { dateTimeSeparator = '-'; }
        var day = date.getDate().toString();
        var month = (date.getMonth() + 1).toString();
        var year = date.getFullYear();
        if (day.length == 1) {
            day = '0' + day;
        }
        if (month.length == 1) {
            month = '0' + month;
        }
        return "" + month + separator + day + separator + year + " " + dateTimeSeparator + " " + Utilities_1.printTimeOnly(date);
    };
    Utilities.parseDate = function (date) {
        if (date) {
            if (date instanceof Date) {
                return date;
            }
            if (typeof date === 'string' || date instanceof String) {
                if (date.search(/[a-su-z+]/i) == -1) {
                    date = date + 'Z';
                }
                return new Date(date);
            }
            if (typeof date === 'number' || date instanceof Number) {
                return new Date(date);
            }
        }
    };
    Utilities.printDuration = function (start, end) {
        start = new Date(start);
        end = new Date(end);
        // get total seconds between the times
        var delta = Math.abs(start.valueOf() - end.valueOf()) / 1000;
        // calculate (and subtract) whole days
        var days = Math.floor(delta / 86400);
        delta -= days * 86400;
        // calculate (and subtract) whole hours
        var hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;
        // calculate (and subtract) whole minutes
        var minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;
        // what's left is seconds
        var seconds = delta % 60; // in theory the modulus is not required
        var printedDays = '';
        if (days) {
            printedDays = days + " days";
        }
        if (hours) {
            printedDays += printedDays ? ", " + hours + " hours" : hours + " hours";
        }
        if (minutes) {
            printedDays += printedDays ? ", " + minutes + " minutes" : minutes + " minutes";
        }
        if (seconds) {
            printedDays += printedDays ? " and " + seconds + " seconds" : seconds + " seconds";
        }
        if (!printedDays) {
            printedDays = '0';
        }
        return printedDays;
    };
    Utilities.getAge = function (birthDate, otherDate) {
        birthDate = new Date(birthDate);
        otherDate = new Date(otherDate);
        var years = (otherDate.getFullYear() - birthDate.getFullYear());
        if (otherDate.getMonth() < birthDate.getMonth() ||
            otherDate.getMonth() == birthDate.getMonth() && otherDate.getDate() < birthDate.getDate()) {
            years--;
        }
        return years;
    };
    Utilities.searchArray = function (searchTerm, caseSensitive) {
        var values = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            values[_i - 2] = arguments[_i];
        }
        if (!searchTerm) {
            return true;
        }
        if (!caseSensitive) {
            searchTerm = searchTerm.toLowerCase();
        }
        for (var _a = 0, values_1 = values; _a < values_1.length; _a++) {
            var value = values_1[_a];
            if (value != null) {
                var strValue = value.toString();
                if (!caseSensitive) {
                    strValue = strValue.toLowerCase();
                }
                if (strValue.indexOf(searchTerm) !== -1) {
                    return true;
                }
            }
        }
        return false;
    };
    Utilities.moveArrayItem = function (array, oldIndex, newIndex) {
        while (oldIndex < 0) {
            oldIndex += this.length;
        }
        while (newIndex < 0) {
            newIndex += this.length;
        }
        if (newIndex >= this.length) {
            var k = newIndex - this.length;
            while ((k--) + 1) {
                array.push(undefined);
            }
        }
        array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
    };
    Utilities.expandCamelCase = function (text) {
        if (!text) {
            return text;
        }
        return text.replace(/([A-Z][a-z]+)/g, ' $1')
            .replace(/([A-Z][A-Z]+)/g, ' $1')
            .replace(/([^A-Za-z ]+)/g, ' $1');
    };
    Utilities.testIsAbsoluteUrl = function (url) {
        var r = new RegExp('^(?:[a-z]+:)?//', 'i');
        return r.test(url);
    };
    Utilities.convertToAbsoluteUrl = function (url) {
        return Utilities_1.testIsAbsoluteUrl(url) ? url : '//' + url;
    };
    Utilities.removeNulls = function (obj) {
        var isArray = obj instanceof Array;
        for (var k in obj) {
            if (obj[k] === null) {
                isArray ? obj.splice(k, 1) : delete obj[k];
            }
            else if (typeof obj[k] == 'object') {
                Utilities_1.removeNulls(obj[k]);
            }
            if (isArray && obj.length == k) {
                Utilities_1.removeNulls(obj);
            }
        }
        return obj;
    };
    Utilities.debounce = function (func, wait, immediate) {
        var timeout;
        return function () {
            var context = this;
            var args_ = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args_);
                }
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) {
                func.apply(context, args_);
            }
        };
    };
    Utilities.captionAndMessageSeparator = ':';
    Utilities.noNetworkMessageCaption = 'No Network';
    Utilities.noNetworkMessageDetail = 'The server cannot be reached';
    Utilities.accessDeniedMessageCaption = 'Access Denied!';
    Utilities.accessDeniedMessageDetail = '';
    Utilities.cookies = {
        getItem: function (sKey) {
            return decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
        },
        setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
            if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
                return false;
            }
            var sExpires = '';
            if (vEnd) {
                switch (vEnd.constructor) {
                    case Number:
                        sExpires = vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + vEnd;
                        break;
                    case String:
                        sExpires = '; expires=' + vEnd;
                        break;
                    case Date:
                        sExpires = '; expires=' + vEnd.toUTCString();
                        break;
                }
            }
            document.cookie = encodeURIComponent(sKey) + '=' + encodeURIComponent(sValue) + sExpires + (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '') + (bSecure ? '; secure' : '');
            return true;
        },
        removeItem: function (sKey, sPath, sDomain) {
            if (!sKey) {
                return false;
            }
            document.cookie = encodeURIComponent(sKey) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' + (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '');
            return true;
        },
        hasItem: function (sKey) {
            return (new RegExp('(?:^|;\\s*)' + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test(document.cookie);
        },
        keys: function () {
            var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '').split(/\s*(?:\=[^;]*)?;\s*/);
            for (var nIdx = 0; nIdx < aKeys.length; nIdx++) {
                aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
            }
            return aKeys;
        }
    };
    Utilities = Utilities_1 = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])()
    ], Utilities);
    return Utilities;
    var Utilities_1;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false,
    baseUrl: null,
    loginUrl: "/Login"
};
/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! exports provided: getBaseUrl */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getBaseUrl", function() { return getBaseUrl; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




function getBaseUrl() {
    return document.getElementsByTagName('base')[0].href;
}
var providers = [
    { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }
];
if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])(providers).bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! D:\WorkPlace\Projects\Client\ScentAir\ScentAirPaymentCustomerPortalGIT-APR\src\Portal\ClientApp\src\main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map