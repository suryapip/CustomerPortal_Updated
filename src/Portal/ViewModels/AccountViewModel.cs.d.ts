declare module server {
	interface accountViewModel {
		number: string;
		pin: string;
		name: string;
		email: string;
		phoneNumber: string;
		address: {
			line1: string;
			line2: string;
			municipality: string;
			stateOrProvince: string;
			postalCode: string;
			country: string;
		};
		invoices: any[];
	}
}
