using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ScentAir.Payment.Repositories;
using ScentAir.Payment.Repositories.Impl;

namespace ScentAir.Payment.Impl
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly PortalDbContext _context;

        ICustomerRepository _customers;
        IInvoiceRepository _orders;



        public UnitOfWork(PortalDbContext context)
        {
            _context = context;
        }



        public ICustomerRepository Customers
        {
            get
            {
                if (_customers == null)
                    _customers = new CustomerRepository(_context);

                return _customers;
            }
        }





        public IInvoiceRepository Invoices
        {
            get
            {
                if (_orders == null)
                    _orders = new InvoiceRepository(_context);

                return _orders;
            }
        }




        public ITaskResult<int> Save()
        {
            return _context.Save();
        }
    }
}
