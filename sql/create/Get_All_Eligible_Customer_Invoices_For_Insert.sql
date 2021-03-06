USE [Portal]
GO
/****** Object:  StoredProcedure [dbo].[Get_All_Eligible_Customer_Invoices_For_Insert]    Script Date: 07-04-2020 20:53:30 ******/
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
			dbinv.Balance,
			dbinv.PAYTERMS,
			dbinv.DateAdded,
			dbinv.DueDate ,
			dbinv.BalCur,
			dbinv.SUBTOTAL,
			inv.BilledToAccountNumber ,
			dbinv.Rowversion ,
			inv.InvoiceNumber ,
			inv.Balance INVBalance,
			CONVERT(DATETIME, SWITCHOFFSET(CONVERT(DATETIMEOFFSET, inv.CreatedOn), DATENAME(TzOffset, SYSDATETIMEOFFSET()))) AS CreatedOnInLocalTime ,
			CONVERT(DATETIME, SWITCHOFFSET(CONVERT(DATETIMEOFFSET, inv.ModifiedOn), DATENAME(TzOffset, SYSDATETIMEOFFSET()))) AS ModifiedOnInLocalTime ,
			inv.[ExternalRowVersion1] ,
			acct.Number,
			usr.Email,
			acct.Language acc_Lang 
			,ISNULL(BalDBInv.TotalDue,0) AS TotalDue
			--,ISNULL(dbinv.[COMPNAME],'')+ ISNULL(AP.Line1,'')+ ISNULL(dbinv.[CURRENCY],'')+ ISNULL(dbinv.[WireName],'') + ISNULL(AB.Line1,'') AS CompanyDetaiils
			,dbinv.BILLTOADD1 AS BILLTOADD1
			,CONVERT(DATETIME, SWITCHOFFSET(CONVERT(DATETIMEOFFSET, acct.CreatedOn), DATENAME(TzOffset, SYSDATETIMEOFFSET()))) AS AcctCreatedOnInLocalTime 
			,CASE WHEN dbinv.Rowversion <> inv.[ExternalRowVersion1] THEN 'Waiting Update to Portal.dbo.Invoices'
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
		LEFT JOIN [Portal].[dbo].[Users] usr ON uc.UserId = usr.Id
		LEFT JOIN 
			(Select SOLDTOCUST , SUM(Balance) AS TotalDue FROM [PortalDB].[dbo].[INVOICE_HEADER_PHASE2]  Group By SOLDTOCUST) BalDBInv
				ON BalDBInv.SOLDTOCUST =dbinv.SOLDTOCUST 

		--LEFT JOIN [Portal].[dbo].[Companies] C ON C.Name=dbinv.[COMPNAME] AND C.CURRENCY=dbinv.[CURRENCY] 
		--	AND C.WireName=dbinv.[WireName] AND dbinv.Email=C.Email
		--LEFT JOIN [Portal].[dbo].[Addresses] AP ON AP.ID=C.PHYSICALADDRESSID
		--LEFT JOIN [Portal].[dbo].[Addresses] AB ON AB.ID=C.BILLINGADDRESSID

	WHERE   
		InvoiceNumber IS NULL
		AND uc.ClaimValue IS NOT null
		AND dbinv.BILLTOCUST = dbinv.SOLDTOCUST -- Filter out invoices where Billto and SoldTo doesn't match to avoid any data issues
		
		AND DATEDIFF(hh, usr.CREATEDON,GETUTCDATE())>6   /*requested by Brandon to avoid importing invoices for the users regiseterd in last 6 hours */ 
	ORDER BY 
		dbinv.DateAdded DESC

SELECT DBInv_Number AS InvoiceNumber, Number AS CustomerNumber, CAST(CAST(DueDate AS DATE) as nvarchar) As DueDate, CAST(Balance  as decimal(18,2)) AS Balance, BalCur, CAST(TotalDue as decimal(18,2)) As Subtotal, acc_Lang, Email FROM Temp_Invoices_For_Insert



END


-- Select Top 1 * from [UserClaims]
-- Select Top 1 * from [Users]
-- Select dateadded,* from [PortalDB].[dbo].[INVOICE_HEADER_PHASE2] dbinv WHERE SOLDTOCUST='247250' order by DateAdded DESC
-- INV1110918287

-- Select CREATEDON, DATEDIFF(hh, CREATEDON,GETUTCDATE()),getutcdate(),getdate() From Users  WHERE DATEDIFF(hh, CREATEDON,GETUTCDATE())>6 order by 2