using ScentAir.Payment.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScentAir.Payment
{
    public interface IUnitOfWork
    {
        ICustomerRepository Customers { get; }
        IInvoiceRepository Invoices { get; }


        ITaskResult<int> Save();
    }
}
