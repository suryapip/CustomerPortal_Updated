
export class InvoicePayment {

  public id: string;
  public amount: number;
  public status: string;
  public checkNumber: string;
  public referenceNumber: string;
  public result: string;
  public DateAuthorized: Date;
  public DateScheduled: Date;

  public getPaymentStatusDesc() {
    if (status == '0') { return 'Pending'; }
    if (status == '1') { return 'Processing'; }
    if (status == '2') { return 'Paid'; }
    if (status == '3') { return 'Failed'; }
    return '';
  }

}
