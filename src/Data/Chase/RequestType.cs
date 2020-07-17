using System;
using System.Collections.Generic;
using System.Text;

namespace Chase
{
	public abstract class RequestType
	{
		public const string NEW_ORDER_TRANSACTION = "NewOrder";

		public const string END_OF_DAY_TRANSACTION = "EOD";

		public const string FLEX_CACHE_TRANSACTION = "FlexCache";

		public const string MARK_FOR_CAPTURE_TRANSACTION = "MFC";

		public const string PROFILE_TRANSACTION = "Profile";

		public const string REVERSE_TRANSACTION = "Reverse";

		public const string PC3_CORE = "PC3Core";

		public const string PC3_LINE_ITEMS = "PC3LineItems";

		public const string SETTLE_REJECT_BIN = "SettleRejectBin";

		public const string PRIOR_AUTH_ID = "PriorAuthID";

		public const string INQUIRY = "Inquiry";

		public const string ACCOUNT_UPDATER = "AccountUpdater";

		public const string SAFETECH_FRAUD_ANALYSIS = "SafetechFraudAnalysis";

		public const string FRAUD_ANALYSIS = "FraudAnalysis";

		public const string SOFT_MERCHANT_DESCRIPTORS = "SoftMerchantDescriptors";

		public const string VOID = "Void";

		public const string BATCH_SETTLEMENT = "BatchSettlement";

		public const string PARTIAL_VOID = "PartialVoid";

		public const string CC_AUTHORIZE = "CC.Authorize";

		public const string CC_CAPTURE = "CC.MarkForCapture";

		public const string CC_RECURRING_REFUND = "CC.RecurringRefund";

		public const string FORCE = "CC.Force";

		public const string CC_RECURRING_AUTH_CAPTURE = "CC.RecurringAuthCap";

		public const string ECOMMERCE_REFUND = "CC.eCommerceRefund";

		public const string EFALCON_AUTH_CAPTURE = "eFalcon.AuthCap";

		public const string PC2_RECURRING_AUTH_CAPTURE = "PC2.AuthCapRecurring";

		public const string PC2_AUTH = "PC2.Auth";

		public const string ECP_AUTH = "ECP.Authorize";

		public const string ECP_CAPTURE = "ECP.Capture";

		public const string ECP_FORCE_DEPOSIT = "ECP.ForceDeposit";

		public const string ECP_REFUND = "ECP.Refund";

		public const string SWITCH_SOLO_CAPTURE = "SwitchSolo.Capture";

		public const string SWITCH_SOLO_REFUND = "SwitchSolo.Refund";

		public const string SWITCH_SOLO_AUTH = "SwitchSolo.Auth";

		public const string PROFILE_MANAGEMENT = "Profile.Management";

		public const string FLEXCACHE = "FlexCache.StandAlone";

		public const string FLEXCACHE_BATCH = "FlexCache.Batch";

		public const string FLEXCACHE_CAPTURE = "FlexCache.MFC";

		public const string MOTO = "MOTO";

		public const string MOTO_REFUND = "MOTO.Refund";
	}
}