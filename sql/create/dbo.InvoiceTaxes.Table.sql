USE [Portal]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[InvoiceTaxes]') AND type in (N'U'))
ALTER TABLE [dbo].[InvoiceTaxes] DROP CONSTRAINT IF EXISTS [FK_InvoiceTaxes_Invoices_InvoiceNumber]
GO
/****** Object:  Index [IX_InvoiceTaxes_InvoiceNumber]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_InvoiceTaxes_InvoiceNumber] ON [dbo].[InvoiceTaxes]
GO
/****** Object:  Table [dbo].[InvoiceTaxes]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP TABLE IF EXISTS [dbo].[InvoiceTaxes]
GO
/****** Object:  Table [dbo].[InvoiceTaxes]    Script Date: 3/5/2020 5:08:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[InvoiceTaxes](
	[CreatedBy] [nvarchar](256) NOT NULL,
	[CreatedOn] [datetimeoffset](7) NOT NULL,
	[ModifiedBy] [nvarchar](256) NULL,
	[ModifiedOn] [datetimeoffset](7) NULL,
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[InvoiceNumber] [nvarchar](20) NOT NULL,
	[TaxAmount] [decimal](18, 2) NOT NULL,
	[TaxDesc] [nvarchar](max) NOT NULL,
	[BPR] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_InvoiceTaxes] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_InvoiceTaxes_InvoiceNumber]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE NONCLUSTERED INDEX [IX_InvoiceTaxes_InvoiceNumber] ON [dbo].[InvoiceTaxes]
(
	[InvoiceNumber] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[InvoiceTaxes]  WITH CHECK ADD  CONSTRAINT [FK_InvoiceTaxes_Invoices_InvoiceNumber] FOREIGN KEY([InvoiceNumber])
REFERENCES [dbo].[Invoices] ([InvoiceNumber])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[InvoiceTaxes] CHECK CONSTRAINT [FK_InvoiceTaxes_Invoices_InvoiceNumber]
GO
