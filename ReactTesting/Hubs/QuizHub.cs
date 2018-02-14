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

        public static List<Result> questions = new List<Result>();
        static List<Player> players = new List<Player>();
        static Result currentQuestion = new Result();
        static int RoundCount = 0;

        public void AddPlayer(string name)
        {
            string connId = Context.ConnectionId;
            Player newPlayer = new Player
            {
                Name = name,
                ConnectionId = connId
            };
            players.Add(newPlayer);
            //Clients.All.InvokeAsync("addNewPlayerToList", newPlayer);
        }

        async public Task StartGame(int numberOfQuestions)
        {
            questions = await dataManager.GetQuestionsFromAPIAsync(numberOfQuestions);
            await SendQuestion();
        }

        async public void CheckIfAllPlayersHaveAnswered(string answer)
        {
            string connId = Context.ConnectionId;
            players.SingleOrDefault(p => p.ConnectionId == connId).HasAnswered = true;
            players.SingleOrDefault(p => p.ConnectionId == connId).Answer = answer;

            if (players.All(p => p.HasAnswered))
            {
                RoundCount += 1;
                SetPoints();
                if (RoundCount >= 3)
                {
                    await ShowAnswers();
                    RoundCount = 0;
                }
                else
                {
                    await SendQuestion();
                }
                ResetPlayerAnswers();
            }
        }

        async public Task ShowAnswers()
        {
            await Clients.All.InvokeAsync("showAnswers", players.OrderByDescending(p => p.Points));
        }

        public void ResetGame()
        {
            players.Clear();
            RoundCount = 0;
        }

        void SetPoints()
        {
            foreach (var player in players)
            {
                if (player.Answer == currentQuestion.Correct_answer)
                {
                    player.Points += 1;
                }
            }
        }

        void ResetPlayerAnswers()
        {
            foreach (var player in players)
            {
                player.HasAnswered = false;
                player.Answer = "";
            }
        }

        public async Task SendQuestion()
        {
            //var question = GetRandomQuestion();
            //await Clients.All.InvokeAsync("sendQuestion", question);
            if (questions.Count == 0)
            {
                await ShowAnswers();
            }
            else
            {
                GetRandomQuestion();
                await Clients.All.InvokeAsync("sendQuestion", currentQuestion);
            }
        }

        void GetRandomQuestion()
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
            currentQuestion = question;
            questions.RemoveAt(index);
            //return question;
        }
    }
}
