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
    public class FirebaseQuizManager
    {
        IFirebaseConfig config;
        IFirebaseClient client;

        public FirebaseQuizManager()
        {
            config = new FirebaseConfig
            {
                BasePath = "https://lovequiz-1eebe.firebaseio.com/",
            };
            client = new FirebaseClient(config);
        }

        /// <summary>
        /// Updates the the selected object. If the object does not exist
        /// a new object will be created.
        /// </summary>
        async public void UpdateQuiz(FireBaseResult fbResult)
        {
            await client.UpdateAsync($"-L6fpiYwQL4FHiKhiup3/quiz/{fbResult.QuizName}", fbResult);
        }

        async public Task<FireBaseResult> GetQuiz(string quizName)
        {
            FirebaseResponse response = await client.GetAsync($"-L6fpiYwQL4FHiKhiup3/quiz/{quizName}");
            FireBaseResult fbResult = JsonConvert.DeserializeObject<FireBaseResult>(response.Body);
            fbResult.QuizName = quizName;
            return fbResult;
        }

        async public Task<List<string>> GetAllQuizNames()
        {
            FirebaseResponse response = await client.GetAsync("-L6fpiYwQL4FHiKhiup3/quiz");
            dynamic json = JsonConvert.DeserializeObject(response.Body);
            List<string> quizNames = new List<string>();
            foreach (var item in json)
            {
                quizNames.Add(item.Name);
            }
            return quizNames;
        }
    }
}
