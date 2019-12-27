using FluentValidation;


namespace ScentAir.Payment.ViewModels
{
    public class AccountViewModelValidator : AbstractValidator<AccountViewModel>
    {
        public AccountViewModelValidator()
        {
            RuleFor(register => register.Name)
                .NotEmpty()
                .WithMessage("Customer name cannot be empty");
        }
    }
}
