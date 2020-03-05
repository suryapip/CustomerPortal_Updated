USE [Portal]
GO
/****** Object:  User [kisukapalli]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP USER IF EXISTS [kisukapalli]
GO
/****** Object:  User [kisukapalli]    Script Date: 3/5/2020 5:08:22 PM ******/
CREATE USER [kisukapalli] FOR LOGIN [kisukapalli] WITH DEFAULT_SCHEMA=[kisukapalli]
GO
ALTER ROLE [db_owner] ADD MEMBER [kisukapalli]
GO
ALTER ROLE [db_datareader] ADD MEMBER [kisukapalli]
GO
ALTER ROLE [db_datawriter] ADD MEMBER [kisukapalli]
GO
