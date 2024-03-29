USE [Portal]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Companies]') AND type in (N'U'))
ALTER TABLE [dbo].[Companies] DROP CONSTRAINT IF EXISTS [FK_Companies_Addresses_ShippingAddressId]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Companies]') AND type in (N'U'))
ALTER TABLE [dbo].[Companies] DROP CONSTRAINT IF EXISTS [FK_Companies_Addresses_PhysicalAddressId]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Companies]') AND type in (N'U'))
ALTER TABLE [dbo].[Companies] DROP CONSTRAINT IF EXISTS [FK_Companies_Addresses_MailingAddressId]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Companies]') AND type in (N'U'))
ALTER TABLE [dbo].[Companies] DROP CONSTRAINT IF EXISTS [FK_Companies_Addresses_BillingAddressId]
GO
/****** Object:  Index [IX_Companies_ShippingAddressId]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_Companies_ShippingAddressId] ON [dbo].[Companies]
GO
/****** Object:  Index [IX_Companies_PhysicalAddressId]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_Companies_PhysicalAddressId] ON [dbo].[Companies]
GO
/****** Object:  Index [IX_Companies_Name_Email_PhoneNumber]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_Companies_Name_Email_PhoneNumber] ON [dbo].[Companies]
GO
/****** Object:  Index [IX_Companies_MailingAddressId]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_Companies_MailingAddressId] ON [dbo].[Companies]
GO
/****** Object:  Index [IX_Companies_ExternalRowVersion]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_Companies_ExternalRowVersion] ON [dbo].[Companies]
GO
/****** Object:  Index [IX_Companies_BillingAddressId]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_Companies_BillingAddressId] ON [dbo].[Companies]
GO
/****** Object:  Table [dbo].[Companies]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP TABLE IF EXISTS [dbo].[Companies]
GO
/****** Object:  Table [dbo].[Companies]    Script Date: 3/5/2020 5:08:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Companies](
	[CreatedBy] [nvarchar](256) NOT NULL,
	[CreatedOn] [datetimeoffset](7) NOT NULL,
	[ModifiedBy] [nvarchar](256) NULL,
	[ModifiedOn] [datetimeoffset](7) NULL,
	[Number] [nvarchar](20) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[Email] [nvarchar](100) NULL,
	[PhoneNumber] [varchar](84) NULL,
	[FaxNumber] [varchar](84) NULL,
	[WireName] [nvarchar](60) NULL,
	[WireBank] [nvarchar](60) NULL,
	[WireBranch] [nvarchar](60) NULL,
	[WireAccountNumber] [nvarchar](40) NULL,
	[WireRoutingNumber] [nvarchar](30) NULL,
	[Currency] [nvarchar](10) NULL,
	[PhysicalAddressId] [uniqueidentifier] NULL,
	[MailingAddressId] [uniqueidentifier] NULL,
	[BillingAddressId] [uniqueidentifier] NULL,
	[ShippingAddressId] [uniqueidentifier] NULL,
	[ExternalRowVersion] [binary](12) NULL,
	[KvkNumber] [nvarchar](20) NULL,
	[TaxId] [nvarchar](400) NULL,
	[TaxIdPrefix] [nvarchar](30) NULL,
 CONSTRAINT [PK_Companies] PRIMARY KEY CLUSTERED 
(
	[Number] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Index [IX_Companies_BillingAddressId]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE NONCLUSTERED INDEX [IX_Companies_BillingAddressId] ON [dbo].[Companies]
(
	[BillingAddressId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_Companies_ExternalRowVersion]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE NONCLUSTERED INDEX [IX_Companies_ExternalRowVersion] ON [dbo].[Companies]
(
	[ExternalRowVersion] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
GO
/****** Object:  Index [IX_Companies_MailingAddressId]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE NONCLUSTERED INDEX [IX_Companies_MailingAddressId] ON [dbo].[Companies]
(
	[MailingAddressId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_Companies_Name_Email_PhoneNumber]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE NONCLUSTERED INDEX [IX_Companies_Name_Email_PhoneNumber] ON [dbo].[Companies]
(
	[Name] ASC,
	[Email] ASC,
	[PhoneNumber] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
GO
/****** Object:  Index [IX_Companies_PhysicalAddressId]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE NONCLUSTERED INDEX [IX_Companies_PhysicalAddressId] ON [dbo].[Companies]
(
	[PhysicalAddressId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
GO
/****** Object:  Index [IX_Companies_ShippingAddressId]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE NONCLUSTERED INDEX [IX_Companies_ShippingAddressId] ON [dbo].[Companies]
(
	[ShippingAddressId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Companies]  WITH CHECK ADD  CONSTRAINT [FK_Companies_Addresses_BillingAddressId] FOREIGN KEY([BillingAddressId])
REFERENCES [dbo].[Addresses] ([Id])
GO
ALTER TABLE [dbo].[Companies] CHECK CONSTRAINT [FK_Companies_Addresses_BillingAddressId]
GO
ALTER TABLE [dbo].[Companies]  WITH CHECK ADD  CONSTRAINT [FK_Companies_Addresses_MailingAddressId] FOREIGN KEY([MailingAddressId])
REFERENCES [dbo].[Addresses] ([Id])
GO
ALTER TABLE [dbo].[Companies] CHECK CONSTRAINT [FK_Companies_Addresses_MailingAddressId]
GO
ALTER TABLE [dbo].[Companies]  WITH CHECK ADD  CONSTRAINT [FK_Companies_Addresses_PhysicalAddressId] FOREIGN KEY([PhysicalAddressId])
REFERENCES [dbo].[Addresses] ([Id])
GO
ALTER TABLE [dbo].[Companies] CHECK CONSTRAINT [FK_Companies_Addresses_PhysicalAddressId]
GO
ALTER TABLE [dbo].[Companies]  WITH CHECK ADD  CONSTRAINT [FK_Companies_Addresses_ShippingAddressId] FOREIGN KEY([ShippingAddressId])
REFERENCES [dbo].[Addresses] ([Id])
GO
ALTER TABLE [dbo].[Companies] CHECK CONSTRAINT [FK_Companies_Addresses_ShippingAddressId]
GO
