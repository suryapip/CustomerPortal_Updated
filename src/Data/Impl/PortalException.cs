using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;

namespace ScentAir.Payment
{
    [Serializable]
    public class PortalException : ApplicationException, IDictionary<string, object>
    {
        [NonSerialized]
        private readonly IDictionary<string, object> exceptionData = new Dictionary<string, object>();

        public string AdditionalInformation { get; set; }
        public PortalExceptionType ExceptionType { get; }

        public ICollection<string> Keys => exceptionData.Keys;

        public ICollection<object> Values => exceptionData.Values;

        public int Count => exceptionData.Count;

        public bool IsReadOnly => exceptionData.IsReadOnly;

        public object this[string key] { get => exceptionData[key]; set => exceptionData[key] = value; }

        private void initialize(IDictionary<string, object> exceptionData = null)
        {
            Data.Add("ExceptionType", ExceptionType);

            if (AdditionalInformation.IsNotNullOrWhiteSpace())
                Data.Add("AdditionalInformation", AdditionalInformation);

            if (exceptionData != null)
                foreach (var kv in exceptionData)
                {
                    this.exceptionData.Add(kv);
                    Add(kv.Key, kv.Value);
                }

        }

        public void Add(string key, object value)
        {
            if (!key.StartsWith("Portal:"))
                key = $"Portal:{key}";

            exceptionData.Add(key, value);
        }

        public bool ContainsKey(string key)
        {
            return exceptionData.ContainsKey(key);
        }

        public bool Remove(string key)
        {
            return exceptionData.Remove(key);
        }

        public bool TryGetValue(string key, out object value)
        {
            return exceptionData.TryGetValue(key, out value);
        }

        public void Add(KeyValuePair<string, object> item)
        {
            exceptionData.Add(item);
        }

        public void Clear()
        {
            exceptionData.Clear();
        }

        public bool Contains(KeyValuePair<string, object> item)
        {
            return exceptionData.Contains(item);
        }

        public void CopyTo(KeyValuePair<string, object>[] array, int arrayIndex)
        {
            exceptionData.CopyTo(array, arrayIndex);
        }

        public bool Remove(KeyValuePair<string, object> item)
        {
            return exceptionData.Remove(item);
        }

        public IEnumerator<KeyValuePair<string, object>> GetEnumerator()
        {
            return exceptionData.GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return exceptionData.GetEnumerator();
        }

        public PortalException(PortalExceptionType exceptionType) : base($"{exceptionType}")
        {
            this.ExceptionType = exceptionType;

            initialize();
        }
        public PortalException(Exception innerException, PortalExceptionType exceptionType) : base($"{exceptionType}", innerException)
        {
            this.ExceptionType = exceptionType;

            initialize();
        }
        public PortalException(PortalExceptionType exceptionType, IDictionary<string, object> data) : base($"{exceptionType}")
        {
            this.ExceptionType = exceptionType;

            initialize(data);
        }
        public PortalException(Exception innerException, PortalExceptionType exceptionType, IDictionary<string, object> data) : base($"{exceptionType}", innerException)
        {
            this.ExceptionType = exceptionType;

            initialize(data);
        }


        public PortalException(PortalExceptionType exceptionType, string additionalInformation) : base($"{exceptionType}: \"{additionalInformation}\"")
        {
            this.ExceptionType = exceptionType;
            this.AdditionalInformation = additionalInformation;

            initialize();
        }
        public PortalException(Exception innerException, PortalExceptionType exceptionType, string additionalInformation) : base($"{exceptionType}: \"{additionalInformation}\"", innerException)
        {
            this.ExceptionType = exceptionType;
            this.AdditionalInformation = additionalInformation;

            initialize();
        }
        public PortalException(PortalExceptionType exceptionType, string additionalInformation, IDictionary<string, object> data) : base($"{exceptionType}: \"{additionalInformation}\"")
        {
            this.ExceptionType = exceptionType;
            this.AdditionalInformation = additionalInformation;

            initialize(data);
        }
        public PortalException(Exception innerException, PortalExceptionType exceptionType, string additionalInformation, IDictionary<string, object> data) : base($"{exceptionType}: \"{additionalInformation}\"", innerException)
        {
            this.ExceptionType = exceptionType;
            this.AdditionalInformation = additionalInformation;

            initialize(data);
        }


        protected PortalException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
            var enumerator = Data.GetEnumerator();
            while (enumerator.MoveNext())
                if (enumerator.Key.ToString().StartsWith("Portal:"))
                    Add(enumerator.Key.ToString(), enumerator.Value);
        }
    }
}