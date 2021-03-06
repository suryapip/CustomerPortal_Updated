USE [Portal]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Addresses]') AND type in (N'U'))
ALTER TABLE [dbo].[Addresses] DROP CONSTRAINT IF EXISTS [addresses_default]
GO
/****** Object:  Index [IX_Addresses_PostalCode_Country_StateOrProvince_Municipality]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_Addresses_PostalCode_Country_StateOrProvince_Municipality] ON [dbo].[Addresses]
GO
/****** Object:  Table [dbo].[Addresses]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP TABLE IF EXISTS [dbo].[Addresses]
GO
/****** Object:  Table [dbo].[Addresses]    Script Date: 3/5/2020 5:08:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Addresses](
	[Id] [uniqueidentifier] NOT NULL,
	[Line1] [nvarchar](50) NOT NULL,
	[Line2] [nvarchar](50) NULL,
	[Line3] [nvarchar](50) NULL,
	[Municipality] [nvarchar](100) NOT NULL,
	[StateOrProvince] [nvarchar](35) NOT NULL,
	[PostalCode] [nvarchar](10) NOT NULL,
	[Country] [nvarchar](40) NOT NULL,
 CONSTRAINT [PK_Addresses] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_Addresses_PostalCode_Country_StateOrProvince_Municipality]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE NONCLUSTERED INDEX [IX_Addresses_PostalCode_Country_StateOrProvince_Municipality] ON [dbo].[Addresses]
(
	[PostalCode] ASC,
	[Country] ASC,
	[StateOrProvince] ASC,
	[Municipality] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Addresses] ADD  CONSTRAINT [addresses_default]  DEFAULT ('') FOR [Line1]
GO
