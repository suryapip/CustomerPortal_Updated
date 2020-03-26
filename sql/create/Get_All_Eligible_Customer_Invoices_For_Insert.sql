USE [Portal]
GO
/****** Object:  StoredProcedure [dbo].[Get_All_Eligible_Customer_Invoices_For_Insert]    Script Date: 26-03-2020 09:41:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- AUTHOR:		Vikas Jhanjhari
-- CREATE DATE: 23 - Mar - 2020
-- DESCRIPTION:	TO GET ALL ELIGIBLE CUSTOMERS and their invoices
-- =============================================
ALTER PROCEDURE [dbo].[Get_All_Eligible_Customer_Invoices_For_Insert]

AS
BEGIN

	IF(OBJECT_ID('Portal.DBO.Temp_Invoices_For_Insert') IS NOT NULL) BEGIN DROP TABLE Temp_Invoices_For_Insert END

	SELECT  dbinv.SOLDTOCUST , dbinv.BillToCust,
			uc.ClaimValue,
			dbinv.NUMBER DBInv_Number,
			dbinv.Balance DBInv_Balance,
			dbinv.PAYTERMS,
			dbinv.DateAdded,
			dbinv.DueDate DBInv_DueDate,
			dbinv.BalCur DBInv_BalCur,
			dbinv.SUBTOTAL DBInv_SubTotal,
			inv.BilledToAccountNumber ,
			dbinv.Rowversion ,
			inv.InvoiceNumber ,
			inv.Balance INVBalance,
			CONVERT(DATETIME, SWITCHOFFSET(CONVERT(DATETIMEOFFSET, inv.CreatedOn), DATENAME(TzOffset, SYSDATETIMEOFFSET()))) AS CreatedOnInLocalTime ,
			CONVERT(DATETIME, SWITCHOFFSET(CONVERT(DATETIMEOFFSET, inv.ModifiedOn), DATENAME(TzOffset, SYSDATETIMEOFFSET()))) AS ModifiedOnInLocalTime ,
			inv.[ExternalRowVersion1] ,
			acct.Number ,
			CONVERT(DATETIME, SWITCHOFFSET(CONVERT(DATETIMEOFFSET, acct.CreatedOn), DATENAME(TzOffset, SYSDATETIMEOFFSET()))) AS AcctCreatedOnInLocalTime ,
			CASE WHEN dbinv.Rowversion <> inv.[ExternalRowVersion1] THEN 'Waiting Update to Portal.dbo.Invoices'
				 WHEN dbinv.Rowversion = inv.[ExternalRowVersion1] THEN 'Up to Date'
				 ELSE 'Invoice Not Migrated from PortalDB into Portal'
			END AS 'Updated from PortalDB?'
	INTO 
		Temp_Invoices_For_Insert
	FROM    
		[PortalDB].[dbo].[INVOICE_HEADER_PHASE2] dbinv
		LEFT JOIN [Portal].[dbo].[Invoices] inv ON inv.InvoiceNumber = dbinv.NUMBER
		INNER JOIN [Portal].[dbo].[Accounts] acct ON acct.Number = dbinv.SOLDTOCUST
		LEFT JOIN [Portal].[dbo].[UserClaims] uc ON uc.ClaimValue = acct.Number
	WHERE   
		InvoiceNumber IS NULL
		AND uc.ClaimValue IS NOT null
	ORDER BY 
		dbinv.DateAdded DESC

SELECT DBInv_Number AS InvoiceNumber, Number AS CustomerNumber,  DBInv_DueDate AS DueDate, DBInv_Balance AS Balance, DBInv_BalCur AS BalCur, DBInv_SubTotal AS SubTotal  FROM Temp_Invoices_For_Insert

END


