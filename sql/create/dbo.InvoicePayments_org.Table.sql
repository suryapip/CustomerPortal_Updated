USE [Portal]
GO
/****** Object:  Table [dbo].[InvoicePayments_org]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP TABLE IF EXISTS [dbo].[InvoicePayments_org]
GO
/****** Object:  Table [dbo].[InvoicePayments_org]    Script Date: 3/5/2020 5:08:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[InvoicePayments_org](
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
	[IsAcceptedPayTC] [bit] NOT NULL
) ON [PRIMARY]
GO
