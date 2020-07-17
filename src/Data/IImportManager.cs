using System.Threading.Tasks;

namespace ScentAir.Payment
{
    public interface IImportManager
    {
        void Import(string accountNumber);

        string InvoiceNotificationEmailContent { get; set; }
    }
}