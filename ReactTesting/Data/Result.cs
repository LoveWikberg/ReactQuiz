using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactTesting.Data
{
    public class Result
    {
        public string Category { get; set; }
        public string Type { get; set; }
        public string Difficulty { get; set; }
        public string Question { get; set; }
        public string Correct_answer { get; set; }
        public List<string> Incorrect_answers { get; set; }
        public List<string> Alternatives { get; set; }
    }

    public class Quiz
    {
        public int Response_code { get; set; }
        public List<Result> Results { get; set; }
    }
}
