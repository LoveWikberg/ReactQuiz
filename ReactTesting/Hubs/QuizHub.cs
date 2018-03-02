using Microsoft.AspNetCore.SignalR;
using ReactTesting.Data;
using ReactTesting.Data.Models;
using ReactTesting.ExtensionMethods;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Timers;

namespace ReactTesting.Hubs
{
    public class QuizHub : Hub
    {
        private readonly DataManager dataManager;

        public QuizHub(DataManager dataManager)
        {
            this.dataManager = dataManager;
        }

        //public static List<Quiz> questions = new List<Quiz>();
        //static List<Player> players = new List<Player>();
        //static Quiz currentQuestion = new Quiz();
        static List<GameRoom> gameRooms = new List<GameRoom>();

        public override Task OnDisconnectedAsync(Exception exception)
        {
            string connId = Context.ConnectionId;
            var gameRoom = gameRooms.FindRoomWithSpecificPlayer(connId, out Player player);
            if (gameRoom != null)
            {
                gameRoom.Players.Remove(player);
                Clients.AllExcept(ExcludedIds(gameRoom.GroupName))
                    .InvokeAsync("updatePlayerList", gameRoom.Players);
                if (gameRoom.Players == null)
                    gameRooms.Remove(gameRoom);
            }
            return base.OnDisconnectedAsync(exception);
        }

        public void CreateRoom(string name)
        {
            string connId = Context.ConnectionId;
            string roomCode = dataManager
                .GenerateRandomString("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 4);
            GameRoom newRoom = new GameRoom
            {
                GroupName = roomCode,
                Players = new List<Player>(),
                RoundCount = 0,
                //Timer = new Timer()
            };
            gameRooms.Add(newRoom);
            AddPlayer(name, roomCode);
            Clients.Client(connId).InvokeAsync("showStartScreen", true, roomCode
                , gameRooms.SingleOrDefault(r => r.GroupName == roomCode).Players);
        }

        async public Task JoinRoom(string name, string roomCode)
        {
            string connId = Context.ConnectionId;
            var gameRoom = gameRooms.SingleOrDefault(g => g.GroupName == roomCode);
            if (gameRoom == null || gameRoom.Players.Count >= 8)
            {
                await Clients.Client(connId).InvokeAsync("connectionFail");
            }
            else
            {
                AddPlayer(name, roomCode);
                await Clients.Client(connId).InvokeAsync("showStartScreen", false, roomCode, gameRoom.Players);
                await Clients.AllExcept(ExcludedIds(gameRoom.GroupName, connId))
                    .InvokeAsync("updatePlayerList", gameRoom.Players);
            }
        }

        List<string> ExcludedIds(string groupName, params string[] excludedIds)
        {
            List<string> excludedClients = new List<string>();
            var rooms = gameRooms.Where(r => r.GroupName != groupName);
            foreach (var room in rooms)
            {
                foreach (var player in room.Players)
                {
                    excludedClients.Add(player.ConnectionId);
                }
            }
            if (excludedIds.Length != 0)
                excludedClients.AddRange(excludedIds);
            return excludedClients;
        }

        void AddPlayer(string name, string roomCode)
        {
            string connId = Context.ConnectionId;
            Player newPlayer = new Player
            {
                Name = name,
                ConnectionId = connId
            };
            Groups.AddAsync(connId, roomCode);
            var gameRoom = gameRooms.SingleOrDefault(g => g.GroupName == roomCode);
            gameRoom.Players.Add(newPlayer);
        }

        async public Task StartGame(int numberOfQuestions, string roomCode)
        {
            var room = gameRooms.SingleOrDefault(r => r.GroupName == roomCode);
            room.Questions = await dataManager.GetQuestionsFromAPIAsync(numberOfQuestions);
            //questions = await dataManager.GetQuestionsFromAPIAsync(numberOfQuestions);
            await SendQuestion(roomCode);
        }

        public void CheckIfAllPlayersHaveAnswered(string answer, string roomCode)
        {
            string connId = Context.ConnectionId;
            var gameRoom = gameRooms.SingleOrDefault(r => r.GroupName == roomCode);
            var player = gameRoom.Players.SingleOrDefault(p => p.ConnectionId == connId);
            player.HasAnswered = true;
            player.Answer = answer;

            if (gameRoom.Players.All(p => p.HasAnswered))
            {
                System.Threading.Thread.Sleep(2000);
                AllPlayersHaveAnswered(gameRoom);

                //await Task.Delay(2000);
                //gameRoom.Timer.Interval = 2000;
                //gameRoom.Timer.Start();
                //gameRoom.Timer.Elapsed += delegate { AllPlayersHaveAnswered(gameRoom); };

            }
        }

        async void AllPlayersHaveAnswered(GameRoom gameRoom)
        {
            //gameRoom.Timer.Stop();
            gameRoom.RoundCount += 1;
            SetPoints(gameRoom);
            if (gameRoom.RoundCount >= 3)
            {
                if (gameRoom.Questions.Count != 0)
                {
                    await ShowAnswers(gameRoom);
                    gameRoom.RoundCount = 0;
                }
                else
                {
                    await GameEnded(gameRoom);
                }
            }
            else
            {
                if (gameRoom.Questions.Count != 0)
                {
                    await SendQuestion(gameRoom.GroupName);
                }
                else
                {
                    await GameEnded(gameRoom);
                }
            }
            ResetPlayerAnswers(gameRoom.Players);
        }
        async Task GameEnded(GameRoom gameRoom)
        {
            int highestScore = gameRoom.Players.Max(p => p.Points);
            if (IsDraw(highestScore, gameRoom.Players))
            {
                string[] drawers = gameRoom.Players.Where(p => p.Points == highestScore)
                    .Select(p => p.Name).ToArray();
                await Clients.Group(gameRoom.GroupName).InvokeAsync("gameDraw", gameRoom.Players
                    .OrderByDescending(p => p.Points), drawers);
            }
            else
            {
                string winner = gameRoom.Players.SingleOrDefault(p => p.Points == highestScore).Name;
                await Clients.Group(gameRoom.GroupName).InvokeAsync("gameWon", gameRoom.Players
                    .OrderByDescending(p => p.Points), winner);
            }
            gameRooms.Remove(gameRoom);
        }

        bool IsDraw(int score, List<Player> players)
        {
            var playersWithHighestScore = players
              .Where(p => p.Points == score);
            if (playersWithHighestScore.Count() > 1)
                return true;
            else
                return false;
        }

        async public Task ShowAnswers(GameRoom gameRoom)
        {
            await Clients.Group(gameRoom.GroupName)
                .InvokeAsync("showAnswers", gameRoom.Players.OrderByDescending(p => p.Points));
            System.Threading.Thread.Sleep(10000);
            await SendQuestion(gameRoom.GroupName);
        }

        public void ResetGame()
        {
            gameRooms.Clear();
            gameRooms = new List<GameRoom>();
        }

        void SetPoints(GameRoom gameRoom)
        {
            foreach (var player in gameRoom.Players)
            {
                if (player.Answer == gameRoom.CurrentQuestion.Correct_answer)
                {
                    player.Points += 1;
                }
            }
        }

        void ResetPlayerAnswers(List<Player> players)
        {
            foreach (var player in players)
            {
                player.HasAnswered = false;
                player.Answer = "";
            }
        }

        public async Task SendQuestion(string roomCode)
        {
            var room = gameRooms.SingleOrDefault(r => r.GroupName == roomCode);
            if (room.Questions.Count == 0)
            {
                await ShowAnswers(room);
            }
            else
            {
                room.CurrentQuestion = GetRandomQuestion(room.Questions);
                await Clients.Group(room.GroupName).InvokeAsync("sendQuestion", room.CurrentQuestion);
            }
        }

        Quiz GetRandomQuestion(List<Quiz> questions)
        {
            Random random = new Random();
            int index = random.Next(0, questions.Count - 1);

            var alternatives = questions[index].Incorrect_answers
                .Append(questions[index].Correct_answer).ToList();
            alternatives.Shuffle();

            Quiz question = new Quiz
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
