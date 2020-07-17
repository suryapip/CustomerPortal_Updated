using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Text;

namespace ScentAir.Payment
{
    [Flags]
    public enum TaskExecutionResult:int
    {
        None            = 0,
        Failure         = 1,
        Success         = 2,
        PartialSuccess  = 3,
    }

    public interface ITaskResult : ICollection<(string entity, ICollection<string> errors)>
    {
        TaskExecutionResult ExecutionResult { get; set; }
        bool IsSuccessful { get; }
        bool IsFailure { get; }

		ICollection<string> Keys { get; }
		ICollection<ICollection<string>> Values { get; }
		ICollection<string> Errors { get; } 
    }
    public interface ITaskResult<T> : ITaskResult
    {
        T Result { get; }
    }
    public interface ITaskResultBuilder: ITaskResult
    {

        ITaskResultBuilder Add(string entity, string message);
        ITaskResultBuilder Add(string entity, IEnumerable<string> messages);
        ITaskResultBuilder Add(ITaskResult emr);


        ITaskResultBuilder Success();
        ITaskResultBuilder Fail();
    }
    public interface ITaskResultBuilder<T> : ITaskResult<T>
    {
        ITaskResultBuilder<T> Add(string entity, string message);
        ITaskResultBuilder<T> Add(string entity, IEnumerable<string> messages);
        ITaskResultBuilder<T> Add(ITaskResult emr);

        ITaskResultBuilder<T> Success();
        ITaskResultBuilder<T> Fail();
        ITaskResultBuilder<T> Success(T outcome);
        ITaskResultBuilder<T> Fail(T outcome);

    }
}
