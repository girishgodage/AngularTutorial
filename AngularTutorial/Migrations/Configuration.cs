namespace AngularTutorial.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using AngularTutorial.Models;

    internal sealed class Configuration : DbMigrationsConfiguration<AngularTutorial.Models.ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
            ContextKey = "AngularTutorial.Models.ApplicationDbContext";
        }

        protected override void Seed(AngularTutorial.Models.ApplicationDbContext context)
        {
            var r = new Random();
            var items = Enumerable.Range(1, 50).Select(o => new TodoItem
            {
                DueDate = new DateTime(2012, r.Next(1, 12), r.Next(1, 28)),
                Priority = (byte)r.Next(10),
                Todo = o.ToString()
            }).ToArray();
            context.TodoItems.AddOrUpdate(item => new { item.Todo }, items);
        }
    }
}