USE [Portal]
GO
/****** Object:  User [vpatil.a]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP USER IF EXISTS [vpatil.a]
GO
/****** Object:  User [vpatil.a]    Script Date: 3/5/2020 5:08:22 PM ******/
CREATE USER [vpatil.a] FOR LOGIN [vpatil.a] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_datareader] ADD MEMBER [vpatil.a]
GO
ALTER ROLE [db_datawriter] ADD MEMBER [vpatil.a]
GO
