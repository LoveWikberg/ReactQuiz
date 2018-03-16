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
        private readonly FirebaseQuizManager firebaseQuizManager;

        public QuizController(DataManager dataManager, FirebaseQuizManager firebaseQuizManager)
        {
            this.dataManager = dataManager;
            this.firebaseQuizManager = firebaseQuizManager;
        }

        [HttpGet, Route("questions")]
        async public Task<IActionResult> GetQuestions()
        {
            var questions = await dataManager.GetQuestionsFromAPIAsync(2);
            return Ok(questions);
        }

        [HttpGet, Route("firebasequiz")]
        async public Task<IActionResult> GetFirebaseQuiz(string quizName)
        {
            var fbResult = await firebaseQuizManager.GetQuiz("Hammarby");
            return Ok(fbResult);
            //FireBaseResult fbResult = new FireBaseResult();

            //foreach (var parent in json)
            //{
            //    if (parent.Name == "Hammarby")
            //    {
            //        foreach (var child in parent)
            //        {
            //            object quiz = child.Quiz;
            //            var deserializedQuiz = JsonConvert.DeserializeObject<List<Quiz>>(quiz.ToString());
            //            fbResult = new FireBaseResult
            //            {
            //                QuizName = parent.Name,
            //                Quiz = deserializedQuiz
            //            };
            //        }
            //    }
            //}
            //fbResult.ChildName = "Byxa";
            //FirebaseResponse re = await client.UpdateAsync($"-L6fpiYwQL4FHiKhiup3/quiz/{fbResult.ParentName}", fbResult);


        }

        [HttpGet, Route("firebasepush")]
        async public Task<IActionResult> FireBasePush(FireBaseResult fbResult)
        {
            firebaseQuizManager.UpdateQuiz(fbResult);
            return Ok();
            //IFirebaseConfig config = new FirebaseConfig
            //{
            //    BasePath = "https://lovequiz-1eebe.firebaseio.com/",
            //};
            //IFirebaseClient client = new FirebaseClient(config);
            //var quiz = new Quiz
            //{
            //    Question = "Fisk eller spö??",
            //    IncorrectAnswers = new List<string> { "kruka", "krut", "braj" },
            //    Category = "Hammarby IF",
            //    CorrectAnswer = "Nej fan",
            //    Difficulty = "hard",
            //    Type = "Svårt som fan"
            //};

            //List<Quiz> quizen = new List<Quiz>();
            //for (int i = 0; i < 3; i++)
            //{
            //    quizen.Add(quiz);
            //}
            //FireBaseResult fbResult = new FireBaseResult
            //{
            //    QuizName = "Villebråd",
            //    Quiz = quizen
            //};
            //FirebaseResponse response = await client.UpdateAsync($"-L6fpiYwQL4FHiKhiup3/quiz/{fbResult.QuizName}", fbResult);
        }

    }
}
