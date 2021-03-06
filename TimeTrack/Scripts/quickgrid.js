(function ($) {
    //quick grid class
    function QuickGrid(container, settings) {
        this.container = container;
        this.settings = settings;

        init.call(this);

        var self = this;

        this.$table.on("click", 'th', function (e) {
            if ($(e.target).hasClass('qgrd-header-filter') || $(this).find('.qgrd-actions-header').length) {
                return;
            }

            var $sortIcon = $(this).find('.qgrd-icon-sort');
            var sortKey = $(this).data('key');
            if ($sortIcon.hasClass('up')) {
                $('.qgrd-icon-sort').removeClass('up down');
                sort.call(self, sortKey, false);
                $sortIcon.addClass('down');
            }
            else {
                $('.qgrd-icon-sort').removeClass('up down');
                sort.call(self, sortKey, true);
                $sortIcon.addClass('up');
            }
        }).on("click", 'tr', function (e) {
            if (typeof self.settings.onrowclick === "function") {
                self.settings.onrowclick($(this).data('rowdata'), $(this).index());
            }
        }).on("click", '.qgrd-remove-row-btn', function (e) {
            e.preventDefault();
            e.stopPropagation();

            var $thistr = $(this).closest('tr');
            var rowIndex = $thistr.index();
            self.settings.data.splice(rowIndex, 1);
            if (typeof self.settings.onrowdelete === "function") {
                self.settings.onrowdelete(rowIndex, $thistr.data("rowdata"));                
            }
            rebuildBody.call(self);
            $(this.container).trigger( "qgrd:removerow", $thistr.data("rowdata"), rowIndex);
        }).on("click", '.qgrd-add-row-btn', function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (typeof self.settings.onaddrowclick === "function") {
                self.settings.onaddrowclick();
            }
        }).on("click", '.qgrd-edit-row-btn', function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (typeof self.settings.oneditrowclick === "function") {
                var thisTr = $(this).closest('tr');
                self.settings.oneditrowclick(thisTr.data('rowdata'), thisTr.index());
            }
        }).on("click", '.qgrd-customize-btn', function (e) {
            e.preventDefault();
            e.stopPropagation();

            var columnsVisibility = {};
            self.keys.forEach((key) => {
                if (!columnsVisibility.hasOwnProperty(key)) {
                    columnsVisibility[key] = isColumnVisible.call(self, key);
                }
            });

            var modal = new QuickModal($('body')[0], columnsVisibility,
                {
                    title: "Customize Columns",
                    onsubmit: (updatedColumnsVisibility) => {

                        self.keys.forEach((key) => {
                            self.settings.columns[key] = self.settings.columns[key] || {};
                            self.settings.columns[key].visible = !!updatedColumnsVisibility[key];
                        });
                        
                        rebuildBody.call(self);                        
                    }
                });
        }).on("change", '.qgrd-header-filter', function () {

            var filterValue = $(this).val();
            var filterKey = $(this).closest('th').data('key');

            self.$rows.forEach($row => {
                if ($row.find('td[data-key="' + filterKey + '"]').text().indexOf(filterValue) == -1) {
                    $row.hide();
                }
                else {
                    $row.show();
                }
            });
        })
        
        this.$tableWrap.on("click", '.qgrd-pagination-page-link', function (e) {
            e.preventDefault();
            e.stopPropagation();

            var pageNum = $(this).data('page');
            if (typeof pageNum !== "undefined") {
                self.settings.pagination.activePage = pageNum;
                rebuildBody.call(self);
            }
        });        
    }

    QuickGrid.prototype.updateRow = function (rownum, rowData) {

        if (!this.settings.data[rownum]) {
            throw new Error("Record with index " + rownum + " does not exist");
        }

        for (var key in rowData) {
            this.settings.data[rownum][key] = rowData[key];
        }

        rebuildBody.call(this);
        $(this.container).trigger( "qgrd:updaterow", rowData, rownum);
    };

    QuickGrid.prototype.addRow = function (rowData) {
        this.settings.data.push(rowData);
        rebuildBody.call(this);
        $(this.container).trigger( "qgrd:addrow", rowData);
    }

    // sort grid
    function sort(sortKey, asc) {
        var self = this;
        self.settings.data.sort((a, b) => {
            var avalue = a[sortKey];
            var bvalue = b[sortKey];

            if (typeof avalue == 'number' || typeof avalue.getMonth === 'function') {
                return asc ? avalue - bvalue : bvalue - avalue;
            }
            else {
                avalue = avalue.toUpperCase();
                bvalue = bvalue.toUpperCase();
                if (avalue < bvalue) {
                    return asc ? -1 : 1;
                }
                if (avalue > bvalue) {
                    return asc ? 1 : -1;
                }
            }            
            return 0;
        });
        rebuildBody.call(this);
    }

    //build grid html
    function init() {
        var self = this;

        $(this.container).html("");
        this.$tableWrap = $("<div class='qgrd-wrap'>").appendTo(this.container);
        this.$table = $("<table class='qgrd'>").appendTo(this.$tableWrap);
        this.$thead = $("<thead>").appendTo(this.$table);
        this.$tbody = $("<tbody>").appendTo(this.$table);
        this.keys = [];
        this.$headers = [];
        this.$rows = [];
        this.$pagination = [];

        this.settings.data.forEach(rowData => {
            for (var key in rowData) {
                if (this.keys.indexOf(key) == -1) {
                    this.keys.push(key);
                }
            }
        });

        rebuild.call(this);
    }

    function rebuildHeaders() {
        this.$thead.html("");

        var $actionsHeader = $('<th>').appendTo(this.$thead);
        var $actionsHeaderWrap = $('<div class="qgrd-actions-header"></div>').appendTo($actionsHeader);
        $('<button class="qgrd-add-row-btn">').appendTo($actionsHeaderWrap);
        $('<button class="qgrd-customize-btn">').appendTo($actionsHeaderWrap);

        this.keys.forEach(key => {
            if (isColumnVisible.call(this, key)) {

                var title = getColumnTitle.call(this, key);

                var $header = $('<th>').appendTo(this.$thead).data('key', key);
                var $headerWrap = $('<div class="qgrd-header-wrap"></div>').appendTo($header);

                var $headerTextContainer = $('<div class="qgrd-header-text-wrap"><div class="qgrd-header-text">' + title + '</div></div>').appendTo($headerWrap);

                var $headerFilter = $('<input class="qgrd-header-filter"/>').appendTo($headerWrap);
                var $headerSortIcon = $('<i class="qgrd-icon-sort"></i>').appendTo($headerTextContainer);

                this.$headers.push($header);
            }
        });
    }

    function rebuild() {
        
        rebuildHeaders.call(this);
        rebuildBody.call(this);

        if (this.settings.pagination) {
            buildPagination.call(this);
        }
    };

    function rebuildBody() {
        var self = this;
        this.$tbody = $(this.container).find('tbody');
        this.$tbody.html("");
        //add records

        var dataPortion = this.settings.data;
        if (this.settings.pagination) {
            dataPortion = this.settings.data.slice(this.settings.pagination.recordsPerPage * this.settings.pagination.activePage , this.settings.pagination.recordsPerPage * (this.settings.pagination.activePage + 1));
            if (this.$pagination && this.$pagination.length) {
                this.$pagination.find('.qgrd-pagination-page-link').removeClass('active');                
                this.$pagination.find('.qgrd-pagination-page-link').filter(function() {
                    return $(this).data('page') === self.settings.pagination.activePage;
                }).addClass('active');
            }
        }

        dataPortion.forEach(rowData => {
            var $tr = $("<tr></tr>").appendTo(this.$tbody);

            //add row action buttons
            var $tdActions = $("<td class='qgrd-actions'></td>").appendTo($tr);
            $("<button class='qgrd-remove-row-btn'></button>").appendTo($tdActions);
            $('<button class="qgrd-edit-row-btn">').appendTo($tdActions);

            //add data cells
            $tr.data("rowdata", rowData);
            this.keys.forEach(key => {
                if (isColumnVisible.call(this, key)) {
                    $("<td data-key='" + key + "'>" + (typeof rowData[key] === "undefined" ? "" : rowData[key]) + "</td>").appendTo($tr);
                }
            });            

            this.$rows.push($tr);
        });
    }

    function buildPagination() {
        this.$pagination = $("<ul class='qgrd-pagination-ul'>").appendTo(this.$tableWrap);
        var pagesNumber = Math.ceil((this.settings.data.length / this.settings.pagination.recordsPerPage));

        for (var i = 0; i < pagesNumber; i++) {
            var $paginationLi = $("<li class='qgrd-pagination-page'></li>").appendTo(this.$pagination);
            var $paginationPageLink = $("<a href='#' class='qgrd-pagination-page-link'>" + (i + 1) + "</a>").appendTo($paginationLi);
            $paginationPageLink.data('page', i);
            if (this.settings.pagination.activePage == i) {
                $paginationPageLink.addClass('active');
            }
        }
    }

    function isColumnVisible(key) {
        if (!this.settings.columns[key]) {
            return true;
        }
        return typeof this.settings.columns[key].visible === "undefined" || this.settings.columns[key].visible;
    }

    function getColumnTitle(key) {
        if (!this.settings.columns[key] || typeof this.settings.columns[key].title === "undefined") {
            return capitalize(key);
        }
        else if (typeof this.settings.columns[key].title === "string"  ) {
            return this.settings.columns[key].title;
        }
        else if (typeof this.settings.columns[key].title === "function"  ) {
            return this.settings.columns[key].title(key);
        }
    }

    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.substring(1);
    };


    //init jq plugin
    $.fn.quickGrid = function (options) {
        return this.each(function () {
            //default settings
            var defaultOptions = {
                data: [
                    {
                        property1: "01.02.2017",
                        property2: ""
                    },
                    {
                        property2: "100",
                        property1: "02.02.2017"
                    },
                    {
                        property2: "10",
                        property1: "03.02.2017",
                        property3: ""
                    }
                ],
                columns: {
                    property1 : {
                        visible: false,
                        title: "Date"
                    },
                    property2 : {
                        title: function(key){
                            return "!!!" + key.charAt(0).toUpperCase() + key.substring(1)  + "!!!";
                        }
                    }
                },
                onaddrowclick: function () {

                    var rowDataToAdd = {};

                    quickGrid.settings.data.forEach((rowData) => {
                        for (var prop in rowData) {
                            if (!rowDataToAdd.hasOwnProperty(prop)) {
                                rowDataToAdd[prop] = "";
                            }
                        }
                    });

                    var modal = new QuickModal($('body')[0], rowDataToAdd,
                        {
                            title: "Add Record",
                            onsubmit: (objData) => quickGrid.addRow(objData)
                        });
                },
                onrowclick: function (rowdata, rownum) {
                    var modal = new QuickModal($('body')[0], rowdata,
                        {
                            title: "Edit Record",
                            onsubmit: (objData) => quickGrid.updateRow(rownum, objData)
                        });
                },
                oneditrowclick: function (rowdata, rownum) {
                    var modal = new QuickModal($('body')[0], rowdata,
                        {
                            title: "Edit Record",
                            onsubmit: (objData) => quickGrid.updateRow(rownum, objData)
                        });
                },
                onrowdelete: function (rowdata, rownum) {
                },
                pagination: {
                    recordsPerPage: 10,
                    activePage: 0
                }
            }
            var settings = defaultOptions;
            if (options) {
                $.extend(settings, options);
            }

            //create also default options for a data item (with e.g. isVisible property)

            var quickGrid = new QuickGrid(this, settings);

            $(this).data("quickGrid", quickGrid);
        });
    }

    //quick modal for editing rows, just default way to edit rows, any other can be used by reusing onrowclick event to get row data and updateRow quickgrid public method
    function QuickModal(container, data, options) {
        this.container = container;
        this.data = data;

        this.settings = {
            width: 500, height: 400
        };
        if (options) {
            $.extend(this.settings, options);
        }

        var self = this;
        build.call(this);

        //events
        this.$modalOverlay.click(function () {
            self.$modal.remove();
        });

        function build() {
            var self = this;
            this.$modal = $('<div class="qgrd-modal"></div>').appendTo(this.container);
            this.$modalOverlay = $('<div class="qgrd-modal-overlay"></div>').appendTo(this.$modal);

            this.$modalContainer = $('<div class="qgrd-modal-container"></div>').appendTo(this.$modal).css({
                "width": this.settings.width + "px",
                "height": this.settings.height + "px",
                "margin-top": -(this.settings.height / 2) + "px",
                "margin-left": -(this.settings.width / 2) + "px"
            });
            this.$modalForm = $('<form class="qgrd-modal-form"></form>').appendTo(this.$modalContainer).on("submit", function (e) {
                e.preventDefault();
                var objData = {};
                $(this).serializeArray().forEach((item) => {
                    objData[item.name] = item.value;
                });
                if (typeof self.settings.onsubmit === "function") {
                    self.settings.onsubmit(objData);
                }
                self.$modal.remove();
            });

            this.$modalHeader = $('<div class="qgrd-modal-header">' + options.title + '</div>').appendTo(this.$modalForm);
            this.$modalDismissBtn = $('<button class="qgrd-modal-dismiss"></button>').appendTo(this.$modalHeader).click(function () {
                self.$modal.remove();
            });
            this.$modalContent = $('<div class="qgrd-modal-content"></div>').appendTo(this.$modalForm);
            this.$modalFooter = $('<div class="qgrd-modal-footer"></div>').appendTo(this.$modalForm);
            this.$modalSubmitBtn = $('<input type="submit" class="qgrd-modal-submit" value="OK"/>').appendTo(this.$modalFooter);

            for (var key in data) {
                if (typeof data[key] === "boolean") {
                    var isChecked = data[key] ? "checked" : "";
                    $('<div><label>' + key + '</label><input type="checkbox" name="' + key + '" ' + isChecked + '/></div>').appendTo(this.$modalContent);
                }
                else {
                    $('<div><label>' + key + '</label><input name="' + key + '" value="' + data[key] + '"/></div>').appendTo(this.$modalContent);
                }
            }
        }
    }
})(jQuery);
