"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var address_model_1 = require("./address.model");
var SFAccountSettings = /** @class */ (function () {
    function SFAccountSettings() {
        this.billingAddress = new address_model_1.Address();
        this.shippingAddress = new address_model_1.Address();
    }
    return SFAccountSettings;
}());
exports.SFAccountSettings = SFAccountSettings;
//# sourceMappingURL=sf-account-settings.model.js.map