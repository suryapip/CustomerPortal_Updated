USE [Portal]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CompanyWireAchDetails]') AND type in (N'U'))
ALTER TABLE [dbo].[CompanyWireAchDetails] DROP CONSTRAINT IF EXISTS [FK_CompanyWireAchDetails_Invoices_InvoiceNumber]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CompanyWireAchDetails]') AND type in (N'U'))
ALTER TABLE [dbo].[CompanyWireAchDetails] DROP CONSTRAINT IF EXISTS [DF__CompanyWi__Invoi__24285DB4]
GO
/****** Object:  Index [IX_CompanyWireAchDetails_InvoiceNumber]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_CompanyWireAchDetails_InvoiceNumber] ON [dbo].[CompanyWireAchDetails]
GO
/****** Object:  Table [dbo].[CompanyWireAchDetails]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP TABLE IF EXISTS [dbo].[CompanyWireAchDetails]
GO
/****** Object:  Table [dbo].[CompanyWireAchDetails]    Script Date: 3/5/2020 5:08:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CompanyWireAchDetails](
	[CreatedBy] [nvarchar](256) NOT NULL,
	[CreatedOn] [datetimeoffset](7) NOT NULL,
	[ModifiedBy] [nvarchar](256) NULL,
	[ModifiedOn] [datetimeoffset](7) NULL,
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[WireBankId] [nvarchar](60) NULL,
	[RemitSortcode] [nvarchar](450) NULL,
	[RemitBan] [nvarchar](450) NULL,
	[SwiftName] [nvarchar](7) NULL,
	[Swift] [nvarchar](18) NULL,
	[WireCurrency] [nvarchar](450) NULL,
	[WireName2] [nvarchar](450) NULL,
	[WireBank2] [nvarchar](450) NULL,
	[WireAccount2] [nvarchar](30) NULL,
	[Swift2] [nvarchar](18) NULL,
	[WireCurrency2] [nvarchar](450) NULL,
	[ExternalRowVersion] [binary](12) NULL,
	[WireClearing] [nvarchar](450) NULL,
	[InvoiceNumber] [nvarchar](20) NOT NULL,
	[WireAccountNumber] [nvarchar](450) NULL,
	[WireBank] [nvarchar](450) NULL,
	[WireBranch] [nvarchar](450) NULL,
	[WireName] [nvarchar](450) NULL,
	[WireRoutingNumber] [nvarchar](450) NULL,
 CONSTRAINT [PK_CompanyWireAchDetails] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_CompanyWireAchDetails_InvoiceNumber]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_CompanyWireAchDetails_InvoiceNumber] ON [dbo].[CompanyWireAchDetails]
(
	[InvoiceNumber] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[CompanyWireAchDetails] ADD  DEFAULT (N'') FOR [InvoiceNumber]
GO
ALTER TABLE [dbo].[CompanyWireAchDetails]  WITH CHECK ADD  CONSTRAINT [FK_CompanyWireAchDetails_Invoices_InvoiceNumber] FOREIGN KEY([InvoiceNumber])
REFERENCES [dbo].[Invoices] ([InvoiceNumber])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[CompanyWireAchDetails] CHECK CONSTRAINT [FK_CompanyWireAchDetails_Invoices_InvoiceNumber]
GO
