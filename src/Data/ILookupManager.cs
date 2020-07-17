using System.Collections.Generic;
using System.Threading.Tasks;
using ScentAir.Payment.Models;

namespace ScentAir.Payment
{
    public interface ILookupManager
    {
        Task<ICollection<IdentityQuestion>> ListQuestionsAsync(string language);
    }
}