using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ReactTesting.Models;
using ReactTesting.Models.Data;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ReactTesting.Controllers
{
    public class QuizCreaterController : Controller
    {
        private readonly FirebaseQuizManager firebaseQuizManager;

        public QuizCreaterController(FirebaseQuizManager firebaseQuizManager)
        {
            this.firebaseQuizManager = firebaseQuizManager;
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        async public Task<IActionResult> Index(QuizCreateVM viewModel)
        {
            if (!ModelState.IsValid)
                return View(viewModel);

            FireBaseResult fbResult = await firebaseQuizManager.GetQuiz(viewModel.QuizName);
            if (fbResult == null)
            {
                List<Quiz> quiz = new List<Quiz>
                {
                    viewModel.Quiz
                };
                fbResult = new FireBaseResult
                {
                    QuizName = viewModel.QuizName,
                    Quiz = quiz
                };
            }
            else
                fbResult.Quiz.Add(viewModel.Quiz);
            await firebaseQuizManager.UpdateQuiz(fbResult);
            return View();
        }
    }
}
