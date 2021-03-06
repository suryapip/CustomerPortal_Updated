USE [Portal]
GO
/****** Object:  StoredProcedure [dbo].[SP_INSERTINVOICEDATA]    Script Date: 3/5/2020 5:08:22 PM ******/
DROP PROCEDURE IF EXISTS [dbo].[SP_INSERTINVOICEDATA]
GO
/****** Object:  StoredProcedure [dbo].[SP_INSERTINVOICEDATA]    Script Date: 3/5/2020 5:08:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- AUTHOR:		SURYAKANT MADANE
-- CREATE DATE: 20-FEB-2020
-- DESCRIPTION:	TO GET SINGLE INVOICE AT A TIME FOR CUSTOMER
-- =============================================
CREATE PROCEDURE [dbo].[SP_INSERTINVOICEDATA]
( 
	@ACCOUNTNUMBER  NVARCHAR(MAX),
	@INVOICENUMBER  NVARCHAR(MAX)
)
AS
BEGIN
	-- SET NOCOUNT ON ADDED TO PREVENT EXTRA RESULT SETS FROM
	-- INTERFERING WITH SELECT STATEMENTS.
	SET NOCOUNT ON;

IF(OBJECT_ID('TEMPDB..#INVOICEDATA') IS NOT NULL) BEGIN DROP TABLE #INVOICEDATA END

SELECT	* INTO #INVOICEDATA
FROM (
		SELECT TOP 1 ISNULL(IH.[ADD1],'')AS ADD1, IH.[ADD2], IH.[ADD3], IH.[CITY] , IH.[STATE], IH.[POSTAL], IH.[COUNTRY]
			,IH.[BILLTOADD1], IH.[BILLTOADD2], IH.[BILLTOADD3], IH.[BILLTOCITY], IH.[BILLTOSTATE], IH.[BILLTOPOSTAL], IH.[BILLTOCOUNTRY]
			,IH.[SHIPTOADD1], IH.[SHIPTOADD2], IH.[SHIPTOADD3], IH.[SHIPTOCITY], IH.[SHIPTOSTATE], IH.[SHIPTOPOSTAL], IH.[SHIPTOCOUNTRY]
			,IH.[REMITADD1], IH.[REMITADD2], IH.[REMITADD3], IH.[REMITCITY], IH.[REMITSTATE], IH.[REMITPOSTAL], IH.[REMITCOUNTRY]
			,IH.[PAYBYADD1], IH.[PAYBYADD2], IH.[PAYBYADD3], IH.[PAYBYZIP], IH.[PAYBYCTYSTATE]
			
			,IH.[NUMBER] AS INVOICENUMBER, IH.[COMPNAME], IH.[EMAIL], IH.[PHONE], IH.[FAX]
			
			,IH.[WIRENAME], IH.[WIREBANK], IH.[WIREBRANCH], IH.[WIREACCT], IH.[WIREROUTING], IH.[CURRENCY]
			,IH.[WIREBANKID], IH.[SWIFT], IH.[WIRECUR], IH.[SWIFTNAME], IH.[REMITIBAN], IH.[REMITSORTCODE]
			,IH.[WIRECLEARING], IH.[WIRENAME2], IH.[WIREBANK2], IH.[WIREACCT2], IH.[SWIFT2]
			,IH.[WIRECUR2], IH.[KVKNUMBER], IH.[TAXID], IH.[TAXIDPREFIX]

			,IH.[DATE], IH.[CURRENCY] AS INVOICECURRENCY, IH.[BILLTOCUST], IH.[SOLDTOCUST], IH.[CUSTREF]
			,IH.[INVSTARTDATE], IH.[DETENDDATE], IH.[CUSTPO], IH.[SHIPVIA], IH.[INCOTERMS], IH.[PAYTERMS]
			,IH.[DUEDATE], IH.[SUBTOTAL], IH.[BALCUR], IH.[BALANCE]
			,IH.[CREDAT_0], IH.[UPDDAT_0]
			,IH.[ROWVERSION] AS INVOICEROWVERSION
			,IH.[DATEADDED] AS INVOICEDATEADDED

			,IH.[LOGO], IH.[DOCTYPE], IH.[BILLTONAME], IH.[SHIPTONAME], IH.[MEMO], IH.[PDCRAMT], IH.[PAYREF]
			,IH.[CHECKNUM], IH.[PAYAMT], IH.[REMITCUR], IH.[REMITNAME], IH.[IMPORTETOTAL]
			,IH.[CUSTTAXPREFIX], IH.[CUSTTAXID], IH.[PAYBYCUST], IH.[PAYBYNAME]
			,IH.CPY

			,CU.[ADDRESS1],CU.[ADDRESS2],CU.[ADDRESS3],CU.[CITY] AS CUSTCITY,CU.[STATE] AS CUSTSTATE,CU.[POSTALCODE],CU.[COUNTRYNAME]
			,CU.[CUSTOMERNUMBER],CU.[CUSTOMERNAME],CU.[CUSTOMERPIN],CU.[PHONENUMBER],CU.[COUNTRYCODE],CU.[LANGUAGE]
			--,CU.[ROWVERSION] AS CUSTROWVERSION
			,CU.[CURRENCY] AS CUSTCURRENCY
			,CU.[PTE_0]
			,CU.[DATECREATED],CU.[DATEADDED],CU.[DATEUPDATED]

			,ID.[NUMBER]
			,ID.[LINENUMBER], ID.[ITEM], ID.[ITEMDESC], ID.[QTY], ID.[PRICE], ID.[EXTAMT]
			,ID.[LINETAXRATE]

			,IT.[NUM_0], IT.[BPR_0], IT.[TAXDESC], IT.[TAXAMT]

	FROM  [PORTALDB].[DBO].INVOICE_HEADER_PHASE2 IH
	  LEFT JOIN [PORTALDB].DBO.INVOICE_DETAILS_PHASE2 ID
	  ON IH.NUMBER = ID.NUMBER
	  LEFT JOIN [PORTALDB].DBO.INVOICE_TAXES IT
	  ON IH.NUMBER = IT.NUM_0
	  INNER JOIN [PORTALDB].DBO.CUSTOMER_PHASE2 CU
	  ON CU.CUSTOMERNUMBER = IH.BILLTOCUST
	  WHERE (IH.BILLTOCUST = @ACCOUNTNUMBER) 
	  AND (IH.NUMBER = @INVOICENUMBER)
  ) AS X

  DECLARE @INVENUMBER NVARCHAR(MAX);
  SET @INVENUMBER=(SELECT INVOICENUMBER  FROM #INVOICEDATA)

  IF NOT EXISTS(SELECT INVOICENUMBER FROM #INVOICEDATA)
  BEGIN
  RETURN 
  END

  IF (@INVENUMBER IS NULL)
  BEGIN
  RETURN 
  END
  
--1.INSERTING ALL ADDRESSESS ASSOCIATED WITH THE INVOICE
-------------------------------------------------------------------------------------------------
--1.1 INVOICE PHYSICAL ADDRESS
DECLARE @INVOICEADDRESS AS UNIQUEIDENTIFIER
SET @INVOICEADDRESS = (SELECT NEWID())
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
           ((SELECT @INVOICEADDRESS)
           ,(SELECT ISNULL([ADD1],'')    FROM #INVOICEDATA)
           ,(SELECT ISNULL([ADD2],'')     FROM #INVOICEDATA)
           ,(SELECT ISNULL([ADD2],'')     FROM #INVOICEDATA)
           ,(SELECT ISNULL([CITY],'')     FROM #INVOICEDATA)
		   ,(SELECT ISNULL([STATE],'') 	  FROM #INVOICEDATA)
		   ,(SELECT ISNULL([POSTAL],'')   FROM #INVOICEDATA)
		   ,(SELECT ISNULL([COUNTRY],'')  FROM #INVOICEDATA)) 

--1.2 INVOICE INVOICE BILL ADDRESS
DECLARE @INVOICEBILLADDRESS AS UNIQUEIDENTIFIER
SET @INVOICEBILLADDRESS =  (SELECT NEWID())
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
           ((SELECT @INVOICEBILLADDRESS)
           ,(SELECT ISNULL([BILLTOADD1],'')   FROM #INVOICEDATA)
           ,(SELECT ISNULL([BILLTOADD2],'')  FROM #INVOICEDATA)
           ,(SELECT ISNULL([BILLTOADD3],'')  FROM #INVOICEDATA)
           ,(SELECT ISNULL([BILLTOCITY],'')  FROM #INVOICEDATA)
		   ,(SELECT ISNULL([BILLTOSTATE],'')  FROM #INVOICEDATA)
		   ,(SELECT ISNULL([BILLTOPOSTAL],'')  FROM #INVOICEDATA)
		   ,(SELECT ISNULL([BILLTOCOUNTRY],'')  FROM #INVOICEDATA)) 

--1.3 INVOICE INVOICE SHIP ADDRESS
DECLARE @INVOICESHIPADDRESS AS UNIQUEIDENTIFIER
SET @INVOICESHIPADDRESS =  (SELECT NEWID())
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
           ((SELECT @INVOICESHIPADDRESS)
           ,(SELECT ISNULL(SHIPTOADD1,'')  FROM #INVOICEDATA)
           ,(SELECT ISNULL(SHIPTOADD2,'') FROM #INVOICEDATA)
           ,(SELECT ISNULL(SHIPTOADD3,'') FROM #INVOICEDATA)
           ,(SELECT ISNULL(SHIPTOCITY,'') FROM #INVOICEDATA)
		   ,(SELECT ISNULL(SHIPTOSTATE,'') FROM #INVOICEDATA)
		   ,(SELECT ISNULL(SHIPTOPOSTAL,'') FROM #INVOICEDATA)
		   ,(SELECT ISNULL(SHIPTOCOUNTRY,'') FROM #INVOICEDATA)) 

--1.4 INVOICE INVOICE REMIT ADDRESS
DECLARE @INVOICEREMITADDRESS AS UNIQUEIDENTIFIER
SET @INVOICEREMITADDRESS =  (SELECT NEWID())
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
           ((SELECT @INVOICEREMITADDRESS)
           ,(SELECT ISNULL(REMITADD1,'')  FROM #INVOICEDATA)
           ,(SELECT ISNULL(REMITADD2,'') FROM #INVOICEDATA)
           ,(SELECT ISNULL(REMITADD3,'') FROM #INVOICEDATA)
           ,(SELECT ISNULL(REMITCITY,'') FROM #INVOICEDATA)
		   ,(SELECT ISNULL(REMITSTATE,'') FROM #INVOICEDATA)
		   ,(SELECT ISNULL(REMITPOSTAL,'') FROM #INVOICEDATA)
		   ,(SELECT ISNULL(REMITCOUNTRY,'') FROM #INVOICEDATA)) 

--1.5 INVOICE INVOICE PAYBY ADDRESS
DECLARE @INVOICEPAYBYADDRESS AS UNIQUEIDENTIFIER
SET @INVOICEPAYBYADDRESS = NEWID()
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
           ((SELECT @INVOICEPAYBYADDRESS)
           ,(SELECT ISNULL(PAYBYADD1,'')  FROM #INVOICEDATA)
           ,(SELECT ISNULL(PAYBYADD2,'') FROM #INVOICEDATA)
           ,(SELECT ISNULL(PAYBYADD3,'') FROM #INVOICEDATA)
           ,(SELECT ISNULL(PAYBYCTYSTATE,'') FROM #INVOICEDATA)
		   ,(SELECT ISNULL(PAYBYCTYSTATE,'') FROM #INVOICEDATA)
		   ,(SELECT ISNULL(PAYBYZIP,'') FROM #INVOICEDATA)
		   ,(SELECT ISNULL(PAYBYCTYSTATE,'') FROM #INVOICEDATA)) 

--1.6 CUSTOMER PHYSICAL ADDRESS
DECLARE @CUSTOMERADDRESS AS UNIQUEIDENTIFIER
SET @CUSTOMERADDRESS = NEWID()
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
           ((SELECT @CUSTOMERADDRESS)
           ,(SELECT ISNULL(ADDRESS1,'')  FROM #INVOICEDATA)
           ,(SELECT ISNULL(ADDRESS2,'') FROM #INVOICEDATA)
           ,(SELECT ISNULL(ADDRESS3,'') FROM #INVOICEDATA)
           ,(SELECT ISNULL(CUSTCITY,'') FROM #INVOICEDATA)
		   ,(SELECT ISNULL(CUSTSTATE,'') FROM #INVOICEDATA)
		   ,(SELECT ISNULL(POSTALCODE,'') FROM #INVOICEDATA)
		   ,(SELECT ISNULL(COUNTRYNAME,'') FROM #INVOICEDATA)) 


--2.INSERTING COMPANY DETAILS ASSOCIATED WITH THE INVOICE
-------------------------------------------------------------------------------------------------
-- SELECT TOP 10 * FROM [DBO].[COMPANIES]

DECLARE @COMPANYNUMBER NVARCHAR(MAX)=NULL;

SET @COMPANYNUMBER=(SELECT NUMBER
                        FROM [DBO].COMPANIES
                        WHERE NUMBER = (SELECT INVOICENUMBER  FROM #INVOICEDATA))

IF NOT EXISTS(SELECT NUMBER
                        FROM [DBO].COMPANIES
                        WHERE NUMBER = (SELECT INVOICENUMBER  FROM #INVOICEDATA))
 BEGIN
            INSERT INTO [DBO].[COMPANIES]
           ([CREATEDBY]
           ,[CREATEDON]
           ,[MODIFIEDBY]
           ,[MODIFIEDON]
           ,[NUMBER]
           ,[NAME]
           ,[EMAIL]
           ,[PHONENUMBER]
           ,[FAXNUMBER]
           ,[WIRENAME]
           ,[WIREBANK]
           ,[WIREBRANCH]
           ,[WIREACCOUNTNUMBER]
           ,[WIREROUTINGNUMBER]
           ,[CURRENCY]
           ,[PHYSICALADDRESSID]
           ,[MAILINGADDRESSID]
           ,[BILLINGADDRESSID]
           ,[SHIPPINGADDRESSID]
           ,[EXTERNALROWVERSION]
           ,[KVKNUMBER]
           ,[TAXID]
           ,[TAXIDPREFIX])
     VALUES
           ('SYSTEM'
           ,(SELECT GETUTCDATE())
           ,'SYSTEM'
           ,(SELECT GETUTCDATE())
           ,(SELECT INVOICENUMBER  FROM #INVOICEDATA)
           ,(SELECT COMPNAME FROM #INVOICEDATA)
           ,(SELECT EMAIL  FROM #INVOICEDATA)
           ,(SELECT PHONE  FROM #INVOICEDATA)
           ,(SELECT FAX  FROM #INVOICEDATA)
           ,(SELECT WIRENAME  FROM #INVOICEDATA)
           ,(SELECT WIREBANK  FROM #INVOICEDATA)
           ,(SELECT WIREBRANCH  FROM #INVOICEDATA)
           ,(SELECT WIREACCT  FROM #INVOICEDATA)
           ,(SELECT WIREROUTING  FROM #INVOICEDATA)
           ,(SELECT CURRENCY  FROM #INVOICEDATA)
           ,(SELECT @INVOICEADDRESS)
           ,(SELECT @INVOICEADDRESS)
           ,(SELECT @INVOICEBILLADDRESS)
           ,(SELECT @INVOICESHIPADDRESS)
           ,(SELECT INVOICEROWVERSION  FROM #INVOICEDATA)
           ,(SELECT KVKNUMBER  FROM #INVOICEDATA)
           ,(SELECT TAXID  FROM #INVOICEDATA)
           ,(SELECT TAXIDPREFIX  FROM #INVOICEDATA))

		    SET @COMPANYNUMBER=(SELECT INVOICENUMBER FROM #INVOICEDATA)
END

 --3.INSERTING ACCOUNT DETAILS ASSOCIATED WITH THE INVOICE
-------------------------------------------------------------------------------------------------
--SELECT TOP 10 * FROM [DBO].[ACCOUNTS] WHERE COMPANYNUMBER1 IS NOT NULL

SELECT * FROM #INVOICEDATA

DECLARE @ACCTNUMBER NVARCHAR(MAX)=NULL;
SET @ACCTNUMBER=(SELECT NUMBER
                        FROM [DBO].ACCOUNTS
                        WHERE NUMBER = (SELECT CUSTOMERNUMBER  FROM #INVOICEDATA))

IF NOT EXISTS(SELECT NUMBER
                        FROM [DBO].ACCOUNTS
                        WHERE NUMBER = (SELECT CUSTOMERNUMBER  FROM #INVOICEDATA))

 BEGIN
           INSERT INTO [DBO].[ACCOUNTS]
           ([CREATEDBY]
           ,[CREATEDON]
           ,[MODIFIEDBY]
           ,[MODIFIEDON]
           ,[NUMBER]
           ,[PIN]
           ,[NAME]
           ,[EMAIL]
           ,[PHONENUMBER]
           ,[FAXNUMBER]
           ,[CURRENCY]
           ,[PHYSICALADDRESSID]
           ,[MAILINGADDRESSID]
           ,[BILLINGADDRESSID]
           ,[SHIPPINGADDRESSID]
           ,[SALESPERSON]
           ,[ACCOUNTREPRESENTATIVE]
           ,[EXTERNALROWVERSION]
           ,[COMPANYNUMBER1]
           ,[COMPANYNUMBER]
           ,[TAXID]
           ,[TAXPREFIX]
           ,[LANGUAGE])
     VALUES
           ('SYSTEM'
           , (SELECT GETUTCDATE())
           , 'SYSTEM'
           , (SELECT GETUTCDATE())
           , (SELECT [CUSTOMERNUMBER] FROM #INVOICEDATA)
           , (SELECT CUSTOMERPIN FROM #INVOICEDATA)
           , (SELECT CUSTOMERNAME FROM #INVOICEDATA)
           , (SELECT EMAIL FROM #INVOICEDATA)
           , (SELECT PHONENUMBER FROM #INVOICEDATA)
           , (SELECT FAX FROM #INVOICEDATA)
           , (SELECT CUSTCURRENCY FROM #INVOICEDATA)
           , (SELECT @CUSTOMERADDRESS)
           , (SELECT @CUSTOMERADDRESS)
           , (SELECT @INVOICEBILLADDRESS)
           , (SELECT @INVOICESHIPADDRESS)
           , (SELECT PTE_0 FROM #INVOICEDATA)
           , NULL
           , NULL
           , NULL
           , (SELECT @COMPANYNUMBER)
           , NULL
           , NULL
           , (SELECT [LANGUAGE] FROM #INVOICEDATA))
END

  --4.INSERTING INVOICE DETAILS ASSOCIATED WITH THE CUSTOMER
-------------------------------------------------------------------------------------------------
--SELECT TOP 10 * FROM [DBO].[INVOICES] WHERE SELLINGENTITYNUMBER IS NOT NULL


--DELETE FROM [PORTAL].DBO.[INVOICES] WHERE INVOICENUMBER = @INVENUMBER

IF NOT EXISTS(SELECT INVOICENUMBER
                        FROM [DBO].INVOICETAXES
                        WHERE INVOICENUMBER =@INVENUMBER)
 BEGIN
           INSERT INTO [DBO].[INVOICES]
           ([CREATEDBY]
           ,[CREATEDON]
           ,[MODIFIEDBY]
           ,[MODIFIEDON]
           ,[SOLDTOACCOUNTNUMBER]
           ,[BILLEDTOACCOUNTNUMBER]
           ,[BILLINGENTITYNUMBER]
           ,[EXTERNALROWVERSION]
           ,[INVOICENUMBER]
           ,[INVOICEDATE]
           ,[CUSTOMERREFERENCENUMBER]
           ,[CUSTOMERPURCHASEORDERNUMBER]
           ,[SHIPPINGADDRESSID]
           ,[SHIPPINGNUMBER]
           ,[SHIPPINGMETHOD]
           ,[SHIPPINGRESULT]
           ,[SERVICEFROM]
           ,[SERVICETO]
           ,[INCOTERMS]
           ,[PAYMENTTERMS]
           ,[COMMENTS]
           ,[TAXID]
           ,[CURRENCY]
           ,[DISCOUNTAMOUNT]
           ,[TOTAL]
           ,[SUBTOTALAMOUNT]
           ,[TAXRATE]
           ,[TAXAMOUNT]
           ,[BALANCE]
           ,[BALANCECURRENCY]
           ,[DATEDUE]
           ,[SELLINGENTITYNUMBER]
           ,[EXTERNALROWVERSION1])
     VALUES
           ('SYSTEM'
           ,(SELECT GETUTCDATE())
           ,'SYSTEM'
           ,(SELECT GETUTCDATE())
           ,(SELECT SOLDTOCUST FROM #INVOICEDATA)
           ,(SELECT BILLTOCUST FROM #INVOICEDATA)
           ,NULL
           ,(SELECT INVOICEROWVERSION FROM #INVOICEDATA)
           ,(SELECT @INVENUMBER)
           ,(SELECT [DATE] FROM #INVOICEDATA)
           ,(SELECT CUSTREF FROM #INVOICEDATA)
           ,(SELECT CUSTPO FROM #INVOICEDATA)
           ,(SELECT @INVOICESHIPADDRESS)
           ,NULL
           ,(SELECT SHIPVIA FROM #INVOICEDATA)
           ,NULL
           ,(SELECT INVSTARTDATE FROM #INVOICEDATA)
			,(SELECT DETENDDATE FROM #INVOICEDATA)
           ,(SELECT INCOTERMS FROM #INVOICEDATA)
           ,(SELECT PAYTERMS FROM #INVOICEDATA)
           ,NULL
           ,(SELECT TAXID FROM #INVOICEDATA)
           ,(SELECT INVOICECURRENCY FROM #INVOICEDATA)
           ,0.00
           ,(SELECT ISNULL(SUBTOTAL,0.00) FROM #INVOICEDATA)
           ,(SELECT ISNULL(SUBTOTAL,0.00) FROM #INVOICEDATA)
           ,(SELECT ISNULL(LINETAXRATE,0.00) FROM #INVOICEDATA)
           ,(SELECT ISNULL(TAXAMT,0.00) FROM #INVOICEDATA)
           ,(SELECT ISNULL(BALANCE,0.00) FROM #INVOICEDATA)
		  ,(SELECT ISNULL(BALCUR,'') FROM #INVOICEDATA)
           ,(SELECT DUEDATE FROM #INVOICEDATA)
           ,NULL
           ,(SELECT INVOICEROWVERSION FROM #INVOICEDATA))
END

  --5.INSERTING INVOICE TAX ASSOCIATED WITH THE CUSTOMER
-------------------------------------------------------------------------------------------------
--SELECT TOP 10 * FROM [DBO].INVOICETAXES 


--DELETE FROM [PORTAL].DBO.INVOICETAXES WHERE  INVOICENUMBER = @INVENUMBER

IF NOT EXISTS(SELECT INVOICENUMBER
                        FROM [DBO].INVOICETAXES
                        WHERE INVOICENUMBER =@INVENUMBER)
 BEGIN
       INSERT INTO [DBO].[INVOICETAXES]
           ([CREATEDBY]
           ,[CREATEDON]
           ,[MODIFIEDBY]
           ,[MODIFIEDON]
           ,[INVOICENUMBER]
           ,[TAXAMOUNT]
           ,[TAXDESC]
           ,[BPR])
     VALUES
           ('SYSTEM'
           ,(SELECT GETUTCDATE())
           ,'SYSTEM'
           ,(SELECT GETUTCDATE())
           ,@INVENUMBER
           ,(SELECT ISNULL(TAXAMT,0.00) FROM #INVOICEDATA)
           ,(SELECT ISNULL([TAXDESC],'') FROM #INVOICEDATA) 
           ,(SELECT ISNULL(BPR_0,'') FROM #INVOICEDATA) )
END


--6.INSERTING COMPANYWIREACHDETAILS ASSOCIATED WITH THE CUSTOMER
-- SELECT TOP 10 * FROM [DBO].COMPANYWIREACHDETAILS 
-- SELECT TOP 10 * FROM PORTALDB.DBO.INVOICE_DETAILS_PHASE2

IF NOT EXISTS(SELECT INVOICENUMBER
              FROM [DBO].COMPANYWIREACHDETAILS
              WHERE INVOICENUMBER =@INVENUMBER)
 BEGIN
       
 INSERT INTO [DBO].[COMPANYWIREACHDETAILS]
           ([CREATEDBY]
           ,[CREATEDON]
           ,[MODIFIEDBY]
           ,[MODIFIEDON]
           ,[WIREBANKID]
           ,[REMITSORTCODE]
           ,[REMITBAN]
           ,[SWIFTNAME]
           ,[SWIFT]
           ,[WIRECURRENCY]
           ,[WIRENAME2]
           ,[WIREBANK2]
           ,[WIREACCOUNT2]
           ,[SWIFT2]
           ,[WIRECURRENCY2]
           ,[EXTERNALROWVERSION]
           ,[WIRECLEARING]
           ,[INVOICENUMBER]
           ,[WIREACCOUNTNUMBER]
           ,[WIREBANK]
           ,[WIREBRANCH]
           ,[WIRENAME]
           ,[WIREROUTINGNUMBER])
     VALUES
           ('SYSTEM'
           ,(SELECT GETUTCDATE())
           ,'SYSTEM'
           ,(SELECT GETUTCDATE())
		    ,(SELECT WIREBANKID FROM #INVOICEDATA) 
		    ,(SELECT REMITSORTCODE FROM #INVOICEDATA) 
		    ,(SELECT REMITIBAN FROM #INVOICEDATA) 
		    ,(SELECT SWIFTNAME FROM #INVOICEDATA) 
			 ,(SELECT SWIFT FROM #INVOICEDATA)
		    ,(SELECT WIRECUR FROM #INVOICEDATA) 
		    ,(SELECT WIRENAME2 FROM #INVOICEDATA) 
		    ,(SELECT WIREBANK2 FROM #INVOICEDATA) 
		    ,(SELECT WIREACCT2 FROM #INVOICEDATA) 
		    ,(SELECT SWIFT2 FROM #INVOICEDATA) 
		    ,(SELECT WIRECUR2 FROM #INVOICEDATA) 
		    ,(SELECT INVOICEROWVERSION FROM #INVOICEDATA) 
		    ,(SELECT WIRECLEARING FROM #INVOICEDATA)
			,(SELECT @INVENUMBER)
		    ,(SELECT WIREACCT FROM #INVOICEDATA) 
		    ,(SELECT WIREBANK FROM #INVOICEDATA) 
		    ,(SELECT WIREBRANCH FROM #INVOICEDATA) 
		    ,(SELECT WIRENAME FROM #INVOICEDATA) 
		    ,(SELECT WIREROUTING FROM #INVOICEDATA) 
			)
END

--7.INSERTING INVOICEHEADEREXTENSIONS ASSOCIATED WITH THE CUSTOMER
-- SELECT TOP 10 * FROM [DBO].INVOICEHEADEREXTENSIONS 
-- SELECT TOP 10 * FROM PORTALDB.DBO.INVOICE_DETAILS_PHASE2

--DELETE FROM [PORTAL].DBO.INVOICEHEADEREXTENSIONS WHERE  INVOICENUMBER = @INVENUMBER

IF NOT EXISTS(SELECT INVOICENUMBER
                        FROM [DBO].INVOICEHEADEREXTENSIONS
                        WHERE INVOICENUMBER = @INVENUMBER)
 BEGIN
	INSERT INTO [DBO].[INVOICEHEADEREXTENSIONS]
           ([CREATEDBY]
           ,[CREATEDON]
           ,[MODIFIEDBY]
           ,[MODIFIEDON],[INVOICENUMBER]
           ,[INVOICECURRENCY]
           ,[MEMO]
           ,[PDCRAMOUNT]
           ,[PAYMENTREFERENCE]
           ,[CHECKNUMBER]
           ,[PAYAMOUNT]
           ,[IMPORTETOT]
           ,[PAYBYCUSTOMER]
           ,[PAYBYNAME]
           ,[PAYBYADDRESSID]
           ,[EXTERNALROWVERSION]
           ,[DOCTYPE]
           ,[LOGO]
           ,[CPY]
           ,[REMITADDRESSID]
           ,[REMITCURRENCY]
           ,[REMITNAME]
           ,[BILLTONAME]
           ,[SHIPTONAME]
           ,[BILLTOADDRESSID]
           ,[CUSTTAXID]
           ,[CUSTTAXPREFIX]
           ,[SHIPTOADDRESSID])
     VALUES
           ('SYSTEM'
           ,(SELECT GETUTCDATE())
           ,'SYSTEM'
           ,(SELECT GETUTCDATE())
		    ,(SELECT @INVENUMBER)
		    ,(SELECT INVOICECURRENCY FROM #INVOICEDATA) 
		    ,(SELECT MEMO FROM #INVOICEDATA) 
		    ,(SELECT PDCRAMT FROM #INVOICEDATA) 
		    ,(SELECT PAYREF FROM #INVOICEDATA) 
		    ,(SELECT CHECKNUM FROM #INVOICEDATA) 
			 ,(SELECT PAYAMT FROM #INVOICEDATA) 
		    ,(SELECT IMPORTETOTAL FROM #INVOICEDATA) 
		    ,(SELECT PAYBYCUST FROM #INVOICEDATA) 
		    ,(SELECT PAYBYNAME FROM #INVOICEDATA) 
		    ,(SELECT @INVOICEPAYBYADDRESS) 
		    ,(SELECT INVOICEROWVERSION FROM #INVOICEDATA) 
		    ,(SELECT ISNULL(DOCTYPE,'') FROM #INVOICEDATA) 
		    ,(SELECT ISNULL(LOGO,'') FROM #INVOICEDATA) 
		    ,(SELECT CPY FROM #INVOICEDATA) 
		    ,(SELECT @INVOICEREMITADDRESS) 
		    ,(SELECT REMITCUR FROM #INVOICEDATA) 
		    ,(SELECT REMITNAME FROM #INVOICEDATA) 
		    ,(SELECT BILLTONAME FROM #INVOICEDATA) 
		    ,(SELECT SHIPTONAME FROM #INVOICEDATA) 
		    ,(SELECT @INVOICEBILLADDRESS) 
		    ,(SELECT CUSTTAXID FROM #INVOICEDATA) 
		    ,(SELECT CUSTTAXPREFIX FROM #INVOICEDATA) 
		    ,(SELECT @INVOICESHIPADDRESS) 
           )
END

-- 8.INSERTING INVOICE DETAILS ASSOCIATED WITH THE CUSTOMER
-----------------------------------------------------------------------------------------------
-- SELECT TOP 10 * FROM [DBO].INVOICEDETAILS 

--DELETE FROM [PORTAL].DBO.INVOICEDETAILS WHERE  INVOICENUMBER = @INVENUMBER

IF NOT EXISTS(SELECT INVOICENUMBER
                        FROM [DBO].INVOICEDETAILS
                        WHERE INVOICENUMBER = @INVENUMBER)
 BEGIN
 IF(OBJECT_ID('TEMPDB..#TEMP') IS NOT NULL) BEGIN DROP TABLE #TEMP END
 SELECT	* INTO  #TEMP
 FROM (
		SELECT  *  FROM  PORTALDB.DBO.INVOICE_DETAILS_PHASE2 WHERE NUMBER = @INVENUMBER
	) AS Z

WHILE (SELECT COUNT(*) FROM #TEMP) > 0
BEGIN
DECLARE @ID1 INT
    SELECT TOP 1 @ID1 =(SELECT TOP 1 LINENUMBER FROM #TEMP) 

			INSERT INTO [DBO].[INVOICEDETAILS]
				   ([CREATEDBY]
				   ,[CREATEDON]
				   ,[MODIFIEDBY]
				   ,[MODIFIEDON]
				   ,[INVOICENUMBER]
				   ,[LINENUMBER]
				   ,[ITEM]
				   ,[DESCRIPTION]
				   ,[UNITPRICE]
				   ,[UNITDISCOUNT]
				   ,[QUANTITY]
				   ,[DISCOUNT]
				   ,[EXTRAAMOUNT]
				   ,[EXTERNALROWVERSION]
				   ,[LINETAXRATE])
			 VALUES
				   ('SYSTEM'
				   ,(SELECT GETUTCDATE())
				   ,'SYSTEM'
				   ,(SELECT GETUTCDATE())
					,(SELECT @INVENUMBER) 
					,(SELECT LINENUMBER FROM #TEMP  WHERE LINENUMBER = @ID1) 
					,(SELECT ITEM FROM #TEMP  WHERE LINENUMBER = @ID1) 
					,(SELECT ITEMDESC FROM #TEMP  WHERE LINENUMBER = @ID1) 
					,(SELECT PRICE FROM #TEMP  WHERE LINENUMBER = @ID1) 
					,0.00 
					,(SELECT QTY FROM #TEMP  WHERE LINENUMBER = @ID1) 
					,0.00 
					,(SELECT EXTAMT FROM #TEMP  WHERE LINENUMBER = @ID1) 
					,(SELECT [ROWVERSION] FROM #TEMP  WHERE LINENUMBER = @ID1) 
					,(SELECT ISNULL(LINETAXRATE,0.00) FROM #TEMP  WHERE LINENUMBER = @ID1) 
				   )
     DELETE  #TEMP WHERE LINENUMBER = @ID1
END
		
END

--SELECT @INVOICEADDRESS AS INVOICEADDRESS
--SELECT @INVOICEBILLADDRESS AS "INVOICE BILLADDRESS"
--SELECT @INVOICESHIPADDRESS AS "INVOICE SHIPADDRESS"
--SELECT @INVOICEREMITADDRESS AS "INVOICE REMITADDRESS"
--SELECT @INVOICEPAYBYADDRESS AS "INVOICE PAYBYADDRESS"
--SELECT @CUSTOMERADDRESS AS "CUSTOMER ADDRESS"
--SELECT @COMPANYNUMBER AS  "COMPANY NUMBER"

END
GO
