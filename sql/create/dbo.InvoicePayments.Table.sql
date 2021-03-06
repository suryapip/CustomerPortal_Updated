USE [Portal]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[InvoicePayments]') AND type in (N'U'))
ALTER TABLE [dbo].[InvoicePayments] DROP CONSTRAINT IF EXISTS [FK_InvoicePayments_PaymentMethods_PaymentMethodId]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[InvoicePayments]') AND type in (N'U'))
ALTER TABLE [dbo].[InvoicePayments] DROP CONSTRAINT IF EXISTS [FK_InvoicePayments_Invoices_InvoiceNumber]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[InvoicePayments]') AND type in (N'U'))
ALTER TABLE [dbo].[InvoicePayments] DROP CONSTRAINT IF EXISTS [DF__InvoicePa__IsAcc__7755B73D]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[InvoicePayments]') AND type in (N'U'))
ALTER TABLE [dbo].[InvoicePayments] DROP CONSTRAINT IF EXISTS [DF__InvoicePa__Trans__55F4C372]
GO
/****** Object:  Index [IX_InvoicePayments_Status_DateScheduled_DateAuthorized_DateFinalized]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_InvoicePayments_Status_DateScheduled_DateAuthorized_DateFinalized] ON [dbo].[InvoicePayments]
GO
/****** Object:  Index [IX_InvoicePayments_PaymentMethodId]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_InvoicePayments_PaymentMethodId] ON [dbo].[InvoicePayments]
GO
/****** Object:  Index [IX_InvoicePayments_InvoiceNumber_ReferenceNumber_ConfirmationNumber]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_InvoicePayments_InvoiceNumber_ReferenceNumber_ConfirmationNumber] ON [dbo].[InvoicePayments]
GO
/****** Object:  Index [idx_dbo_InvoicePayments_InvoiceNumber_includes1]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [idx_dbo_InvoicePayments_InvoiceNumber_includes1] ON [dbo].[InvoicePayments]
GO
/****** Object:  Table [dbo].[InvoicePayments]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP TABLE IF EXISTS [dbo].[InvoicePayments]
GO
/****** Object:  Table [dbo].[InvoicePayments]    Script Date: 3/5/2020 5:08:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[InvoicePayments](
	[CreatedBy] [nvarchar](256) NOT NULL,
	[CreatedOn] [datetimeoffset](7) NOT NULL,
	[ModifiedBy] [nvarchar](256) NULL,
	[ModifiedOn] [datetimeoffset](7) NULL,
	[InvoiceNumber] [nvarchar](20) NOT NULL,
	[Amount] [decimal](18, 2) NOT NULL,
	[Status] [int] NOT NULL,
	[CheckNumber] [varchar](8) NULL,
	[ReferenceNumber] [varchar](100) NOT NULL,
	[ConfirmationNumber] [nvarchar](100) NULL,
	[DateAuthorized] [datetimeoffset](7) NULL,
	[DateScheduled] [datetimeoffset](7) NULL,
	[RowVersion] [timestamp] NULL,
	[ApprovalStatus] [varchar](100) NULL,
	[DateFinalized] [datetimeoffset](7) NULL,
	[PaymentMethodId] [uniqueidentifier] NULL,
	[ProcessorStatus] [varchar](100) NULL,
	[TransactionAmount] [decimal](18, 2) NOT NULL,
	[IsAcceptedPayTC] [bit] NOT NULL,
	[ChaseResponse] [nvarchar](max) NULL,
 CONSTRAINT [PK_InvoicePayments] PRIMARY KEY CLUSTERED 
(
	[ReferenceNumber] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [idx_dbo_InvoicePayments_InvoiceNumber_includes1]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE NONCLUSTERED INDEX [idx_dbo_InvoicePayments_InvoiceNumber_includes1] ON [dbo].[InvoicePayments]
(
	[InvoiceNumber] ASC
)
INCLUDE([CreatedBy],[CreatedOn],[ModifiedBy],[ModifiedOn],[Amount],[Status],[CheckNumber],[ConfirmationNumber],[DateAuthorized],[DateScheduled],[RowVersion],[ApprovalStatus],[DateFinalized],[PaymentMethodId],[ProcessorStatus],[TransactionAmount],[IsAcceptedPayTC]) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_InvoicePayments_InvoiceNumber_ReferenceNumber_ConfirmationNumber]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_InvoicePayments_InvoiceNumber_ReferenceNumber_ConfirmationNumber] ON [dbo].[InvoicePayments]
(
	[InvoiceNumber] ASC,
	[ReferenceNumber] ASC,
	[ConfirmationNumber] ASC
)
WHERE ([ConfirmationNumber] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_InvoicePayments_PaymentMethodId]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE NONCLUSTERED INDEX [IX_InvoicePayments_PaymentMethodId] ON [dbo].[InvoicePayments]
(
	[PaymentMethodId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_InvoicePayments_Status_DateScheduled_DateAuthorized_DateFinalized]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE NONCLUSTERED INDEX [IX_InvoicePayments_Status_DateScheduled_DateAuthorized_DateFinalized] ON [dbo].[InvoicePayments]
(
	[Status] ASC,
	[DateScheduled] ASC,
	[DateAuthorized] ASC,
	[DateFinalized] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[InvoicePayments] ADD  DEFAULT ((0.0)) FOR [TransactionAmount]
GO
ALTER TABLE [dbo].[InvoicePayments] ADD  DEFAULT ((0)) FOR [IsAcceptedPayTC]
GO
ALTER TABLE [dbo].[InvoicePayments]  WITH CHECK ADD  CONSTRAINT [FK_InvoicePayments_Invoices_InvoiceNumber] FOREIGN KEY([InvoiceNumber])
REFERENCES [dbo].[Invoices] ([InvoiceNumber])
GO
ALTER TABLE [dbo].[InvoicePayments] CHECK CONSTRAINT [FK_InvoicePayments_Invoices_InvoiceNumber]
GO
ALTER TABLE [dbo].[InvoicePayments]  WITH CHECK ADD  CONSTRAINT [FK_InvoicePayments_PaymentMethods_PaymentMethodId] FOREIGN KEY([PaymentMethodId])
REFERENCES [dbo].[PaymentMethods] ([Id])
GO
ALTER TABLE [dbo].[InvoicePayments] CHECK CONSTRAINT [FK_InvoicePayments_PaymentMethods_PaymentMethodId]
GO
