using Microsoft.AspNetCore.SignalR;
using ReactTesting.Data;
using ReactTesting.ExtensionMethods;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactTesting.Hubs
{
    public class QuizHub : Hub
    {
        private readonly DataManager dataManager;

        public QuizHub(DataManager dataManager)
        {
            this.dataManager = dataManager;
        }

        public void SendToAll(string name, string msg)
        {
            Clients.All.InvokeAsync("testsend", name, msg);
        }

        public static List<Result> questions = new List<Result>();

        async public Task StartGame(int numberOfQuestions)
        {
            var name = Context.ConnectionId;
            questions = await dataManager.GetQuestionsFromAPIAsync(numberOfQuestions);
            await SendQuestion();
            //await Clients.All.InvokeAsync("sendQuestion", "tejabba");

        }

        async Task SendQuestion()
        {
            var question = GetRandomQuestion();
            await Clients.All.InvokeAsync("sendQuestion", question);
        }

        Result GetRandomQuestion()
        {
            Random random = new Random();
            int index = random.Next(0, questions.Count - 1);

            var alternatives = questions[index].Incorrect_answers
                .Append(questions[index].Correct_answer).ToList();
            alternatives.Shuffle();

            Result question = new Result
            {
                Category = questions[index].Category,
                Correct_answer = questions[index].Correct_answer,
                Difficulty = questions[index].Difficulty,
                Question = questions[index].Question,
                Type = questions[index].Type,
                Alternatives = alternatives
            };
            questions.RemoveAt(index);
            return question;
        }
    }
}
