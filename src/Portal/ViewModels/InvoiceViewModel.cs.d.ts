declare module server {
	interface invoiceViewModel {
		billingEntity: {
			bank: string;
			accountNumber: string;
			routingNumber: string;
			currency: string;
			mailingAddress: {
				line1: string;
				line2: string;
				municipality: string;
				stateOrProvince: string;
				postalCode: string;
				country: string;
			};
			billingAddress: {
				line1: string;
				line2: string;
				municipality: string;
				stateOrProvince: string;
				postalCode: string;
				country: string;
			};
			shippingAddress: {
				line1: string;
				line2: string;
				municipality: string;
				stateOrProvince: string;
				postalCode: string;
				country: string;
			};
		};
		shippingAddress: {
			line1: string;
			line2: string;
			municipality: string;
			stateOrProvince: string;
			postalCode: string;
			country: string;
		};
		shippingNumber: string;
		shippingMethod: string;
		shippingResult: string;
		taxId: string;
		invoiceNumber: string;
		customerReferenceNumber: string;
		customerPurchaseOrderNumber: string;
		status: string;
		paymentTerms: string;
		currency: string;
		discountAmount: number;
		subTotalAmount: number;
		taxRate: number;
		taxAmount: number;
		totalAmount: number;
		totalAmountPaid: number;
		serviceFrom?: Date;
		serviceTo?: Date;
		comments: string;
		details: any[];
		payments: any[];
	}
}
