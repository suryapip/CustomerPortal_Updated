using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ScentAir.Payment.Impl;
using ScentAir.Payment.Models;

namespace ScentAir.Payment.Repositories.Impl
{
    public class CustomerRepository : Repository<Account>, ICustomerRepository
    {
        public CustomerRepository(PortalDbContext context) : base(context)
        { }


        public IEnumerable<Account> GetTopActiveCustomers(int count)
        {
            throw new NotImplementedException();
        }


        public IEnumerable<Account> GetAllCustomersData()
        {
            return _appContext.Accounts
                .Include(c => c.BillingAddress)
                .Include(c => c.MailingAddress)
                .Include(c => c.PhysicalAddress)
                .Include(c => c.ShippingAddress)
                .Include(c => c.InvoicesAsReceiver)
                .ThenInclude(o => o.Details)
                .OrderBy(c => c.Name)
                .ToList();
        }



        private PortalDbContext _appContext => (PortalDbContext)_context;
    }
}
