USE [Portal]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[InvoiceHeaderExtensions]') AND type in (N'U'))
ALTER TABLE [dbo].[InvoiceHeaderExtensions] DROP CONSTRAINT IF EXISTS [FK_InvoiceHeaderExtensions_Invoices_InvoiceNumber]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[InvoiceHeaderExtensions]') AND type in (N'U'))
ALTER TABLE [dbo].[InvoiceHeaderExtensions] DROP CONSTRAINT IF EXISTS [FK_InvoiceHeaderExtensions_Addresses_ShipToAddressId]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[InvoiceHeaderExtensions]') AND type in (N'U'))
ALTER TABLE [dbo].[InvoiceHeaderExtensions] DROP CONSTRAINT IF EXISTS [FK_InvoiceHeaderExtensions_Addresses_RemitAddressId]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[InvoiceHeaderExtensions]') AND type in (N'U'))
ALTER TABLE [dbo].[InvoiceHeaderExtensions] DROP CONSTRAINT IF EXISTS [FK_InvoiceHeaderExtensions_Addresses_PayByAddressId]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[InvoiceHeaderExtensions]') AND type in (N'U'))
ALTER TABLE [dbo].[InvoiceHeaderExtensions] DROP CONSTRAINT IF EXISTS [FK_InvoiceHeaderExtensions_Addresses_BillToAddressId]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[InvoiceHeaderExtensions]') AND type in (N'U'))
ALTER TABLE [dbo].[InvoiceHeaderExtensions] DROP CONSTRAINT IF EXISTS [DF__InvoiceHea__Logo__214BF109]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[InvoiceHeaderExtensions]') AND type in (N'U'))
ALTER TABLE [dbo].[InvoiceHeaderExtensions] DROP CONSTRAINT IF EXISTS [DF__InvoiceHe__DocTy__2057CCD0]
GO
/****** Object:  Index [IX_InvoiceHeaderExtensions_ShipToAddressId]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_InvoiceHeaderExtensions_ShipToAddressId] ON [dbo].[InvoiceHeaderExtensions]
GO
/****** Object:  Index [IX_InvoiceHeaderExtensions_RemitAddressId]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_InvoiceHeaderExtensions_RemitAddressId] ON [dbo].[InvoiceHeaderExtensions]
GO
/****** Object:  Index [IX_InvoiceHeaderExtensions_PayByAddressId]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_InvoiceHeaderExtensions_PayByAddressId] ON [dbo].[InvoiceHeaderExtensions]
GO
/****** Object:  Index [IX_InvoiceHeaderExtensions_InvoiceNumber]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_InvoiceHeaderExtensions_InvoiceNumber] ON [dbo].[InvoiceHeaderExtensions]
GO
/****** Object:  Index [IX_InvoiceHeaderExtensions_BillToAddressId]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_InvoiceHeaderExtensions_BillToAddressId] ON [dbo].[InvoiceHeaderExtensions]
GO
/****** Object:  Table [dbo].[InvoiceHeaderExtensions]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP TABLE IF EXISTS [dbo].[InvoiceHeaderExtensions]
GO
/****** Object:  Table [dbo].[InvoiceHeaderExtensions]    Script Date: 3/5/2020 5:08:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[InvoiceHeaderExtensions](
	[CreatedBy] [nvarchar](256) NOT NULL,
	[CreatedOn] [datetimeoffset](7) NOT NULL,
	[ModifiedBy] [nvarchar](256) NULL,
	[ModifiedOn] [datetimeoffset](7) NULL,
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[InvoiceNumber] [nvarchar](20) NOT NULL,
	[InvoiceCurrency] [nvarchar](3) NULL,
	[Memo] [nvarchar](max) NULL,
	[PdcrAmount] [nvarchar](18) NULL,
	[PaymentReference] [nvarchar](max) NULL,
	[CheckNumber] [nvarchar](max) NULL,
	[PayAmount] [float] NULL,
	[ImporteTOT] [nvarchar](80) NULL,
	[PayByCustomer] [nvarchar](15) NULL,
	[PayByName] [nvarchar](35) NULL,
	[PayByAddressId] [uniqueidentifier] NULL,
	[ExternalRowVersion] [binary](12) NULL,
	[DocType] [nvarchar](11) NOT NULL,
	[Logo] [nvarchar](2) NOT NULL,
	[CPY] [nvarchar](10) NULL,
	[RemitAddressId] [uniqueidentifier] NULL,
	[RemitCurrency] [nvarchar](450) NULL,
	[RemitName] [nvarchar](450) NULL,
	[BillToName] [nvarchar](250) NULL,
	[ShipToName] [nvarchar](250) NULL,
	[BillToAddressId] [uniqueidentifier] NULL,
	[CustTaxId] [nvarchar](20) NULL,
	[CustTaxPrefix] [nvarchar](20) NULL,
	[ShipToAddressId] [uniqueidentifier] NULL,
 CONSTRAINT [PK_InvoiceHeaderExtensions] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Index [IX_InvoiceHeaderExtensions_BillToAddressId]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE NONCLUSTERED INDEX [IX_InvoiceHeaderExtensions_BillToAddressId] ON [dbo].[InvoiceHeaderExtensions]
(
	[BillToAddressId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_InvoiceHeaderExtensions_InvoiceNumber]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_InvoiceHeaderExtensions_InvoiceNumber] ON [dbo].[InvoiceHeaderExtensions]
(
	[InvoiceNumber] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_InvoiceHeaderExtensions_PayByAddressId]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE NONCLUSTERED INDEX [IX_InvoiceHeaderExtensions_PayByAddressId] ON [dbo].[InvoiceHeaderExtensions]
(
	[PayByAddressId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_InvoiceHeaderExtensions_RemitAddressId]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE NONCLUSTERED INDEX [IX_InvoiceHeaderExtensions_RemitAddressId] ON [dbo].[InvoiceHeaderExtensions]
(
	[RemitAddressId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_InvoiceHeaderExtensions_ShipToAddressId]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE NONCLUSTERED INDEX [IX_InvoiceHeaderExtensions_ShipToAddressId] ON [dbo].[InvoiceHeaderExtensions]
(
	[ShipToAddressId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[InvoiceHeaderExtensions] ADD  DEFAULT (N'') FOR [DocType]
GO
ALTER TABLE [dbo].[InvoiceHeaderExtensions] ADD  DEFAULT (N'') FOR [Logo]
GO
ALTER TABLE [dbo].[InvoiceHeaderExtensions]  WITH CHECK ADD  CONSTRAINT [FK_InvoiceHeaderExtensions_Addresses_BillToAddressId] FOREIGN KEY([BillToAddressId])
REFERENCES [dbo].[Addresses] ([Id])
GO
ALTER TABLE [dbo].[InvoiceHeaderExtensions] CHECK CONSTRAINT [FK_InvoiceHeaderExtensions_Addresses_BillToAddressId]
GO
ALTER TABLE [dbo].[InvoiceHeaderExtensions]  WITH CHECK ADD  CONSTRAINT [FK_InvoiceHeaderExtensions_Addresses_PayByAddressId] FOREIGN KEY([PayByAddressId])
REFERENCES [dbo].[Addresses] ([Id])
GO
ALTER TABLE [dbo].[InvoiceHeaderExtensions] CHECK CONSTRAINT [FK_InvoiceHeaderExtensions_Addresses_PayByAddressId]
GO
ALTER TABLE [dbo].[InvoiceHeaderExtensions]  WITH CHECK ADD  CONSTRAINT [FK_InvoiceHeaderExtensions_Addresses_RemitAddressId] FOREIGN KEY([RemitAddressId])
REFERENCES [dbo].[Addresses] ([Id])
GO
ALTER TABLE [dbo].[InvoiceHeaderExtensions] CHECK CONSTRAINT [FK_InvoiceHeaderExtensions_Addresses_RemitAddressId]
GO
ALTER TABLE [dbo].[InvoiceHeaderExtensions]  WITH CHECK ADD  CONSTRAINT [FK_InvoiceHeaderExtensions_Addresses_ShipToAddressId] FOREIGN KEY([ShipToAddressId])
REFERENCES [dbo].[Addresses] ([Id])
GO
ALTER TABLE [dbo].[InvoiceHeaderExtensions] CHECK CONSTRAINT [FK_InvoiceHeaderExtensions_Addresses_ShipToAddressId]
GO
ALTER TABLE [dbo].[InvoiceHeaderExtensions]  WITH CHECK ADD  CONSTRAINT [FK_InvoiceHeaderExtensions_Invoices_InvoiceNumber] FOREIGN KEY([InvoiceNumber])
REFERENCES [dbo].[Invoices] ([InvoiceNumber])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[InvoiceHeaderExtensions] CHECK CONSTRAINT [FK_InvoiceHeaderExtensions_Invoices_InvoiceNumber]
GO
