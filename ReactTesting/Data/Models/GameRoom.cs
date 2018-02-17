using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactTesting.Data.Models
{
    public class GameRoom
    {
        public string GroupName { get; set; }
        public List<Quiz> Questions { get; set; }
        public List<Player> Players { get; set; }
    }
}
