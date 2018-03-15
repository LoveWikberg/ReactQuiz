using FireSharp;
using FireSharp.Config;
using FireSharp.Interfaces;
using FireSharp.Response;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactTesting.Models.Data
{
    public class FireBaseManager<T>
    {
        //string basePath;
        //public FireBaseManager(string basePath)
        //{
        //    this.basePath = basePath;
        //}
        async public Task<List<T>> GetQuestions(string basePath, string childpath)
        {
            IFirebaseConfig config = new FirebaseConfig
            {
                BasePath = basePath
            };
            IFirebaseClient client = new FirebaseClient(config);
            FirebaseResponse response = await client.GetAsync(childpath);

            var m = JsonConvert.DeserializeObject<List<T>>(response.Body);
            return m;
        }
    }
}
