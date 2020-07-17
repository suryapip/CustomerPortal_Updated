declare module server {
	interface auditableEntity {
		createdBy: string;
		createdOn: Date;
		updatedBy: string;
		updatedDate: Date;
	}
}
