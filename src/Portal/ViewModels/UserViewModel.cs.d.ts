declare module server {
	interface userViewModel {
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
		q1: string;
		a1: string;
		q2: string;
		a2: string;
		roles: string[];
		accountNumber: string;
	}
}
