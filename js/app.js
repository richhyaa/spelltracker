var slotValues =
    {
       1: [0, 0],
       2: [0, 0],
       3: [0, 0],
       4: [0, 0],
       5: [0, 0],
       6: [0, 0],
       7: [0, 0],
       8: [0, 0],
       9: [0, 0]
    };

var saveUrl = "";

//Events
$(document).ready(function () {

    $('.navSubBar').hide();

    readSaveUrl();

    updateFullSlotView();

    //Hide Unused
    $('input:checkbox').on('change', function () {
        if ($(this).is(':checked')) {
            showUnusedSlots(false);
        }
        else {
            showUnusedSlots(true);
        }
    });

    //Less Click
    $('.less').click(function () {
        var slotLevel = $(this).parents('.slot').data('slot-level');
        setSlotUse(slotLevel, 'less');
        updateSlotView(getSlotLevel(this));
        writeSaveUrl();
    });

    //More Click
    $('.more').click(function () {
        setSlotUse(getSlotLevel(this), 'more');
        updateSlotView(getSlotLevel(this));
        writeSaveUrl();
    });

    //Use Field FocusOut
    $('.useValue').blur(function () {
        editSlotUseValue(getSlotLevel(this));
        updateSlotView(getSlotLevel(this));
        writeSaveUrl();
    });

    //Max Field FocusOut
    $('.maxValue').blur(function () {
        editSlotMaxValue(getSlotLevel(this));
        updateSlotView(getSlotLevel(this));
        writeSaveUrl();
    });

    //Long Rest
    $('.long-rest').click(function () {
        setSlotUseToMax();
        updateFullSlotView();
        writeSaveUrl();
    });

    //Save Button
    $("#saveButton").click(function () {
        saveButtonDisplay();
    });
});

//Simple Gets
function getSlotLevel(field)
{
    return parseInt($(field).parents('.slot').data('slot-level'));
}

function getSlotUse(slotLevel)
{
    return parseInt(slotValues[slotLevel][0]);
}

function getSlotMax(slotLevel)
{
    return parseInt(slotValues[slotLevel][1]);
}

function setSlotUseToMax()
{
    for(i = 1; i <= 9; i++)
    {
        slotValues[i][0] = getSlotMax(i);
    }
}

function setSlotUse(slotLevel, change) {
    if (change == "less") {
        if (getSlotUse(slotLevel) > 0) {
            slotValues[slotLevel][0] = getSlotUse(slotLevel) - 1;
        }
    }
    else if (change == "more") {
        if (getSlotUse(slotLevel) < getSlotMax(slotLevel)) {
            slotValues[slotLevel][0] = getSlotUse(slotLevel) + 1;
        }
    }
}

function updateSlotView(slotLevel)
{
    var slot = '.slot[data-slot-level="' + slotLevel + '"]';
    var slotUse = getSlotUse(slotLevel);
    var slotMax = getSlotMax(slotLevel);

    $(slot).find('.useValue').val(slotUse);
    $(slot).find('.maxValue').val(slotMax);

    var barWidth = 0
    if (slotMax > 0) {
        barWidth = (slotUse / slotMax) * 100;
    }       
    $(slot).find('.bar').width(barWidth.toString() + '%');
}

function updateFullSlotView()
{
    for (i = 1; i <= 9; i++)
    {
        updateSlotView(i);
    }
}

function editSlotUseValue(slotLevel)
{
    var slot = '.slot[data-slot-level="' + slotLevel + '"]';
    if ($(slot).find('.useValue').val() == "" || $(slot).find('.useValue').val() < 0)
    {
        $(slot).find('.useValue').val(0);
    }
    else if ($(slot).find('.useValue').val() > getSlotMax(slotLevel))
    {
        $(slot).find('.useValue').val(getSlotMax(slotLevel));
    }
    slotValues[slotLevel][0] = $(slot).find('.useValue').val();
    
}

function editSlotMaxValue(slotLevel)
{
    var slot = '.slot[data-slot-level="' + slotLevel + '"]';
    if ($(slot).find('.maxValue').val() == "" || $(slot).find('.maxValue').val() < 0)
    {
        $(slot).find('.maxValue').val(0);
    }
    else if ($(slot).find('.maxValue').val() > 99)
    {
        $(slot).find('.maxValue').val(99);
    }
    else if ($(slot).find('.maxValue').val() < getSlotUse(slotLevel))
    {
        slotValues[slotLevel][0] = $(slot).find('.maxValue').val();
    }

    slotValues[slotLevel][1] = $(slot).find('.maxValue').val();
}

function showUnusedSlots(show)
{
    if (show)
    {
        for (i = 1; i <= 9; i++) {
            $('.slot[data-slot-level="' + i + '"]').show();
        }
        $('.slotsHidden').hide();
    }
    else
    {
        var hiddenCount = 0;
        for (i = 1; i <= 9; i++) {
            var slot = '.slot[data-slot-level="' + i + '"]';
            if (getSlotMax(i) == 0) {
                $(slot).hide();
                hiddenCount++;
            }
            else {
                $(slot).show();
            }
        }
        $('.slotsHidden').html('(' + hiddenCount + ' Hidden)');
        $('.slotsHidden').show();
    }
}

function saveButtonDisplay()
{
    if ($('#subBarSave').is(":visible")) {
        $('.navSubBar').hide();
        $('#saveButton').css('border-bottom', '2px solid #121212');
        $('#saveButton').css('border-right', '2px solid transparent');
    }
    else {
        writeSaveUrl();
        $('.navSubBar').show();
        $('#saveButton').css('border-bottom', '2px solid #fff');
        $('#saveButton').css('border-right', '2px solid #fff');
    }
}

function writeSaveUrl()
{

    saveUrl = "http://richhyaa.github.io/spelltracker5E/?ss=";
    var ss = "";

    for (i = 1; i <= 9; i++)
    {
        if (i > 1) ss += "_";
        ss = ss +
            getSlotUse(i).toString() + "." +
            getSlotMax(i).toString();
    }

    $('.saveUrlField').val(saveUrl + ss);
    Cookies.set('spellTrackerSS', ss);
}

function readSaveUrl()
{

    var ssQS = getParameterByName("ss", window.location.href);
    if (ssQS != null) {
        var ssList = ssQS.split("_");
        for (i = 1; i <= 9; i++) {
            var ssValue = ssList[i - 1].split(".");
            slotValues[i][0] = parseInt(ssValue[0]);
            slotValues[i][1] = parseInt(ssValue[1]);
        }
    }
    else
    {
        var ssCookie = Cookies.get('spellTrackerSS');
        if (ssCookie != undefined)
        {
            var ssList = ssCookie.split("_");
            for (i = 1; i <= 9; i++) {
                var ssValue = ssList[i - 1].split(".");
                slotValues[i][0] = parseInt(ssValue[0]);
                slotValues[i][1] = parseInt(ssValue[1]);
            }
        }
    }
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    url = url.toLowerCase(); // This is just to avoid case sensitiveness  
    name = name.replace(/[\[\]]/g, "\\$&").toLowerCase();// This is just to avoid case sensitiveness for query parameter name
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}