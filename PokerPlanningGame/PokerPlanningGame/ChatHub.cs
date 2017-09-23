using System;
using Microsoft.AspNet.SignalR;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static PokerPlanningGame.UserHandler;

namespace PokerPlanningGame
{
    public static class UserHandler
    {
        public static readonly Dictionary<string, string> UsersDictionary = new Dictionary<string, string>();
    }

    public static class MessagesHandler
    {
        public static readonly Dictionary<Guid, string> MessagesList = new Dictionary<Guid, string>();
    }

    public class ChatHub : Hub
    {
        public void RegisterUser(string name)
        {
            if (UsersDictionary.ContainsKey(Context.ConnectionId))
            {
                return;
            }
            UsersDictionary.Add(Context.ConnectionId, name);
            Clients.All.updateUserNamesList(UsersDictionary.Select(p =>
            new {value = p.Value}).ToList());
        }


        public void Send(string name, string message)
        {
            // Call the broadcastMessage method to update clients.
            Clients.All.broadcastMessage(name, message);
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            UsersDictionary.Remove(Context.ConnectionId);
            Clients.All.updateUserNamesList(UsersDictionary.Select(p =>
                new { value = p.Value }).ToList());
            return base.OnDisconnected(stopCalled);
        }
    }
}