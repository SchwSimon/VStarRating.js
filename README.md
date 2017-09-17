# VStarRating.js

5 Star rating js plugin

## Usage
  
  Quick practical overview how to use
  
### Non votable rating:
```js
VsR.initOn( targetElement, {
  rating: [1,4,2,0,6],  // 9 are the votes for 1 Star rated (because ratingOrder is set to "DESC")
  ratingOrder: "DESC"   // default: "ASC"
});

// ------- OR -------

VsR.initOn( targetElement, {
  stars: 2.5  // default: 0
});

// ------- OR -------

VsR.initPush( targetElement, {
  stars: 2.5
});
VsR.initQueue();  // will init all pushed rating data in the queue

// ------- OR -------

var html = '<div class="VsR" data-stars="3.5"></div>';
html    += '<div class="VsR" data-stars="' + VsR.utils.calcRating( [1,0,4,6,9] ) + '"></div>';
document.body.innerHTML = html;
VsR.initDom();  // will init VsR on all elements with the class "VsR"
                // the class will be removed after init so you can call VsR.initDom()
                // multiples times
```
All will output 2.5 stars on `targetElement`:  
![2.5 stars](https://raw.githubusercontent.com/SchwSimon/VStarRating.js/master/md/2.5stars.png "2.5 stars rated")

### Votable rating:
```js
VsR.initOn( targetElement, {
  vote: true  // default: false,
  callback: myCallback,
  callbackData: {id:bis0rg5az}  // can be anything
});
function myCallback( data, stars, root ) {
  // data: {id:bis0rg5az}
  // stars: the amount stars the client voted
  // root: the root element of the star rating
}

// ------- OR -------

VsR.config.setGlobalVoteCallback( myGlobalCallback ); // set the global vote callback
VsR.initOn( targetElement, {
  vote: true,
  callbackData: {id:bis0rg5az}
});
function myGlobalCallback( data, stars, root ) {}

// ------- OR -------

VsR.config.setGlobalVoteCallback( myGlobalCallback );
document.body.innerHTML = '<div class="VsR" data-vote="id:bis0rg5az"></div>';
VsR.initDom();
function myGlobalCallback( data, stars, root ) {
  // data: The data-vote attribute content
  var id = data.split( ":" )[1]; // bis0rg5az
}

// ------- OR -------

VsR.initPush({...});
VsR.initQueue(); 

```

## Documentation

### Configuration

**_VsR.config.setGlobalVoteCallback( [Function] callback )_**  
Set a callback function to trigger when voted and no callback is set for the triggered rating.
`callback` receives 3 arguments:  
1. `data` The reference data you set on initating the rating or if given the `data-vote` attribute on the root element  
2. `stars` The amount of stars the client voted (1-5)  
3. `root` The root element of the triggered rating  

### Initiation

**_VsR.initOn( [Element] target, [Object] conf )_** Direct initation on element given by the configuation  
**_VsR.initPush( [Element] target, [Object] conf )_** Queue init configurations for later initiation  
  * `target` The target element to init VStarRating on  
  * `conf` The target init configuration data:  
   "stars" The amount of stars to display on this rating 0.00 - 5.00  
   "rating" The rating data (Array) containing the amount of votes for each star  
   "ratingOrder" The order (String) how to read the rating data.  
   "vote Whether" or not this rating is for voting or not  
   "callback" The callback function to trigger on vote  
   "callbackData" The data to pass as first argument to the callback function  

> `rating` has priority over `stars`  
> The default order for the `rating` data is *ascending*, the first array index are the votes for 1 Star  
> If your `rating` data is ordered *descending* pass `"DESC"` as `ratingOrder`.

**_VsR.initQueue()_**  Inits the queue (Queued by `initPush()`)  
> The Queue will be emptied after `initQueue`

**_VsR.initDom()_** Inits all elements in the DOM having the class "VsR"  
> Elements initiated by `initDom()` will no longer have the class "VsR"  
> So `initDom()` can be called multiple times


