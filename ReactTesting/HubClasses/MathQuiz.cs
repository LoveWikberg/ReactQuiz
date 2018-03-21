using ReactTesting.ExtensionMethods;
using ReactTesting.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactTesting.HubClasses
{
    public class MathQuiz
    {
        public List<Quiz> GenerateMathQuiz()
        {
            List<Quiz> mathquiz = new List<Quiz>();
            Random random = new Random();
            char[] operators = new char[] { '+', '-' };
            for (int i = 0; i < 50; i++)
            {
                int intOne = random.Next(-10, 10);
                int intTwo = random.Next(-10, 10);
                int index = random.Next(0, 1);
                char mathOperator = operators[index];
                string answer = Calculate(intOne, intTwo, mathOperator).ToString();
                List<string> alternatives = GenerateAlternatives(3, int.Parse(answer));
                alternatives.Add(answer);
                alternatives.Shuffle();
                string question = $"{AddParanthesesIfNegative(intOne.ToString())} {mathOperator} {AddParanthesesIfNegative(intTwo.ToString())} = ?";
                Quiz quiz = new Quiz
                {
                    Question = question,
                    CorrectAnswer = answer,
                    Alternatives = alternatives
                };
                mathquiz.Add(quiz);
            }
            return mathquiz;
        }
        string AddParanthesesIfNegative(string number)
        {
            if (number.Contains('-'))
                return $"({number})";
            return number;
        }
        List<string> GenerateAlternatives(int length, int excludedAlternative)
        {
            Random random = new Random();
            List<string> alternatives = new List<string>();
            for (int i = 0; i < length; i++)
            {
                int randomAlternative;
                do
                {
                    randomAlternative = random.Next(-20, 20);

                }
                while (randomAlternative == excludedAlternative);
                alternatives.Add(randomAlternative.ToString());
            }
            return alternatives;
        }
        int Calculate(int numberOne, int numberTwo, char mathOperator)
        {
            switch (mathOperator)
            {
                case '+':
                    return numberOne + numberTwo;
                case '-':
                    return numberTwo - numberTwo;
            }
            throw new Exception("Invalid operator");
        }
    }
}
