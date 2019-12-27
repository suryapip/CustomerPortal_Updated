declare module server {
	interface pagingHeader {
		currentPage: number;
		itemsPerPage: number;
		totalItems: number;
		totalPages: number;
	}
}
