declare module server {
	interface userEditViewModel extends UserViewModel {
		currentPassword: string;
		newPassword: string;
	}
}
