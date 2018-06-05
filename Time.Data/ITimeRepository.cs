using System.Collections.Generic;

namespace Time.Data
{
    public interface ITimeRepository
    {
        IList<Task> ListAllTasks();
        IList<Task> ListAllTasksbyUser(int ResourceId);
        IList<Client> ListAllClients();
        IList<Product> ListAllProducts();
        IList<Proyect> ListAllProyects();
        IList<Service> ListAllServices();
        IList<Resource> ListAllResources();

        Task GetTask(int i);

        void Add(Task task);
        void Delete(Task task);
        void Save();

        Resource GetResource(System.Guid MembershipUserID);
        Resource GetResourcebyID(int id);


    }
}