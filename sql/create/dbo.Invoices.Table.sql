USE [Portal]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Invoices]') AND type in (N'U'))
ALTER TABLE [dbo].[Invoices] DROP CONSTRAINT IF EXISTS [FK_Invoices_Companies_SellingEntityNumber]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Invoices]') AND type in (N'U'))
ALTER TABLE [dbo].[Invoices] DROP CONSTRAINT IF EXISTS [FK_Invoices_Companies_BillingEntityNumber]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Invoices]') AND type in (N'U'))
ALTER TABLE [dbo].[Invoices] DROP CONSTRAINT IF EXISTS [FK_Invoices_Addresses_ShippingAddressId]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Invoices]') AND type in (N'U'))
ALTER TABLE [dbo].[Invoices] DROP CONSTRAINT IF EXISTS [FK_Invoices_Accounts_SoldToAccountNumber]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Invoices]') AND type in (N'U'))
ALTER TABLE [dbo].[Invoices] DROP CONSTRAINT IF EXISTS [FK_Invoices_Accounts_BilledToAccountNumber]
GO
/****** Object:  Index [IX_Invoices_SoldToAccountNumber]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_Invoices_SoldToAccountNumber] ON [dbo].[Invoices]
GO
/****** Object:  Index [IX_Invoices_ShippingAddressId]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_Invoices_ShippingAddressId] ON [dbo].[Invoices]
GO
/****** Object:  Index [IX_Invoices_SellingEntityNumber]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_Invoices_SellingEntityNumber] ON [dbo].[Invoices]
GO
/****** Object:  Index [IX_Invoices_ExternalRowVersion1]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_Invoices_ExternalRowVersion1] ON [dbo].[Invoices]
GO
/****** Object:  Index [IX_Invoices_ExternalRowVersion]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_Invoices_ExternalRowVersion] ON [dbo].[Invoices]
GO
/****** Object:  Index [IX_Invoices_BillingEntityNumber]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_Invoices_BillingEntityNumber] ON [dbo].[Invoices]
GO
/****** Object:  Index [IX_Invoices_BilledToAccountNumber_SoldToAccountNumber_Balance]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_Invoices_BilledToAccountNumber_SoldToAccountNumber_Balance] ON [dbo].[Invoices]
GO
/****** Object:  Table [dbo].[Invoices]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP TABLE IF EXISTS [dbo].[Invoices]
GO
/****** Object:  Table [dbo].[Invoices]    Script Date: 3/5/2020 5:08:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Invoices](
	[CreatedBy] [nvarchar](256) NOT NULL,
	[CreatedOn] [datetimeoffset](7) NOT NULL,
	[ModifiedBy] [nvarchar](256) NULL,
	[ModifiedOn] [datetimeoffset](7) NULL,
	[SoldToAccountNumber] [nvarchar](15) NULL,
	[BilledToAccountNumber] [nvarchar](15) NULL,
	[BillingEntityNumber] [nvarchar](20) NULL,
	[ExternalRowVersion] [binary](12) NULL,
	[InvoiceNumber] [nvarchar](20) NOT NULL,
	[InvoiceDate] [datetimeoffset](7) NOT NULL,
	[CustomerReferenceNumber] [nvarchar](40) NULL,
	[CustomerPurchaseOrderNumber] [nvarchar](30) NULL,
	[ShippingAddressId] [uniqueidentifier] NULL,
	[ShippingNumber] [nvarchar](60) NULL,
	[ShippingMethod] [nvarchar](60) NULL,
	[ShippingResult] [nvarchar](60) NULL,
	[ServiceFrom] [datetimeoffset](7) NULL,
	[ServiceTo] [datetimeoffset](7) NULL,
	[IncoTerms] [nvarchar](80) NULL,
	[PaymentTerms] [nvarchar](80) NULL,
	[Comments] [ntext] NULL,
	[TaxId] [nvarchar](20) NULL,
	[Currency] [nvarchar](3) NULL,
	[DiscountAmount] [decimal](18, 2) NOT NULL,
	[Total] [decimal](18, 2) NOT NULL,
	[SubTotalAmount] [decimal](18, 2) NOT NULL,
	[TaxRate] [decimal](18, 2) NOT NULL,
	[TaxAmount] [decimal](18, 2) NOT NULL,
	[Balance] [decimal](18, 2) NOT NULL,
	[BalanceCurrency] [nvarchar](3) NULL,
	[DateDue] [datetimeoffset](7) NULL,
	[SellingEntityNumber] [nvarchar](20) NULL,
	[ExternalRowVersion1] [binary](8) NULL,
 CONSTRAINT [PK_Invoices] PRIMARY KEY CLUSTERED 
(
	[InvoiceNumber] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_Invoices_BilledToAccountNumber_SoldToAccountNumber_Balance]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE NONCLUSTERED INDEX [IX_Invoices_BilledToAccountNumber_SoldToAccountNumber_Balance] ON [dbo].[Invoices]
(
	[BilledToAccountNumber] ASC,
	[SoldToAccountNumber] ASC,
	[Balance] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_Invoices_BillingEntityNumber]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE NONCLUSTERED INDEX [IX_Invoices_BillingEntityNumber] ON [dbo].[Invoices]
(
	[BillingEntityNumber] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_Invoices_ExternalRowVersion]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE NONCLUSTERED INDEX [IX_Invoices_ExternalRowVersion] ON [dbo].[Invoices]
(
	[ExternalRowVersion] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_Invoices_ExternalRowVersion1]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE NONCLUSTERED INDEX [IX_Invoices_ExternalRowVersion1] ON [dbo].[Invoices]
(
	[ExternalRowVersion1] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_Invoices_SellingEntityNumber]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE NONCLUSTERED INDEX [IX_Invoices_SellingEntityNumber] ON [dbo].[Invoices]
(
	[SellingEntityNumber] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
GO
/****** Object:  Index [IX_Invoices_ShippingAddressId]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE NONCLUSTERED INDEX [IX_Invoices_ShippingAddressId] ON [dbo].[Invoices]
(
	[ShippingAddressId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_Invoices_SoldToAccountNumber]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE NONCLUSTERED INDEX [IX_Invoices_SoldToAccountNumber] ON [dbo].[Invoices]
(
	[SoldToAccountNumber] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Invoices]  WITH NOCHECK ADD  CONSTRAINT [FK_Invoices_Accounts_BilledToAccountNumber] FOREIGN KEY([BilledToAccountNumber])
REFERENCES [dbo].[Accounts] ([Number])
GO
ALTER TABLE [dbo].[Invoices] NOCHECK CONSTRAINT [FK_Invoices_Accounts_BilledToAccountNumber]
GO
ALTER TABLE [dbo].[Invoices]  WITH NOCHECK ADD  CONSTRAINT [FK_Invoices_Accounts_SoldToAccountNumber] FOREIGN KEY([SoldToAccountNumber])
REFERENCES [dbo].[Accounts] ([Number])
GO
ALTER TABLE [dbo].[Invoices] NOCHECK CONSTRAINT [FK_Invoices_Accounts_SoldToAccountNumber]
GO
ALTER TABLE [dbo].[Invoices]  WITH NOCHECK ADD  CONSTRAINT [FK_Invoices_Addresses_ShippingAddressId] FOREIGN KEY([ShippingAddressId])
REFERENCES [dbo].[Addresses] ([Id])
GO
ALTER TABLE [dbo].[Invoices] NOCHECK CONSTRAINT [FK_Invoices_Addresses_ShippingAddressId]
GO
ALTER TABLE [dbo].[Invoices]  WITH NOCHECK ADD  CONSTRAINT [FK_Invoices_Companies_BillingEntityNumber] FOREIGN KEY([BillingEntityNumber])
REFERENCES [dbo].[Companies] ([Number])
GO
ALTER TABLE [dbo].[Invoices] NOCHECK CONSTRAINT [FK_Invoices_Companies_BillingEntityNumber]
GO
ALTER TABLE [dbo].[Invoices]  WITH NOCHECK ADD  CONSTRAINT [FK_Invoices_Companies_SellingEntityNumber] FOREIGN KEY([SellingEntityNumber])
REFERENCES [dbo].[Companies] ([Number])
GO
ALTER TABLE [dbo].[Invoices] NOCHECK CONSTRAINT [FK_Invoices_Companies_SellingEntityNumber]
GO
