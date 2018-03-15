using System;
using System.Collections.Generic;
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
            //var m = response.ResultAs<List<Quiz>>();
            var m = JsonConvert.DeserializeObject(response.Body);
            return Ok(m);
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
                Question = "Ska man åka till fribeeraa?",
                IncorrectAnswers = new List<string> { "bröd", "smark", "krup" },
                Category = "Hammarby IF",
                CorrectAnswer = "Nej fan",
                Difficulty = "hard",
                Type = "Ulvik"
            };

            Quiz[] quizen = new Quiz[3];
            for (int i = 0; i < quizen.Length; i++)
            {
                quizen[i] = quiz;
            }
            PushResponse response = await client.PushAsync("-L6fpiYwQL4FHiKhiup3/quiz", quizen);

            return Ok(response.Body);
        }

    }
}
