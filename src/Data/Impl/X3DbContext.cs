using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using ScentAir.Payment.Models.X3;

namespace ScentAir.Payment.Impl
{
    public partial class X3DbContext : DbContext
    {
        public X3DbContext()
        {
        }

        public X3DbContext(DbContextOptions<X3DbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Customer> Customers { get; set; }
        public virtual DbSet<InvoiceDetail> InvoiceDetails { get; set; }
        public virtual DbSet<Invoice> InvoiceHeaders { get; set; }
        public virtual DbSet<InvoiceTax> InvoiceTaxes { get; set; }



        public async Task<ITaskResult<int>> SaveAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            return await SaveChangesAsync(cancellationToken).InvokeAsync();
        }
        public async Task<ITaskResult<int>> SaveAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default(CancellationToken))
        {
            return await SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken).InvokeAsync();
        }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Customer>(entity =>
            {
                entity.Property(e => e.CustomerNumber).ValueGeneratedNever();
            });

            modelBuilder.Entity<Invoice>(entity =>
            {
                entity.HasIndex(e => new { e.Balance, e.DateDue, e.SoldToCustomer })
                    .HasName("IX_INVOICE_HEADER");

                entity.Property(e => e.Number).ValueGeneratedNever();

                entity.Property(e => e.DocType).IsUnicode(false);
                entity.HasOne(d => d.SoldTo).WithMany(p => p.InvoiceAsSoldTo).HasForeignKey(d => d.SoldToCustomer).OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_INVOICE_HEADER_CUSTOMER");
                entity.HasOne(d => d.BillTo).WithMany(p => p.InvoiceAsBilledTo).HasForeignKey(d => d.BillToCustomer).OnDelete(DeleteBehavior.ClientSetNull);
                    //.HasConstraintName("FK_INVOICE_HEADER_BILLEDTO");
            });

            modelBuilder.Entity<InvoiceDetail>(entity =>
            {
                entity.HasKey(e => new { e.InvoiceNumber, e.LineNumber });

                entity.HasOne(d => d.Invoice).WithMany(p => p.InvoiceDetails).HasForeignKey(d => d.InvoiceNumber).OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_INVOICE_DETAIL_INVOICE_HEADER");
            });

            modelBuilder.Entity<InvoiceTax>(entity =>
            {
                entity.HasKey(e => new {e.InvoiceNumber, e.BPR,e.TaxDesc });//, e.LineNumber });

                //entity.HasOne(d => d.Invoice).WithMany(p => p.InvoiceTaxes).HasForeignKey(d => d.InvoiceNumber).OnDelete(DeleteBehavior.ClientSetNull)
                //    .HasConstraintName("FK_INVOICE_TAXES_INVOICE_HEADER");
            });

            OnModelCreatingPartial(modelBuilder);
        }

#pragma warning disable IDE1006 // Naming Styles
        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
#pragma warning restore IDE1006 // Naming Styles
    }
}
