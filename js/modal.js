pg.modal = function() {
	
	var notice = function(msg, type) {
		var $fader = jQuery('<div class="modal fader admin">');
		var $container = jQuery('<div class="container '+type+'">');
		var $header = jQuery('<h2 class="modalTitle">Notice</h2>');
		var $okButton = jQuery('<button class="okButton adminButton">Ok</button>');
		if(type === 'error') {
			$header.text('Error');
		}
		var $message = jQuery('<p>'+msg+'</p>');

		$fader.append($container);
		$container.append($header);
		$container.append($message);
		$container.append($okButton);
		
		$fader.appendTo(jQuery('body'));
		$container.css({
			'margin-top': -container.outerHeight()*0.5+'px' 
		});
		
		$okButton.click(function() {
			$fader.remove();
		});
	};
	
	var floater = function(id, title, html, width, top) {
		if(jQuery('#'+id).length > 0) return;
		
		var $container = jQuery('<div id="'+id+'" class="modal floater">');
		var $header = jQuery('<header>');
		var $body = jQuery('<div class="floaterBody">');
		var $title = jQuery('<h2>'+title+'</h2>');
		var $closeButton = jQuery('<button class="closeButton" title="Close">&times;</button>');
		var $message = jQuery(html);

		$header.append($title,$closeButton);
		$body.append($message);
		$container.append($header, $body);
		$container.appendTo(jQuery('body'));
		
		$container.draggable({
			containment: "parent",
			handle: "header"
		});
		$container.css({
			'width': width,
			'left': jQuery('body').width()*0.5 - $container.width()*0.5 + 40,
			'top': top
			
		});
		
		$closeButton.click(function() {
			$container.remove();
		});

	};
	
	
	var confirm = function(msg, title, callback) {
		var $fader = jQuery('<div class="modal fader admin">');
		var $container = jQuery('<div class="container confirm">');
		var $header = jQuery('<h2 class="modalTitle">'+title+'</h2>');
		var $message = jQuery('<p>'+msg+'</p>');
		
		var $yesButton = jQuery('<button class="yesButton adminButton">Yes</button>');
		var $noButton = jQuery('<button class="noButton adminButton">No</button>');
		
		$fader.append($container);
		$container.append($header);
		$container.append($message);
		$container.append($yesButton);
		$container.append($noButton);
		
		$fader.appendTo(jQuery('body'));
		$container.css({
			'margin-top': -container.outerHeight()*0.5+'px' 
		});
		
		$yesButton.click(function() {
			callback();
			$fader.remove();
		});
		
		$noButton.click(function() {
			$fader.remove();
		});
	};
	
	
	var form = function(html, title, callback) {
		var $fader = jQuery('<div class="modal fader admin">');
		var $container = jQuery('<div class="container form">');
		var $header = jQuery('<h2 class="modalTitle">'+title+'</h2>');
		var $content = jQuery(html);
		
		var saveButton = jQuery('<button class="saveButton adminButton">Save</button>');
		var cancelButton = jQuery('<button class="cancelButton adminButton">Cancel</button>');
		
		$fader.append($container);
		$container.append($header);
		$container.append($content);
		$container.append(saveButton);
		$container.append(cancelButton);
		
		$fader.appendTo(jQuery('body'));
		$container.css({
			'margin-top': -container.outerHeight()*0.5+'px' 
		});
		
		saveButton.click(function() {
			callback(html);
			$fader.remove();
		});
		
		cancelButton.click(function() {
			try{resetContentEditingState();}catch(e) {}
			$fader.remove();
		});
		
		setTimeout(function() {
			$container.css({
				'margin-top': -container.outerHeight()*0.5+'px' 
			});
		}, 10);
	};
	
	return {
		notice:notice,
		floater:floater,
		confirm:confirm,
		form:form
	};
}();