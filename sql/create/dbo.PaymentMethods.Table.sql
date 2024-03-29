USE [Portal]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[PaymentMethods]') AND type in (N'U'))
ALTER TABLE [dbo].[PaymentMethods] DROP CONSTRAINT IF EXISTS [FK_PaymentMethods_Addresses_PaymentBillingAddressId]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[PaymentMethods]') AND type in (N'U'))
ALTER TABLE [dbo].[PaymentMethods] DROP CONSTRAINT IF EXISTS [FK_PaymentMethods_Accounts_AccountNumber]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[PaymentMethods]') AND type in (N'U'))
ALTER TABLE [dbo].[PaymentMethods] DROP CONSTRAINT IF EXISTS [DF__PaymentMe__IsAcc__76619304]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[PaymentMethods]') AND type in (N'U'))
ALTER TABLE [dbo].[PaymentMethods] DROP CONSTRAINT IF EXISTS [DF__PaymentMe__IsAut__55009F39]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[PaymentMethods]') AND type in (N'U'))
ALTER TABLE [dbo].[PaymentMethods] DROP CONSTRAINT IF EXISTS [DF__PaymentMe__IsDis__22751F6C]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[PaymentMethods]') AND type in (N'U'))
ALTER TABLE [dbo].[PaymentMethods] DROP CONSTRAINT IF EXISTS [DF__PaymentMe__IsDel__2180FB33]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[PaymentMethods]') AND type in (N'U'))
ALTER TABLE [dbo].[PaymentMethods] DROP CONSTRAINT IF EXISTS [DF__PaymentMe__IsDef__208CD6FA]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[PaymentMethods]') AND type in (N'U'))
ALTER TABLE [dbo].[PaymentMethods] DROP CONSTRAINT IF EXISTS [DF__PaymentMe__Creat__1F98B2C1]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[PaymentMethods]') AND type in (N'U'))
ALTER TABLE [dbo].[PaymentMethods] DROP CONSTRAINT IF EXISTS [DF__PaymentMe__Creat__1EA48E88]
GO
/****** Object:  Index [IX_PaymentMethods_PaymentBillingAddressId]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_PaymentMethods_PaymentBillingAddressId] ON [dbo].[PaymentMethods]
GO
/****** Object:  Index [IX_PaymentMethods_AccountNumber_Token]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_PaymentMethods_AccountNumber_Token] ON [dbo].[PaymentMethods]
GO
/****** Object:  Table [dbo].[PaymentMethods]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP TABLE IF EXISTS [dbo].[PaymentMethods]
GO
/****** Object:  Table [dbo].[PaymentMethods]    Script Date: 3/5/2020 5:08:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PaymentMethods](
	[Id] [uniqueidentifier] NOT NULL,
	[PaymentType] [int] NOT NULL,
	[AccountNumber] [nvarchar](15) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[PaymentAccountNumber] [varchar](32) NOT NULL,
	[PaymentRoutingNumber] [varchar](9) NULL,
	[Bank] [nvarchar](60) NULL,
	[Branch] [nvarchar](60) NULL,
	[Currency] [varchar](3) NULL,
	[CreatedBy] [nvarchar](256) NOT NULL,
	[CreatedOn] [datetimeoffset](7) NOT NULL,
	[IsDefault] [bit] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsDisabled] [bit] NOT NULL,
	[ModifiedBy] [nvarchar](256) NULL,
	[ModifiedOn] [datetimeoffset](7) NULL,
	[PaymentBillToName] [nvarchar](100) NULL,
	[TokenSource] [nvarchar](256) NULL,
	[CCV] [varchar](6) NULL,
	[ExpiresOn] [datetimeoffset](7) NULL,
	[IsAuto] [bit] NOT NULL,
	[Token] [nvarchar](1024) NULL,
	[PaymentBillingAddressId] [uniqueidentifier] NOT NULL,
	[IsAcceptedAutoTC] [bit] NOT NULL,
 CONSTRAINT [PK_PaymentMethods] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_PaymentMethods_AccountNumber_Token]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_PaymentMethods_AccountNumber_Token] ON [dbo].[PaymentMethods]
(
	[AccountNumber] ASC,
	[Token] ASC
)
WHERE ([Token] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_PaymentMethods_PaymentBillingAddressId]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE NONCLUSTERED INDEX [IX_PaymentMethods_PaymentBillingAddressId] ON [dbo].[PaymentMethods]
(
	[PaymentBillingAddressId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[PaymentMethods] ADD  DEFAULT (N'') FOR [CreatedBy]
GO
ALTER TABLE [dbo].[PaymentMethods] ADD  DEFAULT ('0001-01-01T00:00:00.000+00:00') FOR [CreatedOn]
GO
ALTER TABLE [dbo].[PaymentMethods] ADD  DEFAULT ((0)) FOR [IsDefault]
GO
ALTER TABLE [dbo].[PaymentMethods] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[PaymentMethods] ADD  DEFAULT ((0)) FOR [IsDisabled]
GO
ALTER TABLE [dbo].[PaymentMethods] ADD  DEFAULT ((0)) FOR [IsAuto]
GO
ALTER TABLE [dbo].[PaymentMethods] ADD  DEFAULT ((0)) FOR [IsAcceptedAutoTC]
GO
ALTER TABLE [dbo].[PaymentMethods]  WITH CHECK ADD  CONSTRAINT [FK_PaymentMethods_Accounts_AccountNumber] FOREIGN KEY([AccountNumber])
REFERENCES [dbo].[Accounts] ([Number])
GO
ALTER TABLE [dbo].[PaymentMethods] CHECK CONSTRAINT [FK_PaymentMethods_Accounts_AccountNumber]
GO
ALTER TABLE [dbo].[PaymentMethods]  WITH CHECK ADD  CONSTRAINT [FK_PaymentMethods_Addresses_PaymentBillingAddressId] FOREIGN KEY([PaymentBillingAddressId])
REFERENCES [dbo].[Addresses] ([Id])
GO
ALTER TABLE [dbo].[PaymentMethods] CHECK CONSTRAINT [FK_PaymentMethods_Addresses_PaymentBillingAddressId]
GO
