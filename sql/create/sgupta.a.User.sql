USE [Portal]
GO
/****** Object:  User [sgupta.a]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP USER IF EXISTS [sgupta.a]
GO
/****** Object:  User [sgupta.a]    Script Date: 3/5/2020 5:08:22 PM ******/
CREATE USER [sgupta.a] FOR LOGIN [sgupta.a] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_datareader] ADD MEMBER [sgupta.a]
GO
ALTER ROLE [db_datawriter] ADD MEMBER [sgupta.a]
GO
