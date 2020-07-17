USE [Portal]
GO
/****** Object:  User [rjaswal.a]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP USER IF EXISTS [rjaswal.a]
GO
/****** Object:  User [rjaswal.a]    Script Date: 3/5/2020 5:08:22 PM ******/
CREATE USER [rjaswal.a] FOR LOGIN [rjaswal.a] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_owner] ADD MEMBER [rjaswal.a]
GO
ALTER ROLE [db_ddladmin] ADD MEMBER [rjaswal.a]
GO
ALTER ROLE [db_datawriter] ADD MEMBER [rjaswal.a]
GO
