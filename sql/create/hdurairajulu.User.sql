USE [Portal]
GO
/****** Object:  User [hdurairajulu]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP USER IF EXISTS [hdurairajulu]
GO
/****** Object:  User [hdurairajulu]    Script Date: 3/5/2020 5:08:22 PM ******/
CREATE USER [hdurairajulu] FOR LOGIN [hdurairajulu] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_datareader] ADD MEMBER [hdurairajulu]
GO
