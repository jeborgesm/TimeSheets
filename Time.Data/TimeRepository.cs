using System.Collections.Generic;
using System.Linq;
using System;

namespace Time.Data
{
    public class TimeRepository : ITimeRepository
    {
        private TimeRegistryDataContext _dataContext;

        public TimeRepository()
        {
            _dataContext = new TimeRegistryDataContext();
        }

        public IList<Task> ListAllTasks()
        {
            var task = from tsk in _dataContext.Tasks
                          select tsk;
            return task.ToList();
        }

        public IList<Task> ListAllTasksbyUser(int ResourceId)
        {
            var task = from tsk in _dataContext.Tasks
                       where tsk.Resource.id == ResourceId
                       select tsk;


            List<Task> Tasks =  task.ToList();

            foreach (Task taskItem in Tasks)
            {
                taskItem.Proyect = _dataContext.Proyects.Where(w => w.id == taskItem.Proyect_id).FirstOrDefault();
            }

            return Tasks;
        }

        public IList<Client> ListAllClients()
        {
            var client = from clnt in _dataContext.Clients
                        select clnt;
            return client.ToList();
        }

        public IList<Product> ListAllProducts()
        {
            var product = from prd in _dataContext.Products
                        select prd;
            return product.ToList();
        }

        public IList<Proyect> ListAllProyects()
        {
            var proyect = from pry in _dataContext.Proyects
                          select pry;
            return proyect.ToList();
        }

        public IList<Service> ListAllServices()
        {
            var service = from srv in _dataContext.Services
                        select srv;
            return service.ToList();
        }

        public IList<Resource> ListAllResources()
        {
            var resource = from rsr in _dataContext.Resources
                          select rsr;
            return resource.ToList();
        }

        public Task GetTask(int id)
        {
            return _dataContext.Tasks.SingleOrDefault(d => d.id == id);
        }

        //
        // Insert/Delete Methods
        public void Add(Task task)
        {
            _dataContext.Tasks.Add(task);
        }

        public void Delete(Task task)
        {
            _dataContext.Tasks.Remove(task);
        }

        //
        // Persistence

        public void Save()
        {
            _dataContext.SaveChanges();
        }


        public Resource GetResource(System.Guid MembershipUserID)
        {
            return new Resource();
            //return _dataContext.Resources.SingleOrDefault(d => d.id_User == MembershipUserID);
        }

        public Resource GetResourcebyID(int id)
        {
            return _dataContext.Resources.SingleOrDefault(d => d.id == id);
        }
    }
}