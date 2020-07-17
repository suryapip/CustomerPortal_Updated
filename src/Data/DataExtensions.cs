using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ScentAir.Payment.Impl;
using ScentAir.Payment.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;

namespace ScentAir.Payment
{
	public static class StringExtensions
	{
		public static bool IsNullOrWhiteSpace(this string source)
		{
			return string.IsNullOrWhiteSpace(source);
		}
		public static bool IsNotNullOrWhiteSpace(this string source)
		{
			return !string.IsNullOrWhiteSpace(source);
		}
		public static string OrEmpty(this string source)
		{
			return source.IsNull() ? string.Empty : source;
		}

		public static string Left(this string source, int length)
		{
			if (source.IsNullOrWhiteSpace())
				return source;

			if (length >= source.Length)
				return source;

			return source.Substring(0, length);
		}
		public static string LeftOrEmpty(this string source, int length)
		{
			var result = source.OrEmpty();

			if (length >= result.Length)
				return source;

			return result.Substring(0, length);
		}
		public static string Right(this string source, int length)
		{
			if (source.IsNullOrWhiteSpace())
				return source;

			var start = source.Length - length;
			if (start <= 0)
				return source;

			return source.Substring(start, length);
		}
		public static string RightOrEmpty(this string source, int length)
		{
			var result = source.OrEmpty();

			var start = result.Length - length;
			if (start <= 0)
				return result;

			return result.Substring(start, length);
		}


        public static bool Is<T>(this string source)
        {
            var ret = false;
            try
            {
                var converter = TypeDescriptor.GetConverter(typeof(T));

                converter.ConvertFromString(source);

                ret = true;
            }
            catch
            {

            }
            return ret;
        }
        public static T Parse<T>(this string source)
        {
            var ret = default(T);
            try
            {
                var converter = TypeDescriptor.GetConverter(typeof(T));

                ret = (T) converter.ConvertFromString(source);
            }
            catch
            {

            }
            return ret;
        }
    }

	[Flags]
    public enum DatePart : int
    {
        None = 0,
        Total = 1,

        Year  = Total << 1,
        Month = Year << 1,
        Days  = Month << 1,
        
        All = Year | Month | Days,
    }
    [Flags]
    public enum TimePart : int
    {
        None = 0,

        Total = 1 << 8,
        Hours = Total << 1,
        Minutes = Hours << 1,
        Seconds = Minutes << 1,
        Milliseconds = Seconds << 1,


        All = Hours | Minutes | Seconds | Milliseconds,
    }
    

    internal static class DataExtensions
    {
        public static DateTimeOffset Part(this DateTimeOffset date, DatePart dateParts = DatePart.All, TimePart timeParts = TimePart.All)
        {
            var years = (dateParts & DatePart.Year) == DatePart.Year ? date.Year : 0;
            var months = (dateParts & DatePart.Year) == DatePart.Year ? date.Month : 0;
            var days = (dateParts & DatePart.Year) == DatePart.Year ? date.Day : 0;

            var hours = (timeParts & TimePart.Hours) == TimePart.Hours ? date.Hour : 0;
            var minutes = (timeParts & TimePart.Minutes) == TimePart.Minutes ? date.Minute : 0;
            var seconds = (timeParts & TimePart.Seconds) == TimePart.Seconds ? date.Second : 0;
            var milliseconds = (timeParts & TimePart.Milliseconds) == TimePart.Milliseconds ? date.Millisecond : 0;

            return new DateTimeOffset(years, months, days, hours, minutes, seconds, milliseconds, date.Offset);

        }
        public static Expression<Func<Address, bool>> CreatePredicateExpression(this Address address)
        {
            return x => x.AreEquivalent(address);
        }
        public static bool AreEquivalent(this byte[] a, byte[] b)
        {
            return ByteArrayEqualityComparer.Default.Equals(a, b);
        }
        public static bool AreDifferent(this byte[] a, byte[] b)
        {
            return !AreEquivalent(a, b);
        }

        public static bool IsNotNull<T>(this T obj)
        {
            return !IsNull<T>(obj);
        }
        public static bool IsNull<T>(this T obj)
        {
            return EqualityComparer<T>.Default.Equals(obj, default(T));
        }

        public static bool AreEquivalent(this Address a, Address b)
        {
            return
                a != null &&
                b != null &&
                a.Line1 == b.Line1 &&
                a.Line2 == b.Line2 &&
                a.Line3 == b.Line3 &&
                a.Municipality == b.Municipality &&
                a.StateOrProvince == b.StateOrProvince &&
                a.Country == b.Country &&
                a.PostalCode == b.PostalCode;
        }
        public static bool AreDifferent(this Address a, Address b)
        {
            return
                (a == null && b != null) ||
                (a != null && b == null) ||
                ((a != null && b != null) &&
                 (a.Line1 != b.Line1 ||
                  a.Line2 != b.Line2 ||
                  a.Line3 != b.Line3 ||
                  a.Municipality != b.Municipality ||
                  a.StateOrProvince != b.StateOrProvince ||
                  a.Country != b.Country ||
                  a.PostalCode != b.PostalCode));
        }

        public static T OrEmpty<T>(this T source) where T : IEnumerable, new()
        {
            return source != null
                 ? source
                 : new T();
        }
        public static IEnumerable<T> OrEmpty<T>(this IEnumerable<T> source)
        {
            return source ?? new T[0];
        }
        public static ICollection<T> OrEmpty<T>(this ICollection<T> source)
        {
            return source ?? new T[0];
        }
        public static IList<T> OrEmpty<T>(this IList<T> source)
        {
            return source ?? new T[0];
        }


        public static string Or(this string a, params string[] others)
        {
            return Or(a, string.IsNullOrWhiteSpace, others);
        }
        public static string Or(this string value, Func<string, bool> whenValueIs, params string[] others)
        {
            if (!whenValueIs(value))
                return value;

            var remaining = others.Length > 1
                          ? others.Skip(1).ToArray()
                          : new string[0];
            var next = others.FirstOrDefault();

            return others.Length == 0
                 ? value
                 : Or(next, whenValueIs, remaining);
        }

        public static string CopyNotEmpty<T>(this T destination, Expression<Func<T, string>> expr, T source)
        {
            return CopyIf<T, string>(destination, expr, source, StringExtensions.IsNotNullOrWhiteSpace);
        }
        public static U CopyNotNull<T, U>(this T destination, Expression<Func<T, U>> expr, T source)
        {
            return CopyIf<T, U>(destination, expr, source, IsNotNull);
        }
        public static U CopyIf<T, U>(this T destination, Expression<Func<T, U>> expr, T source, Func<U, bool> whenValueIs)
        {
            var result = default(U);


            var me = expr as MemberExpression ?? ((expr as LambdaExpression).Body as MemberExpression);

            var pi = me.Member as PropertyInfo;
            var sourceVal = (U)pi.GetValue(source);

            if (whenValueIs(sourceVal))
            {
                result = sourceVal;
                pi.SetValue(destination, sourceVal);
            }
            else
            {
                result = (U)pi.GetValue(destination);
            }

            return result;
        }
        public static U CopyIf<T, U>(this T destination, Expression<Func<T, U>> expr, T source, Func<U, U, bool> predicate)
        {
            var result = default(U);


            var me = expr as MemberExpression ?? ((expr as LambdaExpression).Body as MemberExpression);

            var pi = me.Member as PropertyInfo;

            var origVal = (U)pi.GetValue(destination);
            var sourceVal = (U)pi.GetValue(source);

            if (predicate(origVal, sourceVal))
            {
                result = sourceVal;
                pi.SetValue(destination, sourceVal);
            }
            else
            {
                result = origVal;
            }

            return result;
        }
        public static U CopyIf<T, U>(this T destination, Expression<Func<T, U>> expr, T source, IEqualityComparer<U> equalityComparer)
        {
            var result = default(U);


            var me = expr as MemberExpression ?? ((expr as LambdaExpression).Body as MemberExpression);

            var pi = me.Member as PropertyInfo;

            var origVal = (U)pi.GetValue(destination);
            var sourceVal = (U)pi.GetValue(source);

            if (!equalityComparer.Equals(origVal, sourceVal))
            {
                result = sourceVal;
                pi.SetValue(destination, sourceVal);
            }
            else
            {
                result = origVal;
            }

            return result;
        }

        public static string SetNotEmpty<T>(this T destination, Expression<Func<T, string>> expr, string value)
        {
            return SetIf<T, string>(destination, expr, value, StringExtensions.IsNotNullOrWhiteSpace);
        }
        public static U SetNotNull<T, U>(this T destination, Expression<Func<T, U>> expr, U value)
        {
            return SetIf<T, U>(destination, expr, value, IsNotNull);
        }
        public static U SetIf<T, U>(this T destination, Expression<Func<T, U>> expr, U value, Func<U, bool> whenValueIs)
        {
            var result = default(U);


            var me = expr as MemberExpression ?? ((expr as LambdaExpression).Body as MemberExpression);

            var pi = me.Member as PropertyInfo;
            var origVal = (U)pi.GetValue(destination);

            if (whenValueIs(origVal))
            {
                result = value;
                pi.SetValue(destination, value);
            }
            else
            {
                result = origVal;
            }

            return result;
        }
        public static U SetIf<T, U>(this T destination, Expression<Func<T, U>> expr, U value, Func<U, U, bool> predicate)
        {
            var result = default(U);


            var me = expr as MemberExpression ?? ((expr as LambdaExpression).Body as MemberExpression);

            var pi = me.Member as PropertyInfo;
            var origVal = (U)pi.GetValue(destination);

            if (predicate(origVal, value))
            {
                result = value;
                pi.SetValue(destination, value);
            }
            else
            {
                result = origVal;
            }

            return result;
        }
        public static U SetIf<T, U>(this T destination, Expression<Func<T, U>> expr, U value, IEqualityComparer<U> equalityComparer)
        {
            var result = default(U);


            var me = expr as MemberExpression ?? ((expr as LambdaExpression).Body as MemberExpression);

            var pi = me.Member as PropertyInfo;
            var origVal = (U)pi.GetValue(destination);

            if (!equalityComparer.Equals(origVal, value))
            {
                result = value;
                pi.SetValue(destination, value);
            }
            else
            {
                result = origVal;
            }

            return result;
        }


        public static Transform<T> Transform<T>(this IEnumerable<T> source)
        {
            return new Transform<T>(source);
        }
    }

    public static class SafeExtensions
    {
        public static async Task<ITaskResult> InvokeAsync(this Task method, ILogger logger = null, string errorMessage = null, params object[] args)
        {
            var result = new TaskResultBuilder();

            var errors = new List<string>();
            try
            {
                await method;

                result.Success();
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);

                errors.Add(e.GetBaseException().Message);

                foreach (var ie in e.InnerExceptions)
                    errors.Add(ie?.Message);
            }
            catch (Exception e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);

                errors.Add(e.Message);
                errors.Add(e.InnerException?.Message);
            }


            return errors.Count > 0
                 ? result.Add("invoke", errors).Fail()
                 : result;
        }
        public static async Task<ITaskResult<T>> InvokeAsync<T>(this Task<T> method, ILogger logger = null, string errorMessage = null, params object[] args)
        {
            var result = new TaskResultBuilder<T>();

            var errors = new List<string>();
            try
            {
                var ret = await method;

                result.Success(ret);
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);

                errors.Add(e.GetBaseException().Message);

                foreach (var ie in e.InnerExceptions)
                    errors.Add(ie?.Message);
            }
            catch (Exception e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);

                errors.Add(e.Message);
                errors.Add(e.InnerException?.Message);
            }


            return errors.Count > 0
                 ? result.Add("invoke", errors).Fail()
                 : result;
        }
        public static async Task<ITaskResult> InvokeAsync(this Func<Task> method, ILogger logger = null, string errorMessage = null, params object[] args)
        {
            var result = new TaskResultBuilder();

            var errors = new List<string>();
            try
            {
                await method();

                result.Success();
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);

                errors.Add(e.GetBaseException().Message);

                foreach (var ie in e.InnerExceptions)
                    errors.Add(ie?.Message);
            }
            catch (Exception e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);

                errors.Add(e.Message);
                errors.Add(e.InnerException?.Message);
            }
            

            return errors.Count > 0
                 ? result.Add("invoke", errors).Fail()
                 : result;
        }
        public static async Task<ITaskResult<T>> InvokeAsync<T>(this Func<Task<T>> method, ILogger logger = null, string errorMessage = null, params object[] args)
        {
            var result = new TaskResultBuilder<T>();

            var errors = new List<string>();
            try
            {
                var ret = await method();

                result.Success(ret);
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);

                errors.Add(e.GetBaseException().Message);

                foreach (var ie in e.InnerExceptions)
                    errors.Add(ie?.Message);
            }
            catch (Exception e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);

                errors.Add(e.Message);
                errors.Add(e.InnerException?.Message);
            }

            return errors.Count > 0
                 ? result.Add("invoke", errors).Fail()
                 : result;
        }
        public static async Task<ITaskResult> InvokeAsync(this Func<CancellationToken, Task> method, CancellationToken cancellationToken, ILogger logger = null, string errorMessage = null, params object[] args)
        {
            var result = new TaskResultBuilder();

            var errors = new List<string>();
            try
            {
                await method(cancellationToken);

                result.Success();
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);

                errors.Add(e.GetBaseException().Message);

                foreach (var ie in e.InnerExceptions)
                    errors.Add(ie?.Message);
            }
            catch (Exception e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);

                errors.Add(e.Message);
                errors.Add(e.InnerException?.Message);
            }


            return errors.Count > 0
                 ? result.Add("invoke", errors).Fail()
                 : result;
        }
        public static async Task<ITaskResult<T>> InvokeAsync<T>(this Func<CancellationToken, Task<T>> method, CancellationToken cancellationToken, ILogger logger = null, string errorMessage = null, params object[] args)
        {
            var result = new TaskResultBuilder<T>();

            var errors = new List<string>();
            try
            {
                var ret = await method(cancellationToken);

                result.Success(ret);
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);

                errors.Add(e.GetBaseException().Message);

                foreach (var ie in e.InnerExceptions)
                    errors.Add(ie?.Message);
            }
            catch (Exception e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);

                errors.Add(e.Message);
                errors.Add(e.InnerException?.Message);
            }


            return errors.Count > 0
                 ? result.Add("invoke", errors).Fail()
                 : result;
        }


        public static ITaskResult Invoke(Action method, ILogger logger = null, string errorMessage = null, params object[] args)
        {
            var result = new TaskResultBuilder();

            var errors = new List<string>();
            try
            {
                method();

                result.Success();
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);

                errors.Add(e.GetBaseException().Message);

                foreach (var ie in e.InnerExceptions)
                    errors.Add(ie?.Message);
            }
            catch (Exception e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);

                errors.Add(e.Message);
                errors.Add(e.InnerException?.Message);
            }


            return errors.Count > 0
                 ? result.Add("invoke", errors).Fail()
                 : result;
        }
        public static ITaskResult<T> Invoke<T>(Func<T> method, ILogger logger = null, string errorMessage = null, params object[] args)
        {
            var result = new TaskResultBuilder<T>();

            var errors = new List<string>();
            try
            {
                var ret = method();

                result.Success(ret);
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);

                errors.Add(e.GetBaseException().Message);

                foreach (var ie in e.InnerExceptions)
                    errors.Add(ie?.Message);
            }
            catch (Exception e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);

                errors.Add(e.Message);
                errors.Add(e.InnerException?.Message);
            }

            return errors.Count > 0
                 ? result.Add("invoke", errors).Fail()
                 : result;
        }


        public static async Task<bool> CatchDbAsync(this Task method, ILogger logger = null, string errorMessage = null, params object[] args)
        {
            var result = false;

            try
            {
                await method;

                result = true;
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (DbUpdateConcurrencyException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (DbUpdateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (SqlException e)
            {
                logger?.LogCritical(e, errorMessage ?? string.Empty, args);
            }


            return result;
        }
        public static async Task<bool> CatchDbAsync(this Func<Task> method, ILogger logger = null, string errorMessage = null, params object[] args)
        {
            var result = false;

            try
            {
                await method();

                result = true;
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (DbUpdateConcurrencyException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (DbUpdateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (SqlException e)
            {
                logger?.LogCritical(e, errorMessage ?? string.Empty, args);
            }


            return result;
        }
        public static async Task<bool> CatchDbAsync(this Func<CancellationToken, Task> method, CancellationToken cancellationToken, ILogger logger = null, string errorMessage = null, params object[] args)
        {
            var result = false;

            try
            {
                await method(cancellationToken);

                result = true;
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (DbUpdateConcurrencyException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (DbUpdateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (SqlException e)
            {
                logger?.LogCritical(e, errorMessage ?? string.Empty, args);
            }


            return result;
        }
        public static async Task<T> CatchDbAsync<T>(this Task<T> method, T defaultResult, ILogger logger = null, string errorMessage = null, params object[] args) where T : struct
        {
            var result = defaultResult;

            try
            {
                var ret = await method;

                result = ret;
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (DbUpdateConcurrencyException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (DbUpdateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (SqlException e)
            {
                logger?.LogCritical(e, errorMessage ?? string.Empty, args);
            }


            return result;
        }
        public static async Task<T> CatchDbAsync<T>(this Func<Task<T>> method, T defaultResult, ILogger logger = null, string errorMessage = null, params object[] args) where T : class
        {
            var result = defaultResult;

            try
            {
                var ret = await method();

                result = ret;
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (DbUpdateConcurrencyException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (DbUpdateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (SqlException e)
            {
                logger?.LogCritical(e, errorMessage ?? string.Empty, args);
            }


            return result;
        }
        public static async Task<T> CatchDbAsync<T>(this Func<CancellationToken, Task<T>> method, T defaultResult, CancellationToken cancellationToken, ILogger logger = null, string errorMessage = null, params object[] args) where T : struct
        {
            var result = defaultResult;

            try
            {
                var ret = await method(cancellationToken);

                result = ret;
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (DbUpdateConcurrencyException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (DbUpdateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (SqlException e)
            {
                logger?.LogCritical(e, errorMessage ?? string.Empty, args);
            }


            return result;
        }

        public static async Task<T> CatchDbAsync<T>(this Task<T> method, ILogger logger = null, string errorMessage = null, params object[] args) where T : class
        {
            var result = default(T);

            try
            {
                var ret = await method;

                result = ret;
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (DbUpdateConcurrencyException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (DbUpdateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (SqlException e)
            {
                logger?.LogCritical(e, errorMessage ?? string.Empty, args);
            }


            return result;
        }
        public static async Task<T> CatchDbAsync<T>(this Func<Task<T>> method, ILogger logger = null, string errorMessage = null, params object[] args) where T : class
        {
            var result = default(T);

            try
            {
                var ret = await method();

                result = ret;
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (DbUpdateConcurrencyException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (DbUpdateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (SqlException e)
            {
                logger?.LogCritical(e, errorMessage ?? string.Empty, args);
            }


            return result;
        }
        public static async Task<T> CatchDbAsync<T>(this Func<CancellationToken, Task<T>> method, CancellationToken cancellationToken, ILogger logger = null, string errorMessage = null, params object[] args) where T : class
        {
            var result = default(T);

            try
            {
                var ret = await method(cancellationToken);

                result = ret;
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (DbUpdateConcurrencyException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (DbUpdateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (SqlException e)
            {
                logger?.LogCritical(e, errorMessage ?? string.Empty, args);
            }


            return result;
        }


        public static bool CatchDb(Action method, ILogger logger = null, string errorMessage = null, params object[] args)
        {
            var result = false;

            try
            {
                method();

                result = true;
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (DbUpdateConcurrencyException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (DbUpdateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (SqlException e)
            {
                logger?.LogCritical(e, errorMessage ?? string.Empty, args);
            }


            return result;
        }
        public static T CatchDb<T>(Func<T> method, ILogger logger = null, string errorMessage = null, params object[] args) where T : class
        {
            var result = default(T);

            try
            {
                var ret = method();

                result = ret;
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (DbUpdateConcurrencyException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (DbUpdateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (SqlException e)
            {
                logger?.LogCritical(e, errorMessage ?? string.Empty, args);
            }


            return result;
        }



        public static async Task<bool> SafeAsync(this Task method, ILogger logger = null, string errorMessage = null, params object[] args)
        {
            var result = false;

            try
            {
                await method;

                result = true;
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (Exception e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }


            return result;
        }
        public static async Task<bool> SafeAsync(this Func<Task> method, ILogger logger = null, string errorMessage = null, params object[] args)
        {
            var result = false;

            try
            {
                await method();

                result = true;
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (Exception e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }


            return result;
        }
        public static async Task<bool> SafeAsync(this Func<CancellationToken, Task> method, CancellationToken cancellationToken, ILogger logger = null, string errorMessage = null, params object[] args)
        {
            var result = false;

            try
            {
                await method(cancellationToken);

                result = true;
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (Exception e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }


            return result;
        }
        public static async Task<T> SafeAsync<T>(this Task<T> method, T defaultResult, ILogger logger = null, string errorMessage = null, params object[] args) where T : struct
        {
            var result = defaultResult;

            try
            {
                var ret = await method;

                result = ret;
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (Exception e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }


            return result;
        }
        public static async Task<T> SafeAsync<T>(this Func<Task<T>> method, T defaultResult, ILogger logger = null, string errorMessage = null, params object[] args) where T : class
        {
            var result = defaultResult;

            try
            {
                var ret = await method();

                result = ret;
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (Exception e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }


            return result;
        }
        public static async Task<T> SafeAsync<T>(this Func<CancellationToken, Task<T>> method, T defaultResult, CancellationToken cancellationToken, ILogger logger = null, string errorMessage = null, params object[] args) where T : struct
        {
            var result = defaultResult;

            try
            {
                var ret = await method(cancellationToken);

                result = ret;
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (Exception e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }


            return result;
        }

        public static async Task<T> SafeAsync<T>(this Task<T> method, ILogger logger = null, string errorMessage = null, params object[] args) where T : class
        {
            var result = default(T);

            try
            {
                var ret = await method;

                result = ret;
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (Exception e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }



            return result;
        }
        public static async Task<T> SafeAsync<T>(this Func<Task<T>> method, ILogger logger = null, string errorMessage = null, params object[] args) where T : class
        {
            var result = default(T);

            try
            {
                var ret = await method();

                result = ret;
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (Exception e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }



            return result;
        }
        public static async Task<T> SafeAsync<T>(this Func<CancellationToken, Task<T>> method, CancellationToken cancellationToken, ILogger logger = null, string errorMessage = null, params object[] args) where T : class
        {
            var result = default(T);

            try
            {
                var ret = await method(cancellationToken);

                result = ret;
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (Exception e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }



            return result;
        }


        public static bool Safe(Action method, ILogger logger = null, string errorMessage = null, params object[] args)
        {
            var result = false;

            try
            {
                method();

                result = true;
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (Exception e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }


            return result;
        }
        public static T Safe<T>(Func<T> method, ILogger logger = null, string errorMessage = null, params object[] args) where T : class
        {
            var result = default(T);

            try
            {
                var ret = method();

                result = ret;
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (Exception e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }


            return result;
        }


        public static async Task<bool> BubbleAsync(this Task method, ILogger logger = null, string errorMessage = null, params object[] args)
        {
            var result = false;

            try
            {
                await method;

                result = true;
            }
            catch (ApplicationException e)
            {
                logger?.LogDebug(e, errorMessage ?? string.Empty, args);

                throw e;
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (Exception e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }


            return result;
        }
        public static async Task<bool> BubbleAsync(this Func<Task> method, ILogger logger = null, string errorMessage = null, params object[] args)
        {
            var result = false;

            try
            {
                await method();

                result = true;
            }
            catch (ApplicationException e)
            {
                logger?.LogDebug(e, errorMessage ?? string.Empty, args);

                throw e;
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (Exception e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }


            return result;
        }
        public static async Task<bool> BubbleAsync(this Func<CancellationToken, Task> method, CancellationToken cancellationToken, ILogger logger = null, string errorMessage = null, params object[] args)
        {
            var result = false;

            try
            {
                await method(cancellationToken);

                result = true;
            }
            catch (ApplicationException e)
            {
                logger?.LogDebug(e, errorMessage ?? string.Empty, args);

                throw e;
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (Exception e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }


            return result;
        }
        public static async Task<T> BubbleAsync<T>(this Task<T> method, T defaultResult, ILogger logger = null, string errorMessage = null, params object[] args) where T : struct
        {
            var result = defaultResult;

            try
            {
                var ret = await method;

                result = ret;
            }
            catch (ApplicationException e)
            {
                logger?.LogDebug(e, errorMessage ?? string.Empty, args);

                throw e;
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (Exception e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }


            return result;
        }
        public static async Task<T> BubbleAsync<T>(this Func<Task<T>> method, T defaultResult, ILogger logger = null, string errorMessage = null, params object[] args) where T : class
        {
            var result = defaultResult;

            try
            {
                var ret = await method();

                result = ret;
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (Exception e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }


            return result;
        }
        public static async Task<T> BubbleAsync<T>(this Func<CancellationToken, Task<T>> method, T defaultResult, CancellationToken cancellationToken, ILogger logger = null, string errorMessage = null, params object[] args) where T : struct
        {
            var result = defaultResult;

            try
            {
                var ret = await method(cancellationToken);

                result = ret;
            }
            catch (ApplicationException e)
            {
                logger?.LogDebug(e, errorMessage ?? string.Empty, args);

                throw e;
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (Exception e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }


            return result;
        }

        public static async Task<T> BubbleAsync<T>(this Task<T> method, ILogger logger = null, string errorMessage = null, params object[] args) where T : class
        {
            var result = default(T);

            try
            {
                var ret = await method;

                result = ret;
            }
            catch (ApplicationException e)
            {
                logger?.LogDebug(e, errorMessage ?? string.Empty, args);

                throw e;
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (Exception e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }



            return result;
        }
        public static async Task<T> BubbleAsync<T>(this Func<Task<T>> method, ILogger logger = null, string errorMessage = null, params object[] args) where T : class
        {
            var result = default(T);

            try
            {
                var ret = await method();

                result = ret;
            }
            catch (ApplicationException e)
            {
                logger?.LogDebug(e, errorMessage ?? string.Empty, args);

                throw e;
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (Exception e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }



            return result;
        }
        public static async Task<T> BubbleAsync<T>(this Func<CancellationToken, Task<T>> method, CancellationToken cancellationToken, ILogger logger = null, string errorMessage = null, params object[] args) where T : class
        {
            var result = default(T);

            try
            {
                var ret = await method(cancellationToken);

                result = ret;
            }
            catch (ApplicationException e)
            {
                logger?.LogDebug(e, errorMessage ?? string.Empty, args);

                throw e;
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (Exception e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }



            return result;
        }


        public static bool Bubble(Action method, ILogger logger = null, string errorMessage = null, params object[] args)
        {
            var result = false;

            try
            {
                method();

                result = true;
            }
            catch (ApplicationException e)
            {
                logger?.LogDebug(e, errorMessage ?? string.Empty, args);

                throw e;
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (Exception e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }


            return result;
        }
        public static T Bubble<T>(Func<T> method, ILogger logger = null, string errorMessage = null, params object[] args) where T : class
        {
            var result = default(T);

            try
            {
                var ret = method();

                result = ret;
            }
            catch (ApplicationException e)
            {
                logger?.LogDebug(e, errorMessage ?? string.Empty, args);

                throw e;
            }
            catch (AggregateException e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }
            catch (Exception e)
            {
                logger?.LogError(e, errorMessage ?? string.Empty, args);
            }


            return result;
        }
    }
}
