USE [Portal]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[OpenIddictToken]') AND type in (N'U'))
ALTER TABLE [dbo].[OpenIddictToken] DROP CONSTRAINT IF EXISTS [FK_OpenIddictToken_OpenIddictAuthorization_AuthorizationId]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[OpenIddictToken]') AND type in (N'U'))
ALTER TABLE [dbo].[OpenIddictToken] DROP CONSTRAINT IF EXISTS [FK_OpenIddictToken_OpenIddictApplication_ApplicationId]
GO
/****** Object:  Index [IX_OpenIddictToken_ReferenceId]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_OpenIddictToken_ReferenceId] ON [dbo].[OpenIddictToken]
GO
/****** Object:  Index [IX_OpenIddictToken_AuthorizationId]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_OpenIddictToken_AuthorizationId] ON [dbo].[OpenIddictToken]
GO
/****** Object:  Index [IX_OpenIddictToken_ApplicationId]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP INDEX IF EXISTS [IX_OpenIddictToken_ApplicationId] ON [dbo].[OpenIddictToken]
GO
/****** Object:  Table [dbo].[OpenIddictToken]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP TABLE IF EXISTS [dbo].[OpenIddictToken]
GO
/****** Object:  Table [dbo].[OpenIddictToken]    Script Date: 3/5/2020 5:08:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OpenIddictToken](
	[ApplicationId] [nvarchar](450) NULL,
	[AuthorizationId] [nvarchar](450) NULL,
	[ConcurrencyToken] [nvarchar](max) NULL,
	[CreationDate] [datetimeoffset](7) NULL,
	[ExpirationDate] [datetimeoffset](7) NULL,
	[Id] [nvarchar](450) NOT NULL,
	[Payload] [nvarchar](max) NULL,
	[Properties] [nvarchar](max) NULL,
	[ReferenceId] [nvarchar](450) NULL,
	[Status] [nvarchar](max) NULL,
	[Subject] [nvarchar](max) NOT NULL,
	[Type] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_OpenIddictToken] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_OpenIddictToken_ApplicationId]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE NONCLUSTERED INDEX [IX_OpenIddictToken_ApplicationId] ON [dbo].[OpenIddictToken]
(
	[ApplicationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_OpenIddictToken_AuthorizationId]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE NONCLUSTERED INDEX [IX_OpenIddictToken_AuthorizationId] ON [dbo].[OpenIddictToken]
(
	[AuthorizationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_OpenIddictToken_ReferenceId]    Script Date: 3/5/2020 5:08:23 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_OpenIddictToken_ReferenceId] ON [dbo].[OpenIddictToken]
(
	[ReferenceId] ASC
)
WHERE ([ReferenceId] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[OpenIddictToken]  WITH CHECK ADD  CONSTRAINT [FK_OpenIddictToken_OpenIddictApplication_ApplicationId] FOREIGN KEY([ApplicationId])
REFERENCES [dbo].[OpenIddictApplication] ([Id])
GO
ALTER TABLE [dbo].[OpenIddictToken] CHECK CONSTRAINT [FK_OpenIddictToken_OpenIddictApplication_ApplicationId]
GO
ALTER TABLE [dbo].[OpenIddictToken]  WITH CHECK ADD  CONSTRAINT [FK_OpenIddictToken_OpenIddictAuthorization_AuthorizationId] FOREIGN KEY([AuthorizationId])
REFERENCES [dbo].[OpenIddictAuthorization] ([Id])
GO
ALTER TABLE [dbo].[OpenIddictToken] CHECK CONSTRAINT [FK_OpenIddictToken_OpenIddictAuthorization_AuthorizationId]
GO
