using Newtonsoft.Json;
using ReactTesting.ExtensionMethods;
using ReactTesting.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;

using System.Threading.Tasks;

namespace ReactTesting.Data
{
    public class DataManager
    {
        public async Task<List<Quiz>> GetQuestionsFromAPIAsync(int numberOfQuestions)
        {
            string address = $"https://opentdb.com/api.php?amount={numberOfQuestions}&type=multiple";
            using (var httpClient = new HttpClient())
            {
                var json = await httpClient.GetStringAsync(address);
                var m = JsonConvert.DeserializeObject<Result>(json);
                m.Results.DecodeUTF8Elements();
                return m.Results;
            }
        }

        public string GenerateRandomString(string charsToRandomFrom, int length)
        {
            Random random = new Random();
            string generatedString = "";
            for (int i = 0; i < length; i++)
            {
                int index = random.Next(0, charsToRandomFrom.Length);
                generatedString += charsToRandomFrom[index];
            }
            return generatedString;
        }
    }
}
