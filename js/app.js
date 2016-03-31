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

var saveCode = "";

//Events
$(document).ready(function () {

    //Hide All SubBars
    $('.navSubBar').hide();

    readSaveCode();

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
        writeSaveCode();
    });

    //More Click
    $('.more').click(function () {
        setSlotUse(getSlotLevel(this), 'more');
        updateSlotView(getSlotLevel(this));
        writeSaveCode();
    });

    //Use Field FocusOut
    $('.useValue').blur(function () {
        editSlotUseValue(getSlotLevel(this));
        updateSlotView(getSlotLevel(this));
        writeSaveCode();
    });

    //Max Field FocusOut
    $('.maxValue').blur(function () {
        editSlotMaxValue(getSlotLevel(this));
        updateSlotView(getSlotLevel(this));
        writeSaveCode();
    });

    //Long Rest
    $('.long-rest').click(function () {
        setSlotUseToMax();
        updateFullSlotView();
        writeSaveCode();
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
        $('#subBarSave').hide();
        $('#saveButton').css('border-bottom', '2px solid #121212');
        $('#saveButton').css('border-right', '2px solid transparent');
    }
    else {
        writeSaveCode();
        $('#subBarSave').show();
        $('#saveButton').css('border-bottom', '2px solid #fff');
        $('#saveButton').css('border-right', '2px solid #fff');
    }
}

function writeSaveCode()
{
    for (i = 1; i <= 9; i++)
    {
        if (i > 1) saveCode += "_";
        saveCode = saveCode +
            getSlotUse(i).toString() + "." +
            getSlotMax(i).toString();
    }

    $('.saveCodeField').val(saveCode);
    Cookies.set('spellTrackerSS', saveCode);
}

function readSaveCode()
{
    var ssCookie = Cookies.get('spellTrackerSS');
    if (ssCookie != undefined) {
        var ssList = ssCookie.split("_");
        for (i = 1; i <= 9; i++) {
            var ssValue = ssList[i - 1].split(".");
            slotValues[i][0] = parseInt(ssValue[0]);
            slotValues[i][1] = parseInt(ssValue[1]);
        }
    }
}
