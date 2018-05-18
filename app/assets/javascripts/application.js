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

  const councils = [
        'Birmingham City Council',
        'Borough Council of King\'s Lynn and West Norfolk',
        'Greater London Authority',
        'Worthing Borough Council',
        'Mid Sussex District Council',
        'Horsham District Council',
        'Crawley Borough Council',
        'Chichester District Council',
        'Arun District Council',
        'Adur District Council',
        'West Sussex County Council',
        'Wyre Forest District Council',
        'Wychavon District Council',
        'Worcester City Council',
        'Redditch Borough Council',
        'Malvern Hills District Council',
        'Bromsgrove District Council',
        'Worcestershire County Council',
        'Warwick District Council',
        'Stratford-on-Avon District Council',
        'Rugby Borough Council',
        'Nuneaton and Bedworth Borough Council',
        'North Warwickshire Borough Council',
        'Warwickshire County Council',
        'Tamworth Borough Council',
        'Staffordshire Moorlands District Council',
        'Stafford Borough Council',
        'South Staffordshire Council',
        'Newcastle-under-Lyme Borough Council',
        'Lichfield District Council',
        'East Staffordshire Borough Council',
        'Cannock Chase District Council',
        'Staffordshire County Council',
        'Woking Borough Council',
        'Waverley Borough Council',
        'Tandridge District Council',
        'Surrey Heath Borough Council',
        'Spelthorne Borough Council',
        'Runnymede Borough Council',
        'Reigate and Banstead Borough Council',
        'Mole Valley District Council',
        'Guildford Borough Council',
        'Epsom and Ewell Borough Council',
        'Elmbridge Borough Council',
        'Surrey County Council',
        'West Somerset District Council',
        'Taunton Deane Borough Council',
        'South Somerset District Council',
        'Sedgemoor District Council',
        'Mendip District Council',
        'Somerset County Council',
        'Waveney District Council',
        'Suffolk Coastal District Council',
        'St Edmundsbury Borough Council',
        'Mid Suffolk District Council',
        'Ipswich Borough Council',
        'Forest Heath District Council',
        'Babergh District Council',
        'Suffolk County Council',
        'West Oxfordshire District Council',
        'Vale of White Horse District Council',
        'South Oxfordshire District Council',
        'Oxford City Council',
        'Cherwell District Council',
        'Oxfordshire County Council',
        'Selby District Council',
        'Scarborough Borough Council',
        'Ryedale District Council',
        'Richmondshire District Council',
        'Harrogate Borough Council',
        'Hambleton District Council',
        'Craven District Council',
        'North Yorkshire County Council',
        'Rushcliffe Borough Council',
        'Newark and Sherwood District Council',
        'Mansfield District Council',
        'Gedling Borough Council',
        'Broxtowe Borough Council',
        'Bassetlaw District Council',
        'Ashfield District Council',
        'Nottinghamshire County Council',
        'Wellingborough Borough Council',
        'South Northamptonshire Council',
        'Northampton Borough Council',
        'Kettering Borough Council',
        'East Northamptonshire Council',
        'Daventry District Council',
        'Corby Borough Council',
        'Northamptonshire County Council',
        'South Norfolk District Council',
        'Norwich City Council',
        'North Norfolk District Council',
        'Great Yarmouth Borough Council',
        'Broadland District Council',
        'Breckland District Council',
        'Norfolk County Council',
        'West Lindsey District Council',
        'South Kesteven District Council',
        'South Holland District Council',
        // London Borough Councils
        'Barnet Council',
        'Bexley Council',
        'Brent Council',
        'Bromley Council',
        'Camden Council',
        'City of London Council',
        'City of Westminster Council',
        'Croydon Council',
        'Ealing Council',
        'Enfield Council',
        'Greenwich Council',
        'Hackney Council',
        'Hammersmith and Fulham Council',
        'Haringey Council',
        'Harrow Council',
        'Havering Council',
        'Hillingdon Council',
        'Hounslow Council',
        'Islington Council',
        'Kensington and Chelsea Council',
        'Kingston Council',
        'Lambeth Council',
        'Lewisham Council',
        'Merton Council',
        'Newham Council',
        'Redbridge Council',
        'Richmond Council',
        'Southwark Council',
        'Sutton Council',
        'Tower Hamlets Council',
        'Waltham Forest Council',
        'Wandsworth Council'
      ]
      councils.sort()

    accessibleAutocomplete({
      element: document.querySelector('#local-council-autocomplete-container'),
      id: 'local-council-autocomplete', // To match it to the existing <label>.
      source: councils
    })

})
