let user_id = 0
let game_id = 0
let badDiv = document.getElementById("background")
const highscoresUl = document.getElementById("highscoreUl")
const allTimeHighScoresUl = document.getElementById("allTimeHighScoresUl")

   document.addEventListener("DOMContentLoaded", function(){
        fetchComments()
        allTimeScores()
        
        createUserForm = document.getElementById("userForm")
        createUserForm.addEventListener("submit", createUser)
        createCommentForm = document.getElementById("createCommentForm")
        createCommentForm.addEventListener("submit", createComment)
        console.log("THis is my score", score)
        console.log("This is my user id", user_id )
        console.log("This is my game id", game_id)
        document.body.style.zoom = 1

   
    })

    function saveGame(){
        let newGame = {"user_id": user_id, "score": score}

        fetch("http://localhost:3000/api/v1/games", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(newGame)
          }).then (res => res.json())
          .then(res => {
              console.log("This is my game", res)
              game_id = res.id
          }).then(fetchGames())


    }

    function createUser(e){
        e.preventDefault()
        
        userNameInput = document.getElementById("userNameInput")
        emailInput = document.getElementById("emailInput")
        let newUser = {"username": userNameInput.value, "email": emailInput.value}

        fetch("http://localhost:3000/api/v1/users", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(newUser)
          }).then (res => res.json())
            .then(res => {
              console.log("This is my user", res)
              user_id = res.id
              console.log("This is my user id", user_id)
          }).then(e.target.reset())
          .then(alert("New user created!"))
    }

    function fetchComments(){
        fetch("http://localhost:3000/api/v1/comments")
        .then(res => res.json())
        .then(data => {populateComments(data)})
    }

    function populateComments(comments){
        comments.forEach(comment => {populateComment(comment)
        })
    }


    function populateComment(comment){
        const commentUl = document.getElementById("commentUl")
        const li = document.createElement("li")
        li.className = "list-group-item"
        li.innerText = comment.user.username + ":" + comment.content
        commentUl.append(li)
    }

    function createComment(e){
        e.preventDefault()
        if (user_id === 0 || game_id === 0) {
            alert("You must create a user and play a game to leave a comment!")
        } else {
        const commentInput = document.getElementById("commentContentInput")
        let newComment = {"content": commentInput.value, "user_id": user_id, "game_id": game_id}
        
        fetch("http://localhost:3000/api/v1/comments", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(newComment)
          }).then(e.target.reset())
          .then(alert("New comment created!"))
          
        }
    }

    function fetchGames(){
        fetch("http://localhost:3000/api/v1/games")
        .then(res => res.json())
        .then(data => {populateGames(data)})
        
    }

    function populateGames(games){
        highscoresUl.innerHTML = ""
        games.forEach(game => {populateGame(game)
            console.log(game)
        })
    }

    function populateGame(game){
        if (game.user_id === user_id) {
            const li = document.createElement("li")
            li.innerText = game.score
            highscoresUl.append(li)
    }
}

    function allTimeScores() {
        fetch("http://localhost:3000/api/v1/games")
        .then(res => res.json())
        .then(data => {allTimeScoresIteration(data)
        })
    }

    function allTimeScoresIteration(games) {
        allTimeHighScoresUl.innerHTML = ""
        let allScores = []

        games.forEach(function (game){
            // console.log(game)
            let hash = ({score: game.score, name: game.user.username})
            allScores.push(hash)
        })
        let bestScores = allScores.sort(function (a,b){
            return b.score - a.score;
        })

        for(let i=0; i < 10; i++){
            const li = document.createElement("li")
            li.innerText = bestScores[i].score + " - " + bestScores[i].name.split(" ")[0]
            allTimeHighScoresUl.append(li)
        }
    }

