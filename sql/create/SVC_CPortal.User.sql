USE [Portal]
GO
/****** Object:  User [SVC_CPortal]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP USER IF EXISTS [SVC_CPortal]
GO
/****** Object:  User [SVC_CPortal]    Script Date: 3/5/2020 5:08:22 PM ******/
CREATE USER [SVC_CPortal] FOR LOGIN [SVC_CPortal] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_owner] ADD MEMBER [SVC_CPortal]
GO
