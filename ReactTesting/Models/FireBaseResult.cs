using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace ReactTesting.Models
{
    public class FireBaseResult
    {
        [IgnoreDataMemberAttribute]
        public string QuizName { get; set; }
        public List<Quiz> Quiz { get; set; }

    }
}
