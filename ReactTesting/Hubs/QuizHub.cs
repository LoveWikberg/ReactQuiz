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
                    if (questions.Count != 0)
                    {
                        await ShowAnswers();
                        RoundCount = 0;
                    }
                    else
                    {
                        await GameEnded();
                    }
                }
                else
                {
                    if (questions.Count != 0)
                    {
                        await SendQuestion();
                    }
                    else
                    {
                        await GameEnded();
                    }
                }
                ResetPlayerAnswers();
            }
        }

        async Task GameEnded()
        {
            int highestScore = players.Max(p => p.Points);
            if (IsDraw(highestScore))
            {
                string[] drawers = players.Where(p => p.Points == highestScore)
                    .Select(p => p.Name).ToArray();
                await Clients.All.InvokeAsync("gameDraw", players
                    .OrderByDescending(p => p.Points), drawers);
            }
            else
            {
                string winner = players.SingleOrDefault(p => p.Points == highestScore).Name;
                await Clients.All.InvokeAsync("gameWon", players
                    .OrderByDescending(p => p.Points), winner);
            }
        }

        bool IsDraw(int score)
        {
            var playersWithHighestScore = players
              .Where(p => p.Points == score);
            if (playersWithHighestScore.Count() > 1)
                return true;
            else
                return false;
        }

        T GetWinnerOrDraw<T>(int highestScore)
        {
            var playersWithHighestScore = players
                .Where(p => p.Points == highestScore).ToArray();
            if (playersWithHighestScore.Length > 1)
                return (T)(object)playersWithHighestScore[0];
            else
                return (T)(object)playersWithHighestScore;
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
