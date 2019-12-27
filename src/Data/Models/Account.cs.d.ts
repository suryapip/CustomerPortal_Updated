declare module server {
	interface account extends AuditableEntity {
		number: string;
		pin: string;
		name: string;
		email: string;
		phoneNumber: string;
		faxNumber: string;
		currency: string;
		physicalAddress: {
			id: any;
			line1: string;
			line2: string;
			line3: string;
			municipality: string;
			stateOrProvince: string;
			postalCode: string;
			country: string;
		};
		mailingAddress: {
			id: any;
			line1: string;
			line2: string;
			line3: string;
			municipality: string;
			stateOrProvince: string;
			postalCode: string;
			country: string;
		};
		billingAddress: {
			id: any;
			line1: string;
			line2: string;
			line3: string;
			municipality: string;
			stateOrProvince: string;
			postalCode: string;
			country: string;
		};
		shippingAddress: {
			id: any;
			line1: string;
			line2: string;
			line3: string;
			municipality: string;
			stateOrProvince: string;
			postalCode: string;
			country: string;
		};
		salesPerson: string;
		accountRepresentative: string;
		externalRowVersion: any[];
		company: {
			number: string;
			name: string;
			email: string;
			phoneNumber: string;
			faxNumber: string;
			wireName: string;
			bank: string;
			branch: string;
			accountNumber: string;
			routingNumber: string;
			currency: string;
			physicalAddress: {
				id: any;
				line1: string;
				line2: string;
				line3: string;
				municipality: string;
				stateOrProvince: string;
				postalCode: string;
				country: string;
			};
			mailingAddress: {
				id: any;
				line1: string;
				line2: string;
				line3: string;
				municipality: string;
				stateOrProvince: string;
				postalCode: string;
				country: string;
			};
			billingAddress: {
				id: any;
				line1: string;
				line2: string;
				line3: string;
				municipality: string;
				stateOrProvince: string;
				postalCode: string;
				country: string;
			};
			shippingAddress: {
				id: any;
				line1: string;
				line2: string;
				line3: string;
				municipality: string;
				stateOrProvince: string;
				postalCode: string;
				country: string;
			};
			externalRowVersion: any[];
			users: any[];
			accounts: server.Account[];
		};
		invoicesAsReceiver: any[];
		invoicesAsPayor: any[];
		paymentMethods: any[];
	}
}
