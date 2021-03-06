USE [Portal]
GO
/****** Object:  User [portaltest]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP USER IF EXISTS [portaltest]
GO
/****** Object:  User [portaltest]    Script Date: 3/5/2020 5:08:22 PM ******/
CREATE USER [portaltest] FOR LOGIN [portaltest] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_owner] ADD MEMBER [portaltest]
GO
ALTER ROLE [db_accessadmin] ADD MEMBER [portaltest]
GO
ALTER ROLE [db_datareader] ADD MEMBER [portaltest]
GO
ALTER ROLE [db_datawriter] ADD MEMBER [portaltest]
GO
