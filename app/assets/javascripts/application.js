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
        "Merthyr",
        "Powys",
        "Newport",
        "Monmouthshire",
        "Torfaen",
        "Blaenau Gwent",
        "Caerphilly",
        "Rhondda-Cynon-Taff",
        "Cardiff",
        "Vale of Glamorgan",
        "Bridgend",
        "Neath-porttalbot",
        "Swansea",
        "Carmarthenshire",
        "Pembrokeshire",
        "Ceredigion",
        "Wrexham",
        "Flintshire",
        "Denbighshire",
        "Conwy",
        "Gwynedd ",
        "Anglesey",
        "Glasgow City Council",
        "East Dunbartonshire Council",
        "North Lanarkshire",
        "Dundee City Council",
        "Angus Council",
        "West Lothian Council",
        "West Dunbartonshire Council",
        "Renfrewshire Council",
        "Edinburgh City Council",
        "Argyll and Bute Council",
        "Aberdeenshire Council",
        "Aberdeen City Council",
        "Stirling Council",
        "South Lanarkshire Council",
        "South Ayrshire Council",
        "Shetland Islands Council",
        "Scottish Borders Council",
        "Perth and Kinross Council",
        "Orkney Islands Council",
        "North Ayrshire Council",
        "Moray Council",
        "Midlothian Council",
        "Inverclyde Council",
        "Highland Council",
        "Fife Council",
        "Falkirk Council",
        "Eilean Siar",
        "East Renfrewshire Council",
        "East Lothian District Council",
        "East Ayrshire Council",
        "Dumfries and Galloway Council",
        "Clackmannanshire Council",
        "Westminster",
        "Wandsworth",
        "Waltham Forest",
        "Tower Hamlets",
        "Sutton",
        "Southwark",
        "Richmond upon Thames",
        "Redbridge",
        "Newham",
        "Merton",
        "Lewisham",
        "Lambeth",
        "Kingston upon Thames",
        "Kensington and Chelsea",
        "Islington",
        "Hounslow",
        "Hillingdon",
        "Havering",
        "Harrow",
        "Haringey",
        "Hammersmith and Fulham",
        "Hackney",
        "Greenwich",
        "Enfield",
        "Ealing",
        "Croydon",
        "Camden",
        "Bromley",
        "Brent",
        "Bexley",
        "Barnet",
        "Barking and Dagenham",
        "City of London",
        "Gateshead",
        "Wakefield",
        "Leeds",
        "Kirklees",
        "Calderdale",
        "Bradford",
        "Wolverhampton",
        "Walsall",
        "Solihull",
        "Sandwell",
        "Dudley",
        "Coventry",
        "Birmingham",
        "Sunderland",
        "South Tyneside",
        "North Tyneside",
        "Newcastle",
        "Sheffield",
        "Rotherham",
        "Doncaster",
        "Barnsley",
        "Wirral",
        "Sefton",
        "St. Helens",
        "Liverpool",
        "Knowsley",
        "Wigan",
        "Trafford",
        "Tameside",
        "Stockport",
        "Salford",
        "Rochdale",
        "Oldham",
        "Manchester",
        "Bury",
        "Bolton",
        "Worcestershire",
        "Warwickshire",
        "Cambridgeshire",
        "Northumberland",
        "Central Bedfordshire",
        "Bedford",
        "Wiltshire",
        "Isles of Scilly",
        "Cornwall",
        "Shropshire",
        "Cheshire West and Chester",
        "Cheshire East",
        "Durham",
        "Isle of Wight",
        "Southampton",
        "Portsmouth",
        "Brighton and Hove City",
        "Milton Keynes",
        "Wokingham",
        "Windsor & Maidenhead",
        "Slough",
        "Reading",
        "West Berkshire",
        "Bracknell Forest",
        "Medway Towns",
        "Thurrock",
        "Southend",
        "Luton",
        "Peterborough",
        "Swindon",
        "Poole",
        "Bournemouth",
        "Torbay",
        "Plymouth",
        "South Gloucestershire",
        "North Somerset",
        "Bristol",
        "Bath & NE Somerset",
        "Stoke-on-Trent",
        "Telford and the Wrekin",
        "Herefordshire",
        "Nottingham",
        "Rutland",
        "Leicester",
        "Derby",
        "York",
        "North Lincolnshire",
        "North East Lincolnshire",
        "East Riding of Yorkshire",
        "Blackpool",
        "Blackburn with Darwen",
        "Warrington",
        "Halton",
        "Darlington",
        "Stockton",
        "Redcar & Cleveland",
        "Middlesbrough",
        "Hartlepool",
        "Buckinghamshire",
        "Cumbria",
        "Derbyshire",
        "Devon",
        "Dorset",
        "East Sussex",
        "Essex",
        "Gloucestershire",
        "Hampshire",
        "Hertfordshire",
        "Hull",
        "Kent",
        "Lancashire",
        "Leicestershire",
        "Lincolnshire",
        "Norfolk",
        "North Yorkshire",
        "Northamptonshire",
        "Northern Ireland ",
        "Nottinghamshire",
        "Oxfordshire",
        "Somerset",
        "Staffordshire",
        "Suffolk",
        "Surrey",
        "West Sussex"
      ]
      councils.sort()

    accessibleAutocomplete({
      element: document.querySelector('#local-council-autocomplete-container'),
      id: 'local-council-autocomplete', // To match it to the existing <label>.
      source: councils
    })

})
