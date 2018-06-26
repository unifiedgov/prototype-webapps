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

  if(gup('user-removed')) {

    var gupDecoded = unescape(gup('user-removed'));

    $('.govuk-table').find("tr:contains('" + gupDecoded + "')").remove();

  }

  // Radio options updating a hidden input

  $('[data-catchoption-label] input').on('change', function() {
    var $this = $(this),
        $thisParent = $this.closest('[data-catchoption-label]'),
        $checkedItems = $thisParent.find('input:checked'),
        thisGroupName = $checkedItems.attr('name'),
        listOfValues = '';

    $checkedItems.each(function() {
      var $this = $(this),
          $thisLabel = $this.next('label'),
          labelHasBTag = $thisLabel.find('b').length,
          $thisNextHtmlB = $thisLabel.find('b'), 
          thisLabelText = '';

      if(labelHasBTag) {
        listOfValues += $thisLabel.find('b').text().trim() + '\n';
      } else {
        listOfValues += $thisLabel.text().trim() + '\n';
      }
      
    });

    $('#hiddenCaughtInputs')
      .html('<input type="hidden" name="' + thisGroupName + '-chosen-value" value="' + listOfValues + '">');

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


})
