using ScentAir.Payment.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ScentAir.Payment.Repositories
{
    public interface ICustomerRepository : IRepository<Account>
    {
        IEnumerable<Account> GetTopActiveCustomers(int count);
        IEnumerable<Account> GetAllCustomersData();
    }
}
