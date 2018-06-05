using System.Web;
using System.Web.Optimization;

namespace TimeTrack
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new ScriptBundle("~/bundles/schedulecalendar").Include(
                      "~/Scripts/Schedule/jquery-1.3.2.min.js",
                      "~/Scripts/Schedule/jquery-1.7.2.ui.min.js",
                      "~/Scripts/Schedule/jquery.weekcalendar.js",
                      "~/Scripts/Schedule/schedule.calendar.js"
                      ));

            bundles.Add(new ScriptBundle("~/bundles/admindatagrid").Include(
                      "~/Scripts/Admin/admin.datagrid.js"
                      ));

            bundles.Add(new ScriptBundle("~/bundles/tablesorter").Include(
                    "~/Scripts/Tablesorter/js/jquery.tablesorter.js",
                    "~/Scripts/Tablesorter/addons/pager/jquery.tablesorter.pager.js",
                    "~/Scripts/Tablesorter/js/jquery.tablesorter.widgets.js"));

            bundles.Add(new StyleBundle("~/bundles/tablesortercss").Include(
                      "~/Scripts/Tablesorter/css/theme.blue.css",
                      "~/Scripts/Tablesorter/addons/pager/jquery.tablesorter.pager.css"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));

            bundles.Add(new StyleBundle("~/Content/fonts").Include(
                      "~/Content/font-awesome.min.css",
                      "~/Content/fonts.googleapis.materialicons.css",
                      "~/Content/fonts.googleapis.varelarounds.css"));

            bundles.Add(new StyleBundle("~/Content/calendar").Include(
                      "~/Content/jquery-ui.css",
                      "~/Content/jquery.weekcalendar.css",
                      "~/Content/schedule-calendar.css"));
        }
    }
}
