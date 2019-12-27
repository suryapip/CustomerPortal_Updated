using Microsoft.Extensions.Configuration;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ScentAir.Payment
{
    public interface IDatabaseInitializer
    {
        Task TestSecurityLocalAsync(CancellationToken cancellationToken);
        Task TestSecurityPostmanAsync(CancellationToken cancellationToken);
        Task InitializeAsync(CancellationToken cancellationToken);
    }
}
