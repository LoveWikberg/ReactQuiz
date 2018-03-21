using Microsoft.AspNetCore.SignalR;
using ReactTesting.Data;
using ReactTesting.Data.Models;
using ReactTesting.ExtensionMethods;
using ReactTesting.HubClasses;
using ReactTesting.Models;
using ReactTesting.Models.Data;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.Timers;

namespace ReactTesting.Hubs
{
    public class QuizHub : Hub
    {
        private readonly DataManager dataManager;
        private readonly FirebaseQuizManager firebaseQuizManager;
        private readonly MathQuiz mathQuiz;
        private readonly MainQuiz mainQuiz;

        public QuizHub(DataManager dataManager, FirebaseQuizManager firebaseQuizManager
            , MathQuiz mathQuiz, MainQuiz mainQuiz)
        {
            this.dataManager = dataManager;
            this.firebaseQuizManager = firebaseQuizManager;
            this.mathQuiz = mathQuiz;
            this.mainQuiz = mainQuiz;
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

        async public Task StartGame(int numberOfQuestions, string roomCode, string selectedQuiz)
        {
            var room = gameRooms.SingleOrDefault(r => r.GroupName == roomCode);
            if (selectedQuiz == null || selectedQuiz.ToLower() == "standard")
                room.Questions = await dataManager.GetQuestionsFromAPIAsync(numberOfQuestions);
            else
            {
                var firebaseQuiz = await firebaseQuizManager.GetQuiz(selectedQuiz);
                firebaseQuiz.Quiz.RemoveRandomItems(numberOfQuestions);
                room.Questions = firebaseQuiz.Quiz;
            }
            await SendQuestion(roomCode);
        }

        void CheckIfAllPlayersHaveAnswered(GameRoom gameRoom)
        {
            if (gameRoom.Players.All(p => p.HasAnswered))
            {
                Clients.Group(gameRoom.GroupName).InvokeAsync("nextQuestion");
                for (int i = 0; i < gameRoom.Players.Count; i++)
                {
                    gameRoom.Players[i].HasAnswered = false;
                }
                mainQuiz.DelayGame(2000, ref gameRoom);
                HandlePlayersAnswersAndContinue(gameRoom);
            }
        }

        public void CollectAnswer(string answer, string roomCode)
        {
            string connId = Context.ConnectionId;
            var gameRoom = gameRooms.SingleOrDefault(r => r.GroupName == roomCode);
            var player = gameRoom.Players.SingleOrDefault(p => p.ConnectionId == connId);
            player.HasAnswered = true;
            player.Answer = answer;

            CheckIfAllPlayersHaveAnswered(gameRoom);
        }

        async void HandlePlayersAnswersAndContinue(GameRoom gameRoom)
        {
            gameRoom.RoundCount += 1;
            mainQuiz.SetPoints(ref gameRoom);
            if (gameRoom.RoundCount >= 3)
            {
                if (gameRoom.Questions.Count != 0)
                {
                    await ShowScore(gameRoom);
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
        }
        async Task GameEnded(GameRoom gameRoom)
        {
            int highestScore = gameRoom.Players.Max(p => p.Points);
            if (mainQuiz.IsDraw(highestScore, gameRoom.Players))
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

        async public Task ShowScore(GameRoom gameRoom)
        {
            await Clients.Group(gameRoom.GroupName)
                .InvokeAsync("showScore", gameRoom.Players.OrderByDescending(p => p.Points));
            mainQuiz.DelayGame(7000, ref gameRoom);
            if (gameRoom.IsMiniGame)
            {
                gameRoom.IsMiniGame = false;
                await StartMiniGame(gameRoom);
            }
            else
            {
                gameRoom.IsMiniGame = true;
                await SendQuestion(gameRoom.GroupName);
            }
        }

        async Task StartMiniGame(GameRoom gameRoom)
        {
            Random random = new Random();
            int randomresult = random.Next(0, 0);
            switch (randomresult)
            {
                case 0:
                    await Clients.Group(gameRoom.GroupName).InvokeAsync("mathQuizInstructions");
                    mainQuiz.DelayGame(10000, ref gameRoom);
                    await Clients.Group(gameRoom.GroupName).InvokeAsync("startMathQuiz"
                        , mathQuiz.GenerateMathQuiz(), gameRoom.Players);
                    break;
            }
        }

        async public Task CollectMathAnswer(string roomCode)
        {
            string connId = Context.ConnectionId;
            var gameRoom = gameRooms.SingleOrDefault(g => g.GroupName == roomCode);
            if (gameRoom.Players.Any(p => p.MathQuizScore >= 15))
                return;
            var player = gameRoom.Players.SingleOrDefault(p => p.ConnectionId == connId);
            player.MathQuizScore++;
            if (player.MathQuizScore >= 15)
            {
                player.Points += 3;
                await Clients.Group(gameRoom.GroupName).InvokeAsync("showMathQuizWinner", gameRoom.Players);
                mainQuiz.DelayGame(5000, ref gameRoom);
                for (int i = 0; i < gameRoom.Players.Count; i++)
                {
                    gameRoom.Players[i].MathQuizScore = 0;
                }
                await ShowScore(gameRoom);
            }
            else
                await Clients.Group(gameRoom.GroupName).InvokeAsync("updatePlayerProgress", gameRoom.Players);
        }

        public async Task SendQuestion(string roomCode)
        {
            var room = gameRooms.SingleOrDefault(r => r.GroupName == roomCode);
            if (room.Questions.Count == 0)
            {
                await ShowScore(room);
            }
            else
            {
                room.CurrentQuestion = mainQuiz.GetRandomQuestion(room.Questions);
                await Clients.Group(room.GroupName).InvokeAsync("sendQuestion", room.CurrentQuestion);
            }
        }

        

       
    }
}
