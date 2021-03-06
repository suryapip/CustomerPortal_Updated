USE [Portal]
GO
/****** Object:  User [bschauf.a]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP USER IF EXISTS [bschauf.a]
GO
/****** Object:  User [bschauf.a]    Script Date: 3/5/2020 5:08:22 PM ******/
CREATE USER [bschauf.a] FOR LOGIN [bschauf.a] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_owner] ADD MEMBER [bschauf.a]
GO
ALTER ROLE [db_ddladmin] ADD MEMBER [bschauf.a]
GO
ALTER ROLE [db_datareader] ADD MEMBER [bschauf.a]
GO
ALTER ROLE [db_datawriter] ADD MEMBER [bschauf.a]
GO
