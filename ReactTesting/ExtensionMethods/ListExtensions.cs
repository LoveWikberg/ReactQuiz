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

        /// <summary>
        /// Decode all occurrences of strings
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="list"></param>
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
                        propToDecode = WebUtility.UrlDecode(propToDecode);
                        prop.SetValue(item, propToDecode);
                    }
                    else if (prop.PropertyType == typeof(List<string>))
                    {
                        var propertyList = (List<string>)prop.GetValue(item);
                        if (propertyList != null)
                        {
                            for (int i = 0; i < propertyList.Count; i++)
                            {
                                propertyList[i] = WebUtility.HtmlDecode(propertyList[i]);
                                propertyList[i] = WebUtility.UrlDecode(propertyList[i]);
                            }
                            prop.SetValue(item, propertyList);
                        }
                    }
                }
            }
        }
    }
}
