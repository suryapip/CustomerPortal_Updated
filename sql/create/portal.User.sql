USE [Portal]
GO
/****** Object:  User [portal]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP USER IF EXISTS [portal]
GO
/****** Object:  User [portal]    Script Date: 3/5/2020 5:08:22 PM ******/
CREATE USER [portal] WITHOUT LOGIN WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_owner] ADD MEMBER [portal]
GO
