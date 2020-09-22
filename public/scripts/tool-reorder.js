console.log('you are hearing me talk');
// $('.tile').css('background-color', 'green');

//$('.tool-link').css('background-color', 'green');

//$('.tile2').css('order', -1);

//$thirdTool = $('.tile1');
/* 
$('.tile30').draggable({
    revert: "valid",
    start: function() {
        console.log('start dragging'),
        //console.log(event.target.text());
        $(this).css('background-color', 'magenta')
    },
    stop: () => {
        console.log('stop drag');
        $thirdTool.css('background-color', 'burlywood')
    }
});
 */
//console.log(category.tools.length);

$('.dragit').draggable({
    revert: "invalid",
    //revertDuration: 0,
    start: function () {
        console.log('starteddragging');
        $(this).removeClass('tool-link');

    },
    stop: function () {
        $(this).addClass('tool-link');
    }



});

$('.dragit').droppable({
    drop: function (event, ui) {
        console.log('dropped');
        //$(this).css("background-color", "red");
        console.log("this:", $(this));
        console.log('drop order: '+$(this).css('order'));
        console.log('drag order: '+ui.draggable.css('order'));

        const x = $(this).css('order');
        const y = Number(ui.draggable.css('order'));

        //$(this).css('order', y);
        //ui.draggable.css('order', x);

        console.log('y:', y);
        console.log('x:', x);

        ui.draggable.removeClass('arrange'+y);
        if( y > x ) {
            for(let i = y-1; i >= x; i--){
                $('.arrange'+i).css('order', i+1);
                $('.arrange'+i).addClass('arrange'+(i+1));
                $('.arrange'+i).removeClass('arrange'+i);
            }
            ui.draggable.css('order', x);
            ui.draggable.addClass('arrange'+x);
        } else {
            for(let i = (y+1); i <= x; i++){
                console.log("i is "+i);
                console.log($('.arrange'+i).text());
                $('.arrange'+i).css('order', i-1);    
                $('.arrange'+i).addClass('arrange'+(i-1));
                $('.arrange'+i).removeClass('arrange'+i);
            }
            ui.draggable.css('order', x);
            ui.draggable.addClass('arrange'+x);    
        }


        ui.draggable.css('left', 0);
        ui.draggable.css('top', 0);



    }
})

const allTiles = $('.tool-link');
console.log('length: '+allTiles.length);
console.log(Math.min(7,5));

