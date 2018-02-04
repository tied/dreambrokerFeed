function showDBFeed(element, feedElement, numberOfItems, filter, searchString) {

    if (numberOfItems === undefined) numberOfItems = 20;
    if (filter === undefined) filter = "Kaikki";
    if (searchString !== undefined) {
        var searchRe = new RegExp(searchString, 'gi');
    } else {
        searchString = "";
    }

    var dbFeedData = JSON.parse(document.getElementById(feedElement).value);

    // Get the container for the macro's elements and if there are child elements, clear them
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
                showDBFeed(element, feedElement, numberOfItems, select.options[select.selectedIndex].value, input.value);
            } else {
                showDBFeed(element, feedElement, numberOfItems, select.options[select.selectedIndex].value);
            }
            return false;
        }
    };

    var btnSearch = createSearchButton();
    var clearSearchLink = createClearSearchLink();

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
    form.appendChild(btnSearch);
    form.appendChild(input);
    container.appendChild(form);
    container.appendChild(clearSearchLink);
    container.appendChild(document.createElement('br'));

    //add an event listener for the category filter
    select.onchange = function() {
        showDBFeed(element, feedElement, numberOfItems, select.options[select.selectedIndex].value);
    };

    btnSearch.onclick = function() {
        if (input.value != "") {
            showDBFeed(element, feedElement, numberOfItems, select.options[select.selectedIndex].value, input.value);
        } else {
            showDBFeed(element, feedElement, numberOfItems, select.options[select.selectedIndex].value);
        }

    };

    clearSearchLink.onclick = function() {
        if (filter != "") {
            showDBFeed(element, feedElement, numberOfItems, select.options[select.selectedIndex].value);
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
        if (filter == "Kaikki" || filter == "" || filter == entry.category) {
            if (searchString != "") {
                var searchResult = entry.title.match(searchRe);
                if (searchResult != null && searchResult.length > 0) {
                    createThumbnail(entry, thumbnails);
                }
            } else {
                createThumbnail(entry, thumbnails);
            }
        }
    }

    container.appendChild(thumbnails);

    function createThumbnail(entry, tnContainer) {
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

        aText.setAttribute('target', '_blank');
        aText.appendChild(document.createTextNode(entry.title));
        tdThumb.appendChild(p);
        tdThumb.appendChild(aText);
        tdThumb.appendChild(br);
        tdThumb.appendChild(infoText);

        tnContainer.appendChild(tdThumb);
    }

    function createSearchButton() {
        var button = document.createElement('input');
        button.id = "dbSearchButton";
        button.className = 'button';
        button.type = 'button';
        button.value = 'Hae';
        return button;
    }

    function createClearSearchLink() {
        var clearSearchLink = document.createElement('a');
        clearSearchLink.id = "dbClearSearch";
        clearSearchLink.appendChild(document.createTextNode('Tyhjennä haku'));
        return clearSearchLink;
    }

}