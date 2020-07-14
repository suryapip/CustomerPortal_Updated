using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ScentAir.Payment.Models;

namespace ScentAir.Payment
{
    public interface ISFAccountSettingsManager
    {
        Task<SFAccountSettings> GetSFAccountSettingsAsync(string accountNumber, CancellationToken cancellationToken = default(CancellationToken));
        Task<ITaskResult> SaveSFAccountSettingsAsync(SFAccountSettings sfAccountSettings, CancellationToken cancellationToken = default(CancellationToken));

        Task<IList<SFContact>> GetSFContactsAsync(string accountNumber, CancellationToken cancellationToken = default(CancellationToken));
        Task<IList<SFContact>> GetSFContactsAsync(string accountNumber, int page, int pageSize, CancellationToken cancellationToken = default(CancellationToken));
        Task<SFContact> GetSFContactAsync(int id, CancellationToken cancellationToken = default(CancellationToken));
        Task<ITaskResult<SFContact>> SaveSFContactAsync(SFContact sfContact, CancellationToken cancellationToken = default(CancellationToken));

    }
}