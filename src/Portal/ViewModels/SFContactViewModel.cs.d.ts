declare module server {
    interface sfContactViewModel {
        id: number;
        accountNumber: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        mainContact : boolean;
        billingContact: boolean;
        shippingContact: boolean;
        serviceContact: boolean;
        propertyContact: boolean;
        installationContact: boolean;
        marketingContact: boolean;
        doNotCall: boolean;
        doNotEmail: boolean;
        active: boolean;
    }
}
