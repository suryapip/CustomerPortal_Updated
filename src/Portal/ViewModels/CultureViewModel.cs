using System.Collections.Generic;


namespace ScentAir.Payment.ViewModels
{
    public class CultureViewModel
    {
        public string Id { get; set; }
        public string Name { get; set; }

        public IDictionary<string, IDictionary<string, string>> Translations { get; set; }
    }
    //public class TranslationCollection : SortedDictionary<string, string>
    //{
    //    public TranslationCollection() : base() { }

    //    public TranslationCollection(IComparer<TKey> comparer);

    //    public TranslationCollection(IDictionary<TKey, TValue> dictionary);

    //    public TranslationCollection(IDictionary<TKey, TValue> dictionary, IComparer<TKey> comparer);
    //}
}
