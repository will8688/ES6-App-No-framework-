'use strict';
class hotels {
	constructor(){
		this.hotels = {};
	    this.filterNames = [];
	    this.sortNames = [];
	    const loadHotels = this.loadHotels();
	    loadHotels.then( () => {
	    	const loadFilter = this.loadFilter();
	    	loadFilter.then( () => {
		    	this.render();
		    	
	    	});
	    });
	    
	}
	loadFilter(){

	    return new Promise((resolve, reject) => {
	       		const xhttp = new XMLHttpRequest();
			    xhttp.onreadystatechange = (args) => {
			      if (xhttp.readyState == 4 && xhttp.status == 200) {
			         const response = JSON.parse(xhttp.responseText);
			         this.filterNames = response.filterConfig;
			         this.sortNames = response.sortConfig;
			         resolve(response);
			      }
			    };
			    xhttp.open('GET', 'filterconfig.json', true);
			    xhttp.send();           
	        }
	    );
	}
	loadHotels(){
		return new Promise((resolve, reject) => {
	       		const xhttp = new XMLHttpRequest();
			    xhttp.onreadystatechange = (args) => {
			      if (xhttp.readyState == 4 && xhttp.status == 200) {
			         const response = JSON.parse(xhttp.responseText);
			         this.hotels = response.Establishments;
			         this.hotelsReset = response.Establishments;
			         resolve(this.hotels);
			      }
			    };
			    xhttp.open('GET', 'hotels.json', true);
			    xhttp.send();           
	        }
	    );
		
	}
	sortHotels(query,name){
		if(query == 'Down'){
			this.hotels = this.hotels.sort((a, b) => {
			    return a[name] - b[name];
			});
		}else{
			this.hotels = this.hotels.sort((a, b) => {
		    return  b[name] - a[name];
			});
		}
		this.render();
	}
	searchHotels(query){
		this.hotels = this.hotels.filter((el) => {
	     return el['Name'].toLowerCase().indexOf(query.toLowerCase()) !== -1 ;
		});

	    this.render();
	}
	filterHotels(query, name){
		if(name == 'MinCost'){
			this.hotels = this.hotels.filter((el) => {
		     return el['MinCost'] <= query;
			});
		}else{
			this.hotels = this.hotels.filter((el) => {
		     return el[name] == query;
			});
		}
		

	    this.render();
	}

	view(){
			this.Hotelsmarkup = `

	        ${this.hotels.map(hotel => `<div class="col-xs-6 col-sm-3 placeholder">
              <img src="${hotel.ThumbnailUrl}" width="100" height="100" class="img-responsive" alt="Generic placeholder thumbnail">
              <h3>${hotel.Name}</h3>
              <h4>${hotel.Location}</h4>
              <span class="text-muted">${hotel.Stars} Star</span><br/>
              <span>${hotel.UserRating} out of 10! ${hotel.UserRatingTitle}... </span><br/>
              <div>£${hotel.MinCost} < </div>
              
            </div>`)}

	    `;

	    this.HotelsFiltermarkup = `

	    <ul class="filter" >
	        ${this.filterNames.map(filter => `<li><h3>${filter.Name}</h3>

	        	${filter.options.map(option => `<a href="#" class="js-filter" data-name="${filter.Name}" data-filter="${option}">${option}</a>`)}

	        	</li>`)}
	    </ul>
	    `;
	    this.HotelsSortmarkup = `

	        ${this.sortNames.map(sort => `<span>${sort.Name}

	        	${sort.options.map(option => `<a href="#" class="js-sort" data-name="${sort.Name}" data-filter="${option}">${option}</a> `)}

	        	</span>`)}
	    `;
	    this.Hotelsmarkup = this.Hotelsmarkup.replace(/[\[\],]+/g, '');
	    this.HotelsFiltermarkup = this.HotelsFiltermarkup.replace(/[\[\],]+/g, '');
	    this.HotelsSortmarkup = this.HotelsSortmarkup.replace(/[\[\],]+/g, '');
	}
	render(){
		this.view();
	    document.getElementById('js-hotels').innerHTML = '';
	    document.getElementById('js-hotels').innerHTML = this.Hotelsmarkup;
	    document.getElementById('js-filter').innerHTML = this.HotelsFiltermarkup;
	    document.getElementById('js-sort').innerHTML = this.HotelsSortmarkup;
	    this.attachEventListeners();
	}
	attachEventListeners(){
	    const filterelements = document.querySelectorAll('.js-filter');
	    if(filterelements){
	      filterelements.forEach((el) => {
	      		el.addEventListener('click', (e) => {
	      			this.resetHotels();
			        const query = e.target.attributes['data-filter'].nodeValue;
			        const name = e.target.attributes['data-name'].nodeValue;
			        this.filterHotels(query, name);
			     });
	      })
	    }
	    const sortelements = document.querySelectorAll('.js-sort');
	    if(sortelements){
	      sortelements.forEach((el) => {
	      		el.addEventListener('click', (e) => {
	      			this.resetHotels();
			        const query = e.target.attributes['data-filter'].nodeValue;
			        const name = e.target.attributes['data-name'].nodeValue;
			        this.sortHotels(query, name);
			     });
	      })
	    }
	    const search = document.getElementById('js-search');
	    const searchText = document.getElementById('js-search-text');
	    search.addEventListener('keydown', (e) => {
	    	this.resetHotels();
	    	if (e.keyCode == 13) {
		    	const query = searchText.value;
		    	this.searchHotels(query);
	    	}
		});
	    const menu = document.getElementById('js-menu');
	    menu.addEventListener('click', (e) => {
	      	const sidebar = document.getElementById('js-sidebar');
	      	sidebar.style.display = 'block';
		});

	  }
	  resetHotels(){
	  	this.hotels = this.hotelsReset;
	  }
}
const singleton = new hotels();