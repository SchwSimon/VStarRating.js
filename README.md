# VStarRating.js

5 Star rating js plugin

## Usage

- Configuration

**_VsR.config.setGlobalVoteCallback( [Function] callback )_**  
Set a callback function to trigger on vote if no callback  
is set for the triggered votable star rating.
`callback` receives 3 arguments:  
1. `data` The reference data you set on initating the rating or if given the `data-vote` attribute on the root element  
2. `stars` The amount of stars the client voted (1-5)  
3. `root` The root element of the triggered rating  

- Direct element initiation

**_VsR.initSingle( [Object] config );_**  
Expects an object with the init configuration data as following:  
`target` The element to init VStarRating on  
`stars` The amount of stars to display on this rating 0.00 - 5.00  
`rating` The rating data (Array) containing the amount of votes for each star  
`ratingOrder` The order (String) how to read the rating data.  
`vote` Whether or not this rating is for voting or not
`callback` The callback function to trigger on vote
`callbackData` The data to pass as first argument to the callback function

> For the rating display use either `stars` or `rating`  
> `rating` has priority over `stars`, the `rating` data will conclude to the amount of stars  
> using the `VsR.handlers.calcRating()` function.  
> The default order for the `rating` data is *ascending*, the first array index are the votes for 1 Star  
> If you `rating` data is ordered *descending* pass `"DESC"` as `ratingOrder`.
```js
// read only
VsR.initSingle({
  target: targetElement,
  rating: [1,0,4,6,9],  // 9 are the votes for 1 Star rated (because ratingOrder is set to "DESC")
  ratingOrder: "DESC"   // default: "ASC"
});
VsR.initSingle({
  target: targetElement,
  stars: 3.5  // default: 0
});
```
Both will output 3.5 stars on `targetElement`:  
![3.5 stars](https://raw.githubusercontent.com/SchwSimon/VStarRating.js/master/md/3.5stars.png "3.5 stars rated")

```js
// vote
VsR.initSingle({
  target: targetElement,
  vote: true  // default: false,
  callback: callbackFunction,
  callbackData: {id:bis0rg5az}  // can be anything
});
```

