/**
 * Created by cHiN
 */

function cHiNGRID(options) {
    var tableID = null;
    var tableBody = null;
    var optionsIn = options;
    var template = null;
    var editingRow = null;
    initGrid();

    function initGrid() {
        if (options) {
            tableID = optionsIn.grdTable;
            tableBody = $("#" + tableID).find("tbody");
            template = $("#" + options.gridTemplate).html();
        } else {
            alert("Provide grid options");
        }
    }

    var loadDataIn = function (data) {
        tableBody.html("");
        if (data && data.length > 0) {
            if (optionsIn.loadData) {
                tableBody.append(optionsIn.loadData(data, template));
                tableBody.find(".grdBtnSave").hide();
                tableBody.find(".grdBtnCancel").hide();
            } else {
                alert("Provide grid options");
            }
        } else {
            var trCount = $("#" + tableID).find("thead").find("th").length;

            //if (CommonVars.PageTitle === "Flights Handled" || CommonVars.PageTitle === "EXPORT FLIGHT DELAYS") {

            //    tableBody.append("<tr><td class='thButton' colspan='" + trCount + "'>No Flight Delays Due to Cargo</td></tr>");

            //} else {

                tableBody.append("<tr><td class='thButton noRecordsClass' colspan='" + trCount + "'>No Records</td></tr>");

            //}
            
        }
        loadCommonEvents();
        if (optionsIn.afterLoadData)
            optionsIn.afterLoadData();
    };

    function loadCommonEvents(row,isAdd) {
        if (row) {
            row.find(".grdBtnEdit").click(btnEditClick);
            row.find(".grdBtnDelete").click(btnDeleteClick);
            if (!isAdd) {
                row.find(".grdBtnSave").click(btnSaveClick);
                row.find(".grdBtnCancel").click(btnCancelClicked);
            } else {
                row.find(".grdBtnSave").click(btnAddSaveClick);
                row.find(".grdBtnCancel").click(btnAddCancelClicked);
            }
        } else {
            tableBody.find(".grdBtnEdit").click(btnEditClick);
            tableBody.find(".grdBtnSave").click(btnSaveClick);
            tableBody.find(".grdBtnDelete").click(btnDeleteClick);
            tableBody.find(".grdBtnCancel").click(btnCancelClicked);
            $("#" + tableID).find(".grdButtonAdd").unbind("click");
            $("#" + tableID).find(".grdButtonAdd").click(btnAddClicked);
        }
    }

    var btnEditClick = function () {
        tableBody.find(".grdBtnEdit").show();
        tableBody.find(".grdBtnDelete").find("i").removeClass("delete-confirm");;
        tableBody.find(".grdBtnDelete").show();
        tableBody.find(".grdBtnCancel").hide();
        disableInputs();
        $(this).hide();
        var row = getRow($(this));
        enableInputs(row);
        tableBody.find(".grdBtnSave").hide();
        row.find(".grdBtnDelete").hide();
        row.find(".grdBtnSave").show();
        row.find(".grdBtnCancel").show();
        if (optionsIn.editClicked) {
            optionsIn.editClicked(row);
        }

        editingRow = loadRowDataToArray(row);
        
    };


    function loadRowDataToArray(row) {
        var ret = [];
        row.find("input").each(function(index, item) {
            if ($(item).attr("type") == "checkbox" || $(item).attr("type") == "radio")
                ret.push($(item).is(":checked"));
            else
                ret.push($(item).val());
        });
        return ret;
    }

    function loadDataArrayToRow(data,row) {
        row.find("input").each(function (index, item) {
            if ($(item).attr("type") == "checkbox" || $(item).attr("type") == "radio")
                $(item).attr("checked", data[index]).prop("checked", data[index]);
            else
                $(item).val(data[index]);
        });
    }

    var btnSaveClick = function () {
        var row = getRow($(this));
        if (optionsIn.validateSave && optionsIn.validateSave(row)) {
            row.find(".grdBtnEdit").show();
            row.find(".grdBtnDelete").show();
            $(this).hide();
            row.find(".grdBtnCancel").hide();
            disableInputs(row);

            if (optionsIn.saveClicked) {
                optionsIn.saveClicked(row);
            }
        }
    };

    var btnDeleteClick = function () {
        var row = getRow($(this));
        if (!$(this).find("i").hasClass("delete-confirm")) {
            row.find(".grdBtnEdit").hide();
            row.find(".grdBtnCancel").show();
            //$(this).find("i").removeClass("fa-trash-o");
            $(this).find("i").addClass("delete-confirm");
            row.addClass("to-delete-row");
        }
        else {
            row.hide();
            if (optionsIn.deleteClicked) {
                optionsIn.deleteClicked(row);
                $(this).find("i").removeClass("delete-confirm");
            }
        }
    };

    var btnCancelClicked = function () {
        var row = getRow($(this));
        row.find(".grdBtnEdit").show();
        //row.find(".grdBtnDelete").show().text("Delete");
        row.find(".grdBtnDelete").show().find("i").removeClass("delete-confirm");
        row.find("input").removeClass("cHiN-grid-invalid-input");
        row.find(".grdBtnSave").hide();
        $(this).hide();
        disableInputs(row);
        row.removeClass("to-delete-row");

        if (optionsIn.cancelClicked) {
            optionsIn.cancelClicked(row);
        }
        if (editingRow) {
            loadDataArrayToRow(editingRow, row);
            editingRow = null;
        }
    };

    var btnAddCancelClicked = function () {
        var row = getRow($(this));
        $(row).remove();
    };

    var btnAddSaveClick = function () {
        var row = getRow($(this));
        if (optionsIn.validateSave && optionsIn.validateSave(row)) {
            row.find(".grdBtnEdit").show();
            row.find(".grdBtnDelete").show();
            $(this).hide();
            row.find(".grdBtnCancel").hide();
            disableInputs(row);

            if (optionsIn.addSaveClicked) {
                optionsIn.addSaveClicked(row);
            }
        }
    };

    var btnAddClicked = function () {
        if (optionsIn.addClicked) {
            var ele = optionsIn.addClicked(template);
            ele.find(".grdBtnEdit").hide();
            ele.find(".grdBtnDelete").hide();
            ele.find(".anytimedisabled").hide();
            tableBody.find(".noRecordsClass").hide();
            ele.find(".grdBtnCancel").show();
            ele.find(".grdBtnSave").show();
            tableBody.prepend(ele);
            loadCommonEvents(ele,true);
            enableInputs(ele, true);
            if (optionsIn.afterLoadData)
                optionsIn.afterLoadData();
        }
    };

    function getRow(ele) {
        return ele.closest("tr");
    }

    function disableInputs(row) {
        if (!row) {
            tableBody.find("input,textarea,select").addClass("disabled-text").attr("disabled", true);
        } else {
            row.find("input,textarea,select").addClass("disabled-text").attr("disabled", true);
        }
    }

    function enableInputs(row,isAdd) {
        if (!row) {
            tableBody.find("input,textarea,select").not(".cHiN-disabled").removeClass("disabled-text").attr("disabled", false);
        } else {
            if (isAdd) {
                row.find("input,textarea,select").removeClass("disabled-text").attr("disabled", false);
            }
                
            else {
                row.find("input,textarea,select").not(".cHiN-disabled").removeClass("disabled-text").attr("disabled", false);
                row.find(".charges_AirlineCode").addClass("disabled-text").attr("disabled", true);
            }
                
        }
    }

    function validateInput(input,isValidated,ret) {
        if (isValidated)
            input.removeClass("cHiN-grid-invalid-input");
        else
            input.addClass("cHiN-grid-invalid-input");

        return isValidated && ret;
    }

    return {
        loadData: loadDataIn,
        validateInput: validateInput
    }
}