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
    this.setState( _.assign({}, this.state, {board: cards}));
  }

  updateBoard(board, newCard, index) {
    let newBoard = board.slice();
    newBoard.splice(index, 1, newCard);
    return newBoard;
  }

  flip(index) {
    let cardToFlip = this.state.board[index];
    let newCard = new Card(cardToFlip.value, !cardToFlip.hidden);
    let newBoard = this.updateBoard(this.state.board, newCard, index);
    this.setState( _.assign({}, this.state, { board: newBoard }));
  }

  checkMatch(currentCard, currIndex) {
    let known = this.state.revealed;
    if (known.length == 0) {
	    console.log("block1");
       this.setState(_.assign({}, this.state, {revealed: [currentCard, currIndex]}));
    }
    else if (known[0].value == currentCard.value
	    && currIndex != known[1]) {
       console.log("block2");
       let score2 = Math.max(0, this.state.score + 100 - 10 * this.state.penalty);
       let newCard1 = new Card(currentCard.value, null);
       let newCard2 = new Card(known[0].value, null);
       let newBoard = this.updateBoard(this.updateBoard(
	       this.state.board, newCard1, currIndex), newCard2, known[1]);
       this.setState(_.assign({}, this.state,
	       {revealed: [], score: score2, board: newBoard, penalty: 0}));
    }
    else {
       let penalty2 = this.state.penalty + 1;
	    //TODO maybe wait a lil
       this.flip(currIndex);
       this.flip(known[1]);
       this.setState(_.assign({}, this.state, {penalty: penalty2, revealed: []}));
    }
  }

  move(card, cardIndex) {
    this.flip(cardIndex);
    this.checkMatch(card, cardIndex);
  }

  render() {
    let cards = _.map(this.state.board, (card, ii) => {
      return <RenderedCard card={card} move={this.move.bind(this)} key={ii} index={ii} />;
    });
    return (
      <div>
	    <h1>Memory Game</h1>
	    <button onClick={this.randomize.bind(this)}>New Game</button>
	    <p>{this.state.score}</p>
	    <ul>
	    {cards}
	    </ul>
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
	//TODO SWITCH statement
  if (card.hidden == null) return <li class="revealed">{card.value}</li>;
  if (card.hidden == true) return <li class="hidden" onClick={() => props.move(card, props.index)}>&nbsp;</li>;
  else return <li class="revealed" onClick={() => props.move(card, props.index)}>{card.value}</li>
}
