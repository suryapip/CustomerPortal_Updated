declare module server {
	interface registerViewModel {
		user: server.RegisterUserViewModel;
		account: {
			number: string;
			pin: string;
			name: string;
			email: string;
			phoneNumber: string;
			address: {
				line1: string;
				line2: string;
				line3: string;
				municipality: string;
				stateOrProvince: string;
				postalCode: string;
				country: string;
			};
			invoices: any[];
		};
	}
	interface registerUserViewModel {
		id: string;
		userName: string;
		firstName: string;
		lastName: string;
		name: string;
		normalizedName: string;
		email: string;
		jobTitle: string;
		phoneNumber: string;
		configuration: string;
		isEnabled: boolean;
		isLockedOut: boolean;
		confirmPassword: string;
		newPassword: string;
		q1: string;
		a1: string;
		q2: string;
		a2: string;
		/** public ClaimViewModel[] Claims { get; set; } */
		roles: {
			id: string;
			name: string;
			description: string;
			usersCount: number;
			permissions: {
				name: string;
				value: string;
				groupName: string;
				description: string;
			}[];
		}[];
		accountNumber: string;
	}
}
