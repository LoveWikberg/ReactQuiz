using Newtonsoft.Json;
using ReactTesting.ExtensionMethods;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;

using System.Threading.Tasks;

namespace ReactTesting.Data
{
    public class DataManager
    {
        public async Task<List<Result>> GetQuestionsFromAPIAsync(int numberOfQuestions)
        {
            string address = $"https://opentdb.com/api.php?amount={numberOfQuestions}&type=multiple";
            using (var httpClient = new HttpClient())
            {
                var json = await httpClient.GetStringAsync(address);
                var m = JsonConvert.DeserializeObject<Quiz>(json);
                m.Results.DecodeUTF8Elements();
                return m.Results;
            }
        }
    }
}
