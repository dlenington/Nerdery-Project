const selectedItems = [];

const setRemainingVotes = () => {
    const notVotedYet = localStorage.getItem("voteCount") === null;
    const newCount = notVotedYet ? 3 : 3 - parseInt(localStorage.getItem("voteCount"));
    
    const countLabel = document.getElementById("vote-count-label");
    countLabel.textContent = `${newCount} Votes Remaining`;
}

const setVoteCount = () => {
    var newCount = 0;
    if(localStorage.getItem("voteCount") !== null){
    console.log(parseInt(localStorage.getItem("voteCount")));
     newCount = parseInt(localStorage.getItem("voteCount")) + 1;
   }
   else
    newCount = 1;
    
    localStorage.setItem("voteCount", newCount.toString());
}
 
const handleClick = (item) => {
    console.log(item);
    if(parseInt(localStorage.getItem("voteCount")) >= 3){
        alert("Cannot vote for more than 3 items");
        return;
    }

    if(selectedItems.find(element => element.id === item.id))
    return;

    setVoteCount();
    setRemainingVotes();

    console.log(selectedItems);

    selectedItems.push(item);
    renderSelectedItems();
}

const createIcon = () => {
    const rowIcon = document.createElement("div");
    rowIcon.className = "row-icon";

    const crossIcon = document.createElement("div");
    crossIcon.className = "cross-add-icon";

    const crossIconHorizontal = document.createElement('div');
    crossIconHorizontal.className = "cross-add-icon-horizontal";

    crossIcon.append(crossIconHorizontal);
    rowIcon.append(crossIcon);

    return rowIcon;
}

const createTextContainer = (item) => {
    const rowTextContainer = document.createElement('div');
    rowTextContainer.className = "row-text-container";

    const rowLabel = document.createElement('h4');
    rowLabel.textContent = `${item.product}`;
    rowLabel.className = "hdg_4 row-label";

    const rowCount = document.createElement('div');
    rowCount.textContent = `${item.votes}`;
    rowCount.className = "count-label-dark";

    rowTextContainer.append(rowLabel);
    rowTextContainer.append(rowCount);

    return rowTextContainer;
}
const createTableRow = (item) => {
    const tableRow = document.createElement('div');
    tableRow.className = "table-row";

    const rowIcon = createIcon(item);
    const rowTextContainer = createTextContainer(item);

    tableRow.append(rowIcon);
    tableRow.append(rowTextContainer);

    return tableRow;
}

const createListItem = (item) => {
    const listItem = document.createElement('li');

    const tableRow = createTableRow(item);

    listItem.append(tableRow);
    return listItem;
}

const createSelectedListItem = (item) => {
 const listItem = document.createElement('li');

 const tableRow = document.createElement('div');
 tableRow.className = "table-row-light";

 const textContainer = document.createElement('div');
 textContainer.className = "row-text-container";

 const rowLabel = document.createElement('h4');
 rowLabel.textContent = `${item.product}`;
 rowLabel.className = "hdg_4 row-label";

 const countLabel = document.createElement('div');
 countLabel.textContent = `${item.votes}`;
 countLabel.className = "count-label-dark";

 textContainer.append(rowLabel);
 textContainer.append(countLabel);

 tableRow.append(textContainer);

 listItem.append(tableRow);

 return listItem;
}

const appendToDOM = (items) => {
    // const table = document.querySelector('ul');
    const list = $("#available-items-list");
    console.log(list);

    items.map(item => {
        list.append(createListItem(item));
    });
}


const renderSelectedItems = () => {
    const selectedItemsList = $('#selected-items-list');
    selectedItemsList.html("");

    const selectedItemsCount = document.getElementById('selected-items-count');
    selectedItemsCount.textContent = `${selectedItems.length}`;

    sortAlphaNum(selectedItems);
    console.log(selectedItems);

    selectedItems.map(item => {
        selectedItemsList.append(createSelectedListItem(item));
    })
}

const sortItemsByVoteDesc = (array) => {
    array.sort((a, b) => b.votes - a.votes);
}

const sortAlphaNum = (array) => {
array.sort((a, b) => a.product.localeCompare(b.product, {numeric: true}))
}

const fetchAvailableItems = async () => {
    try {
        const headers = {headers: {'Authorization': 'Bearer 33b55673-57c7-413f-83ed-5b4ae8d18827'}}
        const response = await axios.get('http://localhost:3000/snacks', headers);
        const items = response.data;
        console.log(items);
        sortItemsByVoteDesc(items);
        appendToDOM(items);
    }
    catch (err) {
        alert("Please try again later. We are experiencing server issues.");
        console.log(err);
    }

}

fetchAvailableItems();
renderSelectedItems();
setRemainingVotes();
