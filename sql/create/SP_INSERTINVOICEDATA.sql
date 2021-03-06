USE [Portal]
GO
/****** Object:  StoredProcedure [dbo].[SP_INSERTINVOICEDATA]    Script Date: 03-04-2020 12:13:59 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- AUTHOR:		SURYAKANT MADANE
-- CREATE DATE: 20-FEB-2020
-- DESCRIPTION:	TO GET SINGLE INVOICE AT A TIME FOR CUSTOMER
-- =============================================
ALTER PROCEDURE [dbo].[SP_INSERTINVOICEDATA]
( 
	@ACCOUNTNUMBER  NVARCHAR(MAX),
	@INVOICENUMBER  NVARCHAR(MAX)
)
AS
BEGIN
SET ANSI_NULLS ON
SET ANSI_WARNINGS ON
SET ARITHABORT OFF 
SET QUOTED_IDENTIFIER ON

IF (@ACCOUNTNUMBER IS NULL OR @INVOICENUMBER IS NULL)
  BEGIN
	RETURN 
  END

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
			,CAST (CU.[ROWVERSION] AS binary)  CUSTROWVERSION
			,CU.[CURRENCY] AS CUSTCURRENCY
			,CU.[PTE_0]
			,CU.[DATECREATED],CU.[DATEADDED],CU.[DATEUPDATED]

			,ID.[NUMBER]
			,ID.[LINENUMBER], ID.[ITEM], ID.[ITEMDESC], ID.[QTY], ID.[PRICE], ID.[EXTAMT]
			,ID.[LINETAXRATE]

			,IT.[NUM_0], IT.[BPR_0], IT.[TAXDESC], IT.[TAXAMT]

	FROM  
		[PORTALDB].[DBO].INVOICE_HEADER_PHASE2 IH

	  LEFT JOIN [PORTALDB].DBO.INVOICE_DETAILS_PHASE2 ID
	  ON IH.NUMBER = ID.NUMBER

		LEFT JOIN [PORTALDB].DBO.INVOICE_TAXES IT
			ON IH.NUMBER = IT.NUM_0
		INNER JOIN [PORTALDB].DBO.CUSTOMER_PHASE2 CU
		  ON CU.CUSTOMERNUMBER = IH.BILLTOCUST 

	WHERE 
		(IH.BILLTOCUST = @ACCOUNTNUMBER ) 
		AND (IH.NUMBER = @INVOICENUMBER)
  ) AS X

  -- check if invocie exist
  IF NOT EXISTS(SELECT INVOICENUMBER FROM #INVOICEDATA)
  BEGIN
	--Print 'Invoice not exist'
	RETURN 
  END
  
  
--1.INSERTING ALL ADDRESSESS ASSOCIATED WITH THE INVOICE
-------------------------------------------------------------------------------------------------
--1.1 PHYSICAL ADDRESS -- will go in Companies table PhysicalAddressID column
DECLARE @PhysicalAddressID UNIQUEIDENTIFIER
SELECT 
	@PhysicalAddressID=ISNULL(ID,'')
FROM 
	Addresses A
	INNER JOIN #INVOICEDATA I ON A.[LINE1]= ISNULL(I.[ADD1],'')
    AND ISNULL(A.[LINE2],'')=ISNULL(I.[ADD2],'')
    AND ISNULL(A.[LINE3],'')=ISNULL(I.[ADD3],'')
    AND ISNULL(A.[Municipality],'')=ISNULL(I.[CITY],'')
	AND ISNULL(A.[STATEORPROVINCE],'')=ISNULL(I.[STATE],'')
    AND ISNULL(A.[POSTALCODE],'')=ISNULL(I.[POSTAL],'')
    AND ISNULL(A.[COUNTRY],'')=ISNULL(I.[COUNTRY],'')


IF	ISNULL(Convert(NVARCHAR(50),@PhysicalAddressID),'')=''
BEGIN
	SELECT @PhysicalAddressID=NewID()
	INSERT INTO [DBO].[ADDRESSES]
			   ([ID]
			   ,[LINE1]
			   ,[LINE2]
			   ,[LINE3]
			   ,[MUNICIPALITY]
			   ,[STATEORPROVINCE]
			   ,[POSTALCODE]
			   ,[COUNTRY])
		 SELECT
			   @PhysicalAddressID
			   ,ISNULL([ADD1],'')    
			   ,ISNULL([ADD2],'')     
			   ,ISNULL([ADD3],'')     
			   ,ISNULL([CITY],'')     
			   ,ISNULL([STATE],'') 	  
			   ,ISNULL([POSTAL],'')   
			   ,ISNULL([COUNTRY],'')
		FROM 
			#INVOICEDATA
END


-------------------------------------------
--1.4 INVOICE INVOICE REMIT ADDRESS
-- Will go in Companies table in the columns - MailingAddressId,BillingAddressId, ShippingAddressId
DECLARE @MailingAddressId UNIQUEIDENTIFIER
SELECT 
	@MailingAddressId=ISNULL(ID,'')
FROM 
	Addresses A
	INNER JOIN #INVOICEDATA I ON A.[LINE1]= ISNULL(I.[REMITADD1],'')
    AND ISNULL(A.[LINE2],'')=ISNULL(I.[REMITADD2],'')
    AND ISNULL(A.[LINE3],'')=ISNULL(I.[REMITADD3],'')
    AND ISNULL(A.[Municipality],'')=ISNULL(I.[REMITCITY],'')
	AND ISNULL(A.[STATEORPROVINCE],'')=ISNULL(I.[REMITSTATE],'')
    AND ISNULL(A.[POSTALCODE],'')=ISNULL(I.[REMITPOSTAL],'')
    AND ISNULL(A.[COUNTRY],'')=ISNULL(I.[REMITCOUNTRY],'')

IF	ISNULL(Convert(NVARCHAR(50),@MailingAddressId),'')=''
BEGIN
	SELECT @MailingAddressId=NewID()

	INSERT INTO [DBO].[ADDRESSES]
			   ([ID]
			   ,[LINE1]
			   ,[LINE2]
			   ,[LINE3]
			   ,[MUNICIPALITY]
			   ,[STATEORPROVINCE]
			   ,[POSTALCODE]
			   ,[COUNTRY])
		 SELECT
			   @MailingAddressId
			   ,ISNULL([REMITADD1],'')    
			   ,ISNULL([REMITADD2],'')     
			   ,ISNULL([REMITADD3],'')     
			   ,ISNULL([REMITCITY],'')     
			   ,ISNULL([REMITSTATE],'') 	  
			   ,ISNULL([REMITPOSTAL],'')   
			   ,ISNULL([REMITCOUNTRY],'')
		FROM 
			#INVOICEDATA
END

--------------------------------------------
--1.2 INVOICE INVOICE BILL ADDRESS 
-- will go in InvoiceHeaderExtension table in the BillToAddressId
DECLARE @INVOICEBILLTOADDRESS UNIQUEIDENTIFIER

SELECT 
	@INVOICEBILLTOADDRESS=ISNULL(ID,'')
FROM 
	Addresses A
	INNER JOIN #INVOICEDATA I ON A.[LINE1]= ISNULL(I.[BILLTOADD1],'')
    AND ISNULL(A.[LINE2],'')=ISNULL(I.[BILLTOADD2],'')
    AND ISNULL(A.[LINE3],'')=ISNULL(I.[BILLTOADD3],'')
    AND ISNULL(A.[Municipality],'')=ISNULL(I.[BILLTOCITY],'')
	AND ISNULL(A.[STATEORPROVINCE],'')=ISNULL(I.[BILLTOSTATE],'')
    AND ISNULL(A.[POSTALCODE],'')=ISNULL(I.[BILLTOPOSTAL],'')
    AND ISNULL(A.[COUNTRY],'')=ISNULL(I.[BILLTOCOUNTRY],'')

-- Addresses doesn't exist
IF	ISNULL(Convert(NVARCHAR(50),@INVOICEBILLTOADDRESS),'')=''
BEGIN
	SELECT @INVOICEBILLTOADDRESS=NewID()

INSERT INTO [DBO].[ADDRESSES]
           ([ID]
		   ,[LINE1]
           ,[LINE2]
           ,[LINE3]
           ,[MUNICIPALITY]
           ,[STATEORPROVINCE]
           ,[POSTALCODE]
           ,[COUNTRY])
     SELECT
           @INVOICEBILLTOADDRESS
           ,ISNULL([BILLTOADD1],'')    
           ,ISNULL([BILLTOADD2],'')     
           ,ISNULL([BILLTOADD3],'')     
           ,ISNULL([BILLTOCITY],'')     
		   ,ISNULL([BILLTOSTATE],'') 	  
		   ,ISNULL([BILLTOPOSTAL],'')   
		   ,ISNULL([BILLTOCOUNTRY],'')
	FROM 
		#INVOICEDATA
END
-----------------------------------------------
--1.3 INVOICE INVOICE SHIP ADDRESS
-- Will go in ShiptoAddressId in the InvoiceHeaderExtensions table
DECLARE @ShipToAddressId UNIQUEIDENTIFIER

SELECT 
	@ShipToAddressId=ISNULL(ID,'')
FROM 
	Addresses A
	INNER JOIN #INVOICEDATA I ON A.[LINE1]= ISNULL(I.[SHIPTOADD1],'')
    AND ISNULL(A.[LINE2],'')=ISNULL(I.[SHIPTOADD2],'')
    AND ISNULL(A.[LINE3],'')=ISNULL(I.[SHIPTOADD3],'')
    AND ISNULL(A.[Municipality],'')=ISNULL(I.[SHIPTOCITY],'')
	AND ISNULL(A.[STATEORPROVINCE],'')=ISNULL(I.[SHIPTOSTATE],'')
    AND ISNULL(A.[POSTALCODE],'')=ISNULL(I.[SHIPTOPOSTAL],'')
    AND ISNULL(A.[COUNTRY],'')=ISNULL(I.[SHIPTOCOUNTRY],'')

-- Addresses doesn't exist
IF	ISNULL(Convert(NVARCHAR(50),@ShipToAddressId),'')=''
BEGIN
	SELECT @ShipToAddressId=NewID()

INSERT INTO [DBO].[ADDRESSES]
           ([ID]
		   ,[LINE1]
           ,[LINE2]
           ,[LINE3]
           ,[MUNICIPALITY]
           ,[STATEORPROVINCE]
           ,[POSTALCODE]
           ,[COUNTRY])
     SELECT
           @ShipToAddressId
           ,ISNULL([SHIPTOADD1],'')    
           ,ISNULL([SHIPTOADD2],'')     
           ,ISNULL([SHIPTOADD3],'')     
           ,ISNULL([SHIPTOCITY],'')     
		   ,ISNULL([SHIPTOSTATE],'') 	  
		   ,ISNULL([SHIPTOPOSTAL],'')   
		   ,ISNULL([SHIPTOCOUNTRY],'')
	FROM 
		#INVOICEDATA
END

-----------------------------------------------
--1.5 INVOICE INVOICE PAYBY ADDRESS
-- Will go in PayByAddressId in the InvoiceHeaderExtensions table
DECLARE @PayByAddressId UNIQUEIDENTIFIER

SELECT 
	@PayByAddressId=ISNULL(ID,'')
FROM 
	Addresses A
	INNER JOIN #INVOICEDATA I ON A.[LINE1]= ISNULL(I.[PAYBYADD1],'')
    AND ISNULL(A.[LINE2],'')=ISNULL(I.[PAYBYADD2],'')
    AND ISNULL(A.[LINE3],'')=ISNULL(I.[PAYBYADD3],'')
    AND ISNULL(A.[POSTALCODE],'')=ISNULL(I.[PAYBYZIP],'')
    
-- Addresses doesn't exist
IF	ISNULL(Convert(NVARCHAR(50),@PayByAddressId),'')=''
BEGIN
	SELECT @PayByAddressId=NewID()

INSERT INTO [DBO].[ADDRESSES]
           ([ID]
		   ,[LINE1]
           ,[LINE2]
           ,[LINE3]
           ,[MUNICIPALITY]
           ,[STATEORPROVINCE]
           ,[POSTALCODE]
           ,[COUNTRY])
     SELECT
           @PayByAddressId
           ,ISNULL([PAYBYADD1],'')    
           ,ISNULL([PAYBYADD2],'')     
           ,ISNULL([PAYBYADD3],'')     
           ,'' -- no city found in table     
		    ,'' -- no State found in table     
		   ,ISNULL([PAYBYZIP],'')   
		   ,ISNULL([PAYBYCTYSTATE],'')
	FROM 
		#INVOICEDATA
END

----------------------------------------------------
--------------1.6 CUSTOMER PHYSICAL ADDRESS
--- Will go as PhysicalAddressId field in the Accounts table
DECLARE @CustomerPhysicalAddressId UNIQUEIDENTIFIER

SELECT 
	@CustomerPhysicalAddressId=ISNULL(ID,'')
FROM 
	Addresses A
	INNER JOIN #INVOICEDATA I ON A.[LINE1]= ISNULL(I.[ADDRESS1],'')
    AND ISNULL(A.[LINE2],'')=ISNULL(I.[ADDRESS2],'')
    AND ISNULL(A.[LINE3],'')=ISNULL(I.[ADDRESS3],'')
    AND ISNULL(A.[Municipality],'')=ISNULL(I.[CUSTCITY],'')
	AND ISNULL(A.[STATEORPROVINCE],'')=ISNULL(I.[CUSTSTATE],'')
    AND ISNULL(A.[POSTALCODE],'')=ISNULL(I.[POSTALCODE],'')
    AND ISNULL(A.[COUNTRY],'')=ISNULL(I.[COUNTRYNAME],'')

-- Addresses doesn't exist
IF	ISNULL(Convert(NVARCHAR(50),@CustomerPhysicalAddressId),'')=''
BEGIN
	SELECT @CustomerPhysicalAddressId=NewID()

INSERT INTO [DBO].[ADDRESSES]
           ([ID]
		   ,[LINE1]
           ,[LINE2]
           ,[LINE3]
           ,[MUNICIPALITY]
           ,[STATEORPROVINCE]
           ,[POSTALCODE]
           ,[COUNTRY])
     SELECT
           @CustomerPhysicalAddressId
           ,ISNULL([ADDRESS1],'')    
           ,ISNULL([ADDRESS2],'')     
           ,ISNULL([ADDRESS3],'')     
           ,ISNULL([CUSTCITY],'')     
		   ,ISNULL([CUSTSTATE],'') 	  
		   ,ISNULL([POSTALCODE],'')   
		   ,ISNULL([COUNTRYNAME],'')
	FROM 
		#INVOICEDATA
END



--2.INSERTING COMPANY DETAILS ASSOCIATED WITH THE INVOICE

DECLARE @CompanyNumber VARCHAR(20)

SELECT @CompanyNumber=C.[NUMBER]
    FROM [Portal].[DBO].COMPANIES C
    INNER JOIN #INVOICEDATA I ON C.Name=I.CompName
	AND C.EMAIL= I.EMAIL AND C.Currency=I.Currency
	AND C.WireName=I.WireName

IF ISNULL(@CompanyNumber,'')=''
BEGIN
-- Creating random string
SELECT
   @CompanyNumber= CAST(N'' AS XML).value(
          'xs:base64Binary(xs:hexBinary(sql:column("bin")))'
        , 'VARCHAR(12)'
    )   
FROM (
	SELECT CAST(  left(replace(newid(),'-',''),12) AS VARBINARY(MAX)) AS bin
) AS bin_sql_server_temp;

-- Select @CompanyNumber --invoices

	INSERT INTO [Portal].[DBO].[Companies]
           ([CREATEDBY]
           ,[CREATEDON]
           ,[MODIFIEDBY]
           ,[MODIFIEDON]
           ,[Number]
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
     SELECT
           'SYSTEM'
           , GETUTCDATE()
           ,'SYSTEM'
           , GETUTCDATE()
           , @CompanyNumber 
           , COMPNAME
           , EMAIL 
           , PHONE 
           , FAX 
           , WIRENAME 
           , WIREBANK 
           , WIREBRANCH 
           , WIREACCT 
           , WIREROUTING 
           , CURRENCY 
           , @PhysicalAddressID
           , @MailingAddressId
           , @MailingAddressId -- BILLINGADDRESSID is same as MAILINGADDRESSID
           , @MailingAddressId -- SHIPPINGADDRESSID is same as MAILINGADDRESSID
           , INVOICEROWVERSION 
           , KVKNUMBER 
           , TAXID 
           , TAXIDPREFIX 
		FROM
			#INVOICEDATA
		    --SET @COMPANYNUMBER=(SELECT INVOICENUMBER FROM #INVOICEDATA)
END





 --3.INSERTING ACCOUNT DETAILS ASSOCIATED WITH THE INVOICE

IF NOT EXISTS(SELECT NUMBER FROM [DBO].ACCOUNTS
              WHERE NUMBER = @ACCOUNTNUMBER)

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
     SELECT
           'SYSTEM'
           , GETUTCDATE()
           , 'SYSTEM'
           , GETUTCDATE()
           , [CUSTOMERNUMBER]
           , CUSTOMERPIN
           , CUSTOMERNAME
           , EMAIL
           , PHONENUMBER
           , FAX
           , CUSTCURRENCY
           , @CustomerPhysicalAddressId
           , @ShipToAddressId
           , @INVOICEBILLTOADDRESS
           , @ShipToAddressId
           , PTE_0
           , NULL
           , CUSTROWVERSION
           , NULL
           , NULL
           , NULL
           , NULL
           , [LANGUAGE]
		FROM
			#INVOICEDATA
END

  --4.INSERTING INVOICE DETAILS ASSOCIATED WITH THE CUSTOMER

IF NOT EXISTS(SELECT INVOICENUMBER
                        FROM [DBO].INVOICES
                        WHERE INVOICENUMBER =@INVOICENUMBER)
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
     SELECT
           'SYSTEM'
           ,GETUTCDATE()
           ,'SYSTEM'
           ,GETUTCDATE()
           ,SOLDTOCUST
           ,BILLTOCUST
           ,@CompanyNumber  -- [BILLINGENTITYNUMBER]
           ,INVOICEROWVERSION
           ,@INVOICENUMBER
           ,[DATE]
           ,CUSTREF
           ,CUSTPO
           ,@ShipToAddressId
           ,NULL
           ,SHIPVIA
           ,NULL
           ,INVSTARTDATE
			,DETENDDATE
           ,INCOTERMS
           ,PAYTERMS
           ,NULL
           ,TAXID
           ,INVOICECURRENCY
           ,0.00
           ,ISNULL(SUBTOTAL,0.00)
           ,ISNULL(SUBTOTAL,0.00)
           ,ISNULL(LINETAXRATE,0.00)
           ,ISNULL(TAXAMT,0.00)
           ,ISNULL(BALANCE,0.00)
		  ,ISNULL(BALCUR,'')
           ,DUEDATE
           ,@CompanyNumber -- SellingEntityNumber
           ,INVOICEROWVERSION
		FROM
			#INVOICEDATA
END

  --5.INSERTING INVOICE TAX ASSOCIATED WITH THE CUSTOMER

    INSERT INTO [DBO].[INVOICETAXES]
           ([CREATEDBY]
           ,[CREATEDON]
           ,[MODIFIEDBY]
           ,[MODIFIEDON]
           ,[INVOICENUMBER]
           ,[TAXAMOUNT]
           ,[TAXDESC]
           ,[BPR])
	SELECT 'SYSTEM'
           ,(SELECT GETUTCDATE())
           ,'SYSTEM'
           ,(SELECT GETUTCDATE())
           ,@INVOICENUMBER
			,ISNULL(TAXAMT,0.00)
			,ISNULL(dbit.[TAXDESC],'')
			,ISNULL(BPR_0,'')
	FROM  
		PORTALDB.DBO.INVOICE_TAXES dbit
		LEFT JOIN [Portal].[DBO].[INVOICETAXES] IT 
			ON dbit.NUM_0 +ISNULL(dbit.[TAXDESC],'') = ISNULL(IT.[INVOICENUMBER],'')+ISNULL(IT.[TAXDESC],'')
	WHERE 
		dbit.NUM_0  = @INVOICENUMBER
		AND IT.InvoiceNumber IS NULL
    --AND ISNULL(@INVOICENUMBER,'')+ISNULL([TAXDESC],'') NOT IN (SELECT ISNULL([INVOICENUMBER],'')+ISNULL([TAXDESC],'')FROM [INVOICETAXES])


--6.INSERTING COMPANYWIREACHDETAILS ASSOCIATED WITH THE CUSTOMER

IF NOT EXISTS(SELECT InvoiceNumber
              FROM [PORTAL].[DBO].CompanyWireAchDetails
              WHERE INVOICENUMBER =@INVOICENUMBER)
 BEGIN
       
 INSERT INTO [PORTAL].[DBO].[COMPANYWIREACHDETAILS]
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
     SELECT
           'SYSTEM'
           ,GETUTCDATE()
           ,'SYSTEM'
           ,GETUTCDATE()
		    ,WIREBANKID 
		    ,REMITSORTCODE 
		    ,REMITIBAN 
		    ,SWIFTNAME 
			 ,SWIFT
		    ,WIRECUR 
		    ,WIRENAME2 
		    ,WIREBANK2 
		    ,WIREACCT2 
		    ,SWIFT2 
		    ,WIRECUR2 
		    ,INVOICEROWVERSION 
		    ,WIRECLEARING
			,@InvoiceNumber
		    ,WIREACCT 
		    ,WIREBANK 
		    ,WIREBRANCH 
		    ,WIRENAME 
		    ,WIREROUTING 
		FROM
			#INVOICEDATA
END

--7.INSERTING INVOICEHEADEREXTENSIONS ASSOCIATED WITH THE CUSTOMER

IF NOT EXISTS(SELECT INVOICENUMBER
                        FROM [DBO].INVOICEHEADEREXTENSIONS
                        WHERE INVOICENUMBER = @InvoiceNumber)
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
     SELECT
           'SYSTEM'
           ,GETUTCDATE()
           ,'SYSTEM'
           ,GETUTCDATE()
		    ,@InvoiceNumber
		    ,INVOICECURRENCY
		    ,MEMO
		    ,PDCRAMT
		    ,PAYREF
		    ,CHECKNUM
			 ,PAYAMT
		    ,IMPORTETOTAL
		    ,PAYBYCUST
		    ,PAYBYNAME
		    ,@PayByAddressId 
		    ,INVOICEROWVERSION
		    ,ISNULL(DOCTYPE,'')
		    ,ISNULL(LOGO,'')
		    ,CPY
		    ,@MailingAddressId 
		    ,REMITCUR
		    ,REMITNAME
		    ,BILLTONAME
		    ,SHIPTONAME
		    ,@INVOICEBILLTOADDRESS 
		    ,CUSTTAXID
		    ,CUSTTAXPREFIX
		    ,@ShipToAddressId 
         FROM
			#INVOICEDATA
END

-- 8.INSERTING INVOICE DETAILS ASSOCIATED WITH THE CUSTOMER
-----------------------------------------------------------------------------------------------


IF NOT EXISTS(SELECT INVOICENUMBER
                        FROM [DBO].INVOICEDETAILS
                        WHERE INVOICENUMBER = @InvoiceNumber)
BEGIN
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
		SELECT
			'SYSTEM'
			,GETUTCDATE()
			,'SYSTEM'
			,GETUTCDATE()
			,@InvoiceNumber 
			, LINENUMBER
			,ITEM 
			,ITEMDESC 
			,PRICE 
			,0.00 
			,QTY 
			,0.00 
			,EXTAMT 
			,[ROWVERSION] 
			,ISNULL(LINETAXRATE,0.00) 
		FROM
			PORTALDB.DBO.INVOICE_DETAILS_PHASE2 
		WHERE 
			NUMBER = @InvoiceNumber
		
END

END
