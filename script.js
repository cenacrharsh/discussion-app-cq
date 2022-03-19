//# Fetching HTML Nodes
const questionSubmitBtnNode = document.getElementById(
  "right-div-question-form-items-submit"
);
const leftDivQuesPanelNode = document.getElementById("left-div-question-panel");
const questionSubjectNode = document.getElementById("question-subject");
const questionDescriptionNode = document.getElementById("question-description");
const rightDivQuesFormNode = document.getElementById("right-div-question-form");
const rightDivResponseFormNode = document.getElementById(
  "right-div-question-resolve-form"
);
const rightDivQuesPanelNode = document.getElementById(
  "right-div-question-panel"
);
const upvoteBtnNode = document.getElementById("upvoteBtn");
const downvoteBtnNode = document.getElementById("downvoteBtn");
const resolveBtnNode = document.getElementById("resolveBtn");
const responseNode = document.getElementById("response");
const addResponseNode = document.getElementById("add-response");
const addCommentBtnNode = document.getElementById("addCommentBtn");
const commentorNameNode = document.getElementById("commentorName");
const commentDescriptionNode = document.getElementById("commentDescription");
const rightDivResponsePanelNode = document.getElementById(
  "right-div-response-panel"
);
const newQuesFormBtnNode = document.getElementById("newQuesFormBtn");
const searchQuesNode = document.getElementById("searchQues");

//! display all exixting questions stored in local storage
function onLoad() {
  //* get all ques from local storage
  getAllQuesFromServer(function (allQuesStoredInServer) {
    //* sort all ques aq to upvotes
    allQuesStoredInServer = allQuesStoredInServer.sort(function (
      currentQues,
      nextQues
    ) {
      if (currentQues.upvotes > nextQues.upvotes) {
        return -1;
      }

      return 1;
    });

    //* sort all ques aq to favourite
    allQuesStoredInServer = allQuesStoredInServer.sort(function (
      currentQues,
      nextQues
    ) {
      if (currentQues.isFavourite) {
        return -1;
      }

      return 1;
    });

    //* add all ques to left div ques panel
    allQuesStoredInServer.forEach(function (question) {
      appendQuesToLeftDivQuesPanel(question);
    });
  });
}

onLoad();

//! listen for click on new ques form btn
newQuesFormBtnNode.addEventListener("click", newQuesFormHandler);

function newQuesFormHandler() {
  hideResponseForm();
  displayQuestionForm();
}

//! listen to value change on search question input
searchQuesNode.addEventListener("keyup", function (event) {
  filterQues(event.target.value);
});

//! filter result according to search text
function filterQues(searchText) {
  getAllQuesFromServer(function (allQuesStoredInServer) {
    clearLeftDivQuesPanel();

    if (searchText) {
      let filteredQues = allQuesStoredInServer.filter(function (ques) {
        if (ques.subject.includes(searchText)) {
          return true;
        }
      });

      if (filteredQues.length) {
        filteredQues.forEach(function (ques) {
          appendQuesToLeftDivQuesPanel(ques);
        });
      } else {
        printNoMatchFound();
      }
    } else {
      allQuesStoredInServer.forEach(function (ques) {
        appendQuesToLeftDivQuesPanel(ques);
      });
    }
  });
}

//! listen for click event on question submit button to create a question
questionSubmitBtnNode.addEventListener("click", questionSubmitHandler);

function questionSubmitHandler(event) {
  event.preventDefault();

  let question = {
    id: generateUniqueId(),
    subject: questionSubjectNode.value,
    description: questionDescriptionNode.value,
    responses: [],
    upvotes: 0,
    downvotes: 0,
    createdAt: Date.now() /* for time in ms */,
    isFavourite: false,
  };

  if (question.subject !== "" && question.description !== "") {
    addNewQuesInServer(question, function () {
      appendQuesToLeftDivQuesPanel(question);
      clearRightDivQuesForm();
    });
  }
}

//! append question to left div question panel
function appendQuesToLeftDivQuesPanel(question) {
  const quesDivNode = document.createElement("div");
  quesDivNode.setAttribute("id", question.id);
  quesDivNode.setAttribute("class", "dynamicNodeQues");

  const quesHeadingNode = document.createElement("div");
  quesHeadingNode.setAttribute("id", "quesHeadingNode");

  const quesSubjectNode = document.createElement("h3");
  quesSubjectNode.innerHTML = question.subject;
  quesHeadingNode.appendChild(quesSubjectNode);

  const favIconNode = document.createElement("i");
  favIconNode.setAttribute("class", "fas fa-star fa-2x icon");
  quesHeadingNode.appendChild(favIconNode);

  quesDivNode.appendChild(quesHeadingNode);

  const quesDescriptionNode = document.createElement("p");
  quesDescriptionNode.innerHTML = question.description;
  quesDivNode.appendChild(quesDescriptionNode);

  const quesUpvotesNode = document.createElement("p");
  quesUpvotesNode.innerHTML = "Upvotes: " + question.upvotes;
  quesDivNode.appendChild(quesUpvotesNode);

  const quesDownvotesNode = document.createElement("p");
  quesDownvotesNode.innerHTML = "Downvotes: " + question.downvotes;
  quesDivNode.appendChild(quesDownvotesNode);

  const createdAtNode = document.createElement("p");
  createdAtNode.innerHTML =
    "Created At: " + new Date(question.createdAt).toLocaleString();
  quesDivNode.appendChild(createdAtNode);

  const timestampNode = document.createElement("p");
  timestampNode.innerHTML =
    "Created: " +
    updateAndConvertTime(timestampNode)(question.createdAt) +
    " ago ";
  quesDivNode.appendChild(timestampNode);

  const addToFavouriteNode = document.createElement("button");
  if (question.isFavourite) {
    addToFavouriteNode.innerHTML = "➖ Remove From Favourites";
    favIconNode.style.visibility = "visible";
  } else {
    addToFavouriteNode.innerHTML = "➕ Add To Favourites";
    favIconNode.style.visibility = "hidden";
  }
  addToFavouriteNode.setAttribute("class", "utilityBtn");
  quesDivNode.appendChild(addToFavouriteNode);

  leftDivQuesPanelNode.appendChild(quesDivNode);

  //* adding click event listener on quesDivNode
  quesDivNode.onclick = questionClickHandler(question);

  //* adding click event listener on addToFavouriteNode
  addToFavouriteNode.addEventListener(
    "click",
    toggleFavouriteQuesHandler(question)
  );
}

//! display question in right div ques panel node
function appendQuesToRightDivQuesPanel(question) {
  const quesDivNode = document.createElement("div");
  quesDivNode.setAttribute("class", "dynamicNode");

  const quesSubjectNode = document.createElement("h2");
  quesSubjectNode.innerHTML = question.subject;
  quesDivNode.appendChild(quesSubjectNode);

  const quesDescriptionNode = document.createElement("p");
  quesDescriptionNode.innerHTML = question.description;
  quesDivNode.appendChild(quesDescriptionNode);

  rightDivQuesPanelNode.appendChild(quesDivNode);
}

//! handler for add comment button
function addCommentHandler(question) {
  return function () {
    let response = {
      id: generateUniqueId(),
      name: commentorNameNode.value,
      description: commentDescriptionNode.value,
      upvotes: 0,
      downvotes: 0,
      createdAt: Date.now() /* for time in ms */,
      isFavourite: false,
    };

    if (response.name !== "" && response.description !== "") {
      saveResponseInServer(question, response, function () {
        appendResponseToRightDivResponsePanelNode(response, question);
        clearResponseForm();
      });
    }
  };
}

//! append response in right div response panel
function appendResponseToRightDivResponsePanelNode(response, question) {
  const commentDivNode = document.createElement("div");
  commentDivNode.setAttribute("id", response.id);
  commentDivNode.setAttribute("class", "dynamicNode");

  const commentHeadingNode = document.createElement("div");
  commentHeadingNode.setAttribute("id", "commentHeadingNode");

  const commentorNameNode = document.createElement("h3");
  commentorNameNode.innerHTML = response.name;
  commentHeadingNode.appendChild(commentorNameNode);

  const favIconNode = document.createElement("i");
  favIconNode.setAttribute("class", "fas fa-star fa-lg icon");
  commentHeadingNode.appendChild(favIconNode);

  commentDivNode.appendChild(commentHeadingNode);

  const commentDescriptionNode = document.createElement("p");
  commentDescriptionNode.innerHTML = response.description;
  commentDivNode.appendChild(commentDescriptionNode);

  const commentUpvotesNode = document.createElement("p");
  commentUpvotesNode.innerHTML = "Upvotes: " + response.upvotes;
  commentDivNode.appendChild(commentUpvotesNode);

  const commentDownvotesNode = document.createElement("p");
  commentDownvotesNode.innerHTML = "Downvotes: " + response.downvotes;
  commentDivNode.appendChild(commentDownvotesNode);

  const createdAtNode = document.createElement("p");
  createdAtNode.innerHTML =
    "Created At: " + new Date(response.createdAt).toLocaleString();
  commentDivNode.appendChild(createdAtNode);

  const timestampNode = document.createElement("p");
  timestampNode.innerHTML =
    "Created: " +
    updateAndConvertTime(timestampNode)(response.createdAt) +
    " ago ";
  commentDivNode.appendChild(timestampNode);

  const commentUtilityBtnNode = document.createElement("div");
  commentUtilityBtnNode.setAttribute("id", "commentUtilityBtnNode");

  const commentUpvoteBtn = document.createElement("button");
  commentUpvoteBtn.innerHTML = "⬆️ Upvote";
  commentUpvoteBtn.setAttribute("class", "utilityBtn");
  commentUtilityBtnNode.appendChild(commentUpvoteBtn);

  const commentDownvoteBtn = document.createElement("button");
  commentDownvoteBtn.innerHTML = "⬇️ Downvote";
  commentDownvoteBtn.setAttribute("class", "utilityBtn");
  commentUtilityBtnNode.appendChild(commentDownvoteBtn);

  const addToFavouriteBtn = document.createElement("button");
  if (response.isFavourite) {
    addToFavouriteBtn.innerHTML = "➖ Remove From Favourites";
    favIconNode.style.visibility = "visible";
  } else {
    addToFavouriteBtn.innerHTML = "➕ Add To Favourites";
    favIconNode.style.visibility = "hidden";
  }
  addToFavouriteBtn.setAttribute("class", "utilityBtn");
  commentUtilityBtnNode.appendChild(addToFavouriteBtn);

  const commentDeleteBtn = document.createElement("button");
  commentDeleteBtn.innerHTML = "❌ Delete";
  commentDeleteBtn.setAttribute("class", "utilityBtn");
  commentUtilityBtnNode.appendChild(commentDeleteBtn);

  commentDivNode.appendChild(commentUtilityBtnNode);

  rightDivResponsePanelNode.appendChild(commentDivNode);

  //* add click event listener to upvote, downvote, addToFav & delete button
  commentUpvoteBtn.onclick = commentUpvoteHandler(response, question);
  commentDownvoteBtn.onclick = commentDownvoteHandler(response, question);
  addToFavouriteBtn.onclick = addToFavouriteHandler(response, question);
  commentDeleteBtn.onclick = commentDeleteHandler(response, question);
}

//! upvote response
function commentUpvoteHandler(response, question) {
  return function () {
    response.upvotes++;
    updateQuesInServer(question);
    updateResponseUI(response);
  };
}

//! downvote resposne
function commentDownvoteHandler(response, question) {
  return function () {
    response.downvotes++;
    updateQuesInServer(question);
    updateResponseUI(response);
  };
}

//! toggle favourite btn on response
function addToFavouriteHandler(response, question) {
  return function () {
    response.isFavourite = !response.isFavourite;
    updateQuesInServer(question);
    updateResponseUI(response);
  };
}

//! delete response
function commentDeleteHandler(response, question) {
  return function () {
    deleteResFromServer(response, question);
    removeResFromRightDivResPanel(response);
  };
}

//! update selected response UI
function updateResponseUI(response) {
  //* get response container from DOM
  let resContainerNode = document.getElementById(response.id);
  console.log(resContainerNode);
  resContainerNode.childNodes[2].innerHTML = "Upvotes: " + response.upvotes;
  resContainerNode.childNodes[3].innerHTML = "Downvotes: " + response.downvotes;
  if (response.isFavourite) {
    resContainerNode.childNodes[6].childNodes[2].innerHTML =
      "➖ Remove From Favourites";
    resContainerNode.childNodes[0].childNodes[1].style.visibility = "visible";
  } else {
    resContainerNode.childNodes[6].childNodes[2].innerHTML =
      "➕ Add To Favourites";
    resContainerNode.childNodes[0].childNodes[1].style.visibility = "hidden";
  }
}

//! upvote ques
function quesUpvoteHandler(question) {
  return function () {
    question.upvotes++;
    updateQuesInServer(question);
    updateQuestionUI(question);
  };
}

//! downvote ques
function quesDownvoteHandler(question) {
  return function () {
    question.downvotes++;
    updateQuesInServer(question);
    updateQuestionUI(question);
  };
}

//! toggleFavouriteQuesHandler
function toggleFavouriteQuesHandler(question) {
  return function (event) {
    event.stopPropagation();

    question.isFavourite = !question.isFavourite;
    updateQuesInServer(question);
    updateQuestionUI(question);
  };
}

//! listen for click on resolve btn
function quesResolveHandler(selectedQuestion) {
  return function () {
    deleteQuesFromServer(selectedQuestion);
    removeQuesFromLeftDivQuesPanel(selectedQuestion);
    hideResponseForm();
    displayQuestionForm();
  };
}

//! update selected question UI after upvote/downvote/favourite
function updateQuestionUI(question) {
  //* get question container from DOM
  let quesContainerNode = document.getElementById(question.id);
  console.log(quesContainerNode.childNodes[0].childNodes[1]);
  quesContainerNode.childNodes[2].innerHTML = "Upvotes: " + question.upvotes;
  quesContainerNode.childNodes[3].innerHTML =
    "Downvotes: " + question.downvotes;
  if (question.isFavourite) {
    quesContainerNode.childNodes[6].innerHTML = "➖ Remove From Favourites";
    quesContainerNode.childNodes[0].childNodes[1].style.visibility = "visible";
  } else {
    quesContainerNode.childNodes[6].innerHTML = "➕ Add To Favourites";
    quesContainerNode.childNodes[0].childNodes[1].style.visibility = "hidden";
  }
}

//! listen for click on question and display in right panel
function questionClickHandler(question) {
  //* using closure so we can access question variable
  return function () {
    //* hide right div question form
    hideQuestionForm();

    //* clear previous question details & response details
    rightDivQuesPanelNode.innerHTML = "";
    rightDivResponsePanelNode.innerHTML = "";

    //* display resposne form
    displayResponseForm();

    //* display question details in right div question panel
    appendQuesToRightDivQuesPanel(question);

    //* show all previous responses

    let responses = question.responses;

    //* sort all res aq to upvotes
    responses = responses.sort(function (currentRes, nextRes) {
      if (currentRes.upvotes > nextRes.upvotes) {
        return -1;
      }

      return 1;
    });

    //* sort all res aq to favourite
    responses = responses.sort(function (currentRes, nextRes) {
      if (currentRes.isFavourite) {
        return -1;
      }

      return 1;
    });

    responses.forEach(function (response) {
      appendResponseToRightDivResponsePanelNode(response, question);
    });

    //* add click event listener on response, upvote & downvote button
    resolveBtnNode.onclick = quesResolveHandler(question);
    upvoteBtnNode.onclick = quesUpvoteHandler(question);
    downvoteBtnNode.onclick = quesDownvoteHandler(question);

    //* add click event listener on add comment button
    addCommentBtnNode.onclick = addCommentHandler(question);
  };
}

//! setInterval & Update time
function updateAndConvertTime(element) {
  return function (time) {
    setInterval(function () {
      element.innerHTML = "Created: " + timePassedSinceCreation(time) + " ago ";
    }, 1000);

    return timePassedSinceCreation(time);
  };
}

//! calculate time passed since creation of question/response
function timePassedSinceCreation(creationTime) {
  let currentTime = Date.now();
  let timePassed = currentTime - new Date(creationTime).getTime();

  let time = parseInt(timePassed / 1000);

  let hours = Math.floor(time / 3600);
  let minutes = Math.floor((time - hours * 3600) / 60);
  let seconds = time - hours * 3600 - minutes * 60;

  if (seconds < 10 || seconds == 0) {
    seconds = "0" + seconds;
  }
  if (minutes < 10 || minutes == 0) {
    minutes = "0" + minutes;
  }
  if (hours < 10 || hours == 0) {
    hours = "0" + hours;
  }

  if (hours == 0 && minutes == 0) {
    return " a few seconds ";
  } else if (hours == 0) {
    return minutes + " minute " + seconds + " seconds";
  } else {
    return hours + " hour " + minutes + " minutes " + seconds + " seconds";
  }
}

//! clear question form
function clearRightDivQuesForm() {
  questionSubjectNode.value = "";
  questionDescriptionNode.value = "";
}

//! clear response form
function clearResponseForm() {
  commentorNameNode.value = "";
  commentDescriptionNode.value = "";
}

//! clear all questions in left div ques panel
function clearLeftDivQuesPanel() {
  leftDivQuesPanelNode.innerHTML = "";
}

//! print No match found if no ques matches search text
function printNoMatchFound() {
  let msgNode = document.createElement("h2");
  msgNode.innerHTML = "No Matches Found!";
  leftDivQuesPanelNode.appendChild(msgNode);
}

//! remove ques form left div ques panel
function removeQuesFromLeftDivQuesPanel(selectedQuestion) {
  let quesContainerNode = document.getElementById(selectedQuestion.id);

  leftDivQuesPanelNode.removeChild(quesContainerNode);
}

//! remove res from right div res panel
function removeResFromRightDivResPanel(selectedResponse) {
  let resContainerNode = document.getElementById(selectedResponse.id);

  rightDivResponsePanelNode.removeChild(resContainerNode);
}

//! display question form
function displayQuestionForm() {
  rightDivQuesFormNode.style.display = "block";
}

//! hide question form
function hideQuestionForm() {
  rightDivQuesFormNode.style.display = "none";
}

//! display resposne form
function displayResponseForm() {
  rightDivResponseFormNode.style.display = "block";
}

//! hide response form
function hideResponseForm() {
  rightDivResponseFormNode.style.display = "none";
}

//! Function to Generate Unique ID
function generateUniqueId() {
  return JSON.stringify(Math.floor(Math.random() * Date.now()));
}

//# CRUD in Server

//! get all ques from server
function getAllQuesFromServer(onResponseFromServer) {
  let request = new XMLHttpRequest();
  request.open("GET", "https://storage.codequotient.com/data/get");
  request.send();
  request.addEventListener("load", function (event) {
    let getRequestResponseData = JSON.parse(event.target.responseText);
    let allQuesStoredInServer = JSON.parse(getRequestResponseData.data);
    if (allQuesStoredInServer == null) {
      allQuesStoredInServer = [];
    }
    console.log(
      "All Ques Retrieved from Server Successfully",
      allQuesStoredInServer
    );
    onResponseFromServer(allQuesStoredInServer);
  });
}

//! add new ques in server
function addNewQuesInServer(question, onQuesSaveInServer) {
  //* get all qiestions first and push the new qurstion and then store again in server the updated array of questions
  getAllQuesFromServer(function (allQuesStoredInServer) {
    allQuesStoredInServer.push(question);

    let postObj = {
      data: JSON.stringify(allQuesStoredInServer),
    };

    let postData = JSON.stringify(postObj);

    let request = new XMLHttpRequest();
    request.open("POST", "https://storage.codequotient.com/data/save");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(postData);
    request.addEventListener("load", function (event) {
      console.log(
        "New Ques Added in Server Successfully: ",
        JSON.parse(event.target.responseText)
      );
      onQuesSaveInServer();
    });
  });
}

//! save all ques in server
function saveAllQuesInServer(allQues) {
  let postObj = {
    data: JSON.stringify(allQues),
  };

  let postData = JSON.stringify(postObj);

  let request = new XMLHttpRequest();
  request.open("POST", "https://storage.codequotient.com/data/save");
  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.send(postData);
  request.addEventListener("load", function (event) {
    console.log(
      "Updated Set of Ques Saved in Server Successfully: ",
      JSON.parse(event.target.responseText)
    );
  });
}

//! save response in server
function saveResponseInServer(
  selectedQuestion,
  response,
  onResponseSaveInServer
) {
  //* get all qiestions first and push the updated qurstion and then store again in storage
  console.log("sel ques", selectedQuestion);
  getAllQuesFromServer(function (allQuesStoredInServer) {
    console.log("all ques prev", allQuesStoredInServer);

    let updatedQues = allQuesStoredInServer.map(function (ques) {
      if (ques.id === selectedQuestion.id) {
        ques.responses.push(response);
      }
      return ques;
    });

    console.log("all ques now", updatedQues);

    saveAllQuesInServer(updatedQues);
    onResponseSaveInServer();
  });
}

//! update ques in server
function updateQuesInServer(updatedQuestion) {
  getAllQuesFromServer(function (allQuesStoredInServer) {
    let revisedQuestions = allQuesStoredInServer.map(function (ques) {
      if (updatedQuestion.id === ques.id) {
        return updatedQuestion;
      }

      return ques;
    });

    saveAllQuesInServer(revisedQuestions);
  });
}

//! remove ques from server
function deleteQuesFromServer(selectedQuestion) {
  getAllQuesFromServer(function (allQuesStoredInServer) {
    let revisedQuestions = allQuesStoredInServer.filter(function (ques) {
      if (selectedQuestion.id === ques.id) {
        return false;
      }
      return true;
    });

    saveAllQuesInServer(revisedQuestions);
  });
}

//! remove res from server
function deleteResFromServer(response, selectedQuestion) {
  console.log("before", selectedQuestion);
  let revisedResponses = selectedQuestion.responses.filter(function (res) {
    if (response.id === res.id) {
      return false;
    }
    return true;
  });

  selectedQuestion.responses = revisedResponses;
  updateQuesInServer(selectedQuestion);
}
