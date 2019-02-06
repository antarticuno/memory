import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root, channel) {
  ReactDOM.render(<Memory channel={channel} />, root);
}

class Memory extends React.Component {
  constructor(props) {
    super(props);
    this.channel = props.channel;
    this.state = { score: 0, player_board: [],};
    
    this.channel
	.join()
	.receive("ok", this.got_view.bind(this))
	.receive("error", resp => {console.log("Unable to join", resp);});
  }

  got_view(view) {
    console.log("new view", view);
    this.setState(view.game);
  }

  on_flip(ev) {
    this.channel.push("flip", {card: ev.target.id})
	  .receive("ok", this.got_view.bind(this));
  }

  on_new(ev) {
    this.channel.push("new", {})
	  .receive("ok", this.got_view.bind(this));
  }

  render() {
    let cards = _.map(this.state.player_board, (card, ii) => {
      return <RenderedCard card={card} key={ii} index={ii} on_flip={this.on_flip.bind(this)} />;
    });
    return (
      <div>
	    <h1>Memory Game</h1>
	    <p>Score: {this.state.score}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;       
	    <button onClick={this.on_new.bind(this)}>New Game</button></p>
	    <div id="container">
	    <ul>
	    {cards}
	    </ul>
	    </div>
      </div>
    );
  }
}

function RenderedCard(props) {
  let {card, index, on_flip} = props;
  if (card.length > 0) return <li id={index} className="revealed">{card}</li>;
  else return <li id={index} onClick={on_flip} className="hidden">&nbsp;&nbsp;&nbsp;</li>;
}
