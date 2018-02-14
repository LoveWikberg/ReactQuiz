using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ReactTesting.Data;
using ReactTesting.ExtensionMethods;
using ReactTesting.Hubs;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ReactTesting.Controllers
{
    [Route("api/quiz")]
    public class QuizController : Controller
    {
        private readonly DataManager dataManager;

        public QuizController(DataManager dataManager)
        {
            this.dataManager = dataManager;
        }

        [HttpGet, Route("questions")]
        async public Task<IActionResult> GetQuestions()
        {
            //QuizHub.questions = await dataManager.GetQuestionsFromAPIAsync(5);
            var questions = await dataManager.GetQuestionsFromAPIAsync(2);
            return Ok(questions);
        }

        [HttpGet, Route("encode")]
        public IActionResult TestEncode()
        {
            string stringToEncode = "&#039;";
            stringToEncode =  WebUtility.HtmlDecode(stringToEncode);
            return Ok(stringToEncode);
        }
    }
}
