using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactTesting.Data
{
    public class Player
    {
        public string Name { get; set; }
        public string ConnectionId { get; set; }
        public bool HasAnswered { get; set; }
        public int Points { get; set; }
        public string Answer { get; set; }
    }
}
