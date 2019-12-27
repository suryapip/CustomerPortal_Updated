using MimeKit;
using System.Threading.Tasks;

namespace ScentAir.Payment
{
    public interface IEmailSender
    {
        Task<ITaskResult> SendEmailAsync(MailboxAddress sender, MailboxAddress[] recepients, string subject, string body, SmtpConfig config = null, bool isHtml = true);
        Task<ITaskResult> SendEmailAsync(string recepientName, string recepientEmail, string subject, string body, SmtpConfig config = null, bool isHtml = true);
        Task<ITaskResult> SendEmailAsync(string senderName, string senderEmail, string recepientName, string recepientEmail, string subject, string body, SmtpConfig config = null, bool isHtml = true);
    }
}
