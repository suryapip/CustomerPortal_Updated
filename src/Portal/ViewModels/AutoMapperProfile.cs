using AutoMapper;
using ScentAir.Payment.Impl;
using ScentAir.Payment.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScentAir.Payment.ViewModels
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<ApplicationUser, UserViewModel>()
                .ForMember(d => d.Roles, map => map.Ignore())
                .ForMember(d => d.AccountNumber, map => map.MapFrom(s => s.AccountNumbers.FirstOrDefault()))
                .ForMember(d => d.Question01, map => map.MapFrom(s => s.Q1))
                .ForMember(d => d.Question02, map => map.MapFrom(s => s.Q2))
                .ForMember(d => d.Answer01, map => map.MapFrom(s => s.A1))
                .ForMember(d => d.Answer02, map => map.MapFrom(s => s.A2))
                .ReverseMap()
                .ForMember(d => d.Roles, map => map.Ignore())
                .ForMember(d => d.AccountNumbers, map => map.Ignore())
                .ForMember(d => d.Question01, map => map.Ignore())
                .ForMember(d => d.Question02, map => map.Ignore())
                .ForMember(d => d.Q1, map => map.MapFrom(s => s.Question01))
                .ForMember(d => d.Q2, map => map.MapFrom(s => s.Question02))
                .ForMember(d => d.A1, map => map.MapFrom(s => s.Answer01))
                .ForMember(d => d.A2, map => map.MapFrom(s => s.Answer02))
                //.ForMember(d => d.Account, map => map.Ignore())
                ;

            CreateMap<ApplicationUser, RegisterUserViewModel>()
                .ForMember(d => d.Roles, map => map.Ignore())
                .ForMember(d => d.AccountNumber, map => map.MapFrom(s => s.AccountNumbers.FirstOrDefault()))
                .ForMember(d => d.Question01, map => map.MapFrom(s => s.Q1))
                .ForMember(d => d.Question02, map => map.MapFrom(s => s.Q2))
                .ForMember(d => d.Answer01, map => map.MapFrom(s => s.A1))
                .ForMember(d => d.Answer02, map => map.MapFrom(s => s.A2))
                .ReverseMap()
                .ForMember(d => d.Roles, map => map.Ignore())
                .ForMember(d => d.AccountNumbers, map => map.Ignore())
                .ForMember(d => d.Question01, map => map.Ignore())
                .ForMember(d => d.Question02, map => map.Ignore())
                .ForMember(d => d.Q1, map => map.MapFrom(s => s.Question01))
                .ForMember(d => d.Q2, map => map.MapFrom(s => s.Question02))
                .ForMember(d => d.A1, map => map.MapFrom(s => s.Answer01))
                .ForMember(d => d.A2, map => map.MapFrom(s => s.Answer02))
                //                .ForMember(d => d.Account, map => map.Ignore())
                ;

            CreateMap<ApplicationUser, UserEditViewModel>()
                .ForMember(d => d.Roles, map => map.Ignore())
                .ForMember(d => d.AccountNumber, map => map.MapFrom(s => s.AccountNumbers.FirstOrDefault()))
                .ForMember(d => d.Question01, map => map.MapFrom(s => s.Q1))
                .ForMember(d => d.Question02, map => map.MapFrom(s => s.Q2))
                .ForMember(d => d.Answer01, map => map.MapFrom(s => s.A1))
                .ForMember(d => d.Answer02, map => map.MapFrom(s => s.A2))
                .ReverseMap()
                .ForMember(d => d.Roles, map => map.Ignore())
                .ForMember(d => d.AccountNumbers, map => map.Ignore())
                .ForMember(d => d.Question01, map => map.Ignore())
                .ForMember(d => d.Question02, map => map.Ignore())
                .ForMember(d => d.Q1, map => map.MapFrom(s => s.Question01))
                .ForMember(d => d.Q2, map => map.MapFrom(s => s.Question02))
                .ForMember(d => d.A1, map => map.MapFrom(s => s.Answer01))
                .ForMember(d => d.A2, map => map.MapFrom(s => s.Answer02))
                //.ForMember(d => d.Account, map => map.Ignore())
                ;

            CreateMap<ApplicationUser, UserPatchViewModel>()
				.ForMember(d => d.Question01, map => map.MapFrom(s => s.Q1))
				.ForMember(d => d.Question02, map => map.MapFrom(s => s.Q2))
				.ForMember(d => d.Answer01, map => map.MapFrom(s => s.A1))
				.ForMember(d => d.Answer02, map => map.MapFrom(s => s.A2))
				.ReverseMap()
                .ForMember(d => d.Roles, map => map.Ignore())
                .ForMember(d => d.AccountNumbers, map => map.Ignore())
				//.ForMember(d => d.Account, map => map.Ignore())
				.ForMember(d => d.Question01, map => map.Ignore())
				.ForMember(d => d.Question02, map => map.Ignore())
				.ForMember(d => d.Q1, map => map.MapFrom(s => s.Question01))
				.ForMember(d => d.Q2, map => map.MapFrom(s => s.Question02))
				.ForMember(d => d.A1, map => map.MapFrom(s => s.Answer01))
				.ForMember(d => d.A2, map => map.MapFrom(s => s.Answer02))
				;
			CreateMap<UserEditViewModel, UserPatchViewModel>()
				//.ForMember(d => d.AccountNumber, map => map.MapFrom(s => s.AccountNumbers.FirstOrDefault()))
				.ReverseMap()
				.ForMember(d => d.Roles, map => map.Ignore())
				//.ForMember(d => d.Account, map => map.Ignore())
				;


			CreateMap<ApplicationRole, RoleViewModel>()
                .ForMember(d => d.Permissions, map => map.MapFrom(s => s.Claims))
                .ForMember(d => d.UsersCount, map => map.ResolveUsing(s => s.Users?.Count ?? 0))
                .ReverseMap();

            CreateMap<IdentityRoleClaim<string>, ClaimViewModel>()
                .ForMember(d => d.Type, map => map.MapFrom(s => s.ClaimType))
                .ForMember(d => d.Value, map => map.MapFrom(s => s.ClaimValue))
                .ReverseMap();

            CreateMap<IdentityRoleClaim<string>, PermissionViewModel>()
                .ConvertUsing(s => Mapper.Map<PermissionViewModel>(ApplicationPermissions.GetPermissionByValue(s.ClaimValue)));

            CreateMap<ApplicationPermission, PermissionViewModel>()
                .ReverseMap();




            CreateMap<Address, AddressViewModel>()
                .ReverseMap();


            CreateMap<Company, CompanyViewModel>()
                .ForMember(d => d.Address, map => map.MapFrom(s => s.PhysicalAddress))
                .ReverseMap();

            CreateMap<Account, AccountViewModel>()
                .ForMember(d => d.Address, map => map.MapFrom(s => s.PhysicalAddress))
                .ReverseMap();

            CreateMap<Invoice, InvoiceViewModel>()
                .ForMember(s => s.Date, map => map.MapFrom(d => d.InvoiceDate))
                .ForMember(s => s.Details, map => map.Ignore())
                .ForMember(s => s.Payments, map => map.Ignore())
                .ReverseMap()
                .ForMember(s => s.InvoiceDate, map => map.MapFrom(d => d.Date))
                .ForMember(s => s.BilledToAccount, map => map.Ignore())
                .ForMember(s => s.Details, map => map.Ignore())
                .ForMember(s => s.Payments, map => map.Ignore())
                ;

            CreateMap<InvoiceDetail, InvoiceDetailViewModel>()
                .ReverseMap()
                .ForMember(s => s.Invoice, map => map.Ignore())
                ;

            CreateMap<InvoicePayment, InvoicePaymentViewModel>()
                .ReverseMap()
                .ForMember(s => s.Invoice, map => map.Ignore())
                ;

            CreateMap<PaymentMethod, PaymentViewModel>()
                .ForMember(d => d.Id, o => o.MapFrom(s => s.Id.ToString("N")))
                .ForMember(d => d.CurrentAutoPayMethod, o => o.MapFrom(s => s.IsAuto))
				.ForMember(d => d.Name, o => o.MapFrom(s => s.Name))
				.ForMember(d => d.PaymentBillToName, o => o.MapFrom(s => s.PaymentBillToName))
				.ForMember(d => d.PaymentType, o => o.MapFrom(s => s.PaymentType))
                .ForMember(d => d.AccountNumber, o => o.MapFrom(s => s.PaymentAccountNumber))
                .ReverseMap()
				.ForMember(d => d.Id, o =>
                {
                    o.PreCondition(p => Guid.TryParse(p.Id, out Guid result));
                    o.MapFrom(s => Guid.Parse(s.Id));
                })
                .ForMember(d => d.PaymentType, o =>
                {
                    o.PreCondition(p => Enum.TryParse(p.PaymentType, true, out PaymentType x));
                    o.MapFrom(s => s.PaymentType);
                })
                ;


            CreateMap<PaymentMethod, PaymentProfileViewModel>()
                .ForSourceMember(d => d.Account, o => o.Ignore())
                .ForSourceMember(d => d.AccountNumber, o => o.Ignore())
                .ForSourceMember(d => d.Bank, o => o.Ignore())
                .ForSourceMember(d => d.Branch, o => o.Ignore())
                .ForSourceMember(d => d.Currency, o => o.Ignore())
                .ForSourceMember(d => d.Token, o => o.Ignore())
                .ForSourceMember(d => d.TokenSource, o => o.Ignore())

                .ForMember(d => d.Id, o => o.MapFrom(s => s.Id.ToString("N")))
                .ForMember(d => d.Name, o => o.MapFrom(s => s.Name))
                .ForMember(d => d.CurrentAutoPayMethod, o => o.MapFrom(s => s.IsAuto))
                .ForMember(d => d.PaymentBillToName, o => o.MapFrom(s => s.PaymentBillToName))
                .ForMember(d => d.Address, o => o.MapFrom(s => s.PaymentBillingAddress))
                .ForMember(d => d.CardCCV, o => o.MapFrom(s => s.CCV))
                .ForMember(d => d.AchRoutingNumber, o => o.MapFrom(s => s.PaymentRoutingNumber))
                .ForMember(d => d.PaymentType, o =>
                {
                    o.MapFrom(s => ((s.PaymentType & PaymentType.CreditCard) == PaymentType.CreditCard)
                                 ? "Credit"
                                 : "ECP");
                })
                .ForMember(d => d.CardExpirationMonth, o =>
                {
                    o.PreCondition(p => p.ExpiresOn != null);
                    o.MapFrom(s => (s.ExpiresOn != null) ? s.ExpiresOn.Value.Month.ToString() : "");
                })
                .ForMember(d => d.CardExpirationYear, o =>
                {
                    o.PreCondition(p => p.ExpiresOn != null);
                    o.MapFrom(s => (s.ExpiresOn != null) ? s.ExpiresOn.Value.Year.ToString() : "");
                })
                .ForMember(d => d.CardType, o =>
                {
                    o.PreCondition(p => (p.PaymentType & PaymentType.CreditCard) == PaymentType.CreditCard);
                    o.MapFrom(s => (s.PaymentType));
                })
                .ForMember(d => d.CardNumber, o =>
                {
                    o.PreCondition(p => (p.PaymentType & PaymentType.CreditCard) == PaymentType.CreditCard);
                    o.MapFrom(s => s.PaymentAccountNumber);
                })
                .ForMember(d => d.AchAccountType, o =>
                {
                    o.PreCondition(p => (p.PaymentType & PaymentType.ECP) == PaymentType.ECP);
                    o.MapFrom(s => s.PaymentType);
                })
                .ForMember(d => d.AchAccountNumber, o =>
                {
                    o.PreCondition(p => (p.PaymentType & PaymentType.ECP) == PaymentType.ECP);
                    o.MapFrom(s => s.PaymentAccountNumber);
                });

            CreateMap<PaymentProfileViewModel, PaymentMethod>()
                .ForMember(d => d.Name, o => o.MapFrom(s => s.Name))
                .ForMember(d => d.IsAuto, o => o.MapFrom(s => s.CurrentAutoPayMethod))
                .ForMember(d => d.PaymentBillToName, o => o.MapFrom(s => s.PaymentBillToName))
                .ForMember(d => d.PaymentBillingAddress, o => o.MapFrom(s => s.Address))
                .ForMember(d => d.CCV, o => o.MapFrom(s => s.CardCCV))
                .ForMember(d => d.PaymentRoutingNumber, o => o.MapFrom(s => s.AchRoutingNumber))

                .ForMember(d => d.Id, o =>
                {
                    o.Condition(p => Guid.TryParse(p.Id, out Guid result));
                    o.MapFrom(s => Guid.Parse(s.Id));
                })
                .ForMember(d => d.PaymentType, o =>
                {
                    o.Condition(p => p.AchAccountType.IsNotNullOrWhiteSpace()
                                  || p.CardType.IsNotNullOrWhiteSpace());
                    o.PreCondition(s => ("ECP".Equals(s.PaymentType, StringComparison.OrdinalIgnoreCase) && Enum.TryParse<PaymentType>(s.AchAccountType, out var x1))
                                      || ("Credit".Equals(s.PaymentType, StringComparison.OrdinalIgnoreCase) && Enum.TryParse<PaymentType>(s.CardType, out var x2)));
                    o.MapFrom(s => "ECP".Equals(s.PaymentType, StringComparison.OrdinalIgnoreCase)
                                 ? Enum.Parse<PaymentType>(s.AchAccountType)
                                 : "Credit".Equals(s.PaymentType, StringComparison.OrdinalIgnoreCase)
                                 ? Enum.Parse<PaymentType>(s.CardType)
                                 : PaymentType.Unknown);
				})
                .ForMember(d => d.PaymentAccountNumber, o =>
                {
                    o.MapFrom(s => "ECP".Equals(s.PaymentType, StringComparison.OrdinalIgnoreCase)
                                 ? s.AchAccountNumber
                                 : "Credit".Equals(s.PaymentType, StringComparison.OrdinalIgnoreCase)
                                 ? s.CardNumber
                                 : "");
				})
				.ForMember(d => d.PaymentRoutingNumber, o =>
				{
					o.Condition(p => "ECP".Equals(p.PaymentType, StringComparison.OrdinalIgnoreCase));
					o.MapFrom(s => s.AchRoutingNumber);
				})
				.ForMember(d => d.ExpiresOn, o => 
                {
                    o.PreCondition(p => "Credit".Equals(p.PaymentType, StringComparison.OrdinalIgnoreCase)
                                  && p.CardExpirationYear.IsNotNullOrWhiteSpace()
                                  && p.CardExpirationMonth.IsNotNullOrWhiteSpace());
                    o.MapFrom(s => s.CardExpirationYear.Is<int>() 
                                && s.CardExpirationMonth.Is<int>()
                                 ? new DateTime(s.CardExpirationYear.Parse<int>(), s.CardExpirationMonth.Parse<int>(), 1)
                                 : null as DateTimeOffset?);
				})
				;


			CreateMap<PaymentResult, PaymentResultViewModel>()
				.ReverseMap()
				;
        }
    }
}
