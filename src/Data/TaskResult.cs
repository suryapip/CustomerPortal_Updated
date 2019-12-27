using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using ScentAir.Payment.Models;

namespace ScentAir.Payment.Impl
{
    public class TaskResult : IDictionary<string, ICollection<string>>, ITaskResult, ISerializable
    {
        private readonly Dictionary<string, ICollection<string>> data;


        public TaskResult()
        {
            this.data = new Dictionary<string, ICollection<string>>();
        }
        public TaskResult(IDictionary<string, ICollection<string>> dictionary)
        {
            this.data = new Dictionary<string, ICollection<string>>(dictionary);
        }
        public TaskResult(IEqualityComparer<string> comparer)
        {
            this.data = new Dictionary<string, ICollection<string>>(comparer);
        }
        public TaskResult(int capacity)
        {
            this.data = new Dictionary<string, ICollection<string>>(capacity);
        }
        public TaskResult(IDictionary<string, ICollection<string>> dictionary, IEqualityComparer<string> comparer)
        {
            this.data = new Dictionary<string, ICollection<string>>(dictionary, comparer);
        }
        public TaskResult(int capacity, IEqualityComparer<string> comparer)
        {
            this.data = new Dictionary<string, ICollection<string>>(capacity, comparer);
        }



        public TaskExecutionResult ExecutionResult { get; set; } = Payment.TaskExecutionResult.None;
        public bool IsReadOnly => false;
        public ICollection<string> Keys => data.Keys;
        public ICollection<ICollection<string>> Values => data.Values;
		public ICollection<string> Errors => data.Values.SelectMany(v => v).ToList();

		public int Count => data.Count;


        public ICollection<string> this[string key] { get => data[key]; set => data[key] = value; }


        public void Add((string entity, ICollection<string> errors) item) => data.Add(item.entity, new List<string>(item.errors?.Where(err => err.IsNotNullOrWhiteSpace()) ?? new string[] { }));
        public void Add(KeyValuePair<string, ICollection<string>> item) => data.Add(item.Key, new List<string>(item.Value?.Where(err => err.IsNotNullOrWhiteSpace()) ?? new string[] { }));
        public void Add(string key, ICollection<string> value) => data.Add(key, new List<string>(value?.Where(err => err.IsNotNullOrWhiteSpace()) ?? new string[] { }));
        public void Add(string key, IEnumerable<string> value) => data.Add(key, new List<string>(value?.Where(err => err.IsNotNullOrWhiteSpace()) ?? new string[] { }));
        public void Add(string key, string value) => data.Add(key, value.IsNullOrWhiteSpace() ? new List<string>() : new List<string>(new[] { value }));


		public bool Contains((string entity, ICollection<string> errors) item) => data.ContainsKey(item.entity); // && data.ContainsValue(item.errors);
		public bool Contains(KeyValuePair<string, ICollection<string>> item) => data.ContainsKey(item.Key); // && data.ContainsValue(item.Value);
        public bool Remove(string key) => data.Remove(key);
        public bool Remove((string entity, ICollection<string> errors) item) => Remove(item.entity);
        public bool Remove(KeyValuePair<string, ICollection<string>> item) => Remove(item.Key);
        public bool ContainsKey(string key) => data.ContainsKey(key);
        public bool TryGetValue(string key, out ICollection<string> value) => data.TryGetValue(key, out value);
        public void Clear() => data.Clear();
        public void CopyTo((string entity, ICollection<string> errors)[] array, int arrayIndex) => throw new NotImplementedException();
        public void CopyTo(KeyValuePair<string, ICollection<string>>[] array, int arrayIndex) => throw new NotImplementedException();


        struct Enumerator2 : IEnumerator<(string entity, ICollection<string> errors)>
        {
            private readonly IEnumerator<KeyValuePair<string, ICollection<string>>> enumerator;

            public Enumerator2(IEnumerator<KeyValuePair<string, ICollection<string>>> enumerator)
            {
                this.enumerator = enumerator;
            }

            public (string entity, ICollection<string> errors) Current => (enumerator.Current.Key, enumerator.Current.Value);

            object IEnumerator.Current => (enumerator.Current.Key, enumerator.Current.Value);

            public void Dispose() => enumerator.Dispose();
            public bool MoveNext() => enumerator.MoveNext();

            void IEnumerator.Reset() => ((IEnumerator)enumerator).Reset();
        }


        IEnumerator<KeyValuePair<string, ICollection<string>>> IEnumerable<KeyValuePair<string, ICollection<string>>>.GetEnumerator() => data.GetEnumerator();
        IEnumerator IEnumerable.GetEnumerator() => new Enumerator2(data.GetEnumerator());
        IEnumerator<(string entity, ICollection<string> errors)> IEnumerable<(string entity, ICollection<string> errors)>.GetEnumerator() => new Enumerator2(data.GetEnumerator());
        public void GetObjectData(SerializationInfo info, StreamingContext context) => data.GetObjectData(info, context);



        public bool IsSuccessful { get { return (ExecutionResult & TaskExecutionResult.Success) == TaskExecutionResult.Success; } }
        public bool IsFailure { get { return (ExecutionResult & TaskExecutionResult.Failure) == TaskExecutionResult.Failure; } }
    }
    public class TaskResult<T> : TaskResult, ITaskResult<T>
    {
        public TaskResult() : base() { }
        public TaskResult(IDictionary<string, ICollection<string>> dictionary) : base(dictionary) { }
        public TaskResult(IEqualityComparer<string> comparer) : base(comparer) { }
        public TaskResult(int capacity) : base(capacity) { }
        public TaskResult(IDictionary<string, ICollection<string>> dictionary, IEqualityComparer<string> comparer) : base(dictionary, comparer) { }
        public TaskResult(int capacity, IEqualityComparer<string> comparer) : base(capacity, comparer) { }

        public T Result { get; set; }
    }

    public class TaskResultBuilder : TaskResult, ITaskResultBuilder
    {
        public TaskResultBuilder() : base() { }
        public TaskResultBuilder(IDictionary<string, ICollection<string>> dictionary) : base(dictionary) { }
        public TaskResultBuilder(IEqualityComparer<string> comparer) : base(comparer) { }
        public TaskResultBuilder(int capacity) : base(capacity) { }
        public TaskResultBuilder(IDictionary<string, ICollection<string>> dictionary, IEqualityComparer<string> comparer) : base(dictionary, comparer) { }
        public TaskResultBuilder(int capacity, IEqualityComparer<string> comparer) : base(capacity, comparer) { }



        public new ITaskResultBuilder Add(string entity, string message)
        {
			if (message.IsNullOrWhiteSpace())
				return this;

            if (ContainsKey(entity))
                this[entity].Add(message);
            else
                base.Add(entity, new[] { message }.ToList());

            return this;
        }
        public new ITaskResultBuilder Add(string entity, IEnumerable<string> messages)
        {
			var data = messages.Where(message => message.IsNotNullOrWhiteSpace());

            if (ContainsKey(entity))
                foreach (var message in data)
					this[entity].Add(message);
            else
                base.Add(entity, (data ?? new string[] { }).ToList());

            return this;
        }
        public ITaskResultBuilder Add(ITaskResult otherResult)
        {
            foreach (var item in otherResult)
                Add(item);

            this.ExecutionResult |= otherResult.ExecutionResult;

            return this;
        }
        public ITaskResultBuilder Fail()
        {
            ExecutionResult |= TaskExecutionResult.Failure;

            return this;
        }
        public ITaskResultBuilder Success()
        {
            ExecutionResult |= TaskExecutionResult.Success;

            return this;
        }
        public ITaskResultBuilder Fail<E>(E exception) where E : Exception
        {
            Add("error", exception.Message);


            return Fail();
        }


        public static ITaskResult Failed<E>(E exception) where E : Exception
        {
            return new TaskResultBuilder().Add("error", exception.Message).Fail();
        }
        public static ITaskResult Failed()
        {
            return new TaskResultBuilder().Fail();
        }
        public static ITaskResult Successful()
        {
            return new TaskResultBuilder().Success();
        }


        public static ITaskResultBuilder From(ITaskResult result)
        {
            return new TaskResultBuilder().Add(result);
        }
        public static ITaskResultBuilder<T> From<T>(ITaskResult<T> result)
        {
            return new TaskResultBuilder<T>().Add(result);
        }
    }
    public class TaskResultBuilder<T> : TaskResult<T>, ITaskResultBuilder<T>
    {
        public TaskResultBuilder() : base() { }
        public TaskResultBuilder(IDictionary<string, ICollection<string>> dictionary) : base(dictionary) { }
        public TaskResultBuilder(IEqualityComparer<string> comparer) : base(comparer) { }
        public TaskResultBuilder(int capacity) : base(capacity) { }
        public TaskResultBuilder(IDictionary<string, ICollection<string>> dictionary, IEqualityComparer<string> comparer) : base(dictionary, comparer) { }
        public TaskResultBuilder(int capacity, IEqualityComparer<string> comparer) : base(capacity, comparer) { }



        public new ITaskResultBuilder<T> Add(string entity, string message)
        {
			if (message.IsNullOrWhiteSpace())
				return this;

            if (ContainsKey(entity))
                this[entity].Add(message);
            else
                base.Add(entity, new[] { message }.ToList());

            return this;
        }
        public new ITaskResultBuilder<T> Add(string entity, IEnumerable<string> messages)
        {
			var data = messages.Where(message => message.IsNotNullOrWhiteSpace());

			if (ContainsKey(entity))
                foreach (var message in data)
                    this[entity].Add(message);
            else
                base.Add(entity, (data ?? new string[] { }).ToList());

            return this;
        }
        public ITaskResultBuilder<T> Add(ITaskResult otherResult)
        {
            if (otherResult == null)
            {
                throw new ArgumentNullException(nameof(otherResult));
            }

            foreach (var item in otherResult)
                Add(item);

            this.ExecutionResult |= otherResult.ExecutionResult;

            if (otherResult is ITaskResult<T> otherTResult && Equals(Result, default(T)))
                Result = otherTResult.Result;

            return this;
        }

        public ITaskResultBuilder<T> Fail()
        {
            ExecutionResult |= TaskExecutionResult.Failure;

            return this;
        }
        public ITaskResultBuilder<T> Success()
        {
            ExecutionResult |= TaskExecutionResult.Success;

            return this;
        }
        public ITaskResultBuilder<T> Fail<E>(E exception) where E : Exception
        {
            Add("error", exception.Message);


            return Fail();
        }
        public ITaskResultBuilder<T> Fail<E>(T outcome, E exception) where E : Exception
        {
            Result = outcome;

            return Fail(outcome);
        }
        public ITaskResultBuilder<T> Fail(T outcome)
        {
            ExecutionResult |= TaskExecutionResult.Failure;
            Result = outcome;

            return Fail();
        }
        public ITaskResultBuilder<T> Success(T outcome)
        {
            ExecutionResult |= TaskExecutionResult.Success;
            Result = outcome;

            return this;
        }


        public static ITaskResult Failed<E>(E exception) where E : Exception
        {
            return new TaskResultBuilder().Add("error", exception.Message).Fail();
        }
        public static ITaskResult<T> Failed(T outcome)
        {
            return new TaskResultBuilder<T>().Fail(outcome);
        }
        public static ITaskResult<T> Successful(T outcome)
        {
            return new TaskResultBuilder<T>().Success(outcome);
        }
    }

    public static class TaskResultBuilderExtensions
    {
        public static ITaskResultBuilder<T> AsSuccess<T>(this T source)
        {
            return new TaskResultBuilder<T>().Success(source);
        }
        public static ITaskResultBuilder<T> AsFailure<T>(this T source)
        {
            return new TaskResultBuilder<T>().Fail(source);
        }
    }

}
