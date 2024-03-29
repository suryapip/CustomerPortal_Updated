USE [Portal]
GO
/****** Object:  User [Admin]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP USER IF EXISTS [Admin]
GO
/****** Object:  User [Admin]    Script Date: 3/5/2020 5:08:22 PM ******/
CREATE USER [Admin] WITHOUT LOGIN WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_owner] ADD MEMBER [Admin]
GO
ALTER ROLE [db_accessadmin] ADD MEMBER [Admin]
GO
ALTER ROLE [db_ddladmin] ADD MEMBER [Admin]
GO
ALTER ROLE [db_datareader] ADD MEMBER [Admin]
GO
ALTER ROLE [db_datawriter] ADD MEMBER [Admin]
GO
