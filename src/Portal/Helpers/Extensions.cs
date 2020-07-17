using ScentAir.Payment.ViewModels;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Linq.Expressions;
using Microsoft.Extensions.Logging;

namespace ScentAir.Payment.Helpers
{
    public static class Extensions
    {
        public static void AddPagination(this HttpResponse response, int currentPage, int itemsPerPage, int totalItems, int totalPages)
        {
            response.Headers.Add("Pagination", JsonConvert.SerializeObject(new PagingHeader(currentPage, itemsPerPage, totalItems, totalPages)));
            response.Headers.Add("access-control-expose-headers", "Pagination"); // CORS
        }

        public static void AddApplicationError(this HttpResponse response, string message)
        {
            response.Headers.Add("Application-Error", message);
            response.Headers.Add("access-control-expose-headers", "Application-Error");// CORS
        }
        public static ModelStateDictionary Add(this ModelStateDictionary modelState, string message)
        {
            return Add(modelState, string.Empty, message);
        }
        public static ModelStateDictionary Add(this ModelStateDictionary modelState, string key, string message)
        {
            modelState.AddModelError(key, message);

            return modelState;
        }
        public static ModelStateDictionary Add<T>(this ModelStateDictionary modelState, Expression<Func<T, object>> expression, string message)
        {
            modelState.AddModelError(expression, message);

            return modelState;
        }
        public static ModelStateDictionary Add(this ModelStateDictionary modelState, IEnumerable<string> errors)
        {
            return Add(modelState, string.Empty, errors);
        }
        public static ModelStateDictionary Add(this ModelStateDictionary modelState, string key, IEnumerable<string> errors)
        {
            foreach (var error in errors)
                modelState.AddModelError(key, error);

            return modelState;
        }
        public static ModelStateDictionary Add(this ModelStateDictionary modelState, ITaskResult dataResult)
        {
            foreach (var (entity, errors) in dataResult)
                foreach (var err in errors)
					if (err != null)
						modelState.AddModelError(entity, err);

            return modelState;
        }



        public static async Task IgnoreAsync(this Task task, Action<Exception, string, object[]> exceptionLogger = null, string message = null, params object[] args)
        {
            await IgnoreAsync<Exception>(task, exceptionLogger, message, args);
        }
        public static async Task IgnoreAsync<E>(this Task task, Action<E, string, object[]> exceptionLogger = null, string message = null, params object[] args) where E : Exception
        {
            try
            {
                await task;
            }
            catch (E e)
            {
                exceptionLogger?.Invoke(e, message, args);
            }
        }
        public static async Task<T> IgnoreAsync<T>(this Task<T> task, Action<Exception, string, object[]> exceptionLogger = null, string message = null, params object[] args)
        {
            return await IgnoreAsync<T, Exception>(task, exceptionLogger, message, args);
        }
        public static async Task<T> IgnoreAsync<T, E>(this Task<T> task, Action<E, string, object[]> exceptionLogger = null, string message = null, params object[] args) where E : Exception
        {
            var result = default(T);
            try
            {
                result = await task;
            }
            catch (E e)
            {
                exceptionLogger?.Invoke(e, message, args);
            }
            return result;
        }
        public static async Task<ITaskResult<T>> CatchAsync<T>(this Task<T> task, Action<Exception, string, object[]> exceptionLogger = null, string message = null, params object[] args)
        {
            return await CatchAsync<T, Exception>(task, exceptionLogger, message, args);
        }
        public static async Task<ITaskResult<T>> CatchAsync<T, E>(this Task<T> task, Action<E, string, object[]> exceptionLogger = null, string message = null, params object[] args) where E : Exception
        {
            var result = new Impl.TaskResultBuilder<T>();
            try
            {
                var ret = await task;

                result.Success(ret);
            }
            catch (E e)
            {
                result.Fail(e);

                exceptionLogger?.Invoke(e, message, args);
            }

            return result;
        }
    }
}
