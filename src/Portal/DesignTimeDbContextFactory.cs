using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using ScentAir.Payment;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using System.Reflection;
using ScentAir.Payment.Impl;

namespace ScentAir.Payment.Portal
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<PortalDbContext>
    {
        public PortalDbContext CreateDbContext(string[] args)
        {
            Mapper.Reset();

            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .AddJsonFile("appsettings.Development.json", optional: true)
                .Build();

            var builder = new DbContextOptionsBuilder<PortalDbContext>();

            //builder.UseInMemoryDatabase("ScentAir.Payments");
            builder.UseSqlServer(configuration["ConnectionStrings:Portal"], b => b.MigrationsAssembly(Assembly.GetExecutingAssembly().FullName));
            builder.UseOpenIddict();

            
            return new PortalDbContext(builder.Options);
        }
    }
}
