import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root) {
  ReactDOM.render(<Starter />, root);
}

class Starter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { score: 0, revealed: [], penalty: 0,  board: [],};
  }

  randomize() {
    let numCards = 16;
    let cards = [];
    for (let i = 0; i < numCards / 2; i++) {
       cards.push(new Card(String.fromCharCode(65 + i), true));
       cards.push(new Card(String.fromCharCode(65 + i), true));
    }
    //TODO randomize the cards
    this.setState( _.assign({}, this.state,
	    {board: cards, score: 0, revealed: [], penalty: 0}));
  }

  flip(index, board) {
    let cardToFlip = board[index];
    let newCard = new Card(cardToFlip.value, !cardToFlip.hidden);
    let newBoard = board.slice();
    newBoard.splice(index, 1, newCard);
    return newBoard;
  }

  checkMatch(currIndex) {
    let newBoard = this.flip(currIndex, this.state.board);
    let currentCard = newBoard[currIndex];
    let known = this.state.revealed;
    if (known.length == 0) {
       this.setState(_.assign({}, this.state,
	       {board: newBoard, revealed: [currentCard, currIndex]}));
    }
    else if (known[0].value == currentCard.value
	    && currIndex != known[1]) {
       let score2 = this.state.score + Math.max(0, 100 - 10*this.state.penalty);
       let newCard1 = new Card(currentCard.value, null);
       let newCard2 = new Card(known[0].value, null);
       newBoard.splice(currIndex, 1, newCard1);
       newBoard.splice(known[1], 1, newCard2);
       this.setState(_.assign({}, this.state,
	       {revealed: [], score: score2, board: newBoard, penalty: 0}));
    }
    else if (known[0].value != currentCard.value) {
       let penalty2 = this.state.penalty + 1;
       this.setState(_.assign({}, this.state,
	       {penalty: penalty2, revealed: [], board: newBoard}));
       setTimeout(() => {
         let newBoard2 = this.flip(currIndex, this.state.board);
         let newBoard3 = this.flip(known[1], newBoard2);
         this.setState(_.assign({}, this.state, {board: newBoard3}));
       },1000)
    }
  }

  render() {
    let cards = _.map(this.state.board, (card, ii) => {
      return <RenderedCard card={card}  checkMatch={this.checkMatch.bind(this)} key={ii} index={ii} />;
    });
    return (
      <div>
	    <h1>Memory Game</h1>
	    <p>Score: {this.state.score}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;       
	    <button onClick={this.randomize.bind(this)}>New Game</button></p>
	    <div id="container">
	    <ul>
	    {cards}
	    </ul>
	    </div>
      </div>
    );
  }
}

class Card {
  constructor(cardVal, hidden) {
    this.value = cardVal;
    this.hidden = hidden;
  }
}

function RenderedCard(props) {
  let card = props.card;
  switch (card.hidden) {
    case null:
      return <li class="revealed">{card.value}</li>;
    case true:
      return <li class="hidden" onClick={() => props.checkMatch(props.index)}>&nbsp;&nbsp;&nbsp;</li>;
    default:
      return <li class="revealed" onClick={() => props.checkMatch(props.index)}>{card.value}</li>
  }
}
