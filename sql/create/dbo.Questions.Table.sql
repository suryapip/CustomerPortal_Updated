USE [Portal]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Questions]') AND type in (N'U'))
ALTER TABLE [dbo].[Questions] DROP CONSTRAINT IF EXISTS [DF__Questions__Refer__2CBDA3B5]
GO
/****** Object:  Table [dbo].[Questions]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP TABLE IF EXISTS [dbo].[Questions]
GO
/****** Object:  Table [dbo].[Questions]    Script Date: 3/5/2020 5:08:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Questions](
	[Id] [int] NOT NULL,
	[Question] [nvarchar](max) NULL,
	[Order] [int] NOT NULL,
	[Language] [nvarchar](max) NULL,
	[ReferenceEnglishId] [int] NOT NULL,
 CONSTRAINT [PK_Questions] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[Questions] ADD  DEFAULT ((0)) FOR [ReferenceEnglishId]
GO
