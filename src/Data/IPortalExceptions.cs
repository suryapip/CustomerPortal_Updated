using System.Collections.Generic;

namespace ScentAir.Payment
{
    public interface IPortalExceptions : IDictionary<PortalExceptionType, string> { }
}