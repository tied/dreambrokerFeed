function showDBFeed(element, feedElement, numberOfItems, filter, searchString) {

    if (numberOfItems === undefined) numberOfItems = 20;

    var dbFeedData = JSON.parse(document.getElementById(feedElement).value);

    console.log(dbFeedData);

    // Create DOM elements
    var container = document.getElementById(element);
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    //find all video categories and read them to an array
    var categories = [];

    for (var i = 0; i < dbFeedData.categories.length; i++) {
        if (categories.indexOf(dbFeedData.categories[i].category) === -1) {
            categories.push(dbFeedData.categories[i].category);
        }
    }


    //sort the category array
    categories.sort();

    console.log(categories);

    //create dom elements for category filtering selection
    var form = document.createElement('form');
    form.className = 'aui';

    var labelSearch = document.createElement('label');
    labelSearch.innerText = "Hae videoita: ";
    labelSearch.id = "dbSearchLabel";

    var input = document.createElement('input');
    input.className = 'text';
    input.id = "dbSearchInput";
    if (searchString !== undefined) input.value = searchString;

    //prevent pressing enter key in the search textbox          
    input.onkeydown = function(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            if (input.value != "") {
                parseDBJsonFeed(feedURL, element, numberOfItems, select.options[select.selectedIndex].value, input.value);
            } else {
                parseDBJsonFeed(feedURL, element, numberOfItems, select.options[select.selectedIndex].value);
            }
            return false;
        }
    };

    var button = document.createElement('input');
    button.id = "dbSearchButton";
    button.className = 'button';
    button.type = 'button';
    button.value = 'Hae';

    var clearSearchLink = document.createElement('a');
    clearSearchLink.id = "dbClearSearch";
    clearSearchLink.appendChild(document.createTextNode('Tyhjennä haku'));
    clearSearchLink.onclick = function() {
        if (filter != "") {
            parseDBJsonFeed(feedURL, element, numberOfItems, select.options[select.selectedIndex].value)
        }
    };

    var select = document.createElement('select');
    select.className = 'select';
    var labelCategory = document.createElement('label');
    labelCategory.innerText = 'Valitse kategoria: ';
    var option = document.createElement('option');
    option.setAttribute('value', 'Kaikki');
    option.innerHTML = 'Kaikki';
    select.appendChild(option);

    //populate the select dropdown with categories
    for (var i = 0; i < categories.length; i++) {
        option = document.createElement('option');
        option.setAttribute('value', categories[i]);
        if (filter == categories[i]) {
            option.setAttribute('selected', 'selected');
        }
        option.innerHTML = categories[i];
        select.appendChild(option);
    }

    //add the category filtering elements to our container
    form.appendChild(labelCategory);
    form.appendChild(labelSearch);
    form.appendChild(document.createElement('br'));
    form.appendChild(select);
    form.appendChild(button);
    form.appendChild(input);
    container.appendChild(form);
    container.appendChild(clearSearchLink);
    container.appendChild(document.createElement('br'));

    //add an event listener for the category filter
    select.onchange = function() {
        parseDBJsonFeed(feedURL, element, numberOfItems, select.options[select.selectedIndex].value)
    };
    button.onclick = function() {
        if (input.value != "") {
            parseDBJsonFeed(feedURL, element, numberOfItems, select.options[select.selectedIndex].value, input.value);
        } else {
            parseDBJsonFeed(feedURL, element, numberOfItems, select.options[select.selectedIndex].value);
        }

    };

    thumbnails = document.createElement('div');

    if (filter != "" || filter != "Kaikki") {
        var filterHeadline = document.createElement('h2');
        filterHeadline.appendChild(document.createTextNode(filter));
        thumbnails.appendChild(filterHeadline);
    }

    for (var i = 0; i < dbFeedData.items.length && thumbnails.childElementCount <= numberOfItems; i++) {
        var entry = dbFeedData.items[i];
        //console.log(filter);
        if (filter == "Kaikki" || filter == "" || filter == entry.category) {
            var tdThumb = document.createElement('div');
            tdThumb.className = 'dbThumbnail';

            var aImg = document.createElement('a');
            var aText = document.createElement('a');
            var imgThumb = document.createElement('img');
            var p = document.createElement('p');
            var br = document.createElement('br');
            var infoText = document.createTextNode(entry.duration)

            imgThumb.setAttribute('src', entry.thumbnail);
            aImg.setAttribute('href', entry.link);
            aText.setAttribute('href', entry.link);
            aImg.setAttribute('target', '_blank');
            aImg.appendChild(imgThumb);
            tdThumb.appendChild(aImg);

            //info text TD cell
            aText.setAttribute('target', '_blank');
            aText.appendChild(document.createTextNode(entry.title));
            tdThumb.appendChild(p);
            tdThumb.appendChild(aText);
            tdThumb.appendChild(br);
            tdThumb.appendChild(infoText);

            //add TDs to TR
            thumbnails.appendChild(tdThumb);
        }
    }

    container.appendChild(thumbnails);
}