USE [Portal]
GO
/****** Object:  User [nkolhe.a]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP USER IF EXISTS [nkolhe.a]
GO
/****** Object:  User [nkolhe.a]    Script Date: 3/5/2020 5:08:22 PM ******/
CREATE USER [nkolhe.a] FOR LOGIN [nkolhe.a] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_owner] ADD MEMBER [nkolhe.a]
GO
