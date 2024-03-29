USE [Portal]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Accounts]') AND type in (N'U'))
ALTER TABLE [dbo].[Accounts] DROP CONSTRAINT IF EXISTS [FK_Accounts_Companies_CompanyNumber]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Accounts]') AND type in (N'U'))
ALTER TABLE [dbo].[Accounts] DROP CONSTRAINT IF EXISTS [FK_Accounts_Addresses_ShippingAddressId]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Accounts]') AND type in (N'U'))
ALTER TABLE [dbo].[Accounts] DROP CONSTRAINT IF EXISTS [FK_Accounts_Addresses_PhysicalAddressId]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Accounts]') AND type in (N'U'))
ALTER TABLE [dbo].[Accounts] DROP CONSTRAINT IF EXISTS [FK_Accounts_Addresses_MailingAddressId]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Accounts]') AND type in (N'U'))
ALTER TABLE [dbo].[Accounts] DROP CONSTRAINT IF EXISTS [FK_Accounts_Addresses_BillingAddressId]
GO
/****** Object:  Index [IX_Accounts_ShippingAddressId]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_Accounts_ShippingAddressId] ON [dbo].[Accounts]
GO
/****** Object:  Index [IX_Accounts_PhysicalAddressId]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_Accounts_PhysicalAddressId] ON [dbo].[Accounts]
GO
/****** Object:  Index [IX_Accounts_Name_Email_PhoneNumber]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_Accounts_Name_Email_PhoneNumber] ON [dbo].[Accounts]
GO
/****** Object:  Index [IX_Accounts_MailingAddressId]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_Accounts_MailingAddressId] ON [dbo].[Accounts]
GO
/****** Object:  Index [IX_Accounts_ExternalRowVersion]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_Accounts_ExternalRowVersion] ON [dbo].[Accounts]
GO
/****** Object:  Index [IX_Accounts_CompanyNumber1]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_Accounts_CompanyNumber1] ON [dbo].[Accounts]
GO
/****** Object:  Index [IX_Accounts_CompanyNumber]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_Accounts_CompanyNumber] ON [dbo].[Accounts]
GO
/****** Object:  Index [IX_Accounts_BillingAddressId]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_Accounts_BillingAddressId] ON [dbo].[Accounts]
GO
/****** Object:  Table [dbo].[Accounts]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP TABLE IF EXISTS [dbo].[Accounts]
GO
/****** Object:  Table [dbo].[Accounts]    Script Date: 3/5/2020 5:08:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Accounts](
	[CreatedBy] [nvarchar](256) NOT NULL,
	[CreatedOn] [datetimeoffset](7) NOT NULL,
	[ModifiedBy] [nvarchar](256) NULL,
	[ModifiedOn] [datetimeoffset](7) NULL,
	[Number] [nvarchar](15) NOT NULL,
	[Pin] [nvarchar](50) NULL,
	[Name] [nvarchar](100) NOT NULL,
	[Email] [nvarchar](100) NULL,
	[PhoneNumber] [varchar](84) NULL,
	[FaxNumber] [varchar](84) NULL,
	[Currency] [nvarchar](3) NULL,
	[PhysicalAddressId] [uniqueidentifier] NULL,
	[MailingAddressId] [uniqueidentifier] NULL,
	[BillingAddressId] [uniqueidentifier] NULL,
	[ShippingAddressId] [uniqueidentifier] NULL,
	[SalesPerson] [nvarchar](50) NULL,
	[AccountRepresentative] [nvarchar](50) NULL,
	[ExternalRowVersion] [timestamp] NULL,
	[CompanyNumber1] [nvarchar](15) NULL,
	[CompanyNumber] [nvarchar](20) NULL,
	[TaxId] [nvarchar](50) NULL,
	[TaxPrefix] [nvarchar](20) NULL,
	[Language] [nvarchar](3) NULL,
 CONSTRAINT [PK_Accounts] PRIMARY KEY CLUSTERED 
(
	[Number] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Index [IX_Accounts_BillingAddressId]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE NONCLUSTERED INDEX [IX_Accounts_BillingAddressId] ON [dbo].[Accounts]
(
	[BillingAddressId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_Accounts_CompanyNumber]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE NONCLUSTERED INDEX [IX_Accounts_CompanyNumber] ON [dbo].[Accounts]
(
	[CompanyNumber] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_Accounts_CompanyNumber1]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE NONCLUSTERED INDEX [IX_Accounts_CompanyNumber1] ON [dbo].[Accounts]
(
	[CompanyNumber1] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
GO
/****** Object:  Index [IX_Accounts_ExternalRowVersion]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE NONCLUSTERED INDEX [IX_Accounts_ExternalRowVersion] ON [dbo].[Accounts]
(
	[ExternalRowVersion] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
GO
/****** Object:  Index [IX_Accounts_MailingAddressId]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE NONCLUSTERED INDEX [IX_Accounts_MailingAddressId] ON [dbo].[Accounts]
(
	[MailingAddressId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_Accounts_Name_Email_PhoneNumber]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE NONCLUSTERED INDEX [IX_Accounts_Name_Email_PhoneNumber] ON [dbo].[Accounts]
(
	[Name] ASC,
	[Email] ASC,
	[PhoneNumber] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
GO
/****** Object:  Index [IX_Accounts_PhysicalAddressId]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE NONCLUSTERED INDEX [IX_Accounts_PhysicalAddressId] ON [dbo].[Accounts]
(
	[PhysicalAddressId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
GO
/****** Object:  Index [IX_Accounts_ShippingAddressId]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE NONCLUSTERED INDEX [IX_Accounts_ShippingAddressId] ON [dbo].[Accounts]
(
	[ShippingAddressId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Accounts]  WITH CHECK ADD  CONSTRAINT [FK_Accounts_Addresses_BillingAddressId] FOREIGN KEY([BillingAddressId])
REFERENCES [dbo].[Addresses] ([Id])
GO
ALTER TABLE [dbo].[Accounts] CHECK CONSTRAINT [FK_Accounts_Addresses_BillingAddressId]
GO
ALTER TABLE [dbo].[Accounts]  WITH CHECK ADD  CONSTRAINT [FK_Accounts_Addresses_MailingAddressId] FOREIGN KEY([MailingAddressId])
REFERENCES [dbo].[Addresses] ([Id])
GO
ALTER TABLE [dbo].[Accounts] CHECK CONSTRAINT [FK_Accounts_Addresses_MailingAddressId]
GO
ALTER TABLE [dbo].[Accounts]  WITH CHECK ADD  CONSTRAINT [FK_Accounts_Addresses_PhysicalAddressId] FOREIGN KEY([PhysicalAddressId])
REFERENCES [dbo].[Addresses] ([Id])
GO
ALTER TABLE [dbo].[Accounts] CHECK CONSTRAINT [FK_Accounts_Addresses_PhysicalAddressId]
GO
ALTER TABLE [dbo].[Accounts]  WITH CHECK ADD  CONSTRAINT [FK_Accounts_Addresses_ShippingAddressId] FOREIGN KEY([ShippingAddressId])
REFERENCES [dbo].[Addresses] ([Id])
GO
ALTER TABLE [dbo].[Accounts] CHECK CONSTRAINT [FK_Accounts_Addresses_ShippingAddressId]
GO
ALTER TABLE [dbo].[Accounts]  WITH CHECK ADD  CONSTRAINT [FK_Accounts_Companies_CompanyNumber] FOREIGN KEY([CompanyNumber])
REFERENCES [dbo].[Companies] ([Number])
GO
ALTER TABLE [dbo].[Accounts] CHECK CONSTRAINT [FK_Accounts_Companies_CompanyNumber]
GO
