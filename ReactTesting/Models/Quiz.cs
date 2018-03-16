using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ReactTesting.Models
{
    public class Quiz
    {
        [Required]
        public string Category { get; set; }
        [JsonProperty(PropertyName = "correct_answer")]
        [Required]
        public string CorrectAnswer { get; set; }
        [Required]
        public string Difficulty { get; set; }
        [JsonProperty(PropertyName = "incorrect_answers")]
        [Required]
        public List<string> IncorrectAnswers { get; set; }
        [Required]
        public string Question { get; set; }
        public List<string> Alternatives { get; set; }
        public string Type { get; set; }
    }
}
