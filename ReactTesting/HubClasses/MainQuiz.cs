using ReactTesting.Data;
using ReactTesting.Data.Models;
using ReactTesting.ExtensionMethods;
using ReactTesting.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace ReactTesting.HubClasses
{
    public class MainQuiz
    {
        public Quiz GetRandomQuestion(List<Quiz> questions)
        {
            Random random = new Random();
            int index = random.Next(0, questions.Count - 1);

            var alternatives = questions[index].IncorrectAnswers
                .Append(questions[index].CorrectAnswer).ToList();
            alternatives.Shuffle();

            Quiz question = new Quiz
            {
                Category = questions[index].Category,
                CorrectAnswer = questions[index].CorrectAnswer,
                Difficulty = questions[index].Difficulty,
                Question = questions[index].Question,
                Type = questions[index].Type,
                Alternatives = alternatives
            };
            questions.RemoveAt(index);
            return question;
        }
        public void DelayGame(int milliSeconds, ref GameRoom gameRoom)
        {
            gameRoom.Timer = Stopwatch.StartNew();
            while (gameRoom.Timer.ElapsedMilliseconds <= milliSeconds) ;
            gameRoom.Timer.Stop();
        }
        public void SetPoints(ref GameRoom gameRoom)
        {
            foreach (var player in gameRoom.Players)
            {
                if (player.Answer == gameRoom.CurrentQuestion.CorrectAnswer)
                {
                    player.Points += 1;
                    player.Answer = "";
                }
            }
        }
        public bool IsDraw(int score, List<Player> players)
        {
            var playersWithHighestScore = players
              .Where(p => p.Points == score);
            if (playersWithHighestScore.Count() > 1)
                return true;
            else
                return false;
        }

    }
}
