USE [Portal]
GO
/****** Object:  User [rjaswal]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP USER IF EXISTS [rjaswal]
GO
/****** Object:  User [rjaswal]    Script Date: 3/5/2020 5:08:22 PM ******/
CREATE USER [rjaswal] FOR LOGIN [rjaswal] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_datareader] ADD MEMBER [rjaswal]
GO
