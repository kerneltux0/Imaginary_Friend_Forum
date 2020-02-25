// Copyright 2019, Ryan Sise

// This file is part of Podcast Interview Manager.

// Podcast Interview Manager is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Podcast Interview Manager is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Podcast Interview Manager.  If not, see <https://www.gnu.org/licenses/>.

const friendList = document.querySelector('#friends-list');
const friendIndexURL = 'https://imaginary-friends-forum.herokuapp.com/friends';
const friendName = document.querySelector("#friend-name");
const friendSpecies = document.querySelector("#friend-species");
const friendDescription = document.querySelector("#friend-description");
const friendEntryForm = document.querySelector('#friend-form');

document.addEventListener("DOMContentLoaded", function(){
  fetchFriends();
});


class Friend{
  constructor(id,name,species,description,likes,comments){
    this.id = id;
    this.name = name;
    this.species = species;
    this.description = description;
    this.likes = likes;
    this.comments = comments
  };
};

friendEntryForm.addEventListener('submit',function(event){
  event.preventDefault();
  const formData = {
    name: friendName.value,
    species: friendSpecies.value,
    description: friendDescription.value
  };

  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(formData)
  };

  fetch(friendIndexURL,config)
  .then(function(response){
    return response.json();
  })
  .then(function(json){
    renderFriends(json);
  })
})


function fetchFriends(){
  fetch(friendIndexURL)
  .then(function(response){
    return response.json()
  })
  .then(function(json){
    json.forEach(function(element,index){
      fetch(`${friendIndexURL}/${index+1}`)
      .then(function(response){
        return response.json()
      })
      .then(function(friend){
        friendContainer = new Friend(friend.id,friend.name,friend.species,friend.description,friend.likes,friend.comments);
        renderFriends(friendContainer);
      })
    });
  });
};


function renderFriends(friend){
  const friendTitle = document.createElement('h4');
  const friendDesc = document.createElement('p');
  const friendSpecies = document.createElement('p');
  const friendDiv = document.createElement('div');
  const commentSection = document.createElement('div');
  const likes = document.createElement('p');
  const likesSection = document.createElement('div');
  const likesButton = document.createElement('button');
  const commentForm = document.createElement('form');
  const commentInput = document.createElement('textarea');
  const commentSubmit = document.createElement('input');
  
  friendList.appendChild(friendDiv);
  friendDiv.setAttribute('class','friend-entry');
  friendSpecies.innerText = `Species: ${friend.species}`;
  friendDesc.innerText = `Description: ${friend.description}`;
  friendTitle.innerText = friend.name;

  friendDiv.appendChild(friendTitle);
  friendTitle.setAttribute('class','friend-title');
  friendDiv.appendChild(friendSpecies);
  friendSpecies.setAttribute('class','friend-species');
  friendDiv.appendChild(friendDesc);
  friendDesc.setAttribute('class','friend-description');

  likesSection.setAttribute('class','friend-likes');
  friendDiv.appendChild(likesSection);
  likes.innerText = friend.likes;
  likesSection.appendChild(likes);
  likesButton.setAttribute('class','likes-button');
  likesButton.innerText = "Like";
  likesButton.id = friend.id;
  likesSection.appendChild(likesButton);

  friendDiv.appendChild(commentSection);
  commentSection.setAttribute('class','friend-comments');
  commentForm.setAttribute('class','submit-comment');
  commentInput.setAttribute('rows','5');
  commentInput.setAttribute('cols','30');
  commentSubmit.setAttribute('type','submit');
  commentSubmit.setAttribute('value','Add Comment');
  commentForm.id = friend.id;
  commentForm.appendChild(commentInput);
  commentForm.appendChild(commentSubmit);
  commentSection.appendChild(commentForm);

  likesButton.addEventListener("click", (event) => {
    const updateURL = `${friendIndexURL}/${event.target.id}`;
    const updateConfig = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        likes: parseInt(likes.innerText,10)+1
      })
    };
    fetch(updateURL,updateConfig)
    .then(function(response){
      return response.json();
    })
    .then(function(json){
      likes.innerText = json.likes;
    });
  });

  commentForm.addEventListener('submit',(event)=>{
    event.preventDefault();
    const updateURL = `${friendIndexURL}/${event.target.id}`;
    const updateConfig = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        comment: commentInput.value
      })
    };
    fetch(updateURL,updateConfig)
    .then(function(response){
      return response.json();
    })
    .then(function(json){
      const commentText = document.createElement('p');
      commentSection.appendChild(commentText);
      commentText.innerText=event.target.firstElementChild.value
    });
  });

  
    friend.comments.forEach(function(element){
      const commentText = document.createElement('p');
      commentSection.appendChild(commentText);
      commentText.innerText=element.content;
    })
  
};


