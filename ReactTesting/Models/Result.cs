using ReactTesting.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactTesting.Data
{
    public class Result
    {
        public int Response_code { get; set; }
        public List<Quiz> Results { get; set; }
    }
}
