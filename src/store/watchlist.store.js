/* only for reference , please follow this syntax for creating other stores */

import { createStore } from 'solid-js/store';

const [watchlist, setWatchlist] = createStore([]);

export default watchlist;

export function setActiveWatchlist(watchlist){
    setWatchlist(watchlist);
}

