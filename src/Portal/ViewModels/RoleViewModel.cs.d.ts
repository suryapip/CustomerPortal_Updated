declare module server {
	interface roleViewModel {
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
	}
}
