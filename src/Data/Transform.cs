using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Reflection;
using System.Collections;

namespace ScentAir.Payment
{
	internal class Transform<T> : IEnumerable<T>
	{
		internal readonly IEnumerable<T> source;
		internal readonly List<Func<T, T>> tranformations;

		public Transform(IEnumerable<T> source)
		{
			this.tranformations = new List<Func<T, T>>();
			this.source = source;
		}


		public Transform<T> Replace<U>(Expression<Func<T, U>> expr, U value, IEqualityComparer<U> equalityComparer)
		{
			var result = default(U);


			var me = expr as MemberExpression ?? ((expr as LambdaExpression).Body as MemberExpression);

			var pi = me.Member as PropertyInfo;

			this.tranformations.Add(x =>
			{
				var origVal = (U)pi.GetValue(x);

				if (!equalityComparer.Equals(origVal, value))
				{
					result = value;
					pi.SetValue(x, value);
				}
				else
				{
					result = origVal;
				}

				return x;
			});

			return this;
		}
		public Transform<T> Replace<U>(Expression<Func<T, U>> expr, U value, Func<U, U, bool> predicate)
		{
			var result = default(U);


			var me = expr as MemberExpression ?? ((expr as LambdaExpression).Body as MemberExpression);

			var pi = me.Member as PropertyInfo;

			this.tranformations.Add(x =>
			{
				var origVal = (U)pi.GetValue(x);

				if (!predicate(origVal, value))
				{
					result = value;
					pi.SetValue(x, value);
				}
				else
				{
					result = origVal;
				}

				return x;
			});

			return this;
		}
		public Transform<T> Replace<U>(Expression<Func<T, U>> expr, U value, Func<U, bool> whenValueIs)
		{
			var result = default(U);


			var me = expr as MemberExpression ?? ((expr as LambdaExpression).Body as MemberExpression);

			var pi = me.Member as PropertyInfo;

			this.tranformations.Add(x =>
			{
				var origVal = (U)pi.GetValue(x);

				if (whenValueIs(origVal))
				{
					result = value;
					pi.SetValue(x, value);
				}
				else
				{
					result = origVal;
				}

				return x;
			});

			return this;
		}
		public Transform<T> Replace<U>(Expression<Func<T, U>> expr, U value)
		{
			return Replace(expr, value, DataExtensions.IsNotNull);
		}

		public IEnumerator<T> GetEnumerator()
		{
			return new tranformEnumerator(this.source, this.tranformations.ToArray());
		}
		IEnumerator IEnumerable.GetEnumerator() => throw new NotImplementedException();

		private class tranformEnumerator : IEnumerator<T>
		{
			private readonly IEnumerator<T> enumerator;
			private readonly ICollection<Func<T, T>> transformations;

			public tranformEnumerator(IEnumerable<T> source, ICollection<Func<T, T>> transformations)
			{
				this.enumerator = source.GetEnumerator();
				this.transformations = transformations;

				if (this.transformations.Count == 0)
					this.transformations.Add(x => x);
			}

			public T Current { get; private set; }
			object IEnumerator.Current
			{
				get
				{
					return Current;
				}
			}

			public bool MoveNext()
			{
				var result = enumerator.MoveNext();

				if (!result)
					return result;

				var element = enumerator.Current;

				foreach (var transform in transformations)
					element = transform(element);

				Current = element;

				return result;
			}
			public void Reset() => throw new NotImplementedException();

			#region IDisposable Support
			private bool disposedValue = false; // To detect redundant calls

			protected virtual void Dispose(bool disposing)
			{
				if (!disposedValue)
				{
					if (disposing)
					{
						enumerator?.Dispose();
					}

					disposedValue = true;
				}
			}


			public void Dispose()
			{
				Dispose(true);
			}
			#endregion
		}
	}
}
