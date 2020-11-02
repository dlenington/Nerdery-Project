const selectedItems = [];

const setRemainingVotes = () => {
    const notVotedYet = localStorage.getItem("voteCount") === null;
    const newCount = notVotedYet ? 3 : 3 - parseInt(localStorage.getItem("voteCount"));
    
    const countLabel = document.getElementById("vote-count-label");
    countLabel.textContent = `${newCount} Votes Remaining`;
}

const setUserVoteCount = () => {
    var newCount = 0;
    if(localStorage.getItem("voteCount") !== null){
    console.log(parseInt(localStorage.getItem("voteCount")));
     newCount = parseInt(localStorage.getItem("voteCount")) + 1;
   }
   else
    newCount = 1;
    
    localStorage.setItem("voteCount", newCount.toString());
}

const updateItemVotes = async (item) => {
    try {
        console.log("entered");
        const headers = {headers: {'Authorization': 'Bearer 33b55673-57c7-413f-83ed-5b4ae8d18827'}}
        const response = await axios.post(`http://localhost:3000/snacks/vote/${item.id}`, {}, headers);
        return response.data.votes;
    } catch (error) {
        console.log("Error updating item count on server", error);
    }
}

const setItemVoteCount = async (item) => {
    const updatedCount = await updateItemVotes(item);
    
    const countLabel = document.getElementById(`count-label-${item.id}`);
//    const newVoteCount = parseInt(countLabel.textContent) + 1;
   countLabel.textContent = updatedCount.toString();

}


 
const handleClick = (item) => {
    console.log(item);
    if(parseInt(localStorage.getItem("voteCount")) >= 3){
        alert("Cannot vote for more than 3 items");
        return;
    }

    if(selectedItems.find(element => element.id === item.id))
    return;

    setUserVoteCount();
    setItemVoteCount(item);
    setRemainingVotes();
    selectedItems.push(item);
    renderSelectedItems();
}

const createIconButton = (item, index) => {
    const button = document.createElement("button");
    button.className = "table-button";
    button.onclick = function(){
        handleClick(item);
    };

    const rowIcon = document.createElement("div");
    rowIcon.className = "row-icon";
    rowIcon.className = index % 2 === 0 ? "row-icon-dark" : "row-icon-light";

    const crossIcon = document.createElement("div");
    crossIcon.className = "cross-add-icon";

    const crossIconHorizontal = document.createElement('div');
    crossIconHorizontal.className = "cross-add-icon-horizontal";

    crossIcon.append(crossIconHorizontal);
    rowIcon.append(crossIcon);
    button.append(rowIcon);
    
    return button;
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
    rowCount.setAttribute("id", `count-label-${item.id}`);

    rowTextContainer.append(rowLabel);
    rowTextContainer.append(rowCount);

    return rowTextContainer;
}

const createTableRow = (item, index) => {
    const tableRow = document.createElement('div');
    tableRow.className = index % 2 === 0 ? "table-row" : "table-row-light";

    const rowIcon = createIconButton(item, index);
    const rowTextContainer = createTextContainer(item);

    tableRow.append(rowIcon);
    tableRow.append(rowTextContainer);

    return tableRow;
}

const createListItem = (item, index) => {
    const listItem = document.createElement('li');
    const tableRow = createTableRow(item, index);

    listItem.append(tableRow);
    return listItem;
}

const createSelectedListItem = (item) => {
 const listItem = document.createElement('li');

 const tableRow = document.createElement('div');
 tableRow.className = "table-row-no-bg-color";

 const textContainer = document.createElement('div');
 textContainer.className = "row-text-container";

 const rowLabel = document.createElement('h4');
 rowLabel.textContent = `${item.product}`;
 rowLabel.className = "hdg_4 row-label";

 const countLabel = document.createElement('div');
 countLabel.textContent = `${item.votes + 1}`;
 countLabel.className = "count-label-dark";
 

 textContainer.append(rowLabel);
 textContainer.append(countLabel);

 tableRow.append(textContainer);

 listItem.append(tableRow);

 return listItem;
}

const appendToDOM = (items) => {
    const list = $("#available-items-list");
    console.log(list);

    const availableItemsLabel = document.getElementById("available-items-label");
    availableItemsLabel.textContent = items.length;

    items.map((item, index) => {
        list.append(createListItem(item, index));
    });
}


const renderSelectedItems = () => {
    const selectedItemsList = $('#selected-items-list');
    selectedItemsList.html("");

    const selectedItemsCount = document.getElementById('selected-items-count');
    selectedItemsCount.textContent = `${selectedItems.length}`;

    sortAlphaNum(selectedItems);

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
        alert("Web maintentance in progress. Please try again later.");
        console.log(err);
    }

}

fetchAvailableItems();
renderSelectedItems();
setRemainingVotes();
