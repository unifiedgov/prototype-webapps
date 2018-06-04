/* global $ */

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
}

$(document).ready(function () {

  function gup( name )
  {
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if( results == null )
      return null;
    else
      return results[1];
  }

  if(gup('success')) {

    var gupValue = gup('success').replace(/\+/g, ' '),
      gupDecoded = decodeURI(gupValue);

    $('[data-successmessage]').text(gupDecoded);

    $('.success-panel').show();

  }

  $('[data-expanding-radios] input').on('click', function() {
    var $this = $(this),
      thisID = $this.attr('id'),
      $thePanel = $this.closest('.expanding-panel-container').find('.expanding-panel'),
      thePanelTrigger = $thePanel.attr('data-expanded-by');


    if(thisID === thePanelTrigger) {
      $thePanel.show();
    } else {
      $thePanel.hide();
    }

  });

  $('[data-expanding-radios] input:checked').each(function() {
    var $this = $(this),
      thisID = $this.attr('id'),
      $thePanel = $this.closest('.expanding-panel-container').find('.expanding-panel'),
      thePanelTrigger = $thePanel.attr('data-expanded-by');

    if(thisID === thePanelTrigger) {
      $thePanel.show();
    } else {
      $thePanel.hide();
    }
  });

  fileUpload()
  passportPhoto()


  function fileUpload() {
      var input = '.file-upload__input';
    
      $('label span[role=button]').bind('keypress keyup', function(e) {
        if(e.which === 32 || e.which === 13){
          e.preventDefault();
          $(input).click();
        }    
      });

      $(input).change(function(){
        $('.file-upload').addClass('js-hidden')
        $('.photo-guidance').addClass('js-hidden')
        $('.loading').removeClass('js-hidden')
        setTimeout(function(){ 
          $('.file-upload.uploaded').removeClass('js-hidden')
          $('.loading').addClass('js-hidden')
        }, 3000);
      });

  }


  function passportPhoto() {
    $(document).on('click', '.passport-button', function(e) {
      e.preventDefault;
      $('.passport-search').addClass('js-hidden')
      $('.loading').removeClass('js-hidden')
      setTimeout(function(){ 
          $('.passport-photo').removeClass('js-hidden')
          $('.loading').addClass('js-hidden')
        }, 3000);   
    })
  }

  // const countries = [
  //     'France',
  //     'Germany',
  //     'United Kingdom'
  //   ]

    // accessibleAutocomplete({
    //   element: document.querySelector('#local-council-autocomplete-container'),
    //   id: 'local-council-autocomplete', // To match it to the existing <label>.
    //   source: councils
    // })

})
