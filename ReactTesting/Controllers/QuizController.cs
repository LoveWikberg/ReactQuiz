using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using FireSharp;
using FireSharp.Config;
using FireSharp.Interfaces;
using FireSharp.Response;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ReactTesting.Data;
using ReactTesting.Models;
using ReactTesting.Models.Data;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ReactTesting.Controllers
{
    [Route("api/quiz")]
    public class QuizController : Controller
    {
        private readonly DataManager dataManager;
        private readonly FireBaseManager<Quiz> fireBaseManager;

        public QuizController(DataManager dataManager, FireBaseManager<Quiz> fireBaseManager)
        {
            this.dataManager = dataManager;
            this.fireBaseManager = fireBaseManager;
        }

        [HttpGet, Route("questions")]
        async public Task<IActionResult> GetQuestions()
        {
            var questions = await dataManager.GetQuestionsFromAPIAsync(2);
            return Ok(questions);
        }

        [HttpGet, Route("firebaseQuestions")]
        async public Task<IActionResult> GetFirebaseQuestions()
        {
            var questions = await fireBaseManager.GetQuestions("https://lovequiz-1eebe.firebaseio.com/", "-L6fpiYwQL4FHiKhiup3/quiz");
            return Ok(questions);
        }

        [HttpGet, Route("firebase")]
        async public Task<IActionResult> FireBasetest()
        {
            IFirebaseConfig config = new FirebaseConfig
            {
                BasePath = "https://lovequiz-1eebe.firebaseio.com/"
            };
            IFirebaseClient client = new FirebaseClient(config);
            FirebaseResponse response = await client.GetAsync("-L6fpiYwQL4FHiKhiup3/quiz");
            dynamic json = JsonConvert.DeserializeObject(response.Body);

            List<FireBaseResult> fbResult = new List<FireBaseResult>();
            foreach (var parent in json)
            {
                foreach (var child in parent)
                {
                    {
                        object quiz = child.Quiz;
                        var deserializedQuiz = JsonConvert.DeserializeObject<List<Quiz>>(quiz.ToString());
                        FireBaseResult result = new FireBaseResult
                        {
                            Name = child.Name,
                            Quiz = deserializedQuiz
                        };
                        fbResult.Add(result);
                    }
                }
            }
            return Ok(fbResult);
        }

        [HttpGet, Route("firebasepush")]
        async public Task<IActionResult> FireBasePush()
        {
            IFirebaseConfig config = new FirebaseConfig
            {
                BasePath = "https://lovequiz-1eebe.firebaseio.com/",
            };
            IFirebaseClient client = new FirebaseClient(config);
            var quiz = new Quiz
            {
                Question = "Ska man åka till Köpenhamn?",
                IncorrectAnswers = new List<string> { "bröd", "krut", "krup" },
                Category = "Hammarby IF",
                CorrectAnswer = "Nej fan",
                Difficulty = "hard",
                Type = "Ulvik"
            };

            List<Quiz> quizen = new List<Quiz>();
            for (int i = 0; i < 3; i++)
            {
                quizen.Add(quiz);
            }
            FireBaseResult fbResult = new FireBaseResult
            {
                Quiz = quizen,
                Name = "systeer"
            };
            PushResponse response = await client.PushAsync("-L6fpiYwQL4FHiKhiup3/quiz", fbResult);

            return Ok(response.Body);
        }

    }
}
