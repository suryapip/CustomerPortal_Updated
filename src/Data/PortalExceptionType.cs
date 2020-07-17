namespace ScentAir.Payment
{
    public enum PortalExceptionType : int
    {
        Chase_SaveProfile,
        Chase_UnsupportedCurrency,
        Entity_Save,
        Entity_Missing,
        CreditCard_Expired,
        Chase_SubmitPayment
    }
}