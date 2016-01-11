/* map rendering logic */
var mapObject = {
	map: null,
	infowindow:null,
	mapcenter: new google.maps.LatLng(48.831483,2.355692),
	mapOptions: { zoom: 5, minZoom: 4, center: new google.maps.LatLng(48.831483,2.355692), zoomControl: true, streetViewControl: false, panControl: false, 
				  	zoomControlOptions: 
					{
				      style: google.maps.ZoomControlStyle.SMALL,
				      position: google.maps.ControlPosition.LEFT_TOP
				    }
		  		},
	init: function()
	{
		this.map = new google.maps.Map(document.getElementById('mapdiv'), this.mapOptions);
		var geomarker = new GeolocationMarker();
		var loc = {};
		if(google.loader.ClientLocation) {
	        loc.lat = google.loader.ClientLocation.latitude;
	        loc.lng = google.loader.ClientLocation.longitude;

	        var latlng = new google.maps.LatLng(loc.lat, loc.lng);
	        geocoder.geocode({'latLng': latlng}, function(results, status) {
	            if(status == google.maps.GeocoderStatus.OK) {
	                alert(results[0]['formatted_address']);
	            };
	        });
	    }
		this.setMainHotel();
		this.addNeighbours();	
	},
	setMainHotel: function()
	{
		var marker = new google.maps.Marker({
		  position: this.mapcenter,
		  map: this.map,
		  icon: 'img/main.png',
		  content:'<b>Hotel Fantastique</b></br>5 star'
		});
		this.markerClick(marker);
		google.maps.event.trigger(marker,'click');
	},
	addNeighbours: function()
	{
		for(var i =0;i<markers.length;i++)
		{
			var mLatlng = new google.maps.LatLng(markers[i].lat,markers[i].lng);
			var marker = new google.maps.Marker({
		    position: mLatlng,
		    map: this.map,
		    icon: markers[i].rating < 3 ? 'img/3star.png' : 'img/'+markers[i].rating+'star.png',
		    content:'<b>'+markers[i].title+'</b></br>'+markers[i].rating+ ' star'
		});
		this.markerClick(marker);
	  }
	},
	markerClick: function(marker)
	{
		var that = this;
		google.maps.event.addListener(marker, 'click', function() 
		{
			if(that.infowindow){that.infowindow.close(); that.infowindow = null;}
			that.infowindow = new google.maps.InfoWindow({
			  content: marker.content
			});
			that.infowindow.open(marker.get('map'), marker);
		});
	}
};
mapObject.init();
/* map logic end */
