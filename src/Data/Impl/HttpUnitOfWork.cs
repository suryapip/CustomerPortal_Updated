using Microsoft.AspNetCore.Http;

namespace ScentAir.Payment.Impl
{
    public class HttpUnitOfWork : UnitOfWork
    {
        public HttpUnitOfWork(PortalDbContext context, IHttpContextAccessor httpAccessor) : base(context)
        {
            //context.CurrentUserId = httpAccessor.HttpContext.User.FindFirst(OpenIdConnectConstants.Claims.Subject)?.Value?.Trim();
        }
    }
}
