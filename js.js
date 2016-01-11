/* Similar hotels logic */
var hotelObject = {
	renderSimilarHotels : function(){
		if(similarHotels.length > 0)
		{
			var similarHotelStr;
			for(var i = 0;i<similarHotels.length;i++)
			{
				var li = document.createElement('li');
				var ptag = document.createElement('p');
				var atag = document.createElement('a');
				atag.href=similarHotels[i].url;
				atag.innerHTML = similarHotels[i].name;
				atag.target = "_blank";
				atag.className = "hotel-name";

				ptag.appendChild(atag);
				li.appendChild(ptag);

				atag = document.createElement('a');
				atag.href=similarHotels[i].url;
				atag.target = "_blank";
				
				var img = document.createElement('img');
				img.src = 'img/'+similarHotels[i].img;
				img.style.border = '0';
				
				atag.appendChild(img);
				li.appendChild(atag);

				atag = document.createElement('a');
				atag.href=similarHotels[i].url;
				atag.target = "_blank";

				ptag = document.createElement('p');
				ptag.className = 'hotel_price';
				ptag.innerHTML = '&euro;'+ similarHotels[i].price + ' <span class="star' + similarHotels[i].rating + '"></span>';

				atag.appendChild(ptag);
				li.appendChild(atag);

				document.getElementById('similar-hotels').appendChild(li);

			}
		}
		else
		{
			document.getElementById('similar-hotels').innerHTML = '<li><b>No SIMILAR HOTELS found.<br>Seems unique in its category. &#9786;</b></li>';
		}
	}
};
hotelObject.renderSimilarHotels();
/* Similar hotels logic end */

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

/* sorting and pagination for reviews */
var reviewObject = 
{
	pageLenth: null,
	currentPage : 1,
	pageLimit: 5,
	filteredReview:[],
	startIndex : 0,
	endIndex : 0,
	resultArrys: [],
	bindReviews : function(review)
	{
		var ul = document.getElementById('reviews_list');
		var li = document.createElement('li');
		li.className = 'one_review';
		var reviewScore = document.createElement('strong');
		reviewScore.className = 'review_score';
		reviewScore.innerHTML = review.reviewScore;
		
		var reviewDesc = document.createElement('blockquote');
		reviewDesc.className = 'review_content';
		reviewDesc.innerHTML = review.reviewContent;
		reviewDesc.innerHTML += '<cite>'+review.author+'</cite>';

		li.appendChild(reviewScore);
		li.appendChild(reviewDesc);
		ul.appendChild(li);
	},
	clearArrays: function(){
		this.filteredReview = [];
		this.resultArrys = [];
	},
	sortReviews : function(sortBy)
	{
		this.clearArrays();
		this.sortKey();
		if(sortBy == '1')
		{
			for(var i=0;i<this.filteredReview.length;i++)
			{
				var reviewScore = this.filteredReview[i];
				this.filterReview(reviewScore);
			}
		}
		else if(sortBy == '0')
		{
			for(var i=this.filteredReview.length-1;i>=0;i--)
			{
				var reviewScore = this.filteredReview[i];
				this.filterReview(reviewScore);
			}
		}
		else
		{
			this.resultArrys = reviewJson;
		}
		this.startIndex = 0;
		this.endIndex = 5;
		this.currentPage = 1;
		this.renderResult();
		
	},
	renderResult: function()
	{
		document.getElementById('reviews_list').innerHTML = '';
		for(var i = this.startIndex;i<this.resultArrys.length && i< this.endIndex;i++)
		{
			this.bindReviews(this.resultArrys[i]);
		}
	},
	filterReview : function(reviewscore)
	{
		for(var i in reviewJson)
		{
			if(reviewJson[i].reviewScore == reviewscore)
			{
				this.resultArrys.push(reviewJson[i]);
			}
		}
	},
	uniqueReviewScore : function(arr)
	{
		this.filteredReview = [];
	    for(var i=0;i<arr.length;i++)
	    {
	    	var num = arr[i];
	    	if(this.filteredReview.indexOf(num) < 0)
    		{
    			this.filteredReview.push(num);
    		}
	    }
	},
	sortNumber: function(a,b)
	{
		return a - b;
	},
	sortKey : function()
	{
		var keys = [];
		for(var i in reviewJson)
		{
			keys.push(Number(reviewJson[i].reviewScore));
		}
		keys = keys.sort(this.sortNumber);
		this.uniqueReviewScore(keys);
	},
	bindPagination: function(){
		var pageLength = reviewJson.length/5;
		if(reviewJson.length%5!=0)
		{
			pageLength+=1;
		}
		for(var i = 1; i<=pageLength;i++)
		{
			var aButton = document.createElement('a');
			aButton.href='javascript:void(0)';
			aButton.innerHTML = i;
			if(i==1)
			{
				aButton.className = 'active';
			}
			aButton.addEventListener('click',this.bindPageEvent);
			document.getElementById('dvPagination').appendChild(aButton);
		}
	},
	bindPageEvent : function(){
		var number = Number(this.innerHTML);
		reviewObject.startIndex = reviewObject.pageLimit * (number - 1);
		reviewObject.endIndex = number * reviewObject.pageLimit;
		reviewObject.currentPage = number;
		reviewObject.renderResult();
		document.querySelector('#dvPagination .active').className = '';
		this.className = 'active';
	}
}
reviewObject.bindPagination();
reviewObject.sortReviews(document.getElementById('ddlReviewOrder').value);
/* sorting and pagination logic end */

/* Image Slider Logic */
var slider = {
	timer:null,
	selectImg: function(e)
	{
		$('.container li[class*="active"]').removeClass('active');	
		var imgLi = $(e.target).parents('li');
		$(imgLi).addClass('active');
		this.setActiveImg();
	},
	setActiveImg: function()
	{
		var img = $('.container li[class*="active"]').find('img').attr('src');
		$('.main_image').find('img').attr('src',img.replace('thumb','large')).fadeOut().fadeIn();
		$('.textshow').html($('.container li[class*="active"]').find('img').attr('alt'));
	},
	moveNext: function()
	{
		var nextImg = $('.container li[class*="active"]').next('li');
		if(nextImg.length==0)
		{
			nextImg = $('.container li:first');
		}
		$('.container li[class*="active"]').removeClass('active');	
		$(nextImg).addClass('active');
		this.setActiveImg();
	},
	movePrev: function()
	{
		var prevImg = $('.container li[class*="active"]').prev('li');
		if(prevImg.length==0)
		{
			prevImg = $('.container li:last');
		}
		$('.container li[class*="active"]').removeClass('active');	
		$(prevImg).addClass('active');
		this.setActiveImg();
	},
	startSlider: function()
	{
		var that = this;
		var imgArr = $('.container').find('img');
		if(this.timer) {clearInterval(this.timer);}
		this.timer = setInterval(function()
		{
			var nextImg = $('.container li[class*="active"]').next('li');
			if(nextImg.length==0)
			{
				nextImg = $('.container li:first');
			}
			$('.container li[class*="active"]').removeClass('active');	
			$(nextImg).addClass('active');
			that.setActiveImg();

		},5000);
	},
	stopSlider: function()
	{
		clearInterval(this.timer);
	},
	init: function(){
		var that = this;
		this.setActiveImg();
		this.startSlider();
		$('.prev').on('click',function()
		{
			that.movePrev();
		});
		$('.next').on('click',function()
		{
			that.moveNext();
		});
		$('.container li img').on('click',function(e)
		{
			that.selectImg(e);
		});
	}
};
slider.init();
/* Image Slider Logic end */
