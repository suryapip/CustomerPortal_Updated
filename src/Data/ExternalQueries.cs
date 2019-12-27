using System;
using System.Collections.Generic;
using System.Text;

namespace ScentAir.Payment.Data.External
{
    internal static class Constants
    {        
        public static class Schemas
        {
            public const string Test = @"TESTI";
            public const string Prod = @"PILOT";
        }

        public static string QueryCustomers(string schema)
        {
            if (string.IsNullOrWhiteSpace(schema))
                throw new ArgumentNullException(nameof(schema), "A schema is required");

            return string.Format(customersQuery, schema);
        }

        public static string QueryInvoice(string schema)
        {
            if (string.IsNullOrWhiteSpace(schema))
                throw new ArgumentNullException(nameof(schema), "A schema is required");

            return string.Format(invoiceQuery, schema);            
        }


        const string customersQuery = @"SELECT       A.BPANUM_0 AS CustomerNumber, " +
                                      @"             A.BPADES_0 AS CustomerName, " +
                                      @"             A.BPAADDLIG_0 as Address1, " +
                                      @"             A.BPAADDLIG_1 as Address2, " +
                                      @"             A.BPAADDLIG_2 as Address3, " +
                                      @"             A.CTY_0 as City, " +
                                      @"             A.SAT_0 as ""State"", " +
                                      @"             A.POSCOD_0 as PostalCode, " +
                                      @"             A.CRYNAM_0 as CountryName, " +
                                      @"             A.TEL_0 AS PhoneNumber" +
                                      @"FROM         {0}.BPCUSTOMER C" +
                                      @"INNER JOIN   {0}.BPADDRESS A ON C.BPCNUM_0 = A.BPANUM_0 and A.BPAADD_0 = 'BILL'" +
                                      @"WHERE        C.BPCINV_0 = C.BPCNUM_0";

        const string invoiceQuery   = @"select       (SELECT FC.FCYNAM_0 FROM {0}.BPADDRESS MAIN LEFT JOIN {0}.FACILITY FC ON FC.FCY_0=MAIN.BPANUM_0 WHERE MAIN.BPANUM_0=F.FINRSPFCY_0 AND MAIN.BPAADD_0='MAIN' AND MAIN.BPATYP_0=3) AS COMPNAME, " +
                                      @"             (SELECT MAIN.BPAADDLIG_0 FROM {0}.BPADDRESS MAIN LEFT JOIN {0}.FACILITY FC ON FC.FCY_0=MAIN.BPANUM_0 WHERE MAIN.BPANUM_0=F.FINRSPFCY_0 AND MAIN.BPAADD_0='MAIN' AND MAIN.BPATYP_0=3) AS ADD1, " +
                                      @"             (SELECT MAIN.BPAADDLIG_1 FROM {0}.BPADDRESS MAIN LEFT JOIN {0}.FACILITY FC ON FC.FCY_0=MAIN.BPANUM_0 WHERE MAIN.BPANUM_0=F.FINRSPFCY_0 AND MAIN.BPAADD_0='MAIN' AND MAIN.BPATYP_0=3) AS ADD2, " +
                                      @"             (SELECT MAIN.BPAADDLIG_2 FROM {0}.BPADDRESS MAIN LEFT JOIN {0}.FACILITY FC ON FC.FCY_0=MAIN.BPANUM_0 WHERE MAIN.BPANUM_0=F.FINRSPFCY_0 AND MAIN.BPAADD_0='MAIN' AND MAIN.BPATYP_0=3) AS ADD3, " +
                                      @"             (SELECT MAIN.CTY_0 FROM {0}.BPADDRESS MAIN LEFT JOIN {0}.FACILITY FC ON FC.FCY_0=MAIN.BPANUM_0 WHERE MAIN.BPANUM_0=F.FINRSPFCY_0 AND MAIN.BPAADD_0='MAIN' AND MAIN.BPATYP_0=3) AS CITY, " +
                                      @"             (SELECT MAIN.SAT_0 FROM {0}.BPADDRESS MAIN LEFT JOIN {0}.FACILITY FC ON FC.FCY_0=MAIN.BPANUM_0 WHERE MAIN.BPANUM_0=F.FINRSPFCY_0 AND MAIN.BPAADD_0='MAIN' AND MAIN.BPATYP_0=3) AS ""STATE"", " +
                                      @"             (SELECT MAIN.POSCOD_0 FROM {0}.BPADDRESS MAIN LEFT JOIN {0}.FACILITY FC ON FC.FCY_0=MAIN.BPANUM_0 WHERE MAIN.BPANUM_0= F.FINRSPFCY_0 AND MAIN.BPAADD_0= 'MAIN' AND MAIN.BPATYP_0= 3) AS POSTAL, " +
                                      @"             (SELECT MAIN.CRYNAM_0 FROM {0}.BPADDRESS MAIN LEFT JOIN {0}.FACILITY FC ON FC.FCY_0 = MAIN.BPANUM_0 WHERE MAIN.BPANUM_0 = F.FINRSPFCY_0 AND MAIN.BPAADD_0 = 'MAIN' AND MAIN.BPATYP_0 = 3) AS COUNTRY, " +
                                      @"             (SELECT('(' + stuff(stuff(MAIN.TEL_0, 7, 0, '-'), 4, 0, ') ')) FROM {0}.BPADDRESS MAIN LEFT JOIN {0}.FACILITY FC ON FC.FCY_0 = MAIN.BPANUM_0 WHERE MAIN.BPANUM_0 = F.FINRSPFCY_0 AND MAIN.BPAADD_0 = 'MAIN' AND MAIN.BPATYP_0 = 3) AS PHONE, " +
                                      @"             (SELECT('(' + stuff(stuff(MAIN.FAX_0, 7, 0, '-'), 4, 0, ') ')) FROM {0}.BPADDRESS MAIN LEFT JOIN {0}.FACILITY FC ON FC.FCY_0 = MAIN.BPANUM_0 WHERE MAIN.BPANUM_0 = F.FINRSPFCY_0 AND MAIN.BPAADD_0 = 'MAIN' AND MAIN.BPATYP_0 = 3) AS FAX, " +
                                      @"             (SELECT MAIN.EXTNUM_0 FROM {0}.BPADDRESS MAIN LEFT JOIN {0}.FACILITY FC ON FC.FCY_0 = MAIN.BPANUM_0 WHERE MAIN.BPANUM_0 = F.FINRSPFCY_0 AND MAIN.BPAADD_0 = 'MAIN' AND MAIN.BPATYP_0 = 3) AS EMAIL, " +
                                      @"             IV.NUM_0 AS NUMBER, " +
                                      @"             I.STRDUDDAT_0 AS DATE, " +
                                      @"             I.CUR_0 AS CURRENCY, " +
                                      @"             I.BPR_0 AS BILLTOCUST, " +
                                      @"             IV.BPCORD_0 AS SOLDTOCUST, " +
                                      @"             BPC.ZCUSTREF_0 AS CUSTREF, " +
                                      @"             I.ZPDSTATUS_0, " +
                                      @"             I.ZAMTDUE_0, " +
                                      @"             I.STRDATSVC_0 AS INVSTARTDATE, " +
                                      @"             ID.DEMDLVDAT_0 AS DETSTARTDATE, " +
                                      @"             ID.YENDDAT_0 AS DETENDDATE, " +
                                      @"             BPD.BPDNAM_0 AS BILLTONAME, " +
                                      @"             DLV.BPAADDLIG_0 AS BILLTOADD1, " +
                                      @"             DLV.BPAADDLIG_1 AS BILLTOADD2, " +
                                      @"             DLV.BPAADDLIG_2 AS BILLTOADD3, " +
                                      @"             DLV.CTY_0 AS BILLTOCITY, " +
                                      @"             DLV.SAT_0 AS BILLTOSTATE, " +
                                      @"             DLV.POSCOD_0 AS BILLTOPOSTAL, " +
                                      @"             DLV.CRYNAM_0 AS BILLTOCOUNTRY, " +
                                      @"             IV.BPDNAM_0 AS SHIPTONAME, " +
                                      @"             IV.BPDADDLIG_0 AS SHIPTOADD1, " +
                                      @"             IV.BPDADDLIG_1 AS SHIPTOADD2, " +
                                      @"             IV.BPDADDLIG_2 AS SHIPTOADD3, " +
                                      @"             IV.BPDCTY_0 AS SHIPTOCITY, " +
                                      @"             IV.BPDSAT_0 AS SHIPTOSTATE, " +
                                      @"             IV.BPDPOSCOD_0 AS SHIPTOPOSTAL, " +
                                      @"             IV.BPDCRYNAM_0 AS SHIPTOCOUNTRY, " +
                                      @"             (CASE WHEN I.SIVTYP_0='RMR' THEN O.YSCCUSTPO_0 ELSE IV.INVREF_0 END) AS CUSTPO, " +
                                      @"             CAR.BPTNAM_0 AS SHIPVIA, " +
                                      @"             (SELECT TEXTE_0 FROM {0}.ATEXTRA AE WHERE AE.CODFIC_0='INCOTERM' AND AE.ZONE_0= 'DES' AND AE.LANGUE_0= 'ENG' AND AE.LANGUE_0= IV.LAN_0 AND AE.IDENT1_0= IV.EECICT_0) AS INCOTERMS, " +
                                      @"             (SELECT TEXTE_0 FROM {0}.ATEXTRA AE WHERE AE.CODFIC_0 = 'TABPAYTERM' AND AE.ZONE_0 = 'SHOAXX' AND AE.LANGUE_0 = 'ENG' AND AE.IDENT1_0 = I.PTE_0) AS PAYTERMS, " +
                                      @"             (SELECT DUDDAT_0 FROM {0}.GACCDUDATE DD WHERE DD.NUM_0 = I.NUM_0 AND DD.TYP_0 = I.GTE_0) AS DUEDATE, " +
                                      @"             ID.ITMREF_0, " +
                                      @"             (CASE WHEN ID.ITMDESBPC_0='' THEN ID.ITMDES_0 ELSE ID.ITMDESBPC_0 END) AS ITEMDESC, " +
                                      @"             ID.QTY_0 AS QTY, " +
                                      @"             ID.NETPRI_0 AS PRICE, " +
                                      @"             (CASE WHEN ID.QTY_0=0 THEN CASE WHEN IV.PRITYP_0= 1 THEN ID.AMTNOTLIN_0 ELSE ID.AMTATILIN_0 END ELSE CASE WHEN ID.QTY_0<>0 THEN ROUND(ID.QTY_0* ID.NETPRI_0, CUR.DECNBR_0) ELSE 0 END END ) AS EXTAMT, " +
                                      @"             I.CUR_0 as REMITCUR, " +
                                      @"             (SELECT FC1.FCYNAM_0 FROM {0}.BPADDRESS REMIT LEFT JOIN {0}.FACILITY FC1 ON FC1.FCY_0=REMIT.BPANUM_0 LEFT JOIN {0}.BID B ON B.BPATYP_0= REMIT.BPATYP_0 AND B.BPANUM_0= REMIT.BPANUM_0 WHERE REMIT.BPANUM_0= (CASE WHEN BPC.VACBPR_0 IN ('CAN','EXE','CANBW','CABLB','CANNV','CANSA','CANWT','CAONT','CAPEI','CAQBC','CASKC','CAYUK') AND F.FINRSPFCY_0='1100' AND IV.BPDCRY_0= 'CAN' THEN '1200' ELSE F.FINRSPFCY_0 END) AND REMIT.BPAADD_0='REMIT' AND REMIT.BPATYP_0= 3) AS REMITNAME, " +
                                      @"             (SELECT REMIT.BPAADDLIG_0 FROM {0}.BPADDRESS REMIT LEFT JOIN {0}.FACILITY FC1 ON FC1.FCY_0 = REMIT.BPANUM_0 LEFT JOIN {0}.BID B ON B.BPATYP_0 = REMIT.BPATYP_0 AND B.BPANUM_0 = REMIT.BPANUM_0 WHERE REMIT.BPANUM_0 = (CASE WHEN BPC.VACBPR_0 IN('CAN', 'EXE', 'CANBW', 'CABLB', 'CANNV', 'CANSA', 'CANWT', 'CAONT', 'CAPEI', 'CAQBC', 'CASKC', 'CAYUK') AND F.FINRSPFCY_0 = '1100' AND IV.BPDCRY_0 = 'CAN' THEN '1200' ELSE F.FINRSPFCY_0 END) AND REMIT.BPAADD_0='REMIT' AND REMIT.BPATYP_0= 3) AS REMITADD1, " +
                                      @"             (SELECT REMIT.BPAADDLIG_1 FROM {0}.BPADDRESS REMIT LEFT JOIN {0}.FACILITY FC1 ON FC1.FCY_0 = REMIT.BPANUM_0 LEFT JOIN {0}.BID B ON B.BPATYP_0 = REMIT.BPATYP_0 AND B.BPANUM_0 = REMIT.BPANUM_0 WHERE REMIT.BPANUM_0 = (CASE WHEN BPC.VACBPR_0 IN('CAN', 'EXE', 'CANBW', 'CABLB', 'CANNV', 'CANSA', 'CANWT', 'CAONT', 'CAPEI', 'CAQBC', 'CASKC', 'CAYUK') AND F.FINRSPFCY_0 = '1100' AND IV.BPDCRY_0 = 'CAN' THEN '1200' ELSE F.FINRSPFCY_0 END) AND REMIT.BPAADD_0='REMIT' AND REMIT.BPATYP_0= 3) AS REMITADD2, " +
                                      @"             (SELECT REMIT.BPAADDLIG_2 FROM {0}.BPADDRESS REMIT LEFT JOIN {0}.FACILITY FC1 ON FC1.FCY_0 = REMIT.BPANUM_0 LEFT JOIN {0}.BID B ON B.BPATYP_0 = REMIT.BPATYP_0 AND B.BPANUM_0 = REMIT.BPANUM_0 WHERE REMIT.BPANUM_0 = (CASE WHEN BPC.VACBPR_0 IN('CAN', 'EXE', 'CANBW', 'CABLB', 'CANNV', 'CANSA', 'CANWT', 'CAONT', 'CAPEI', 'CAQBC', 'CASKC', 'CAYUK') AND F.FINRSPFCY_0 = '1100' AND IV.BPDCRY_0 = 'CAN' THEN '1200' ELSE F.FINRSPFCY_0 END) AND REMIT.BPAADD_0='REMIT' AND REMIT.BPATYP_0= 3) AS REMITADD3, " +
                                      @"             (SELECT REMIT.CTY_0 FROM {0}.BPADDRESS REMIT LEFT JOIN {0}.FACILITY FC1 ON FC1.FCY_0 = REMIT.BPANUM_0 LEFT JOIN {0}.BID B ON B.BPATYP_0 = REMIT.BPATYP_0 AND B.BPANUM_0 = REMIT.BPANUM_0 WHERE REMIT.BPANUM_0 = (CASE WHEN BPC.VACBPR_0 IN('CAN', 'EXE', 'CANBW', 'CABLB', 'CANNV', 'CANSA', 'CANWT', 'CAONT', 'CAPEI', 'CAQBC', 'CASKC', 'CAYUK') AND F.FINRSPFCY_0 = '1100' AND IV.BPDCRY_0 = 'CAN' THEN '1200' ELSE F.FINRSPFCY_0 END) AND REMIT.BPAADD_0='REMIT' AND REMIT.BPATYP_0= 3) AS REMITCITY, " +
                                      @"             (SELECT REMIT.SAT_0 FROM {0}.BPADDRESS REMIT LEFT JOIN {0}.FACILITY FC1 ON FC1.FCY_0 = REMIT.BPANUM_0 LEFT JOIN {0}.BID B ON B.BPATYP_0 = REMIT.BPATYP_0 AND B.BPANUM_0 = REMIT.BPANUM_0 WHERE REMIT.BPANUM_0 = (CASE WHEN BPC.VACBPR_0 IN('CAN', 'EXE', 'CANBW', 'CABLB', 'CANNV', 'CANSA', 'CANWT', 'CAONT', 'CAPEI', 'CAQBC', 'CASKC', 'CAYUK') AND F.FINRSPFCY_0 = '1100' AND IV.BPDCRY_0 = 'CAN' THEN '1200' ELSE F.FINRSPFCY_0 END) AND REMIT.BPAADD_0='REMIT' AND REMIT.BPATYP_0= 3) AS REMITSTATE, " +
                                      @"             (SELECT REMIT.POSCOD_0 FROM {0}.BPADDRESS REMIT LEFT JOIN {0}.FACILITY FC1 ON FC1.FCY_0 = REMIT.BPANUM_0 LEFT JOIN {0}.BID B ON B.BPATYP_0 = REMIT.BPATYP_0 AND B.BPANUM_0 = REMIT.BPANUM_0 WHERE REMIT.BPANUM_0 = (CASE WHEN BPC.VACBPR_0 IN('CAN', 'EXE', 'CANBW', 'CABLB', 'CANNV', 'CANSA', 'CANWT', 'CAONT', 'CAPEI', 'CAQBC', 'CASKC', 'CAYUK') AND F.FINRSPFCY_0 = '1100' AND IV.BPDCRY_0 = 'CAN' THEN '1200' ELSE F.FINRSPFCY_0 END) AND REMIT.BPAADD_0='REMIT' AND REMIT.BPATYP_0= 3) AS REMITPOSTAL, " +
                                      @"             (SELECT REMIT.CRYNAM_0 FROM {0}.BPADDRESS REMIT LEFT JOIN {0}.FACILITY FC1 ON FC1.FCY_0 = REMIT.BPANUM_0 LEFT JOIN {0}.BID B ON B.BPATYP_0 = REMIT.BPATYP_0 AND B.BPANUM_0 = REMIT.BPANUM_0 WHERE REMIT.BPANUM_0 = (CASE WHEN BPC.VACBPR_0 IN('CAN', 'EXE', 'CANBW', 'CABLB', 'CANNV', 'CANSA', 'CANWT', 'CAONT', 'CAPEI', 'CAQBC', 'CASKC', 'CAYUK') AND F.FINRSPFCY_0 = '1100' AND IV.BPDCRY_0 = 'CAN' THEN '1200' ELSE F.FINRSPFCY_0 END) AND REMIT.BPAADD_0='REMIT' AND REMIT.BPATYP_0= 3) AS REMITCOUNTRY, " +
                                      @"             (SELECT B.BNF_0 FROM {0}.BPADDRESS REMIT LEFT JOIN {0}.FACILITY FC1 ON FC1.FCY_0 = REMIT.BPANUM_0 LEFT JOIN {0}.BID B ON B.BPATYP_0 = REMIT.BPATYP_0 AND B.BPANUM_0 = REMIT.BPANUM_0 WHERE REMIT.BPANUM_0 = (CASE WHEN BPC.VACBPR_0 IN('CAN', 'EXE', 'CANBW', 'CABLB', 'CANNV', 'CANSA', 'CANWT', 'CAONT', 'CAPEI', 'CAQBC', 'CASKC', 'CAYUK') AND F.FINRSPFCY_0 = '1100' AND IV.BPDCRY_0 = 'CAN' THEN '1200' ELSE F.FINRSPFCY_0 END) AND REMIT.BPAADD_0='REMIT' AND REMIT.BPATYP_0= 3 AND B.CUR_0= I.CUR_0)  AS WIRENAME, " +
                                      @"             (SELECT B.PAB1_0 FROM {0}.BPADDRESS REMIT LEFT JOIN {0}.FACILITY FC1 ON FC1.FCY_0 = REMIT.BPANUM_0 LEFT JOIN {0}.BID B ON B.BPATYP_0 = REMIT.BPATYP_0 AND B.BPANUM_0 = REMIT.BPANUM_0 WHERE REMIT.BPANUM_0 = (CASE WHEN BPC.VACBPR_0 IN('CAN', 'EXE', 'CANBW', 'CABLB', 'CANNV', 'CANSA', 'CANWT', 'CAONT', 'CAPEI', 'CAQBC', 'CASKC', 'CAYUK') AND F.FINRSPFCY_0 = '1100' AND IV.BPDCRY_0 = 'CAN' THEN '1200' ELSE F.FINRSPFCY_0 END) AND REMIT.BPAADD_0='REMIT' AND REMIT.BPATYP_0= 3 AND B.CUR_0= I.CUR_0)  AS WIREBANK, " +
                                      @"             (SELECT B.PAB2_0 FROM {0}.BPADDRESS REMIT LEFT JOIN {0}.FACILITY FC1 ON FC1.FCY_0 = REMIT.BPANUM_0 LEFT JOIN {0}.BID B ON B.BPATYP_0 = REMIT.BPATYP_0 AND B.BPANUM_0 = REMIT.BPANUM_0 WHERE REMIT.BPANUM_0 = (CASE WHEN BPC.VACBPR_0 IN('CAN', 'EXE', 'CANBW', 'CABLB', 'CANNV', 'CANSA', 'CANWT', 'CAONT', 'CAPEI', 'CAQBC', 'CASKC', 'CAYUK') AND F.FINRSPFCY_0 = '1100' AND IV.BPDCRY_0 = 'CAN' THEN '1200' ELSE F.FINRSPFCY_0 END) AND REMIT.BPAADD_0='REMIT' AND REMIT.BPATYP_0= 3 AND B.CUR_0= I.CUR_0)  AS WIREBRANCH, " +
                                      @"             (SELECT B.PAB3_0 FROM {0}.BPADDRESS REMIT LEFT JOIN {0}.FACILITY FC1 ON FC1.FCY_0 = REMIT.BPANUM_0 LEFT JOIN {0}.BID B ON B.BPATYP_0 = REMIT.BPATYP_0 AND B.BPANUM_0 = REMIT.BPANUM_0 WHERE REMIT.BPANUM_0 = (CASE WHEN BPC.VACBPR_0 IN('CAN', 'EXE', 'CANBW', 'CABLB', 'CANNV', 'CANSA', 'CANWT', 'CAONT', 'CAPEI', 'CAQBC', 'CASKC', 'CAYUK') AND F.FINRSPFCY_0 = '1100' AND IV.BPDCRY_0 = 'CAN' THEN '1200' ELSE F.FINRSPFCY_0 END) AND REMIT.BPAADD_0='REMIT' AND REMIT.BPATYP_0= 3 AND B.CUR_0= I.CUR_0)  AS WIREBANKID, " +
                                      @"             (SELECT B.PAB1_0 FROM {0}.BPADDRESS REMIT LEFT JOIN {0}.FACILITY FC1 ON FC1.FCY_0 = REMIT.BPANUM_0 LEFT JOIN {0}.BID B ON B.BPATYP_0 = REMIT.BPATYP_0 AND B.BPANUM_0 = REMIT.BPANUM_0 WHERE REMIT.BPANUM_0 = (CASE WHEN BPC.VACBPR_0 IN('CAN', 'EXE', 'CANBW', 'CABLB', 'CANNV', 'CANSA', 'CANWT', 'CAONT', 'CAPEI', 'CAQBC', 'CASKC', 'CAYUK') AND F.FINRSPFCY_0 = '1100' AND IV.BPDCRY_0 = 'CAN' THEN '1200' ELSE F.FINRSPFCY_0 END) AND REMIT.BPAADD_0='REMIT' AND REMIT.BPATYP_0= 3 AND B.CUR_0= I.CUR_0)  AS WIREBANK, " +
                                      @"             (CASE WHEN F.CRY_0 IN('US', 'USA', 'MEX') THEN(SELECT SUBSTRING(B.BIDNUM_0, 10, 20) FROM {0}.BPADDRESS REMIT LEFT JOIN {0}.FACILITY FC1 ON FC1.FCY_0 = REMIT.BPANUM_0 LEFT JOIN {0}.BID B ON B.BPATYP_0 = REMIT.BPATYP_0 AND B.BPANUM_0 = REMIT.BPANUM_0 WHERE REMIT.BPANUM_0 = (CASE WHEN BPC.VACBPR_0 IN('CAN', 'EXE', 'CANBW', 'CABLB', 'CANNV', 'CANSA', 'CANWT', 'CAONT', 'CAPEI', 'CAQBC', 'CASKC', 'CAYUK') AND F.FINRSPFCY_0 = '1100' AND IV.BPDCRY_0 = 'CAN' THEN '1200' ELSE F.FINRSPFCY_0 END) AND REMIT.BPAADD_0 = 'REMIT' AND REMIT.BPATYP_0 = 3 AND B.CUR_0 = I.CUR_0) END)  AS WIREACCT " + 
                                      @"FROM         {0}.SINVOICE I" +
                                      @"inner join   {0}.SINVOICED ID ON I.NUM_0= ID.NUM_0" +
                                      @"--LEFT JOIN     {0}.SORDERQ OQ ON OQ.SOHNUM_0= ID.SOHNUM_0 AND OQ.SOPLIN_0= ID.SOPLIN_0 AND OQ.SOQSEQ_0= ID.SOQSEQ_0" +
                                      @"--LEFT JOIN     {0}.SDELIVERY D ON D.SDHNUM_0= ID.SDHNUM_0" +
                                      @"--LEFT JOIN     {0}.TABMODELIV T ON T.MDL_0= D.MDL_0" +
                                      @"--LEFT JOIN     {0}.ITMSALES IT ON IT.ITMREF_0= ID.ITMREF_0" +
                                      @"--LEFT JOIN     {0}.ITMMASTER IM ON IM.ITMREF_0= ID.ITMREF_0" +
                                      @"--LEFT JOIN     {0}.TABUNIT TU ON TU.UOM_0= ID.SAU_0" +
                                      @"--LEFT JOIN     {0}.TEXCLOB TC ON TC.CODE_0= ID.SIDTEX_0" +
                                      @"--INNER JOIN    {0}.BPARTNER BP ON BP.BPRNUM_0= I.BPR_0" +
                                      @"--LEFT JOIN     {0}.BPADDRESS BPR ON BPR.BPANUM_0= I.BPR_0 AND BPR.BPAADD_0= I.BPAINV_0" +
                                      @"--LEFT JOIN     {0}.BPADDRESS EDM ON EDM.BPANUM_0= I.BPR_0" +
                                      @"LEFT JOIN    {0}.BPCUSTOMER BPC ON BPC.BPCNUM_0= I.BPR_0" +
                                      @"INNER JOIN   {0}.FACILITY F ON F.FCY_0= I.FCY_0" +
                                      @"--LEFT JOIN     {0}.BPADDRESS FCY ON FCY.BPANUM_0= F.FCY_0 AND FCY.BPAADD_0= F.BPAADD_0" +
                                      @"--LEFT JOIN     {0}.COMPANY C ON C.CPY_0= F.LEGCPY_0" +
                                      @"--INNER JOIN    {0}.TABCOUNTRY TAB ON TAB.CRY_0= C.CRY_0" +
                                      @"--INNER JOIN    {0}.AFCTFCY AF ON AF.FCY_0= I.FCY_0" +
                                      @"--LEFT JOIN     {0}.FACTOR FAC ON FAC.FCTCOD_0= I.BPRFCT_0" +
                                      @"--LEFT JOIN     {0}.TABPAYTERM TP ON TP.PTE_0= I.PTE_0" +
                                      @"INNER JOIN   {0}.SINVOICEV IV ON IV.NUM_0= I.NUM_0" +
                                      @"LEFT JOIN       {0}.BPDLVCUST BPD ON BPD.BPCNUM_0= IV.BPCORD_0 AND BPD.BPAADD_0= IV.BPAADD_0" +
                                      @"LEFT JOIN       {0}.BPADDRESS DLV ON DLV.BPANUM_0= BPD.BPCNUM_0 AND DLV.BPAADD_0= BPD.BPAADD_0" +
                                      @"LEFT JOIN       {0}.BPCARRIER CAR ON CAR.BPTNUM_0= BPD.BPTNUM_0" +
                                      @"LEFT JOIN       {0}.SDELIVERY D1 ON D1.SDHNUM_0= IV.SIHORINUM_0" +
                                      @"LEFT JOIN       {0}.SORDER O ON O.SOHNUM_0= D1.SOHNUM_0" +
                                      @"INNER JOIN   {0}.TABCUR CUR ON CUR.CUR_0= IV.CUR_0" +
                                      @"--LEFT JOIN     {0}.TEXCLOB TC1 ON TC1.CODE_0= IV.SIHTEX1_0" +
                                      @"--LEFT JOIN     {0}.TEXCLOB TC2 ON TC2.CODE_0= IV.SIHTEX2_0" +
                                      @"--LEFT JOIN     {0}.PRICSTRUCT PS ON PS.PLISTC_0= IV.PLISTC_0"; //+
                                      //@"WHERE        I.NUM_0= 'INV528610' and I.FCY_0= '1110'";
    }
}
