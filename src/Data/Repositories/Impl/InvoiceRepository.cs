using ScentAir.Payment.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ScentAir.Payment.Impl;

namespace ScentAir.Payment.Repositories.Impl
{
    public class InvoiceRepository : Repository<Invoice>, IInvoiceRepository
    {
        public InvoiceRepository(DbContext context) : base(context)
        { }




        private PortalDbContext _appContext => (PortalDbContext)_context;
    }
}
