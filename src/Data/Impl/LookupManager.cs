using Microsoft.EntityFrameworkCore;
using ScentAir.Payment.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScentAir.Payment.Impl
{
    public class LookupManager : ILookupManager
    {
        private readonly PortalDbContext portalContext;



        public LookupManager(PortalDbContext portalContext)
        {
            this.portalContext = portalContext;
        }


        public async Task<ICollection<IdentityQuestion>> ListQuestionsAsync(string language) => await portalContext.Questions.Where(l => l.Language.ToUpper() == language.ToUpper()).ToArrayAsync();
    }
}
