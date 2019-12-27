using MailKit.Net.Smtp;
using MimeKit;
using System;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using System.Security.Cryptography.X509Certificates;
using System.Net.Security;
using Microsoft.Extensions.Options;
using System.Net.Sockets;
using MailKit;
using System.IO;
using ScentAir.Payment.Impl;

namespace ScentAir.Payment.Helpers
{



    public class EmailSender : IEmailSender
    {
        private readonly SmtpConfig config;
        private readonly ILogger logger;

        public EmailSender(IOptions<SmtpConfig> config)
        {
            this.config = config.Value;
            this.logger = Utilities.CreateLogger<EmailSender>();
        }


        public async Task<ITaskResult> SendEmailAsync(
            string recepientName,
            string recepientEmail,
            string subject,
            string body,
            SmtpConfig config = null,
            bool isHtml = true)
        {
            var from = new MailboxAddress(this.config.Name, this.config.EmailAddress);
            var to = new MailboxAddress(recepientName, recepientEmail);

            return await SendEmailAsync(from, new MailboxAddress[] { to }, subject, body, config, isHtml);
        }



        public async Task<ITaskResult> SendEmailAsync(
            string senderName,
            string senderEmail,
            string recepientName,
            string recepientEmail,
            string subject,
            string body,
            SmtpConfig config = null,
            bool isHtml = true)
        {
            var from = new MailboxAddress(senderName, senderEmail);
            var to = new MailboxAddress(recepientName, recepientEmail);

            return await SendEmailAsync(from, new MailboxAddress[] { to }, subject, body, config, isHtml);
        }



        public async Task<ITaskResult> SendEmailAsync(
            MailboxAddress sender,
            MailboxAddress[] recepients,
            string subject,
            string body,
            SmtpConfig config = null,
            bool isHtml = true)
        {
            var msg = null as string;
            var message = new MimeMessage();

            message.From.Add(sender);
            message.To.AddRange(recepients);
            message.Subject = subject;
            message.Body = isHtml ? new BodyBuilder { HtmlBody = body }.ToMessageBody() : new TextPart("plain") { Text = body };

            try
            {
                if (config == null)
                    config = this.config;

				if (!config.Disabled)
					using (var client = new SmtpClient())
					{
						//if (config.UseSSL)
							client.ServerCertificateValidationCallback = (object sender2, X509Certificate certificate, X509Chain chain, SslPolicyErrors sslPolicyErrors) => true;

						await client.ConnectAsync(config.Host, config.Port, config.UseSSL).ConfigureAwait(false);
						client.AuthenticationMechanisms.Remove("XOAUTH2");

						if (!string.IsNullOrWhiteSpace(config.Username))
							await client.AuthenticateAsync(config.Username, config.Password).ConfigureAwait(false);

						await client.SendAsync(message).ConfigureAwait(false);
						await client.DisconnectAsync(true).ConfigureAwait(false);
					}

                return Impl.TaskResultBuilder.Successful();
            }
            catch (ServiceNotAuthenticatedException ex)
            {
                msg = "Not authenticated for the email server";

                logger.LogWarning(LoggingEvents.SEND_EMAIL, ex.Message, msg);
            }
            catch (ServiceNotConnectedException ex)
            {
                msg = "Could not connect to the email server";

                logger.LogWarning(LoggingEvents.SEND_EMAIL, ex.Message, msg);
            }
            catch (ProtocolException ex)
            {
                msg = "Handshake failed to the email server";

                logger.LogError(LoggingEvents.SEND_EMAIL, ex, "Handshake failed");
            }
            catch (IOException ex)
            {
                msg = "IO failed to email server";

                logger.LogError(LoggingEvents.SEND_EMAIL, ex, msg);
            }
            catch (SocketException ex)
            {
                msg = "Socket failed to email server";

                logger.LogError(LoggingEvents.SEND_EMAIL, ex, msg);
            }
            catch (Exception ex)
            {
                msg = "An error occurred while sending email";
                logger.LogError(LoggingEvents.SEND_EMAIL, ex, msg);
            }
            return new Impl.TaskResultBuilder { { "email", msg } }.Fail();
        }
    }
}
