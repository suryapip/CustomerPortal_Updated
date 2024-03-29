USE [Portal]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[OpenIddictAuthorization]') AND type in (N'U'))
ALTER TABLE [dbo].[OpenIddictAuthorization] DROP CONSTRAINT IF EXISTS [FK_OpenIddictAuthorization_OpenIddictApplication_ApplicationId]
GO
/****** Object:  Index [IX_OpenIddictAuthorization_ApplicationId]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_OpenIddictAuthorization_ApplicationId] ON [dbo].[OpenIddictAuthorization]
GO
/****** Object:  Table [dbo].[OpenIddictAuthorization]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP TABLE IF EXISTS [dbo].[OpenIddictAuthorization]
GO
/****** Object:  Table [dbo].[OpenIddictAuthorization]    Script Date: 3/5/2020 5:08:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OpenIddictAuthorization](
	[ApplicationId] [nvarchar](450) NULL,
	[ConcurrencyToken] [nvarchar](max) NULL,
	[Id] [nvarchar](450) NOT NULL,
	[Properties] [nvarchar](max) NULL,
	[Scopes] [nvarchar](max) NULL,
	[Status] [nvarchar](max) NOT NULL,
	[Subject] [nvarchar](max) NOT NULL,
	[Type] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_OpenIddictAuthorization] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_OpenIddictAuthorization_ApplicationId]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE NONCLUSTERED INDEX [IX_OpenIddictAuthorization_ApplicationId] ON [dbo].[OpenIddictAuthorization]
(
	[ApplicationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[OpenIddictAuthorization]  WITH CHECK ADD  CONSTRAINT [FK_OpenIddictAuthorization_OpenIddictApplication_ApplicationId] FOREIGN KEY([ApplicationId])
REFERENCES [dbo].[OpenIddictApplication] ([Id])
GO
ALTER TABLE [dbo].[OpenIddictAuthorization] CHECK CONSTRAINT [FK_OpenIddictAuthorization_OpenIddictApplication_ApplicationId]
GO
