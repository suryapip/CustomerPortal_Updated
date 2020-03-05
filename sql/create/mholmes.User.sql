USE [Portal]
GO
/****** Object:  User [mholmes]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP USER IF EXISTS [mholmes]
GO
/****** Object:  User [mholmes]    Script Date: 3/5/2020 5:08:22 PM ******/
CREATE USER [mholmes] FOR LOGIN [mholmes] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_owner] ADD MEMBER [mholmes]
GO
ALTER ROLE [db_datareader] ADD MEMBER [mholmes]
GO
ALTER ROLE [db_datawriter] ADD MEMBER [mholmes]
GO
