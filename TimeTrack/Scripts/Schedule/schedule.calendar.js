var virtpath = "/";
var shiftdown = false;
var ctrldown = false;
var altdown = false;

$(document).ready(function() {


    //        //var evx = calEvent.ctrlKey;
    //        alert(originalEvent.ctrlKey);
    //            //if (window.event.ctrlKey){
    //            if (evx) {
    //                var answer = confirm("Do you want to copy this Event?")
    //                //alert("Ctrl+Click");
    //                // your code goes here...
    //            }

    $(document).bind("keydown", function(e) {
        if (e.keyCode == 16) {
            shiftdown = true;
        }
        if (e.keyCode == 17) {
            ctrldown = true;
        }
        if (e.keyCode == 18) {
            altdown = true;
        }
        //alert("keydown " + e.keyCode);
    });

    $(document).bind("keyup", function(e) {
        if (e.keyCode == 16) {
            shiftdown = false;
        }
        if (e.keyCode == 17) {
            ctrldown = false;
        }
        if (e.keyCode == 18) {
            altdown = false;
        }
        //alert("keyup " + e.keyCode);
    });


    $('#client').change(function() {
        var $dialogContent = $("#event_edit_container");
        jQuery.ajax({
            url: virtpath + 'Schedule/getClientData/' + $(this).val(),
            type: 'POST',
            success: function(data) {
                $dialogContent.find("select[name='product']").html(data);
                $dialogContent.find("select[name='project']").html("<option value=\"\">Select Project</option>");
            }
        });
    });

    $('#product').change(function() {
        var $dialogContent = $("#event_edit_container");
        jQuery.ajax({
            url: virtpath + 'Schedule/getProductData/' + $(this).val(),
            type: 'POST',
            success: function(data) {
                $dialogContent.find("select[name='project']").html(data);
            }
        });
    });


    var $calendar = $('#calendar');
    var id = 10;

    $calendar.weekCalendar({
        timeslotHeight: 17,
        displayOddEven: true,
        timeslotsPerHour: 4,
        allowCalEventOverlap: true,
        overlapEventsSeparate: true,
        firstDayOfWeek: 1,
        businessHours: { start: 8, end: 18, limitDisplay: false },
        daysToShow: 7,
        switchDisplay: { '1 day': 1, '3 next days': 3, 'work week': 5, 'full week': 7 },
        title: function(daysToShow) {
            return daysToShow == 1 ? '%date%' : '%start% - %end%';
        },
        height: function($calendar) {
            return $(window).height() - $("h1").outerHeight();
        },
        eventRender: function(calEvent, $event) {
            if (calEvent.end.getTime() < new Date().getTime()) {
                $event.css("backgroundColor", "#aaa");
                $event.find(".wc-time").css({
                    "backgroundColor": "#999",
                    "border": "1px solid #888"
                });
            }
        },
        draggable: function(calEvent, $event) {
            return calEvent.readOnly != true;
        },
        resizable: function(calEvent, $event) {
            return calEvent.readOnly != true;
        },
        eventNew: function(calEvent, $event) {
            var $dialogContent = $("#event_edit_container");
            resetForm($dialogContent);
            var startField = $dialogContent.find("select[name='start']").val(calEvent.start);
            //alert(calEvent.start.toUTCString());
            //alert(calEvent.end.toUTCString());
            var endField = $dialogContent.find("select[name='end']").val(calEvent.end);
            var titleField = $dialogContent.find("input[name='title']");
            var bodyField = $dialogContent.find("textarea[name='body']");

            var clientField = $dialogContent.find("select[name='client']").val("");
            var projectField = $dialogContent.find("select[name='project']").val("");
            var productField = $dialogContent.find("select[name='product']").val("");
            var serviceField = $dialogContent.find("select[name='service']").val("");

            $dialogContent.dialog({
                modal: true,
                title: "New Calendar Event",
                close: function() {
                    $dialogContent.dialog("destroy");
                    $dialogContent.hide();
                    $('#calendar').weekCalendar("removeUnsavedEvents");
                },
                buttons: {
                    save: function() {
                        calEvent.id = id;
                        id++;
                        calEvent.start = new Date(startField.val());
                        calEvent.end = new Date(endField.val());
                        calEvent.title = titleField.val();
                        calEvent.body = bodyField.val();
                        //                        calEvent.client = clientField.val();
                        //                        calEvent.project = projectField.val();
                        //                        calEvent.product = productField.val();
                        //                        claEvent.service = serviceField.val();

                        if (clientField.val() != "" &&
                            projectField.val() != "" &&
                            productField.val() != "" &&
                            serviceField.val() != "") {
                            jQuery.ajax({
                                url: virtpath + 'Schedule/saveEventData/',
                                type: 'POST',
                                data: "start=" + calEvent.start.toUTCString() +
                            "&end=" + calEvent.end.toUTCString() +
                            "&title=" + calEvent.title +
                            "&body=" + calEvent.body +
                            "&client=" + clientField.val() +
                            "&project=" + projectField.val() +
                            "&product=" + productField.val() +
                            "&service=" + serviceField.val() +
                            "",
                                success: function(data) { }
                            });

                            $calendar.weekCalendar("removeUnsavedEvents");
                            $calendar.weekCalendar("updateEvent", calEvent);
                            $dialogContent.dialog("close");
                            $calendar.weekCalendar("refresh"); // jeb 08/20/2009
                        }
                        else {
                            alert("Please select one item for Client, Product, Project and Service Type");
                        }
                    },
                    cancel: function() {
                        $dialogContent.dialog("close");
                        //$calendar.weekCalendar("refresh"); // jeb 08/25/2009
                    }
                }
            }).show();
            var mth = calEvent.start.getMonth() + 1;

            $dialogContent.find(".date_holder").text(calEvent.start.getFullYear() + "-" + mth + "-" + calEvent.start.getDate());
            setupStartAndEndTimeFields(startField, endField, calEvent, $calendar.weekCalendar("getTimeslotTimes", calEvent.start));
            $(window).resize(); //fixes a bug in modal overlay size ??


        },
        eventDrop: function(calEvent, $event) {

            //        //var evx = calEvent.ctrlKey;
            //        alert(originalEvent.ctrlKey);
            //            //if (window.event.ctrlKey){
            //            if (evx) {
            //                var answer = confirm("Do you want to copy this Event?")
            //                //alert("Ctrl+Click");
            //                // your code goes here...
            //            }


            //var answer = confirm("Do you want to copy this Event?")
            if (altdown == false && shiftdown == false && ctrldown == false) {
                jQuery.ajax({
                    url: virtpath + 'Schedule/updateEventData/' + calEvent.id,
                    type: 'POST',
                    data: "start=" + calEvent.start.toUTCString() +
                                "&end=" + calEvent.end.toUTCString() +
                                "&title=" + calEvent.title +
                                "&body=" + calEvent.body +
                                "&client=" + calEvent.client +
                                "&project=" + calEvent.project +
                                "&product=" + calEvent.product +
                                "&service=" + calEvent.service +
                                "",
                    success: function(data) { }
                });
            }
            else {
                if (ctrldown) {
                    jQuery.ajax({
                        url: virtpath + 'Schedule/saveEventData/',
                        type: 'POST',
                        data: "start=" + calEvent.start.toUTCString() +
                            "&end=" + calEvent.end.toUTCString() +
                            "&title=" + calEvent.title +
                            "&body=" + calEvent.body +
                            "&client=" + calEvent.client +
                            "&project=" + calEvent.project +
                            "&product=" + calEvent.product +
                            "&service=" + calEvent.service +
                            "",
                        success: function(data) { }
                    });

                    $calendar.weekCalendar("removeUnsavedEvents");
                    $calendar.weekCalendar("updateEvent", calEvent);
                    
                    ctrldown = false;
                    //location.reload();
                    $calendar.weekCalendar("refresh"); // jeb 08/20/2009
                }

                if (shiftdown) {
                    jQuery.ajax({
                        url: virtpath + 'Schedule/lastweekEventData/',
                        type: 'POST',
                        data: "start=" + calEvent.start.toUTCString() +
                            "&end=" + calEvent.end.toUTCString() +
                            "&title=" + calEvent.title +
                            "&body=" + calEvent.body +
                            "&client=" + calEvent.client +
                            "&project=" + calEvent.project +
                            "&product=" + calEvent.product +
                            "&service=" + calEvent.service +
                            "",
                        success: function(data) { }
                    });
                    
                    alert("Time copied to last week");
                    shiftdown = false;
                    $calendar.weekCalendar("refresh");

                }

                if (altdown) {
                    jQuery.ajax({
                        url: virtpath + 'Schedule/nextweekEventData/',
                        type: 'POST',
                        data: "start=" + calEvent.start.toUTCString() +
                            "&end=" + calEvent.end.toUTCString() +
                            "&title=" + calEvent.title +
                            "&body=" + calEvent.body +
                            "&client=" + calEvent.client +
                            "&project=" + calEvent.project +
                            "&product=" + calEvent.product +
                            "&service=" + calEvent.service +
                            "",
                        success: function(data) { }
                    });
                    
                    alert("Time copied to next week");
                    altdown = false;
                    $calendar.weekCalendar("refresh");
                }
            }
        },
        eventResize: function(calEvent, $event) {
            jQuery.ajax({
                url: virtpath + 'Schedule/updateEventData/' + calEvent.id,
                type: 'POST',
                data: "start=" + calEvent.start.toUTCString() +
                                "&end=" + calEvent.end.toUTCString() +
                                "&title=" + calEvent.title +
                                "&body=" + calEvent.body +
                                "&client=" + calEvent.client +
                                "&project=" + calEvent.project +
                                "&product=" + calEvent.product +
                                "&service=" + calEvent.service +
                                "",
                success: function(data) { }
            });
        },
        eventClick: function(calEvent, $event) {

            if (calEvent.readOnly) {
                return;
            }

            jQuery.ajax({
                url: virtpath + 'Schedule/getClientData/' + calEvent.client,
                type: 'POST',
                success: function(data) {
                    //$dialogContent.find("select[name='product']").html(data);
                    var productField = $dialogContent.find("select[name='product']").html(data);
                    productField.val(calEvent.product);
                }
            });

            jQuery.ajax({
                url: virtpath + 'Schedule/getProductData/' + calEvent.product,
                type: 'POST',
                success: function(data) {
                    //$dialogContent.find("select[name='project']").html(data);
                    var projectField = $dialogContent.find("select[name='project']").html(data);
                    projectField.val(calEvent.project);
                }
            });

            var $dialogContent = $("#event_edit_container");
            resetForm($dialogContent);
            var startField = $dialogContent.find("select[name='start']").val(calEvent.start);
            var endField = $dialogContent.find("select[name='end']").val(calEvent.end);
            var titleField = $dialogContent.find("input[name='title']").val(calEvent.title);
            var bodyField = $dialogContent.find("textarea[name='body']");
            alert("Body Field1: " + bodyField.val());
            bodyField.val(calEvent.body);
            alert("Body Field2: " + bodyField.val());

            var clientField = $dialogContent.find("select[name='client']");
            clientField.val(calEvent.client);


            var serviceField = $dialogContent.find("select[name='service']");
            serviceField.val(calEvent.service);
            //            alert("Product: " + calEvent.product);
            //            alert("Project: " + calEvent.project);
            //            alert("Client: " + calEvent.client);
            //            alert("Service: " + calEvent.service);

            $dialogContent.dialog({
                modal: true,
                title: "Edit - " + calEvent.title,
                close: function() {
                    $dialogContent.dialog("destroy");
                    $dialogContent.hide();
                    $('#calendar').weekCalendar("removeUnsavedEvents");
                },
                buttons: {
                    save: function() {

                        calEvent.start = new Date(startField.val());
                        calEvent.end = new Date(endField.val());
                        calEvent.title = titleField.val();
                        calEvent.body = bodyField.val();

                        calEvent.client = clientField.val();
                        ddproduct = $('#product').val();
                        ddproject = $('#project').val();
                        calEvent.product = ddproduct;
                        calEvent.project = ddproject;
                        //calEvent.project = projectField.val();
                        //calEvent.product = productField.val();
                        calEvent.service = serviceField.val();

                        if (clientField.val() != "" &&
                            ddproduct != "" &&
                            ddproject != "" &&
                        //projectField.val() != "" &&
                        //productField.val() != "" &&
                            serviceField.val() != "") {

                            jQuery.ajax({
                                url: virtpath + 'Schedule/updateEventData/' + calEvent.id,
                                type: 'POST',
                                data: "start=" + calEvent.start.toUTCString() +
                                "&end=" + calEvent.end.toUTCString() +
                                "&title=" + calEvent.title +
                                "&body=" + calEvent.body +
                                "&client=" + calEvent.client +
                                "&project=" + calEvent.project +
                                "&product=" + calEvent.product +
                                "&service=" + calEvent.service +
                                "",
                                success: function(data) { }
                            });

                            $calendar.weekCalendar("updateEvent", calEvent);
                            $dialogContent.dialog("close");
                            //$calendar.weekCalendar("refresh"); // jeb 08/25/2009
                        }
                        else {
                            alert("Please select one item for Client, Product, Project and Service Type");
                        }
                    },
                    "delete": function() {

                        jQuery.ajax({
                            url: virtpath + 'Schedule/deleteEventData/' + calEvent.id,
                            type: 'POST',
                            data: "",
                            success: function(data) { }
                        });

                        $calendar.weekCalendar("removeEvent", calEvent.id);
                        $dialogContent.dialog("close");
                        //$calendar.weekCalendar("refresh"); // jeb 08/25/2009
                    },
                    cancel: function() {
                        $dialogContent.dialog("close");
                        //$calendar.weekCalendar("refresh"); // jeb 08/25/2009
                    }
                }
            }).show();

            var mth = calEvent.start.getMonth() + 1;

            var startField = $dialogContent.find("select[name='start']").val(calEvent.start);
            var endField = $dialogContent.find("select[name='end']").val(calEvent.end);
            $dialogContent.find(".date_holder").text($calendar.weekCalendar("formatDate", calEvent.start));
            setupStartAndEndTimeFields(startField, endField, calEvent, $calendar.weekCalendar("getTimeslotTimes", calEvent.start));
            $(window).resize().resize(); //fixes a bug in modal overlay size ??

        },
        eventMouseover: function(calEvent, $event) {
        },
        eventMouseout: function(calEvent, $event) {
        },
        noEvents: function() {
        },
        data: "" + virtpath + 'Schedule/getEventData/' + ""
    });

    //getEventData();

    function resetForm($dialogContent) {
        $dialogContent.find("input").val("");
        $dialogContent.find("textarea").val("");
        $dialogContent.find("select[name='product']").html("<option value=\"\">Select Product</option>");
        $dialogContent.find("select[name='project']").html("<option value=\"\">Select Project</option>");
    }

    function getEventData() {
        var year = new Date().getFullYear();
        //alert(year);
        var month = new Date().getMonth();
        //alert(month);
        var day = new Date().getDate();
        //alert(day);
        var dte = year + "-" + month + "-" + day;
        alert(dte);

        var jsondta;
    }

    /*
    * Sets up the start and end time fields in the calendar event
    * form for editing based on the calendar event being edited
    */
    function setupStartAndEndTimeFields($startTimeField, $endTimeField, calEvent, timeslotTimes) {

        $startTimeField.empty();
        $endTimeField.empty();

        for (var i = 0; i < timeslotTimes.length; i++) {
            var startTime = timeslotTimes[i].start;
            var endTime = timeslotTimes[i].end;
            var startSelected = "";
            if (startTime.getTime() === calEvent.start.getTime()) {
                startSelected = "selected=\"selected\"";
            }
            var endSelected = "";
            if (endTime.getTime() === calEvent.end.getTime()) {
                endSelected = "selected=\"selected\"";
            }
            $startTimeField.append("<option value=\"" + startTime + "\" " + startSelected + ">" + timeslotTimes[i].startFormatted + "</option>");
            $endTimeField.append("<option value=\"" + endTime + "\" " + endSelected + ">" + timeslotTimes[i].endFormatted + "</option>");

            $timestampsOfOptions.start[timeslotTimes[i].startFormatted] = startTime.getTime();
            $timestampsOfOptions.end[timeslotTimes[i].endFormatted] = endTime.getTime();

        }
        $endTimeOptions = $endTimeField.find("option");
        $startTimeField.trigger("change");
    }

    var $endTimeField = $("select[name='end']");
    var $endTimeOptions = $endTimeField.find("option");
    var $timestampsOfOptions = { start: [], end: [] };

    //reduces the end time options to be only after the start time options.
    $("select[name='start']").change(function() {
        var startTime = $timestampsOfOptions.start[$(this).find(":selected").text()];
        var currentEndTime = $endTimeField.find("option:selected").val();
        $endTimeField.html(
            $endTimeOptions.filter(function() {
                return startTime < $timestampsOfOptions.end[$(this).text()];
            })
            );

        var endTimeSelected = false;
        $endTimeField.find("option").each(function() {
            if ($(this).val() === currentEndTime) {
                $(this).attr("selected", "selected");
                endTimeSelected = true;
                return false;
            }
        });

        if (!endTimeSelected) {
            //automatically select an end date 2 slots away.
            $endTimeField.find("option:eq(1)").attr("selected", "selected");
        }

    });


    var $about = $("#about");

    $("#about_button").click(function() {
        $about.dialog({
            title: "About this calendar demo",
            width: 600,
            close: function() {
                $about.dialog("destroy");
                $about.hide();
            },
            buttons: {
                close: function() {
                    $about.dialog("close");
                }
            }
        }).show();
    });


});