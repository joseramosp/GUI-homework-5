var currentParent;

$(function() {
	$(".tile").draggable({
        revert: 'invalid',
        start: function(){
            currentParent = $(this).parent().attr('id');
        }
    });
    
    $('#tiles-in-rack, .tile-spot').droppable({
        accept:'.draggable',
        drop: function(event,ui){
            if (currentParent != $(this).attr('id')){
              $(ui.draggable).appendTo($(this)).removeAttr('style');
            }
        }
    });
});
