# VStarRating.js

5 Star rating js plugin

## Usage

- Direct element initiation

**_VsR.initSingle( [Object] config );_**  
Expects an object with the init configuration data as following:  
`target` The element to init VStarRating on  
`stars` The amount of stars to display on this rating  
`rating` The rating data (Array) containing the amount of votes for each star  
`ratingOrder` The order (String) how to read the rating data.  

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
  ratingOrder: "DESC"
});
```
Output on `targetElement`: 
![3.5 stars](https://github.com/SchwSimon/md/3.5stars.png "3.5 stars rated")
