(function( global, module ) {
	
	"use strict";
	
	module.data.nodes.doc = global.document;
	
	global.VstarRating = global.VsR = module;
	
})( ( typeof window !== "undefined" ) ? window : this, {
	
	// The data modell
	data: {
		nodes: {
			doc: null, // alias window.document
			singleBinded: {} // the root nodes from voteable ratings initiated by initOn()
		},
		callbacks: {
			gVote: null, // the global vote callback function
			singleBinded: {} // the callback function from voteable ratings initiated by initOn()
		},
		callbackData: {}, // the calback data from voteable ratings initiated by initOn() 
		initQueue: [] // the init configuration queue
	},
	
	// the VstarRating config set functions
	config: {
		/*
		 * set the global vote callback function which will be executed when the client voted and no callback function
		 * is set for the given voteable rating
		 * @param {Function|Null} callback
		 */
		setGlobalVoteCallback: function( callback ) {
			if ( typeof callback === "function" || callback === null ) {
				VstarRating.data.callbacks.gVote = callback;
			}
		}
	},
	
	// Some utility functions VstarRating needs to handle operations
	utils: {
		hasClass: function( n, c ) {
			return n.className.split(" ").indexOf( c ) > -1;
		},
		addClass: function( n, c ) {
			if ( n.className.split(" ").indexOf( c ) < 0 ) {
				n.className += ( n.className === "" ) ? c : " " + c;
			}
		},
		removeClass: function( n, c ) {
			var cList = n.className.split(" ");
			var cIndex = cList.indexOf( c );
			if ( cIndex > -1 ) {
				cList.splice( cIndex, 1 );
				n.className = cList.join(" ");
			}
		},
		uniqId: function() {
			return Math.random().toString(36).substr(2, 9);
		},
		
		/*
		 * Calculates the amount of stars by the given rating data
		 * @param {Array} rating An array containing the amount of votes for each Star
		 * * Example data: [ 4, 20, 10, 15, 9 ]
		 * * If the first index stands for the voted amount for 1 Star, you dont have to pass the second argument
		 * * Else if the first index stands for the voted amount for 5 Stars, pass "DESC" as second argument
		 * @param {String} order "ASC" (index: 0 -> 1 Star) or "DESC" (index: 0 -> 5 Stars)
		 */
		calcRating: function( rating, order ) {
			if ( (order || "ASC").toUpperCase() !== "ASC" ) {
				rating.reverse();
			}
			var a = b = i = 0;
			for( ; i < 5; i++ ) {
				a += (i+1) * rating[i];
				b += rating[i];
			}
			return (a / b).toPrecision( 2 );
		}
	},
	
	/*
	 * VstarRating listeners - only for voteable ratings
	 * - onClick: listens on star click (when the client votes)
	 * - onMouseOut: listens if the mouse leaved a star element
	 * - onMouseOver: listens if the mouse entered a star element
	 */
	listeners: {
		onClick: function( e ) {
			if ( VstarRating.utils.hasClass( e.target, "VsR-star" ) ) {
				VstarRating.handlers.markFinal.call( VstarRating, e.target.parentNode, e.target.className.substr( 4, 1 ) );
			}
		},
		onMouseOut: function( e ) {
			VstarRating.handlers.mark.call( VstarRating, e.target.parentNode, 0 );
		},
		onMouseOver: function( e ) {
			VstarRating.handlers.mark.call( VstarRating, e.target.parentNode, e.target.className.substr( 4, 1 ) );
		}
	},
	
	// VstarRating main functionality handling functions
	handlers: {
		/*
		 * Fills / empties the rating stars depending on which star the client cursor is hovering
		 * @param {Element} root The root element of the rating
		 * @param {Number} stars The amount of stars to be filled
		 */
		mark: function( root, stars ) {
			var nodes = root.childNodes;
			for( var i = 0; i < 5; i++ ) {
				if ( i < stars ) {
					this.utils.addClass( nodes[i], "VsR-star-filled" );
				} else {
					this.utils.removeClass( nodes[i], "VsR-star-filled" );
				}
			}
		},
		
		/*
		 * Final mark the amount of stars voted, removes the listeners and trigger the callback function
		 * @param {Element} root The root element of the rating
		 * @param {Number} stars The amount of stars voted
		 */
		markFinal: function( root, stars ) {
			var skipGlobalVote = false;
			
			if ( root.hasAttribute( "data-vsrid" ) ) {
				var vsrid = root.getAttribute( "data-vsrid" );
				var cData = this.data.callbackData[ vsrid ];
				if ( this.data.callbacks.singleBinded[ vsrid ] ) {
					this.data.callbacks.singleBinded[ vsrid ]( cData, stars, root );
					skipGlobalVote = true;
				}
			}
			
			if ( !skipGlobalVote && typeof this.data.callbacks.gVote === "function" ) {
				this.data.callbacks.gVote( ( cData ) ? cData : root.getAttribute( "data-vote" ), stars, root );
			}
			
			this.handlers.unmount.call( this, root );
			this.handlers.mark.call( this, root, stars );
			for( var i = 0; i < 5; i++ ) {
				root.childNodes[i].setAttribute( "title", "You rated " + stars + " star" + ((stars>1) ? "s" : "") );
			}
		},
		
		/*
		 * Mounts the VstarRating functionality on the given root element
		 * @param {Element} root The root element of the rating
		 * @param {Boolean} isVote Whether or not this rating is voteable
		 * @param {Number} stars The amount of stars voted (for non voteable ratings only)
		 */
		mount: function( root, isVote, stars ) {
			stars = stars || 0;
			
			this.utils.addClass( root, "VsR-rating" );
			
			if ( isVote ) {
				root.addEventListener( "click", this.listeners.onClick, false );
			}
			
			var docFrag = this.data.nodes.doc.createDocumentFragment();
			for( var x = 1, sType = "empty", rating = stars; x <= 5; x++ ) {
				var star = this.data.nodes.doc.createElement( "div" );
				if ( isVote ) {
					var title = "Rate " + x + " Star" + ((x>1) ? "s" : "");
					star.addEventListener( "mouseover", this.listeners.onMouseOver, false );
					star.addEventListener( "mouseout", this.listeners.onMouseOut, false );
				} else {
					var title = rating + " Star" + ((rating>1.24) ? "s" : "") + " Rated";
					sType = ( stars > 0.24 ) ? (( stars < 0.75 ) ? "half" : "filled") : "empty";
					stars--;
				}
				star.setAttribute( "title", title );
				star.className = "VsR-" + x + " VsR-star VsR-star-" + sType;
				docFrag.appendChild( star );
			}
			root.appendChild( docFrag );
		},
		
		/*
		 * Unmounts the VstarRating functionality on the given root element
		 * @param {Element} root The root element of the rating
		 */
		unmount: function( root ) {
			root.removeEventListener( "click", this.listeners.onClick, false );
			
			var stars = root.childNodes;
			for( var i = 0; i < 5; i++ ) {
				stars[i].removeEventListener( "mouseover", this.listeners.onMouseOver, false );
				stars[i].removeEventListener( "mouseout", this.listeners.onMouseOut, false );
			}
			
			if ( root.hasAttribute( "data-vsrid" ) ) {
				var vsrid = root.getAttribute( "data-vsrid" );
				delete this.data.nodes.singleBinded[ vsrid ];
				delete this.data.callbacks.singleBinded[ vsrid ];
				delete this.data.callbackData[ vsrid ];
			} else {
				root.removeAttribute( "data-stars" );
			}
		}

	},
	
	/*
	 * initiates VstarRating on a given target element
	 * @param {Element} target The target element to init VstarRating on
	 * @param {Object} conf The configuration data for the given target element' rating
	 */
	initOn: function( target, conf ) {
		conf = conf || {};
		
		var id = this.utils.uniqId();
		var isVote = conf.vote || false;
		
		var root = this.data.nodes.doc.createElement( "div" );
		if ( isVote ) {
			root.setAttribute( "data-vsrid", id );
			
			this.data.nodes.singleBinded[ id ] = root;
			if ( typeof conf.callback === "function" ) {
				this.data.callbacks.singleBinded[ id ] = conf.callback;
			}
			if ( conf.callbackData ) {
				this.data.callbackData[ id ] = conf.callbackData;
			}
		} else {
			var rating = ( conf.rating ) ? this.utils.calcRating( conf.rating, conf.ratingOrder || "ASC" ) : (conf.stars || 0);
		}
		
		// mount the VsR on the root element
		this.handlers.mount.call(
			this,
			root,
			isVote,
			rating
		);
		
		// append the root element in the given target element
		target.appendChild( root );
	},
	
	/*
	 * pushed data in to the init queue
	 * @param {Element} target The target element to init VstarRating on
	 * @param {Object} conf The configuration data for the given target element' rating
	 */
	initPush: function( target, conf ) {
		this.data.initQueue.push({
			target: target,
			conf: conf
		});
	},
	
	/*
	 * Inits the whole queue
	 */
	initQueue: function() {
		for( var i = 0, len = this.data.initQueue.length; i < len; i++ ) {
			this.initOn( this.data.initQueue[i].target, this.data.initQueue[i].conf );
		}
		this.data.initQueue = [];	// reset the init queue
	},
	
	/*
	 * Inits all elements in the DOM having the class "VsR"
	 */
	initDom: function() {
		var roots = this.data.nodes.doc.querySelectorAll( ".VsR" );
		for( var i = 0, len = roots.length; i < len; i++ ) {
			this.handlers.mount.call( this, roots[i], roots[i].hasAttribute( "data-vote" ), roots[i].getAttribute( "data-stars" ) );
			roots[i].removeAttribute( "data-stars" );
			this.utils.removeClass( roots[i], "VsR" );
		}
	}
	
});