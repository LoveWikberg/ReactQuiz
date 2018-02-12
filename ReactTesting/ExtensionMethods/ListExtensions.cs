using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Threading.Tasks;

namespace ReactTesting.ExtensionMethods
{
    public static class ListExtensions
    {


        public static void Shuffle<T>(this IList<T> list)
        {
            Random rng = new Random();
            int n = list.Count;
            while (n > 1)
            {
                n--;
                int k = rng.Next(n + 1);
                T value = list[k];
                list[k] = list[n];
                list[n] = value;
            }
        }

        public static void DecodeUTF8Elements<T>(this IList<T> list)
        {
            foreach (var item in list)
            {
                Type type = item.GetType();
                foreach (PropertyInfo prop in type.GetProperties())
                {
                    MethodInfo setMethod = prop.GetSetMethod();
                    if (prop.PropertyType == typeof(string) || setMethod == null)
                    {
                        string propToDecode = prop.GetValue(item).ToString();
                        propToDecode = WebUtility.HtmlDecode(propToDecode);
                        prop.SetValue(item, propToDecode);
                    }
                    else if (prop.PropertyType == typeof(List<string>))
                    {
                        foreach (var att in prop.CustomAttributes)
                        {
                            string b = "asd";
                        }
                    }
                }
            }
        }

        //private IList<string> DecodeCollectionOfStrings(PropertyInfo prop)
        //{
        //    foreach (var item in prop.)
        //    {

        //    }
        //}
    }
}
