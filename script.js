var page = 1;
var totalPages = 0;
var buttons = '#button';

var api = {
    "async": true,
    "crossDomain": true,
    "url": `https://streaming-availability.p.rapidapi.com/search/ultra?country=us&services=netflix%2Chulu%2Cprime%2Cdisney%2Chulu%2Capple&type=movie&order_by=year&year_min=2000&year_max=2022&page=${page}&genres=80%2C53%2C35%2C28%2C12%2C14%2C16&genres_relation=or&desc=true&language=en&min_imdb_rating=70&max_imdb_rating=90&min_imdb_vote_count=10000&max_imdb_vote_count=1000000&output_language=en`,
    "method": "GET",
    "headers": {
        "X-RapidAPI-Key": "dda6d06c29msh1eb4baff5cea14ep1bf5acjsn07a454014447",
        "X-RapidAPI-Host": "streaming-availability.p.rapidapi.com"
    }
};

function apiCall() {
    $.ajax(api).done(function(response) {
        let contents = format(JSON.parse(response));
        display(contents, 0);
    })
}

function display(contents, index) {
    let movie = contents[index];
    $('#test').html(`index: ${index} | content size: ${contents.length} | page: ${page} | total pages: ${totalPages}`);
    $('#banner').html(movie.title);
    $('#description').html(movie.description);
    $('#cast').html(`Starring: ${movie.cast.toString()}`);
    $('#director').html(`Directed by: ${movie.directed.toString()}`);
    $('#runtime').html(`Runtime: ${movie.runtime} minutes`);
    $('#poster').html(`<img src="${movie.posterURL}">`);
    $('#watch').html(`Watch Now on ${movie.service}`);
    $('#watch').on('click', function(){ window.open(movie.URL)})
    $('#button').css({'top':'5%', 'left':'85%', 'right':'auto'});
    $('#button').html('Next');
    $('#button').on("click", function() {
        $('#button').css('opacity','0');
        $('#watch').off('click');
        if(index < contents.length) { display(contents, ++index);}
        else { page++; apiCall(); }
    });
    animate();
}

function format(response) {
    totalPages = response.total_pages;
    const contents = [];
    for(let i = 0; i < response.results.length; i++)
    {
        let streamInfo = streamingInfo(response.results[i].streamingInfo);
        const movie = {
            posterURL: response.results[i].posterURLs["500"],
            title: response.results[i].originalTitle,
            cast: response.results[i].cast,
            description: response.results[i].overview,
            directed: response.results[i].significants,
            runtime: response.results[i].runtime,
            URL: streamInfo.url,
            service: streamInfo.provider
        }
        contents.push(movie);
    }
    return contents;
}

function streamingInfo(streamingInfo) {
    if(streamingInfo.hasOwnProperty('hulu')) { return { url: streamingInfo.hulu.us.link, provider: 'Hulu'}; }
    if(streamingInfo.hasOwnProperty('netflix')) { return { url: streamingInfo.netflix.us.link, provider: 'Netflix'}; }
    if(streamingInfo.hasOwnProperty('prime')) { return { url: streamingInfo.prime.us.link, provider: 'Amazon Prime'}; }
    if(streamingInfo.hasOwnProperty('disney')) { return { url: streamingInfo.disney.us.link, provider: 'Disney+'}; }
    if(streamingInfo.hasOwnProperty('apple')) { return { url: streamingInfo.apple.us.link, provider: 'Apple TV+'}; }
}

function animate() {
    let banner = document.getElementById('banner');
    banner.innerHTML = banner.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

    anime.timeline()
    .add({
        targets: '#banner .letter',
        scale: [4,1],
        opacity: [0,1],
        translateZ: 0,
        easing: "easeOutExpo",
        duration: 950,
        delay: (el, i) => 70*i
    })
    .add({
        targets: `${buttons}`,
        delay: 1000,
        opacity:[0,1]
    });
}

function start() {
    animate();
    buttons = 'button';
    $('#button').on("click", function() { $('#button').off("click"); apiCall();});
}

window.addEventListener("load", start, false);