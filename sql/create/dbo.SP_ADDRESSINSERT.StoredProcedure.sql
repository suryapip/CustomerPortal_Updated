USE [Portal]
GO
/****** Object:  StoredProcedure [dbo].[SP_ADDRESSINSERT]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP PROCEDURE IF EXISTS [dbo].[SP_ADDRESSINSERT]
GO
/****** Object:  StoredProcedure [dbo].[SP_ADDRESSINSERT]    Script Date: 3/5/2020 5:08:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Suryakant Madane
-- Create date: 18-FEB-2020
-- Description:	To get id of recent generated address
-- =============================================

CREATE PROCEDURE [dbo].[SP_ADDRESSINSERT]( 
@LINE1 NVARCHAR(50),
@LINE2 NVARCHAR(50),
@LINE3 NVARCHAR(50),
@MUNICIPALITY NVARCHAR(50),
@STATEORPROVINCE NVARCHAR(50),
@POSTALCODE NVARCHAR(50),
@COUNTRY NVARCHAR(50),
@ADDRESSID INT OUTPUT
)
AS
BEGIN

INSERT INTO [DBO].[ADDRESSES]
           ([ID]
           ,[LINE1]
           ,[LINE2]
           ,[LINE3]
           ,[MUNICIPALITY]
           ,[STATEORPROVINCE]
           ,[POSTALCODE]
           ,[COUNTRY])
     VALUES
           (NEWID()
           ,@LINE1
           ,@LINE2
           ,@LINE3
           ,@MUNICIPALITY
           ,@STATEORPROVINCE
           ,@POSTALCODE
           ,@COUNTRY)

		   SET @ADDRESSID = SCOPE_IDENTITY()  
END
GO
