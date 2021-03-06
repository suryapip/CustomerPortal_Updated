USE [Portal]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[InvoiceDetails]') AND type in (N'U'))
ALTER TABLE [dbo].[InvoiceDetails] DROP CONSTRAINT IF EXISTS [FK_InvoiceDetails_Invoices_InvoiceNumber]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[InvoiceDetails]') AND type in (N'U'))
ALTER TABLE [dbo].[InvoiceDetails] DROP CONSTRAINT IF EXISTS [DF__InvoiceDe__LineT__22401542]
GO
/****** Object:  Index [IX_InvoiceDetails_ExternalRowVersion]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_InvoiceDetails_ExternalRowVersion] ON [dbo].[InvoiceDetails]
GO
/****** Object:  Index [idx_dbo_InvoiceDetails_LineNumber_includes1]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [idx_dbo_InvoiceDetails_LineNumber_includes1] ON [dbo].[InvoiceDetails]
GO
/****** Object:  Table [dbo].[InvoiceDetails]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP TABLE IF EXISTS [dbo].[InvoiceDetails]
GO
/****** Object:  Table [dbo].[InvoiceDetails]    Script Date: 3/5/2020 5:08:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[InvoiceDetails](
	[CreatedBy] [nvarchar](256) NOT NULL,
	[CreatedOn] [datetimeoffset](7) NOT NULL,
	[ModifiedBy] [nvarchar](256) NULL,
	[ModifiedOn] [datetimeoffset](7) NULL,
	[InvoiceNumber] [nvarchar](20) NOT NULL,
	[LineNumber] [int] NOT NULL,
	[Item] [nvarchar](20) NULL,
	[Description] [nvarchar](30) NULL,
	[UnitPrice] [decimal](18, 2) NOT NULL,
	[UnitDiscount] [decimal](18, 2) NOT NULL,
	[Quantity] [decimal](18, 2) NOT NULL,
	[Discount] [decimal](18, 2) NOT NULL,
	[ExtraAmount] [decimal](18, 2) NOT NULL,
	[ExternalRowVersion] [binary](12) NULL,
	[LineTaxRate] [decimal](18, 2) NOT NULL,
 CONSTRAINT [PK_InvoiceDetails] PRIMARY KEY CLUSTERED 
(
	[InvoiceNumber] ASC,
	[LineNumber] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Index [idx_dbo_InvoiceDetails_LineNumber_includes1]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE NONCLUSTERED INDEX [idx_dbo_InvoiceDetails_LineNumber_includes1] ON [dbo].[InvoiceDetails]
(
	[LineNumber] ASC
)
INCLUDE([CreatedBy],[CreatedOn],[ModifiedBy],[ModifiedOn],[Item],[Description],[UnitPrice],[UnitDiscount],[Quantity],[Discount],[ExtraAmount],[ExternalRowVersion],[LineTaxRate]) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_InvoiceDetails_ExternalRowVersion]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE NONCLUSTERED INDEX [IX_InvoiceDetails_ExternalRowVersion] ON [dbo].[InvoiceDetails]
(
	[ExternalRowVersion] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[InvoiceDetails] ADD  DEFAULT ((0.0)) FOR [LineTaxRate]
GO
ALTER TABLE [dbo].[InvoiceDetails]  WITH CHECK ADD  CONSTRAINT [FK_InvoiceDetails_Invoices_InvoiceNumber] FOREIGN KEY([InvoiceNumber])
REFERENCES [dbo].[Invoices] ([InvoiceNumber])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[InvoiceDetails] CHECK CONSTRAINT [FK_InvoiceDetails_Invoices_InvoiceNumber]
GO
