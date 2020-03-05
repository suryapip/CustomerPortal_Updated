USE [Portal]
GO
/****** Object:  User [DMZ_Backup]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP USER IF EXISTS [DMZ_Backup]
GO
/****** Object:  User [DMZ_Backup]    Script Date: 3/5/2020 5:08:22 PM ******/
CREATE USER [DMZ_Backup] FOR LOGIN [DMZ_Backup] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_owner] ADD MEMBER [DMZ_Backup]
GO
ALTER ROLE [db_datareader] ADD MEMBER [DMZ_Backup]
GO
